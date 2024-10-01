import { ITableColumn } from "../../../../interfaces/table-columns.interface";

export const countersColumns: ITableColumn[] = [
    {
        header: "Categoría",
        accessor: "category",
        type: "CUSTOM",
        callbacks: {
            getData: (data: any) => {
                return data.name;
            }
        },
        config: {
            isSticky: true,
        }
    },
    {
        header: "Cantidad",
        accessor: "amount",
        type: "NUMBER",
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