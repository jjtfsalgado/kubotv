
class LocalStorageCtrl{
    private _token = "token_locals";
    private _user = "user_locals";

    set userId(value: string){
        localStorage.setItem(this._user, value);
    }

    get userIdGet(){
        return localStorage.getItem(this._user);
    }

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