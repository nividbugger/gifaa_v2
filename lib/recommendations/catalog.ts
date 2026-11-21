// The curated recommendations shown on /recommendations.
//
// To add a product, add a line to the right section's `items`:
//     { url: "https://www.amazon.in/..." }
// The name, image and price are fetched automatically (and cached). If the automatic details are
// wrong or missing, set them on that item:
//     { url: "...", name: "Copper Water Bottle", image: "https://...", price: 899 }
// When both `name` and `image` are set, nothing is fetched. `price` is shown only if you set it
// (leave it out for items whose price changes often).
// Use the exact link you want people to click: it is used as written.
// Amazon links MUST include tag=gifaa04-21 and a linkId (the build fails otherwise; see catalog-rules.ts).

export interface CatalogItem {
  url: string;
  /** Store name for the button, e.g. "H&M". Defaults to a known retailer's name or the website address. */
  store?: string;
  name?: string;
  image?: string;
  price?: number;
}

export interface CatalogSection {
  id: string;
  title: string;
  subtitle: string;
  items: CatalogItem[];
}

export const RECOMMENDATION_SECTIONS: CatalogSection[] = [
  {
    id: "amazon",
    title: "From Amazon",
    subtitle: "Hand-picked gift ideas, delivered to your door.",
    items: [
      {
        url: "https://www.amazon.in/dp/B0D9WWB3WX/ref=cm_sw_r_as_gl_api_gl_i_dl_93C69C8YSMCT99V1TBHB?linkCode=ml1&tag=gifaa04-21&linkId=f18439e518bc27f9b6d139f5bef242a0",
        name: "OURA Ring 4 - Silver - Size 9 - Smart Ring",
        image: "https://m.media-amazon.com/images/I/41WQPKyoTVL._SY300_SX300_QL70_FMwebp_.jpg",
      },
      {
        url: "https://www.amazon.in/dp/B0G12JMCC5/ref=cm_sw_r_as_gl_api_gl_i_dl_23XY757DRX1A5YF95TXD?linkCode=ml1&tag=gifaa04-21&linkId=69602a873d000447f75ab15860a55a14",
        name: "COSTAR Coffee Machine for Home, 20 Bar Espresso Machine with Milk Frother",
        image: "https://m.media-amazon.com/images/I/71ta4BJCyAL._SX679_.jpg",
      },
      {
        url: "https://www.amazon.in/dp/B0GJT2PPCM/ref=cm_sw_r_as_gl_api_gl_i_H1PXCSE153CV2X9KQ819?linkCode=ml1&tag=gifaa04-21&linkId=1f845c7efa2e576fe8434911c27656ef",
        name: "Ember Cookware",
        // no image set on purpose: it is fetched automatically; add `image: "..."` here if it doesn't load
      },
      {
        url: "https://www.amazon.in/dp/B0H6MWCJWK/ref=cm_sw_r_as_gl_api_gl_i_dl_71DZ587DEB0RVCG2JF0F?linkCode=ml1&tag=gifaa04-21&linkId=f8e74303362fff3f3524531eb48cbbfb",
        name: "Outdoor Garden Plant Stand",
      },
    ],
  },
  {
    id: "other-stores",
    title: "Other Popular Stores",
    subtitle: "More places we love for thoughtful gifts.",
    items: [
      {
        url: "https://thehouseofthings.com/tiger-eye-candle.html",
        store: "The House of Things",
        name: "Tiger Eye Candle",
        image: "https://thot-media.thehouseofthings.com/media/catalog/product/cache/2759e4bb06b0356431a737388642298b/t/i/tiger_eye_candle_1800x1200_1.webp",
      },
      {
        url: "https://luxury.tatacliq.com/noritake-gold-white-porcelain-hampshire-21-pcs-dinner-set/p-mp000000031886890",
        store: "Tata CLiQ Luxury",
        name: "Noritake Gold & White Porcelain Hampshire 21-Piece Dinner Set",
        image: "https://assets.tatacliq.com/medias/sys_master/images/12016577609758.png",
      },
      {
        url: "https://modernquests.com/products/architect-sp-soap-dispenser-gold",
        store: "Modern Quests",
        name: "Architect SP Soap Dispenser - Gold",
        image: "https://cdn.shopify.com/s/files/1/1586/2541/files/ArchitectSoapDispenser-Gold_3.jpg?v=1754563413",
      },
      {
        url: "https://www2.hm.com/en_in/productpage.0946625005.html",
        store: "H&M",
        name: "Bath Towel",
        image: "https://image.hm.com/assets/hm/28/9a/289a6907f1b989ea2f52711ef4d9d414b4939bcf.jpg?imwidth=1260",
      },
      {
        url: "https://thefruik.com/products/bloom-box-wireless-aroma-diffuser",
        store: "The Fruik",
        name: "Bloom Box Wireless Aroma Diffuser",
        image: "https://thefruik.com/cdn/shop/files/BloomBox1.png?v=1772172331&width=1792",
      },
      {
        url: "https://www.nykaa.com/m-a-c-hyper-real-serumizertm-skin-balancing-hydration-serum/p/9281209?skuId=8643766",
        name: "M.A.C Hyper Real Serumizer Skin Balancing Serum",
        image: "https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/7/9/792889e773602655816_01.jpg",
      },
      {
        url: "https://www.flipkart.com/google-pixel-buds-pro-active-noise-cancellation-bluetooth-headset/p/itmb3c2568b7166e",
        name: "Google Pixel Buds Pro with Active Noise Cancellation",
        image: "https://rukminim2.flixcart.com/image/500/500/xif0q/headphone/e/8/o/ga03201-google-enriched-transparent-original-imagg8d7bhxjduze.png",
      },
      {
        url: "https://babyjalebi.com/collections/dune-diaper-caddy/products/the-diaper-caddy",
        store: "Baby Jalebi",
        name: "The Dune Diaper Caddy - Ecru",
        image: "https://babyjalebi.com/cdn/shop/files/baby-jalebi-diaper-caddy-the-dune-diaper-caddy-ecru-1072291132_1024x1024.jpg?v=1747216511",
      },
      {
        url: "https://allthingsbaby.com/products/kind-me-interlocking-playmat-polka-dot-grey?variant=42867332874466",
        store: "All Things Baby",
        name: "Kind&Me Interlocking Playmat - Polka Dot Grey",
        image: "https://allthingsbaby.com/cdn/shop/products/2_988303ed-2776-4342-8496-7e445faf0521.jpg?v=1653466179&width=1920",
      },
      {
        url: "https://www.firstcry.com/babyhug/babyhug-terry-knit-tiger-printed-towel-and-wrappers-orange/24123908/product-detail",
        store: "FirstCry",
        name: "Babyhug Terry Knit Tiger Printed Towel & Wrappers - Orange",
        image: "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-terry-knit-tiger-printed-towel-and-wrappers-orange-24123908zzsq.webp",
      },
    ],
  },
];
