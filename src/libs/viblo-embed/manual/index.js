import parsers from './parsers'
import { renderEmbed } from '../utils/embed'

const SITE_REGEX = /^http[s]?:\/\/(?:www\.)?(gist\.github\.com|jsfiddle\.net|docs\.google\.com\/presentation)/

const detectProvider = (url) => {
    const match = url.match(SITE_REGEX)
    if (!match) return
    return ({
        'gist.github.com': 'gist',
        'jsfiddle.net': 'jsfiddle',
        'docs.google.com/presentation': 'googleslide',
        'codepen.io': 'codepen'
    })[match[1]]
}

const render = (url, provider = null) => new Promise((resolve, reject) => {
    try {
        const site = provider ? provider : detectProvider(url)
        const iframe = parsers[site](url)
        const html = renderEmbed(iframe)
        resolve({ html })
    } catch (e) {
        reject(e)
    }
})

export default {
    render
}
