// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const magneticElements = document.querySelectorAll('.magnetic, a');

let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Smooth follower movement
setInterval(() => {
    posX += (mouseX - posX) / 9;
    posY += (mouseY - posY) / 9;

    follower.style.left = posX + 'px';
    follower.style.top = posY + 'px';
}, 10);

magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
    });
});

// Text Scramble Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scrambleText(element) {
    let iterations = 0;
    const originalText = element.dataset.value;

    const interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
        }

        iterations += 1 / 3;
    }, 30);
}

const scrambleElements = document.querySelectorAll('.scramble-text, .glitch-text, .hover-link, .logo');

scrambleElements.forEach(el => {
    el.addEventListener('mouseover', () => {
        scrambleText(el);
    });
    // Trigger once on load for hero title
    if (el.classList.contains('glitch-text')) {
        setTimeout(() => scrambleText(el), 500);
    }
});

// Canvas Particle Network
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 60; // Minimal count

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#333';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();

        // Connect particles
        for (let j = index; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(50, 50, 50, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        const mouseDx = p.x - mouseX;
        const mouseDy = p.y - mouseY;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDistance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.5 - mouseDistance / 300})`; // Cyan connection
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        }
    });

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// Intersection Observer for Skills Animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.progress-line');
            if (progressBar) {
                // Using pseudo-element width trick: we can't animate pseudo-elements directly with inline styles easily
                // So we'll add a class that triggers the CSS transition width calculated in CSS
                // Actually, let's just animate the style of the ::after by setting a variable or just standard div
                // The current CSS uses ::after with transition. Let's make it simpler.
                // We'll trust the CSS transition. The CSS has width:0 -> width:100% on load? No.
                // Let's modify the CSS logic slightly in JS:
                const width = entry.target.querySelector('.progress-line').getAttribute('data-width');

                // We need to inject a style to set the width of the ::after element, 
                // OR better, we just use a real element for the bar

                // Refactoring slightly for robustness:
                let bar = document.createElement('div');
                bar.style.height = '100%';
                bar.style.width = '0%';
                bar.style.backgroundColor = 'var(--accent-color)';
                bar.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';

                // Clear existing pseudo-element hack if it conflicts, or just append
                entry.target.querySelector('.progress-line').appendChild(bar);

                // Forced reflow
                void bar.offsetWidth;

                bar.style.width = width;
            }
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-bar-wrapper').forEach(el => skillObserver.observe(el));
