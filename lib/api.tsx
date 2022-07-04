export const fetchProductData = async (slug) => {
    const response = await fetch("http://localhost:3000/api/fetchProductData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
    });
    const item = await response.json();
    return item;
}