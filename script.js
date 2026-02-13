/* ==========================================
   Valentine's Day Website - Main Script
   ========================================== */

(function () {
    'use strict';

    // ---- Photo list ----
    const photos = [
        'images/photo_2026-02-13_19-48-30.jpg',
        'images/photo_2026-02-13_19-48-32.jpg',
        'images/photo_2026-02-13_19-48-34.jpg',
        'images/photo_2026-02-13_19-48-36.jpg',
        'images/photo_2026-02-13_19-48-37.jpg',
        'images/photo_2026-02-13_19-48-39.jpg',
        'images/photo_2026-02-13_19-48-41.jpg',
        'images/photo_2026-02-13_19-48-43.jpg',
        'images/photo_2026-02-13_19-48-45.jpg',
        'images/photo_2026-02-13_19-48-49.jpg',
    ];

    // ---- Love quotes ----
    const quotes = [
        '"Every love story is beautiful, but ours is my favorite." 💕',
        '"In all the world, there is no heart for me like yours." 💖',
        '"You are my today and all of my tomorrows." ✨',
        '"I love you more than yesterday, less than tomorrow." 💗',
        '"Together is a wonderful place to be." 💝',
        '"You are the best thing that\'s ever been mine." 🌹',
        '"My heart is, and always will be, yours." 💘',
        '"I fell in love the way you fall asleep: slowly, then all at once." 🦋',
        '"You make my heart smile." 😊💕',
        '"Forever and always, you are my everything." 💖✨',
    ];

    // ---- DOM elements ----
    const introScreen = document.getElementById('intro-screen');
    const slideshowScreen = document.getElementById('slideshow-screen');
    const mainHeart = document.getElementById('main-heart');
    const heartExplosion = document.getElementById('heart-explosion');
    const bgHeartsContainer = document.getElementById('bg-hearts');
    const ropePhotosArea = document.getElementById('rope-photos-area');
    const loveQuote = document.getElementById('love-quote');

    // Slideshow state
    let photoQueueIndex = 0; // Points to the next photo in 'photos' to be used
    let activeSlotIndex = 0; // Points to which of the 3 slots to update next
    const slotsCount = 3;
    let updateInterval = null;

    // SVG Heart String
    const svgHeart = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    // ==================== BACKGROUND HEARTS ====================
    function createBgHearts() {
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'bg-heart';
            heart.innerHTML = svgHeart;
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (6 + Math.random() * 8) + 's';
            heart.style.animationDelay = (Math.random() * 10) + 's';

            // Randomize size slightly
            const size = 20 + Math.random() * 30;
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';

            bgHeartsContainer.appendChild(heart);
        }
    }

    // ==================== HEART EXPLOSION ====================
    function triggerExplosion() {
        const numHearts = 60;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'explosion-heart';
            heart.innerHTML = svgHeart;

            const angle = (Math.PI * 2 / numHearts) * i + (Math.random() - 0.5) * 0.5;
            const distance = 200 + Math.random() * 500;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 100;
            const rot = (Math.random() - 0.5) * 1080;
            const scale = 0.5 + Math.random() * 2;

            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.setProperty('--tx', tx + 'px');
            heart.style.setProperty('--ty', ty + 'px');
            heart.style.setProperty('--rot', rot + 'deg');
            heart.style.setProperty('--scale', scale);

            heart.style.animationDuration = (1 + Math.random() * 1.5) + 's';
            heart.style.animationDelay = (Math.random() * 0.3) + 's';

            heartExplosion.appendChild(heart);
        }

        // White flash
        const flash = document.createElement('div');
        flash.className = 'white-flash';
        document.body.appendChild(flash);

        // Transition to slideshow
        setTimeout(() => {
            introScreen.classList.remove('active');
        }, 600);

        setTimeout(() => {
            slideshowScreen.classList.add('active');
            initRopeGallery();
            initParticles();

            // Trigger reveal animations
            document.querySelector('.main-title').classList.add('visible');
            document.querySelector('.rope-container').classList.add('visible');
            document.querySelector('.love-quote').classList.add('visible');
        }, 1400);

        // Cleanup explosion
        setTimeout(() => {
            heartExplosion.innerHTML = '';
            if (flash.parentNode) flash.remove();
        }, 3000);
    }

    // ==================== ROPE GALLERY ====================
    function initRopeGallery() {
        // Create initial 3 hanging photos
        for (let i = 0; i < slotsCount; i++) {
            createHangingPhoto(i);
        }

        // Start cycling updates
        startPhotoUpdates();

        // Initial quote
        updateQuote();
    }

    function createHangingPhoto(slotIndex) {
        // Get photo
        const imgSrc = photos[photoQueueIndex % photos.length];
        photoQueueIndex++;

        // Create DOM structure
        const container = document.createElement('div');
        container.className = 'hanging-photo';
        container.dataset.slot = slotIndex;

        const clip = document.createElement('div');
        clip.className = 'clip';

        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'polaroid-img-wrapper';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Our memory';

        imgWrapper.appendChild(img);
        polaroid.appendChild(imgWrapper);
        container.appendChild(clip);
        container.appendChild(polaroid);

        ropePhotosArea.appendChild(container);
    }

    function startPhotoUpdates() {
        // Update one photo every 2.5 seconds
        updateInterval = setInterval(() => {
            updateNextSlot();
        }, 2500);
    }

    function updateNextSlot() {
        // Find the slot element
        const slots = document.querySelectorAll('.hanging-photo');
        if (!slots.length) return;

        const targetSlot = slots[activeSlotIndex];
        const img = targetSlot.querySelector('img');
        const nextPhotoSrc = photos[photoQueueIndex % photos.length];

        // Add updating class for animation
        targetSlot.classList.add('updating');

        // Swap image halfway through animation
        setTimeout(() => {
            img.src = nextPhotoSrc;
            photoQueueIndex++; // Move queue forward
        }, 600); // Half of 1.2s animation

        // Remove class after animation
        setTimeout(() => {
            targetSlot.classList.remove('updating');
        }, 1200);

        // Update quote occasionally (every full cycle of slots)
        if (activeSlotIndex === 0) {
            updateQuote();
        }

        // Move to next slot for next time
        activeSlotIndex = (activeSlotIndex + 1) % slotsCount;
    }

    function updateQuote() {
        // Pick a random quote or cycle through
        const quoteText = quotes[Math.floor(Math.random() * quotes.length)];

        if (loveQuote.style.opacity === '1') {
            loveQuote.style.opacity = '0';
            setTimeout(() => {
                loveQuote.textContent = quoteText;
                loveQuote.style.opacity = '1';
            }, 500);
        } else {
            loveQuote.textContent = quoteText;
            // It will fade in via CSS animation initially
        }
    }

    // ==================== PARTICLE CANVAS ====================
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const count = Math.min(50, Math.floor(window.innerWidth / 20));

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 1 + Math.random() * 3,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: -0.3 - Math.random() * 0.5,
                opacity: 0.2 + Math.random() * 0.4,
                hue: 330 + Math.random() * 30, // Pink-ish hues
            });
        }

        function drawHeart(x, y, size, color) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(size / 15, size / 15);
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.bezierCurveTo(-7, -15, -15, -5, 0, 8);
            ctx.moveTo(0, -5);
            ctx.bezierCurveTo(7, -15, 15, -5, 0, 8);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.y < -20) p.y = canvas.height + 20;
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;

                const color = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
                drawHeart(p.x, p.y, p.size, color);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ==================== INIT ====================
    function init() {
        createBgHearts();

        // Heart click handler
        mainHeart.addEventListener('click', function handler() {
            mainHeart.removeEventListener('click', handler);
            mainHeart.style.animation = 'none';
            mainHeart.style.transform = 'scale(1.3)';
            mainHeart.style.transition = 'transform 0.3s ease';

            setTimeout(() => {
                mainHeart.style.transform = 'scale(0)';
                mainHeart.style.transition = 'transform 0.5s ease-in';
                triggerExplosion();
            }, 300);
        });

        // Also handle keyboard activation
        mainHeart.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mainHeart.click();
            }
        });

        // Preload images
        photos.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
