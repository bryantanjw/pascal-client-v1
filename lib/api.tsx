import { server } from '../config'

export const fetchEventData = async (slug) => {
    try {
        const response = await fetch(`${server}/api/fetchEventData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug }),
        });
        console.log(response)
        const item = await response.json()

        return item
    } catch (err) {
        console.log('Error:', err.message)
    }
}

export const fetchNewsData = async (search) => {
    // API documentation: https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/bing-news-search1
    try {
        const response = await fetch(`https://bing-news-search1.p.rapidapi.com/news/search?q=${search}&count=4&freshness=Day&textFormat=Raw&safeSearch=Off`, {
            method: 'GET',
            headers: {
                'X-BingApis-SDK': 'true',
                'X-RapidAPI-Key': '1553c27563msheb6fe212a68fa57p1ed6b5jsn460d11bee52a',
                'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }
        })
        console.log(response)
        const newsData = await response.json()

        return newsData
    } catch (err) {
        console.log('fetchNewsData error:', err)
    }
}