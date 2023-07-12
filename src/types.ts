interface MonthlyDataResponse {
    date: string;
    result: MonthlyDataResult[];
  }
  
  interface MonthlyDataResult {
    rank: number;
    domain: string;
    categories: any[];
  }