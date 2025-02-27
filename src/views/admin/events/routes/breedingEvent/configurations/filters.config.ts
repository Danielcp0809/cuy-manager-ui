import { IFiltersConfiguration } from "../../../../../../components/tableFilters/TableFilters";

export const breedingEventsFiltersConfiguration: IFiltersConfiguration = {
    filterOptionsConfiguration: [
        {
            id: "male_category_id",
            type: "select",
            label: "Categoría machos (origen)",
            fetchConfigId: "category_id",
        },
        {
            id: "female_category_id",
            type: "select",
            label: "Categoría hembras (origen)",
            fetchConfigId: "category_id",
        },
        {
            id: "male_cage_id",
            type: "select",
            label: "Jaula machos (origen)",
            fetchConfigId: "cage_id",
        },
        {
            id: "female_cage_id",
            type: "select",
            label: "Jaula hembras (origen)",
            fetchConfigId: "cage_id",
        },
        {
            id: "cage_id",
            type: "select",
            label: "Jaula de destino",
            fetchConfigId: "cage_id",
        },
        {
            id: "months_duration",
            type: "number",
            label: "Duración (meses)",
        },
        {
            id: "min_date",
            type: "date",
            label: "Fecha inicio (desde)",
        },
        {
            id: "max_date",
            type: "date",
            label: "Fecha inicio (hasta)",
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