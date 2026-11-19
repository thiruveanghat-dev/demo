const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const progressBar = document.querySelector(".scroll-progress");
const introVideo = document.querySelector(".hero-video");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function syncIntroVideoMotion() {
  if (motionPreference.matches) {
    introVideo.pause();
    return;
  }

  introVideo.play().catch((error) => {
    if (error.name !== "NotAllowedError") {
      console.error("Could not play the hero video.", error);
    }
  });
}

syncIntroVideoMotion();
motionPreference.addEventListener("change", syncIntroVideoMotion);

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

let scrollScheduled = false;
window.addEventListener("scroll", () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    scrollScheduled = false;
  });
}, { passive: true });
