"use strict";

/* =========================================================
   FLORECER WELLNESS
   SITE INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setupStickyHeader();
  setupSmoothNavigation();
  setupCalendar();
  setupScrollReveals();
  setupCurrentYear();
});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function setupMobileNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");

  if (!menuToggle || !siteNav) return;

  const openMenu = () => {
    menuToggle.classList.add("active");
    siteNav.classList.add("active");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  };

  const closeMenu = () => {
    menuToggle.classList.remove("active");
    siteNav.classList.remove("active");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const menuIsOpen = siteNav.classList.contains("active");

    if (menuIsOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    const clickedInsideNavigation =
      siteNav.contains(event.target) ||
      menuToggle.contains(event.target);

    if (
      siteNav.classList.contains("active") &&
      !clickedInsideNavigation
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      siteNav.classList.contains("active")
    ) {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}


/* =========================================================
   STICKY HEADER
========================================================= */

function setupStickyHeader() {
  const siteHeader = document.getElementById("siteHeader");

  if (!siteHeader) return;

  const updateHeader = () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
}


/* =========================================================
   SMOOTH INTERNAL NAVIGATION
========================================================= */

function setupSmoothNavigation() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (history.pushState) {
        history.pushState(null, "", targetId);
      }
    });
  });
}


/* =========================================================
   CLASS AND EVENT DATA

   Edit the schedule here.

   Supported types:
   - "group"
   - "private"
   - "event"

   Example:

   {
     date: "2026-07-20",
     time: "6:00 PM",
     title: "Beginner Pilates",
     type: "group",
     description: "A beginner-friendly mat Pilates class.",
     link: "#inquiry"
   }
========================================================= */

const calendarEvents = [
  {
    date: "2026-07-08",
    time: "6:00 PM",
    title: "Beginner Pilates",
    type: "group",
    description:
      "A welcoming, beginner-friendly Pilates class focused on foundational movement and confidence.",
    link: "#inquiry"
  },
  {
    date: "2026-07-12",
    time: "10:00 AM",
    title: "Community Flow Class",
    type: "group",
    description:
      "A supportive community class combining mindful movement, strength, and connection.",
    link: "#inquiry"
  },
  {
    date: "2026-07-18",
    time: "12:00 PM",
    title: "Private Session Availability",
    type: "private",
    description:
      "One-on-one Pilates availability tailored to your goals, experience, and comfort level.",
    link: "#inquiry"
  },
  {
    date: "2026-07-26",
    time: "11:00 AM",
    title: "Wellness Event",
    type: "event",
    description:
      "A custom movement and wellness experience designed for connection and community.",
    link: "#inquiry"
  }
];


/* =========================================================
   CALENDAR
========================================================= */

function setupCalendar() {
  const calendarGrid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");
  const selectedDateText =
    document.getElementById("selectedDateText");
  const eventList = document.getElementById("eventList");
  const previousMonthButton =
    document.getElementById("prevMonth");
  const nextMonthButton =
    document.getElementById("nextMonth");

  if (
    !calendarGrid ||
    !monthYear ||
    !selectedDateText ||
    !eventList
  ) {
    return;
  }

  let displayedDate = new Date();
  let selectedDateString = null;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  function getDateString(year, month, day) {
    return [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0")
    ].join("-");
  }

  function getEventsForDate(dateString) {
    return calendarEvents.filter(event => {
      return event.date === dateString;
    });
  }

  function getTypeLabel(type) {
    const labels = {
      group: "Group Class",
      private: "Private Session",
      event: "Wellness Event"
    };

    return labels[type] || "Class";
  }

  function formatSelectedDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function isSameDay(dateOne, dateTwo) {
    return (
      dateOne.getFullYear() === dateTwo.getFullYear() &&
      dateOne.getMonth() === dateTwo.getMonth() &&
      dateOne.getDate() === dateTwo.getDate()
    );
  }

  function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();

    const firstDayOfMonth = new Date(
      year,
      month,
      1
    ).getDay();

    const numberOfDays = new Date(
      year,
      month + 1,
      0
    ).getDate();

    monthYear.textContent =
      displayedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });

    for (
      let emptyIndex = 0;
      emptyIndex < firstDayOfMonth;
      emptyIndex += 1
    ) {
      const emptyDay = document.createElement("div");

      emptyDay.className = "calendar-day empty";
      emptyDay.setAttribute("aria-hidden", "true");

      calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= numberOfDays; day += 1) {
      const dateString = getDateString(
        year,
        month,
        day
      );

      const eventsForDay =
        getEventsForDate(dateString);

      const calendarDate = new Date(
        year,
        month,
        day
      );

      const dayButton =
        document.createElement("button");

      dayButton.type = "button";
      dayButton.className = "calendar-day";
      dayButton.dataset.date = dateString;

      dayButton.setAttribute(
        "aria-label",
        `${formatSelectedDate(dateString)}${
          eventsForDay.length
            ? `, ${eventsForDay.length} offering${
                eventsForDay.length === 1 ? "" : "s"
              } available`
            : ", no offerings listed"
        }`
      );

      const dayNumber =
        document.createElement("strong");

      dayNumber.textContent = day;
      dayButton.appendChild(dayNumber);

      if (isSameDay(calendarDate, today)) {
        dayButton.classList.add("today");
      }

      if (eventsForDay.length > 0) {
        dayButton.classList.add("has-event");

        const eventDots =
          document.createElement("div");

        eventDots.className = "event-dots";
        eventDots.setAttribute("aria-hidden", "true");

        const uniqueTypes = [
          ...new Set(
            eventsForDay.map(event => event.type)
          )
        ];

        uniqueTypes.forEach(type => {
          const dot = document.createElement("span");

          dot.className = `event-dot ${type}`;
          eventDots.appendChild(dot);
        });

        dayButton.appendChild(eventDots);
      }

      if (selectedDateString === dateString) {
        dayButton.classList.add("selected");
      }

      dayButton.addEventListener("click", () => {
        selectedDateString = dateString;

        calendarGrid
          .querySelectorAll(".calendar-day")
          .forEach(dayElement => {
            dayElement.classList.remove("selected");
          });

        dayButton.classList.add("selected");

        renderSelectedDate(dateString);
      });

      calendarGrid.appendChild(dayButton);
    }
  }

  function renderSelectedDate(dateString) {
    const eventsForDay =
      getEventsForDate(dateString);

    selectedDateText.textContent =
      formatSelectedDate(dateString);

    if (eventsForDay.length === 0) {
      eventList.innerHTML = `
        <div class="event-item empty-event">
          <strong>No offerings listed</strong>
          <p>
            There are no scheduled classes or events listed
            for this date.
          </p>
          <a href="#inquiry">
            Ask about availability →
          </a>
        </div>
      `;

      return;
    }

    eventList.innerHTML = eventsForDay
      .map(event => {
        const safeType = [
          "group",
          "private",
          "event"
        ].includes(event.type)
          ? event.type
          : "group";

        return `
          <article class="event-item event-${safeType}">
            <div class="event-meta">
              <span>${getTypeLabel(event.type)}</span>
              <small>${event.time}</small>
            </div>

            <strong>${event.title}</strong>

            ${
              event.description
                ? `<p>${event.description}</p>`
                : ""
            }

            <a href="${event.link || "#inquiry"}">
              Inquire about this →
            </a>
          </article>
        `;
      })
      .join("");

    setupDynamicEventLinks();
  }

  function setupDynamicEventLinks() {
    eventList
      .querySelectorAll('a[href^="#"]')
      .forEach(link => {
        link.addEventListener("click", event => {
          const targetSelector =
            link.getAttribute("href");

          const targetElement =
            document.querySelector(targetSelector);

          if (!targetElement) return;

          event.preventDefault();

          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      });
  }

  if (previousMonthButton) {
    previousMonthButton.addEventListener(
      "click",
      () => {
        displayedDate = new Date(
          displayedDate.getFullYear(),
          displayedDate.getMonth() - 1,
          1
        );

        selectedDateString = null;

        renderCalendar();
        renderDefaultScheduleState();
      }
    );
  }

  if (nextMonthButton) {
    nextMonthButton.addEventListener(
      "click",
      () => {
        displayedDate = new Date(
          displayedDate.getFullYear(),
          displayedDate.getMonth() + 1,
          1
        );

        selectedDateString = null;

        renderCalendar();
        renderDefaultScheduleState();
      }
    );
  }

  function renderDefaultScheduleState() {
    selectedDateText.textContent = "Choose a date";

    eventList.innerHTML = `
      <div class="empty-schedule-state">
        <span aria-hidden="true">✦</span>

        <p>
          Select a date on the calendar to view available
          classes and wellness experiences.
        </p>
      </div>
    `;
  }

  renderCalendar();
}


/* =========================================================
   SCROLL REVEAL ANIMATIONS
========================================================= */

function setupScrollReveals() {
  const revealElements =
    document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });

    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });

    return;
  }

  const revealObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.13,
        rootMargin: "0px 0px -45px 0px"
      }
    );

  revealElements.forEach((element, index) => {
    const delay = Math.min(
      (index % 3) * 90,
      180
    );

    element.style.transitionDelay = `${delay}ms`;

    revealObserver.observe(element);
  });
}


/* =========================================================
   CURRENT FOOTER YEAR
========================================================= */

function setupCurrentYear() {
  const currentYear =
    document.getElementById("currentYear");

  if (!currentYear) return;

  currentYear.textContent =
    new Date().getFullYear();
}