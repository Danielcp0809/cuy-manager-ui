import { IAudit } from "./audit.interface";

export interface ICounter extends IAudit {
    id: string;
    cage_id: string;
    category_id: string;
    amount: number;
}