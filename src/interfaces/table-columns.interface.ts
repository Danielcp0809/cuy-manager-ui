export interface ITableColumn {
    header: string;
    accessor: string;
    type: "TEXT" | "NUMBER" | "DATE" | "CUSTOM" | "LINK";
    config?: {
        isSticky?: boolean;
    }
    callbacks?: {
        getData: (data: any, rowData?: any) => any;
    };
}