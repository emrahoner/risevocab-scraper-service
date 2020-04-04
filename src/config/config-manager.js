const path = require('path')

// Example options object
// {
//     type: 'env',
//     namespace: 'ABC',
//     mergeWith: {
//         local: {
//             type: 'file',
//             file: 'local.json'
//         },
//         test: {
//             type: 'env',
//             namespace: 'ABC.TEST'
//         }
//     }
// }
const defaultOptions = {
    type: 'env'
}

const configGetters = {
    'file': getConfigsFromFile,
    'env': getConfigsFromEnvVar
}

function convertObjectPathStringToEnvVar (objecPathString) {
    return objecPathString.replace(/\./, '_').toUpperCase()
}

function convertEnvVarToObjectPathArray (namespace, envVar) {
    if (namespace) {
        if(!envVar.startsWith(namespace)) {
            return
        }
        envVar = envVar.substring(namespace.length + 1)
    }
    return envVar.split('_').map(x => x.toLowerCase())
}

function setConfigValueToConfigObject (config, objectPath, value) {
    for(let i = 0; i < objectPath.length - 1; i++) {
        let path = objectPath[i]
        if(!config[path] || typeof config[path] !== 'object')
            config[path] = {}
        config = config[path]
    }
    config[objectPath[objectPath.length - 1]] = value
}

function getConfigsFromEnvVar (options) {
    const configs = {}
    const namespace = options.namespace ? convertObjectPathStringToEnvVar(options.namespace) : undefined
    const objectPaths = Object.keys(process.env).map(x => ({ key: x, path: convertEnvVarToObjectPathArray(namespace, x.toUpperCase())})).filter(x => x.path)
    for (var objectPath of objectPaths) {
        setConfigValueToConfigObject(configs, objectPath.path, process.env[objectPath.key])
    }
    return configs
}

function getConfigsFromFile (options) {
    const rootFolder = process.env['PWD']
    return require(path.join(rootFolder, options.file))
}

function getConfigs (options) {
    const configGetter = configGetters[options.type]
    if (configGetter) {
        let x = configGetter(options)
        return x
    }
}

function mergeObjects (object1, object2) {
    if(!object1) return object2
    if(!object2) return object1

    for(let key in object2){
        if(!object1[key] || typeof object1[key] !== typeof object2[key]) {
            object1[key] = object2[key]
        } 
        else if (typeof object1[key] === typeof object2[key] === 'object') {
            mergeObjects(object1[key], object2[key])
        }
    }
    return object1
}

function mergeConfig (config, mergeOptions) {
    if (mergeOptions && process.env['NODE_ENV']) {
        let mergeOption = mergeOptions[process.env['NODE_ENV']]
        if (mergeOption)
            return mergeObjects(config, getConfigs(mergeOption))
    }
    return config
}

class ConfigManager {
    constructor (options) {
        this.options = { ...defaultOptions, ...(options || {}) }
        this.configs = mergeConfig(getConfigsFromEnvVar(this.options), this.options.mergeWith)
    }

    getConfigs() {
        return this.configs
    }
}

module.exports = ConfigManager