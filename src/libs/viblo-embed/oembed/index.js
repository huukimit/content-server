import axios from 'axios'

const requestNoembedHTML = params => axios.get('https://noembed.com/embed', { params })

const providers = {
    'youtube': /^http[s]?:\/\/(?:www\.)?(youtube\.com|youtu\.be)/,
    'vimeo': /^http[s]?:\/\/(?:www\.)?(vimeo\.com)/,
    'slideshare': /^http[s]?:\/\/(?:www\.)?(slideshare\.net)/,
}

const sitesEmbedByID = {
    youtube: 'https://www.youtube.com/watch?v=',
    vimeo: 'https://vimeo.com/',
    slideshare: 'https://www.slideshare.net/slideshow/embed_code/',
}

const convertIdToURL = (id, provider) => {
    const makeURL = (baseURI, path) => `${baseURI}${path}`
    const baseURI = sitesEmbedByID[provider]
    return baseURI ? makeURL(baseURI, id) : id
}

const isOembed = (url, provider) => {
    // Support legacy embed, need provider name:
    if (provider) {
        return !!providers[provider]
    }

    const validRegex = /^http[s]?:\/\/(?:www\.)?(youtube\.com|youtu\.be|vimeo\.com|slideshare\.net)/
    return validRegex.test(url)
}

const fetchNoembed = async (url) => {
    // Noembed always returns "200 OK".
    const response = await requestNoembedHTML({ url, format: 'json' })
    const error = response.data.error
    const embedNotFound = error && error.match(/(404)/)

    if (!embedNotFound) {
        return response
    }

    return await requestNoembedHTML({ url: `${url}?v=${new Date().getTime()}` })
}

const render = async (url, provider = null) => {
    // Because of legacy embed allows id use instead of URL.
    const isIdUsing = !url.startsWith('http')

    // Support render ID:
    if (isIdUsing && provider) {
        url = convertIdToURL(url, provider)
    }

    const { data: { html, title } } = await fetchNoembed(url)

    if (!html) {
        throw new Error('Could not found HTML in response from Oembed provider')
    }

    return { html, title }
}

export default {
    isOembed,
    render
}
