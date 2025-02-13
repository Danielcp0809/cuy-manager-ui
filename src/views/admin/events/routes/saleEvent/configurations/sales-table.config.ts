import { ITableColumn } from "../../../../../../interfaces/table-columns.interface";

export const salesTableColumns: ITableColumn[] = [
    {
        header: "Jaula",
        accessor: "cage.code",
        type: "LINK",
        callbacks: {
            getData: (data: any) => {
                return {
                    url: `/admin/jaulas/${data.cage.id}`,
                    label: data.cage.code,
                }
            }
        },
    },
    {
        header: "Categoría",
        accessor: "category.code",
        type: "TEXT",
        callbacks: {
            getData: (data: any) => {
                return data.category.name;
            }
        },
    },
    {
        header: "Cantidad",
        accessor: "quantity",
        type: "NUMBER",
    },
    {
        header: "Precio unitario",
        accessor: "unit_price",
        type: "NUMBER",
    },
    {
        header: "Peso unitario",
        accessor: "unit_weight",
        type: "NUMBER",
    },
    {
        header: "Descripción",
        accessor: "description",
        type: "TEXT",
        config: {
            maxCharacters: 30,
        }
    },
];