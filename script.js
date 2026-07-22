/* =====================================================
   NAVEED ABBAS PORTFOLIO — script.js
   Table of contents:
     1. Utilities
     2. Mobile navigation toggle
     3. Typing animation
     4. Scroll reveal (IntersectionObserver)
     5. Active navbar link (IntersectionObserver)
     6. Header scroll shadow
     7. Scroll-to-top button
     8. Skill bar animation
     9. Animated counters
     10. Footer year
===================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------- 1. Utilities ---------------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  /* ---------------- 2. Mobile navigation toggle ---------------- */
  const navToggle = $("#navToggle");
  const primaryNav = $("#primaryNav");
  const navOverlay = $("#navOverlay");

  function closeNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("open");
    navOverlay?.classList.remove("visible");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    primaryNav.classList.add("open");
    navOverlay?.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    navOverlay?.addEventListener("click", closeNav);

    $$("#primaryNav a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------------- 3. Typing animation ---------------- */
  const typingEl = $("#typing");

  const words = [
    "Information Security Student",
    "Java Developer",
    "C++ Programmer",
    "Cyber Security Enthusiast",
  ];

  if (typingEl) {
    if (prefersReducedMotion) {
      // Respect user preference: show the first phrase statically, no motion.
      typingEl.textContent = words[0];
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const typeEffect = () => {
        const current = words[wordIndex];

        typingEl.textContent = isDeleting
          ? current.substring(0, charIndex--)
          : current.substring(0, charIndex++);

        let speed = isDeleting ? 55 : 110;

        if (!isDeleting && charIndex > current.length) {
          isDeleting = true;
          speed = 1400;
        } else if (isDeleting && charIndex < 0) {
          isDeleting = false;
          charIndex = 0;
          wordIndex = (wordIndex + 1) % words.length;
          speed = 300;
        }

        setTimeout(typeEffect, speed);
      };

      typeEffect();
    }
  }

  /* ---------------- 4. Scroll reveal ---------------- */
  const sections = $$("section");

  if ("IntersectionObserver" in window && sections.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );

    sections.forEach((section) => revealObserver.observe(section));
  } else {
    // Fallback: reveal everything immediately if IntersectionObserver is unavailable.
    sections.forEach((section) => section.classList.add("reveal"));
  }

  /* ---------------- 5. Active navbar link ---------------- */
  const navLinks = $$("nav a[href^='#']");
  const sectionsWithId = sections.filter((section) => section.id);

  if ("IntersectionObserver" in window && sectionsWithId.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sectionsWithId.forEach((section) => navObserver.observe(section));
  }

  /* ---------------- 6. Header scroll shadow ---------------- */
  const header = $("#header");
  const topBtn = $("#topBtn");

  let ticking = false;

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
    if (topBtn) {
      topBtn.classList.toggle("visible", window.scrollY > 400);
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll(); // run once on load in case the page is restored mid-scroll

  /* ---------------- 7. Scroll-to-top button ---------------- */
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------------- 8. Skill bar animation ---------------- */
  const skillsSection = $("#skills");
  const fills = $$(".fill");

  function animateSkillBars() {
    fills.forEach((fill) => {
      const percent = fill.dataset.percent || "0";
      fill.style.width = `${percent}%`;
    });
  }

  if (skillsSection && fills.length) {
    if ("IntersectionObserver" in window) {
      const skillsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateSkillBars();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      skillsObserver.observe(skillsSection);
    } else {
      animateSkillBars();
    }
  }

  /* ---------------- 9. Animated counters ---------------- */
  const statsSection = $(".stats");
  const counters = $$(".stat-box h2");

  function animateCounter(counter) {
    const target = parseInt(counter.dataset.count, 10) || 0;
    const suffix = counter.dataset.suffix || "";
    const duration = 1400; // ms, constant regardless of magnitude
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out for a natural deceleration near the end.
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      counter.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(tick);
  }

  if (statsSection && counters.length) {
    if (prefersReducedMotion) {
      counters.forEach((counter) => {
        const target = counter.dataset.count || "0";
        const suffix = counter.dataset.suffix || "";
        counter.textContent = `${target}${suffix}`;
      });
    } else if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counters.forEach(animateCounter);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      counterObserver.observe(statsSection);
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------------- 10. Footer year ---------------- */
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
