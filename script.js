
(function(){
  const d = window.CHASE_DATA || {};
  const total = Number(d.totalPacks || 105);
  const sold = Number(d.packsSold || 0);
  const price = d.pricePerPack || "$99.99";

  ["buyPacks","navBuy","catalogBuy"].forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.href = d.buyPacksUrl;
      el.removeAttribute("target");
      el.removeAttribute("rel");
    }
  });

  const totalEl = document.getElementById("totalPacks");
  const soldEl = document.getElementById("packsSold");
  const remEl = document.getElementById("packsRemaining");
  const progress = document.getElementById("progressBar");
  const last = document.getElementById("lastUpdated");
  renderPackStats(total, sold);
  const priceEl = document.getElementById("pricePerPack");
  if(priceEl) priceEl.textContent = price;
  if(last && d.lastUpdated) last.textContent = "Last updated: " + d.lastUpdated;

  const featuredGrid = document.getElementById("featuredGrid");
  if(featuredGrid){
    (d.featured || []).forEach(item => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<span class="count">${item.count || ""} in series</span><h3>${item.product || ""}</h3>`;
      featuredGrid.appendChild(card);
    });
  }

  const body = document.getElementById("catalogBody");
  if(body){
    (d.catalog || []).forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${item.product || ""}</td><td>${item.count || ""}</td>`;
      body.appendChild(tr);
    });
  }
  const catTotal = document.getElementById("catalogTotal");
  if(catTotal) catTotal.textContent = total;

  function renderPackStats(totalPacks, packsSold) {
    const remaining = Math.max(totalPacks - packsSold, 0);

    if(totalEl) totalEl.textContent = totalPacks;
    if(soldEl) soldEl.textContent = packsSold;
    if(remEl) remEl.textContent = remaining;
    if(progress) progress.style.width = Math.min((packsSold / totalPacks) * 100, 100) + "%";
  }
})();
