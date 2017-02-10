import './assets/styles/index.css';
import './assets/styles/header.css';
import './assets/styles/work.css';
import './assets/styles/about.css';

(function () {
  const list = document.querySelector('header .wrapper > ul');
  const wrapper = document.querySelector('header .wrapper');
  const navBar = document.querySelector('header .nav-bar');
  const sidebar = navBar.querySelector('.side-bar');
  const navList = navBar.querySelectorAll('.nav-list > li');
  const workImgListItems = document.querySelectorAll('.work .desc-list li');
  const workItemSliders = document.querySelectorAll('.work .work-item .slider');
  const workItemCovers = document.querySelectorAll('.work .work-item .work-item-cover');

  sidebar.addEventListener('click', toggleSidebar);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', addAnimations);
  navList.forEach((item) => item.addEventListener('click', slowScroll));
  workImgListItems.forEach((item) => item.addEventListener('click', tranformList));
  workItemSliders.forEach((item) => item.addEventListener('mouseover' , mousEntered));
  workItemCovers.forEach((item) => item.addEventListener('mouseleave', mouseLeft));
 
  window.onload = function () {
    document.querySelector("header .preloader").style.display = "none";
    animateGreeting();
  }

  function addAnimations() {
    let container = document.querySelector('section.work > .container');
    let rectOffset = container.getBoundingClientRect();
    let clientHeight = container.clientHeight; 
    
    if (rectOffset.top <= clientHeight / 1.5) {
      container.classList.contains('animate-items') ? null : container.classList.add('animate-items');
    }

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
    document.querySelector(sliderName).style['transform'] = `translateX(${degree}px)`;
    document.querySelector(sliderName).style['-webkit-transform'] = `translateX(${degree}px)`;
    this.classList.add('active');
  }

  function mousEntered () {
    this.parentNode.querySelector('.work-item-cover').style.display = 'block';
  }

  function mouseLeft () {
    this.style.display = 'none';
  }

  function slowScroll() {
    let to = document.getElementById(this.dataset.to).getBoundingClientRect().top;
    moveScroll(to, this.dataset.to);
  }

  function moveScroll (to, title) {
    let size;

    switch(title) {
      case 'work': size = 7; break;
      case 'about': size = 11; break;
      case 'contact': size = 15; break;
    }
    console.log('buuum', document.body.scrollHeight);
    if (window.scrollY <= to ) {
      setTimeout(function() {
        window.scrollTo(0, window.scrollY + size);
          moveScroll(to, title);
      }, 5);
    }
  }

})();
