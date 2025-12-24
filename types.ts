
export interface ImagePlaceholder {
  id: string;
  type: 'VERTICAL' | 'HORIZONTAL'; // 'IMAGE' or 'IMAGEU'
  index: number;
  url: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  wordGoal: number;
}

export enum FormatterState {
  IDLE,
  PROCESSING,
  SUCCESS,
  ERROR
}
