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
    const headers = ['Deal Name', 'Value', 'Funding Company', 'Pipeline Stage', 'Ownership', 'Package Puller', 'Deal/Renewal', 'Last Stage Change'];
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
        <td>${deal.deal_or_renewal}</td>
        <td>${new Date(deal.last_stage_change).toLocaleDateString()}</td>
      `;
    });

    document.getElementById('deal-table-container').innerHTML = '';
    document.getElementById('deal-table-container').appendChild(table);
  });