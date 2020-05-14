
class SentencesScraper {
    validate(element) {
        return element.tagName.toLowerCase() === 'div' &&
            element.classList.contains('def-block')
    }
    scrap(element) {
        if(!this.validate(element)) {
            throw new Error('Element is not valid for sentences scraping.')
        }
        const result = []
        const sentences = element.querySelectorAll('div.def-body > div.examp > span.eg')
        for(const sentence of sentences) {
            result.push(sentence.textContent)
        }
        return result
    }
}

module.exports = new SentencesScraper()