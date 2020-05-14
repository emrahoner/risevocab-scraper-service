const sentences = require('./sentences-scraper')

function trimDefinition (def) {
    def = def.trim()
    return def.endsWith(':') ? def.substring(0, def.length - 1) : def
}

class DefinitionsScraper {
    validate(element) {
        return true
    }
    scrap(element) {
        if(!this.validate(element)) {
            throw new Error('Element is not valid for definitions scraping.')
        }
        const result = []
        const definitions = Array.from(element.children).find(x => x.classList.contains('pos-body')).querySelectorAll('div.dsense > div.sense-body > div.def-block')
        for(const definition of definitions) {
            result.push({
                definition: trimDefinition(definition.querySelector('div.ddef_h > div.def').textContent),
                sentences: sentences.scrap(definition)
            })
        }
        return result
    }
}

module.exports = new DefinitionsScraper()