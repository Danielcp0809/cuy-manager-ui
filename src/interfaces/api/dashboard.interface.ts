export interface ICagesChartProps {
    labels: string[];
    categories: {
        name: string;
        data: number[];
        color: string;
    }[];
}

export interface ICategoriesChartProps {
    color: string;
    label: string;
    total: number;
}

export interface IStatsProps {
    total: number;
    cages: number;
    categories: number;
    price: number;
}