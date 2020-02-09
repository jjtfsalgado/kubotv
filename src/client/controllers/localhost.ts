
class LocalStorageCtrl{
    private _token = "token_locals";

    set tokenSet(value: string){
        localStorage.setItem(this._token, value);
    }

    get tokenGet(){
        return localStorage.getItem(this._token);
    }

    tokenDelete(){
        return localStorage.removeItem(this._token);
    }
}

export default new LocalStorageCtrl();