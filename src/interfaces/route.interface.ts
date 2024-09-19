export interface IRoute {
    name: string;
    layout: string,
    path: string,
    icon: any,
    component: any,
    collapse?: boolean,
    category?: boolean,
    items?: IRoute[]
}