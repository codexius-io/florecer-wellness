// ===========================
// ELEMENTS
// ===========================

const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.querySelector("header");
const mouseGlow = document.getElementById("mouseGlow");

const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const faqItems = document.querySelectorAll(".faq-item");
const tiltCards = document.querySelectorAll(".tilt-card");

document.body.classList.add("no-scroll");

// ===========================
// LOADER
// ===========================

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");
        document.body.classList.remove("no-scroll");

        revealOnScroll();
        startCounters();

    }, 900);

});

// ===========================
// MOBILE MENU
// ===========================

menuBtn.addEventListener("click", () => {

    nav.classList.toggle("active");

    menuBtn.textContent =
        nav.classList.contains("active")
        ? "✕"
        : "☰";

});

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");
        menuBtn.textContent = "☰";

    });

});

// ===========================
// STICKY HEADER
// ===========================

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

// ===========================
// REVEAL
// ===========================

function revealOnScroll() {

    revealElements.forEach(el => {

        const top = el.getBoundingClientRect().top;

        if (top < window.innerHeight - 120) {

            el.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

// ===========================
// COUNTERS
// ===========================

let countersStarted = false;

function startCounters() {

    if (countersStarted) return;

    const stats = document.getElementById("stats");

    if (!stats) return;

    if (stats.getBoundingClientRect().top < window.innerHeight - 120) {

        countersStarted = true;

        counters.forEach(counter => {

            const target = parseFloat(counter.dataset.count);
            const suffix = counter.dataset.suffix || "";

            const duration = 1800;
            const start = performance.now();

            function animate(time) {

                const progress = Math.min((time - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;

                if (target % 1 !== 0) {

                    counter.textContent = value.toFixed(1) + suffix;

                } else {

                    counter.textContent =
                        Math.floor(value).toLocaleString() + suffix;

                }

                if (progress < 1) {

                    requestAnimationFrame(animate);

                } else {

                    counter.textContent =
                        target % 1 !== 0
                            ? target.toFixed(1) + suffix
                            : target.toLocaleString() + suffix;

                    counter.style.color = "#d71920";

                    setTimeout(() => {

                        counter.style.color = "";

                    }, 700);

                }

            }

            requestAnimationFrame(animate);

        });

    }

}

window.addEventListener("scroll", startCounters);

// ===========================
// SCROLL PROGRESS BAR
// ===========================

const progress = document.createElement("div");

progress.className = "scroll-progress";

document.body.appendChild(progress);

function updateProgress() {

    const scroll = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;

    progress.style.width = `${(scroll / height) * 100}%`;

}

window.addEventListener("scroll", updateProgress);

// ===========================
// BACK TO TOP
// ===========================

const topBtn = document.createElement("button");

topBtn.className = "back-to-top";
topBtn.innerHTML = "↑";

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {

    if (window.scrollY > 700) {

        topBtn.classList.add("active");

    } else {

        topBtn.classList.remove("active");

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});

// ===========================
// FAQ
// ===========================

faqItems.forEach(item => {

    item.querySelector(".faq-question").addEventListener("click", () => {

        faqItems.forEach(other => {

            if (other !== item) {

                other.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});

// ===========================
// HERO PARALLAX
// ===========================

const heroImage = document.querySelector(".hero-image img");

window.addEventListener("scroll", () => {

    if (!heroImage) return;

    if (window.innerWidth > 768) {

        heroImage.style.transform =
            `translateY(${window.scrollY * 0.15}px) scale(1.03)`;

    }

});

// ===========================
// MOUSE GLOW
// ===========================

document.addEventListener("mousemove", e => {

    if (!mouseGlow) return;

    mouseGlow.style.left = e.clientX + "px";
    mouseGlow.style.top = e.clientY + "px";

});

// ===========================
// 3D CARD TILT
// ===========================

tiltCards.forEach(card => {

    card.addEventListener("mousemove", e => {

        if (window.innerWidth < 992) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = (x / rect.width - 0.5) * 12;
        const rotateX = -(y / rect.height - 0.5) * 12;

        card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

// ===========================
// INITIALIZE
// ===========================

revealOnScroll();
updateProgress();