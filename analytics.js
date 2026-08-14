(function () {
  "use strict";

  var measurementId = "G-PSBT313ZZM";
  var consentKey = "runmity_analytics_consent";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });

  var savedConsent = null;
  try {
    savedConsent = window.localStorage.getItem(consentKey);
  } catch (error) {
    savedConsent = null;
  }

  var googleTagLoaded = false;

  function loadGoogleTag() {
    if (googleTagLoaded) {
      return;
    }
    googleTagLoaded = true;

    var googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(googleTag);

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  if (savedConsent === "granted") {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    loadGoogleTag();
  }

  function updateConsent(value) {
    savedConsent = value;
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      // Consent still applies to the current page when storage is unavailable.
    }

    window.gtag("consent", "update", {
      analytics_storage: value === "granted" ? "granted" : "denied"
    });

    if (value === "granted") {
      loadGoogleTag();
    }

    var banner = document.querySelector("[data-analytics-consent]");
    if (banner) {
      banner.remove();
    }
  }

  function showConsentBanner() {
    if (savedConsent === "granted" || savedConsent === "denied") {
      return;
    }

    var banner = document.createElement("aside");
    banner.className = "consent-banner";
    banner.setAttribute("data-analytics-consent", "");
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "アクセス解析の設定");
    banner.innerHTML =
      '<p>サイト改善のため、同意いただいた場合のみGoogle Analyticsを使用します。' +
      '<a href="privacy.html#website-analytics">詳細</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" data-consent="denied">拒否</button>' +
      '<button type="button" class="consent-accept" data-consent="granted">計測を許可</button>' +
      "</div>";
    document.body.appendChild(banner);

    banner.querySelectorAll("[data-consent]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateConsent(button.getAttribute("data-consent"));
      });
    });
  }

  function trackStoreClick(link) {
    if (savedConsent !== "granted") {
      return;
    }
    window.gtag("event", "store_click", {
      link_url: link.href,
      link_text: (link.textContent || "").trim(),
      page_language: document.documentElement.lang || "unknown",
      transport_type: "beacon"
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    showConsentBanner();
    document.querySelectorAll("[data-store-link]").forEach(function (link) {
      link.addEventListener("click", function () {
        trackStoreClick(link);
      });
    });
  });
})();
