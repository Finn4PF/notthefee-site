
function filterStandings(period) {
  fetch('standings.json')
    .then(response => response.json())
    .then(data => {
      const closers = data.filter(d => d.Period === period && d["Role Type"] === "Top Closers");
      const pullers = data.filter(d => d.Period === period && d["Role Type"] === "Top Package Pullers");

      const renameMetric = (label) => {
        if (label === "Deals") return "Deals Funded";
        if (label === "Value") return "Funding Total";
        if (label === "Commission") return "Total Revenue";
        return label;
      };

      const closersTable = document.createElement('table');
      closersTable.innerHTML = '<tr><th>Metric</th><th>Rank</th><th>Name</th><th>Total</th></tr>';
      closers.forEach(row => {
        closersTable.innerHTML += `
          <tr>
            <td>${renameMetric(row.Metric)}</td>
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
            <td>${renameMetric(row.Metric)}</td>
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

function filterMilestones(typeKey) {
  fetch('milestone_data.json')
    .then(response => response.json())
    .then(data => {
      const closers = data.filter(d => d.Role === "Closer" && d[typeKey] !== "None");
      const pullers = data.filter(d => d.Role === "Sales Rep" && d[typeKey] !== "None");

      const createTable = (group) => {
        const table = document.createElement('table');
        table.innerHTML = '<tr><th>Employee</th><th>Total Deals</th><th>Deals Club</th><th>Total Funding</th><th>Funding Club</th><th>Total Revenue</th><th>Revenue Club</th></tr>';
        group.forEach(person => {
          table.innerHTML += `
            <tr>
              <td>${person.Employee}</td>
              <td>${person.Total_Deals}</td>
              <td>${person.DealsClub}</td>
              <td>$${Number(person.Total_Value).toLocaleString()}</td>
              <td>${person.FundingClub}</td>
              <td>$${Number(person.Total_Commission).toLocaleString()}</td>
              <td>${person.RevenueClub}</td>
            </tr>`;
        });
        return table;
      };

      document.getElementById('closer-club-table').innerHTML = '';
      document.getElementById('puller-club-table').innerHTML = '';
      document.getElementById('closer-club-table').appendChild(createTable(closers));
      document.getElementById('puller-club-table').appendChild(createTable(pullers));
    });
}

function formatTotal(value) {
  if (typeof value === "number") {
    return value >= 1000 ? "$" + value.toLocaleString() : value.toLocaleString();
  }
  return value;
}

window.onload = function () {
  filterStandings('Year-To-Date');
  filterMilestones('DealsClub');
};
