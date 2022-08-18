import { server } from '../config'

export const fetchMarketData = async (slug) => {
    try {
        const response = await fetch(`${server}/api/fetchMarketData`, {
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