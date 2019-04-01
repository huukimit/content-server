import parsers from './parsers'
import { renderEmbed } from '../utils/embed'

const SITE_REGEX = /^http[s]?:\/\/(?:www\.)?(gist\.github\.com|jsfiddle\.net|codepen\.io|docs\.google\.com\/presentation)/

const detectProvider = (url) => {
    const match = url.match(SITE_REGEX)
    if (!match) return
    return ({
        'gist.github.com': 'gist',
        'jsfiddle.net': 'jsfiddle',
        'docs.google.com/presentation': 'googleslide',
        'codepen.io': 'codepen',
    })[match[1]]
}

const render = async (url, providerName = null) => {
    const provider = providerName ? providerName : detectProvider(url)
    const iframe = parsers[provider](url)
    const html = renderEmbed(iframe)

    return { html }
}

export default {
    render
}
