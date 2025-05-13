
const ZENDESK_API_URL = 'https://api.getbase.com/v2/deals';
const ZENDESK_API_TOKEN = '1a5801ba9f3d4fe021e730411181a5f21768c568009ff859efaacd12bdef16c8';

const priority = {
  "Contract In": 1,
  "Contracts Out": 2,
  "Pitched": 3,
  "Prepitch": 4,
  "Discovery Call": 5,
  "Onboarding": 6
};

function fetchDeals() {
  fetch(ZENDESK_API_URL, {
    headers: {
      'Authorization': 'Bearer ' + ZENDESK_API_TOKEN,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const deals = data.items.map(item => item.data);
    const filtered = deals.filter(deal => priority.hasOwnProperty(deal.pipeline_stage));

    const sorted = filtered.sort((a, b) => {
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
        <td>${deal.name}</td>
        <td>$${(deal.value || 0).toLocaleString()}</td>
        <td>${deal.funding_company || ''}</td>
        <td>${deal.pipeline_stage}</td>
        <td>${deal.owner && deal.owner.name ? deal.owner.name : ''}</td>
        <td>${deal.custom_fields?.package_puller || ''}</td>
        <td>${new Date(deal.updated_at).toLocaleDateString()}</td>
      `;
    });

    const container = document.getElementById('deal-table-container');
    container.innerHTML = '';
    container.appendChild(table);
  })
  .catch(error => {
    console.error('Error fetching Zendesk deals:', error);
    document.getElementById('deal-table-container').innerText = 'Failed to load deals.';
  });
}

// Initial load
fetchDeals();
// Refresh every hour (3600000 ms)
setInterval(fetchDeals, 3600000);
