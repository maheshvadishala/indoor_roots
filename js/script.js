/* ==========================================================================
   INDOOR ROOTS - THE GARDEN SHOP
   Main JavaScript File
   ========================================================================== */

const WA_NUMBER = "917660087770";

/* ============ 1. PAGE LOADER ============ */
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }, 1200);
    }
});
document.body.style.overflow = 'hidden';

/* ============ 2. STICKY HEADER ============ */
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ============ 3. MOBILE MENU ============ */
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* ============ 4. ACTIVE NAV LINK ============ */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

/* ============ 5. SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

/* ============ 6. BACK TO TOP ============ */
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============ 7. TESTIMONIALS SLIDER ============ */
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    if (!slides.length) return;

    let current = 0;
    let autoSlideInterval;

    function goTo(index) {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
    }

    function startAuto() {
        autoSlideInterval = setInterval(() => goTo(current + 1), 5000);
    }

    function resetAuto() {
        clearInterval(autoSlideInterval);
        startAuto();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    });

    goTo(0);
    startAuto();
}
initTestimonialsSlider();

/* ============ 8. WHATSAPP FUNCTIONS ============ */
function buyNowWhatsApp(productName, productPrice) {
    const text = `Hello Indoor Roots,\nI would like to order:\n\nProduct Name: ${productName}\nPrice: ₹${productPrice}\n\nPlease provide payment and delivery details.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

function openWhatsAppChat() {
    const text = `Hello Indoor Roots! I'm interested in your plants and miniature toys. Can you help me?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

// Attach to all buy-now buttons
document.querySelectorAll('.product-buy-btn[data-product]').forEach(btn => {
    btn.addEventListener('click', () => {
        buyNowWhatsApp(btn.dataset.product, btn.dataset.price);
    });
});

// Floating WhatsApp button
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat) waFloat.addEventListener('click', openWhatsAppChat);

/* ============ 9. QUICK VIEW MODAL ============ */
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');

function openQuickView(data) {
    if (!modalOverlay) return;
    document.querySelector('.modal-img').src = data.img;
    document.querySelector('.modal-category').textContent = data.category;
    document.querySelector('.modal-title').textContent = data.name;
    document.querySelector('.modal-price').textContent = `₹${data.price}`;
    document.querySelector('.modal-desc').textContent = data.desc;
    const modalBuyBtn = document.querySelector('.modal-buy-btn');
    modalBuyBtn.onclick = () => buyNowWhatsApp(data.name, data.price);
    const specsEl = document.querySelector('.modal-specs');
    if (specsEl && data.specs) {
        specsEl.innerHTML = data.specs.map(s => `<div class="spec-item"><i class="${s.icon}"></i><span>${s.label}: <strong>${s.value}</strong></span></div>`).join('');
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.btn-quickview').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        const data = {
            img: card.querySelector('.product-img').src,
            category: card.querySelector('.product-category').textContent,
            name: card.querySelector('.product-name').textContent,
            price: card.querySelector('.product-buy-btn').dataset.price,
            desc: card.dataset.desc || 'A premium quality product from Indoor Roots, carefully curated for your home.',
            specs: JSON.parse(card.dataset.specs || '[]')
        };
        openQuickView(data);
    });
});

/* ============ 10. FILTER TABS ============ */
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.product-card[data-category]');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.parentElement.style.display = '';
                    card.parentElement.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.parentElement.style.display = 'none';
                }
            });
        });
    });
}
initFilterTabs();

/* ============ 11. FAQ ACCORDION ============ */
document.querySelectorAll('.faq-item').forEach(item => {
    const faqHeader = item.querySelector('.faq-header');
    if (faqHeader) {
        faqHeader.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    }
});

/* ============ 12. ANIMATED COUNTERS ============ */
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
        }
    }, 16);
}

const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
            countersObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num[data-target]').forEach(el => {
    countersObserver.observe(el);
});

/* ============ 13. CONTACT FORM -> WHATSAPP ============ */
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('#contact-name').value.trim();
        const phone = document.querySelector('#contact-phone').value.trim();
        const email = document.querySelector('#contact-email').value.trim();
        const message = document.querySelector('#contact-message').value.trim();
        if (!name || !phone || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        const text = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    });
}

/* ============ 14. SMOOTH SCROLL FOR ANCHOR LINKS ============ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ============ CSS fadeIn animation for filter ============ */
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(styleEl);
