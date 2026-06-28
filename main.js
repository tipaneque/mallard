document.getElementById('year').textContent = new Date().getFullYear();
const nav = document.getElementById('main-nav');
const toggle = document.getElementById('nav-toggle');
toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#nav-links a, #nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    });
});

// ── SLIDER
document.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide:not(.clone)');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentIndex = 0;
  let intervalId = null;
  const totalSlides = slides.length;
  let isTransitioning = false;

  // Criar dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  // Posicionar no primeiro slide real
  sliderTrack.style.transform = `translateX(0)`;

  function goToSlide(index, instant = false) {
    if (isTransitioning && !instant) return;
    isTransitioning = true;

    currentIndex = index;
    
    // Atualizar dots
    const activeDotIndex = index % totalSlides;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });

    // Mover para o slide
    const offset = -index * 100;
    sliderTrack.style.transition = instant ? 'none' : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    sliderTrack.style.transform = `translateX(${offset}%)`;

    // Resetar transição após animação
    clearTimeout(sliderTrack._resetTimeout);
    sliderTrack._resetTimeout = setTimeout(() => {
      isTransitioning = false;
      
      // Se chegou ao clone (último slide), voltar instantaneamente ao primeiro
      if (index >= totalSlides) {
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = `translateX(0)`;
        currentIndex = 0;
        // Forçar reflow
        void sliderTrack.offsetHeight;
        sliderTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    }, 850);
  }

  function nextSlide() {
    if (isTransitioning) return;
    const next = currentIndex + 1;
    if (next > totalSlides) {
      // Isso não deve acontecer, mas segurança
      goToSlide(0);
    } else {
      goToSlide(next);
    }
  }

  function startSlider() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 2000);
  }

  function stopSlider() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Pausar ao passar o mouse
  const sliderContainer = document.querySelector('.slider-container');
  sliderContainer.addEventListener('mouseenter', stopSlider);
  sliderContainer.addEventListener('mouseleave', startSlider);

  // Touch suporte para mobile
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopSlider();
  }, { passive: true });

  sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        // Voltar um slide
        if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
        }
      }
    }
    startSlider();
  }, { passive: true });

  // Iniciar slider
  startSlider();
});