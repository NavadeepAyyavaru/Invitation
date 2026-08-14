/* ==========================================================================
   ROMANTIC DATE INVITATION — JAVASCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Select elements
    const scenes = document.querySelectorAll('.scene');
    const waxSeal = document.getElementById('wax-seal');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const dodgeCaption = document.getElementById('dodge-caption');
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    const btnGallery = document.getElementById('btn-gallery');
    const btnReset = document.getElementById('btn-reset');
    const btnBackInvitation = document.getElementById('btn-back-invitation');
    
    // Lightroom modal
    const modal = document.getElementById('lightroom-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');
    
    // Dodging State Variables
    let yesScale = 1;
    let dodgeCount = 0;
    const teasingPhrases = [
        "Nice try, gorgeous! 😉",
        "The 'No' button is shy today! 🌸",
        "Not so fast! ❤️",
        "Click 'Yes' already! 🥰",
        "Error: Option not allowed! 🚫",
        "No is not in my dictionary! 📖",
        "Almost had it! 💨",
        "Nice try, my angel! 😇",
        "No way, beautiful! ✨",
        "Try again, cutie! 💖"
    ];

    // Target date for countdown (26th August, 2026)
    const targetDate = new Date('August 26, 2026 00:00:00').getTime();

    // ==========================================================================
    // SOUND EFFECTS VIA WEB AUDIO API (Synthesized Chimes)
    // ==========================================================================
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSynthesizedSound(type) {
        try {
            initAudioContext();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;
            
            if (type === 'seal-break') {
                // Rising romantic harp arpeggio
                const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
                notes.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    
                    gain.gain.setValueAtTime(0, now + idx * 0.08);
                    gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.4);
                });
            } else if (type === 'dodge') {
                // Quick cute bounce/bloop sound
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
                
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'yes-celebration') {
                // Joyful high bell chime chord
                const chord = [523.25, 659.25, 783.99, 987.77, 1046.50]; // Cmaj7 bell chord
                chord.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    // Add some vibrato
                    osc.frequency.setValueAtTime(freq, now);
                    osc.frequency.linearRampToValueAtTime(freq + (Math.random() * 10 - 5), now + 0.5);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.08, now + 0.05 + idx * 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + idx * 0.05);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 1.5);
                });
            }
        } catch (e) {
            console.warn("Synthesized audio failed:", e);
        }
    }

    // ==========================================================================
    // SCENE TRANSITIONS
    // ==========================================================================
    function transitionTo(targetSceneId) {
        const currentActive = document.querySelector('.scene.active');
        const targetScene = document.getElementById(targetSceneId);
        
        if (!targetScene) return;

        // Start fade out of current
        if (currentActive) {
            currentActive.style.opacity = 0;
            currentActive.style.transform = 'scale(0.97) translateY(-15px)';
            currentActive.style.pointerEvents = 'none';
            
            setTimeout(() => {
                currentActive.classList.remove('active');
                
                // Prepare target
                targetScene.classList.add('active');
                // Trigger reflow
                targetScene.offsetHeight;
                
                // Fade in target
                targetScene.style.opacity = 1;
                targetScene.style.transform = 'scale(1) translateY(0)';
                targetScene.style.pointerEvents = 'auto';
                
                // Focus container for accessibility if needed
                targetScene.setAttribute('tabindex', '-1');
                targetScene.focus();
            }, 800); // match transition duration
        } else {
            targetScene.classList.add('active');
            targetScene.style.opacity = 1;
            targetScene.style.transform = 'scale(1) translateY(0)';
            targetScene.style.pointerEvents = 'auto';
        }
    }

    // ==========================================================================
    // SCENE 1: WAX SEAL INTERACTION
    // ==========================================================================
    if (waxSeal) {
        waxSeal.addEventListener('click', () => {
            if (waxSeal.classList.contains('broken')) return;
            
            // Play split animation
            waxSeal.classList.add('broken');
            playSynthesizedSound('seal-break');
            
            // Try to autoplay background music (user action allows it)
            if (!musicBtn.classList.contains('muted')) {
                bgMusic.play().catch(err => {
                    console.log("Autoplay music blocked, will toggle manually:", err);
                });
            }
            
            // Transition to Scene 2 after crack completes
            setTimeout(() => {
                transitionTo('scene-2');
            }, 1200);
        });
    }

    // ==========================================================================
    // SCENE 2: NO BUTTON DODGE LOGIC
    // ==========================================================================
    function dodgeNoButton(e) {
        // Play bounce audio
        playSynthesizedSound('dodge');
        
        const card = btnNo.closest('.glass-card');
        const cardRect = card.getBoundingClientRect();
        const btnNoRect = btnNo.getBoundingClientRect();
        
        // Ensure absolute positioning is enabled on first dodge
        if (btnNo.style.position !== 'absolute') {
            btnNo.style.position = 'absolute';
            btnNo.style.zIndex = '50';
            btnNo.style.margin = '0';
        }

        // Available movement boundaries within card padding
        const padding = 25;
        const maxX = cardRect.width - btnNoRect.width - padding * 2;
        const maxY = cardRect.height - btnNoRect.height - padding * 2;
        
        // Generate new random positions
        let randomX = Math.random() * maxX + padding;
        let randomY = Math.random() * maxY + padding;
        
        // Avoid overlap with the cursor
        let cursorX = e.clientX ? e.clientX - cardRect.left : cardRect.width / 2;
        let cursorY = e.clientY ? e.clientY - cardRect.top : cardRect.height / 2;
        
        // If too close to the cursor, offset it
        const minDistance = 75;
        const dist = Math.hypot(randomX - cursorX, randomY - cursorY);
        if (dist < minDistance) {
            randomX = (randomX + 150) % maxX + padding;
            randomY = (randomY + 150) % maxY + padding;
        }

        // Apply new position
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        
        // Show cute tease caption
        dodgeCount++;
        const phraseIndex = (dodgeCount - 1) % teasingPhrases.length;
        dodgeCaption.innerText = teasingPhrases[phraseIndex];
        dodgeCaption.classList.add('show');
        
        // Scale up the YES button
        yesScale += 0.15;
        // Limit max scale to keep within screen limits
        const cappedScale = Math.min(yesScale, 2.2);
        btnYes.style.transform = `scale(${cappedScale})`;
        
        // Add romantic glow and shadow emphasis to YES button
        btnYes.style.boxShadow = `0 10px ${20 + (dodgeCount * 5)}px rgba(255, 94, 126, ${0.3 + (dodgeCount * 0.1)})`;
    }

    // Add dodge events
    btnNo.addEventListener('mouseenter', dodgeNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents clicks on touch devices
        dodgeNoButton(e.touches[0]);
    });
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        dodgeNoButton(e);
    });

    // ==========================================================================
    // SCENE 2: YES BUTTON CLICK (CELEBRATION BURST)
    // ==========================================================================
    btnYes.addEventListener('click', (e) => {
        playSynthesizedSound('yes-celebration');
        
        // Calculate YES button center for particle burst origin
        const rect = btnYes.getBoundingClientRect();
        const burstX = rect.left + rect.width / 2;
        const burstY = rect.top + rect.height / 2;
        
        // Trigger large explosion on background canvas
        createHeartBurst(burstX, burstY, 80);
        
        // Wait briefly for burst effect to expand, then transition
        setTimeout(() => {
            transitionTo('scene-3');
            startCountdown();
        }, 600);
    });

    // ==========================================================================
    // SCENE 3: LIVE COUNTDOWN TIMER
    // ==========================================================================
    let countdownInterval = null;

    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');
        
        function updateTimer() {
            const now = new Date().getTime();
            const difference = targetDate - now;
            
            if (difference < 0) {
                // Countdown reached!
                clearInterval(countdownInterval);
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minsEl.innerText = "00";
                secsEl.innerText = "00";
                document.querySelector('.timer-title').innerText = "Today is the Day! 😍";
                return;
            }
            
            // Time math
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            // Render with padding
            daysEl.innerText = String(days).padStart(2, '0');
            hoursEl.innerText = String(hours).padStart(2, '0');
            minsEl.innerText = String(minutes).padStart(2, '0');
            secsEl.innerText = String(seconds).padStart(2, '0');
        }
        
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // ==========================================================================
    // MUSIC PLAYER CONTROLLER
    // ==========================================================================
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    musicBtn.classList.remove('muted');
                    musicBtn.querySelector('span').innerText = "Mute Music 🔇";
                })
                .catch(err => {
                    console.log("Audio play request failed:", err);
                });
        } else {
            bgMusic.pause();
            musicBtn.classList.add('muted');
            musicBtn.querySelector('span').innerText = "Play Music 🎵";
        }
    });

    // ==========================================================================
    // SCENE 3/4 NAVIGATION & GALLERY TRANSITIONS
    // ==========================================================================
    btnGallery.addEventListener('click', () => {
        transitionTo('scene-4');
    });

    btnBackInvitation.addEventListener('click', () => {
        transitionTo('scene-3');
    });

    btnReset.addEventListener('click', () => {
        // Reset state variables
        yesScale = 1;
        dodgeCount = 0;
        
        // Reset Yes/No button visual state
        btnYes.style.transform = 'scale(1)';
        btnYes.style.boxShadow = '';
        btnNo.style.position = '';
        btnNo.style.left = '';
        btnNo.style.top = '';
        btnNo.style.margin = '';
        dodgeCaption.classList.remove('show');
        
        // Re-seal landing screen
        waxSeal.classList.remove('broken');
        
        // Stop countdown interval
        if (countdownInterval) clearInterval(countdownInterval);
        
        // Transition back
        transitionTo('scene-1');
    });

    // ==========================================================================
    // PORTRAIT GALLERY LIGHTROOM MODAL
    // ==========================================================================
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    
    polaroidCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const caption = card.querySelector('.caption-text');
            
            modalImg.src = img.src;
            modalCaption.innerText = caption.innerText;
            
            modal.classList.add('show');
            playSynthesizedSound('dodge'); // subtle click noise
        });
    });

    function closeLightroom() {
        modal.classList.remove('show');
    }

    closeModal.addEventListener('click', closeLightroom);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-content-wrapper')) {
            closeLightroom();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeLightroom();
        }
    });

    // ==========================================================================
    // CANVAS PARTICLE SYSTEM (PETALS, SPARKLER STARS, HEARTS)
    // ==========================================================================
    const canvas = document.getElementById('ambient-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 65;

    // Petal Images Preloading simulation (drawing vector shapes directly)
    class Particle {
        constructor(isBurst = false, burstX = 0, burstY = 0) {
            this.isBurst = isBurst;
            
            // Set type: 'petal', 'star', 'heart'
            const types = ['petal', 'star', 'heart'];
            if (isBurst) {
                // Burst contains more hearts and stars
                this.type = Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'star' : 'petal');
                this.x = burstX;
                this.y = burstY;
                
                // Explode radially
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.life = Math.random() * 80 + 40;
                this.maxLife = this.life;
            } else {
                // Normal ambient drifts
                this.type = Math.random() > 0.65 ? 'star' : (Math.random() > 0.5 ? 'heart' : 'petal');
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.vx = Math.random() * 1.5 - 0.75 + (this.type === 'petal' ? 0.3 : 0); // petal drifts right slightly
                this.vy = Math.random() * 1.2 + 0.6; // down velocity
                this.alpha = Math.random() * 0.4 + 0.3;
                this.life = 9999; // Ambient live indefinitely until recycled
                this.maxLife = 9999;
            }

            this.size = Math.random() * 12 + 8;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.02 - 0.01) * (this.type === 'petal' ? 2 : 1);
            
            // Colors
            // Hearts are pink/red, stars are golden/white, petals are soft rose
            if (this.type === 'heart') {
                const hues = [340, 350, 355, 10]; // Red/Pink colors
                this.hue = hues[Math.floor(Math.random() * hues.length)];
                this.color = `hsla(${this.hue}, 95%, 75%, ${this.alpha})`;
            } else if (this.type === 'star') {
                this.color = `rgba(255, 223, 115, ${this.alpha})`; // gold star
            } else {
                // Rose petal color range (light peach pinks)
                const petalHues = [345, 350, 355];
                this.hue = petalHues[Math.floor(Math.random() * petalHues.length)];
                this.color = `hsla(${this.hue}, 90%, 82%, ${this.alpha})`;
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            
            if (this.isBurst) {
                this.life--;
                this.alpha = this.life / this.maxLife;
                // Add soft gravity and drag
                this.vy += 0.05; 
                this.vx *= 0.98;
                this.vy *= 0.98;
            } else {
                // Wind wiggle for floating petals
                if (this.type === 'petal') {
                    this.vx += Math.sin(this.y * 0.01) * 0.01;
                }
                
                // Recycle normal particles that go off-screen
                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.y = -20;
                    this.x = Math.random() * width;
                    this.vy = Math.random() * 1.2 + 0.6;
                    this.vx = Math.random() * 1.5 - 0.75;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.isBurst ? this.alpha : (this.alpha * getSceneAmbientAlpha(this.type));
            
            if (this.type === 'heart') {
                // Draw heart shape
                ctx.beginPath();
                ctx.fillStyle = this.color;
                const size = this.size * 0.8;
                
                ctx.moveTo(0, size / 4);
                ctx.quadraticCurveTo(-size / 2, -size / 2, -size / 2, 0);
                ctx.quadraticCurveTo(-size / 2, size / 2, 0, size * 0.95);
                ctx.quadraticCurveTo(size / 2, size / 2, size / 2, 0);
                ctx.quadraticCurveTo(size / 2, -size / 2, 0, size / 4);
                ctx.fill();
                
            } else if (this.type === 'star') {
                // Draw four-point star / sparkle
                ctx.beginPath();
                ctx.fillStyle = this.color;
                const r = this.size * 0.6;
                ctx.moveTo(0, -r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.quadraticCurveTo(0, 0, 0, r);
                ctx.quadraticCurveTo(0, 0, -r, 0);
                ctx.quadraticCurveTo(0, 0, 0, -r);
                ctx.closePath();
                ctx.fill();
                
            } else {
                // Draw soft oval rose petal
                ctx.beginPath();
                ctx.fillStyle = this.color;
                const w = this.size;
                const h = this.size * 1.4;
                // Draw drop petal shape
                ctx.moveTo(0, -h / 2);
                ctx.bezierCurveTo(w / 2, -h / 2, w, h / 4, 0, h / 2);
                ctx.bezierCurveTo(-w, h / 4, -w / 2, -h / 2, 0, -h / 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }

    // Adjust particle density based on active scenes
    function getSceneAmbientAlpha(type) {
        const activeScene = document.querySelector('.scene.active');
        if (!activeScene) return 1;
        const id = activeScene.id;
        
        if (id === 'scene-3' || id === 'scene-4') {
            // Scene 3 and 4 have higher opacity/glow for hearts and petals
            return type === 'heart' ? 1.0 : 0.85;
        }
        if (id === 'scene-2') {
            return type === 'heart' ? 0.4 : 0.6;
        }
        return type === 'heart' ? 0.2 : 0.5; // Scene 1 mostly stars/petals, fewer hearts visible
    }

    // Initialize ambient particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle(false));
    }

    // Create explosion burst of hearts/stars
    function createHeartBurst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(true, x, y));
        }
    }

    // ==========================================================================
    // INTERACTIVE CURSOR TRAIL
    // ==========================================================================
    const cursorTrail = [];
    const maxTrailLength = 15;
    
    // Throttle cursor trails to prevent rendering overhead
    let lastMouseMove = 0;
    
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMove < 40) return; // limit to 25fps for trails
        lastMouseMove = now;
        
        cursorTrail.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 8 + 6,
            angle: Math.random() * Math.PI * 2,
            opacity: 1,
            color: `hsla(${Math.random() > 0.5 ? 350 : 340}, 95%, 78%, 0.8)`
        });
        
        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            cursorTrail.push({
                x: touch.clientX,
                y: touch.clientY,
                size: Math.random() * 8 + 6,
                angle: Math.random() * Math.PI * 2,
                opacity: 1,
                color: `hsla(345, 95%, 78%, 0.8)`
            });
            if (cursorTrail.length > maxTrailLength) {
                cursorTrail.shift();
            }
        }
    });

    function drawCursorTrail() {
        for (let i = 0; i < cursorTrail.length; i++) {
            const point = cursorTrail[i];
            point.opacity -= 0.05; // Fade out
            point.y -= 1.2; // Float up slightly
            
            if (point.opacity <= 0) {
                cursorTrail.splice(i, 1);
                i--;
                continue;
            }
            
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.rotate(point.angle);
            ctx.globalAlpha = point.opacity;
            ctx.fillStyle = point.color;
            
            // Draw small heart
            const size = point.size;
            ctx.beginPath();
            ctx.moveTo(0, size / 4);
            ctx.quadraticCurveTo(-size / 2, -size / 2, -size / 2, 0);
            ctx.quadraticCurveTo(-size / 2, size / 2, 0, size * 0.95);
            ctx.quadraticCurveTo(size / 2, size / 2, size / 2, 0);
            ctx.quadraticCurveTo(size / 2, -size / 2, 0, size / 4);
            ctx.fill();
            ctx.restore();
        }
    }

    // ==========================================================================
    // TICK LOOP
    // ==========================================================================
    function tick() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Update & draw ambient particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();
            
            // Remove dead burst particles
            if (p.isBurst && p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        
        // Draw cursor trail
        drawCursorTrail();
        
        requestAnimationFrame(tick);
    }
    
    // Start main animation loop
    tick();

    // Start background heart floating continuously on Scenes 3 and 4
    setInterval(() => {
        const activeScene = document.querySelector('.scene.active');
        if (activeScene && (activeScene.id === 'scene-3' || activeScene.id === 'scene-4')) {
            // Spawn an extra floating ambient heart from bottom of screen
            const x = Math.random() * width;
            const y = height + 10;
            const p = new Particle(true, x, y);
            p.isBurst = true;
            p.vy = -Math.random() * 2 - 0.5; // Float upwards
            p.vx = Math.random() * 1.5 - 0.75;
            p.life = 250;
            p.maxLife = 250;
            particles.push(p);
        }
    }, 400);

});
