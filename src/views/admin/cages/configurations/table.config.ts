import { ITableColumn } from "../../../../interfaces/table-columns.interface";

export const cageColumns: ITableColumn[] = [
    {
        header: "Código",
        accessor: "code",
        type: "LINK",
        callbacks: {
            getData: (data: any) => {
                return `/admin/jaulas/${data.id}`
            }
        },
        config: {
            isSticky: true,
        }
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
        header: "Porcentaje uso",
        accessor: "progress",
        type: "PROGRESS",
        callbacks: {
            getData: (_, rowData: any) => {
                const total = rowData.counters.reduce((acc: number, item: any) => {
                    return acc + item.amount;
                }, 0);
                const capacity = rowData.capacity;
                return ((total / capacity) * 100).toFixed(0);
            }
        }
    },
    {
        header: "Estado",
        accessor: "status",
        type: "STATUS",
        callbacks: {
            getData: (_, rowData: any) => {
                const counters = rowData.counters;
                const total = counters.reduce((acc: number, item: any) => {
                    return acc + item.amount;
                }, 0);
                const capacity = rowData.capacity;
                const percentage = (total / capacity) * 100;
                if (percentage < 80) {
                    return "success";
                } else if (percentage >= 80 && percentage < 100) {
                    return "warning";
                } else {
                    return "danger";
                }
            },
        },
        config: {
            successLabel: "Disponible",
            dangerLabel: "Lleno",
            warningLabel: "Casi lleno",
        },
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