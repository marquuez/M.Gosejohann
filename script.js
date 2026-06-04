// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navBackdrop = document.getElementById('navBackdrop');
const navLinks = document.querySelectorAll('.nav-link');

function closeMobileMenu() {
    if (!navMenu || !mobileMenuToggle) return;
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    navBackdrop?.classList.remove('is-visible');
    document.body.classList.remove('menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    navBackdrop?.setAttribute('aria-hidden', 'true');
}

function openMobileMenu() {
    if (!navMenu || !mobileMenuToggle) return;
    navMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    navBackdrop?.classList.add('is-visible');
    document.body.classList.add('menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    navBackdrop?.setAttribute('aria-hidden', 'false');
}

function toggleMobileMenu() {
    if (!navMenu || !mobileMenuToggle) return;

    if (navMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        closeMobileMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Navbar: ab Abschnitt „Leistungen“ Website-Blau
const navbar = document.getElementById('navbar');

function updateNavbarTheme() {
    if (!navbar) return;

    const services = document.getElementById('services');
    if (!services) return;

    const navHeight =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
    const servicesStart = services.offsetTop - navHeight;
    const showBlueNav = window.scrollY >= servicesStart;

    navbar.classList.toggle('navbar--past-hero', showBlueNav);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        // For now, we'll just show a success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Wird gesendet...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitButton.textContent = 'Nachricht gesendet! ✓';
            submitButton.style.background = '#4caf50';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }, 1500);
    });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktopViewport = () => window.innerWidth > 992 && !prefersReducedMotion;

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

/* Service card hover: styled in CSS only */

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Smooth reveal animation for timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    timelineObserver.observe(item);
});

// Add click effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--accent-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Story – Punkt an Viewport-Mitte, aktiver Schritt = Karte in der Mitte
const storySection = document.getElementById('story');
const storyTimeline = document.querySelector('.story-timeline');
const storyLine = document.querySelector('.story-line');
const storyLineDot = document.querySelector('.story-line-dot');
const storySteps = document.querySelectorAll('.story-step');

function updateStoryTimeline() {
    if (!storyTimeline || !storySteps.length) return;

    const viewportCenter = window.innerHeight * 0.5;
    const timelineRect = storyTimeline.getBoundingClientRect();

    if (storyLineDot && storyLine) {
        const lineRect = storyLine.getBoundingClientRect();
        const lineHeight = lineRect.height;
        const dotY = clampScroll(viewportCenter - lineRect.top, 0, lineHeight);
        const inStory =
            viewportCenter >= timelineRect.top && viewportCenter <= timelineRect.bottom;

        storyLineDot.style.setProperty('--story-dot-y', `${dotY}px`);
        storyLine.classList.toggle('is-in-view', inStory);
    }

    let activeStep = null;
    let minDist = Infinity;

    storySteps.forEach((step) => {
        const content = step.querySelector('.story-content');
        if (!content) return;
        const rect = content.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            activeStep = step;
        }
    });

    if (!activeStep) {
        storySteps.forEach((step) => {
            const content = step.querySelector('.story-content');
            const target = content || step;
            const rect = target.getBoundingClientRect();
            const centerY = rect.top + rect.height * 0.5;
            const dist = Math.abs(centerY - viewportCenter);

            if (dist < minDist) {
                minDist = dist;
                activeStep = step;
            }
        });
    }

    storySteps.forEach((step) => {
        step.classList.toggle('active', step === activeStep);
    });

    if (storySection) {
        storySection.classList.toggle(
            'story--timeline-active',
            viewportCenter >= timelineRect.top && viewportCenter <= timelineRect.bottom
        );
    }
}

// —— Hero-Bühne & Scroll-Float (gesamte Website) ——
function clampScroll(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

const heroSection = document.getElementById('home');
const heroStage = document.getElementById('heroStage');
const heroSplash = document.getElementById('heroSplash');
const heroContent = heroStage?.querySelector('.hero-content');
const heroBackground = heroStage?.querySelector('.hero-background');
let scrollEffectsTicking = false;

function getHeroConfig() {
    const w = window.innerWidth;

    if (w <= 480) {
        return {
            openScroll: 260,
            scaleBoost: 0.04,
            translateIn: 20,
            translateOut: 22,
            splashY: -18,
            splashBlur: 8,
        };
    }

    if (w <= 768) {
        return {
            openScroll: 300,
            scaleBoost: 0.05,
            translateIn: 24,
            translateOut: 28,
            splashY: -22,
            splashBlur: 10,
        };
    }

    if (w <= 992) {
        return {
            openScroll: 360,
            scaleBoost: 0.06,
            translateIn: 28,
            translateOut: 32,
            splashY: -24,
            splashBlur: 12,
        };
    }

    return {
        openScroll: 420,
        scaleBoost: 0.08,
        translateIn: 52,
        translateOut: 48,
        splashY: -28,
        splashBlur: 14,
    };
}

function smoothStep(t) {
    const x = clampScroll(t, 0, 1);
    return x * x * (3 - 2 * x);
}

function rangeProgress(value, start, end) {
    return smoothStep((value - start) / (end - start));
}

function updateHeroStage() {
    if (!heroSection || !heroStage) return;

    const scrollY = window.scrollY;

    if (prefersReducedMotion) {
        if (heroSplash) {
            heroSplash.style.setProperty('--splash-opacity', '0');
            heroSplash.classList.add('is-dissolved');
        }
        if (heroContent) heroContent.style.setProperty('--hero-content-opacity', '1');
        heroStage.style.setProperty('--hero-scale', '1');
        heroStage.style.setProperty('--hero-y', '0');
        heroSection.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
            el.classList.add('is-revealed', 'is-settled');
        });
        return;
    }

    const heroCfg = getHeroConfig();
    const vh = window.innerHeight;
    const track = Math.max(heroSection.offsetHeight - vh, 1);
    const openP = clampScroll(scrollY / heroCfg.openScroll, 0, 1);
    const trackP = clampScroll(scrollY / track, 0, 1);

    /* Eine Kurve: Splash löst sich, Bühne wächst, Text kommt – überlappend */
    const splashOut = rangeProgress(openP, 0, 0.42);
    const stageOpen = rangeProgress(openP, 0.06, 0.58);
    const contentOpen = rangeProgress(openP, 0.36, 0.78);
    const exitP = rangeProgress(trackP, 0.52, 0.92);

    if (heroSplash) {
        const splashStay = 1 - splashOut;
        heroSplash.style.setProperty('--splash-opacity', String(splashStay));
        heroSplash.style.setProperty('--splash-scale', String(1 - splashOut * 0.06));
        heroSplash.style.setProperty('--splash-y', `${splashOut * heroCfg.splashY}px`);
        heroSplash.style.setProperty('--splash-blur', `${splashOut * heroCfg.splashBlur}px`);
        heroSplash.classList.toggle('is-dissolved', splashOut >= 0.99);
    }

    const scale = 1 + stageOpen * heroCfg.scaleBoost - exitP * (heroCfg.scaleBoost * 0.75);
    const translateY = (1 - stageOpen) * heroCfg.translateIn - exitP * heroCfg.translateOut;
    const bgY = (1 - stageOpen) * (heroCfg.translateIn * 0.54) + exitP * (heroCfg.translateOut * 0.5);
    const bgScale = 1.08 - stageOpen * 0.04 + exitP * 0.03;
    const useStageTransform = window.innerWidth > 992;

    if (useStageTransform) {
        heroStage.style.setProperty('--hero-scale', String(scale));
        heroStage.style.setProperty('--hero-y', `${translateY}px`);
    } else {
        heroStage.style.setProperty('--hero-scale', '1');
        heroStage.style.setProperty('--hero-y', '0');
        heroStage.style.removeProperty('transform');
    }

    heroStage.style.setProperty('--hint-opacity', String(clampScroll(1 - openP * 1.15, 0, 1)));

    if (heroBackground) {
        heroBackground.style.setProperty('--hero-bg-y', `${bgY}px`);
        heroBackground.style.setProperty('--hero-bg-scale', String(bgScale));
    }

    if (heroContent) {
        heroContent.style.setProperty('--hero-content-opacity', String(contentOpen));
    }

    const isCompactHero = window.innerWidth <= 992;
    const revealBase = isCompactHero ? 18 : 44;
    const revealStep = isCompactHero ? 6 : 12;

    heroSection.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
        const order = parseInt(el.dataset.revealOrder, 10) || 0;
        const itemStart = 0.38 + order * 0.09;
        const itemP = rangeProgress(openP, itemStart, itemStart + 0.28);

        if (itemP > 0.01) {
            el.classList.add('is-revealed');
            const floatY = (1 - itemP) * (revealBase + order * revealStep);
            el.style.setProperty('--reveal-y', `${floatY}px`);
            el.style.setProperty('--reveal-opacity', String(0.1 + itemP * 0.9));
            el.classList.toggle('is-settled', itemP >= 0.98);
        } else {
            el.classList.remove('is-revealed', 'is-settled');
            el.style.removeProperty('--reveal-y');
            el.style.removeProperty('--reveal-opacity');
        }
    });
}

const SCROLL_ANIM_SELECTORS = [
    { selector: '.section-header', aos: 'fade-up' },
    { selector: '.story-intro', aos: 'fade-up' },
    { selector: '.story-step', aos: 'fade-up' },
    { selector: '.footer-section', aos: 'fade-up' },
    { selector: '.footer-bottom', aos: 'fade-up' }
];

const scrollRevealDelays = new WeakMap();

function getScrollAnimType(el) {
    const scroll = el.getAttribute('data-scroll') || '';
    if (scroll.includes('left')) return 'fade-left';
    if (scroll.includes('right')) return 'fade-right';
    return el.getAttribute('data-aos') || 'fade-up';
}

function markScrollVisible(el) {
    if (scrollRevealDelays.has(el)) return;

    const delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
    scrollRevealDelays.set(el, true);

    const apply = () => {
        el.classList.add('scroll-visible', 'aos-animate');
        if (el.hasAttribute('data-scroll')) {
            el.classList.add('visible');
        }
        const d = el.getAttribute('data-delay');
        if (d) {
            el.style.transitionDelay = `${d}ms`;
        }
    };

    if (delay > 0) {
        setTimeout(apply, delay);
    } else {
        apply();
    }
}

function applyScrollTransform(el, animType, floatX, floatY, settled) {
    if (settled) {
        el.style.transform = 'translate(0, 0)';
        return;
    }

    if (animType === 'fade-left') {
        el.style.transform = `translate(${-22 + floatX}px, ${floatY * 0.3}px)`;
    } else if (animType === 'fade-right') {
        el.style.transform = `translate(${22 + floatX}px, ${floatY * 0.3}px)`;
    } else {
        el.style.transform = `translateY(${26 + floatY}px)`;
    }
}

const STATIC_SCROLL_SECTIONS = ['#features', '#about', '#contact'];

function initStaticSectionContent() {
    STATIC_SCROLL_SECTIONS.forEach((sectionId) => {
        const section = document.querySelector(sectionId);
        if (!section) return;

        section.querySelectorAll(
            '[data-scroll-float], [data-aos], [data-scroll], .scroll-animate'
        ).forEach((el) => {
            el.removeAttribute('data-scroll-float');
            el.removeAttribute('data-aos');
            el.removeAttribute('data-scroll');
            el.classList.remove(
                'scroll-animate',
                'scroll-visible',
                'aos-animate',
                'is-floating',
                'is-settled',
                'visible'
            );
            el.style.transform = '';
            el.style.transitionDelay = '';
        });
    });
}

function isInStaticScrollSection(el) {
    return STATIC_SCROLL_SECTIONS.some((id) => el.closest(id));
}

function initSiteScrollAnimations() {
    initStaticSectionContent();

    SCROLL_ANIM_SELECTORS.forEach(({ selector, aos }) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (el.closest('.hero') || isInStaticScrollSection(el)) return;
            if (
                el.hasAttribute('data-scroll-float') ||
                el.hasAttribute('data-aos') ||
                el.hasAttribute('data-scroll')
            ) {
                return;
            }
            el.classList.add('scroll-animate');
            el.setAttribute('data-scroll-float', '');
            el.setAttribute('data-aos', aos);
            if (!el.hasAttribute('data-delay')) {
                el.setAttribute('data-delay', String((index % 5) * 70));
            }
        });
    });

    document.querySelectorAll('[data-aos]:not([data-scroll-float])').forEach((el) => {
        if (!el.closest('.hero') && !isInStaticScrollSection(el)) {
            el.setAttribute('data-scroll-float', '');
        }
    });

    document.querySelectorAll('[data-scroll]:not([data-scroll-float])').forEach((el) => {
        if (!isInStaticScrollSection(el)) {
            el.setAttribute('data-scroll-float', '');
        }
    });
}

function getScrollAnimatedElements() {
    return document.querySelectorAll(
        '.scroll-animate, [data-scroll-float], [data-aos], [data-scroll]'
    );
}

function updateScrollFloat() {
    if (prefersReducedMotion) {
        getScrollAnimatedElements().forEach((el) => {
            if (el.closest('.hero') || isInStaticScrollSection(el)) return;
            el.classList.add('scroll-visible', 'aos-animate', 'is-settled', 'visible');
            el.style.transform = '';
            el.style.opacity = '';
        });
        return;
    }

    const vh = window.innerHeight;
    const triggerLine = vh * 0.9;
    const settleZone = vh * 0.11;
    const targetY = vh * 0.56;

    getScrollAnimatedElements().forEach((el) => {
        if (el.closest('.hero') || el.closest('#about') || el.hasAttribute('data-scroll-reveal')) {
            return;
        }

        if (el.closest('.story-timeline') && el.classList.contains('story-step')) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= triggerLine && rect.bottom >= vh * 0.03) {
                markScrollVisible(el);
            }
            el.classList.add('is-settled');
            el.classList.remove('is-floating');
            el.style.transform = '';
            return;
        }

        const rect = el.getBoundingClientRect();

        if (rect.top > triggerLine || rect.bottom < vh * 0.03) {
            return;
        }

        markScrollVisible(el);

        const centerY = rect.top + rect.height * 0.5;
        const dist = centerY - targetY;
        const floatY = clampScroll(dist * 0.14, -36, 36);
        const floatX = clampScroll(dist * 0.06, -18, 18);
        const animType = getScrollAnimType(el);
        const settled = Math.abs(dist) < settleZone;

        if (settled) {
            el.classList.add('is-settled');
            el.classList.remove('is-floating');
            applyScrollTransform(el, animType, 0, 0, true);
        } else {
            el.classList.remove('is-settled');
            el.classList.add('is-floating');
            applyScrollTransform(el, animType, floatX, floatY, false);
        }
    });
}

const PAGE_SECTION_IDS = ['home', 'services', 'features', 'story', 'about', 'contact'];
const pageNavUp = document.getElementById('pageNavUp');
const pageNavDown = document.getElementById('pageNavDown');

function getNavOffset() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
}

function getPageSections() {
    return PAGE_SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
}

function getCurrentPageSectionIndex() {
    const sections = getPageSections();
    if (!sections.length) return 0;

    const y = window.scrollY + getNavOffset() + 100;
    let index = 0;
    sections.forEach((section, i) => {
        if (section.offsetTop <= y) {
            index = i;
        }
    });
    return index;
}

function scrollToPageSection(index) {
    const sections = getPageSections();
    const section = sections[index];
    if (!section) return;

    const top = Math.max(0, section.offsetTop - getNavOffset());
    window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
}

function updatePageNavArrows() {
    if (!pageNavUp || !pageNavDown) return;

    const sections = getPageSections();
    const index = getCurrentPageSectionIndex();
    const last = sections.length - 1;

    pageNavUp.disabled = index <= 0;
    pageNavDown.disabled = index >= last;

    const targets = {
        up: sections[Math.max(0, index - 1)],
        down: sections[Math.min(last, index + 1)]
    };

    pageNavUp.setAttribute('aria-label', targets.up ? `Zu: ${getSectionLabel(targets.up)}` : 'Vorheriger Abschnitt');
    pageNavDown.setAttribute(
        'aria-label',
        targets.down ? `Zu: ${getSectionLabel(targets.down)}` : 'Nächster Abschnitt'
    );
}

function getSectionLabel(section) {
    if (section.id === 'home') return 'Start';
    const title = section.querySelector('.section-title, .story-title, h2');
    return title?.textContent?.trim() || section.id || 'Abschnitt';
}

function initPageNavArrows() {
    if (!pageNavUp || !pageNavDown) return;

    pageNavUp.addEventListener('click', () => {
        scrollToPageSection(getCurrentPageSectionIndex() - 1);
    });

    pageNavDown.addEventListener('click', () => {
        scrollToPageSection(getCurrentPageSectionIndex() + 1);
    });

    updatePageNavArrows();
}

function runScrollEffects() {
    scrollEffectsTicking = false;
    updateNavbarTheme();
    updateHeroStage();
    updateScrollFloat();
    updateStoryTimeline();
    updatePageNavArrows();
}

function queueScrollEffects() {
    if (!scrollEffectsTicking) {
        scrollEffectsTicking = true;
        requestAnimationFrame(runScrollEffects);
    }
}

function initHeroStage() {
    if (!heroStage || !heroSection) return;

    if (heroContent) {
        heroContent.style.setProperty('--hero-content-opacity', '0');
    }
    updateHeroStage();
}

window.addEventListener('scroll', queueScrollEffects, { passive: true });
window.addEventListener('resize', runScrollEffects);
window.addEventListener('load', () => {
    initSiteScrollAnimations();
    initHeroStage();
    initPageNavArrows();
    runScrollEffects();
});
initSiteScrollAnimations();
initHeroStage();
initPageNavArrows();
updateNavbarTheme();

