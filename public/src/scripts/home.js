
let currentSlide = 0;
const slides = document.querySelector('.carrossel .slides');
const totalSlides = document.querySelectorAll('.carrossel .slide').length;
const dotsContainer = document.querySelector('.carrossel-dots');
let autoSlideInterval;

for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

function updateDots() {
    const dots = document.querySelectorAll('.carrossel-dots .dot');
    dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
    });
}

function moveSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
    resetAutoSlide();
}

function goToSlide(index) {
    currentSlide = index;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
    resetAutoSlide();
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => moveSlide(1), 3000);
}

autoSlideInterval = setInterval(() => moveSlide(1), 3000);
updateDots();