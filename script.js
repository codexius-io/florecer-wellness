"use strict";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupHeader();
  setupCalendar();
  setupReveals();
  setupCurrentYear();
});


/* Navigation */

function setupNavigation() {
  const menuButton = document.getElementById("menuButton");
  const navigation = document.getElementById("siteNavigation");

  if (!menuButton || !navigation) return;

  function closeMenu() {
    menuButton.classList.remove("active");
    navigation.classList.remove("active");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }

  function openMenu() {
    menuButton.classList.add("active");
    navigation.classList.add("active");
    document.body.classList.add("menu-open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute(
      "aria-label",
      "Close navigation menu"
    );
  }

  menuButton.addEventListener("click", () => {
    if (navigation.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    const clickedInside =
      navigation.contains(event.target) ||
      menuButton.contains(event.target);

    if (
      navigation.classList.contains("active") &&
      !clickedInside
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });
}


/* Header */

function setupHeader() {
  const header = document.getElementById("siteHeader");

  if (!header) return;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 25);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
}


/* Calendar events

   Add or update classes here.

   Types:
   group
   private
   event
*/

const calendarEvents = [
  {
    date: "2026-08-01",
    time: "10:00 AM",
    title: "Bloom, Breathe & Balance",
    type: "event",
    description:
      "A thoughtfully curated morning where movement, flowers, wellness, and community come together."
  },
  {
    date: "2026-08-09",
    time: "12:00 AM",
    title: "Coming soon",
    type: "group",
    description:
      "Details coming soon."
  },
];


/* Calendar */

function setupCalendar() {
  const calendarGrid = document.getElementById("calendarGrid");
  const calendarMonth = document.getElementById("calendarMonth");
  const selectedDate = document.getElementById("selectedDate");
  const eventList = document.getElementById("eventList");
  const previousButton =
    document.getElementById("previousMonth");
  const nextButton =
    document.getElementById("nextMonth");

  if (
    !calendarGrid ||
    !calendarMonth ||
    !selectedDate ||
    !eventList
  ) {
    return;
  }

  let displayedDate = new Date();
  let chosenDate = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function createDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function getEvents(dateString) {
    return calendarEvents.filter(event => {
      return event.date === dateString;
    });
  }

  function getTypeName(type) {
    const names = {
      group: "Group Class",
      private: "Private Session",
      event: "Wellness Event"
    };

    return names[type] || "Class";
  }

  function formatDate(dateString) {
    return new Date(`${dateString}T00:00:00`)
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
  }

  function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();

    calendarMonth.textContent =
      displayedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let index = 0; index < firstDay; index += 1) {
      const empty = document.createElement("div");

      empty.className = "calendar-day empty";
      empty.setAttribute("aria-hidden", "true");

      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const dateString =
        createDateString(year, month, day);

      const dayEvents = getEvents(dateString);
      const date = new Date(year, month, day);

      const button = document.createElement("button");

      button.type = "button";
      button.className = "calendar-day";
      button.dataset.date = dateString;
      button.innerHTML = `<strong>${day}</strong>`;

      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      ) {
        button.classList.add("today");
      }

      if (dayEvents.length > 0) {
        button.classList.add("has-event");

        const dots = document.createElement("div");
        dots.className = "event-dots";

        const uniqueTypes = [
          ...new Set(dayEvents.map(event => event.type))
        ];

        uniqueTypes.forEach(type => {
          const dot = document.createElement("span");

          dot.className = `event-dot ${type}`;
          dots.appendChild(dot);
        });

        button.appendChild(dots);
      }

      if (chosenDate === dateString) {
        button.classList.add("selected");
      }

      button.setAttribute(
        "aria-label",
        `${formatDate(dateString)}, ${dayEvents.length} scheduled offering${dayEvents.length === 1 ? "" : "s"}`
      );

      button.addEventListener("click", () => {
        chosenDate = dateString;

        calendarGrid
          .querySelectorAll(".calendar-day")
          .forEach(dayElement => {
            dayElement.classList.remove("selected");
          });

        button.classList.add("selected");

        renderEvents(dateString);
      });

      calendarGrid.appendChild(button);
    }
  }

  function renderEvents(dateString) {
    const events = getEvents(dateString);

    selectedDate.textContent = formatDate(dateString);

    if (events.length === 0) {
      eventList.innerHTML = `
        <div class="event-item empty-event">
          <strong>No offerings listed</strong>

          <p>
            There are no scheduled classes or events
            listed for this date.
          </p>

          <a href="#inquiry">
            Ask about availability →
          </a>
        </div>
      `;

      return;
    }

    eventList.innerHTML = events
      .map(event => {
        const validType = [
          "group",
          "private",
          "event"
        ].includes(event.type)
          ? event.type
          : "group";

        return `
          <article class="event-item event-${validType}">
            <div class="event-meta">
              <span>${getTypeName(event.type)}</span>
              <small>${event.time}</small>
            </div>

            <strong>${event.title}</strong>

            <p>${event.description || ""}</p>

            <a href="#inquiry">
              Inquire about this →
            </a>
          </article>
        `;
      })
      .join("");
  }

  function resetEventPanel() {
    chosenDate = null;
    selectedDate.textContent = "Choose a date";

    eventList.innerHTML = `
      <div class="empty-state">
        <span>✦</span>

        <p>
          Select a date to view available
          wellness experiences.
        </p>
      </div>
    `;
  }

  previousButton?.addEventListener("click", () => {
    displayedDate = new Date(
      displayedDate.getFullYear(),
      displayedDate.getMonth() - 1,
      1
    );

    renderCalendar();
    resetEventPanel();
  });

  nextButton?.addEventListener("click", () => {
    displayedDate = new Date(
      displayedDate.getFullYear(),
      displayedDate.getMonth() + 1,
      1
    );

    renderCalendar();
    resetEventPanel();
  });

  renderCalendar();
}


/* Scroll animations */

function setupReveals() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach(element => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });
}


/* Footer year */

function setupCurrentYear() {
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}
/* =========================================================
   FLOATING LOGO — BACK TO TOP
========================================================= */

const scrollTopButton = document.getElementById("scrollTop");

if (scrollTopButton) {
  const updateScrollTopButton = () => {
    scrollTopButton.classList.toggle(
      "show",
      window.scrollY > 500
    );
  };

  updateScrollTopButton();

  window.addEventListener(
    "scroll",
    updateScrollTopButton,
    { passive: true }
  );

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}