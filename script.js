// ======================================================
// --- 0. KHỞI TẠO GLOBAL FUNCTION CHO ANIMATION ---
// ======================================================
// Đặt hàm này ở ngoài cùng để load-components.js có thể gọi lại
window.initScrollAnimations = function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Tùy chọn: Nếu muốn animation chạy 1 lần rồi thôi thì bỏ comment dòng dưới
                // observer.unobserve(entry.target); 
            } else {
                // Nếu muốn cuộn lên cuộn xuống đều chạy lại animation thì giữ dòng này
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
    
    // Log để kiểm tra (có thể xóa sau này)
    // console.log(`Animation initialized for ${elements.length} elements.`);
};

// ======================================================
// --- MAIN LOGIC ---
// ======================================================
document.addEventListener('DOMContentLoaded', () => {

    // Gọi hàm animation ngay lập tức cho các phần tử có sẵn (VD: Hero Section)
    window.initScrollAnimations();

    // ======================================================
    // --- 1. LOGIC CHUNG & HEADER/PROGRESS BAR ---
    // ======================================================
    const header = document.querySelector('.main-header');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-navigation');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // Mobile Menu Toggle Logic
    if (mobileMenuToggle && headerNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            headerNav.classList.toggle('active');
            document.body.style.overflow = headerNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Cập nhật năm hiện tại (nếu load-components chưa xử lý footer)
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Theo dõi sự kiện cuộn trang
    window.addEventListener('scroll', () => {
        // Hiển thị header khi cuộn xuống
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
        }

        // Cập nhật thanh tiến trình
        if (progressBar) {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
    });

    // ======================================================
    // --- 2. LOGIC ANIMATION (ĐÃ CHUYỂN LÊN ĐẦU FILE) ---
    // ======================================================
    // (Đã được thay thế bởi window.initScrollAnimations ở trên)


    // ======================================================
    // --- 3. LOGIC CHO THANH SKILL BAR (PHIÊN BẢN HYBRID) ---
    // ======================================================

    const skillsGrid = document.querySelector('.skills-grid');

    function initializeSkillBars() {
        const skillLevels = document.querySelectorAll('.skill-level');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const level = element.getAttribute('data-level');
                if (entry.isIntersecting) {
                    element.style.width = level;
                } else {
                    element.style.width = '0%';
                }
            });
        }, { threshold: 0.5 });

        skillLevels.forEach(level => skillObserver.observe(level));
    }

    function fetchAndDisplayHybridSkills() {
        if (!skillsGrid) return;

        const skillsMap = new Map([
            ['Python', { name: 'Python', percentage: 60, icon: 'assets/icons/python.png' }],
            ['C', { name: 'C', percentage: 60, icon: 'assets/icons/default.png' }],
            ['C++', { name: 'C++', percentage: 60, icon: 'assets/icons/default.png' }],
            ['HTML', { name: 'HTML', percentage: 30, icon: 'assets/icons/html.png' }],
            ['CSS', { name: 'CSS', percentage: 30, icon: 'assets/icons/css.png' }],
            ['JavaScript', { name: 'JavaScript', percentage: 15, icon: 'assets/icons/javascript.png' }],
            ['SQL', { name: 'SQL', percentage: 30, icon: 'assets/icons/default.png' }],
        ]);

        const finalSkills = Array.from(skillsMap.values())
            .sort((a, b) => b.percentage - a.percentage);

        skillsGrid.innerHTML = ''; 

        finalSkills.forEach(skill => {
            const skillCardHTML = `
            <div class="skill-card glass-card animate-on-scroll">
                <div class="skill-header">
                    <div class="skill-info">
                        <img src="${skill.icon}" alt="${skill.name} Icon" class="skill-icon-header">
                        <span class="skill-name">${skill.name}</span>
                    </div>
                    <span class="skill-percentage">${skill.percentage}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-level" data-level="${skill.percentage}%"></div>
                </div>
            </div>
        `;
            skillsGrid.innerHTML += skillCardHTML;
        });

        // Kích hoạt animation cho các skill card mới tạo
        window.initScrollAnimations();
        initializeSkillBars();
    }

    fetchAndDisplayHybridSkills();


    // ======================================================
    // --- 4. LOGIC CHO MUSIC PLAYER ---
    // ======================================================
    const audio = document.getElementById('audio-source');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songCover = document.getElementById('song-cover');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');

    let currentSongIndex = 0;
    let isPlaying = false;

    // Kiểm tra biến playlist có tồn tại không (từ playlist.js)
    if (typeof playlist !== 'undefined' && playlist.length > 0) {
        function loadSong(song) {
            if (song) {
                if(songTitle) songTitle.textContent = song.title;
                if(songArtist) songArtist.textContent = song.artist;
                if(songCover) songCover.src = song.coverPath;
                if(audio) audio.src = song.audioPath;
            }
        }

        function playSong() {
            if(!audio) return;
            isPlaying = true;
            if(playPauseBtn) playPauseBtn.classList.replace('fa-play', 'fa-pause');
            audio.play();
        }

        function pauseSong() {
            if(!audio) return;
            isPlaying = false;
            if(playPauseBtn) playPauseBtn.classList.replace('fa-pause', 'fa-play');
            audio.pause();
        }

        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        }

        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(playlist[currentSongIndex]);
            playSong();
        }

        if (playPauseBtn) playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
        if (nextBtn) nextBtn.addEventListener('click', nextSong);
        if (prevBtn) prevBtn.addEventListener('click', prevSong);
        if (audio) audio.addEventListener('ended', nextSong);

        loadSong(playlist[currentSongIndex]);
    }


    // ======================================================
    // --- 5. LOGIC CHO ACTIVE NAV INDICATOR ---
    // ======================================================
    // Logic này có thể cần chạy lại sau khi Header được load
    // Vì vậy ta bọc nó vào hàm để load-components.js có thể gọi (nếu cần)
    window.highlightActiveMenu = function() {
        const navLinks = document.querySelectorAll('.main-nav a');
        const navIndicator = document.querySelector('.nav-indicator');
        const sections = document.querySelectorAll('main section');

        function moveIndicator(targetLink) {
            if (!navIndicator) return;
            if (!targetLink) {
                navIndicator.style.opacity = '0';
                return;
            }
            const linkRect = targetLink.getBoundingClientRect();
            const navRect = targetLink.parentElement.getBoundingClientRect();

            navIndicator.style.width = `${linkRect.width}px`;
            navIndicator.style.left = `${linkRect.left - navRect.left}px`;
            navIndicator.style.opacity = '1';

            navLinks.forEach(link => link.classList.remove('is-active'));
            targetLink.classList.add('is-active');
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => moveIndicator(e.currentTarget));
        });

        const navSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
                    moveIndicator(correspondingLink);
                }
            });
        }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

        sections.forEach(section => {
            navSectionObserver.observe(section);
        });
    };
    
    // Gọi lần đầu (cho các trang không dùng load-components hoặc đã có sẵn html)
    window.highlightActiveMenu();


    // Theme toggle logic removed - Dark mode only


    // ======================================================
    // --- 7. LOGIC CHO CERTIFICATE MODAL (IMAGE VIEWER WITH ZOOM) ---
    // ======================================================
    const pdfModal = document.getElementById('pdfModal');
    const certImage = document.getElementById('certImage');
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    const closeBtn = document.querySelector('.pdf-modal-close');
    const certButtons = document.querySelectorAll('.btn-pdf-modal');
    const zoomContainer = document.querySelector('.zoom-container');

    if (pdfModal && certImage && closeBtn) {
        certButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = btn.getAttribute('data-cert');
                const certTitle = btn.parentElement.querySelector('.certificate-title').textContent.replace('Chứng nhận: ', '');
                
                if (imgSrc) {
                    certImage.src = imgSrc;
                    if (pdfModalTitle) pdfModalTitle.textContent = certTitle;
                    pdfModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        const closeModal = () => {
            if (!pdfModal) return;
            pdfModal.classList.remove('active');
            setTimeout(() => {
                if (certImage) {
                    certImage.src = '';
                    certImage.style.transform = 'scale(1)'; // Reset zoom
                }
            }, 300);
            document.body.style.overflow = ''; // Restore scrolling
        };

        closeBtn.addEventListener('click', closeModal);

        // Vanilla JS Hover Zoom Logic
        if (zoomContainer && certImage) {
            zoomContainer.addEventListener('mousemove', (e) => {
                const rect = zoomContainer.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                
                const posX = (offsetX / rect.width) * 100;
                const posY = (offsetY / rect.height) * 100;
                
                certImage.style.transformOrigin = `${posX}% ${posY}%`;
                certImage.style.transform = 'scale(1.8)';
            });

            zoomContainer.addEventListener('mouseleave', () => {
                certImage.style.transform = 'scale(1)';
            });
        }

        // Close on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Close on clicking outside the container
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closeModal();
            }
        });
    }

    // ======================================================
    // --- 8. FIREFLIES HERO BACKGROUND (Interactive + Fixed) ---
    // ======================================================
    function initHeroInteractiveBackground() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let fireflies = [];
        const COUNT = 120; // increased count

        // Mouse state — tracked relative to canvas
        const mouse = { x: -9999, y: -9999, active: false };

        // Track mouse position relative to the canvas
        const heroSection = document.getElementById('hero');

        document.addEventListener('mousemove', (e) => {
            if (!heroSection) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });

        document.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -9999;
            mouse.y = -9999;
        });

        // Firefly colours: warm amber, yellow-green, soft white-gold
        const COLORS = [
            { r: 255, g: 220, b: 80  },  // amber-yellow
            { r: 180, g: 255, b: 100 },  // yellow-green
            { r: 255, g: 245, b: 150 },  // pale gold
            { r: 220, g: 255, b: 180 },  // soft lime
        ];

        class Firefly {
            constructor() {
                this.reset();
            }

            reset(randomY = false) {
                this.x  = Math.random() * canvas.width;
                // Always spawn at a fully random position so the canvas stays
                // evenly populated — spawning only at the bottom meant the top
                // half emptied out over time as fireflies drifted upward and died.
                this.y  = Math.random() * canvas.height;

                // Fully random direction with no upward bias — lets them roam
                // the entire canvas evenly instead of all drifting off the top.
                const speed = 0.25 + Math.random() * 0.45;
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;

                // Subtle wobble so they don't fly in straight lines
                this.wobbleSpeed  = 0.015 + Math.random() * 0.025;
                this.wobbleAmp    = 0.18  + Math.random() * 0.32;
                this.wobbleOffset = Math.random() * Math.PI * 2;

                // Pulse (glow) parameters
                this.pulseSpeed  = 0.02 + Math.random() * 0.03;
                this.pulseOffset = Math.random() * Math.PI * 2;

                // Size and colour
                this.baseRadius = 1.2 + Math.random() * 1.8;
                this.color      = COLORS[Math.floor(Math.random() * COLORS.length)];

                // Tail / trail
                this.trail      = [];
                this.maxTrail   = 8 + Math.floor(Math.random() * 10);

                // Lifetime fade-in / fade-out — increased lifespan
                this.age        = 0;
                this.lifespan   = 700 + Math.random() * 900;
                this.t          = 0; // internal time counter
            }

            update() {
                this.t   += 1;
                this.age += 1;

                // Wobble
                this.vx += Math.cos(this.t * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmp * 0.05;
                this.vy += Math.sin(this.t * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmp * 0.03;

                // --- Mouse interaction: gentle repulsion within radius ---
                const INTERACT_RADIUS = 120;
                const REPEL_STRENGTH  = 0.6;
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (mouse.active && dist < INTERACT_RADIUS && dist > 0) {
                    // Normalised direction away from cursor, stronger when closer
                    const force = (1 - dist / INTERACT_RADIUS) * REPEL_STRENGTH;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                }

                // Dampen so they don't accelerate forever
                this.vx *= 0.98;
                this.vy *= 0.98;

                this.x += this.vx;
                this.y += this.vy;

                // Push trail history
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.maxTrail) this.trail.shift();

                // Respawn if out of bounds or too old
                if (
                    this.x < -20 || this.x > canvas.width  + 20 ||
                    this.y < -20 || this.y > canvas.height + 20 ||
                    this.age > this.lifespan
                ) {
                    this.reset();
                }
            }

            draw() {
                const { r, g, b } = this.color;

                // Lifecycle opacity: fade in first 60 frames, fade out last 60
                const fadeFactor = Math.min(
                    Math.min(this.age, 60) / 60,
                    Math.min(this.lifespan - this.age, 60) / 60
                );

                // Pulse brightness
                const pulse = 0.55 + 0.45 * Math.sin(this.t * this.pulseSpeed + this.pulseOffset);
                const alpha = fadeFactor * pulse;

                // --- Draw trail ---
                if (this.trail.length > 1) {
                    for (let i = 1; i < this.trail.length; i++) {
                        const trailRatio  = i / this.trail.length;
                        const trailAlpha  = alpha * trailRatio * 0.35;
                        const trailRadius = this.baseRadius * trailRatio * 0.6;

                        ctx.beginPath();
                        ctx.arc(this.trail[i].x, this.trail[i].y, trailRadius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${r},${g},${b},${trailAlpha})`;
                        ctx.fill();
                    }
                }

                // --- Draw outer glow ---
                const glowRadius = this.baseRadius * (3.5 + pulse * 2.5);
                const grd = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, glowRadius
                );
                grd.addColorStop(0,   `rgba(${r},${g},${b},${alpha * 0.45})`);
                grd.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.15})`);
                grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);

                ctx.beginPath();
                ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // --- Draw bright core ---
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.baseRadius * pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,220,${alpha * 0.9})`;
                ctx.fill();
            }
        }

        function resize() {
            const hero = document.getElementById('hero');
            if (hero) {
                canvas.width  = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
                // Re-populate keeping existing fireflies' relative positions
                fireflies = [];
                for (let i = 0; i < COUNT; i++) {
                    fireflies.push(new Firefly());
                }
            }
        }

        // --- Fix: keep animation alive regardless of scroll position ---
        // Use a flag instead of relying on visibility; the canvas stays in DOM.
        let animFrameId = null;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fireflies.forEach(f => {
                f.update();
                f.draw();
            });
            animFrameId = requestAnimationFrame(animate);
        }

        // Use IntersectionObserver only to PAUSE when hero is fully off-screen
        // (performance), but resume immediately when it comes back.
        const visObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Re-sync canvas size in case it changed while off-screen
                    const hero = document.getElementById('hero');
                    if (hero) {
                        const needsResize =
                            canvas.width  !== hero.offsetWidth ||
                            canvas.height !== hero.offsetHeight;
                        if (needsResize) resize();
                    }
                    if (!animFrameId) animate();
                } else {
                    // Pause loop while hero is completely invisible
                    if (animFrameId) {
                        cancelAnimationFrame(animFrameId);
                        animFrameId = null;
                    }
                }
            });
        }, { threshold: 0 }); // threshold 0 = trigger as soon as any pixel is visible

        if (heroSection) visObserver.observe(heroSection);

        window.addEventListener('resize', resize);
        resize();   // sets canvas size + creates fireflies
        animate();  // start loop
    }

    // Initialise fireflies background
    initHeroInteractiveBackground();
});
