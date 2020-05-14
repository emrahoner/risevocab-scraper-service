
class WordTypeScraper {
    validate(element) {
        return element.tagName.toLowerCase() === 'div' &&
            element.classList.contains('pr') &&
            Array.from(element.children).find(x => x.classList.contains('pos-header')) &&
            Array.from(element.children).find(x => x.classList.contains('pos-body')) &&
            Array.from(element.children).find(x => x.classList.contains('pos-header')).querySelectorAll('div.posgram > span.pos').length === 1
    }
    scrap(element) {
        if(!this.validate(element)) {
            throw new Error('Element is not valid for word type scraping.')
        }

        return Array.from(element.children).find(x => x.classList.contains('pos-header')).querySelector('div.posgram > span.pos').innerHTML
    }
}

module.exports = new WordTypeScraper()