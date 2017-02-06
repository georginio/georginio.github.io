import './assets/styles/index.css';
import './assets/styles/header.css';
import './assets/styles/work.css';

(function () {
  const list = document.querySelector('header .wrapper > ul');
  const wrapper = document.querySelector('header .wrapper');
  const navBar = document.querySelector('header .nav-bar');
  const sidebar = navBar.querySelector('.side-bar');
  const workItem = document.querySelectorAll('.work .desc-list li');

  sidebar.addEventListener('click', toggleSidebar);
  window.addEventListener('resize', handleResize);
  workItem.forEach((item) => item.addEventListener('click', tranformList));
  
  window.onload = function () {
    // setTimeout(() => {
      document.querySelector("header .preloader").style.display = "none";
    // }, 2000);
    animateGreeting();
  }

  function animateGreeting() {
    setTimeout(() => {
      list.classList.add('move');
      wrapper.classList.add('move');
    }, 400);
  }

  function handleResize() {
    let width = document.body.clientWidth;

    if (navBar.classList.contains('open') && width > 480)
      navBar.classList.remove('open');
  }

  function toggleSidebar () {
    navBar.classList.toggle('open');
  }

  function tranformList () {
    let siblings = [...this.parentNode.children];
    let sliderName = `.${this.dataset.name}-slider`;
    let index = parseInt(this.dataset.index);
    let width = 440;
    let degree = -(index * width); 

    siblings.forEach((item) => item.classList.contains('active') && item.classList.remove('active'));
    document.querySelector(sliderName).style.transform = `translateX(${degree}px)`;
    this.classList.add('active');
  }
})();
