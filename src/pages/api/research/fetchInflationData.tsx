const handler = async (req, res) => {
  const ticker = req.query.ticker.toString();
  const year = req.query.year;

  const options = {
    registrationKey: process.env.BLS_API_KEY,
    seriesid: ticker.split(","),
    startyear: "2012",
    endyear: `${year}`,
    calculations: true,
  };

  const response = await (
    await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(options),
    })
  ).json();
  const { Results } = response;

  res.json(Results.series);
};

export default handler;
