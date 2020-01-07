import {Router} from "express";

function User(router: Router) {
    router.get('/', (req, res) => {
        return res.send("hey im joe")
    });

    


    return router;
}

export default User;