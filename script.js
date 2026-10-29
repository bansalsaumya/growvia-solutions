document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    function closeMobileMenu() {
        if (!navLinks) return;
        navLinks.removeAttribute('style');
        navLinks.dataset.mobileOpen = 'false';
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navLinks.dataset.mobileOpen === 'true') {
                closeMobileMenu();
            } else {
                navLinks.dataset.mobileOpen = 'true';
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                navLinks.style.zIndex = '999';
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeMobileMenu();
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.dataset.mobileOpen === 'true') {
                closeMobileMenu();
            }
        });
    }

    // Featured Projects Slider Prev/Next Buttons
    const projectsSlider = document.getElementById('projects-slider') || document.querySelector('.projects-slider-wrapper');
    const projPrevBtn = document.getElementById('proj-prev-btn');
    const projNextBtn = document.getElementById('proj-next-btn');

    if (projectsSlider && projPrevBtn && projNextBtn) {
        projPrevBtn.addEventListener('click', () => {
            projectsSlider.scrollBy({ left: -520, behavior: 'smooth' });
        });
        projNextBtn.addEventListener('click', () => {
            projectsSlider.scrollBy({ left: 520, behavior: 'smooth' });
        });
    }

    // Social Media & Creative Gallery Category Filters
    const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter') || 'all';
                galleryItems.forEach(item => {
                    const cat = item.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Testimonial Slider Logic
    const sliderContainer = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (sliderContainer && prevBtn && nextBtn && cards.length > 0) {
        let currentIndex = 1; // Middle card is active initially

        function updateSlider() {
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                    // Scroll into view if needed (basic implementation)
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                    card.classList.remove('active');
                }
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });
    }

    // Typewriter effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Web Development', 'Digital Marketing', 'SEO Strategies', 'Brand Scaling'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 100 : 200;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }
        
        type();
    }

    // Free SEO Audit Form submission (Scroll to contact & prefill)
    window.submitAuditForm = function(e) {
        e.preventDefault();
        const urlInput = document.getElementById('auditUrl');
        const url = urlInput.value;
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            const msgInput = document.getElementById('clientmsg');
            if (msgInput) {
                msgInput.value = `Hi, I am interested in a Free SEO Audit for my website: ${url}. Let's connect!`;
            }
            const nameInput = document.getElementById('clientname');
            if (nameInput) {
                setTimeout(() => {
                    nameInput.focus();
                }, 800); // Wait for scroll animation to complete
            }
        }
    };

    // FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const icon = question.querySelector('.faq-icon i');
            
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
            
            // Close others
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-icon i');
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });
        });
    });

    // Scroll Animations using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll, .service-card, .project-card, .gallery-item, .stack-card, .approach-card, .why-card, .timeline-node').forEach(el => {
        el.classList.add('reveal-on-scroll'); // Ensure base class is present
        scrollObserver.observe(el);
    });

    // Local form submission function
    window.submitLocalForm = async function(e) {
        e.preventDefault();
        
        const form = document.getElementById('contactForm');
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const name = document.getElementById('clientname').value;
        const email = document.getElementById('clientemail').value;
        const message = document.getElementById('clientmsg').value;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (data.success) {
                // Show custom modal instead of alert
                document.getElementById('success-modal').classList.add('show');
                form.reset();
            } else {
                const waText = `Hi Saumya! My name is ${name} (${email}).\n\nProject Details: ${message}`;
                window.open(`https://wa.me/917435967985?text=${encodeURIComponent(waText)}`, '_blank');
                document.getElementById('success-modal').classList.add('show');
                form.reset();
            }
        } catch (error) {
            console.error('Submission error:', error);
            const waText = `Hi Saumya! My name is ${name} (${email}).\n\nProject Details: ${message}`;
            window.open(`https://wa.me/917435967985?text=${encodeURIComponent(waText)}`, '_blank');
            document.getElementById('success-modal').classList.add('show');
            form.reset();
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    };

    // Global function to close the modal
    window.closeModal = function() {
        document.getElementById('success-modal').classList.remove('show');
    };

    // Floating Chat Widget
    const chatTriggerBtn = document.getElementById('chat-trigger-btn');
    const chatWindow = document.getElementById('chat-window');
    // Removed duplicate event listener because inline onclick is used.
});

// Global functions for chat options
window.triggerChatOption = function(option) {
    let message = "";
    
    if (option === 'seo') {
        message = "Hi Saumya, I'm interested in a Free SEO Audit.";
    } else if (option === 'web') {
        message = "Hi Saumya, I want to build a new website.";
    } else {
        message = "Hi Saumya, I would like to discuss a project.";
    }

    // Redirect to WhatsApp with the pre-filled message
    window.open(`https://wa.me/917435967985?text=${encodeURIComponent(message)}`, '_blank');
    
    // Close chat window
    document.getElementById('chat-window').classList.remove('active');
};
