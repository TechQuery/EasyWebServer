#! /usr/bin/env node

//
//  Generated by https://www.npmjs.com/package/amd-bundle
//
(function (factory) {

    if ((typeof define === 'function')  &&  define.amd)
        define('command', ["koa","koa-logger","@koa/cors","koa-static","node-fetch","internal-ip","opn","url","path","child_process","babel-polyfill","commander","fs"], factory);
    else if (typeof module === 'object')
        return  module.exports = factory(require('koa'),require('koa-logger'),require('@koa/cors'),require('koa-static'),require('node-fetch'),require('internal-ip'),require('opn'),require('url'),require('path'),require('child_process'),require('babel-polyfill'),require('commander'),require('fs'));
    else
        return  this['command'] = factory(this['koa'],this['koa-logger'],this['@koa/cors'],this['koa-static'],this['node-fetch'],this['internal-ip'],this['opn'],this['url'],this['path'],this['child_process'],this['babel-polyfill'],this['commander'],this['fs']);

})(function (koa,koa_logger,_koa_cors,koa_static,node_fetch,internal_ip,opn,url,path,child_process,babel_polyfill,commander,fs) {

function merge(base, path) {

    return (base + '/' + path).replace(/\/\//g, '/').replace(/[^/.]+\/\.\.\//g, '').replace(/\.\//g, function (match, index, input) {

        return input[index - 1] === '.' ? match : '';
    });
}

    var require = _require_.bind(null, './');

    function _require_(base, path) {

        var module = _module_[
                /^[^./]/.test( path )  ?  path  :  ('./' + merge(base, path))
            ],
            exports;

        if (! module.exports) {

            module.exports = { };

            var dependency = module.dependency;

            for (var i = 0;  dependency[i];  i++)
                module.dependency[i] = require( dependency[i] );

            exports = module.factory.apply(
                null,  module.dependency.concat(
                    _require_.bind(null, module.base),  module.exports,  module
                )
            );

            if (exports != null)  module.exports = exports;

            delete module.dependency;  delete module.factory;
        }

        return module.exports;
    }

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _module_ = {
    './WebServer': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _koa = require('koa');

            var _koa2 = _interopRequireDefault(_koa);

            var _koaLogger = require('koa-logger');

            var _koaLogger2 = _interopRequireDefault(_koaLogger);

            var _cors = require('@koa/cors');

            var _cors2 = _interopRequireDefault(_cors);

            var _koaStatic = require('koa-static');

            var _koaStatic2 = _interopRequireDefault(_koaStatic);

            var _nodeFetch = require('node-fetch');

            var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

            var _internalIp = require('internal-ip');

            var _internalIp2 = _interopRequireDefault(_internalIp);

            var _opn = require('opn');

            var _opn2 = _interopRequireDefault(_opn);

            var _url = require('url');

            var _path = require('path');

            var _child_process = require('child_process');

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            /**
             * Web server
             */

            var WebServer = function () {
                /**
                 * @param {string}         [staticPath='.']
                 * @param {number}         [netPort=0]
                 * @param {boolean}        [XDomain=false]
                 * @param {?Object}        proxyMap         - Same as the parameter of {@link WebServer.proxyOf}
                 * @param {boolean|string} [openURL=false]
                 */
                function WebServer(staticPath, netPort, XDomain, proxyMap, openURL) {
                    _classCallCheck(this, WebServer);

                    /**
                     * @type {string}
                     */
                    this.staticPath = staticPath || '.';

                    /**
                     * @type {number}
                     */
                    this.netPort = !netPort ? 0 : isNaN(netPort) ? process.env[netPort] : +netPort;

                    /**
                     * @private
                     *
                     * @type {Application}
                     */
                    this.core = new _koa2.default();

                    /**
                     * @type {boolean}
                     */
                    this.XDomain = XDomain;

                    /**
                     * @private
                     *
                     * @type {?Object}
                     */
                    this.proxyMap = WebServer.proxyOf(proxyMap);

                    /**
                     * @private
                     *
                     * @type {boolean|string}
                     */
                    this.openPath = openURL;

                    /**
                     * @private
                     *
                     * @type {ServerAddress}
                     */
                    this.address = null;

                    this.boot();
                }

                /**
                 * @private
                 *
                 * @param {Object} map - Key for RegExp source, value for replacement
                 *
                 * @return {?Object} Key for replacement, value for RegExp
                 */


                _createClass(WebServer, [{
                    key: 'boot',


                    /**
                     * @private
                     */
                    value: function boot() {

                        this.core.use((0, _koaLogger2.default)());

                        if (this.proxyMap) this.core.use(this.proxy.bind(this));

                        if (this.XDomain) this.core.use((0, _cors2.default)());

                        this.core.use((0, _koaStatic2.default)(this.staticPath));
                    }

                    /**
                     * Origin URI
                     *
                     * @type {string}
                     */

                }, {
                    key: 'proxy',


                    /**
                     * @private
                     *
                     * @param {Context}  context
                     * @param {Function} next
                     *
                     * @return {?Stream}
                     */
                    value: function () {
                        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context, next) {
                            var URL, _path2, final;

                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            URL = context.path;
                                            _context.t0 = regeneratorRuntime.keys(this.proxyMap);

                                        case 2:
                                            if ((_context.t1 = _context.t0()).done) {
                                                _context.next = 9;
                                                break;
                                            }

                                            _path2 = _context.t1.value;
                                            final = URL.replace(this.proxyMap[_path2], _path2);

                                            if (!(final !== URL)) {
                                                _context.next = 7;
                                                break;
                                            }

                                            return _context.abrupt('return', WebServer.proxy(final, context));

                                        case 7:
                                            _context.next = 2;
                                            break;

                                        case 9:
                                            _context.next = 11;
                                            return next();

                                        case 11:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }));

                        function proxy(_x, _x2) {
                            return _ref.apply(this, arguments);
                        }

                        return proxy;
                    }()

                    /**
                     * Create a server in the same Node.JS process
                     *
                     * @return {Server} HTTP server
                     */

                }, {
                    key: 'localHost',
                    value: function localHost() {

                        var server = this;

                        return this.core.listen(this.netPort, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                    switch (_context2.prev = _context2.next) {
                                        case 0:

                                            server.address = Object.assign(this.address(), {
                                                family: 'IPv4',
                                                address: _internalIp2.default.v4.sync()
                                            });

                                            if (!process.send) {
                                                _context2.next = 3;
                                                break;
                                            }

                                            return _context2.abrupt('return', process.send({ type: 'ready', data: server.address }));

                                        case 3:

                                            console.info('Web server runs at ' + server.URL);

                                            if (!server.openPath) {
                                                _context2.next = 7;
                                                break;
                                            }

                                            _context2.next = 7;
                                            return (0, _opn2.default)(server.openURL);

                                        case 7:
                                        case 'end':
                                            return _context2.stop();
                                    }
                                }
                            }, _callee2, this);
                        }))).on('error', function (error) {

                            if (process.send) process.send({
                                type: 'error',
                                data: error
                            });else console.error(error);
                        });
                    }

                    /**
                     * Boot a server in a forked Node.JS process
                     *
                     * @return {Promise<ServerAddress>}
                     */

                }, {
                    key: 'workerHost',
                    value: function workerHost() {

                        var child = (0, _child_process.fork)((0, _path.join)(process.argv[0], '../../dist/command'), [this.staticPath, '-p', this.netPort, this.XDomain && '--CORS'], {
                            execArgv: [],
                            silent: true
                        });

                        return new Promise(function (resolve, reject) {

                            child.on('message', function (event) {

                                switch (event.type) {
                                    case 'ready':
                                        return resolve(event.data);
                                    case 'error':
                                        {

                                            var error = event.data;

                                            reject(Object.assign(new global[error.name](error.message), error));
                                        }
                                }
                            });
                        });
                    }
                }, {
                    key: 'URL',
                    get: function get() {

                        var address = this.address;

                        return address ? 'http://' + address.address + ':' + address.port : '';
                    }

                    /**
                     * URL to open in default browser
                     *
                     * @type {string}
                     */

                }, {
                    key: 'openURL',
                    get: function get() {

                        return typeof this.openPath !== 'string' ? this.URL : (0, _url.resolve)(this.URL, this.openPath);
                    }

                    /**
                     * @private
                     *
                     * @param {string}  URL
                     * @param {Context} context
                     *
                     * @return {Stream}
                     */

                }], [{
                    key: 'proxyOf',
                    value: function proxyOf(map) {

                        var proxyMap = {},
                            count = 0;

                        for (var pattern in map) {
                            proxyMap[map[pattern]] = new RegExp(pattern), count++;
                        }return count ? proxyMap : null;
                    }
                }, {
                    key: 'proxy',
                    value: function () {
                        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(URL, context) {
                            var header, response, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _header;

                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            header = Object.assign({}, context.header);


                                            delete header.host;

                                            _context3.next = 4;
                                            return (0, _nodeFetch2.default)(URL, {
                                                method: context.method,
                                                headers: header,
                                                compress: false,
                                                body: /^HEAD|GET$/i.test(context.method) ? null : context.req
                                            });

                                        case 4:
                                            response = _context3.sent;


                                            context.status = response.status, context.message = response.statusText;

                                            _iteratorNormalCompletion = true;
                                            _didIteratorError = false;
                                            _iteratorError = undefined;
                                            _context3.prev = 9;
                                            for (_iterator = response.headers.entries()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                                _header = _step.value;
                                                if (_header[0] !== 'status') context.set(_header[0].replace(/^\w|-\w/g, function (char) {
                                                    return char.toUpperCase();
                                                }), _header[1]);
                                            }_context3.next = 17;
                                            break;

                                        case 13:
                                            _context3.prev = 13;
                                            _context3.t0 = _context3['catch'](9);
                                            _didIteratorError = true;
                                            _iteratorError = _context3.t0;

                                        case 17:
                                            _context3.prev = 17;
                                            _context3.prev = 18;

                                            if (!_iteratorNormalCompletion && _iterator.return) {
                                                _iterator.return();
                                            }

                                        case 20:
                                            _context3.prev = 20;

                                            if (!_didIteratorError) {
                                                _context3.next = 23;
                                                break;
                                            }

                                            throw _iteratorError;

                                        case 23:
                                            return _context3.finish(20);

                                        case 24:
                                            return _context3.finish(17);

                                        case 25:
                                            return _context3.abrupt('return', context.body = response.body);

                                        case 26:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, this, [[9, 13, 17, 25], [18,, 20, 24]]);
                        }));

                        function proxy(_x3, _x4) {
                            return _ref3.apply(this, arguments);
                        }

                        return proxy;
                    }()
                }]);

                return WebServer;
            }();

            exports.default = WebServer; /**
                                          * @typedef {Object} ServerAddress
                                          *
                                          * @property {string} family  - `IPv4`
                                          * @property {string} address - IP address
                                          * @property {number} port    - Network listening port
                                          */

            /**
             * @external {Application} https://github.com/koajs/koa/blob/master/docs/api/index.md#application
             */

            /**
             * @external {Context} https://github.com/koajs/koa/blob/master/docs/api/context.md
             */
        }
    },
    './command': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.configOf = configOf;

            require('babel-polyfill');

            var _commander = require('commander');

            var _commander2 = _interopRequireDefault(_commander);

            var _WebServer = require('./WebServer');

            var _WebServer2 = _interopRequireDefault(_WebServer);

            var _path = require('path');

            var _fs = require('fs');

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            /**
             * Get configuration of a Package from `package.json` in `process.cwd()`
             *
             * @param {string} name
             *
             * @return {?Object} (`process.env.NODE_ENV` will affect the result)
             */
            function configOf(name) {

                var config = JSON.parse((0, _fs.readFileSync)('./package.json'))[name];

                if (config) return config.env ? config.env[process.env.NODE_ENV] : config;
            }

            var manifest = JSON.parse((0, _fs.readFileSync)((0, _path.join)(process.argv[1], '../../package.json'))),
                config = configOf('koapache');

            _commander2.default.version(manifest.version).description(manifest.description).arguments('[dir]').option('-p, --port <value>', 'Listening port number (support Environment variable name)').option('--CORS', 'Enable CORS middleware').option('-o, --open [path]', 'Open the Index or specific page in default browser').parse(process.argv);

            var server = new _WebServer2.default(_commander2.default.args[0], _commander2.default.port, _commander2.default.CORS, config.proxy, _commander2.default.open);

            server.localHost();
        }
    },
    'koa': { exports: koa },
    'koa-logger': { exports: koa_logger },
    '@koa/cors': { exports: _koa_cors },
    'koa-static': { exports: koa_static },
    'node-fetch': { exports: node_fetch },
    'internal-ip': { exports: internal_ip },
    'opn': { exports: opn },
    'url': { exports: url },
    'path': { exports: path },
    'child_process': { exports: child_process },
    'babel-polyfill': { exports: babel_polyfill },
    'commander': { exports: commander },
    'fs': { exports: fs }
};

    return require('./command');
});