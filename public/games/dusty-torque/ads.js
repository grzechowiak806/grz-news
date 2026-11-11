/* Single manual display placement, isolated from gameplay. No Auto ads,
   in-game overlays, automatic refreshes, ad-click rewards or fabricated rewards. */
(() => {
  "use strict";
  const cfg = window.DUSTY_ADS;
  if (!cfg || !cfg.enabled || !cfg.cmpConfigured ||
      !/^ca-pub-\d{16}$/.test(cfg.publisherId) ||
      !/^\d+$/.test(cfg.displaySlotId) ||
      !Array.isArray(cfg.approvedHosts) ||
      !cfg.approvedHosts.includes(location.hostname)) return;
  // A certified CMP must be installed by the operator. It owns consent collection
  // and passes the user's signals to Google; this module doesn't invent consent.
  if (typeof window.__tcfapi !== "function") return;
  let loaded = false;
  const activate = () => {
    if (loaded) return;
    loaded = true;
    const region = document.getElementById("adRegion");
    const slot = document.createElement("ins");
    slot.className = "adsbygoogle";
    slot.style.display = "block";
    slot.dataset.adClient = cfg.publisherId;
    slot.dataset.adSlot = cfg.displaySlotId;
    slot.dataset.adFormat = "auto";
    slot.dataset.fullWidthResponsive = "true";
    document.getElementById("displayAd").appendChild(slot);
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.publisherId);
    script.onload = () => {
      try {
        region.hidden = false;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch { region.hidden = true; }
    };
    script.onerror = () => { region.hidden = true; };
    document.head.appendChild(script);
  };
  window.__tcfapi("addEventListener", 2, (data, success) => {
    if (!success || !data || data.cmpStatus !== "loaded") return;
    if (data.gdprApplies === false) activate();
    // Be conservative: require affirmative storage consent before requesting ads
    // where GDPR applies. Rejected/unknown consent leaves the placement hidden.
    else if (data.gdprApplies === true && data.tcString &&
      ["tcloaded", "useractioncomplete"].includes(data.eventStatus) &&
      data.purpose && data.purpose.consents && data.purpose.consents[1] === true) activate();
  });
})();
