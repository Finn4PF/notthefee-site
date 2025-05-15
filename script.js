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
