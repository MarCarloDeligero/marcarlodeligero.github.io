// ============================================
// LOADING SCREEN (plays once per session)
// ============================================
(function boot() {
  const boot = document.getElementById("boot");
  const fill = document.getElementById("bootFill");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let alreadyBooted = false;
  try {
    alreadyBooted = sessionStorage.getItem("portfolioBooted") === "1";
  } catch (err) {
    // sessionStorage unavailable (e.g. privacy mode) — just play the animation
  }

  if (prefersReduced || alreadyBooted) {
    boot.classList.add("is-done");
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    setTimeout(() => { fill.style.width = "100%"; }, 150);
  });

  function finishBoot() {
    boot.classList.add("is-done");
    document.body.style.overflow = "";
    try { sessionStorage.setItem("portfolioBooted", "1"); } catch (err) { /* noop */ }
  }

  setTimeout(finishBoot, 1300);
})();

// ============================================
// SCROLL REVEAL
// ============================================
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

// ============================================
// MOBILE NAV
// ============================================
(function mobileNav() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navMobile");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
})();

// ============================================
// COPY EMAIL TO CLIPBOARD
// ============================================
(function copyEmail() {
  const btn = document.getElementById("copyEmailBtn");
  const label = document.getElementById("copyEmailLabel");
  const email = "deligero.c@yahoo.com";
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      // clipboard API unavailable — fall back silently, mailto link still works
    }
    label.textContent = "Copied ✓";
    setTimeout(() => { label.textContent = "Copy email"; }, 1800);
  });
})();

// ============================================
// PROJECT ACCORDION
// ============================================
(function projectAccordion() {
  const toggles = document.querySelectorAll(".project__toggle");

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = btn.closest(".project");
      const isOpen = project.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });
})();

// ============================================
// THEME TOGGLE (light / dark)
// ============================================
(function themeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";

    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try { localStorage.setItem("theme", next); } catch (e) { /* noop */ }
  });
})();

// ============================================
// FOOTER YEAR
// ============================================
document.getElementById("year").textContent = new Date().getFullYear();
