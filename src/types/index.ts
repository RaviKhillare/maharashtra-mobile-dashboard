export interface SheetEntry {
  id: string;
  no: number;
  subject: string;
  cc: number;
  pp: number;
  baki: string;
  date?: string;
  category?: string;
}

export interface SheetTotals {
  ccTotal: number;
  ppTotal: number;
  grandTotal: number;
  totalEntries: number;
  pendingBakiCount: number;
  averageGrandTotal: number;
}

export type SortField = 'no' | 'subject' | 'cc' | 'pp' | 'total' | 'baki';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  bakiFilter: 'all' | 'has_baki' | 'no_baki';
  sortBy: SortField;
  sortDirection: SortDirection;
}
