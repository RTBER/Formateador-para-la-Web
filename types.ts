export interface ImagePlaceholder {
  id: string;
  type: 'VERTICAL' | 'HORIZONTAL'; // 'IMAGE' or 'IMAGEU'
  index: number;
  url: string;
}

export enum FormatterState {
  IDLE,
  PROCESSING,
  SUCCESS,
  ERROR
}
