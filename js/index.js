const hamburger = document.querySelector('header .hamburger');
const nav = document.querySelector('header nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    if (nav.classList.contains('active')) {
        setTimeout(() => {
            hamburger.classList.toggle('active');
        }, 100);
    } else hamburger.classList.toggle('active');
});
