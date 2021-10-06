function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

async function initGallery() {
    var gallery = document.getElementById("portfolio-gallery");
    await waitForLoad("portfolio-gallery", "img");
    if (waitForLoad("portfolio-gallery", "img")) {
      var gallery_imgs = gallery.getElementsByTagName("img");
    }

    var trans_dur_string = getComputedStyle(gallery_imgs[0]).getPropertyValue('--transition-duration-normal');
    var trans_dur = parseFloat(trans_dur_string) * 1000;

    for (let i = 0; i < gallery_imgs.length; i++) {
        currImg = gallery_imgs[i];
        currImg.onclick = async function() {
            var siblings = this.parentElement.getElementsByTagName("img");

            if (this.classList.contains("active-img")) {

                for (let j = 0; j < siblings.length; j++) {
                    siblings[j].classList.remove("inactive-img");
                }
                this.classList.remove("active-img");

            } else {

                for (let j = 0; j < siblings.length; j++) {
                    if (siblings[j] != this) {
                        siblings[j].classList.add("inactive-img");
                        siblings[j].classList.remove("active-img");
                    }
                }

                this.classList.remove("inactive-img");
                this.classList.add("active-img");

                await sleep(trans_dur);

                this.scrollIntoView({behavior: "smooth",
                                        block: "center",
                                        inline: "center"});

            }
        }
    }

    //gallery_imgs[0].click();

}

initGallery();
