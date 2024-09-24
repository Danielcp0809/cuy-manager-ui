import { IAudit } from "./audit.interface";
import { ICounter } from "./counters.interface";

export interface ICage extends IAudit {
    id: string;
    code: string;
    capacity: number;
    counters: Partial<ICounter>[];
}