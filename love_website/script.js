document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const heartCanvas = document.getElementById('heartCanvas');
    const ctx = heartCanvas.getContext('2d');
    const loveButton = document.getElementById('loveButton');
    const specialHeart = document.getElementById('specialHeart');
    
    let particles = [];
    let heartParticles = [];
    let animationId;

    // Canvas setup
    const resizeCanvas = () => {
        heartCanvas.width = window.innerWidth;
        heartCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class for heart formation
    class HeartParticle {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.size = Math.random() * 4 + 2;
            this.color = `hsl(${Math.random() * 60 + 320}, 100%, ${Math.random() * 30 + 60}%)`;
            this.speed = 0.02;
            this.life = 1;
            this.alpha = 1;
        }

        update() {
            // Move towards target position
            this.x += (this.targetX - this.x) * this.speed;
            this.y += (this.targetY - this.y) * this.speed;
            
            // Add some randomness
            this.x += (Math.random() - 0.5) * 0.5;
            this.y += (Math.random() - 0.5) * 0.5;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Explosion particle class
    class ExplosionParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.size = Math.random() * 6 + 2;
            this.color = `hsl(${Math.random() * 60 + 320}, 100%, 70%)`;
            this.life = 60;
            this.maxLife = 60;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.life--;
            this.size *= 0.98;
        }

        draw() {
            const alpha = this.life / this.maxLife;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Heart shape function
    function getHeartPoints(centerX, centerY, size) {
        const points = [];
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const x = centerX + size * (16 * Math.sin(t) ** 3);
            const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            points.push({x, y});
        }
        return points;
    }

    // Create heart formation
    function createHeartFormation() {
        const centerX = heartCanvas.width / 2;
        const centerY = heartCanvas.height / 2;
        const heartPoints = getHeartPoints(centerX, centerY, 3);
        
        heartParticles = [];
        for (let i = 0; i < 100; i++) {
            const randomPoint = heartPoints[Math.floor(Math.random() * heartPoints.length)];
            const startX = Math.random() * heartCanvas.width;
            const startY = Math.random() * heartCanvas.height;
            heartParticles.push(new HeartParticle(startX, startY, randomPoint.x, randomPoint.y));
        }
    }

    // Create explosion effect
    function createExplosion(x, y) {
        for (let i = 0; i < 30; i++) {
            particles.push(new ExplosionParticle(x, y));
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

        // Update and draw heart particles
        heartParticles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Update and draw explosion particles
        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });

        animationId = requestAnimationFrame(animate);
    }

    // Floating hearts
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '♥';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.color = `hsl(${Math.random() * 60 + 320}, 100%, 70%)`;
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }

    // Interactive heart clicks
    document.querySelectorAll('.heart-shape').forEach(heart => {
        heart.addEventListener('click', (e) => {
            const rect = heart.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createExplosion(x, y);
            
            // Create multiple floating hearts
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createFloatingHeart(), i * 100);
            }
        });
    });

    // Special heart interaction
    specialHeart.addEventListener('click', () => {
        createHeartFormation();
        
        // Create explosion at heart position
        const rect = specialHeart.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createExplosion(x, y);
        
        // Create many floating hearts
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createFloatingHeart(), i * 50);
        }
    });

    // Love button interaction
    loveButton.addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        createExplosion(x, y);
        createHeartFormation();
        
        // Change button text temporarily
        const originalText = loveButton.textContent;
        loveButton.textContent = 'Love You! ♥♥♥';
        setTimeout(() => {
            loveButton.textContent = originalText;
        }, 2000);
        
        // Create floating hearts
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createFloatingHeart(), i * 30);
        }
    });

    // Mouse movement effect
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) { // 10% chance
            const particle = new ExplosionParticle(e.clientX, e.clientY);
            particle.size = 2;
            particle.life = 30;
            particle.maxLife = 30;
            particles.push(particle);
        }
    });

    // Auto-create floating hearts
    setInterval(createFloatingHeart, 2000);

    // Start animations
    animate();
    
    // Initial heart formation after page load
    setTimeout(() => {
        createHeartFormation();
    }, 1000);

    // Sparkle effect on container
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.left = Math.random() * container.offsetWidth + 'px';
        sparkle.style.top = Math.random() * container.offsetHeight + 'px';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        
        container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }

    // Add sparkle animation to CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(sparkleStyle);

    // Create sparkles periodically
    setInterval(createSparkle, 500);
});

