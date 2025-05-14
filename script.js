
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
  })
  .catch(error => {
    document.getElementById('deal-table-container').innerText = 'Failed to load deals.';
    console.error('Error loading deals:', error);
  });
