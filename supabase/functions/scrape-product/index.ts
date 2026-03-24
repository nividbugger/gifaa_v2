const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  title: string | null;
  price: number | null;
  image: string | null;
  description: string | null;
}

interface ScrapeResult {
  success: boolean;
  data?: ProductData;
  error?: string;
  fallback?: boolean;
  message?: string;
}

const TOTAL_TIMEOUT_MS = 45000;

// Bad title patterns - resort to URL extraction instead
const BAD_TITLE_PATTERNS = [
  /^not available$/i,
  /^blocked$/i,
  /^access denied$/i,
  /^page not found$/i,
  /^error$/i,
  /^403/i,
  /^404/i,
  /^sorry/i,
  /^robot/i,
  /^captcha/i,
  /^verify/i,
  /^just a moment/i,
  /^attention required/i,
  /^cloudflare/i,
  /^please wait/i,
  /^loading/i,
  /^untitled/i,
  /^null$/i,
  /^undefined$/i,
  /^n\/a$/i,
  /^none$/i,
  /^site maintenance/i,
  /^maintenance/i,
  /^under construction/i,
  /^coming soon/i,
  /^temporarily unavailable/i,
  /^service unavailable/i,
  /^forbidden/i,
  /^unauthorized/i,
  /^sign in/i,
  /^log in/i,
  /^login/i,
  /^enable javascript/i,
  /^enable cookies/i,
];

function isBadTitle(title: string | null): boolean {
  if (!title || title.trim().length < 3) return true;
  return BAD_TITLE_PATTERNS.some(p => p.test(title.trim()));
}

function extractPrice(text: string): number | null {
  // Collect ALL price candidates with their priority
  const allCandidates: { price: number; priority: number }[] = [];
  
  // Priority 1: JSON-LD structured data (most reliable)
  const jsonLdPatterns = [
    /"price"\s*:\s*"?([\d,]+(?:\.\d{2})?)"?/gi,
    /"lowPrice"\s*:\s*"?([\d,]+(?:\.\d{2})?)"?/gi,
    /"offerPrice"\s*:\s*"?([\d,]+(?:\.\d{2})?)"?/gi,
  ];
  
  for (const pattern of jsonLdPatterns) {
    for (const match of text.matchAll(pattern)) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price >= 10 && price < 10000000) {
        allCandidates.push({ price, priority: 1 });
      }
    }
  }
  
  // Priority 2: Labeled sale/offer prices
  const salePricePatterns = [
    /(?:sale|offer|deal|special|our|discounted)\s*price[:\s]*₹?\s*([\d,]+(?:\.\d{2})?)/gi,
    /now[:\s]*₹\s*([\d,]+(?:\.\d{2})?)/gi,
  ];
  
  for (const pattern of salePricePatterns) {
    for (const match of text.matchAll(pattern)) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price >= 10 && price < 10000000) {
        allCandidates.push({ price, priority: 2 });
      }
    }
  }
  
  // Priority 3: Currency symbol prices (₹, Rs, INR)
  const currencyPatterns = [
    /₹\s*([\d,]+(?:\.\d{2})?)/g,
    /Rs\.?\s*([\d,]+(?:\.\d{2})?)/gi,
    /INR\s*([\d,]+(?:\.\d{2})?)/gi,
  ];
  
  for (const pattern of currencyPatterns) {
    for (const match of text.matchAll(pattern)) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price >= 10 && price < 10000000) {
        allCandidates.push({ price, priority: 3 });
      }
    }
  }
  
  // Priority 4: Labeled price/MRP
  const labelPatterns = [
    /Price[:\s]*₹?\s*([\d,]+(?:\.\d{2})?)/gi,
    /MRP[:\s]*₹?\s*([\d,]+(?:\.\d{2})?)/gi,
  ];
  
  for (const pattern of labelPatterns) {
    for (const match of text.matchAll(pattern)) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(price) && price >= 10 && price < 10000000) {
        allCandidates.push({ price, priority: 4 });
      }
    }
  }
  
  if (allCandidates.length === 0) return null;
  
  // Sort by priority, then among same priority prefer the MOST COMMON price
  // (product pages often repeat the actual price multiple times)
  // Also prefer higher prices as small numbers are often EMI/delivery fees
  const priceCounts: Record<number, number> = {};
  for (const c of allCandidates) {
    priceCounts[c.price] = (priceCounts[c.price] || 0) + 1;
  }
  
  allCandidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    // Among same priority, prefer most frequently occurring price
    const aCount = priceCounts[a.price] || 0;
    const bCount = priceCounts[b.price] || 0;
    if (aCount !== bCount) return bCount - aCount;
    // Tie-break: prefer higher price (more likely product price vs EMI/fee)
    return b.price - a.price;
  });
  
  console.log('Price candidates:', JSON.stringify(allCandidates.slice(0, 5)));
  return allCandidates[0].price;
}

function cleanTitle(title: string | null): string | null {
  if (!title) return null;
  
  let cleaned = title
    .replace(/\s*[-|–—:]\s*(Amazon\.in|Amazon|Flipkart\.com|Flipkart|Myntra|Nykaa|Ajio|Buy Online).*$/i, '')
    .replace(/\s+Online at Best Price.*$/i, '')
    .replace(/\s*:\s*Buy\s+.*$/i, '')
    .replace(/\s*\|\s*.*$/i, '')
    .replace(/^\s*Amazon\.in\s*[-:]/i, '')
    .replace(/\s*-\s*Amazon\.in\s*$/i, '')
    .replace(/^#+\s*/, '')
    .replace(/Click the button below.*/i, '')
    .replace(/\([\d\s]+GB.*?\)/i, '')
    .trim();
    
  if (isBadTitle(cleaned)) return null;
  
  return cleaned;
}

// Check if a URL is likely a real product image vs tracking pixel
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('http')) return false;
  if (url.length > 600) return false;
  
  const blockPatterns = [
    'fls-', 'fls.', 'oc-csi', 'pixel', 'beacon', 'tracking', 'analytics',
    '1x1', 'spacer', 'blank.', 'transparent.', 'uedata', 'batch/1/OP',
    'amazon.in/1/', 'amazon.com/1/', '/gp/r.html', '/ref=', 'count.gif',
    'doubleclick', 'googlesyndication', 'facebook.com/tr', 'clarity.ms',
  ];
  
  for (const p of blockPatterns) {
    if (url.includes(p)) return false;
  }
  
  return true;
}

function isProductImageUrl(url: string): boolean {
  if (!isValidImageUrl(url)) return false;
  // Has image extension OR comes from known CDNs
  if (/\.(jpg|jpeg|png|webp|gif|avif)/i.test(url)) return true;
  if (/m\.media-amazon\.com\/images/i.test(url)) return true;
  if (/rukminim/i.test(url)) return true;
  if (/cloudfront\.net/i.test(url)) return true;
  if (/cdn\./i.test(url)) return true;
  if (/images?\//i.test(url)) return true;
  return false;
}

// Deep search for image URLs in any nested object
function deepFindImages(obj: any, depth = 0, fromImageKey = false): string[] {
  if (depth > 5 || !obj) return [];
  const images: string[] = [];

  if (typeof obj === 'string') {
    // If we're inside a known image key, be more lenient
    if (fromImageKey && isValidImageUrl(obj)) {
      images.push(obj);
    } else if (isProductImageUrl(obj)) {
      images.push(obj);
    }
    return images;
  }

  if (Array.isArray(obj)) {
    for (const item of obj.slice(0, 20)) {
      images.push(...deepFindImages(item, depth + 1, fromImageKey));
    }
    return images;
  }

  if (typeof obj === 'object') {
    const imageKeys = new Set([
      'image', 'ogimage', 'og:image', 'productimage', 'mainimage',
      'heroimage', 'primaryimage', 'thumbnailurl', 'thumbnail',
      'imageurl', 'image_url', 'img', 'photo',
      'highresolutionimages', 'gallerythumbnails', 'images',
      'productimages', 'media', 'photos', 'gallery',
      'screenshot', 'imagesrc', 'src', 'poster',
    ]);

    // Check priority keys first
    for (const key of Object.keys(obj)) {
      const isImgKey = imageKeys.has(key.toLowerCase());
      if (isImgKey) {
        images.push(...deepFindImages(obj[key], depth + 1, true));
      }
    }

    // Then non-image keys (only look for URLs with extensions)
    if (images.length === 0) {
      for (const key of Object.keys(obj)) {
        if (!imageKeys.has(key.toLowerCase())) {
          images.push(...deepFindImages(obj[key], depth + 1, false));
        }
      }
    }
  }

  return images;
}

// Upscale Amazon image URLs to get larger versions
function upscaleImageUrl(url: string): string {
  if (!url) return url;
  // Amazon images: replace size params like _SX38_SY50_ with larger size
  if (url.includes('m.media-amazon.com')) {
    return url.replace(/\._[A-Z]{2}\d+_[A-Z]{2}\d+_[A-Z,0-9_]+_\./g, '._SL500_.')
              .replace(/\._[A-Z]{2}\d+_\./g, '._SL500_.');
  }
  // Flipkart/Rukminim: replace small sizes
  if (url.includes('rukminim')) {
    return url.replace(/\/\d+\/\d+\//g, '/500/500/');
  }
  return url;
}

function extractImageUrl(markdown: string): string | null {
  const patterns = [
    /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/i,
    /(https?:\/\/m\.media-amazon\.com\/images\/I\/[^\s"'\)]+)/i,
    /(https?:\/\/rukminim[^\s"'\)]+)/i,
    /(https?:\/\/[^\s"'\)]+\.(?:jpg|jpeg|png|webp))/i,
  ];
  
  for (const pattern of patterns) {
    const match = markdown.match(pattern);
    if (match && isValidImageUrl(match[1])) return match[1];
  }
  return null;
}

function extractProductInfo(data: any, originalUrl: string): ProductData {
  const result: ProductData = {
    title: null,
    price: null,
    image: null,
    description: null,
  };

  const scraped = data.data || data;
  const metadata = scraped.metadata || {};
  const markdown = scraped.markdown || '';
  const html = scraped.html || scraped.rawHtml || '';

  // Title extraction with bad-title fallback
  result.title = cleanTitle(metadata.ogTitle) || cleanTitle(metadata.title);
  if (isBadTitle(result.title)) {
    result.title = extractNameFromUrl(originalUrl);
  }

  // Image extraction: deep search entire response payload
  const allImages = deepFindImages(data);
  console.log('Deep image search found', allImages.length, 'images');
  
  if (allImages.length > 0) {
    result.image = upscaleImageUrl(allImages[0]);
  } else {
    const mdImage = extractImageUrl(markdown);
    result.image = mdImage ? upscaleImageUrl(mdImage) : null;
  }
  
  // If still no image, use brand favicon
  if (!result.image) {
    result.image = getFaviconUrl(originalUrl);
  }

  // Description
  const desc = metadata.description || metadata.ogDescription;
  if (desc && !isBadTitle(desc)) {
    result.description = desc.length > 200 ? desc.substring(0, 197) + '...' : desc;
  }

  // Price: try markdown first, then html, then full JSON stringified payload
  result.price = extractPrice(markdown);
  if (!result.price && html) {
    result.price = extractPrice(html);
  }
  if (!result.price) {
    // Search the entire JSON payload for price patterns
    const jsonStr = JSON.stringify(data);
    result.price = extractPrice(jsonStr);
  }

  return result;
}

function cleanAmazonUrl(url: string): string {
  const amazonMatch = url.match(/(amazon\.[a-z.]+\/[^\/]+\/dp\/[A-Z0-9]+)/i);
  if (amazonMatch) {
    return `https://www.${amazonMatch[1]}`;
  }
  return url;
}

function extractNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    let segments = pathname.split('/').filter(Boolean);
    
    const dpIndex = segments.findIndex(s => s.toLowerCase() === 'dp');
    if (dpIndex > 0) {
      segments = segments.slice(0, dpIndex);
    }
    
    segments = segments.filter(s => s.toLowerCase() !== 'p');
    // Remove common noise segments
    segments = segments.filter(s => !/^(itm|ip|product|item|buy|shop|store|category|ref=)$/i.test(s));
    // Remove segments that are just IDs (all digits or very short hex)
    segments = segments.filter(s => !/^[a-f0-9]{6,}$/i.test(s) && !/^\d+$/.test(s));
    
    let name = segments.pop() || '';
    
    name = name
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\.(html|php|aspx?)$/i, '')
      .trim();
    
    if (name.length < 3) return null;
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .slice(0, 80);
  } catch {
    return null;
  }
}

function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
  } catch {
    return 'https://www.google.com/s2/favicons?domain=example.com&sz=128';
  }
}

function hasTimedOut(startTime: number): boolean {
  return Date.now() - startTime >= TOTAL_TIMEOUT_MS;
}

function getRemainingTime(startTime: number): number {
  return Math.max(0, TOTAL_TIMEOUT_MS - (Date.now() - startTime));
}

async function tryFirecrawl(url: string, apiKey: string, startTime: number): Promise<ScrapeResult> {
  if (hasTimedOut(startTime)) {
    return { success: false, error: 'timeout' };
  }

  console.log('Trying Firecrawl for:', url);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Math.min(15000, getRemainingTime(startTime)));

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: false,
        waitFor: 3000,
        location: {
          country: 'IN',
          languages: ['en-IN', 'en'],
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('Firecrawl response status:', response.status);
    console.log('Firecrawl metadata keys:', JSON.stringify(Object.keys(data?.data?.metadata || data?.metadata || {})));

    if (!response.ok) {
      const errorMsg = data.error || '';
      if (errorMsg.toLowerCase().includes('access denied') || 
          errorMsg.toLowerCase().includes('blocked') ||
          response.status === 403) {
        return { success: false, error: 'access_denied' };
      }
      return { success: false, error: data.error || 'Scraping failed' };
    }

    const productInfo = extractProductInfo(data, url);
    console.log('Firecrawl extracted:', JSON.stringify(productInfo));

    // Accept result even with URL-fallback title, as long as we got image or price
    if (productInfo.title || productInfo.image || productInfo.price) {
      // Ensure we always have a title
      if (!productInfo.title) {
        productInfo.title = extractNameFromUrl(url) || 'Gift Item';
      }
      return { success: true, data: productInfo };
    }
    
    return { success: false, error: 'no_data' };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Firecrawl request timed out');
      return { success: false, error: 'timeout' };
    }
    console.error('Firecrawl error:', error);
    return { success: false, error: 'firecrawl_error' };
  }
}

async function tryApify(url: string, apiToken: string, startTime: number): Promise<ScrapeResult> {
  if (hasTimedOut(startTime)) {
    return { success: false, error: 'timeout' };
  }

  console.log('Trying Apify for:', url);
  
  try {
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/apify~e-commerce-scraping-tool/runs?token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          additionalProperties: true,
          additionalPropertiesGoogleShopping: true,
          additionalReviewProperties: true,
          detailsUrls: [{ url }],
          scrapeInfluencerProducts: false,
          scrapeProductsFromGoogleShopping: false,
          scrapeReviewsFromGoogleShopping: false,
          scrapeSellersFromGoogleShopping: false,
          scrapeMode: "AUTO",
          countryCode: "in",
          sortReview: "Most recent"
        }),
      }
    );

    if (!runResponse.ok) {
      console.error('Apify run start failed:', runResponse.status);
      return { success: false, error: 'apify_run_failed' };
    }

    const runData = await runResponse.json();
    const runId = runData.data?.id;
    const defaultDatasetId = runData.data?.defaultDatasetId;
    
    if (!runId) {
      return { success: false, error: 'no_run_id' };
    }

    console.log('Apify run started:', runId);

    const pollInterval = 2000;
    
    while (!hasTimedOut(startTime)) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      if (hasTimedOut(startTime)) {
        return { success: false, error: 'timeout' };
      }

      const statusResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${apiToken}`
      );
      
      if (!statusResponse.ok) continue;

      const statusData = await statusResponse.json();
      const status = statusData.data?.status;

      if (status === 'SUCCEEDED') {
        const datasetId = statusData.data?.defaultDatasetId || defaultDatasetId;
        if (!datasetId) return { success: false, error: 'no_dataset' };

        const resultsResponse = await fetch(
          `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}&limit=1`
        );
        
        if (!resultsResponse.ok) return { success: false, error: 'results_fetch_failed' };

        const results = await resultsResponse.json();
        console.log('Apify raw result keys:', results?.[0] ? JSON.stringify(Object.keys(results[0])) : 'empty');

        if (results && results.length > 0) {
          const product = results[0];
          
          // Deep extract price from multiple nested locations
          let price: number | null = null;
          const priceCandidates = [
            product.offers?.price,
            product.offers?.lowPrice,
            product.offers?.highPrice,
            product.price,
            product.currentPrice,
            product.salePrice,
            product.finalPrice,
            product.additionalProperties?.price,
          ];
          
          for (const p of priceCandidates) {
            if (p != null) {
              const parsed = typeof p === 'number' ? p : parseFloat(String(p).replace(/[^0-9.]/g, ''));
              if (!isNaN(parsed) && parsed > 0) {
                price = parsed;
                break;
              }
            }
          }

          // If no structured price, search the full JSON stringification
          if (!price) {
            price = extractPrice(JSON.stringify(product));
          }
          
          // Deep search for images in the entire Apify result
          const allImages = deepFindImages(product);
          let image = allImages.length > 0 ? allImages[0] : getFaviconUrl(url);

          let title = product.name || product.title || null;
          if (isBadTitle(title)) {
            title = extractNameFromUrl(url) || 'Gift Item';
          }

          return {
            success: true,
            data: {
              title,
              price,
              image,
              description: product.description && !isBadTitle(product.description)
                ? product.description.slice(0, 200) 
                : null,
            }
          };
        }
        
        return { success: false, error: 'no_results' };
      }
      
      if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        return { success: false, error: `apify_${status.toLowerCase()}` };
      }
    }

    return { success: false, error: 'timeout' };
  } catch (error) {
    console.error('Apify error:', error);
    return { success: false, error: 'apify_error' };
  }
}

function urlFallback(url: string): ScrapeResult {
  console.log('Using URL fallback for:', url);
  
  const title = extractNameFromUrl(url);
  const image = getFaviconUrl(url);
  
  return {
    success: true,
    data: {
      title: title || 'Gift Item',
      price: null,
      image,
      description: null,
    },
    fallback: true,
    message: 'Product details extracted from URL. Please verify and add price manually.',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (formattedUrl.includes('amazon')) {
      formattedUrl = cleanAmazonUrl(formattedUrl);
    }

    console.log('Scraping product URL:', formattedUrl);

    // Tier 1: Firecrawl
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (firecrawlKey && !hasTimedOut(startTime)) {
      const firecrawlResult = await tryFirecrawl(formattedUrl, firecrawlKey, startTime);
      if (firecrawlResult.success && firecrawlResult.data) {
        // Ensure image fallback
        if (!firecrawlResult.data.image) {
          firecrawlResult.data.image = getFaviconUrl(formattedUrl);
        }
        // Ensure title fallback
        if (isBadTitle(firecrawlResult.data.title)) {
          firecrawlResult.data.title = extractNameFromUrl(formattedUrl) || 'Gift Item';
        }
        console.log('Firecrawl succeeded in', Date.now() - startTime, 'ms');
        return new Response(
          JSON.stringify(firecrawlResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Firecrawl failed:', firecrawlResult.error);
    }

    // Tier 2: Apify
    const apifyToken = Deno.env.get('APIFY_API_TOKEN');
    if (apifyToken && !hasTimedOut(startTime)) {
      const apifyResult = await tryApify(formattedUrl, apifyToken, startTime);
      if (apifyResult.success && apifyResult.data) {
        if (!apifyResult.data.image) {
          apifyResult.data.image = getFaviconUrl(formattedUrl);
        }
        if (isBadTitle(apifyResult.data.title)) {
          apifyResult.data.title = extractNameFromUrl(formattedUrl) || 'Gift Item';
        }
        console.log('Apify succeeded in', Date.now() - startTime, 'ms');
        return new Response(
          JSON.stringify(apifyResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Apify failed:', apifyResult.error);
    }

    // Tier 3: URL fallback
    console.log('Using URL fallback after', Date.now() - startTime, 'ms');
    const fallbackResult = urlFallback(formattedUrl);
    
    return new Response(
      JSON.stringify(fallbackResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping product:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to scrape product' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
