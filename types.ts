export enum AppView {
  AUTH = 'AUTH',
  PROMPT_ENHANCER = 'PROMPT_ENHANCER',
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  SKETCH_TO_IMAGE = 'SKETCH_TO_IMAGE',
  PRODUCT_AD = 'PRODUCT_AD',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  THUMBNAIL_GEN = 'THUMBNAIL_GEN',
}

export enum ImageAspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  FOUR_THREE = '4:3',
  THREE_FOUR = '3:4',
}

export interface GeneratedContent {
  text?: string;
  imageUrl?: string;
}

export interface ProductAdConfig {
  background: 'Studio' | 'Outdoor' | 'Gradient';
  lighting: 'Bright' | 'Dramatic' | 'Soft';
  resolution: string;
}

export interface ThumbnailConfig {
  layout: 'Text Over Image' | 'Split Screen' | 'Image Only';
  fontStyle: string;
  aspectRatio: ImageAspectRatio;
}
