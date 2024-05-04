class BaseHandler {
    constructor() {
        this.nextHandler = null;
    }

    setNextHandler(handler) {
        this.nextHandler = handler;
        return handler;
    }

    async handleRequest(req, res) {
        if (this.nextHandler) {
            await this.nextHandler.handleRequest(req, res);
        }
    }
}

module.exports = BaseHandler;