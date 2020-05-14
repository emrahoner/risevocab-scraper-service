const jsdom = require('jsdom')
const pronunciation = require('./cambridge/pronunciation-scraper')
const wordType = require('./cambridge/word-type-scraper')
const definitions = require('./cambridge/definitions-scraper')
const constants = require( './cambridge/constants')

function addWordType(entry, word) {
    if(entry) {
        if(entry.wordTypes && entry.wordTypes.length > 0 && entry.wordTypes.find(x => x.wordType === word.wordType)) {
            const wordType = entry.wordTypes.find(x => x.wordType === word.wordType)
            for(const definition of word.definitions) {
                wordType.definitions.push(definition)
            }
        } else {
            if(!entry.wordTypes) {
                entry.wordTypes = []
            }
            entry.wordTypes.push(word)
        }
    }
}

class CambridgeScraper {
    async scrap(word) {
        const now = new Date()
        let result = { word, metadata : { source: constants.source, version: constants.version }, entry : { word } }
        const response = await jsdom.JSDOM.fromURL(`${constants.url}${word}`)
        const article = response.window.document.querySelector('article#page-content')
        const superEntries = Array.from(article.children).filter(x => x.tagName.toLowerCase() === 'h1' && x.classList.contains('superentry'))
        for(const superEntry of superEntries) {
            if(superEntry.querySelector('b.tb.ttn').innerHTML === word) {
                if(superEntry.nextElementSibling.tagName.toLowerCase() === 'div' && superEntry.nextElementSibling.classList.contains('page')) {
                    const entries = superEntry.nextElementSibling.querySelectorAll('div.entry > div.entry-body > div.pr')
                    for(const entry of entries) {
                        addWordType(result.entry, {
                            wordType: wordType.scrap(entry),
                            pronunciations: pronunciation.scrap(entry),
                            definitions: definitions.scrap(entry)
                        })
                    }
                }
            }
        }
        return result
    }
}

module.exports = new CambridgeScraper()