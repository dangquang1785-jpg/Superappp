export type ActiveTab = 
  | 'home'
  | 'faq'
  | 'download-ipay'
  | 'game'
  | 'deposit-interest'
  | 'loan-schedule'
  | 'featured-products'
  | 'branches';

export interface FaqStep {
  step: number;
  title: string;
  text: string;
  image: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  videoUrl: string;
  steps: FaqStep[];
}

export interface ProductItem {
  id: string;
  category: string;
  title: string;
  badge: string;
  summary: string;
  image: string;
  highlights: string[];
}

export interface BranchItem {
  stt: number;
  provinceId: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  image: string;
  mapsUrl: string;
}

export interface LoanScheduleRow {
  period: number;
  dateStr: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}
