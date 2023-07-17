let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.barra-menu');

menu.addEventListener('click', () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
})