import {QueryConfig} from "pg";

export interface IRouteSql{
    [key: string]: (...args) => QueryConfig<typeof args>
}


interface IRouterCtrl {

}