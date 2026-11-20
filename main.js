/* Ghostware - main.js */
(function () {
	"use strict";

	/* Mensaje precargado en todos los enlaces de WhatsApp */
	var defaultMsg = "Hola, vi tu web y quiero cotizar una pagina para mi negocio.";
	document.querySelectorAll("a[data-wa]").forEach(function (link) {
		var msg = link.getAttribute("data-msg") || defaultMsg;
		link.href = "https://wa.me/51923576699?text=" + encodeURIComponent(msg);
	});

	/* Menu movil */
	var header = document.querySelector("header");
	var toggle = document.querySelector(".nav-toggle");

	function closeNav() {
		header.classList.remove("nav-open");
		document.body.classList.remove("nav-open-mobile");
		toggle.setAttribute("aria-expanded", "false");
	}

	toggle.addEventListener("click", function () {
		var open = header.classList.toggle("nav-open");
		document.body.classList.toggle("nav-open-mobile", open);
		toggle.setAttribute("aria-expanded", open ? "true" : "false");
	});

	document.querySelectorAll("nav a").forEach(function (a) {
		a.addEventListener("click", closeNav);
	});
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") closeNav();
	});
	window.addEventListener("resize", function () {
		if (window.innerWidth > 700) closeNav();
	});

	/* Aparicion suave al hacer scroll (solo fade-up) */
	var items = document.querySelectorAll(".section-head, .project, .price-card, .about-wrap, .faq-list, .contact-inner");
	items.forEach(function (el) { el.classList.add("reveal"); });
	if ("IntersectionObserver" in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12 });
		items.forEach(function (el) { io.observe(el); });
	} else {
		items.forEach(function (el) { el.classList.add("in-view"); });
	}

	/* FAQ: solo una abierta a la vez */
	document.querySelectorAll(".faq-item").forEach(function (item) {
		item.addEventListener("toggle", function () {
			if (!item.open) return;
			document.querySelectorAll(".faq-item[open]").forEach(function (other) {
				if (other !== item) other.removeAttribute("open");
			});
		});
	});
})();
