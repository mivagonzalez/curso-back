const ERRORS = {
    ROUTING_ERROR: {name: "ROUTING ERROR", code: 404},
    INVALID_TYPES_ERROR: {name: "INVALID TYPES",code: 400},
    INVALID_PARAMETER_ERROR: {name:"INVALID PARAMETERS", code:400},
    DATABASE_ERROR: {name:"DATABASE ERROR", code: 500},
    CREATION_ERROR: {name: "CREATION ERROR", code: 400}
}
class CustomError {
    static createError({name = "Error", cause, message, code = 1}) {
        const error = new Error(message, {cause});
        error.name = name;
        error.code = code;
        throw error;
    }
}

module.exports = { ERRORS, CustomError };
