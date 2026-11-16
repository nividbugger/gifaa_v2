export interface ExtractedProduct {
  title: string | null;
  price: number | null;
  image: string | null;
  description: string | null;
}

/** An extractor returns whatever it can find; the orchestrator merges layers in priority order. */
export type Extractor = (doc: Document, pageUrl: string) => Partial<ExtractedProduct>;
