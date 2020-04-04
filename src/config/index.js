const ConfigManager = require('./config-manager')
const dotenv = require('dotenv')

dotenv.config()
const configManager = new ConfigManager({
    namespace: 'RiseVocab'
})

module.exports = configManager.getConfigs()