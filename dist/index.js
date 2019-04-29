module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(86);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 16:
/***/ (function(module, __unusedexports, __webpack_require__) {

const getValue = __webpack_require__(913)

/**
 * Apply the environment variables to `process.env`
 * @param  {Object} env      Map of environment variables
 * @param  {Object} secrets  Map of secrets
 * @param  {Object} required Map of required values
 */
function applyEnv(env, secrets = {}, required = {}) {
  if (Array.isArray(env)) {
    env.forEach(key => {
      // if the key already exists don't overwrite it
      if (!process.env[key]) {
        const value = getValue(key, {}, secrets, required)
        process.env[key] = value
      }
    })
  } else {
    Object.entries(env).forEach(([key, value]) => {
      // if the key already exists don't overwrite it
      if (!process.env[key]) {
        const value = getValue(key, env, secrets, required)
        process.env[key] = value
      }
    })
  }
}

module.exports = applyEnv


/***/ }),

/***/ 39:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

"use strict";


const loadSecrets = __webpack_require__(316)
const loadRequired = __webpack_require__(956)

const loadNowJSON = __webpack_require__(732)
const loadPkgJSON = __webpack_require__(287)

/**
 * Check if is running inside Now.sh and apply variables and secrets to `process.env`
 */
function config() {
  // only run this if it's not running inside Now.sh
  if (Boolean(process.env.NOW)) return

  const secrets = loadSecrets()
  const required = loadRequired()

  // load environment variables from now.json
  const hasLoaded = loadNowJSON(secrets, required)

  // if now.json doesn't exists
  if (!hasLoaded) {
    // load from package.json
    loadPkgJSON(secrets, required)
  }
}

// run
config()


/***/ }),

/***/ 64:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 66:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 86:
/***/ (function(module, __unusedexports, __webpack_require__) {

const osapi = __webpack_require__(857)
__webpack_require__(39)

console.log(`Process env`, process.env)

const s3 = new osapi.createConnection({
  endPoint: 'https://sfo2.digitaloceanspaces.com',
  accessKey: 'sadsadasdsa',
  secretAccessKey: 'asadsdasdsadsa',
  bucket: 'asdsadsadas-dev',
})
async function doThing() {
  return true
}

module.exports = {
  doThing
}


/***/ }),

/***/ 176:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const MODULE_REQUIRE = 1
	/* built-in */
	, fs = __webpack_require__(66)
	, path = __webpack_require__(589)
	
	/* NPM */
	
	/* in-package */
	;

let packageOf = function(id, mod) {
	let packageJson = null;
	
	let pathname = require(id, mod.paths);
	let dirname = fs.statSync(pathname).isDirectory() ? pathname : path.dirname(pathname);

    do {
		let packageJsonPath = path.join(dirname, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            packageJson = require(packageJsonPath);
            break;
        }

        if (dirname == (dirname = path.dirname(dirname))) {
            throw new Error('package.json not found');
        }
    } while(1);
    
    return packageJson;
};

module.exports = packageOf;

/***/ }),

/***/ 236:
/***/ (function(module) {

/**
 * Check to see if a module is missing by examining the error code
 * @return {Boolean} If module is missing
 */
function isModuleMissing(error) {
  return error.code === 'MODULE_NOT_FOUND' ||
    error.code === 'ERR_MISSING_MODULE'
}

module.exports = isModuleMissing;


/***/ }),

/***/ 257:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const MODULE_REQUIRE = 1
	/* built-in */
	, path = __webpack_require__(589)
	
	/* NPM */
	
	/* in-package */
	, getCallerFileName = __webpack_require__(895)
    , getCallerPackageDir = __webpack_require__(404)
    , getCallerDir = () => path.dirname(getCallerFileName(1))
	;

function bindings(name) {
	let dirname = getCallerPackageDir();
	let pathname = path.join(dirname, 'build', 'Release', name);
	return require(pathname);
}

module.exports = bindings;


/***/ }),

/***/ 287:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { resolve } = __webpack_require__(589)
const applyEnv = __webpack_require__(16)
const isModuleMissing = __webpack_require__(236)

/**
 * Apply the environment variables from `./package.json`
 * @param  {Object}  secrets  Map of secrets
 * @param  {Object}  required Map of required values
 * @return {Boolean}          If the environment variables were applied
 */
function loadPkgJSON(secrets = {}, required = {}) {
  const PKG_PATH = resolve('./package.json')

  try {
    const pkgFile = __webpack_require__(499)

    if (pkgFile.now && pkgFile.now.env) {
      applyEnv(pkgFile.now.env, secrets, required)
    }

    return true
  } catch (error) {
    if (isModuleMissing(error)) {
      return false
    }
    throw error
  }
}

module.exports = loadPkgJSON


/***/ }),

/***/ 316:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { resolve } = __webpack_require__(589)
const isModuleMissing = __webpack_require__(236)

/**
 * Load the environment secrets from `./now-secrets.json`
 * @return {Object} Map of secrets
 */
function loadSecrets() {
  const SECRET_PATH = resolve('./now-secrets.json')

  try {
    return __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module '/Users/vladimirsinitsyn/git/express/now-secrets.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
  } catch (error) {
    if (isModuleMissing(error)) {
      return {}
    }
    throw error
  }
}

module.exports = loadSecrets


/***/ }),

/***/ 321:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/**
 * Node Developing Assistant.
 * @author youngoat@163.com
 */



const MODULE_REQUIRE = 1
    /* built-in */
    , fs = __webpack_require__(66)
    , os = __webpack_require__(431)
    , path = __webpack_require__(589)
    , util = __webpack_require__(64)

    /* NPM */

    /* in-package */
    , findInDirectory = __webpack_require__(907)
    , getCallerFileName = __webpack_require__(895)
    , getCallerPackageDir = __webpack_require__(404)
    , getCallerDir = () => path.dirname(getCallerFileName(1))
    ;


/**
 * Return the package.json object of the package in which the caller is located.
 * @return {object}
 */
let currentPackage = function() {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();

    // Return the meta json of the package.
    return __webpack_require__(474)(dirname + "/package.json");
};

/**
 * Whether file/directory exists in the package in which the caller is located.
 * @param {string}   subpath          path relative to the homedir of current package
 * @param {boolean}  resolveAsModule  try to resolve the subpath as it is a module
 * @return {boolean}
 */
let inExists = function(subpath, resolveAsModule) {
    if (arguments.length == 1) {
        resolveAsModule = false;
    }

    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);

    let ret;

    if (resolveAsModule) {
        ret = fs.existsSync(pathname)
            || fs.existsSync(`${pathname}.js`)
            || fs.existsSync(`${pathname}.json`)
            || fs.existsSync(path.join(pathname, 'index.js'))
            || fs.existsSync(path.join(pathname, 'index.json'))
            ;
    }
    else {
        ret = fs.existsSync(pathname);
    }
    return ret;
};

/**
 * Read file in the package in which the caller is located.
 * @param {string}   subpath          path relative to the homedir of current package
 * @param {string}  [encoding]
 * @param {boolean} [nullIfNotFound]
 * @return {string|Buffer}
 */
let inRead = function(subpath, encoding, nullIfNotFound) {
    if (arguments.length == 3) {
        // DO NOTHING.
    }
    else if (arguments.length == 2) {
        if (typeof arguments[1] == 'boolean') {
            encoding = null;
            nullIfNotFound = arguments[1];
        }
        else if (typeof arguments[1] == 'string') {
            encoding = arguments[1];
            nullIfNotFound = false;
        }
        else {
            throw new Error('The second argument should be a string (encoding) or boolean (nullIfNotFound) value.');
        }
    }

    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);

    let ret = null;
    if (!fs.existsSync(pathname)) {
        if (!nullIfNotFound) {
            throw new Error(`File not found: ${pathname}`);
        }
    }
    else {
        ret = fs.readFileSync(pathname, encoding);
    }

    return ret;
}

/**
 * Read the contents of a directory.
 * @param {string}   subpath          path relative to the homedir of current package
 * @return {string[]}
 */
let inReaddir = function(subpath) {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);
    
    return fs.readdirSync(pathname);
};

/**
 * To require some sub module in same package with fixed subpath wherever the caller is located.
 *
 * @example
 * // PACKAGE_HOMEDIR/lib/index.js
 *
 * // PACKAGE_HOMEDIR/foo.js
 * noda.inRequire('lib');
 *
 * // PACKAGE_HOMEDIR/foo/bar.js
 * noda.inRequire('lib');
 *
 * @param {string} subpath sub module's path relative to the home directory of the package in which the caller is located.
 */
let inRequire = function(subpath, nullIfNotFound) {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    let pathname = path.join(dirname, subpath);

    let mod = null;
    try {
        mod = require(pathname);
    } catch (ex) {
        if (nullIfNotFound && ex.code === 'MODULE_NOT_FOUND') {
            mod = null;
        }
        else {
            throw ex;
        }
    }
    return mod;
};

/**
 * Resolve the subpath into an absolute path.
 * The subpath is relative to the home directory of the package in which the caller is located.
 * @param {string} subpath subpath relative to the home directory of the package in which the caller is located.
 */
let inResolve = function(...subpath) {
    // Find home directory of the package in which the caller is located.
    let dirname = getCallerPackageDir();
    return path.join.apply(path, [ dirname ].concat(subpath));
};

/**
 * Require module whose name is same with the name of current platform.
 * @param {string} dirname
 */
let osRequire = (dirname) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(getCallerDir(), dirname);
    }

    try {
        return require(path.join(dirname, os.platform()));
    }
    catch (ex) {
        if (ex.code === 'MODULE_NOT_FOUJND') {
            throw new Error(`current platform not supported: ${os.platform()}`);
        }
        else {
            throw ex;
        }
    }
};

/**
 * Read the directory and require all javascript modules except those excluded.
 * ATTENTION: Directory 'node_modules' is always excluded.
 * @param  {string}  dirname
 * @param  {Array}  [excludes = ['index']]  names to be excluded(ignored)
 * @param  {string} [exlucdes]              the only name to be excluded(ingored)
 * @return {Object}
 */
let requireDir = (dirname, excludes) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(getCallerDir(), dirname);
    }

    // Uniform the argument "excludes".
    if (util.isUndefined(excludes)) {
        excludes = [ 'index' ];
    }
    else if (util.isString(excludes)) {
        excludes = [ excludes ];
    }
    excludes = excludes.map(exclude => exclude.replace(/\.js$/, ''));

    // Iterate the directory and require sub modules.
    let mod = {};
    fs.readdirSync(dirname).forEach((name) => {
        let pathname = path.join(dirname, name);
        let modname = null;

        if (!excludes.includes['*'] && path.extname(name) === '.js') {
            modname = name.replace(/\.js$/, '');
        }
        else if (fs.statSync(pathname).isDirectory()
            && !excludes.includes('*/')
            && fs.existsSync(path.join(pathname, 'index.js'))) {
            modname = name;
        }

        if (modname && !excludes.includes(modname)) {
            mod[modname] = require(pathname);
        }
    });
    return mod;
};

/**
 * Based on requireDir(), but the dirname is regarded as relative path to home directory of the package in which the caller is located.
 */
let inRequireDir = (dirname, excludes) => {
    dirname = path.join(getCallerPackageDir(), dirname);
    return requireDir(dirname, excludes);
};

/**
 * Read file next to the file in which the caller is located.
 * @param {string}   subpath          path relative to the directory of the caller file
 * @param {string}  [encoding]
 * @param {boolean} [nullIfNotFound]
 * @return {string|Buffer}
 */
let nextRead = function(subpath, encoding, nullIfNotFound) {
    if (arguments.length == 3) {
        // DO NOTHING.
    }
    else if (arguments.length == 2) {
        if (typeof arguments[1] == 'boolean') {
            encoding = null;
            nullIfNotFound = arguments[1];
        }
        else if (typeof arguments[1] == 'string') {
            encoding = arguments[1];
            nullIfNotFound = false;
        }
        else {
            throw new Error('The second argument should be a string (encoding) or boolean (nullIfNotFound) value.');
        }
    }

    // Find the directory of the file in which the caller is located.
    let dirname = getCallerDir();
    let pathname = path.join(dirname, subpath);

    let ret = null;
    if (!fs.existsSync(pathname)) {
        if (!nullIfNotFound) {
            throw new Error(`File not found: ${pathname}`);
        }
    }
    else {
        ret = fs.readFileSync(pathname, encoding);
    }

    return ret;
}

/**
 * Find sub-directory or file in ascent directory and return the full path.
 * @param {string} pathname relative pathname of sub-directory or file
 * @return {string}
 */
let upResolve = (pathname) => {
    let cwd = getCallerDir();
    let realPathname = null;
    for (let d = null; d != cwd && !realPathname; cwd = path.dirname(cwd)) {
        let p = path.join(cwd, pathname);
        if (fs.existsSync(p)) realPathname = p;
        else d = cwd;
    }
    return realPathname;
};

/**
 * Find sub-directory or file in descent directory and return the full path.
 * @param {string}  pathname     - relative pathname of sub-directory or file
 * @param {number} [depth=9]     - max depth to search
 * @param {string} [order=bfs]   - DFS (Depth-First Search) or BFS (Breadth-First Search)
 * @return {string}
 */
let downResolve = function(pathname) {
    let depth = null, order = null;
    for (let i = 1, arg; i < arguments.length; i++) {
        switch (typeof arguments[i]) {
            case 'number':
                if (depth === null) depth = arguments[i];
                else throw new Error(`duplicated arguments: {number} depth`);
                break;
            case 'string':
                if (order === null) order = arguments[i];
                else throw new Error(`duplicated arguments: {string} order`);
                break;
            default:
                if (!util.isUndefined(arguments[i]) && arguments[i] !== null) {
                    throw new Error(`unrecognized argument: ${arguments[i]}`);
                }
        }
    }

    if (depth === null) depth = 9;
    if (order === null) order = 'bfs';

    order = order.toLowerCase();
    let cwd = getCallerDir();
    if (order == 'dfs') {
        return findInDirectory.depth_first(cwd, pathname, depth);
    }
    if (order == 'bfs') {
        return findInDirectory.breadth_first(cwd, pathname, depth);
    }
    throw new Error(`invalid order: ${order}`);
};

/**
 * Return the root path of current package.
 */
let packageRoot = function() {
    return inResolve('.');
};

module.exports = {
    bindings: __webpack_require__(257),
    packageOf: __webpack_require__(176),
    
    currentPackage,
    inExists,
    inRead,
    inReaddir,
    inRequire,
    inRequireDir,
    inResolve,

    nextRead,
    
    osRequire,
    requireDir,

    upResolve,
    downResolve,

    'existsInPackage': inExists,
    'readInPackage': inRead,
    'requireInPackage': inRequire,
    'requireDirInPackage': inRequireDir,
    'resolveInPackage': inResolve,
};

/***/ }),

/***/ 404:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const MODULE_REQUIRE = 1
    /* built-in */
    , fs = __webpack_require__(66)
    , path = __webpack_require__(589)
    
    /* NPM */
    
    /* in-package */
    , getCallerFileName = __webpack_require__(895)
    ;

// Find home directory of the package in which the caller is located.
module.exports = function() {
    let pathname = getCallerFileName(1);
    let dirname = path.dirname(pathname);
    while (!fs.existsSync(path.join(dirname, 'package.json'))) {
        let parentDirname = path.dirname(dirname);
        if (parentDirname === dirname) {
            throw new Error('Module not located in any node.js package: ' + pathname);
        }
        else {
            dirname = parentDirname;
        }
    }
    return dirname;
};

/***/ }),

/***/ 415:
/***/ (function(module) {

"use strict";


const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    ;
    
/**
 * Iterate the source object and create a new one.
 * @param  {Object}               source    the source object
 * @param  {Array|RegExp|string} [keynames] names (if string) or name-patterns (if RegExp) of keys in the source object to be cloned
 * @param  {Function}            [mapper]   mapping function(key, value) which should return mapped [ new-key, new-value ] couple
 * @param  {boolean}             [remove]   delete matching properties from the source object
 */
function cloneObject(source /* , keynames, mapper, remove = false */) {
    // Uniform arguments.
    let keynames, mapper, remove;
    for (let i = 1, arg; i < arguments.length; i++) {
        arg = arguments[i];
        if (0) {}
        else if (typeof arg == 'function') mapper = arg;
        else if (typeof arg == 'boolean') remove = arg;
        else if (typeof arg == 'string' || arg instanceof RegExp) keynames = [ arg ];
        else if (arg instanceof Array) keynames = arg;
        else throw new Error(`unexpected argument: ${arg}`);
    }

    // ---------------------------
    // Main process.

    var copy = {};

    if (keynames) {
        keynames.forEach(keyname => {
            if (typeof keyname == 'string') {
                if (source.hasOwnProperty(keyname)) {
                    copy[keyname] = source[keyname];
                }
            }
            else if (keyname instanceof RegExp) {
                Object.keys(source).forEach(keyname2 => {
                    if (keyname.test(keyname2)) {
                        copy[keyname2] = source[keyname2];
                    }
                });
            }
        });
    }
    else {
        Object.assign(copy, source);
    }

    let clonedKeynames;

    if (mapper) {
        let rawCopy = copy;
        clonedKeynames = [];
        copy = {};

        for (let keyname in rawCopy) {
            let couple = mapper(keyname, rawCopy[keyname]);
            if (couple instanceof Array && couple.length == 2) {
                copy[ couple[0] ] = couple[1];
                clonedKeynames.push(keyname);
            }
            else if ([ null, false, undefined ].includes(couple)) {
                // DO NOTHING.
                // The key-value couple will be ignored in the copy.
            }
            else {
                // Invalid returned value.
                throw new Error('The return value of the mapper function should be an array made up of keyname and value, or null to delete the input key-value couple.');
            }
        }
    }
    else {
        clonedKeynames = Object.keys(copy);
    }

    if (remove) {
        clonedKeynames.forEach(keyname => { delete source[keyname]; });
    }

    return copy;
}

module.exports = cloneObject;

/***/ }),

/***/ 431:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 474:
/***/ (function(module, __unusedexports, __webpack_require__) {

var map = {
	"./package.json": 508
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 474;

/***/ }),

/***/ 499:
/***/ (function(module) {

module.exports = {"name":"nodejs-express","version":"1.0.0","main":"index.js","license":"MIT","dependencies":{"express":"^4.16.4","helmet":"^3.16.0","jinang":"^0.25.0","noda":"^0.5.0","now-env":"^3.1.0","osapi":"^0.9.6"},"scripts":{"start":"node ."}};

/***/ }),

/***/ 508:
/***/ (function(module) {

module.exports = {"name":"noda","version":"0.5.0","description":"NOde Developing Assistant","main":"index.js","scripts":{"test":"echo \"Error: no test specified\" && exit 1"},"keywords":["bindings","require","require-addon","require-all","package-homepath"],"author":{"name":"YounGoat","email":"youngoat@163.com","url":"https://youngoat.github.io"},"engines":{"node":">=6"},"license":"ISC","bin":{},"dependencies":{},"devDependencies":{},"directories":{},"homepage":"https://github.com/YounGoat/noda","repository":{"type":"git","url":"https://github.com/YounGoat/noda.git"}};

/***/ }),

/***/ 589:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 732:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { resolve } = __webpack_require__(589)
const applyEnv = __webpack_require__(16)
const isModuleMissing = __webpack_require__(236)

/**
 * Apply the environment variables from `./now.json`
 * @param  {Object}  secrets  Map of secrets
 * @param  {Object}  required Map of required values
 * @return {Boolean}          If the environment variables were applied
 */
function loadNowJSON(secrets = {}, required = {}) {
  const NOW_PATH = resolve(process.env.NOW_CONFIG || './now.json')

  try {
    const nowFile = require(NOW_PATH)

    if (nowFile.env) {
      applyEnv(nowFile.env, secrets, required)
    }

    return true
  } catch (error) {
    if (isModuleMissing(error)) {
      return false
    }
    throw error
  }
}

module.exports = loadNowJSON


/***/ }),

/***/ 857:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , noda = __webpack_require__(321)
    , cloneObject = __webpack_require__(415)
    
    /* in-package */
    , s3 = noda.inRequire('s3')
    , swift = noda.inRequire('swift')
    ;

function createConnection(options) { 
    options = cloneObject(options, (key, value) => [ key.toLowerCase(), value ]);

    let Conn = null;
    if (options.username || options.subusername || options.subuser) {
        Conn  = swift.Connection;
    }
    else {
        Conn = s3.Connection;
    }

    return new Conn(options);
}

function isConnection(conn) {
    return conn instanceof s3.Connection || conn instanceof swift.Connection;
}

function getConnectionStyle(conn) {
    return isConnection(conn) ? conn.get('style') : null;
}

module.exports = {
    createConnection,
    isConnection,
    getConnectionStyle,
};

/***/ }),

/***/ 895:
/***/ (function(module) {

"use strict";


const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */
    ;

/**
 * @param  {int} [depth=0] set depth larger than 0 if the caller is not the direct one
 */
module.exports = function(depth) {
    // Uniform the arguments.
    if (arguments.length === 0) depth = 0;

    let prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function(err, stack) { return stack; };
    
    let err = new Error();
    let filename = err.stack[2 + depth].getFileName();
    
    Error.prepareStackTrace = prepareStackTrace;

    return filename;
};

/***/ }),

/***/ 907:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const MODULE_REQUIRE = 1
	/* built-in */
	, fs = __webpack_require__(66)
	, path = __webpack_require__(589)

	/* NPM */

	/* in-package */
	;

function depth_first(cwd, pathname, depth) {
	if (!depth) depth = Number.POSITIVE_INFINITY;

	let realPathname = null;
	let p = path.join(cwd, pathname);
	if (fs.existsSync(p)) {
		realPathname = p
	}
	else if (--depth > 0) {
		let names = fs.readdirSync(cwd);
		for (let i = 0, p; !realPathname && i < names.length; i++) {
			p = path.join(cwd, names[i]);
			if (fs.statSync(p).isDirectory()) {
				realPathname = depth_first(p, pathname, depth);
			}
		}
	}
	return realPathname;
}

function breadth_first(cwd, pathname, depth) {
	if (!depth) depth = Number.POSITIVE_INFINITY;

	let realPathname = null;
	let dirnames = null, subdirnames = [ cwd ];
	do {
		dirnames = subdirnames;
		subdirnames = [];

		for (let i = 0; !realPathname && i < dirnames.length; i++) {
			let dirname = dirnames[i];
			let p = path.join(dirname, pathname);
			if (fs.existsSync(p)) {
				realPathname = p;
			}
			else {
				let names = fs.readdirSync(dirname);
				names.forEach(name => {
					p = path.join(dirname, name);
					if (fs.statSync(p).isDirectory()) {
						subdirnames.push(p);
					}
				});
			}
		}
	} while(--depth > 0 && !realPathname && subdirnames.length > 0)

	return realPathname;
}

module.exports = { depth_first, breadth_first };

/***/ }),

/***/ 913:
/***/ (function(module) {

/**
 * Get the value of a environment variable or secret
 * @param  {Object} env      Map of environment variables
 * @param  {Object} secrets  Map of secrets
 * @param  {Object} required Map of required values
 * @param  {String} key      The environment key name
 * @return {String}          The environment value
 */
module.exports = (key, env, secrets = {}, required = {}) => {
  let value

  if (required.hasOwnProperty(key)) {
    // Get required value
    value = required[key]
  } else if (env.hasOwnProperty(key)){
    // Get environment value
    value = env[key]
  } else {
    // If the value is not defined throw an error
    throw new ReferenceError(`The environment variable ${key} is required.`)
  }

  // If the value doesn't start with @ (it's not a secret) return it
  if (`${value}`.indexOf('@') !== 0) {
    return value
  }

  // Otherwise, hand back the secret. This will
  // intentionally return `undefined` if the secret
  // is not defined so that the
  // developers knows it is not defined.
  return secrets[value]
}


/***/ }),

/***/ 956:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { resolve } = __webpack_require__(589)
const isModuleMissing = __webpack_require__(236)

/**
 * Load the environment required values from `./now-required.json`
 * @return {Object} Map of required values
 */
function loadRequired() {
  const REQUIRED_PATH = resolve('./now-required.json')

  try {
    return __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module '/Users/vladimirsinitsyn/git/express/now-required.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
  } catch (error) {
    if (isModuleMissing(error)) {
      return {}
    }
    throw error
  }
}

module.exports = loadRequired


/***/ })

/******/ });