
var slideshowIsRunning = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function center_images(focus_img) {
  var parentEl = focus_img.parentElement;

  var viewWidth = window.visualViewport.width;
  var selfWidth = focus_img.width;
  var targetOffset = (viewWidth - selfWidth) / 2;

  var transDelta = targetOffset - focus_img.offsetLeft;
  //console.log(transDelta);
  //console.log(parentEl);
  //console.log("translateX(" + transDelta + "px)");
  //console.log()
  parentEl.style.transform = "translateX(" + transDelta + "px)";

}

async function set_active_img_slide(targetElement) {
  //console.log(targetElement);
  var trans_dur_string = getComputedStyle(targetElement).getPropertyValue('--transition-duration-normal');
  var trans_dur = parseFloat(trans_dur_string) * 1000;

  var parentEl = targetElement.parentElement;
  var siblings = parentEl.getElementsByTagName("*");

  for (var i = 0; i < siblings.length; i++) {
    siblings[i].classList.remove("active-img-slide");
  }

  await sleep(trans_dur);

  center_images(targetElement);
  await sleep(trans_dur);
  targetElement.classList.add("active-img-slide");
}

async function waitForLoad(parentElementID, childTargetTagName, targQuantity = 1) {

  var pareIsLoaded = false;
  var pare = document.getElementById(parentElementID) || null;
  while (!pareIsLoaded) {
    //console.log("parent is not loaded");
    if (pare == null) {
      await sleep(1000);
    } else {
      pareIsLoaded = true;
    }
  }

  //console.log("parent is loaded");
  //console.log(pare.outerHTML);

  var isLoaded = false;
  while (!isLoaded) {
    //console.log("child is not loaded");
    var collection = pare.getElementsByTagName(childTargetTagName) || null;
    if (collection.length < (targQuantity)) {
      await sleep(100);
    } else {
      //await sleep(1000);
      isLoaded = true;
      break;
    }
  }

  for (var i = 0; i < collection.length; i++) {
    console.log(collection[i].offsetHeight);
  }
  //console.log("child is loaded");
  //console.log(collection);
  return isLoaded;
}

async function initSlideshow() {
  await waitForLoad("photo-slideshow", "img");
  if (waitForLoad("photo-slideshow", "img")) {
    var childcoll = document.getElementById("photo-slideshow").getElementsByTagName("img");
    for (var i = 0; i < childcoll.length; i++) {
      childcoll[i].onclick = function(click) {
        slideshowIsRunning = false;
        clickX = click.clientX;
        clickY = click.clientY;
        //console.log("window width / 2", window.visualViewport.width / 2, "clickX", clickX);
        if (!this.classList.contains("active-img-slide")) {
          set_active_img_slide(this);
        } else {
          var siblings = click.target.parentElement.getElementsByTagName("img");
          //console.log("length of siblings: ", siblings.length);
          var isSibNum = 0;
          for (var i = 0; i < siblings.length; i++) {
            if (siblings[i] == click.target) {
              isSibNum = i;
              break;
            }
          }
          if ((clickX - (window.visualViewport.width / 2)) < 0) {
            if (isSibNum > 0) {
              set_active_img_slide(siblings[isSibNum - 1]);
            } else {
              set_active_img_slide(siblings[siblings.length - 1]);
            }
          } else if ((clickX - (window.visualViewport.width / 2)) > 0) {
            if (isSibNum < (siblings.length - 1)) {
              set_active_img_slide(siblings[isSibNum + 1]);
            } else {
              set_active_img_slide(siblings[0]);
            }

          }
        }
      };
    }
    var targ = Math.floor(childcoll.length / 2);
    //console.log("Target number");
    //console.log("Target number: ", targ);
    //console.log("line 113");
    if (waitForLoad("photo-slideshow", "img", targ)) {
      //set_active_img_slide(childcoll[targ]);
      rotate_images(document.getElementById("photo-slideshow"));
    }
  }
}

//initSlideshow();


async function rotate_images(slideshowDiv) {
  slideshowIsRunning = true;


  var slides = slideshowDiv.getElementsByTagName("img");
  var initTransitionDuration = getComputedStyle(slideshowDiv).transitionDuration;
  //console.log(initTransitionDuration);
  var length = slides.length;
  var i = Math.floor(length / 2) - 1;

  for (var k = 0; k < length; k++) {
    slides[k].style.order = getComputedStyle(slides[k]).order;
  }

  iter = 0;

  for (var j = 0; j < 100; j++) {
    if (slideshowIsRunning) {
      i++;

      if (i >= length) {
        i = 0;
      }

      await set_active_img_slide(slides[i]);

      if (iter >= length) {
        iter = 0;
      }




      rect = slides[iter].getBoundingClientRect();
      if ((rect.x + rect.width) < ((-1) * rect.width)) {
        transString = slideshowDiv.style.transform;
        transFloat = parseFloat(transString.substring(transString.indexOf("(") + 1, transString.lastIndexOf(")")));

        slides[iter].style.order = parseInt(slides[iter].style.order) + 1;
        slideshowDiv.style.transitionDuration = "0s";
        slideshowDiv.style.transform = "translateX(" + (transFloat + rect.width) + "px)";
        await sleep(100);
        slideshowDiv.style.transitionDuration = initTransitionDuration;
        iter++;
      }

      await sleep(3000);
    }
  }
}
/*
if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', rotate_images(document.getElementById("photo-slideshow")));
  console.log("option1");
} else {  // `DOMContentLoaded` has already fired
  rotate_images(document.getElementById("photo-slideshow"));
  console.log("option2");
}
*/

initSlideshow();
