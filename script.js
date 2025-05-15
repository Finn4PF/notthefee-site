fetch('simulated_zendesk_deals.json')
  .then(response => response.json())
  .then(data => {
    const priority = {
      "Contract In": 1,
      "Contracts Out": 2,
      "Pitched": 3,
      "Prepitch": 4,
      "Discovery Call": 5,
      "Onboarding": 6
    };
    const sorted = data.sort((a, b) => {
      const stageA = priority[a.pipeline_stage] || 999;
      const stageB = priority[b.pipeline_stage] || 999;
      return stageA - stageB || b.value - a.value;
    });

    const table = document.createElement('table');
    table.className = 'deal-table';
    const headers = ['Deal Name', 'Value', 'Funding Company', 'Pipeline Stage', 'Ownership', 'Package Puller', 'Last Stage Change'];
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    headers.forEach(h => {
      const th = document.createElement('th');
      th.innerText = h;
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    sorted.forEach(deal => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${deal.deal_name}</td>
        <td>$${deal.value.toLocaleString()}</td>
        <td>${deal.funding_company}</td>
        <td>${deal.pipeline_stage}</td>
        <td>${deal.ownership}</td>
        <td>${deal.package_puller}</td>
        <td>${new Date(deal.last_stage_change).toLocaleDateString()}</td>
      `;
    });

    document.getElementById('deal-table-container').innerHTML = '';
    document.getElementById('deal-table-container').appendChild(table);
  });
function switchMilestoneTab(role) {
  fetch('milestone_data.json')
    .then(response => response.json())
    .then(data => {
      const filtered = data.filter(d => d.Role === role);

      const table = document.createElement('table');
      table.className = 'deal-table';

      const headers = ['Employee', 'Total_Deals', 'Deals Club', 'Total_Value', 'Funding Club', 'Total_Commission', 'Revenue Club'];
      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      headers.forEach(h => {
        const th = document.createElement('th');
        th.innerText = h.replace(/_/g, ' ');
        headerRow.appendChild(th);
      });

      const tbody = table.createTBody();
      filtered.forEach(d => {
        const row = tbody.insertRow();
        row.innerHTML = `
          <td>${d.Employee}</td>
          <td>${d.Total_Deals}</td>
          <td>${d["Deals Club"]}</td>
          <td>$${Number(d.Total_Value).toLocaleString()}</td>
          <td>${d["Funding Club"]}</td>
          <td>$${Number(d.Total_Commission).toLocaleString()}</td>
          <td>${d["Revenue Club"]}</td>
        `;
      });

      const container = document.getElementById('milestone-tables');
      container.innerHTML = '';
      container.appendChild(table);
    });
}


let milestoneClubData = [];
let currentClub = "Deals";
let currentTier = "Bronze";

function loadMilestoneClubTabs() {
  fetch('milestone_data.json')
    .then(res => res.json())
    .then(data => {
      milestoneClubData = data;
      renderMilestoneTables();
    });
}

function filterClub(club) {
  currentClub = club;
  renderMilestoneTables();
}
function filterTier(tier) {
  currentTier = tier;
  renderMilestoneTables();
}

function renderMilestoneTables() {
  const filtered = milestoneClubData.filter(
    d => d["Club Type"] === currentClub && d["Tier"] === currentTier
  );

  const closers = filtered.filter(d => d.Role === "Closer");
  const pullers = filtered.filter(d => d.Role === "Sales Rep");

  const makeTable = (rows) => {
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Name</th><th>Deals</th><th>Funding</th><th>Revenue</th></tr>';
    rows.forEach(row => {
      table.innerHTML += `
        <tr>
          <td>${row.Employee}</td>
          <td>${row.Total_Deals}</td>
          <td>$${Number(row.Total_Value).toLocaleString()}</td>
          <td>$${Number(row.Total_Commission).toLocaleString()}</td>
        </tr>`;
    });
    return table;
  };

  const closersTable = makeTable(closers);
  const pullersTable = makeTable(pullers);

  document.getElementById('milestone-closers-table').innerHTML = '';
  document.getElementById('milestone-pullers-table').innerHTML = '';
  document.getElementById('milestone-closers-table').appendChild(closersTable);
  document.getElementById('milestone-pullers-table').appendChild(pullersTable);
}

// Run on page load
const originalLoad = window.onload;
window.onload = function () {
  if (originalLoad) originalLoad();
  loadMilestoneClubTabs();
};
