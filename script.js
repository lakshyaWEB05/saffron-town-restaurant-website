// script.js

document.addEventListener('DOMContentLoaded', () => {
    // -------------------- Loading Screen --------------------
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        // Give a slight delay for aesthetic purposes
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scroll
        }, 800);
    });
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // -------------------- Navbar & Mobile Menu --------------------
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#navbar .nav-links a, #mobile-menu a');

    // Sticky Navbar & Scroll Animations
    const headerHeight = navbar.offsetHeight;
    const revealElements = document.querySelectorAll('.reveal');

    function checkScroll() {
        // Sticky Navbar
        if (window.scrollY > headerHeight) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Section Reveal Animations
revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
        el.classList.add('active');
    } else {
        el.classList.remove('active');
    }
});

        // Active Nav Link on Scroll
        const sections = document.querySelectorAll('section');
        let currentActive = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 1; // Adjust for navbar height
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check on load

    // Smooth Scroll for Nav Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }

                // Calculate offset for fixed navbar
                const offsetTop = targetSection.offsetTop - navbar.offsetHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
    });

    // -------------------- Dark/Light Mode Toggle --------------------
    const modeToggle = document.getElementById('mode-toggle');
    const mobileModeToggle = document.getElementById('mobile-mode-toggle');

    function setMode(isDarkMode) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode);
        const icon = modeToggle.querySelector('i');
        const mobileIcon = mobileModeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            mobileIcon.classList.remove('fa-moon');
            mobileIcon.classList.add('fa-sun');
            mobileModeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Mode';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            mobileIcon.classList.remove('fa-sun');
            mobileIcon.classList.add('fa-moon');
            mobileModeToggle.innerHTML = '<i class="fas fa-moon"></i> Toggle Mode';
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Initialize theme based on local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setMode(savedTheme === 'dark');
    } else {
        setMode(prefersDark);
    }

    modeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        setMode(!isDarkMode);
    });

    mobileModeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        setMode(!isDarkMode);
    });


    // -------------------- Filterable Menu --------------------
    const filterButtons = document.querySelectorAll('.filter-button');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            menuItems.forEach(item => {
                const itemCategory = item.dataset.category;
                if (filter === 'all' || filter === itemCategory) {
                    item.style.display = 'flex'; // Use flex for the item's display
                    // Re-add reveal active class for smooth transition if already scrolled
                    if (item.getBoundingClientRect().top < window.innerHeight * 0.8 && item.getBoundingClientRect().bottom > 0) {
                        item.classList.add('active');
                    }
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active'); // Remove active for hidden items
                }
            });
        });
    });

    // -------------------- Click-to-enlarge Gallery --------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryOverlay = document.getElementById('gallery-overlay');
    const fullImage = document.getElementById('full-image');
    const closeOverlay = document.getElementById('close-overlay');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            fullImage.src = item.dataset.src || item.src; // Use data-src for large image if available
            galleryOverlay.classList.add('active');
            document.body.classList.add('no-scroll'); // Prevent scroll when overlay is open
        });
    });

    closeOverlay.addEventListener('click', () => {
        galleryOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    galleryOverlay.addEventListener('click', (e) => {
        // Close if click outside the image
        if (e.target === galleryOverlay) {
            galleryOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });


    // -------------------- Online Reservation Form --------------------
    const reservationForm = document.getElementById('reservation-form');
    const bookingMessage = document.getElementById('booking-message');

    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent actual form submission

        // Basic form validation (can be expanded)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;

        if (!name || !email || !date || !time || !guests) {
            displayBookingMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate API call or form submission
        setTimeout(() => {
            // In a real application, you'd send this data to a server
            console.log('Reservation Details:', {
                name, email,
                phone: document.getElementById('phone').value,
                date, time, guests,
                message: document.getElementById('message').value
            });

            displayBookingMessage('Thank you for your reservation! We look forward to seeing you.', 'success');
            reservationForm.reset(); // Clear the form
        }, 1000);
    });

    function displayBookingMessage(message, type) {
        bookingMessage.textContent = message;
        bookingMessage.className = 'booking-message show'; // Reset classes
        if (type === 'success') {
            bookingMessage.style.backgroundColor = 'rgba(144, 238, 144, 0.2)'; // Light green
            bookingMessage.style.borderColor = 'lightgreen';
            bookingMessage.style.color = 'lightgreen';
        } else if (type === 'error') {
            bookingMessage.style.backgroundColor = 'rgba(255, 99, 71, 0.2)'; // Tomato red
            bookingMessage.style.borderColor = 'tomato';
            bookingMessage.style.color = 'tomato';
        } else {
            // Default styling
            bookingMessage.style.backgroundColor = 'rgba(255, 140, 0, 0.1)';
            bookingMessage.style.borderColor = 'var(--primary-color)';
            bookingMessage.style.color = 'var(--text-color-light)';
        }


        setTimeout(() => {
            bookingMessage.classList.remove('show');
        }, 5000);
    }
});
/* ==========================================
   PROJECT ENQUIRY → WHATSAPP
========================================== */

const enquiryForm = document.getElementById("project-enquiry-form");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName = document.getElementById("clientName").value;
        const businessName = document.getElementById("businessName").value;
        const businessType = document.getElementById("businessType").value;
        const phone = document.getElementById("phoneNumber").value;
        const email = document.getElementById("emailAddress").value;
        const budget = document.getElementById("budget").value;
        const details = document.getElementById("projectDetails").value;

        const message =
`Hi Lakshya,

I came across your Premium Restaurant Website portfolio and I'm interested in getting a website for my business.

━━━━━━━━━━━━━━

👤 Full Name: ${fullName}

🏢 Business Name: ${businessName}

🍽 Business Type: ${businessType}

📞 Phone Number: ${phone}

📧 Email: ${email}

💰 Estimated Budget: ${budget}

📝 Project Details:
${details}

━━━━━━━━━━━━━━

Looking forward to hearing from you.`;

        const whatsappURL =
`https://wa.me/918077420632?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

    });

}