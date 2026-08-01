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

  // Reflect whatever the inline boot script already decided (saved
  // preference or OS setting) before any click happens.
  const isDarkOnLoad = document.documentElement.getAttribute("data-theme") === "dark";
  btn.setAttribute("aria-pressed", String(isDarkOnLoad));

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";

    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    btn.setAttribute("aria-pressed", String(next === "dark"));

    try { localStorage.setItem("theme", next); } catch (e) { /* noop */ }
  });
})();

// ============================================
// SECTION PAGINATION
// (desktop: horizontal slide paging via wheel/keys/buttons
//  mobile: same tracking, drives nav active-link only)
// ============================================
(function pagination() {
  const track = document.getElementById("top");
  const prevBtn = document.getElementById("scrollPrev");
  const nextBtn = document.getElementById("scrollNext");
  const navLinks = document.querySelectorAll(".nav__links a, .nav__mobile a");
  const logo = document.querySelector(".nav__logo");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(":scope > section"));
  if (slides.length === 0) return;

  let currentIndex = 0;
  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;

  function setProgress() {
    if (nextBtn) nextBtn.classList.toggle("is-hidden", currentIndex >= slides.length - 1);
    if (prevBtn) prevBtn.classList.toggle("is-hidden", currentIndex <= 0);

    const activeId = slides[currentIndex].id;
    navLinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + activeId);
    });
    if (logo) logo.classList.toggle("is-active", activeId === "hero");
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({ behavior: "smooth", inline: "start", block: "start" });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = slides.indexOf(entry.target);
            if (idx !== -1) {
              currentIndex = idx;
              setProgress();
            }
          }
        });
      },
      { threshold: [0.5, 0.6, 0.7, 0.8, 0.9] }
    );
    slides.forEach((s) => observer.observe(s));
  }

  if (nextBtn) nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(currentIndex - 1));

  // Clicking the logo returns to the first slide. On desktop the default
  // "#top" anchor jump doesn't reliably reset horizontal scroll position
  // (main#top is the scroll container itself, not a scrollable ancestor
  // of the target), so we drive it through goTo() instead.
  if (logo) {
    logo.addEventListener("click", (e) => {
      if (!isDesktop()) return; // mobile: default #top anchor is fine as-is
      e.preventDefault();
      goTo(0);
    });
  }

  // Let a normal vertical mouse wheel page horizontally through the slides
  track.addEventListener(
    "wheel",
    (e) => {
      if (!isDesktop() || e.deltaY === 0) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    },
    { passive: false }
  );

  // Arrow-key paging on desktop
  window.addEventListener("keydown", (e) => {
    if (!isDesktop()) return;
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
    if (e.key === "ArrowLeft") goTo(currentIndex - 1);
  });

  setProgress();
})();

// ============================================
// SLIDE HINT (first visit only, desktop only)
// ============================================
(function slideHint() {
  const hint = document.getElementById("slideHint");
  const closeBtn = document.getElementById("slideHintClose");
  if (!hint || !closeBtn) return;

  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;

  let alreadySeen = false;
  try {
    alreadySeen = localStorage.getItem("slideHintSeen") === "1";
  } catch (err) {
    // localStorage unavailable — treat as unseen, hint just won't persist across visits
  }

  if (!isDesktop() || alreadySeen) return;

  let dismissTimer = null;
  let showTimer = null;

  function dismiss() {
    hint.classList.remove("is-visible");
    try { localStorage.setItem("slideHintSeen", "1"); } catch (err) { /* noop */ }
    clearTimeout(dismissTimer);
    window.removeEventListener("keydown", onFirstInteraction);
    window.removeEventListener("wheel", onFirstInteraction);
    document.getElementById("scrollPrev")?.removeEventListener("click", onFirstInteraction);
    document.getElementById("scrollNext")?.removeEventListener("click", onFirstInteraction);
  }

  function onFirstInteraction() {
    dismiss();
  }

  // Give the boot animation a moment to finish before showing the hint
  showTimer = setTimeout(() => {
    if (!isDesktop()) return; // window may have been resized during boot
    hint.classList.add("is-visible");
    dismissTimer = setTimeout(dismiss, 6000);
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    window.addEventListener("wheel", onFirstInteraction, { once: true, passive: true });
    document.getElementById("scrollPrev")?.addEventListener("click", onFirstInteraction, { once: true });
    document.getElementById("scrollNext")?.addEventListener("click", onFirstInteraction, { once: true });
  }, 1600);

  closeBtn.addEventListener("click", dismiss);
})();

// ============================================
// FOOTER YEAR
// ============================================
document.querySelectorAll(".js-year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
