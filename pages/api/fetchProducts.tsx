import products from "./products.json"

export default function handler(req, res) {
  if (req.method === "GET") {
    const allProducts = products.map((product) => {

      const { ...props } = product;
      return props;
    });

    res.status(200).json(allProducts);
  }
  else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}
