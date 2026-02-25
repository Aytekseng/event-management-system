(function () {
  const KEY = "swagger_bearer_token";

  function getToken() {
    return localStorage.getItem(KEY) || "";
  }

  function setToken(t) {
    localStorage.setItem(KEY, t || "");
  }

  function addTokenBar() {
    if (document.getElementById("swagger-token-bar")) return;

    const host =
      document.querySelector(".swagger-ui") ||
      document.body;

    const bar = document.createElement("div");
    bar.id = "swagger-token-bar";
    bar.style.display = "flex";
    bar.style.gap = "8px";
    bar.style.alignItems = "center";
    bar.style.padding = "10px 12px";
    bar.style.margin = "10px 0";
    bar.style.border = "1px solid rgba(0,0,0,0.1)";
    bar.style.borderRadius = "6px";
    bar.style.background = "rgba(0,0,0,0.04)";

    const label = document.createElement("span");
    label.textContent = "Bearer Token:";
    label.style.fontSize = "12px";
    label.style.whiteSpace = "nowrap";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "eyJhbGciOi... (access_token)";
    input.value = getToken();
    input.style.flex = "1";
    input.style.minWidth = "260px";
    input.style.padding = "6px 8px";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Kaydet";
    saveBtn.onclick = function () {
      setToken(input.value.trim());
      alert("Token kaydedildi.");
    };

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Sil";
    clearBtn.onclick = function () {
      input.value = "";
      setToken("");
      alert("Token silindi.");
    };

    bar.appendChild(label);
    bar.appendChild(input);
    bar.appendChild(saveBtn);
    bar.appendChild(clearBtn);

    // swagger-ui container'ın en üstüne koy
    host.prepend(bar);
  }

  function attachInterceptor() {
    if (!window.ui || !window.ui.getConfigs) return;

    const cfg = window.ui.getConfigs();
    const original = cfg.requestInterceptor;

    cfg.requestInterceptor = function (req) {
      const token = getToken().trim();
      if (token) {
        req.headers = req.headers || {};
        req.headers["Authorization"] = token.startsWith("Bearer ")
          ? token
          : "Bearer " + token;
      }
      return original ? original(req) : req;
    };
  }

  function bootstrap() {
    addTokenBar();

    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (window.ui) {
        clearInterval(t);
        attachInterceptor();
      }
      if (tries > 60) clearInterval(t);
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();