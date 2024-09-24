export interface IAuthEnterprise {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface IAuthResponse {
    enterprise: IAuthEnterprise;
    access_token: string;
    refresh_token: string;
}