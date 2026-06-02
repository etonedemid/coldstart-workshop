const API = "https://coldstartworkshop.duckdns.org/api/v1";

async function fetchMods(type = "") {
  const url = type ? `${API}/mods?type=${type}` : `${API}/mods`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Failed to fetch mods");
  return r.json();
}

async function fetchMod(id) {
  const r = await fetch(`${API}/mods/${id}`);
  if (!r.ok) throw new Error("Not found");
  return r.json();
}

async function submitMod(formData) {
  const r = await fetch(`${API}/submit`, { method: "POST", body: formData });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail || "Submission failed");
  return json;
}
