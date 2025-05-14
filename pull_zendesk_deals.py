
import requests
import json

# === CONFIG ===
API_URL = "https://api.getbase.com/v2/deals"
TOKEN = "1a5801ba9f3d4fe021e730411181a5f21768c568009ff859efaacd12bdef16c8"
OUTPUT_FILE = "deals_live.json"

# === Stage priority for sorting ===
priority = {
    "Contract In": 1,
    "Contracts Out": 2,
    "Pitched": 3,
    "Prepitch": 4,
    "Discovery Call": 5,
    "Onboarding": 6
}

# === Fetch deals from Zendesk ===
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

print("Fetching deals from Zendesk...")
response = requests.get(API_URL, headers=headers)
response.raise_for_status()
raw_data = response.json()
items = [item["data"] for item in raw_data.get("items", [])]

# === Filter & sort ===
filtered = [deal for deal in items if deal.get("pipeline_stage") in priority]
sorted_deals = sorted(filtered, key=lambda d: (priority.get(d["pipeline_stage"], 999), -d.get("value", 0)))

# === Format simplified output ===
cleaned = []
for d in sorted_deals:
    cleaned.append({
        "deal_name": d.get("name"),
        "value": d.get("value", 0),
        "funding_company": d.get("funding_company", ""),
        "pipeline_stage": d.get("pipeline_stage"),
        "ownership": d.get("owner", {}).get("name", ""),
        "package_puller": d.get("custom_fields", {}).get("package_puller", ""),
        "last_stage_change": d.get("updated_at")
    })

# === Write to file ===
with open(OUTPUT_FILE, "w") as f:
    json.dump(cleaned, f, indent=2)

print(f"✅ Done. Saved {len(cleaned)} deals to {OUTPUT_FILE}")
