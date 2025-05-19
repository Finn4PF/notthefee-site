// MANUAL UPDATE SECTION (admin password protected)
function verifyPassword() {
  const password = document.getElementById("adminPassword").value;
  const correctPassword = "268Bro@dway";
  if (password === correctPassword) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("updateSection").style.display = "block";
  } else {
    alert("Incorrect password. Please try again.");
  }
}

function applyManualUpdate() {
  const input = document.getElementById("updateInput").value.trim();
  const output = document.getElementById("manualUpdateOutput");
  if (input === "") {
    output.innerHTML = "<p>Please enter something to display.</p>";
    return;
  }
  const formatted = input
    .split('\n')
    .map(line => `<p>• ${line}</p>`)
    .join('');
  output.innerHTML = `<h3>Latest Update</h3>${formatted}`;
}

// EMPLOYEE STANDINGS SECTION
fetch('standings.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('milestones');
    const roles = ['Top Closers', 'Top Package Pullers'];
    const metrics = ['Deals', 'Value', 'Commission'];
    const periods = ['This Month', 'Q2 (Apr–Jun)', 'Q1 (Jan–Mar)', 'Year-To-Date'];

    roles.forEach(role => {
      const section = document.createElement('div');
      section.className = 'standings-section';
      section.innerHTML = `<h3>${role}</h3>`;
      periods.forEach(period => {
        const group = data.filter(d =>
          d['Role Type'] === role && d['Period'] === period
        );

        if (group.length === 0) return;

        section.innerHTML += `<h4>${period}</h4>`;

        metrics.forEach(metric => {
          const rows = group.filter(d => d.Metric === metric);
          if (rows.length === 0) return;
          const table = document.createElement('table');
          table.className = 'deal-table';
          table.innerHTML = `
            <thead><tr><th>${metric}</th><th>Name</th><th>Total</th></tr></thead>
            <tbody>
              ${rows
                .map(row => `<tr><td>${row.Rank}</td><td>${row.Name}</td><td>${row.Total.toLocaleString()}</td></tr>`)
                .join('')}
            </tbody>
          `;
          section.appendChild(table);
        });
      });
      container.appendChild(section);
    });
  });
