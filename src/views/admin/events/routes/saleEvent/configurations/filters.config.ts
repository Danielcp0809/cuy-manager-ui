import { IFiltersConfiguration } from "../../../../../../components/tableFilters/TableFilters";

export const saleEventsFiltersConfiguration: IFiltersConfiguration = {
    filterOptionsConfiguration: [
        {
            id: "category_id",
            type: "select",
            label: "Categoría",
            fetchConfigId: "category_id",
        },
        {
            id: "cage_id",
            type: "select",
            label: "Jaula",
            fetchConfigId: "cage_id",
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
    ],
    filterFetchConfig: [
        {
            id: "category_id",
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
            fetchConfig: {
                url: "/cages",
                method: "get",
                transformResponse: (response: any) =>
                    response.data.map((cage: any) => ({
                        value: cage.id,
                        label: cage.code,
                })),
            }
        }
    ]
}
