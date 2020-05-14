
function getDefaultPronunciationSource (pron) {
    const sources = pron.querySelectorAll('span.daud > amp-audio > source')
    if(!sources || !sources.length) return
    const mp3 = Array.from(sources).filter(x => x.src.endsWith('.mp3'))
    if(mp3) return mp3[0].src
    return Array.from(sources)[0].src
}

class PronunciationScraper {
    validate(element) {
        return true
    }
    scrap(element) {
        if(!this.validate(element)) {
            throw new Error('Element is not valid for pronunciation scraping.')
        }
        const result = []
        const prons = Array.from(element.children).find(x => x.classList.contains('pos-header')).querySelectorAll('span.dpron-i')
        prons.forEach(pron => {
            result.push({
                accent: pron.querySelector('span.region').innerHTML.toUpperCase(),
                pronunciation: pron.querySelector('span.pron > span.ipa') ? pron.querySelector('span.pron > span.ipa').innerHTML : undefined,
                url: getDefaultPronunciationSource(pron)
            })
        });
        return result
    }
}

module.exports = new PronunciationScraper()