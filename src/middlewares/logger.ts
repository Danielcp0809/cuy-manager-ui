import { Middleware } from 'redux';

export const logger: Middleware = (store) => (next: any) => (action) => {
    console.log(action)
    next(action)
}