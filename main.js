/* ═══════════════════════════════════════════════
   GHOSTWARE — main.js
   Scroll animations, particles, progress & nav
   ═══════════════════════════════════════════════ */

(function () {
	"use strict";

	/* ── 1. Scroll-triggered animations ── */
	const animObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					animObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12 }
	);

	document.querySelectorAll("[data-anim]").forEach((el) => animObserver.observe(el));

	/* ── 2. Glow line dividers ── */
	const lineObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					lineObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 }
	);

	document.querySelectorAll(".glow-line").forEach((el) => lineObserver.observe(el));

	/* ── 3. Stagger children automatically ── */
	document.querySelectorAll(".pricing-grid, .portfolio-grid, .service-grid, .blog-grid, .testimonial-row, .contact-meta")
		.forEach((grid) => {
			Array.from(grid.children).forEach((child, i) => {
				if (!child.hasAttribute("data-delay")) {
					child.setAttribute("data-delay", String(i + 1));
				}
			});
		});

	/* ── 4. Scroll progress bar ── */
	const progressBar = document.querySelector(".scroll-progress");
	if (progressBar) {
		window.addEventListener("scroll", () => {
			const scrollTop = document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
			progressBar.style.width = progress + "%";
		}, { passive: true });
	}

	/* ── 5. Active nav highlight ── */
	const sections = document.querySelectorAll("main section[id]");
	const navLinks = document.querySelectorAll("nav a[href^='#']");

	const navObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const id = entry.target.getAttribute("id");
					navLinks.forEach((link) => {
						link.classList.toggle("active", link.getAttribute("href") === "#" + id);
					});
				}
			});
		},
		{ rootMargin: "-30% 0px -60% 0px" }
	);

	sections.forEach((sec) => navObserver.observe(sec));

	/* ── 6. Decorative particles in hero ── */
	const hero = document.querySelector(".hero");
	if (hero) {
		const fragment = document.createDocumentFragment();
		for (let i = 0; i < 12; i++) {
			const dot = document.createElement("span");
			dot.classList.add("particle");
			dot.style.left = Math.random() * 100 + "%";
			dot.style.top = Math.random() * 100 + "%";
			dot.style.animationDelay = (Math.random() * 4).toFixed(1) + "s";
			dot.style.animationDuration = (3 + Math.random() * 3).toFixed(1) + "s";
			const size = 2 + Math.random() * 4;
			dot.style.width = size + "px";
			dot.style.height = size + "px";
			fragment.appendChild(dot);
		}
		hero.appendChild(fragment);
	}

	/* ── 7. Hide scroll hint on scroll ── */
	const scrollHint = document.querySelector(".scroll-hint");
	if (scrollHint) {
		let hintHidden = false;
		window.addEventListener("scroll", () => {
			if (!hintHidden && window.scrollY > 80) {
				scrollHint.style.opacity = "0";
				scrollHint.style.transition = "opacity 0.5s ease";
				hintHidden = true;
			}
		}, { passive: true });
	}

	/* ── 8. Counter animation for prices ── */
	const priceEls = document.querySelectorAll(".price-value");
	const counterObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target;
				counterObserver.unobserve(el);

				const text = el.textContent;
				const match = text.match(/(\d+)/);
				if (!match) return;

				const target = parseInt(match[1], 10);
				const suffix = text.replace(match[0], "").trim();
				const prefix = text.substring(0, text.indexOf(match[0]));
				const duration = 900;
				const start = performance.now();

				function step(now) {
					const elapsed = now - start;
					const progress = Math.min(elapsed / duration, 1);
					const eased = 1 - Math.pow(1 - progress, 3);
					const current = Math.round(eased * target);
					el.innerHTML = prefix + current + " <small>" + (el.querySelector("small")?.textContent || suffix) + "</small>";
					if (progress < 1) requestAnimationFrame(step);
				}

				const smallText = el.querySelector("small")?.textContent || "";
				requestAnimationFrame(step);
			});
		},
		{ threshold: 0.4 }
	);

	priceEls.forEach((el) => counterObserver.observe(el));

	/* ── 9. Smooth card tilt on hover (service & blog cards) ── */
	document.querySelectorAll(".service-grid .card, .blog-grid .card, .portfolio-grid .card").forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const rotateX = ((y - centerY) / centerY) * -4;
			const rotateY = ((x - centerX) / centerX) * 4;
			card.style.transform = "perspective(600px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
		});

		card.addEventListener("mouseleave", () => {
			card.style.transform = "";
		});
	});

	/* ── 10. Form submit handler ── */
	const form = document.querySelector("form");
	if (form) {
		form.addEventListener("submit", (event) => {
			event.preventDefault();
			const btn = form.querySelector("button[type='submit']");
			const originalText = btn.textContent;
			btn.textContent = "Enviado ✓";
			btn.disabled = true;
			setTimeout(() => {
				btn.textContent = originalText;
				btn.disabled = false;
				form.reset();
			}, 2500);
		});
	}

	/* ── 11. FAQ accordion — cierra otros al abrir uno ── */
	document.querySelectorAll(".faq-item").forEach((item) => {
		item.addEventListener("toggle", () => {
			if (item.open) {
				document.querySelectorAll(".faq-item[open]").forEach((other) => {
					if (other !== item) other.removeAttribute("open");
				});
			}
		});
	});
})();
