const http = require('http');
const EventEmitter = require('events');

module.exports = class Application {
    constructor() {
        this.emitter = new EventEmitter();
        this.server = this._createServer();
        this.middlewares = []
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    addRouter(router, prefix = '') {
        Object.keys(router.endpoints).forEach( path => {
            this.prefix = prefix;
            const prefixedPath = (prefix) ? prefix + path : path;
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach( method => {
                const handler = endpoint[method];
                this.emitter.on(this._getRouteMask(prefixedPath, method), (req, res) => {
                    handler(req, res);
                })
            })
        })
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }

    _createServer() {
        return http.createServer( (req, res) => {
            req.prefix = this.prefix;
            this.middlewares.forEach( middleware => middleware(req, res) );

            req.on('endBodyParse', () => {
                console.log(`params: ${JSON.stringify(req.params)}`);
                console.log(`pathname: ${req.pathname}`);
                console.log(`method: ${req.method}`);
                const emitted = this.emitter.emit(this._getRouteMask(req.pathname, req.method), req, res);
                if (!emitted) {
                    res.end();
                }  
            }) 
        })
    }

    _getRouteMask(path, method) {
        return `[${path}]:[${method}]`;
    }
}