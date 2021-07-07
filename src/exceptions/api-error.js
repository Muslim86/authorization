

module.export = class AppiError extends Error {
    status;
    errors;

    constructor(status, message, errors = [] ) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static Unauthorized() {
        return new AppiError(401, 'Пользователь не авторизован' )
    }

    static BadRequest(message, errors = []) {
        return new AppiError(400, message, errors)
    }
}