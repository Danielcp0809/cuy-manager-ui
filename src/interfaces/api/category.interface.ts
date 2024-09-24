import { IAudit } from "./audit.interface";

export interface ICategory extends IAudit {
    id: string;
    name: string;
    description: string;
    price: number;
}