
// document.addEventListener('DOMContentLoaded', () => {
//     const navIcons = document.querySelectorAll('.nav-icons .active-btn');
//     const sections = document.querySelectorAll('.tab-section');

//     navIcons.forEach((icon, index) => {
//         icon.addEventListener('click', () => {
//             // Remove active class from all sections
//             sections.forEach(section => section.classList.remove('active'));
            
//             // Add active class to the corresponding section
//             const sectionId = icon.dataset.section || ['home', 'profile', 'blog'][index];
//             const targetSection = document.getElementById(sectionId);
//             if (targetSection) {
//                 targetSection.classList.add('active');
//             }
//         });
//     });
// });
// JavaScript (script.js)
document.addEventListener('DOMContentLoaded', () => {
  const navIcons = document.querySelectorAll('.nav-icons button');
  const sections = document.querySelectorAll('.tab-section');

  navIcons.forEach((button, index) => {
    button.addEventListener('click', () => {
      sections.forEach(section => section.classList.remove('active'));
      navIcons.forEach(btn => btn.classList.remove('active-btn'));

      const sectionId = button.querySelector('img')?.getAttribute('data-section') || ['home', 'blog', 'calendar-daily', 'profile'][index];
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      button.classList.add('active-btn');
    });
  });

  window.switchView = function (id) {
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if (id === 'calendar-daily') renderDaily();
  };

  let currentDate = new Date("2025-11-18");
  let appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  let serviceHistory = JSON.parse(localStorage.getItem("services") || "[]");

  const timeSlots = ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"];
  const slotContainer = document.getElementById("dailySlots");

  window.changeDate = function (delta) {
    currentDate.setDate(currentDate.getDate() + delta);
    renderDaily();
  };

  function formatDate(d) {
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function renderDaily() {
    document.getElementById("currentDate").textContent = formatDate(currentDate);
    slotContainer.innerHTML = "";

    timeSlots.forEach(time => {
      const found = appointments.find(a => a.date === formatDate(currentDate) && a.time === time);
      const div = document.createElement("div");
      div.className = "slot";
      div.textContent = time;
      if (found) {
        div.classList.add(found.completed ? "green" : "red");
        div.textContent = `Appointment with ${found.firstName} ${found.lastName} for ${found.service}`;
      }
      div.onclick = () => openPopup(time, found);
      slotContainer.appendChild(div);
    });
  }

  function openPopup(time, existing = null) {
    const popup = document.getElementById("appointmentPopup");
    popup.style.display = "flex";

    document.getElementById("popupTitle").textContent = existing ? "Appointment Details" : "New Appointment";
    document.getElementById("popupTime").value = time;
    document.getElementById("popupDate").value = formatDate(currentDate);
    document.getElementById("popupStatusDot").className = "status-dot " + (existing?.completed ? "green" : "red");

    const f = id => document.getElementById(id);
    f("firstName").value = existing?.firstName || "";
    f("lastName").value = existing?.lastName || "";
    f("phone").value = existing?.phone || "";
    f("description").value = existing?.description || "";

    const serviceSelect = f("service");
    serviceSelect.innerHTML = '<option value="">Select service</option>' +
      serviceHistory.map(s => `<option value="${s}" ${s === existing?.service ? 'selected' : ''}>${s}</option>`).join("");

    if (existing && !serviceHistory.includes(existing.service)) {
      const opt = document.createElement("option");
      opt.textContent = existing.service;
      opt.value = existing.service;
      opt.selected = true;
      serviceSelect.appendChild(opt);
    }

    const actions = document.getElementById("popupActions").children;
    actions[0].style.display = existing ? "none" : "inline-block";
    actions[1].style.display = existing && !existing.completed ? "inline-block" : "none";
    actions[2].style.display = existing && !existing.completed ? "inline-block" : "none";
  }

  window.closePopup = function () {
    document.getElementById("appointmentPopup").style.display = "none";
  };

  window.saveAppointment = function () {
    const get = id => document.getElementById(id).value;
    const appointment = {
      firstName: get("firstName"),
      lastName: get("lastName"),
      phone: get("phone"),
      service: get("service"),
      description: get("description"),
      time: get("popupTime"),
      date: get("popupDate"),
      completed: false
    };
    appointments.push(appointment);
    if (!serviceHistory.includes(appointment.service)) {
      serviceHistory.push(appointment.service);
    }
    localStorage.setItem("appointments", JSON.stringify(appointments));
    localStorage.setItem("services", JSON.stringify(serviceHistory));
    closePopup();
    renderDaily();
  };

  window.completeAppointment = function () {
    const time = document.getElementById("popupTime").value;
    const date = document.getElementById("popupDate").value;
    const match = appointments.find(a => a.date === date && a.time === time);
    if (match) match.completed = true;
    localStorage.setItem("appointments", JSON.stringify(appointments));
    closePopup();
    renderDaily();
  };

  window.cancelAppointment = function () {
    const time = document.getElementById("popupTime").value;
    const date = document.getElementById("popupDate").value;
    const index = appointments.findIndex(a => a.date === date && a.time === time);
    if (index !== -1) appointments.splice(index, 1);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    closePopup();
    renderDaily();
  };

  renderDaily();
});
