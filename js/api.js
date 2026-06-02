// ==========================================
// API FUNCTIONS
// ==========================================

const API = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "http://localhost:8080/api/v1"
  : "https://coldstartworkshop.duckdns.org/api/v1";

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

// ==========================================
// UI & FORM LOGIC
// ==========================================

function updateCount() {
  document.getElementById("char-count").textContent =
    document.getElementById("f-short").value.length;
}

function previewIcon(input) {
  if (!input.files.length) return;
  const div = document.getElementById("icon-prev");
  const img = document.getElementById("icon-img");
  img.src = URL.createObjectURL(input.files[0]);
  div.style.display = "block";
}

function previewSS(input) {
  const prev = document.getElementById("ss-prev");
  prev.innerHTML = "";
  [...input.files].slice(0, 5).forEach(f => {
    const img = document.createElement("img");
    img.style.cssText = "height:48px;width:auto;object-fit:cover;border:2px inset #c0c0c0";
    img.src = URL.createObjectURL(f);
    prev.appendChild(img);
  });
}

document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = document.getElementById("submit-btn");
  const msg = document.getElementById("msg");

  // --- HONEYPOT CHECK ---
  const honeypot = document.getElementById("f-website").value;
  if (honeypot) {
    msg.className = "msg-box err";
    msg.textContent = "✗ Bot behavior detected. Submission blocked.";
    msg.style.display = "block";
    return; // Exit completely to block submission
  }
  // ----------------------

  btn.disabled = true; 
  btn.textContent = "Submitting…";
  msg.className = "msg-box"; 
  msg.style.display = "none";

  try {
    const fd = new FormData(e.target);
    const ssInput = document.getElementById("ss-input");
    
    fd.delete("screenshots");
    [...ssInput.files].slice(0, 5).forEach(f => fd.append("screenshots", f));

    const result = await submitMod(fd);
    
    msg.className = "msg-box ok";
    msg.textContent = "✓ Submitted! Your mod ID: " + result.id + ". It will appear after review.";
    msg.style.display = "block";
    
    e.target.reset();
    document.getElementById("ss-prev").innerHTML = "";
    document.getElementById("icon-prev").style.display = "none";
    document.getElementById("char-count").textContent = "0";
    
  } catch(err) {
    msg.className = "msg-box err";
    msg.textContent = "✗ " + err.message;
    msg.style.display = "block";
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit";
  }
});

// ==========================================
// TASKBAR CLOCK
// ==========================================

function tick() {
  const d = new Date();
  document.getElementById("clock").textContent =
    d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
}
tick(); 
setInterval(tick, 10000);