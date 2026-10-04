(() => {
  "use strict";

  const clinicPhone = "919543709302";
  const whatsappBase = `https://wa.me/${clinicPhone}`;

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const dateInput = document.querySelector("#date");
  if (dateInput) {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    dateInput.min = local.toISOString().slice(0, 10);
  }

  const form = document.querySelector("#appointmentForm");
  const error = document.querySelector("#formError");

  const clean = (value, max) =>
    String(value || "")
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .trim()
      .slice(0, max);

  const validIndianPhone = value => /^[6-9]\d{9}$/.test(value.replace(/\D/g, ""));

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      error.hidden = true;
      error.textContent = "";

      const name = clean(document.querySelector("#name").value, 80);
      const rawPhone = clean(document.querySelector("#phone").value, 15);
      const phone = rawPhone.replace(/\D/g, "");
      const service = clean(document.querySelector("#service").value, 60);
      const date = clean(document.querySelector("#date").value, 10);
      const time = clean(document.querySelector("#time").value, 20);
      const message = clean(document.querySelector("#message").value, 500);
      const consent = document.querySelector("#consent").checked;

      const allowedServices = new Set([
        "Dental Check-up", "Teeth Cleaning", "Root Canal Treatment", "Dental Implants",
        "Extraction", "Teeth Whitening", "Veneers & Crowns", "Dentures & Bridges",
        "Paediatric Dentistry", "Oral Surgery", "Other"
      ]);
      const allowedTimes = new Set(["5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM"]);

      if (name.length < 2) return showError("Please enter your full name.");
      if (!validIndianPhone(phone)) return showError("Please enter a valid 10-digit Indian mobile number.");
      if (!allowedServices.has(service)) return showError("Please select a service from the list.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return showError("Please select a valid appointment date.");
      if (date < dateInput.min) return showError("Please select today or a future date.");
      if (!allowedTimes.has(time)) return showError("Please select a consultation time.");
      if (!consent) return showError("Please confirm that this is an appointment request.");

      const text =
`Hello, I would like to request a dental appointment.

Name: ${name}
Mobile: ${phone}
Service / Reason: ${service}
Preferred date: ${date}
Preferred time: ${time}
Additional message: ${message || "None"}

Please confirm the appointment availability.`;

      window.open(`${whatsappBase}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    });
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  // These two links are intentionally placeholders until the clinic supplies its exact Google links.
  document.querySelector("#reviewsLink")?.addEventListener("click", e => {
    e.preventDefault();
    alert("Add the clinic's exact Google Business Profile URL here before launch.");
  });
  document.querySelector("#mapLink")?.addEventListener("click", e => {
    e.preventDefault();
    alert("Add the clinic's exact Google Maps location URL here before launch.");
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
})();
