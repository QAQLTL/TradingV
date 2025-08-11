async function loadData() {
  const symbol = document.getElementById('symbol').value;
  const resp = await fetch(`/api/stock?symbol=${symbol}&interval=daily`);
  const json = await resp.json();
  if (!json.data) {
    alert("讀取失敗");
    return;
  }

  const times = json.data.map(d => d.time);
  const trace = {
    x: times,
    open: json.data.map(d => d.open),
    high: json.data.map(d => d.high),
    low: json.data.map(d => d.low),
    close: json.data.map(d => d.close),
    type: 'candlestick'
  };

  Plotly.newPlot('chart', [trace], { title: `${symbol} K 線圖` });
}

loadData();
