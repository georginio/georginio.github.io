(function () {
  const list = document.querySelector('header ul');
  const wrapper = document.querySelector('header .wrapper');
  
  setTimeout(() => {
    list.classList.add('move');
    wrapper.classList.add('move');
  }, 400);
})();