import { ITableColumn } from "../../../../interfaces/table-columns.interface";

export const categoryColumns: ITableColumn[] = [
    {
        header: "Nombre",
        accessor: "name",
        type: "TEXT",
        config: {
            isSticky: true,
        }
    },
    {
        header: "Descripción",
        accessor: "description",
        type: "TEXT",
    },
    {
        header: "Precio",
        accessor: "price",
        type: "CUSTOM",
        callbacks: {
            getData: (data: any) => `$ ${data}`
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
];