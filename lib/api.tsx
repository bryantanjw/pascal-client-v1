import { baseURL } from '../config'

export const fetchEventData = async (slug) => {
    try {
        const response = await fetch(`${baseURL}/api/fetchEventData`, {
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