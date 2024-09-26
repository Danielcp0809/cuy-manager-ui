export interface ITableColumn {
    header: string;
    accessor: string;
    type: "TEXT" | "NUMBER" | "DATE" | "CUSTOM" | "LINK" | "STATUS" | "PROGRESS";
    config?: {
        isSticky?: boolean;
        successLabel?: string;
        dangerLabel?: string;
        warningLabel?: string;
    }
    callbacks?: {
        getData: (data: any, rowData?: any) => any;
    };
}