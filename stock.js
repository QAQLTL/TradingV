// api/stock.js
export default async function handler(req, res) {
  const { symbol = "AAPL", interval = "daily" } = req.query;
  const API_KEY = process.env.ALPHA_VANTAGE_KEY;

  let url;
  if (interval === "daily") {
    url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  } else {
    url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=compact&apikey=${API_KEY}`;
  }

  try {
    const resp = await fetch(url);
    const json = await resp.json();
    const seriesKey = Object.keys(json).find(k => k.toLowerCase().includes("time series"));
    if (!seriesKey) {
      return res.status(500).json({ error: "Unexpected API response", data: json });
    }

    const series = json[seriesKey];
    const times = Object.keys(series).sort();
    const data = times.map(t => ({
      time: t,
      open: +series[t]["1. open"],
      high: +series[t]["2. high"],
      low: +series[t]["3. low"],
      close: +series[t]["4. close"]
    }));

    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json({ symbol, data });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
