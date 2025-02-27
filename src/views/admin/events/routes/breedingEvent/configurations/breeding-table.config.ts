import { ITableColumn } from "../../../../../../interfaces/table-columns.interface";

export const breedingEventsTableColumns: ITableColumn[] = [
    {
        header: "Jaula machos (origen)",
        accessor: "male_cage",
        type: "LINK",
        callbacks: {
            getData: (data: any) => {
                return {
                    url: `/admin/jaulas/${data.male_cage.id}`,
                    label: data.male_cage.code,
                }
            }
        },
    },
    {
        header: "Categoría machos",
        accessor: "male_category",
        type: "TEXT",
        callbacks: {
            getData: (data: any) => data.male_category.name
        },
    },
    {
        header: "Cantidad machos",
        accessor: "male_quantity",
        type: "NUMBER",
    },
    {
        header: "Jaula hembras (origen)",
        accessor: "female_cage",
        type: "LINK",
        callbacks: {
            getData: (data: any) => {
                return {
                    url: `/admin/jaulas/${data.female_cage.id}`,
                    label: data.female_cage.code,
                }
            }
        },
    },
    {
        header: "Categoría hembras",
        accessor: "female_category",
        type: "TEXT",
        callbacks: {
            getData: (data: any) => data.female_category.name
        },
    },
    {
        header: "Cantidad hembras",
        accessor: "female_quantity",
        type: "NUMBER",
    },
    {
        header: "Jaula de destino",
        accessor: "cage",
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
        header: "Fecha de inicio",
        accessor: "date",
        type: "DATE",
    },
    {
        header: "Duración (meses)",
        accessor: "months_duration",
        type: "NUMBER",
    },
    {
        header: "Estado",
        accessor: "status",
        type: "STATUS",
        callbacks: {
            getData: (_, rowData: any) => {
                const date = Number(rowData.date) // i.e. 1740632899112
                const today = Date.now() // i.e. 1740632899112
                const monthsDuration = rowData.months_duration
                const warningDate = new Date(date).setMonth(new Date(date).getMonth() + monthsDuration - 1)
                const endDate = new Date(date).setMonth(new Date(date).getMonth() + monthsDuration)
                if (today >= endDate) {
                    return "danger";
                }
                if (today >= warningDate) {
                    return "warning";
                }
                return "success";
            },
        },
        config: {
            successLabel: "Activo",
            dangerLabel: "Finalizado",
            warningLabel: "Próximo",
        },
    },
    {
        header: "Descripción",
        accessor: "description",
        type: "TEXT",
        config: {
            maxCharacters: 30,
        }
    },
]