import axios, {AxiosPromise, AxiosResponse} from "axios";
import {showDialog} from "../ui/dialog/dialog";


export default class HttpController {

    static post = async (url: string, body: Object, opts: {promptError: boolean} = {} as any): Promise<any> => {
        const {promptError} = opts;
        return await errorHandler(async () => await axios.post(url, body), promptError)
    };

    static get = async <T>(url: string, opts: {promptError: boolean} = {} as any): Promise<AxiosResponse<T>> => {
        const {promptError} = opts;
        return await errorHandler(async () => await axios.get(url), promptError)
    };

    static patch = async <T>(url: string, body: Object, opts: {promptError: boolean} = {} as any): Promise<AxiosResponse<T>> => {
        const {promptError} = opts;
        return await errorHandler(async () => await axios.patch(url, body), promptError)
    };

    static delete = async <T>(url: string, opts: {promptError: boolean} = {} as any): Promise<AxiosResponse<T>> => {
        const {promptError} = opts;
        return await errorHandler(async () => await axios.delete(url), promptError)
    };
}

const errorHandler = async <T extends unknown>(callBack: () => Promise<any>, promptError?: boolean): Promise<T> => {
    try{
        return await callBack()
    }catch (e) {
        console.error(e);
        promptError && showDialog.sync({title:"Something went wrong", children: "Oops, something went wrong. Please try again."})
    }
};


