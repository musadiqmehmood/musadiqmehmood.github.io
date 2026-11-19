(() => {
  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const metaTheme = document.getElementById("metaThemeColor");
  const year = document.getElementById("year");
  const sectionIds = ["about", "services", "experience", "skills", "contact"];

  if (year) year.textContent = String(new Date().getFullYear());

  const getTheme = () => root.getAttribute("data-theme") || "light";

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("mm-theme-v2", theme);
    } catch (_) {}
    if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#f4f2ec" : "#0b0c0d");
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      );
    }
    const themeLabel = document.getElementById("themeLabel");
    if (themeLabel) themeLabel.textContent = theme === "light" ? "Dark" : "Light";
  };

  applyTheme(getTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);

    const fromTop = window.scrollY + 120;
    let current = null;
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= fromTop) current = id;
    });
    if (navLinks) {
      navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("is-active", href === `#${current}`);
      });
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el, i) => {
      if (!el.closest(".hero-copy") && !el.classList.contains("hero-visual")) {
        el.style.transitionDelay = `${Math.min(i % 7, 5) * 55}ms`;
      }
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Count-up for stats when visible */
  const stats = document.querySelectorAll(".stat-number");
  if (!reduceMotion && stats.length && "IntersectionObserver" in window) {
    const animateCount = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+)(\+?)$/);
      if (!match) return;
      const target = Number(match[1]);
      const suffix = match[2] || "";
      const duration = target >= 100 ? 1200 : 900;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          sio.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    stats.forEach((el) => sio.observe(el));
  }
})();
