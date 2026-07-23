// EduMux Landing Page - Interactive Animations
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollAnimations();
    initParallaxEffect();
    initNavigation();
    initCounterAnimation();
});

// ===== Shared Utilities =====

// Inject a <style> block into the document head.
function injectStyles(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
}

// Observe one or more elements and fire the callback once when each first
// becomes visible, then stop observing that element.
function observeOnce(targets, onIntersect, options) {
    const elements = targets instanceof Element ? [targets] : targets;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                onIntersect(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    elements.forEach(el => observer.observe(el));
    return observer;
}

// Attach mouseenter/mouseleave handlers to a collection of elements.
function addHoverEffect(elements, onEnter, onLeave) {
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => onEnter(el));
        el.addEventListener('mouseleave', () => onLeave(el));
    });
}

// ===== Particle System =====
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(102, 126, 234, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        animation: float ${duration}s ${delay}s infinite ease-in-out;
        filter: blur(1px);
    `;
    
    container.appendChild(particle);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.feature-card, .book-card, .step, .stat'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    });

    observeOnce(animateElements, (target) => {
        target.classList.add('animate-in');
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
}

// Add animation class styles dynamically
injectStyles(`
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`);

// ===== Parallax Effect =====
function initParallaxEffect() {
    const heroVisual = document.querySelector('.hero-visual');
    const floatingBooks = document.querySelectorAll('.floating-book');
    
    if (!heroVisual) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                floatingBooks.forEach((book, index) => {
                    const speed = (index + 1) * 0.1;
                    const rotation = scrolled * speed * 0.05;
                    book.style.transform = `translateY(${rate * speed}px) rotateY(${rotation}deg)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== Navigation =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background on scroll
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 15, 26, 0.95)';
        } else {
            navbar.style.background = 'rgba(15, 15, 26, 0.8)';
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Counter Animation =====
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    observeOnce(stats, (target) => {
        const finalValue = target.textContent;

        // Extract number and suffix
        const match = finalValue.match(/^([\d.]+)(.*)$/);
        if (match) {
            const number = parseFloat(match[1]);
            const suffix = match[2];
            animateCounter(target, number, suffix);
        }
    }, {
        threshold: 0.5
    });
}

function animateCounter(element, target, suffix) {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            // Handle decimals for ratings
            if (suffix === '') {
                element.textContent = Math.floor(current) + suffix;
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
        }
    }, stepTime);
}

// ===== Book Card Hover Effect =====
addHoverEffect(
    document.querySelectorAll('.book-card'),
    (card) => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    },
    (card) => {
        card.style.transform = 'translateY(0) scale(1)';
    }
);

// ===== Feature Card Interactions =====
addHoverEffect(
    document.querySelectorAll('.feature-card'),
    (card) => {
        const icon = card.querySelector('.icon-bg');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    },
    (card) => {
        const icon = card.querySelector('.icon-bg');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }
);

// ===== Download Button Ripple Effect =====
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            left: ${x - 10}px;
            top: ${y - 10}px;
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// Add ripple animation styles
injectStyles(`
    @keyframes rippleEffect {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`);

// ===== Phone AR Scene Animation =====
function initPhoneAnimation() {
    const arObject = document.querySelector('.dinosaur');
    if (!arObject) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        const rect = document.querySelector('.phone-screen')?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX = (e.clientX - centerX) / 20;
        mouseY = (e.clientY - centerY) / 20;
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        if (arObject) {
            arObject.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize phone animation after load
window.addEventListener('load', initPhoneAnimation);

// ===== Glitch Effect for Title =====
function initGlitchEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    const text = title.innerHTML;
    
    title.addEventListener('mouseenter', () => {
        title.style.animation = 'glitch 0.3s ease';
        setTimeout(() => {
            title.style.animation = '';
        }, 300);
    });
}

// Add glitch animation
injectStyles(`
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`);

initGlitchEffect();

// ===== Typing Effect for Quote =====
function initTypingEffect() {
    const quote = document.querySelector('blockquote');
    if (!quote) return;

    const originalText = quote.textContent;
    quote.textContent = '';
    quote.style.opacity = '1';

    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < originalText.length) {
            quote.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            // Restore HTML after typing
            quote.innerHTML = originalText
                .replace(/(nace el amor por aprender)/, '<span class="highlight">$1</span>');
        }
    }, 30);
}

// Start typing effect when quote is visible
const quote = document.querySelector('blockquote');
if (quote) {
    observeOnce(quote, initTypingEffect, { threshold: 0.5 });
}

console.log('🚀 EDUBIX AR Landing Page Loaded');
