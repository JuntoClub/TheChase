
(function(){
  const d = window.CHASE_DATA || {};
  const total = Number(d.totalPacks || 105);
  const sold = Number(d.packsSold || 0);
  const remaining = Math.max(total - sold, 0);
  const price = d.pricePerPack || "$99.99";

  ["buyPacks","navBuy","catalogBuy"].forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.href = "/api/create-checkout-session";
      el.removeAttribute("target");
      el.removeAttribute("rel");
      el.addEventListener("click", startStripeCheckout);
    }
  });

  const totalEl = document.getElementById("totalPacks");
  const soldEl = document.getElementById("packsSold");
  const remEl = document.getElementById("packsRemaining");
  const progress = document.getElementById("progressBar");
  const last = document.getElementById("lastUpdated");
  if(totalEl) totalEl.textContent = total;
  if(soldEl) soldEl.textContent = sold;
  if(remEl) remEl.textContent = remaining;
  if(progress) progress.style.width = Math.min((sold / total) * 100, 100) + "%";
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

  async function startStripeCheckout(event) {
    event.preventDefault();

    const link = event.currentTarget;
    if (link.getAttribute("aria-busy") === "true") {
      return;
    }

    link.setAttribute("aria-busy", "true");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: "chase-pack" }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.assign(data.url);
    } catch (error) {
      alert(error.message);
      link.removeAttribute("aria-busy");
    }
  }
})();
