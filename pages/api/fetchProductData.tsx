// This endpoint will send the user a file from IPFS
import products from "./products.json";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { slug } = req.body;

        if (!slug) {
            res.status(400).send("Missing product slug");
        }

        for(let i = 0; i < products.length; i++) {
            let found = false;
            if (products[i].slug === slug) {
                const { ...props } = products[i];
                found = true;
                res.status(200).send({ props });
                break;
            }
            if (i === products.length - 1 && !found) {
                res.status(404).send("Product not found");
            }
        }
    } else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }
}