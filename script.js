// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

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

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Add stagger effect for service cards
            if (entry.target.classList.contains('service-card')) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

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

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Counter animation for feature numbers
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe feature numbers and animate them
const featureNumbers = document.querySelectorAll('.feature-number');
const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (!isNaN(number) && number > 100) {
                entry.target.classList.add('animated');
                animateCounter(entry.target, number);
            }
        }
    });
}, { threshold: 0.5 });

featureNumbers.forEach(number => {
    featureObserver.observe(number);
});

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

// Story Scroll Animations
const storyObserverOptions = {
    threshold: [0.1, 0.3, 0.5],
    rootMargin: '0px 0px -50px 0px'
};

const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, storyObserverOptions);

// Active step observer for highlighting - tracks all steps to find the most visible one
const allSteps = document.querySelectorAll('.story-step');
let activeStepObserver;

if (allSteps.length > 0) {
    const activeStepObserverOptions = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-30% 0px -30% 0px'
    };
    
    activeStepObserver = new IntersectionObserver((entries) => {
        // Track all intersection ratios
        const stepRatios = new Map();
        
        entries.forEach(entry => {
            stepRatios.set(entry.target, entry.intersectionRatio);
        });
        
        // Find the step with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleStep = null;
        
        stepRatios.forEach((ratio, step) => {
            if (ratio > maxRatio) {
                maxRatio = ratio;
                mostVisibleStep = step;
            }
        });
        
        // Remove active from all steps
        allSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Add active to the most visible step if it meets threshold
        if (mostVisibleStep && maxRatio > 0.3) {
            mostVisibleStep.classList.add('active');
        }
    }, activeStepObserverOptions);
    
    // Observe all story steps for active state
    allSteps.forEach(step => {
        activeStepObserver.observe(step);
    });
}

// Observe all story elements
document.querySelectorAll('[data-scroll]').forEach(el => {
    storyObserver.observe(el);
});


// Parallax effect for story section
let storyParallax = false;
const storySection = document.querySelector('.story');

if (storySection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const storyRect = storySection.getBoundingClientRect();
        const storyTop = storyRect.top + scrolled;
        const storyHeight = storySection.offsetHeight;
        
        if (scrolled > storyTop - window.innerHeight && scrolled < storyTop + storyHeight) {
            const parallaxValue = (scrolled - storyTop + window.innerHeight) * 0.1;
            storySection.style.transform = `translateY(${parallaxValue}px)`;
        }
    });
}

// Progressive reveal for story steps
const storySteps = document.querySelectorAll('.story-step');
storySteps.forEach((step, index) => {
    step.style.transitionDelay = `${index * 100}ms`;
});

console.log('Gosejohann Website loaded successfully! 🚛');

