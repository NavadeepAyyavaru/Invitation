/* ==========================================================================
   ROMANTIC DATE INVITATION — JAVASCRIPT CONTROLLER (REFINED)
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

    // Set initial active scene visibility in relative layout flow
    const firstScene = document.getElementById('scene-1');
    if (firstScene) {
        firstScene.style.display = 'flex';
        // Force reflow and set active class
        void firstScene.offsetHeight;
        firstScene.classList.add('active');
        firstScene.style.opacity = 1;
        firstScene.style.transform = 'scale(1) translateY(0)';
    }

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
            currentActive.style.opacity = '0';
            currentActive.style.transform = 'scale(0.96) translateY(-15px)';
            
            setTimeout(() => {
                currentActive.classList.remove('active');
                currentActive.style.display = 'none';
                
                // Prepare target
                targetScene.style.display = 'flex';
                targetScene.style.opacity = '0';
                targetScene.style.transform = 'scale(0.96) translateY(15px)';
                
                // Trigger reflow
                void targetScene.offsetHeight;
                
                // Fade in target
                targetScene.classList.add('active');
                targetScene.style.opacity = '1';
                targetScene.style.transform = 'scale(1) translateY(0)';
                
                // Focus target scene
                targetScene.setAttribute('tabindex', '-1');
                targetScene.focus();
            }, 550); // match transition duration
        } else {
            targetScene.style.display = 'flex';
            void targetScene.offsetHeight;
            targetScene.classList.add('active');
            targetScene.style.opacity = '1';
            targetScene.style.transform = 'scale(1) translateY(0)';
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
                bgMusic.play().then(() => {
                    musicBtn.querySelector('span').innerText = "Mute Music 🔇";
                }).catch(err => {
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
    // SCENE 2: NO BUTTON VIEWPORT DODGE LOGIC
    // ==========================================================================
    function dodgeNoButton(e) {
        // Play bounce audio
        playSynthesizedSound('dodge');
        
        const btnNoRect = btnNo.getBoundingClientRect();
        
        // Convert to absolute fixed viewport position
        if (btnNo.style.position !== 'fixed') {
            btnNo.style.position = 'fixed';
            btnNo.style.zIndex = '1000';
            btnNo.style.transition = 'left 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }

        // Available viewport movement boundaries with 20px padding
        const padding = 20;
        const maxX = window.innerWidth - btnNoRect.width - padding * 2;
        const maxY = window.innerHeight - btnNoRect.height - padding * 2;
        
        // Generate new random positions
        let randomX = Math.random() * maxX + padding;
        let randomY = Math.random() * maxY + padding;
        
        // Determine cursor/touch coordinates to avoid
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        
        if (e) {
            if (e.clientX !== undefined) {
                cursorX = e.clientX;
                cursorY = e.clientY;
            } else if (e.touches && e.touches.length > 0) {
                cursorX = e.touches[0].clientX;
                cursorY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                cursorX = e.changedTouches[0].clientX;
                cursorY = e.changedTouches[0].clientY;
            }
        }
        
        // Enforce safe dodge radius away from cursor/finger (at least 150px or 30vw)
        const minDistance = Math.max(150, window.innerWidth * 0.3);
        let checkCount = 0;
        
        while (Math.hypot(randomX - cursorX, randomY - cursorY) < minDistance && checkCount < 15) {
            randomX = Math.random() * maxX + padding;
            randomY = Math.random() * maxY + padding;
            checkCount++;
        }

        // Apply new viewport coordinates
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        
        // Apply cute bounce keyframe triggers
        btnNo.classList.remove('dodge-bounce');
        void btnNo.offsetWidth; // trigger reflow
        btnNo.classList.add('dodge-bounce');
        
        // Show cute teasing caption
        dodgeCount++;
        const phraseIndex = (dodgeCount - 1) % teasingPhrases.length;
        dodgeCaption.innerText = teasingPhrases[phraseIndex];
        dodgeCaption.classList.add('show');
        
        // Scale up the YES button
        yesScale += 0.15;
        // Limit max scale to keep within screen limits
        const cappedScale = Math.min(yesScale, 2.2);
        btnYes.style.transform = `scale(${cappedScale})`;
        btnYes.style.boxShadow = `0 10px ${20 + (dodgeCount * 6)}px rgba(255, 94, 126, ${0.35 + (dodgeCount * 0.1)})`;
    }

    // Add dodge events for both desktop (hover) and mobile (tap/touch)
    btnNo.addEventListener('mouseenter', (e) => {
        dodgeNoButton(e);
    });
    
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents triggers twice or firing normal click
        dodgeNoButton(e);
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
        
        // Reset No button positioning style to default flow when moving away
        setTimeout(() => {
            btnNo.style.position = '';
            btnNo.style.left = '';
            btnNo.style.top = '';
            btnNo.style.transition = '';
            btnNo.classList.remove('dodge-bounce');
            
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
    // Explicitly initialize volume to max
    bgMusic.volume = 1.0;

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent body click handler from double-toggling
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

    // Global body click fallback for strict mobile browser autoplay blocks
    document.body.addEventListener('click', () => {
        // If the seal is broken, and music is not muted, and it is paused, play it
        if (waxSeal && waxSeal.classList.contains('broken') && bgMusic.paused && !musicBtn.classList.contains('muted')) {
            bgMusic.play()
                .then(() => {
                    musicBtn.classList.remove('muted');
                    musicBtn.querySelector('span').innerText = "Mute Music 🔇";
                })
                .catch(err => {
                    console.log("Autoplay body-level fallback blocked:", err);
                });
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
        btnNo.style.transition = '';
        btnNo.classList.remove('dodge-bounce');
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
    // CANVAS PARTICLE SYSTEM (LARGER, DRIFTING PETALS, KISSES, SPARKLER STARS, HEARTS)
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
    const maxParticles = 75; // Increased density

    class Particle {
        constructor(isBurst = false, burstX = 0, burstY = 0) {
            this.isBurst = isBurst;
            
            // Set type: 'petal', 'star', 'heart', 'kiss'
            const types = ['petal', 'star', 'heart', 'kiss'];
            if (isBurst) {
                // Burst contains more hearts and kisses
                this.type = Math.random() > 0.45 ? 'heart' : (Math.random() > 0.5 ? 'kiss' : (Math.random() > 0.5 ? 'star' : 'petal'));
                this.x = burstX;
                this.y = burstY;
                
                // Explode radially
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 7 + 3;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.life = Math.random() * 80 + 40;
                this.maxLife = this.life;
            } else {
                // Normal ambient drifts
                this.type = Math.random() > 0.7 ? 'star' : (Math.random() > 0.4 ? 'heart' : (Math.random() > 0.3 ? 'kiss' : 'petal'));
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.vx = Math.random() * 1.5 - 0.75 + (this.type === 'petal' ? 0.4 : 0); // drift right slightly
                this.vy = Math.random() * 1.2 + 0.6; // down velocity
                this.alpha = Math.random() * 0.4 + 0.35;
                this.life = 9999;
                this.maxLife = 9999;
            }

            // LARGER particle sizes as requested by user
            this.size = Math.random() * 25 + 15; // Sizes range from 15px to 40px
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.02 - 0.01) * (this.type === 'petal' ? 2.2 : 1.2);
            
            // Colors
            if (this.type === 'heart') {
                const hues = [340, 350, 355, 10]; // Cute pinks/reds
                this.hue = hues[Math.floor(Math.random() * hues.length)];
                this.color = `hsla(${this.hue}, 95%, 75%, ${this.alpha})`;
            } else if (this.type === 'kiss') {
                // Kisses are soft ruby/lips red-pink
                this.color = `rgba(255, 75, 102, ${this.alpha})`;
            } else if (this.type === 'star') {
                this.color = `rgba(255, 223, 115, ${this.alpha})`; // gold star sparkle
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
                this.vy += 0.055; 
                this.vx *= 0.98;
                this.vy *= 0.98;
            } else {
                // Wind wiggle for floating petals
                if (this.type === 'petal' || this.type === 'kiss') {
                    this.vx += Math.sin(this.y * 0.008) * 0.012;
                }
                
                // Recycle normal particles that go off-screen
                if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
                    this.y = -40;
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
            
            // Add a soft glowing blur to stars and hearts
            if (this.type === 'star' || this.type === 'heart') {
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.type === 'star' ? 'rgba(255, 223, 115, 0.4)' : 'rgba(255, 94, 126, 0.4)';
            }
            
            if (this.type === 'heart') {
                // Heart shape
                ctx.beginPath();
                ctx.fillStyle = this.color;
                const size = this.size * 0.8;
                
                ctx.moveTo(0, size / 4);
                ctx.quadraticCurveTo(-size / 2, -size / 2, -size / 2, 0);
                ctx.quadraticCurveTo(-size / 2, size / 2, 0, size * 0.95);
                ctx.quadraticCurveTo(size / 2, size / 2, size / 2, 0);
                ctx.quadraticCurveTo(size / 2, -size / 2, 0, size / 4);
                ctx.fill();
                
            } else if (this.type === 'kiss') {
                // Draw Lips / Kiss Shape
                ctx.beginPath();
                ctx.fillStyle = this.color;
                const s = this.size * 0.75;
                
                // Draw top lip
                ctx.moveTo(-s / 2, 0);
                ctx.bezierCurveTo(-s / 4, -s / 3, -s / 8, -s / 3, 0, -s / 12);
                ctx.bezierCurveTo(s / 8, -s / 3, s / 4, -s / 3, s / 2, 0);
                // Draw bottom lip
                ctx.bezierCurveTo(s / 3, s / 3, -s / 3, s / 3, -s / 2, 0);
                ctx.closePath();
                ctx.fill();
                
            } else if (this.type === 'star') {
                // Star shape
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
                // Soft rose petal shape
                ctx.beginPath();
                ctx.fillStyle = this.color;
                const w = this.size;
                const h = this.size * 1.4;
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
            return type === 'heart' ? 1.0 : 0.85;
        }
        if (id === 'scene-2') {
            return type === 'heart' ? 0.5 : 0.65;
        }
        return type === 'heart' ? 0.35 : 0.6;
    }

    // Initialize ambient particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle(false));
    }

    // Create explosion burst of hearts/stars/kisses
    function createHeartBurst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(true, x, y));
        }
    }

    // ==========================================================================
    // INTERACTIVE CURSOR TRAIL (COLOURED HEARTS)
    // ==========================================================================
    const cursorTrail = [];
    const maxTrailLength = 15;
    let lastMouseMove = 0;
    
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseMove < 35) return; // limit to ~30fps for trail rendering
        lastMouseMove = now;
        
        cursorTrail.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 10 + 8, // slightly larger heart trails
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
                size: Math.random() * 10 + 8,
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
            point.opacity -= 0.04;
            point.y -= 1.4;
            
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

    // Spawn an extra floating ambient heart/kiss from the bottom of the screen continuously
    setInterval(() => {
        const activeScene = document.querySelector('.scene.active');
        if (activeScene && (activeScene.id === 'scene-3' || activeScene.id === 'scene-4')) {
            const x = Math.random() * width;
            const y = height + 20;
            const p = new Particle(true, x, y);
            p.isBurst = true;
            p.vy = -Math.random() * 2.2 - 0.6; // upward velocity
            p.vx = Math.random() * 1.5 - 0.75;
            p.life = 250;
            p.maxLife = 250;
            particles.push(p);
        }
    }, 380);

});
