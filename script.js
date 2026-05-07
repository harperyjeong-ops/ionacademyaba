document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".hamburger");
  const carousel = document.querySelector(".resource-carousel");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const fadeTargets = document.querySelectorAll(".fade-in");
  const parallaxTargets = document.querySelectorAll(".parallax");
  const navLinks = document.querySelectorAll(".nav a");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const closeNav = () => {
    if (!nav || !hamburger) return;
    nav.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger?.addEventListener("click", () => {
    if (!nav) return;
    const isOpen = nav.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav || !hamburger) return;
    if (
      nav.classList.contains("active") &&
      !event.target.closest(".nav") &&
      !event.target.closest(".hamburger")
    ) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("active")) {
      closeNav();
      hamburger?.focus();
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    fadeTargets.forEach((element) => observer.observe(element));
  } else {
    fadeTargets.forEach((element) => element.classList.add("show"));
  }

  const updateCarouselButtons = () => {
    if (!carousel || !prevBtn || !nextBtn) return;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const isAtStart = carousel.scrollLeft <= 4;
    const isAtEnd = carousel.scrollLeft >= maxScrollLeft - 4;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  };

  if (carousel && prevBtn && nextBtn) {
    const scrollAmount = Math.min(360, carousel.clientWidth * 0.9);

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    carousel.addEventListener("scroll", updateCarouselButtons, { passive: true });
    window.addEventListener("resize", updateCarouselButtons);
    updateCarouselButtons();
  }

  if (prefersReducedMotion.matches || parallaxTargets.length === 0) {
    return;
  }

  let ticking = false;
  const updateParallax = () => {
    parallaxTargets.forEach((element) => {
      const speed = Number(element.dataset.speed || 0.1);
      const offset = element.getBoundingClientRect().top * speed;
      element.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  };

  const requestParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  requestParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
});
