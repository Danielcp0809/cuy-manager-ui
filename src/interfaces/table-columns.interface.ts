export interface ITableColumn {
    header: string;
    accessor: string;
    type: "TEXT" | "NUMBER" | "DATE" | "CUSTOM";
    callbacks?: {
        getData: (data: any, rowData?: any) => any;
    };
}