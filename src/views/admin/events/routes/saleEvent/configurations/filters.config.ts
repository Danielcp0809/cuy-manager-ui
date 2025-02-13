import { IFilterOptionConfiguration } from "../../../../../../components/tableFilters/tableFilters";

export const saleEventsFiltersConfiguration: IFilterOptionConfiguration[] = [
    {
        id: "category",
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
        id: "cage",
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
    }
];
