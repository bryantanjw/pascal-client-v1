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

export const fetchNewsData = async (search, date) => {
    // API documentation: https://newsapi.org/
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&sortBy=publishedAt&language=en&pageSize=4&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`, {
            method: 'GET',
        })
        console.log(response)
        const newsData = await response.json()

        return newsData
    } catch (err) {
        console.log('fetchNewsData error:', err)
    }
}