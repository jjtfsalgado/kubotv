
type IHttpResponse = {
    message: string,
    status: number
}

export namespace HttpStatus {
    export const INFORMATION = {
        CONTINUE: {
            code: 100,
            message: "Continue"
        }
    };

    export const SUCCESSFUL = {
        OK: {
            code: 200,
            message: "Ok"
        },
        CREATED:{
            code: 201,
            message: "Created"
        },
        ACCEPTED:{
            code: 202,
            message: "Accepted"
        }
    };

    export const REDIRECT = {
        MULTIPLE_CHOICE:{
            code: 300,
            message: "Multiple choice"
        },
        MOVED_PERMANENTLY:{
            code: 301,
            message: "Moved permanently"
        },
        FOUND:{
            code: 302,
            message: "Found"
        }
    };

    export const ERROR = {
        CLIENT:{
            BAD_REQUEST: {
                code: 400,
                message: "Bad request"
            },
            UNAUTHORIZED: {
                code: 401,
                message: "Unauthorized"
            },
            FORBIDDEN: {
                code: 403,
                message: "Forbidden"
            },
            NOT_FOUND: {
                code: 404,
                message: "Not found"
            },
        },
        SERVER:{
            INTERNAL_SERVER_ERROR:{
                code: 500,
                message: "Internal server errorMessage"
            },
            NOT_IMPLEMENTED:{
                code: 501,
                message: "Not implemented"
            },
            BAD_GATEWAY:{
                code: 502,
                message: "Bad gateway"
            },
            SERVICE_UNAVAILABLE:{
                code: 503,
                message: "Service unavailable"
            }
        }
    };
}

