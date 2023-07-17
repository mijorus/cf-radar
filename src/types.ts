interface MonthlyDataResponse {
    date: string;
    result: MonthlyDataResult[];
}

interface MonthlyDataResult {
    rank: number;
    domain: string;
    categories: any[];
}

interface DomainData {
    favicon: null | string;
    categories: {
        id: number;
        name: string;
        superCategoryId: number;
    }[];
}

type DomainDataReponse = { [key: string]: DomainData }

interface SearchResult extends DomainData {
    domain: string;
}