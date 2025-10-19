import placeholderImages from './placeholder-images.json';

export interface PlaceHolderImage {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export const PlaceHolderImages: PlaceHolderImage[] = placeholderImages.placeholderImages;
