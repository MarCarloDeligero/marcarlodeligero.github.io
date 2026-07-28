// ============================================
// BOOT SEQUENCE
// ============================================
(function boot() {
  const boot = document.getElementById("boot");
  const typeTarget = document.getElementById("bootType");
  const fill = document.getElementById("bootFill");
  const message = "php artisan portfolio:show mar-carlo";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    boot.classList.add("is-done");
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";
  let i = 0;

  function typeChar() {
    if (i < message.length) {
      typeTarget.textContent += message[i];
      i++;
      setTimeout(typeChar, 28);
    } else {
      requestAnimationFrame(() => { fill.style.width = "100%"; });
      setTimeout(finishBoot, 1500);
    }
  }

  function finishBoot() {
    boot.classList.add("is-done");
    document.body.style.overflow = "";
  }

  setTimeout(typeChar, 300);

  // safety net in case something stalls
  setTimeout(finishBoot, 4500);
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
// FOOTER YEAR
// ============================================
document.getElementById("year").textContent = new Date().getFullYear();
