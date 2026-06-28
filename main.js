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