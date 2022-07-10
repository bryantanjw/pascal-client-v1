export const fetchProductData = async (slug) => {
    try {
        const response = await fetch("http://localhost:3000/api/fetchProductData", {
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