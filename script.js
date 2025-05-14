
function loadTopDealsTab(tabName) {
  fetch('deals_live.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('deal-table-container');
      container.innerHTML = "";

      if (tabName === "Leaderboard") {
        const leaderboard = data.filter(row => row.Tab === "Leaderboard");
        const leaderboardTable = document.createElement("table");
        leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Package Puller</th><th>Active Deals</th></tr>";
        leaderboard.forEach((row, index) => {
          leaderboardTable.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${row["Package Puller"]}</td>
              <td>${row["Last Stage Change Date"]}</td>
            </tr>`;
        });
        container.appendChild(leaderboardTable);
      } else {
        const filtered = data.filter(row => row.Tab === tabName);
        const table = document.createElement("table");
        table.innerHTML = "<tr><th>Deal Name</th><th>Value</th><th>Stage</th><th>Funding Company</th><th>Owner</th><th>Package Puller</th><th>Last Updated</th></tr>";
        filtered.forEach(row => {
          table.innerHTML += `
            <tr>
              <td>${row["Deal Name"]}</td>
              <td>$${Number(row["Value"] || 0).toLocaleString()}</td>
              <td>${row["Pipeline Stage"]}</td>
              <td>${row["Funding Company"]}</td>
              <td>${row["Owner"]}</td>
              <td>${row["Package Puller"]}</td>
              <td>${new Date(row["Last Stage Change Date"]).toLocaleDateString()}</td>
            </tr>`;
        });
        container.appendChild(table);
      }
    });
}

window.onload = function () {
  loadTopDealsTab("Leaderboard");
  filterStandings("Year-To-Date");
};
