import events from "./events.json"

export default function handler(req, res) {
  if (req.method === "GET") {
    const allEvents = events.map((event) => {

      const { ...props } = event;
      return props;
    });

    res.status(200).json(allEvents);
  }
  else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}
