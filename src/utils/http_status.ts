
export namespace HttpStatus {
    export const INFORMATION = {
        CONTINUE: {
            code: 100,
            description: "Continue"
        }
    };

    export const SUCCESSFUL = {
        OK: {
            code: 200,
            description: "Ok"
        },
        CREATED:{
            code: 201,
            description: "Created"
        },
        ACCEPTED:{
            code: 202,
            description: "Accepted"
        }
    };

    export const REDIRECT = {
        MULTIPLE_CHOICE:{
            code: 300,
            description: "Multiple choice"
        },
        MOVED_PERMANENTLY:{
            code: 301,
            description: "Moved permanently"
        },
        FOUND:{
            code: 302,
            description: "Found"
        }
    };

    export const ERROR = {
        CLIENT:{
            BAD_REQUEST: {
                code: 400,
                description: "Bad request"
            },
            UNAUTHORIZED: {
                code: 401,
                description: "Unauthorized"
            },
            FORBIDDEN: {
                code: 403,
                description: "Forbidden"
            },
            NOT_FOUND: {
                code: 404,
                description: "Not found"
            },
            CONFLICT: {
                code: 409,
                description: "Conflict"
            },
        },
        SERVER:{
            INTERNAL_SERVER_ERROR:{
                code: 500,
                description: "Internal server errorMessage"
            },
            NOT_IMPLEMENTED:{
                code: 501,
                description: "Not implemented"
            },
            BAD_GATEWAY:{
                code: 502,
                description: "Bad gateway"
            },
            SERVICE_UNAVAILABLE:{
                code: 503,
                description: "Service unavailable"
            }
        }
    };
}

