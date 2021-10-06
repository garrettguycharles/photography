const parseHTMLNodes = Range.prototype.createContextualFragment.bind(document.createRange());

function stripOuterTags(string) {
  return string.substring(string.indexOf(">") + 1, string.lastIndexOf("<"));
}

function unwrap_inclusions() {
  elementsList = document.getElementsByTagName("*");
  for (var i = 0; i < elementsList.length; i++) {
    currElement = elementsList[i];
    if (currElement.getAttribute("to-remove")) {
      currElement.outerHTML = currElement.innerHTML;
    }

  }


}

function include_externals() {
  var z, i, elmnt, file, xhttp, bodyEl, respText;
  bodyEl = document.getElementsByTagName("body")[0];
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain attribute:*/
    file = elmnt.getAttribute("include-src");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            respText = this.responseText;

            if (respText.includes("</script>") && (elmnt.getAttribute("noappend") != true)) {
              bodyEl.appendChild(parseHTMLNodes(respText));
            } else {
              if (elmnt.nextElementSibling === undefined) {
                elmnt.parentElement.appendChild(parseHTMLNodes(respText));
              } else {
                //console.log("Inserting before: ");
                //console.log(elmnt.nextElementSibling);
                elmnt.parentElement.insertBefore(parseHTMLNodes(respText), elmnt.nextElementSibling);
              }
            }
          }
          else if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.remove();
          //elmnt.setAttribute("to-remove", true);
          include_externals();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
  //unwrap_inclusions();  //  no longer necessary.
}

include_externals();
