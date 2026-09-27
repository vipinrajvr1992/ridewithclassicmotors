document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================================
       CLASSIC MOTORS — MASTER SCRIPT
       ridewithclassicmotors.online
       Production UI / UX / Interaction Controller
    ========================================================== */

    const body = document.body;
    const header = document.querySelector("header");
    const nav = document.querySelector("nav");
    const navLinks = document.querySelector(".nav-links");

    /* =========================================================
       UTILITIES
    ========================================================== */

    const qs = (selector, parent = document) => parent.querySelector(selector);
    const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const setMenuState = (isOpen) => {
        if (!nav || !menuButton) return;

        nav.classList.toggle("mobile-open", isOpen);
        menuButton.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        if (body) {
            body.classList.toggle("menu-open", isOpen);
        }
    };

    const getValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    };

    const getChecked = (id) => {
        const element = document.getElementById(id);
        return Boolean(element && element.checked);
    };

    function showFormStatus(element, type, message) {
        if (!element) return;

        element.className = "form-status " + type;
        element.textContent = message;
        element.setAttribute("role", type === "error" ? "alert" : "status");
        element.setAttribute("aria-live", "polite");
    }

    function normalizePhone(phone) {
        return String(phone || "").replace(/\D/g, "");
    }

    function openWhatsApp(number, message, statusElement, successMessage) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${number}?text=${encodedMessage}`;

        if (statusElement) {
            showFormStatus(
                statusElement,
                "success",
                successMessage || "Opening WhatsApp..."
            );
        }

        window.setTimeout(() => {
            window.open(whatsappURL, "_blank", "noopener,noreferrer");
        }, 350);
    }

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================== */

    let menuButton = null;

    if (header && nav && navLinks) {
        menuButton = qs(".mobile-menu-btn", header);

        if (!menuButton) {
            menuButton = document.createElement("button");
            menuButton.className = "mobile-menu-btn";
            menuButton.type = "button";
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-controls", "site-navigation");
            menuButton.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;

            nav.id = nav.id || "site-navigation";
            header.insertBefore(menuButton, nav);
        }

        menuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = !nav.classList.contains("mobile-open");
            setMenuState(isOpen);
        });

        qsa("a", navLinks).forEach((link) => {
            link.addEventListener("click", () => setMenuState(false));
        });

        document.addEventListener("click", (event) => {
            if (
                nav.classList.contains("mobile-open") &&
                !nav.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && nav.classList.contains("mobile-open")) {
                setMenuState(false);
                menuButton.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900 && nav.classList.contains("mobile-open")) {
                setMenuState(false);
            }
        }, { passive: true });
    }

    /* =========================================================
       ACTIVE NAVIGATION
       Supports root-relative and nested folder URLs.
    ========================================================== */

    const normalizePath = (path) => {
        const clean = String(path || "").split("?")[0].split("#")[0];
        if (clean === "/" || clean === "") return "/";
        return clean.replace(/index\.html$/, "").replace(/\/+$/, "") + "/";
    };

    const currentPath = normalizePath(window.location.pathname);

    qsa(".nav-links a").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

        try {
            const linkURL = new URL(href, window.location.href);
            const linkPath = normalizePath(linkURL.pathname);

            if (linkPath === currentPath) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        } catch (_) {
            /* Ignore malformed/non-navigation URLs. */
        }
    });

    /* =========================================================
       HEADER SCROLL EFFECT
    ========================================================== */

    if (header) {
        const updateHeader = () => {
            header.classList.toggle("header-scrolled", window.scrollY > 30);
        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });
    }

    /* =========================================================
       SMOOTH INTERNAL ANCHORS
       Avoids interfering with cross-page links.
    ========================================================== */

    qsa('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#" || targetId.length < 2) return;

            const target = qs(targetId);
            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: document.documentElement.classList.contains("reduce-motion")
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            if (history.replaceState) {
                history.replaceState(null, "", targetId);
            }
        });
    });

    /* =========================================================
       REVEAL-ON-SCROLL
       Lightweight, accessible, one-time reveal.
    ========================================================== */

    const revealSelector = [
        ".card",
        ".story-content",
        ".story-section",
        ".rally-section",
        ".location-box",
        ".final-cta",
        ".service-point",
        ".service-card",
        ".room-card",
        ".contact-card",
        ".privacy-block",
        ".privacy-disclaimer",
        ".section-heading",
        ".editorial-grid",
        ".contact-channel"
    ].join(", ");

    const revealElements = qsa(revealSelector);

    if (
        "IntersectionObserver" in window &&
        revealElements.length &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element, index) => {
            element.classList.add("reveal-on-scroll");

            // Small stagger for grouped cards without making long pages slow.
            if (element.classList.contains("card") ||
                element.classList.contains("service-card") ||
                element.classList.contains("room-card") ||
                element.classList.contains("contact-card")) {
                element.style.setProperty(
                    "--reveal-delay",
                    `${Math.min(index % 4, 3) * 55}ms`
                );
            }

            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => element.classList.add("revealed"));
    }

    /* =========================================================
       FAQ ACCORDION
       Native <details> remains usable without JavaScript.
    ========================================================== */

    const faqItems = qsa(".faq-list details");

    faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;

            faqItems.forEach((otherItem) => {
                if (otherItem !== item && otherItem.open) {
                    otherItem.removeAttribute("open");
                }
            });
        });
    });

    /* =========================================================
       IMAGE FALLBACK / LAZY-LOAD SUPPORT
    ========================================================== */

    qsa("img").forEach((image) => {
        if (!image.hasAttribute("decoding")) {
            image.setAttribute("decoding", "async");
        }

        image.addEventListener("error", () => {
            if (image.dataset.fallbackApplied === "true") return;

            image.dataset.fallbackApplied = "true";
            image.classList.add("image-error");
            image.setAttribute("aria-label", "Image unavailable");
        });
    });

    /* =========================================================
       SERVICE REQUEST FORM
       SERVICES PAGE
    ========================================================== */

    const serviceForm = document.getElementById("serviceRequestForm");

    if (serviceForm) {
        const status =
            document.getElementById("formStatus") ||
            serviceForm.querySelector(".form-status");

        serviceForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = getValue("customerName");
            const phone = getValue("customerPhone");
            const email = getValue("customerEmail");
            const bike = getValue("bikeModel");
            const year = getValue("bikeYear");
            const service = qs("#serviceType")?.value || "";
            const date = qs("#preferredDate")?.value || "";
            const time = qs("#preferredTime")?.value || "";
            const message = getValue("message");
            const consent = getChecked("contactConsent");

            if (!name || !phone || !bike || !service || !consent) {
                showFormStatus(
                    status,
                    "error",
                    "Please complete all required fields before sending your request."
                );
                return;
            }

            const cleanPhone = normalizePhone(phone);

            if (cleanPhone.length < 10) {
                showFormStatus(
                    status,
                    "error",
                    "Please enter a valid phone or WhatsApp number."
                );
                return;
            }

            let whatsappMessage = `Hello Classic Motors,

I would like to make a service enquiry.

RIDER DETAILS
Name: ${name}
Phone / WhatsApp: ${phone}`;

            if (email) {
                whatsappMessage += `\nEmail: ${email}`;
            }

            whatsappMessage += `

MOTORCYCLE DETAILS
Model: ${bike}`;

            if (year) {
                whatsappMessage += `\nYear: ${year}`;
            }

            whatsappMessage += `\nService Required: ${service}`;

            if (date) {
                whatsappMessage += `\nPreferred Date: ${date}`;
            }

            if (time) {
                whatsappMessage += `\nPreferred Time: ${time}`;
            }

            if (message) {
                whatsappMessage += `

Additional Details:
${message}`;
            }

            whatsappMessage += `

Sent from Classic Motors website
https://ridewithclassicmotors.online/`;

            openWhatsApp(
                "919447433965",
                whatsappMessage,
                status,
                "Your service request is ready. Opening WhatsApp..."
            );
        });
    }

    /* =========================================================
       CONTACT FORM
       CONTACT PAGE
       Supports both the current IDs and legacy field IDs.
    ========================================================== */

    const contactForm =
        document.getElementById("contactForm") ||
        document.getElementById("contactServiceForm");

    if (contactForm) {
        const status =
            document.getElementById("contactFormStatus") ||
            document.getElementById("formStatus");

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = getValue("contactName");
            const phone = getValue("contactPhone");
            const bike =
                getValue("contactBike") ||
                getValue("contactBikeModel");
            const year =
                getValue("contactBikeYear") ||
                getValue("contactYear");
            const enquiry =
                qs("#contactEnquiry")?.value ||
                qs("#contactService")?.value ||
                "";
            const date = getValue("contactDate");
            const time = getValue("contactTime");
            const message = getValue("contactMessage");
            const consent = getChecked("contactConsent");

            if (!name || !phone || !enquiry || !consent) {
                showFormStatus(
                    status,
                    "error",
                    "Please complete all required fields before sending your enquiry."
                );
                return;
            }

            const cleanPhone = normalizePhone(phone);

            if (cleanPhone.length < 10) {
                showFormStatus(
                    status,
                    "error",
                    "Please enter a valid phone or WhatsApp number."
                );
                return;
            }

            let whatsappMessage = `Hello Classic Motors,

I have an enquiry.

CUSTOMER DETAILS
Name: ${name}
Phone / WhatsApp: ${phone}

ENQUIRY
Type: ${enquiry}`;

            if (bike) {
                whatsappMessage += `\nMotorcycle: ${bike}`;
            }

            if (year) {
                whatsappMessage += `\nYear: ${year}`;
            }

            if (date) {
                whatsappMessage += `\nPreferred Date: ${date}`;
            }

            if (time) {
                whatsappMessage += `\nPreferred Time: ${time}`;
            }

            if (message) {
                whatsappMessage += `

Additional Details:
${message}`;
            }

            whatsappMessage += `

Sent from Classic Motors website
https://ridewithclassicmotors.online/`;

            openWhatsApp(
                "919447433965",
                whatsappMessage,
                status,
                "Your enquiry is ready. Opening WhatsApp..."
            );
        });
    }

    /* =========================================================
       RIDER'S DEN DIRECT BOOKING
    ========================================================== */

    qsa("[data-riders-den-booking]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const room = button.dataset.room || "";

            let message = `Hello Rider's Den,

I would like to enquire about a stay.`;

            if (room) {
                message += `\n\nRoom / Category: ${room}`;
            }

            message += `

Please share the current availability and booking details.

Sent from Classic Motors website
https://ridewithclassicmotors.online/`;

            const url =
                "https://wa.me/919449150965?text=" +
                encodeURIComponent(message);

            window.open(url, "_blank", "noopener,noreferrer");
        });
    });

    /* =========================================================
       PHONE INPUT SANITIZATION
    ========================================================== */

    qsa('input[type="tel"]').forEach((input) => {
        input.setAttribute("inputmode", "tel");
        input.setAttribute("autocomplete", "tel");

        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^\d+\-\s()]/g, "");
        });
    });

    /* =========================================================
       CURRENT YEAR
    ========================================================== */

    qsa("[data-current-year]").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    /* =========================================================
       EXTERNAL LINK SECURITY
    ========================================================== */

    qsa('a[target="_blank"]').forEach((link) => {
        const rel = link.getAttribute("rel") || "";

        if (!rel.includes("noopener")) {
            link.setAttribute(
                "rel",
                `${rel} noopener noreferrer`.trim()
            );
        }
    });

    /* =========================================================
       FOCUS / ACCESSIBILITY POLISH
    ========================================================== */

    qsa("a, button, input, select, textarea, summary").forEach((element) => {
        element.addEventListener("keydown", (event) => {
            if (event.key === " " && element.tagName === "SUMMARY") {
                event.stopPropagation();
            }
        });
    });

    /* =========================================================
       REDUCED MOTION
    ========================================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        document.documentElement.classList.add("reduce-motion");
    }

    /* =========================================================
       PAGE READY
    ========================================================== */

    requestAnimationFrame(() => {
        body.classList.add("page-ready");
    });
});
