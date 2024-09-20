import { ITableColumn } from "../../../../interfaces/table-columns.interface";

export const cageColumns: ITableColumn[] = [
    {
        header: "Código",
        accessor: "code",
        type: "TEXT",
    },
    {
        header: "Capacidad",
        accessor: "capacity",
        type: "NUMBER",
    },
    {
        header: "Total",
        accessor: "counters",
        type: "CUSTOM",
        callbacks: {
            getData: (data: any) => {
                return data.reduce((acc: number, item: any) => {
                    return acc + item.amount;
                }, 0)
            }
        }
    },
    {
        header: "Creación",
        accessor: "created_at",
        type: "DATE",
    },
    {
        header: "Actualización",
        accessor: "updated_at",
        type: "DATE",
    },
]