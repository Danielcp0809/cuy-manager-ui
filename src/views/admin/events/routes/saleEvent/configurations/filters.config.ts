import { IFilterOptionConfiguration } from "../../../../../../components/tableFilters/TableFilters";

export const saleEventsFiltersConfiguration: IFilterOptionConfiguration[] = [
    {
        id: "category_id",
        type: "select",
        label: "Categoría",
        fetchConfig: {
            url: "/categories",
            method: "get",
            transformResponse: (response: any) =>
                response.data.map((category: any) => ({
                    value: category.id,
                    label: category.name,
            })),
        }
    },
    {
        id: "cage_id",
        type: "select",
        label: "Jaula",
        fetchConfig: {
            url: "/cages",
            method: "get",
            transformResponse: (response: any) =>
                response.data.map((cage: any) => ({
                    value: cage.id,
                    label: cage.code,
            })),
        }
    },
    {
        id: "quantity",
        type: "number",
        label: "Cantidad",
    },
    {
        id: "min_date",
        type: "date",
        label: "Fecha mínima",
    },
    {
        id: "max_date",
        type: "date",
        label: "Fecha máxima",
    }
];
