const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

/*
  EDIT CLASS TIMES AND EVENTS HERE.

  type options:
  - "group"
  - "private"
  - "event"
*/

const events = [
  {
    date: "2026-07-08",
    time: "6:00 PM",
    title: "Beginner Pilates",
    type: "group",
    link: "#booking"
  },
  {
    date: "2026-07-12",
    time: "10:00 AM",
    title: "Community Flow Class",
    type: "group",
    link: "#booking"
  },
  {
    date: "2026-07-18",
    time: "12:00 PM",
    title: "Private Session Availability",
    type: "private",
    link: "#inquiry"
  },
  {
    date: "2026-07-26",
    time: "11:00 AM",
    title: "Wellness Event",
    type: "event",
    link: "#inquiry"
  }
];

const calendarGrid = document.getElementById("calendarGrid");
const monthYear = document.getElementById("monthYear");
const selectedDateText = document.getElementById("selectedDateText");
const eventList = document.getElementById("eventList");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();

function getTypeLabel(type) {
  if (type === "group") return "Group Class";
  if (type === "private") return "Private Session";
  if (type === "event") return "Wellness Event";
  return "Class";
}

function renderCalendar() {
  if (!calendarGrid) return;

  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = events.filter(event => event.date === dateString);

    const dayBox = document.createElement("button");
    dayBox.className = "calendar-day";
    dayBox.type = "button";
    dayBox.innerHTML = `<strong>${day}</strong>`;

    const today = new Date();
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    if (isToday) {
      dayBox.classList.add("today");
    }

    if (dayEvents.length > 0) {
      dayBox.classList.add("has-event");

      const dots = document.createElement("div");
      dots.className = "event-dots";

      dayEvents.forEach(event => {
        const dot = document.createElement("span");
        dot.className = `event-dot ${event.type}`;
        dots.appendChild(dot);
      });

      dayBox.appendChild(dots);
    }

    dayBox.addEventListener("click", () => {
      document.querySelectorAll(".calendar-day").forEach(day => {
        day.classList.remove("selected");
      });

      dayBox.classList.add("selected");
      showEvents(dateString);
    });

    calendarGrid.appendChild(dayBox);
  }
}

function showEvents(dateString) {
  const date = new Date(dateString + "T00:00:00");

  selectedDateText.textContent = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const dayEvents = events.filter(event => event.date === dateString);

  if (dayEvents.length === 0) {
    eventList.innerHTML = `
      <div class="event-item empty-event">
        <p>No classes listed for this date.</p>
        <a href="#contact">Ask about availability →</a>
      </div>
    `;
    return;
  }

  eventList.innerHTML = dayEvents.map(event => `
    <div class="event-item event-${event.type}">
      <div class="event-meta">
        <span>${getTypeLabel(event.type)}</span>
        <small>${event.time}</small>
      </div>
      <strong>${event.title}</strong>
      <a href="${event.link}">Inquire about this →</a>
    </div>
  `).join("");
}

if (prevMonth && nextMonth) {
  prevMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
}

renderCalendar();
/* Scroll animations */
const revealElements = document.querySelectorAll(
  ".section, .calendar-section, .inquiry-section, .quote-banner, .final-cta, .offer-card, .image-card, .contact-card"
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach(element => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});