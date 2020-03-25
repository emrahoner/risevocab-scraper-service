const ConfigManager = require('./config-manager')
const dotenv = require('dotenv')

dotenv.config()
const configManager = new ConfigManager({
    namespace: 'EmonsProjects'
})

module.exports = configManager.getConfigs()