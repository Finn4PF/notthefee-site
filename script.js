let standingsData = [];

fetch('standings.json')
  .then(res => res.json())
  .then(data => {
    standingsData = data;
    renderLeaderboard('closer', 'Deals');
    renderLeaderboard('puller', 'Deals');
  });

function renderLeaderboard(roleKey, metric) {
  const roleType = roleKey === 'closer' ? 'Top Closers' : 'Top Package Pullers';
  const containerId = roleKey === 'closer' ? 'closer-leaderboard' : 'puller-leaderboard';
  const filtered = standingsData.filter(d =>
    d['Role Type'] === roleType &&
    d['Period'] === 'Year-To-Date' &&
    d['Metric'] === metric
  );

  const container = document.getElementById(containerId);
  const rows = filtered.map(entry =>
    `<tr><td>${entry.Metric}</td><td>${entry.Rank}</td><td>${entry.Name}</td><td>${metric === 'Value' || metric === 'Commission' ? '$' + entry.Total.toLocaleString() : entry.Total}</td></tr>`
  ).join('');

  container.innerHTML = `
    <table>
      <thead>
        <tr><th>Metric</th><th>Rank</th><th>Name</th><th>Total</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function switchTab(roleKey, metric) {
  document.querySelectorAll(`#${roleKey}-tabs .tab-button`).forEach(btn => {
    btn.classList.remove('active');
  });
  const tabs = document.querySelectorAll(`#${roleKey}-tabs .tab-button`);
  tabs.forEach(tab => {
    if (tab.textContent.includes(metric)) {
      tab.classList.add('active');
    }
  });
  renderLeaderboard(roleKey, metric);
}
