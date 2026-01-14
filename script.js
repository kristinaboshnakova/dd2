/*===== EXPANDER MENU  =====*/
function showMenu(toggleId, navId) {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
      toggle.classList.toggle("bx-x");
    });
  }
}
showMenu("header-toggle", "nav-menu");

/*===== ACTIVE LINK =====*/
const navLinks = document.querySelectorAll(".nav__link");
function linkAction() {
  navLinks.forEach((n) => n.classList.remove("active"));
  this.classList.add("active");
}
navLinks.forEach((n) => n.addEventListener("click", linkAction));

/*===== HEADER SCROLL EFFECT =====*/
const header = document.getElementById("site-header");
function onScroll() {
  if (!header) return;
  header.classList.toggle("header--scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", onScroll);
onScroll();
/* ===== BOOKING / MODAL ===== */
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const guests = document.getElementById("guests");

const modal = document.getElementById("bookingModal");
const openBtn = document.getElementById("openBookingModal");
const closeBtn = document.getElementById("closeBookingModalBtn");
const overlay = document.getElementById("closeBookingModalOverlay");
const errorBox = document.getElementById("bookingError");

const modalCheckin = document.getElementById("modalCheckin");
const modalCheckout = document.getElementById("modalCheckout");
const modalGuests = document.getElementById("modalGuests");

const modalForm = document.getElementById("bookingModalForm");

// SUCCESS element (при теб е извън modal-а, но ще го показваме/крием)
const successBox = document.getElementById("bookingSuccess");

/* ===== Date rules ===== */
(function initDates() {
  if (!checkin || !checkout) return;

  const today = new Date().toISOString().split("T")[0];
  checkin.min = today;
  checkout.min = today;

  checkin.addEventListener("change", () => {
    checkout.min = checkin.value || today;
    if (checkout.value && checkin.value && checkout.value <= checkin.value) {
      checkout.value = "";
    }
  });
})();

/* ===== Open modal with validation ===== */
if (openBtn) {
  openBtn.addEventListener("click", () => {
    if (errorBox) errorBox.textContent = "";

    if (!checkin?.value || !checkout?.value) {
      if (errorBox) errorBox.textContent = "Моля, изберете дати за престоя.";
      return;
    }

    if (checkout.value <= checkin.value) {
      if (errorBox) errorBox.textContent = "Напускането трябва да е след пристигането.";
      return;
    }

    // fill hidden modal fields
    if (modalCheckin) modalCheckin.value = checkin.value;
    if (modalCheckout) modalCheckout.value = checkout.value;
    if (modalGuests) modalGuests.value = guests?.value || "2";

    // reset modal UI
    if (successBox) successBox.classList.remove("is-visible");
    if (modalForm) modalForm.style.display = "grid";

    // open modal
    if (modal) modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });
}

/* ===== Close modal ===== */
function closeModal() {
  if (modal) modal.classList.remove("is-open");
  document.body.style.overflow = "";

  // reset for next open
  if (successBox) successBox.classList.remove("is-visible");
  if (modalForm) modalForm.style.display = "grid";
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (overlay) overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ===== Submit to Formspree (show success INSIDE modal) ===== */
if (modalForm) {
  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(modalForm);

    try {
      const res = await fetch(modalForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        // ✅ НЕ затваряме модала!
        // modal остава отворен

        // 1) reset
        modalForm.reset();

        // 2) скрий формата
        modalForm.style.display = "none";

        // 3) покажи success
        if (successBox) successBox.classList.add("is-visible");

        // (по желание) ако искаш да се върне формата автоматично след X секунди:
        // setTimeout(() => {
        //   if (successBox) successBox.classList.remove("is-visible");
        //   modalForm.style.display = "grid";
        // }, 4000);

      } else {
        alert("Грешка при изпращане.");
      }
    } catch {
      alert("Няма връзка. Опитайте по-късно.");
    }
  });
}


/* ===== CLOSE MOBILE MENU ON OUTSIDE CLICK ===== */
const navMenu = document.getElementById("nav-menu");
const toggleBtn = document.getElementById("header-toggle");

// затваряне функция
function closeMobileMenu() {
  if (!navMenu || !toggleBtn) return;
  navMenu.classList.remove("show");
  toggleBtn.classList.remove("bx-x");
}

// клик извън менюто -> затваря
document.addEventListener("click", (e) => {
  if (!navMenu || !toggleBtn) return;

  const menuIsOpen = navMenu.classList.contains("show");
  if (!menuIsOpen) return;

  const clickedInsideMenu = navMenu.contains(e.target);
  const clickedToggle = toggleBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMobileMenu();
  }
});


