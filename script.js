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
