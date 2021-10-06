function toggleNav() {
  var navLinks = document.getElementById("nav-links");
  var togglebutton = document.getElementById("nav-toggle-button");

  togglebutton.classList.toggle("nav-toggle-visible");
  navLinks.classList.toggle("nav-links-hidden");
}

function windowResizeFunction() {
  //make sure states are in sync
  var navLinks = document.getElementById("nav-links");
  var togglebutton = document.getElementById("nav-toggle-button");

  navLinks.classList.add("nav-links-hidden");
  togglebutton.classList.remove("nav-toggle-visible");



  if ((window.innerWidth <= 801) && !(navLinks.className.includes("nav-links-hidden"))) {
    toggleNav();
  } else if ((window.innerWidth > 801) && ((navLinks.className.includes("nav-links-hidden")))) {
    toggleNav();
  }
}

windowResizeFunction();

window.onresize = windowResizeFunction;

function highlightCurrentPageInNav() {
  var keyword = document.body.getAttribute("nav-item");
  var menuItems = document.getElementById("nav-links").getElementsByTagName("a");

  for (var i = 0; i < menuItems.length; i++) {
    if (menuItems[i].getAttribute("nav-item") == keyword) {
      menuItems[i].classList.add("nav-current");
      break;
    }
  }
}

highlightCurrentPageInNav();
