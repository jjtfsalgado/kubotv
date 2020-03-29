import axios from "axios";
import {showToast} from "../ui/toast/toast";




export default class HttpController {

    static post = async (url: string, body: Object, opts: {silentError: boolean} = {} as any): Promise<any> => {
        return axios.post(url, body);

        // try{
        // }catch (e) {
        //     !silentError && showToast({message: "Ups, something went wrong. Please try again.", type: "errorMessage"})
        // }
    };
}
