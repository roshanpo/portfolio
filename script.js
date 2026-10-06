document.addEventListener("DOMContentLoaded", () => {
    const progress = document.querySelector(".scroll-progress span");
    const navLinks = [...document.querySelectorAll(".rail-nav a")];
    const sections = navLinks
        .map((link) => document.getElementById(link.dataset.section))
        .filter(Boolean);

    const setActive = (id) => {
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
        });
    };

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progress) progress.style.width = `${Math.min(1, Math.max(0, value)) * 100}%`;
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
        },
        {
            rootMargin: "-20% 0px -55% 0px",
            threshold: [0.15, 0.35, 0.6],
        }
    );

    sections.forEach((section) => observer.observe(section));

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.getElementById(link.dataset.section);
            if (!target) return;
            event.preventDefault();
            setActive(link.dataset.section);
            target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
            history.replaceState(null, "", `#${link.dataset.section}`);
        });
    });

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
});

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
