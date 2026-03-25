/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener('DOMContentLoaded', function () {
    initializeMenu();
    initializeSliders();
    initializeModal();
});

/* ==========================================
   MENU
========================================== */

function initializeMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.header')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

/* ==========================================
   SLIDER
========================================== */

const sliders = {};
const ytPlayers = {};
let currentVideoSlider = null;

function initializeSliders() {
    createSlider('sliderPrincipal', {
        prevBtn: 'sliderPrincipalPrev',
        nextBtn: 'sliderPrincipalNext',
        caption: 'sliderPrincipalCaption'
    });

    createSlider('sliderSuperiores', {
        prevBtn: 'sliderSuperioresPrev',
        nextBtn: 'sliderSuperioresNext',
        caption: 'sliderSupioresCaption'
    });
}

function createSlider(sliderId, config) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');

    sliders[sliderId] = {
        currentIndex: 0,
        slides,
        captionEl: document.getElementById(config.caption),
        autoplayInterval: null
    };

    document.getElementById(config.prevBtn)?.addEventListener('click', () => changeSlide(sliderId, -1));
    document.getElementById(config.nextBtn)?.addEventListener('click', () => changeSlide(sliderId, 1));

    updateSlider(sliderId);
    startAutoplay(sliderId);
}

function changeSlide(sliderId, direction) {
    const slider = sliders[sliderId];

    slider.currentIndex =
        (slider.currentIndex + direction + slider.slides.length) % slider.slides.length;

    updateSlider(sliderId);
    resetAutoplay(sliderId);
}

function updateSlider(sliderId) {
    const slider = sliders[sliderId];
    if (!slider) return;

    const { slides, currentIndex, captionEl } = slider;

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });

    const currentSlide = slides[currentIndex];
    const img = currentSlide.querySelector('img');
    const iframe = currentSlide.querySelector('iframe');

    /* ===== LEGENDA ===== */
    if (captionEl) {
        if (img) captionEl.textContent = img.alt || '';
        else if (iframe) captionEl.textContent = iframe.title || 'Vídeo';
        else captionEl.textContent = '';
    }

    /* ===== PAUSA TODOS OS VÍDEOS ===== */
    slides.forEach(slide => {
        const frame = slide.querySelector('iframe');
        if (frame && ytPlayers[frame.id]) {
            ytPlayers[frame.id].pauseVideo();
        }
    });

    /* ===== SE FOR VÍDEO ===== */
    clearInterval(slider.autoplayInterval);

    if (iframe) {
        currentVideoSlider = sliderId;

        if (!ytPlayers[iframe.id]) {
            ytPlayers[iframe.id] = new YT.Player(iframe.id, {
                events: {
                    onStateChange: onPlayerStateChange
                }
            });
        }

        setTimeout(() => {
            ytPlayers[iframe.id].playVideo();
        }, 500);
    } else {
        startAutoplay(sliderId);
    }
}

/* ==========================================
   AUTOPLAY
========================================== */

function startAutoplay(sliderId) {
    const slider = sliders[sliderId];
    if (!slider) return;

    clearInterval(slider.autoplayInterval);

    slider.autoplayInterval = setInterval(() => {
        slider.currentIndex =
            (slider.currentIndex + 1) % slider.slides.length;

        updateSlider(sliderId);
    }, 5000);
}

function resetAutoplay(sliderId) {
    clearInterval(sliders[sliderId].autoplayInterval);
    startAutoplay(sliderId);
}

/* ==========================================
   YOUTUBE API
========================================== */

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        if (currentVideoSlider) {
            startAutoplay(currentVideoSlider);
        }
    }

    if (event.data === YT.PlayerState.PLAYING) {
        if (currentVideoSlider) {
            clearInterval(sliders[currentVideoSlider].autoplayInterval);
        }
    }
}

/* ==========================================
   MODAL
========================================== */

function initializeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    const closeBtn = document.getElementById('modalClose');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* ==========================================
   SCROLL
========================================== */

window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (!header) return;

    header.style.boxShadow =
        window.scrollY > 50
            ? '0 4px 12px rgba(0,0,0,0.15)'
            : '0 4px 6px rgba(0,0,0,0.1)';
});