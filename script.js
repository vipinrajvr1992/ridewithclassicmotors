document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       CLASSIC MOTORS — MASTER SCRIPT
       ridewithclassicmotors.online
    ========================================================== */


    /* =========================================================
       MOBILE NAVIGATION
    ========================================================== */

    const header = document.querySelector("header");
    const nav = document.querySelector("nav");
    const navLinks = document.querySelector(".nav-links");

    if (header && nav && navLinks) {

        let menuButton = document.querySelector(".mobile-menu-btn");

        if (!menuButton) {
            menuButton = document.createElement("button");

            menuButton.className = "mobile-menu-btn";
            menuButton.type = "button";
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.setAttribute("aria-expanded", "false");

            menuButton.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;

            header.insertBefore(menuButton, nav);
        }

        menuButton.addEventListener("click", function () {

            const isOpen = nav.classList.toggle("mobile-open");

            menuButton.classList.toggle("active", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );
        });


        /* Close menu after clicking a navigation link */

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                nav.classList.remove("mobile-open");
                menuButton.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                document.body.classList.remove("menu-open");

            });

        });


        /* Close menu when clicking outside */

        document.addEventListener("click", function (event) {

            if (
                nav.classList.contains("mobile-open") &&
                !nav.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                nav.classList.remove("mobile-open");
                menuButton.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                document.body.classList.remove("menu-open");
            }

        });


        /* Escape key closes mobile menu */

        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                nav.classList.contains("mobile-open")
            ) {

                nav.classList.remove("mobile-open");
                menuButton.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                document.body.classList.remove("menu-open");
            }

        });

    }


    /* =========================================================
       ACTIVE NAVIGATION LINK
    ========================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {

        const href = link.getAttribute("href");

        if (!href) return;

        const linkPage = href.split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });


    /* =========================================================
       HEADER SCROLL EFFECT
    ========================================================== */

    if (header) {

        let lastScroll = 0;

        window.addEventListener(
            "scroll",
            function () {

                const scrollPosition = window.scrollY;

                if (scrollPosition > 30) {
                    header.classList.add("header-scrolled");
                } else {
                    header.classList.remove("header-scrolled");
                }

                lastScroll = scrollPosition;

            },
            { passive: true }
        );

    }


    /* =========================================================
       SMOOTH SCROLL FOR INTERNAL ANCHORS
    ========================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {

        anchor.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================================================
       REVEAL ON SCROLL
    ========================================================== */

    const revealElements = document.querySelectorAll(
        ".card, " +
        ".story-content, " +
        ".story-section, " +
        ".rally-section, " +
        ".location-box, " +
        ".final-cta, " +
        ".service-point, " +
        ".service-card, " +
        ".room-card, " +
        ".contact-card, " +
        ".privacy-block, " +
        ".privacy-disclaimer"
    );

    if ("IntersectionObserver" in window && revealElements.length) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(function (element) {

            element.classList.add("reveal-on-scroll");

            revealObserver.observe(element);

        });

    }


    /* =========================================================
       FAQ ACCORDION
    ========================================================== */

    const faqItems = document.querySelectorAll(
        ".faq-list details"
    );

    faqItems.forEach(function (item) {

        item.addEventListener("toggle", function () {

            if (!item.open) return;

            faqItems.forEach(function (otherItem) {

                if (
                    otherItem !== item &&
                    otherItem.open
                ) {
                    otherItem.removeAttribute("open");
                }

            });

        });

    });


    /* =========================================================
       ROOM IMAGE PLACEHOLDER HANDLING
    ========================================================== */

    document.querySelectorAll("img").forEach(function (image) {

        image.addEventListener("error", function () {

            if (image.dataset.fallbackApplied === "true") {
                return;
            }

            image.dataset.fallbackApplied = "true";

            image.classList.add("image-error");

        });

    });


    /* =========================================================
       SERVICE REQUEST FORM
       SERVICES PAGE
    ========================================================== */

    const serviceForm =
        document.getElementById("serviceRequestForm");

    if (serviceForm) {

        const status =
            document.getElementById("formStatus");

        serviceForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const name =
                    document.getElementById("customerName")?.value.trim() || "";

                const phone =
                    document.getElementById("customerPhone")?.value.trim() || "";

                const email =
                    document.getElementById("customerEmail")?.value.trim() || "";

                const bike =
                    document.getElementById("bikeModel")?.value.trim() || "";

                const year =
                    document.getElementById("bikeYear")?.value.trim() || "";

                const service =
                    document.getElementById("serviceType")?.value || "";

                const date =
                    document.getElementById("preferredDate")?.value || "";

                const time =
                    document.getElementById("preferredTime")?.value || "";

                const message =
                    document.getElementById("message")?.value.trim() || "";

                const consent =
                    document.getElementById("contactConsent")?.checked || false;


                if (
                    !name ||
                    !phone ||
                    !bike ||
                    !service ||
                    !consent
                ) {

                    showFormStatus(
                        status,
                        "error",
                        "Please complete all required fields before sending your request."
                    );

                    return;
                }


                const cleanPhone =
                    phone.replace(/\D/g, "");


                if (cleanPhone.length < 10) {

                    showFormStatus(
                        status,
                        "error",
                        "Please enter a valid phone or WhatsApp number."
                    );

                    return;
                }


                let whatsappMessage =
`Hello Classic Motors,

I would like to make a service enquiry.

RIDER DETAILS
Name: ${name}
Phone / WhatsApp: ${phone}`;


                if (email) {
                    whatsappMessage +=
                        `\nEmail: ${email}`;
                }


                whatsappMessage +=
`
MOTORCYCLE DETAILS
Model: ${bike}`;


                if (year) {
                    whatsappMessage +=
                        `\nYear: ${year}`;
                }


                whatsappMessage +=
`
Service Required: ${service}`;


                if (date) {
                    whatsappMessage +=
                        `\nPreferred Date: ${date}`;
                }


                if (time) {
                    whatsappMessage +=
                        `\nPreferred Time: ${time}`;
                }


                if (message) {

                    whatsappMessage +=
`
Additional Details:
${message}`;

                }


                whatsappMessage +=
`

Sent from Classic Motors website
https://ridewithclassicmotors.online/`;


                openWhatsApp(
                    "919447433965",
                    whatsappMessage,
                    status,
                    "Your service request is ready. Opening WhatsApp..."
                );

            }
        );

    }


    /* =========================================================
       CONTACT FORM
       CONTACT PAGE
    ========================================================== */

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        const status =
            document.getElementById("contactFormStatus") ||
            document.getElementById("formStatus");


        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById("contactName")?.value.trim() || "";

                const phone =
                    document.getElementById("contactPhone")?.value.trim() || "";

                const bike =
                    document.getElementById("contactBike")?.value.trim() || "";

                const year =
                    document.getElementById("contactBikeYear")?.value.trim() || "";

                const enquiry =
                    document.getElementById("contactEnquiry")?.value || "";

                const date =
                    document.getElementById("contactDate")?.value || "";

                const time =
                    document.getElementById("contactTime")?.value || "";

                const message =
                    document.getElementById("contactMessage")?.value.trim() || "";

                const consent =
                    document.getElementById("contactConsent")?.checked || false;


                if (
                    !name ||
                    !phone ||
                    !enquiry ||
                    !consent
                ) {

                    showFormStatus(
                        status,
                        "error",
                        "Please complete all required fields before sending your enquiry."
                    );

                    return;
                }


                const cleanPhone =
                    phone.replace(/\D/g, "");


                if (cleanPhone.length < 10) {

                    showFormStatus(
                        status,
                        "error",
                        "Please enter a valid phone or WhatsApp number."
                    );

                    return;
                }


                let whatsappMessage =
`Hello Classic Motors,

I have an enquiry.

CUSTOMER DETAILS
Name: ${name}
Phone / WhatsApp: ${phone}

ENQUIRY
Type: ${enquiry}`;


                if (bike) {
                    whatsappMessage +=
                        `\nMotorcycle: ${bike}`;
                }


                if (year) {
                    whatsappMessage +=
                        `\nYear: ${year}`;
                }


                if (date) {
                    whatsappMessage +=
                        `\nPreferred Date: ${date}`;
                }


                if (time) {
                    whatsappMessage +=
                        `\nPreferred Time: ${time}`;
                }


                if (message) {

                    whatsappMessage +=
`
Additional Details:
${message}`;

                }


                whatsappMessage +=
`

Sent from Classic Motors website
https://ridewithclassicmotors.online/`;


                openWhatsApp(
                    "919447433965",
                    whatsappMessage,
                    status,
                    "Your enquiry is ready. Opening WhatsApp..."
                );

            }
        );

    }


    /* =========================================================
       RIDER'S DEN DIRECT BOOKING
    ========================================================== */

    document
        .querySelectorAll("[data-riders-den-booking]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const room =
                        button.dataset.room || "";

                    let message =
`Hello Rider's Den,

I would like to enquire about a stay.`;

                    if (room) {
                        message +=
                            `\n\nRoom / Category: ${room}`;
                    }

                    message +=
`
\nPlease share the current availability and booking details.

Sent from Classic Motors website
https://ridewithclassicmotors.online/`;


                    const url =
                        "https://wa.me/919449150965?text=" +
                        encodeURIComponent(message);

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );

        });


    /* =========================================================
       PHONE NUMBER PROTECTION / NORMALIZATION
    ========================================================== */

    document.querySelectorAll(
        'input[type="tel"]'
    ).forEach(function (input) {

        input.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(/[^\d+\-\s()]/g, "");

            }
        );

    });


    /* =========================================================
       CURRENT YEAR
    ========================================================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });


    /* =========================================================
       EXTERNAL LINKS
    ========================================================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(function (link) {

        const rel =
            link.getAttribute("rel") || "";

        if (!rel.includes("noopener")) {

            link.setAttribute(
                "rel",
                (rel + " noopener noreferrer").trim()
            );

        }

    });


    /* =========================================================
       HELPERS
    ========================================================== */

    function showFormStatus(
        element,
        type,
        message
    ) {

        if (!element) return;

        element.className =
            "form-status " + type;

        element.textContent =
            message;

    }


    function openWhatsApp(
        number,
        message,
        statusElement,
        successMessage
    ) {

        const encodedMessage =
            encodeURIComponent(message);

        const whatsappURL =
            `https://wa.me/${number}?text=${encodedMessage}`;


        if (statusElement) {

            showFormStatus(
                statusElement,
                "success",
                successMessage
            );

        }


        setTimeout(
            function () {

                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            },
            500
        );

    }


    /* =========================================================
       REDUCED MOTION SUPPORT
    ========================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        document.documentElement.classList.add(
            "reduce-motion"
        );

    }


    /* =========================================================
       PAGE READY
    ========================================================== */

    document.body.classList.add("page-ready");

});
