
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
      const closers = data.filter(d => d.Period === period && d["Role Type"] === "Top Closers");
      const pullers = data.filter(d => d.Period === period && d["Role Type"] === "Top Package Pullers");

      const closersTable = document.createElement('table');
      closersTable.innerHTML = '<tr><th>Metric</th><th>Rank</th><th>Name</th><th>Total</th></tr>';
      closers.forEach(row => {
        closersTable.innerHTML += `
          <tr>
            <td>${row.Metric}</td>
            <td>${row.Rank}</td>
            <td>${row.Name}</td>
            <td>${formatTotal(row.Total)}</td>
          </tr>`;
      });

      const pullersTable = document.createElement('table');
      pullersTable.innerHTML = '<tr><th>Metric</th><th>Rank</th><th>Name</th><th>Total</th></tr>';
      pullers.forEach(row => {
        pullersTable.innerHTML += `
          <tr>
            <td>${row.Metric}</td>
            <td>${row.Rank}</td>
            <td>${row.Name}</td>
            <td>${formatTotal(row.Total)}</td>
          </tr>`;
      });

      document.getElementById('closers-table-container').innerHTML = '';
      document.getElementById('pullers-table-container').innerHTML = '';
      document.getElementById('closers-table-container').appendChild(closersTable);
      document.getElementById('pullers-table-container').appendChild(pullersTable);
    });
}

function formatTotal(value) {
  if (typeof value === "number") {
    return value >= 1000 ? "$" + value.toLocaleString() : value.toLocaleString();
  }
  return value;
}

window.onload = function () {
  loadTopDeals();
  filterStandings('Year-To-Date');
};


function loadMilestoneClubs() {
  fetch('milestone_data.json')
    .then(response => response.json())
    .then(data => {
      const closers = data.filter(d => d.Role === "Closer");
      const pullers = data.filter(d => d.Role === "Sales Rep");

      const createTable = (group) => {
        const table = document.createElement('table');
        table.innerHTML = '<tr><th>Employee</th><th>Total Deals</th><th>Deals Club</th><th>Total Funding</th><th>Funding Club</th><th>Total Revenue</th><th>Revenue Club</th></tr>';
        group.forEach(person => {
          table.innerHTML += `
            <tr>
              <td>${person.Employee}</td>
              <td>${person.Total_Deals}</td>
              <td>${person["Deals Club"]}</td>
              <td>$${Number(person.Total_Value).toLocaleString()}</td>
              <td>${person["Funding Club"]}</td>
              <td>$${Number(person.Total_Commission).toLocaleString()}</td>
              <td>${person["Revenue Club"]}</td>
            </tr>`;
        });
        return table;
      };

      const closerTable = createTable(closers);
      const pullerTable = createTable(pullers);

      document.getElementById('closer-club-table').innerHTML = '';
      document.getElementById('closer-club-table').appendChild(closerTable);
      document.getElementById('puller-club-table').innerHTML = '';
      document.getElementById('puller-club-table').appendChild(pullerTable);
    });
}

// Update window.onload to include milestone loading
const originalLoad = window.onload;
window.onload = function () {
  if (originalLoad) originalLoad();
  loadMilestoneClubs();
};
