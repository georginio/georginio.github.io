(function () {
  const list = document.querySelector('header .wrapper > ul');
  const wrapper = document.querySelector('header .wrapper');
  const navBar = document.querySelector('header .nav-bar');
  const sidebar = navBar.querySelector('.side-bar');
  
  sidebar.addEventListener('click', toggleSidebar);

  window.addEventListener('resize', () => {
    let width = document.body.clientWidth;

    if (navBar.classList.contains('open') && width > 480)
      navBar.classList.remove('open');
  });

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

  function toggleSidebar () {
    navBar.classList.toggle('open');
  }
})();
