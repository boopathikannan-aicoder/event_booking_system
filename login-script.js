document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const successOverlay = document.getElementById('successOverlay');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Handle Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!usernameInput.value || !passwordInput.value) {
            alert('Please fill in all fields');
            return;
        }

        // Show Loading State
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        // Simulate API Call delay
        setTimeout(() => {
            loginBtn.classList.remove('loading');

            // Show Success Animation
            successOverlay.classList.add('active');

            // Redirect to index.html after animation
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    });

    // Input Focus Effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Carousel Logic
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Auto-advance
    let slideTimer = setInterval(nextSlide, slideInterval);

    // Manual Navigation
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            clearInterval(slideTimer); // Reset timer on manual click
            showSlide(index);
            slideTimer = setInterval(nextSlide, slideInterval);
        });
    });
});
