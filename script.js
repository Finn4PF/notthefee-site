
function loadTopDeals() {
  fetch('deals_live.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('deal-table-container');
      const table = document.createElement('table');
      table.innerHTML = '<tr><th>Deal</th><th>Value</th><th>Stage</th><th>Funding Company</th><th>Owner</th><th>Package Puller</th><th>Last Updated</th></tr>';
      data.forEach(deal => {
        table.innerHTML += `
          <tr>
            <td>${deal.deal_name}</td>
            <td>$${deal.value.toLocaleString()}</td>
            <td>${deal.pipeline_stage}</td>
            <td>${deal.funding_company}</td>
            <td>${deal.ownership}</td>
            <td>${deal.package_puller}</td>
            <td>${new Date(deal.last_stage_change).toLocaleDateString()}</td>
          </tr>`;
      });
      container.innerHTML = '';
      container.appendChild(table);
    });
}

function filterStandings(period) {
  fetch('standings.json')
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(d => d.Period === period);
      const container = document.getElementById('standings-table-container');
      const table = document.createElement('table');
      table.innerHTML = '<tr><th>Metric</th><th>Role Type</th><th>Rank</th><th>Name</th><th>Total</th></tr>';
      filtered.forEach(item => {
        table.innerHTML += `
          <tr>
            <td>${item.Metric}</td>
            <td>${item["Role Type"]}</td>
            <td>${item.Rank}</td>
            <td>${item.Name}</td>
            <td>${typeof item.Total === 'number' ? item.Total.toLocaleString() : item.Total}</td>
          </tr>`;
      });
      container.innerHTML = '';
      container.appendChild(table);
    });
}

window.onload = function () {
  loadTopDeals();
  filterStandings('Year-To-Date'); // Default view for standings
};
