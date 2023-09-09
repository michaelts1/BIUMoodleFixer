// ==UserScript==
// @name        BIU Moodle Fixer
// @namespace   Violentmonkey Scripts
// @match       https://lemida.biu.ac.il/*
// @grant       GM_addStyle
// @version     1.0
// @author      Michael Tsaban
// @description Partially fixes the new Moodle design.
// ==/UserScript==
  
"use strict";
(() => {
  // src/options.ts
  /*!
   *
   *    ███████╗███████╗████████╗████████╗██╗███╗   ██╗ ██████╗ ███████╗
   *    ██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝██║████╗  ██║██╔════╝ ██╔════╝
   *    ███████╗█████╗     ██║      ██║   ██║██╔██╗ ██║██║  ███╗███████╗
   *    ╚════██║██╔══╝     ██║      ██║   ██║██║╚██╗██║██║   ██║╚════██║
   *    ███████║███████╗   ██║      ██║   ██║██║ ╚████║╚██████╔╝███████║
   *    ╚══════╝╚══════╝   ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
   *
   * Feel free to change these the boolean values below to turn on/off components of this userscript :)
   *
   */
  var options = {
    /** Course List Revamp: Improves the course list in the left sidebar */
    courseListRevamp: true,
    /** Homepage Revamp: Improves the layout of the home page, and makes the login button open in the same tab */
    homepageRevamp: true,
    /** Padding-Margin: Various fixes for improving space utilization */
    paddingMargin: true,
    /** Replaces the new, monotone icons with the old icons and other colorful icons */
    replaceBadIcons: true
  };
  /*!
   *
   *
   * You should only touch the code below if you understand what you are doing :)
   *
   *
   */

  // src/utils.ts
  var $m = document.querySelectorAll.bind(document);
  var log = (...args) => {
    console.log(`[BIU Moodle Fixer @ ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]:`, ...args);
  };

  // src/style/courseListRevamp.scss
  var courseListRevamp_default = `@charset "UTF-8";
/*
	Helper classes for courseListRevamp
*/
.text-overflow-ellipsis {
  overflow: hidden;
  white-space: pre;
  text-overflow: "\u2026 ";
  /* Also add a space afterwards */
}

/*
	Other rules
*/
/* LIs containing the links to the courses */
.block-fcl__list__item--course {
  margin-right: 10px !important;
  padding: 5px 10px 5px 0 !important;
  /* A custom class that is being applied by \`paddingMargin\` (if its enabled) */
  /* The link to a course */
  /* Usually holds the course number in the link */
}
.block-fcl__list__item--course.biu-fixer-padding-margin-on {
  padding: 3px 5px 3px 0 !important;
}
.block-fcl__list__item--course:not(:first-of-type) {
  border-top: 1px solid #aaa !important;
}
.block-fcl__list__item--course .block-fcl__list__link {
  display: grid;
  /* Grid: 24px for icon, min-content for course number and the rest for the course name */
  grid-template: "a b c" 100%/24px auto min-content;
}
.block-fcl__list__item--course .block-fcl__list__link::after {
  content: none !important;
}`;

  // src/courseListRevamp.ts
  function courseListRevamp() {
    const courseLinks = $m(".block-fcl__list__item--course a");
    for (const courseLink of courseLinks) {
      const courseTextNode = courseLink.childNodes[2];
      const spanCourseName = document.createElement("span");
      spanCourseName.classList.add("text-overflow-ellipsis");
      spanCourseName.textContent = (courseTextNode.textContent ?? "").replace(/[A-z].*/, " ").trim();
      const spanCourseNumber = document.createElement("span");
      spanCourseNumber.textContent = courseLink.title.substring(2) ?? "0";
      courseLink.replaceChild(spanCourseName, courseTextNode);
      courseLink.appendChild(spanCourseNumber);
    }
    GM_addStyle(courseListRevamp_default);
    log("Course List Revamp applied");
  }

  // src/style/homepageRevamp.scss
  var homepageRevamp_default = `/* The container for the front page cover image */
.frontpage #branding {
  height: 360px;
  /* A button in the header banner */
  /* The container for the buttons in the header banner */
}
.frontpage #branding h1 {
  display: none !important;
}
.frontpage #branding #logoimg {
  background-position: 35%;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 1.25rem;
}
.frontpage #branding .loginbtn {
  margin: auto 0;
  padding-bottom: 0px;
}
.frontpage #branding .card {
  min-height: 3rem !important;
}
.frontpage #branding .row {
  margin-top: -1.5rem;
}

/* The "Welcome <student name>" header */
#page-header h2 {
  height: initial !important;
  top: 17rem !important;
}

/* Part of the container for the front page cover image */
#region-main #section-1 {
  padding: 0 1rem !important;
}
#region-main #section-1 .my-3 {
  margin-bottom: 0 !important;
}

/* The container for the course boxes */
#frontpage-course-list .container-fluid {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  white-space: nowrap;
  /* A course box */
  /* List of teachers inside a course box */
}
#frontpage-course-list .container-fluid .col-md-4 {
  min-width: 15rem !important;
}
@media (550px <= width < 960px) {
  #frontpage-course-list .container-fluid .col-md-4 {
    flex-basis: 50% !important;
    max-width: 50% !important;
  }
}
@media (960px <= width) {
  #frontpage-course-list .container-fluid .col-md-4 {
    flex-basis: 25% !important;
    max-width: 25% !important;
  }
}
#frontpage-course-list .container-fluid .teacherscourseview {
  padding-right: 1.5rem;
}
#frontpage-course-list .container-fluid .teacherscourseview li {
  text-align: justify;
  white-space: break-spaces;
}`;

  // src/homepageRevamp.ts
  function loggedInRevamp() {
    const logoImg = document.querySelector("#logoimg");
    logoImg.classList.add("logged-in");
    const courseBoxesContainer = document.querySelector("#frontpage-course-list .container-fluid");
    const courseBoxes = $m(".category-course-list-all .col-md-4");
    courseBoxesContainer.replaceChildren(...courseBoxes);
    $m(".category-course-list-all .container-fluid:not(:nth-child(1 of .container-fluid))").forEach((el) => el.remove());
    for (const courseBox of courseBoxes) {
      const teachers = Array.from(courseBox.querySelectorAll(".teacherscourseview li")).map((teacherItem) => (teacherItem.textContent?.match(/(?<=מרצה: ).*/) ?? [""])[0]);
      const teachersListLi = document.createElement("li");
      const teacherListPrefix = teachers.length <= 1 ? "\u05DE\u05E8\u05E6\u05D4: " : "\u05DE\u05E8\u05E6\u05D9\u05DD: ";
      teachersListLi.textContent = teacherListPrefix + teachers.join(", ");
      courseBox.querySelector(".teacherscourseview")?.replaceChildren(teachersListLi);
    }
    GM_addStyle(homepageRevamp_default);
  }
  function homepageRevamp() {
    const loginLink = document.querySelector('.loginbtn a[href*="login.php"]');
    loginLink.removeAttribute("target");
    if (document.querySelector("#user-menu-toggle"))
      loggedInRevamp();
    log("Homepage Revamp applied");
  }

  // src/style/paddingMargin.scss
  var paddingMargin_default = `/* List of courses in each semester */
.block-fcl__list.collapsible {
  padding-top: 2px !important;
}

/* left-side-panel */
.drawer.drawer-right {
  max-width: 330px !important;
  width: 330px !important;
}

/* Courses list */
.block_filtered_course_list .card-body {
  padding: 5px 10px 0 0 !important;
}

/* Fix egregious margins for paragraphs */
p {
  margin: 0 0 5px 0 !important;
}

/* The container of a forum post */
.forumpost {
  padding: 0 !important;
  /* Header of a forum post. 'header.header' is to get a higher specificity than the built-in CSS */
  /* Padding to the right of a forum post */
  /* 'Reply' and 'direct link' buttons */
}
.forumpost header.header {
  margin-bottom: 0px !important;
  padding: 5px !important;
}
.forumpost header.header .mb-3 {
  margin-bottom: 0 !important;
}
.forumpost .body-content-container .author-groups-container {
  width: 20px !important;
}
.forumpost .post-actions a {
  padding: 0 0 2px 15px !important;
}

/* An empty toolbar at the top of the screen */
.headerbuttons {
  display: none !important;
}

/* The header of a sidebar. Contains only the 'close' button */
.drawerheader {
  height: 30px !important;
  padding-top: 5px !important;
}

/* The content of a sidebar */
.drawercontent {
  height: calc(100% - 30px) !important;
}

#course-index {
  /* A sublist item in the right-side-bar */
  /* A sublist title in the right-side-bar */
  /* A sublist container in the right-side-bar */
}
#course-index .courseindex-item-content .courseindex-item {
  padding: 1px 0 !important;
}
#course-index .courseindex-section-title .courseindex-item {
  padding: 3px 2px !important;
}
#course-index .courseindex-section {
  margin-bottom: 5px !important;
}

/* The container of an item in a 'course activity' list */
.activity-wrapper {
  padding: 0 !important;
}

/* An item in a 'course activity' list */
.activity-item {
  padding: 5px !important;
}

/*
	Margins fix: top header can hide content
*/
nav.navbar.fixed-top {
  position: sticky !important;
}

#page,
#topofscroll,
#learnrpage {
  margin-top: 0 !important;
}

/* '#topofscroll' is to get a higher specificity than the built-in CSS */
#topofscroll #learnrpage {
  padding-top: 2px !important;
}

/*
	Homepage tweaks
*/
/* A course box on the homepage */
#frontpage-course-list .container-fluid .col-md-4 {
  padding: 0 10px !important;
}
#frontpage-course-list .container-fluid .col-md-4 .class-box {
  height: 125px !important;
  margin-bottom: 1.25rem !important;
  padding-right: 0 !important;
}
#frontpage-course-list .container-fluid .col-md-4 .course-title {
  display: inline-block;
}`;

  // src/paddingMargin.ts
  var PADDING_MARGIN_CLASSNAME = "biu-fixer-padding-margin-on";
  function paddingMargin() {
    $m(".block-fcl__list__item--course").forEach((el) => el.classList.add(PADDING_MARGIN_CLASSNAME));
    GM_addStyle(paddingMargin_default);
    log("PaddingMargin applied");
  }

  // old icons - low res/archive-24.png
  var archive_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEsElEQVR4AYWTA7DEShaGv046mXvH11rbtl1Y21bZXNvFLdfatm3z2fZ7V6NMku5zNpWuSmV9Ut+cZHDw/z1GVQHwXp5QcbsktcUH3vy+ldtfdctn7A53x4si91le4nYk2bjn5u/v//T7/Q4hAdD2CyGLYhMbX5Yk9jsARkRQ1f35PL9Arell1045+cpV3HTJESfLBaezJf42ykNe+0BudvMDsupZlQol1Fa0BhRFRTGRcetrw3tGkTnHGmMA0qi6FtdMWXz5Sjo3OkbdFbzzlHcW7vny+7Czs1MVz/m/YUBErfd+xZgIe+7555KspPTdgPmXrmQ8s9C3mLnhptvNuefz7svO9jbOe0xiUDXgpQLCzBAImwRowj7+wY/l9re4/dZ7n/aOZDi1lP0Y6w3Xb8242ZNuz+Zog+w0I79pgXpFRbD9DvEgQXwtL8ZGmNigEoq3O9hPvODDJHHyyNm1c7TTCZMPT+nfcp1htsLk7BuRRFn+5QQyxZdCcrseZi9Bc0VUcScFg7tuYEdpPQAKGsBu9MeUzpmjyYIid0zvUnDw0FuwYUfMrpygxw5BEWuQHohEuBsX6E3gRYlWY+K1hOJwiV1LUaeE0Bqbu5KidExmGd27dLjfC+/NoOhyesYN5H88wTiDV6kn9RUigq9RXOFZvVWf9FY9vDYe0I5IDJTiMbcz3Ptl92G7MrQoSkQU54VCfEWVvf8POJwKQmisSqDtwYVXX4UdWHnoqx/Mzu4OZe4Q57HjDv37blAcFyhB6xrRsIlKbXLcsyxPlnQ3es0G4aLGnrVxNne53Z1+tr+3R1bkhNMAYqEYKWUpiAFtNQjNQOrvCabwSCgeaFw22Pd+8J2o6uFkkpWoJqiBGBbXzzn59Y1QghNBNOjuQ66Q2oP+rYZsPmIbEWk1oAbA+nCWAaVOhOm8k7qwAh6p0DqLavNcIogFYgh1wnbtDjakljlqag+SYUr/juPaAzFaTx0kEsK91EXjrmVxnNHf7LdqtI4pIRrtjGptXrRqWb3bAK7PUEOjsYiGHMBEBtf2QJSmfHsDUJrmsWFy3YRrf34NPhP8v/4HQiPKwjG61YibP3q/kaiCdrQlAm2mw+Ue5xWNDaLUk4kxqIlQlbBVbGqJopWYqkGznTGGNE1IbNxqEDbAEAxORh1W93pkh0tiA0YEVDGhWy1l6iLK0jM7XDDcGgBKkqbceMMNN1xz9aXXdToJFpRGniADcScmnxVsP3ibMnPNVkrbg/CbIi8YV4Ps32GHOE24/PIrZ699zctf8Le//fkaABvHMWXpGv2kVHo7fXbvSdWkZHVMq6C27wHDdDolj3NW+l3OP+/C01e/6iXPOvusM37ceHD99Tewvb0F2sgEonR3e3RpF28hIWMMdhJRFgVXXH7l4rWvedlzq+I/ohXRXe5yZz73uc8zGAxIkrQiwVbEJiYiEIcc0PZ9RCdd4eqrrj59+cte9NQzz/jb9/mXMADj8Xjz05/+/Lf29g/uUFZ6qapRxWgwxoTNQMJzk42JosPDQ/eWt7z+LWf8/a9fA3pACcyBGbA0oQm2mrxXsaaqMWCBGIgA06IdCuC9L6pYACngQgOy0IT8H/jMwIsw1vY+AAAAAElFTkSuQmCC";

  // old icons - low res/audio-24.png
  var audio_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFM0lEQVR4AYWUA5T7ShjFf5NM0t12bT/btm3btm3btm3btm127d02bTDzcto5J8//r+fmC+/97p2kQmsNQBSpNaMomt11Hf+8k4+umHvsvU07Wxrqpjw/mp7Kkct0OFVzL/vO6tvs+bZWkQOg/7opdaWRjrR/dhz5JIBQShGLdORyxW+Rqcx034+MPnEe09nvmfB8RkYnKLQtyIr7nEV3Tzf56Wm0JoY23HEvATQarTTCEmFDfc1CliW+lEIIANdyK92p7HeMPXI2Tm6ATCZNGBTJz7EkS+94Mq2tbTF5jhmWAKW0jNOoEMJCfvXNtzipNJkox8ij51AdjGOlqyEXT96+CAttcQwtLS34xYKZ+H+mT47BlFxz+cWZo6ez+azNFnOq/BF0dTWR7zFYPSezbHRYiTwoFsGQG2owRJZ0CIMgEYqRKIC8be9VcS2xUnEsi51y0RPjjDXMS+fGh8fkbSVyjU7IEwcopRj66Wsau2ZL1kWbewys1oZaqjKVYsoLGRsbJ5uZrUQeZ07oF+Gf5CXIVCXF+Pp3d5/K2JevY7kVSURoMLA8PyJfjBgenWCieQHm2voEWs3kmFwtW2K7aTQma2Hz3ZtPIoVmljV24bunrifIT4EQiQtTllJQiMlU18IsutPJ5cx9Q65BVmQY6v2Zb567najoYckUllPB2Kcv8eMTV9O+9IZ4opK+D57DclKYqBKBdz7+im96J9VKe55KW1t76W2xpYOVyiBifP/uC3x1w2FMvHwdOvD44f2XGPryTebZ4gh+/+I9vIGfaV18XX5+93l0pErkSichyW/rFmau2WZ5ub2jvZSpJR2y33zE+FevUcxPM/H5S6R0SOCkUQi0N8m3L93GckfditsxL72fvkr9LAvx5dN3EHjTaMsuOyhBIC+55gbiEyOTk16AVk6oJdlX7iD87jWUXYFtueRDgVIBYeyua7E1+O7F+/CGs6TbZ2M0+zO1861E3lf4hRxOurbMTblkZGyBxjQsS5IvhkTCR1maMAJtU7KuwhAvUFiOi1co4GAThREFPwDMIqtEwcKUWRyECpl9vb2Yd6ezmHmdvYhkmqnJSbxihGW7fPPWc1TWNpGqa+WXz96nrnsOJoZ6Uar0QsQ9MgOXIRMBTekXBaSbu8m0zUqLZdMw3/K8feNp9H/zMb4fRzT7fMyx8FJ8/d5rjP/+AzMvviov3H099R09pW+jkJsGSBYZU0lEoMMAHfgl0Zq2mVnxwIsY/PYj3DjfTFMVkYaXTjuIxdfdmtBy+ejZB9h4v+OIIjN9Un92UN6UmzaAoFhAuhV0LbISQcErf4BCsO7ex9I881w8dMXpNDQ2MfOiK+AXvHLMQuC6Do60SQT4+79iIhTnShjmE2GlaJ1tfibHR2Nnn7DhPseawRSO6zI0ODjYm/2pP5VyEGEYorWeeXwi/62KlPNnB8RQGtPNGimdXEfg5afJVFWRSrkgbH799bfpvfbYeeOPP/7gBQDLtu1k2r9BmfPKHCfkyblIC/r7+5FOip9++nli112228SQA2ANDAwipQ1JPPDXiMz5f0cYBthS8vvvv+f32nPnrb74/NPnSQpr3nnn4e6776G6uhrHcWM4yBiOI2M4ZcjSuTJkGU6pS9LpDL3Z3olddt5+o88+/fgZ/lYCoK6urumOO+55vL2jc84gCEKttdAaYdyIsgNQxp3pCGFZIyMj4cknH3fyp5989DCQAQIgB0wDBWFEZDxpJkZ9TGoDErABCxAJ/lIaIIoiP6484AKhEfCMSPEPEWuWOqe8/tYAAAAASUVORK5CYII=";

  // old icons - low res/avi-24.png
  var avi_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFIUlEQVR4AYWUA7QjXRaFv1u5FT3mmb9t27Zt2/7/jG3b9szC2Lbb3Wm704/puC7mrkperRqfWrtce5+zT50rrbUAaG3Oc9hHJmXzPfl8+sxC4arJvr7euXpdz1YqTA0M+un9D/j9CY888juM8bEWC8R24dFYpC8T631ffgcgFHAYq1Yb37DJZEejsI77KlXk9DTljRsJZmYoHnU0+z77ApN77HZ4rVS+z1qwkYA7hgCL24xFeEL15boP9zyxTAohAJKk08nG+nXID76PzPZt0NNDJggon34GB+RfwdDICLVShf8bAoyxUmudFsJDLlu5EpnJkKs28T/0fnpL8yG5mZtj7XHH0/fYkwwODRHU61iAf80egV3YomqIQl584onsPzk5+Lljj/V7nR3kcphmk5X77EvmnvtDcuXIAQQCEh5CSgygrUOzgaci4hBxBfmD667D1XJ6ulBA+T6eNaw86BBS9z/M8NgoWmlENouq1VDVGkG1QnXLZvTatag//wlR3sXAy18N3d1YpUMhLJGY7BsextRqYle1ilaKTSeeROb+h+jp6mR+8SJUsUhtZxEByNUF9He/gzj5FHJ334cNAkof/gDa9S5x5NHYQGGj7G0IWQkCVKPB/OwsDffh6Esvx3cfzHz8W3Qdezzp73+X5O9+i3GEyQceoT4yRvkD72XW9cheeTX1iy8l7arwIOpBPGRDCOpOZMuxx3Fg/hXO835K69bS/fvfIY44CvN8ntoH30vi058IK2nutz/pp54l43pjnJh/4ikYKVHVamQLxHrw51/8gkRnpznmPR9gaHSUoFxHjE9QVwrzxtcxf/gRSEeafPgxjBAkMhmC0TEqtRp6w3pws5IaGKBrn/2wqmVRayOE/NPuu3PgHnv8bHRsjHqjCQJIZ5gTHrlcjonb72DzosWUXpFn8Nrr8C66hFWvfgXZzZuYeMOb2bRsEXr1ag561/vRQRAJtMoRyLd97nNYa6dLpVqANT54WBXQzGaRDz5M0fOZ+8THGDjr7LAHBTcrwlk4/NZ3UhoeYdPzzzDp5sUKiOYgZpLU2rQbYyP/sFBzAqu++Hma09PI/j621GrUn3kSu3MH4oADWfKVL9IoFrEdWeodndg2j3GIK0jasbC+CCGwnkewZQtJ53FCSprWopYtw2qNEoJAu2PQRFuol8uogw4FIaIKiBpt4wKRd+GxqRXCGAKlUFqjjAkRtM+1sa17QYDWGtPO3hpLRB+rIGYR4bGhVNg0lUhEAoGDjgQcrCWA8Bxr/20O/s2i8CXReqlWruDtKqG8RJS9jo5tAA0gCP8eMMZC2+Zk0seXiZjAQgXGIhB0HnoY3sCAE/DCTE2LNCTRtK6tteGAde+1N0ZrwOInk+wsFotbt6zbnkr5SIj+oKjERCLB8e//MK2iYs9oeRxflpVWJDxIC0O6u9vN3aby/ffdedPf/vbnrQDSkREEKvpogVS1hyYuEMG0GioElHeVqdcq7O2W90Jh9fy999x2zdIli34c9WDHjiJDQ4NgYzbFSf898whYgTE6/JU3b95cvf++O6535D8iFvKggw7kfe97P1deeR2VajVOEBfBtI9xIYBstoOVK5bPv/KV+WsWL/pbRB4JzMzM8NBDD5Z7evr+Mjo2vl/g/LLWCmtxCBXEQmWmdR0dhfC86elp9apX5V+16O9/XQ7sBwRABSgDdQmIubm5+SuuuOQC3/dzjjQBSMAd8QARQzwsgNa66aIKZIGgDQ0YwP4DVrbJl8lCSfIAAAAASUVORK5CYII=";

  // old icons - low res/bmp-24.png
  var bmp_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE8UlEQVR4AX2TA4z/XhbFP6997dien421bdu2GS2CNeKsg7Vt2xv8zZ/tseeLtk/blzZvvbc5c5H0nHvPtyOccwAYYx9fYm+ayuI9H/5Y5xlx/2f3jW4bbDWaprnZYLJrJbnnzuSG1z3n4dcbSwLg/uVPla1DJjK+mCTyVwDCWkspMt1s5qdl5HpmVzK+dYvl2OWMlZUNFpdWuevwEh945T3ZuX0r6402OPw7Nberaj/zj3WISOjhof57RJE4LoUQAGmHFOm1kvxnxyEXvYyPSApl2D+wyNufdS8mJybYaGQIwPF/QoC1ThpjOoWIkKdOHqczTVBymB8fcUTdI4x1CvxW9xhb5hUP3834+DhZrnG4/7996AkhH/iIJ7Ft1/6xx73hs4nrGmMytQgpmBYXePojRpmcHCcvNEnscDU5BJFAZiwoXZMHBZDPfvfPEHH6iPOLloH+JkI45OZZDm/p4ORaD8eW1lHGUv1WYF2Zrav7KmeFYcdYJ3fd1kuhbX1lBTk4OEZRaLExs0KzrdjVcYW77+nl0P7dSNtipQWTA93Y8JLzIqGOBMwsrnNhMedu2/vCheA8kEWekeWK5eUVHrzH8YbHHeBSs5tIb/K9G9c43xzi6XfVPHZ/TO4tIHjsM5EQtDsdF60Ov8E/R4SzqKLgXpMbvPO5+xibGKcoFJttw9VskNUs5syi3xqMh6WqjalgXQVjqO3/FxF56203MtAV2U+95cFMTU6Q5xqlDUNDPTznHpZjc5bHHZAo40hjgdJlloIv/+YMPf0jvOAh414ArTXOVhdUDx7Ife4Wdm05+Jep6SnyoiCJBdY4lLE8aFfCA3c6Cm2JIsHf7rzKPfZNcebSHN+5vkFXNzxgX18pTH1BEKhPEcivfOajfri8sdFWZU5AYJ3BOU/s0MaRyJirc0t89BdzPOigYWZ2ntymrC9t8smfXeKtTxjBGhPsqbavQhpja88c4SsxFmsdcUQVVvGF315gU3Xwu9uXMVogXEZkFX+6bY4tvTnTI53VuyX+WUFSRSAHgRdNk4ibT85ioi6yxip/OamRSYRRCqMVWmnvO3mm+N0ts7z0MdtrnlqgVgkCtXdBKGu3yq0vs6q6cfkGxklsOVPaeHKM8QKGIveCUQmDs86DQA9BgGARjiSGH//tHMdmfNdCK8BlYeuSrMrGUBQareLwn+0R4t8tqhVwVnPj2QabLUFMReahPKmqiL2Iz+1ck+UpxlpsLSCEIE0T/3EEgWAPAhrNgoEOx74xwIExAmuiMkuM9XW1sYfSlpFeMMYCjiRNWVxYWJi5dmGuoyNBwr9+QUoZtk3084QH7KAzERhTbVVbUG0Z7AClNL2dMfc+vJWOrm5mL15uvOH1r3rx7bffMgMgKlK9c229edoamzhARoI4FhVJAASBGgCNzQbtdpPtO/dw8tTp9de99hXPPXb0zj9Qh5yfX2B8fAxcsMmfTa4gkPvHBuIgJBA0s8LbxqXLV1rl5i+oyUNEhw8f4jvf+S59fX0kSVoiQZZIEunrCtLPakiPeiYl3d09zFybWX/VK1/6jCN33v5b/i0EwODg4Og3v/ndX0xNb9mvlNLOOeFcZR++ri+zVR+yEFG0vLysP/CBd3/gzjtu+wnQAyigCTSATFQifrmkp8SQcy4GJOBzBIiAfw0HYIwpymgBKaBrgXYtkv8dk+LIrC5m7A8AAAAASUVORK5CYII=";

  // old icons - low res/calc-24.png
  var calc_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEd0lEQVR4AZWUA7ArSRuGn+7pCY9t/7Zt27Zt20bZ9XMLa9u2dW3fnJMbnJNBMt07manJZtbbVW8+Zd4PDWGMAUBr/UytzZOUsvw///OPuW3FKz41vTI86jdE4LoGNgYzI70r1/3k3d8+z2hjGwxEANP1YwyWlPKQbVvXAKjYzVij4V1ikRk52jiM/YJDNI+UuWt3mUotYIZn8OM3fYunrDzxObX1ja9iIiKS4kxiYxKfGRrsfb5S8lZF/I+iktn+cv0Qp277Jav+7QwWFJ7v8kT9NL71ip+xPL9MzdmgQ04XOV3kBrTRIgh0IewEtW/3frKZXOBbnj55yy9w7LsY7i0gpMMTNp7NJ171S+ZnFnB8N01u0pUneiKToam3f+w1jE9M9L/oM8uZdftOxuwCLd1k0Hkm7372z5mdnsdtPh7yGAACUO/4+QsAnrqrslnkshbgMN4MyZ/0c2YeI3niI0mQjE2AHOrvoaeYE66jOFrxsctP4z1P/FlE7j3cWEhXrmPSRIYA4oSooClpo1Y1rBSfzxdf8Eump2bwmjXWvZ1A0q6FNq1YFwpjWiHiSEYsdYhjmM53Smqbpt9iznoa33zVj8KZz0QbeqR6OQfWTmN88CX4YbJS7UZmhl8PwK4jpzIx9Fpy9gDl+j0oMcnc0JdTI0qWumHrEWyd4Uev/ymLc53TgpQKIUWkQ9um86G0QKCjmBAGZWVjclJ7EEEVGotMjYxtWppbNK7vCTqtanqyT2Kw8GK8VpmGtxrpQNjdjQzkXxB2MEIrAK/pJPN/cAf//c5f2o5j9brjh6TZZEMFkmPrW1FiCD+oUnf3cKRyIwAN7xCl6i1k1CBVZxP57HyKPAYQQmkdOWQIkT4tmt7iKEMDc7h+BTfYznCoA6w1eunvmyGfGSaQq7SaaXLd6UCgiNeD3hYECKOgZSO0jcTGtDKdz0JfFJMm1OFBHSQtKDor/baApLpxACU20wxqrDuHKdU2EY9ojXJ9G7ZVoubspZBdSN8JbUjWgzowxLIVNOgrTjI29Excfw1f72Y81AHKzmUM9j2ZPK8E6994XgPzwBsOEdqvXjuwUK1tbNGByRji9tzWGqXqlYAEQAiJ1howSGGFekDSa0/u6Simuk6QYH52/BXZrH31/QmqG1tCPZN6EhJA+inQkUyNBWK/pRTVSrWRzejnFwr5TQoMkBB1kZMifxhAEARYlqBYLGAQVCrV1g9/9J3PXnPVZZuy2RxSCJGe3+MgB/A8j9LRo9HNP3K05H7xC5/9xMUXnneC63phsgrK930ymWyHjOQsA+i27CLV3WPRgIillJRWV/0vf/GzH7n+uqtPj4pOnpWXvvRlXH755aKnWBSWZSEjKCwZ66FMkMRCyNiWMiquvFZ2v/j5z3ygTQ6kngoB0NvbO3Diiaee/cQnPfmFfriiWx1XGssO0iMTQsrysXLw85/+4LfXX3/tcUARaAIOUAdcAbRh5fP5vkKhMB5+aAEKsAAJiDQAMDEEzabv1ev1KpABWl0J1gHvPkSXwEkOoaQuAAAAAElFTkSuQmCC";

  // old icons - low res/document-24.png
  var document_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFSElEQVR4AX2VA5QrQRaGv+qu6uhN3vDNZObZ1vJgbdu2bdv27uHatm3vs63JMO40qrZTndMny5vz923+/39v3ToRxhgA4ljfOcFmz5PBi9/w7vzvzc3uPzG5Zph2J47bPpOyrrZV5B+e/bCb/15rlAESDB5s1gappHtBKfldAKG1JhGZbrW6p/IupZOzbZ7+/TZ/vtLB+B2C5TZ3m1rmA4/fybp1M9Sb3d77KQB62QJM76cNwhHR6Eh5n+OIY1IIgQGv5AnvyLUWj/1GjSPLLp6n8KOYu22p8cGH7qYyucqSg+H/hgCtjYzjOC+Egzx14hjFnGKBER6fkB9r5CnmBZ1uxD0rNT5wvw1MTKyy19az4X+7z67JQt7sNndlZsO2ifKDP6AO13rkEESGuwxX+eB9Z5iemqTRCbF19olEn7wvgyOwdyPbbhhUkPd61XeIHHWbH13TSBHS9uHuY3N85H4VunIF3/rHDYYKChew66UNJo77WVvhWsNn7WSJDTPDBGGcGulDViZGaXUj4fiL+HHEvdb0yNeypAucu9HhwOYpIiMAgxKChh/hOA5CgN+NrXNdXWJhucbG1cOYzL2xkCIIoBsRLLW416aQDz9wC/mhEU6cXKQwNsGnjra43+YC15a6fO/QIrffWuZPR+e5UW1xs51jbNs0SicRKjoirSoVyMJRGEwQcdeZBu972Eamkp5fnG+xeqzExVrIK3+VuOvE/OhEg3d//SJHLjf42Z9n+dhnjlFb9llcDmi2IzLPBgZF5O9+d5Jczuj3PyMZxYTc74a4AgqeYmPZIa81i37MuQXfUpy92kraNsyZMwvgSP5xcpmCGzC1VqD7FaQ/LOSa+Fesmdr+88r0NH7QxU1HgiDSTOQkI3HAH863uDrXYd244uSlOsNCM74yx/WFDi0fJsuWimxMs1UWyE987M29mwv1eidMskqfaeJYJ2KG7UXDl351FboBT7lNhY997QxX/ICH3nENt77pGD/8wyyzix3CqAxkO9wCwOkRJeg/JNtALT+m4Wtusy7PmWNzrIhj7n5wnOZSh4tX69z5FhXucvMKb3/GPp75wG2sqQwnHmJ0T0CbTMFJU7Y42UZpd2MKnsOd94zAbINNw4p9m1YyXnIYG1Ic3D4KYFu6c+Mow+V8z2jWpmxMSWNgcVIHOtZMlCWrKmXe/bx93HLXGABvfcZ+O5YrSirJEYWc5NTFRU6fvcHeLeN0g4GJgkwga1ECS+65LqvKioISPO+h27Iq73PbNWhtbDuarRDXcZJJmiPyfYQYHNH/aFF2IIxixla4lhwgCDVLjS71VoAQwrbvyo0mjXaI4wgOn1m2lcRaZwKep/CUHGhRWoF1V8gpTpy7wUJ1yV5bkSim3YkYKipcmY5yx484dFwwUtQMD+Xsu8rzmKtWq9eunr+RS3hEFEU91fXLtfYpHWtlAAFEUUykta1KJyB9kC7kwIbqfV/MK4qlIto4XLp0ufmUJz32vn//+19+AuC4rptNUB+2VOEIpOvgJkizsO1JcgbpukRhwGx1LiHyOH/+Qu3xj3vE/VLyNJzZ2SpSujDwp2Fd6wH0r43O3KMHzLhScuXKlfZTnvzYhxw9cujHDISzc+cOPv/5LzA0NIRSXgKFTKCUTKBSSHsvhUyhbJYUiyWuXb1We9xjH3mfw4f+/gP+LQTA8PDw+Gc+84VvV6ZntoZhGCXOhDGIfjUiG4D0OstCOM7CwkL02te+4rWH/vG3rwMlIARaQBPwRV9EJk5LCUYSUheQQC87gBjAYBiAOI6DJNqAB0R9gU5fpPtPzBZfW8dJsyoAAAAASUVORK5CYII=";

  // old icons - low res/flash-24.png
  var flash_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEt0lEQVR4AYWTA5BsSRqFv7yoru5nc+yZtW3btm3btu0NLYJrBse25/W23cWr/M/Drci465ORjIxzfiaSAPDeHuG9PzVtpcUX3/2O9t0u/NNTDm7ctHW1rPxyPqB34KR06+0edP593/z68zBLkRDQWABhIkmT+LY0TX4LcExA0v7BIP+1Wu0NqzfewHPWJ7FuTGcmo7feY+W+d+FuH/oUx51w8I7DTu8VEigIiJoDhJAJF7lq+7bNd4wid03inAPRcu3x1vC26yi+8WY2zk+hHeNUZYbudk/u+ZGPsnvvXoadPv8XDsyUeO/bzkUk19xwI+n4BJv73SPkb2VLf5J4Z5t8acDc/e/BCW/9GLt376bMMgTwv6wPdwKSR9/tzpx+cN+ub93prHTb+hRu9zi+ypi8033Y/fKPs2fvLqrcE7XbwIg8iAg3Ovs8R2ZI0FRIfvmw2zHm3AOjG2Ypx9uIITedfjui2z2R6OZJZq+9ASBYyYjAGlZ7M7acdirJpk3IPAg0msnObW18Lrc29JS9IWt3vTcTj38e7i3vpV8WyDkA6hUEeEElozJRmlGUJePf/grJ3e+GqqrxUyQ97ykrY7bbJX3QvTnj3Z9gfGmFJV+RJgk4BwbmwSQsAkN4wEeiEpQuwkTIQRNJnsBAJWv3vyv3/shH2L17B6vTs8hF4BzCYZsg2h4Rx+A7RjGoqCoYdkUhkZvhmwmmkYNLLz5EsnG7PfAHH2XPvn2UWRnKTUCZG+07jbH/3pvo3JyxPp2Tth3Fmli4uI+PReY93hSqqh4gILnunIdw5vEn/H3/EfIsy3FpEqqkEuQmxjD6UzlX/nKZ3IuTHtQmL0XfG15GNtrVEKhJHMnnf/YjJC13OsMSWQogRGHCITKJscyzYYfjdk/fxD+uy8gHFXkBfe/x1B5UgmaHixqJ97UyCIUSrOMKMPTGRotZn8q56HcdOkPPGXdJGRZ2VKD+6w2zmsckmgoJAAT10DhDMxD0zdhuhi8qFlbLY+9VFbNrpyPDqLzIvccr5ABCohUEGsmprRh6jwQZ4tBNGVOTOXlklIgrrsnYtiOmQBRmoYpMQiYCfdMDUOg+LxhUhhC5YHXJyCrD4ros11eNmxcLiEVldb6sUUUNND0IC+Y9nX4fAZlqgtrSunNL6disjk4zrKrwdT7qMDtHq5WSJnFDgJEH3ojabTbd9c6YxBiitNrSQCphoylAlae9eRPyRtpqsbiwsDAzfevc2FhKAgJEqP2iYNPBAzzo599DalaWwl0ywv+qopVGjKUtTDA5OdV75Ste/JzLLrt4BiCJ45iyrBpNMiIoQuMEsjCt3nHQ6/bIhn1OOfU0br7xpvWXv+wFT7v6qiv+EnIwP7/A7t27QCFM8K+kBNIwTcLJYeaJk4SpqanBK1/xomceIf8zDSRnn30WX/va13nyk59BfzBokjRFQoiaQgATExu4/rpr1z/4wfc+7corLgvkQWBlZYXXvObVvS1btl+yb/+B08uyrCQ5CadawYlazOp72J2LouXl5epDH3rvh664/NJrgdOBEugDPSBLALe2trb+pCc97lFpmm6TFAMJEAMR4BqzCQF474sjGAATQDmaHjBAhwG95QgonvWbPwAAAABJRU5ErkJggg==";

  // old icons - low res/folder-24.png
  var folder_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB5klEQVR4Ae2VM6BdQRCG/5k5e/Yitq0qTWy7TRd2URn1XdSljO2kb2Pbts377sHkcWPuS5fvGDvfeklV8S9h/IL/ggCfMWv55QvP30VdUEnWyouGDbJjF45vfRB/yReNPHHp+ZJx3RuH1jDKuPbwPY5fe6kKKH6TGjZ4uXx65/rfLYEwg5ncc/smubKDABB+kx37H9T7YRUZIxQlCp+uG4bht1XUdc6hVFUJ1QgR9PSS3hxUPtDEwW1f1cqFtYXhRZICT98UX2zdc7OuqyIjkp64FSW18wGY1E+ghLcfkrQsphOExkRELBkbguAnUBDeFYoSmiB2gow1BSJw1gr85yYCkUpZTCfIWvOGKK1nDSFN/QTMBAI4Z81rJ8jZ8CUTNchaQpwQfAiEQKSlgvCFE+Sz5jFUO2UMI2K/EhhhEIFzZTGdwMrd94WIrFHvRg6NgqGcscFdOEFGbhRKimw4AiT1KwErmJRLY153AsPFq8LKocRlds82SMEMtkavOMGru+euS+0uePa6iCTxK4EIQxiIX9+/DDQCqSo69BtRd+r8TU9bN6nNgD+3Hr5Kd62dV/vY9pVvywQgIgEwMTCmNQCCHxpH0WUAW7QUt+AQUQsATeGPArinqg8A4HMBA8hUk6CglYE/ApZ3vBlFBmmXAAAAAElFTkSuQmCC";

  // old icons - low res/gif-24.png
  var gif_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFiElEQVR4AX2UA5D0TBqAn0462eHau2fbtm3bto3Cb+srnX2Fs20bn401BslMktalum6n5vimnnb3y4pwzgFgjH14yU3jWBZvvfitla/f5ItPblyvMW4yTNbT3LR78+j+lQf++k2PeN2vjLORo/yAocb31iEjGZ6MIvkNAGGtpVSymKb54QrV+uHuAd66+mr+vPMXbEeSdHIeZB/CNQ+8ihtcb5lWLwEHzu0pKHsPeKXWIQKhJydG7xAEYr8UQuAgrgXVeH/377x2/XkcCw8SN2skusfD9MO48u5XMTe3QLuXIgDH/xEB1jppjKkIESCPHDhCLa6zU9nhtasv4ETzAPWgSkqPh/BILr3HdczMzJIVfRz8f+sHcwYi7/jwO7Bwk4WZhXfPRkfrh2lUa+Qy4wGdR3DBra5lfm6eTGXIQGL9w4PbWCyOvcdBO+X7YQ3yFh++GULygKO7JxG6SkKfO7fuyTNGX0mXlLWzfyYgIC16NEZqaGMRAnp5Rr2cG2cw1hKLiOtPXB9bzr2XHgjGFutUx0aETSXJTsEDth7FuxbOJxvJ2Mw3aBW7dHWble5ZUpPQ0S0/X+udQ5GjbEHPdFhP1hGAG3jpQVolMCVpt+BhzYdz5Z33sWNb/OnYfuKogjKKMAjplBbX+l0KrRBCUBTwq9av+GnyPZ7WfAEVW/un1Y5hkWEQYLXlISMP5Mr7Xs70zDTb67tMNyaYaU6ijKY8g7G6nE+R64JaWOO36rd8LL2W0/kJgkjwqsbbqLgahgTtNAMFh350lkk5YS991IXMz8+Tq5xCF7RKayeyHpnpMyJGaJfzWlwldJLj+TEuPX4hSbyL01WCoEJLdtjXupgHRo/i+pUbDYIUPPjQg3i8fvyPFhYWyIrcuxiIkNG4wf70b7zz0Fv5e+9vTFTGGS9ZVStcfOJCtnstVN/xpMmn86rl16NszudaH2UtXyF0Ifh4CeQn932E8tHtTqevHDZyBARC0FZtrjx2Dau9Va5IruL1N3wjNtKc/7cLWc3WUZnlifOP43lLL0C5wpew2BjFVUOGi1kaY73V4AZJss7SiJo8evaxfHj/J9jOEi5vX0utWmElXcdYwcMWHs5rbvoaerrvzzugvykxi+Cw7GmQ4GW4Anxikzzlidd/LK1ul88f/BI7rstu2qVQlofd8IE844ZPpVsk9FUGApRWdDZydGH8W4MyBWCofq11xGHMeK1Jo1rntXd5KdWwxkd/+xkoHI++xSN4+71fy1Z3h7HyTFVXQDgoBI9YfgSTI1NoqwdJHijYCxECcp2X1rapRTWMNTzl5o/l5Po5FIaX3P45tMq97WSHKJTecu0MmICLHvRekiL19+E/QzT4eQkEMpRIKXHaeQtfeOenMT82W172CfV75RnvtXACoxyp6nuDhBDEcUQkwyEFQ0kORUAtiqjHFVQQEAaSOAyoRDEC56usn0c0yv1CBzgBfaVwzhLFMZsbGxsr506sjYxESPjPCqrIKmNyEleECBvjhKAmxtCZAxNiEVQZpeg5ssIw1Rjj5stL5b0ap06fSV7x8hc9+09/+v0KgAzDEKX04F+ujWGyNsm9bjCNsXawDsK77w2xFhDemCRJ6addmgtjHDpypP2ylz7/qX//21++P8jB+voGs7Mz4IbDZNHODB73n/XjAbZEIFCmQMiQ02fP9F7x8hc+o3z8ewxJcOtb34rPfe7zNJtNoiguiZAlUST92CP9Gh7pIfK9pFars3Jupf2iFz73CX/9y5++zb+JABgfH5/+9Kc//7WFxaWbqzJepYXCOUq8O2LPM+vnbtALEQTb29v6gx98zwf/8uc/fgmoAwpIgQTIBFCCLC2tl0yUj4aABEIgAMQQw+IAjDFFKT0gBjSggL5XAvk/AGmNZfRPzsApAAAAAElFTkSuQmCC";

  // old icons - low res/glossary.png
  var glossary_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAT+SURBVEhLdVbLax1VGP/mzsx9TO7L9JWGFJP0YSilVsSF3aVQg6Ar/wI3unclEVHcKKKYteBCBUFwqVSqC3cqVqGtpW2stWmbNrk3ucl9zPs8/H1n5uZegn6Tb86Z7/0658YiwOeX7y9Vnji04trWKcexCkzT/BrC+IfRGAPwhFCqH9HNU0et5Wjt58uLi4tRzs3EP710f2l6+tDK/FThlAsHiolsdGhsv4MxXpJoWm8JvfpYbh70rO+jSP6wvtG+54b3brz5+sWuiRYxmLcFpVBq8oWiQAJ5BfpMy9HQhjysnUDS9X8Sq+eLIw93xYvtUL9Tqh58q1CdPc02cwcICmErRMYIPYL+HkoQh7hHYznJ8hq6guZni9bx+dLhJ2fd415Fz4o0rbFd40AgAZXXgd8ZWjnm33iN05XmFQ+IUkna7Wl63FJWp6OtVIhCwZKmiKMMjDC/c2N7CEO87qMzIXOGzJDKINI0CDT1gAmnSEgPMHJgFHjNnWRUg+OGmZtRs2/eKCmo3010IigKAuWLRMAN0gIYB2Y31NpbIAIL3I//gqG4bRNN1mydBoPYiTqror99SYv0R5fENstlGaAH3GRjONfk6IJIUWsrJVRpz2AWdZYHb72KQ88/PUkn5mq982fbq+ef/farcuWjz7T19SrYoxIZaV7yVSL0zVZMv1/bpQCjaAA8ZitMk8IYKQRVwGxPVFxL0M6B650Pn1uLPl6emLr89sSRXxdYJXcgYRgRsQEo8BqnmjbbIfVwRNc3AkPjaqWg+2joTk9S35fZmCLFou3ZT808c+zc3MvnGpWFc1LXJtly5sDMM0eXTUWK6MNQUq3qkFcmevQogENljN1fD+EworsPQrpytUu9AYKDCa0ldZNrBbwdS5cdSovG9qhEDHk0HGV/kNLhQ2WaPupRezui7U4MAYv6/ZjiKKWyg/60BihfalQl6tX3Y+r5HYpxfQhRMnTjgC8KkyqayZlEsTTlaQG5zinmeu3BwNR+asozxuJEok/CyHMKQkitxaTsDgIRxolIhcucfRkAwEPdE5qfqwEbdPJEg5pNF9MUUmc3plu3dyiOBXmejQZz0lxUrZG1vHO3v/bb9b+vPN7qXBNJ3Gd7Iwd8YhGO7wtqb0UkhcaMo3ko5dRhD72wMVWhiXynG5vS1OsuSpkgQ0nVUrOzdPyNPy40X/lgatN9zw7rf7JZxxjnc2Aei6rVIs3PN6joFkzZCghhbrZOx2aq2FumRBx1ueTQDGg1nAMLQtLvNStXv1yY7f7y6hnbu71T9L+A5ZujDLjYANvBXE+45MIBN9XC2JYRPTv2PIca9SI1GyWqwHCzXqJyxYVjnAat3IlicrI6UbwIxRdE7E+zvbEe5Fu0hk81G0eg/4O4TVFOFhvSLBDtrYelwqDvqUR5ItamOiMHsGqEeTv+5AZ4WhgzGX7yPV5mj7tN9bokO21SYWx+AhiMA74IMsVsZciUM5qJ1DzZ9zhviErymAqtBzta4qhLPjaALAPMMwvxLwT/bHLdeeV7xqyg7+EYj8cUf+xNC2mpR73KxsO2fScYyHsqFgGzMge4cuHbhFJ1CtRwLWpgPOtFrGg274dY38erYig0GmJVmxvFC699p8++9G5LV9/vknebTZsAPvnmryW3cnClVNL4r4IHcx9wekMwGjmYtLnhSu0O1I3TB5LlmeTWT2cWFweZANG/vqtL7+iIB4gAAAAASUVORK5CYII=";

  // old icons - low res/image-24.png
  var image_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEjUlEQVR4AY2VA8w2yx3FfzOzePbha9S2zbCI6qhxoxpB7Ti1bfv6BrVtW6+t9cz8u/tt0ufDxXeS3+AkOWe9SkQAwqqyL7TW3hMUNyYRoZtBaAeA6bqdxQthFP590I/fCJTKe4+I3DJNy/82s7qccBBEOk+6NcjUQ8Hc7OieWqs/BK3REAEujsMgCAytd9OaFl0gpSiLirO0wDmfKDQBnaSlaeQz1/yQw5McEfAI0o6+HUHEd55vkNbzGCV47/C2Zn4y4hlPfey0XUHARYp6EWv/3MELXYh4pMF6jz+3d4g7V9D5dUbroQMWlxYAwYsggHBDBWFAP+nRFXjEd+G+wbVHiunOyNe0XqACREc4gdAoBKa6oYIkjpkME5wIIg7nfIPrwr1B2lCp8e211ppaG4osIzCaJDLQ3VPouLRgmITMTfo4L3jpwutzBRZvLe1eY9ChJ9vaQpRmNOiB1iitEGgLbvgMWn807LE8N/p/uHUW2xY0c21rrHeM0l029rYIqJkZjKhcWyxImYHcYMHUXBwZJuIpxZD5HlUbbusuvDaIqxnGPYzMolLL3uEJxzv7GOVRt1kEuPAmi8C0EMaDgEif0R5xZUakfkRtNbbWOKvwVkM5Royj+ue/SEaae9zydoS+5va3mkxfPARQF5+BEMYhKrkDkWQNQs8ZvKNBcA5cbdFpwWJ5wOp4n6OsxtqQSDvm1QQExHu6OJgW0EmbmjD0QARYDDniCihSxBYUf/ku1cEOUkMS95gJU9b+c8ThfkmYrDK+L114N0wLkM47+NN3SeIdwiQk6imMrlCzGthHnW7Sl3+TNH5ZWcSV6O0U//eAzbqPyUtuhdz0Tf79H37M2q+/yGnm6YUKVQrJ0BAYjRZDnjrsMZylmlBrXFmzfWIJh5pxfh9EuLE3uTOXg4rx2JNqoRcHhN7TX+4RRAbjPRTtkSvyE0EHHtlX/OWvIVkSsxpHIAI3fAbdcLv7Pprhg28PWkBqcCVEDrI9ONuFP/4elIFbDkkPMoqTDDsfceWGpl7z3B6wzuGdN2Lk0kvE4n2Q+C7U5RlUGTY/Ij1KSYtbkuYFC8NVfvvTn/GXnYzPfus//HP9kDBQbOfC02/1AJ7oHBvr60f7u2v5Ix/5CAIQWoROb3/Hx9AqY3FhluGgz3hunuXlJcqyoCgKjmcfwfGdVvjtP77DidpHho65W92Or33hCoyJ+Pd/1uXHP/ruS1796lf+wzlLYIyhri0iXcl//73BV664CgWgYHZ+wh3ueAfiOCaMomYOmUkC+uMZHv3Q+7O5f8RDHvV4hqN5dnd3ue6aK17QhH8Q4KlPfSqNudeG325757BK00JaOedvAHeD2IYvfekK+ds/1uXlL3/ls7hIwX3uc2/e+ta3qyc+6WlhmqakWTn9316E72bEd2salNJsbu/VH3vhc1907TVXvo+LpFqSJFm48qrrrl9ZWb19XdcKQQmiumDUpWXTn/vuzm7++te94l2//vWvPg4kQAXkwFk7K6Al0FoPm6IZEQmAFgNoQF0EgEBHc0Atp0AAWKDuCsiA4n9jvWWHCssHsQAAAABJRU5ErkJggg==";

  // old icons - low res/impress-24.png
  var impress_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAETElEQVR4AY2UA6w1SxLHf40zc3ht4+Patjdc2w7Wtm3vhotgbeNZwbPtd613cQZnui4mt5P5XEl78qvqf02XEhEAnHMPcU4OW2uS73/9C+UnLfzj9Q8a6+nd3MiydC1iJmsPGHrAxQ941+f/KU5KiAACee87EYzWeqZUMhcC5A6Evo3N5rXOBD3pyjz1v30KO3M+cdwkWVzjtvChVN/xU8aOHCHd2ERkD8R+cH6N7O9JV2fjUdbqyyy535rYsD1dmiH4zecJlm6EsINQx9w99GhqL/8+w5OHSNY3AQ/Dw/FwEHDiVJa5qtYae9td92LDclZrNV3wm89SX7wXVe6BZJE7649DvejzDI1O0YqaRbgcH7n4Pa8c9h0vfiqD/f3t3372UNBYvhPK/ZDE3F47QvbijzA0MkEWnzHcNwAF2N++/AEoLQ8IV69WWamESed24A+i9aKPMDgyTpY0kVPD/R45HC+bAh12dFKqNlQStcg2F7mlMkrrhR9jYHScVhx5WAFOMXKXQ/0oAuQOsXEkSOJI5ta5a+xRhC/7JgNDo7gkQre2kFaMUgr/G5Jb7swRmwZ4MHnzvzBYlyqyzYS76g+j7ZXfZXB4jFbcxETLRP/7MoQhKM0JzWXYTEif+ilyZjEHAHbxsmuJgzLt7/4Jg+PTpNEWIHDHhZQf8ByS8Wci67ehlPFRgQLJSMJR6nf8A7NwJVvdD0E4JgeAvaXjgbQPDl7/0KlpSeOm8n9LsomttKFai0TrCyhtdpuXKtuVrmcEowxJGnn9j7vB87//c0Rk5f71ZoK40Cc0TZGkSWa6CUozlOo9LF75F1CGcucwavdmAi5eB1XFwwuJBuvc3oZGRHm4zxF5NMogKAjbUNqQCRiBnKKOewNOvJRYcju+tgCg8nkrwmUJreYayljIUnRBCg/3bf8KFm9FuFEOVQpBwDQGSIJegp5JFIpy1yhpDkLbEH3sm3A+B8ffQMjHpL2P4MJvUJq6HCVgRaiYEgCyciPlLEGMwd36X9KnfwEpvvCcU3BQKAdCNPxUNh6yAukWqFznwreuCuLgoW/AVQ/ixHl5QGGNUdZoVJbtHUysrW3euDMPCiVhv0GxFDh/5mWBfN9Yy9rq2lYYuEdVq5XrLYhPUgFOEX7iBlmWYYyiVqsiKFZX11of+vB733Th+WdfH4ZltFKqqN+ZwwGI45iF+Xm0tszNL0Rve+ubXvu///zz11EU7zhbxSZJQhCECMWS6wDc7ijIcdKAEweofNSahcXF5B1ve9MrL7n4gj/lQQsA+glPeCLnnHOOqtdqyhiD3msWo/O50b75M210vtZ6L7jlpeXobW9540t34YCHAyiARqPR8Zvf/OFvhw4feUyyYyKi8kjJR9+Kkiml9fLKcvaJj33wc5dcctEvgRqQAk1gHYgUoABTqVTaqtVqv4gYwAIG0IAqNgAkb4o0TeL19fU1IABa3gFsAPE2+ku2RIzpO6EAAAAASUVORK5CYII=";

  // old icons - low res/jpeg-24.png
  var jpeg_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE/0lEQVR4AYWUA5AkTRbHf1mV1Rjjm8bow9o427Zt+wJn27Zt27bXPo2WPdvuUua7rkVFnV9EOuP/f9YiAoAx9rb9sTaX0+Frnv/ywlV/sfesjE2O9YLA+L2AeGrAG9k2/5ubP/wuvxYjHoBAdgIEK2hPu3/zPP1NgISA/pjudoMv4rmDtRPL3Na9hppdoLZ0ilajDZtK3Pjp92B2fm5Ht9V5rAiICAKQrBcGCIJYQTkqnhgf2eE46pBWSgHknLyXay+e4ezHf45zrsPQ8DAmipHdk+x+2r0oVyr0Wl3+ryiwVrQxpqCUgz589AheIc9A6HH2Yz+l2LOo0SGot2lsqbD7UbenVCoT+iGCwP/SPj2Tir719W/Kurmrp156q0d6xbYhPz6CExqas0XWPfBmffASURDCZXAE/is4ySDLoD943+ehlXOz9tI5TN8SWRV6V48w/8CbUyqXk+DjaCcxGzEmteA/gKf3CCmZHh8bJQojtRqcJuz26O4YYvODbk51ZobQD2idO481FtfTDE6MIpABkTSwcRSTEgAggKCDOCaKItqNDoO75tn5uLtQqpY5d+oM5/+yzPLXfo2NDbkrhpm90/XBcRFrsSKYIMIYgy7kmJytplZkRaMUcWxwt1a49tPuTWV2mlN7jnHsXV/HdAIG5q6AgQL1/Usc+OOniY0h+W9dxeDcFEaE+vJZtjzwVqy9zXUJuwGQicHhA0dwhwv2Fq96NJVqhSiOiU/WyTdjxNEMr5tBhos09ywwMFokNpZ2q4GeGOC6z3wAxckR9n7se9SPrCC3zbgNEEAfnQ3YcM3cj6erVfwgpF8PCIrAxIirWfjm74mtpXTzTUTDHtoKuabP0o/28dUnvxnJubSWa2y/x01JA51GWaHf8P63Jpe1ZrMXIeIBxNbghyEilrB/PXWjjUhpiO7Z8wS9gMHSOOWbb+PgJ35EZAzddjexjDR1M07SxtjkEkgLBBNben6ATazwHPKzk3TqLU589pcEXZ/52+5mYu007uQwrZVzJImSxEUErAhZBg0AZDOA2MR0/RBrHMR1CC9kmiHohfS6IWIFYy1+FOIH/RFGidVpTSCZNAWArO8gjGI6PR+sh9/psXLk74xcXWb+LtfBhjGDfYvqfXedXTyT/o8jcxHDCil81gK4XI0Wp5Cj1WxjHEUUxRz88i+o3nQLY2srOG6OxSN/5cjXf0dQ74DjJKlJcWwIsdlC+w8uQoSoFzJ7/U3c8hWPwm93EcDEJql28hNDiKMYGhjhqi3rUc7FFqJzmjU33UHQ8RERlFLkch6edjMEWQs8zdrbXwckey+IsVixoNTlv+lb2AswcYyXy3H2zJkzK8t/PZXPe2gQyIJwcTUdH0SwwsU103eyzS5KQLVicGAA1AALC4vtxz32EQ/cs+cPKwDadV2itFGlBNkO+R9HQqhQ+H6Peq/DmrXrOX78ROMxj37ovQ8e2PeDNAanT5+hVJoi6w7+FZz/TAJgrcXVHktLS93HPfbh9+uDf5+M6M2bN/H2t7+De9zjvnS63X8BIatxmoZZgoGBQY4eOdx40Yued+/9+/ak4CnB6uoqT3ziE9qjoxN/rE7PrI/6/hIRJUJ/CCR7JFOlkq5KOU6tVotf/OLnvXjf3j8dBtYDEdAB2oCvAVWv1xt3v/udb+953riIuIAGktUBVGZkRQCMMWFfusAAEHFxGMAC8g/QaNHhoOsdawAAAABJRU5ErkJggg==";

  // old icons - low res/mp3-24.png
  var mp3_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFIElEQVR4AX2VA5AsSxaGv6zKqub09LBn+tp3bdu27d3A2rZthdY2n21d27635/W4UcjMV5URFVOPp+Pvk6XzH2YKYwwASumnJ1jv+zL86Je+WLyuyIvrE+P1Xq+rZnuLNN2C94TxFde/6/kvu04Z7RkgQf7Pam2QnnSPep78H4DQWpOQNDudYH/BcSuHp6f43k1XcPTECYKFBVpzM9xraJSvv/zNrFq5krnOIhjSb1IFqbYAk/60QTgiHh6qPcBxxG4phMCAX5Kef6Dd4htbrmQ66FGu1QjiiEfW1vLJ576ciYkG850OAjDcgwjQ2kilVFEIB7l/715KfoEFKfnmzVcy70J1oMo8C9xnpMGHnvBMxsYbBGGEdF0AYqXQxtzZ+9x1JvKhT3wCzbVrxh72jjd5cwKqgzW6Kma14/O+xz2BxsQEIjWgFCenWiijGR8coloq049CYm1yxrHIM8hHf/VTOI7zhHPtNqViiTmjWV+s8r6HP5FlzSa9bo+/XHs5lx3ay1y/h8bYiB+2aj2vfsTjqRSKNpUmq4tdkJEhayMjxGEo2sdP0U2M3d9vWuPNySbzC4t89i+/5mzc5zWPfiKbxiZxBByaOscvr7mEa4/u4xsvfgP1cpUwjpcIrBgLJwwDgqDPuflpNlZrfPQpz6fRaKCV4qcX/Js2ih+86q08a9P9adbqNKqDPGHdvfjpq95BvVThU//+fZaRjMAiE0dj6EUh9xud5NPPfyXj4+MopTmZeHnV8UN88GnPY9AvsRD0iZSy6IQBQgg+9NQXsOvkUW46fgDflZbIIk+wZctNTB87qr/80tczmRS0H4Z4rsvWI4cYSrpp/egE3TBY6hgL6EcRy4fGuFeStsv278AVTvYcnWqwcJ44q3lerXlZc6KZGrcvFDyP+V4HX3pU/AKw5FkepUKBAekz1+3Yb7TRSymyEMhf//An6Y32/HwvSrSX9vqeY0e4/sh+jCu4dMcW7rVyTT4FVrTWXLbzFoIoZNexU1y1dwf3Wr6aOI4z7604ab5TgA0dF/jOef/gPwd3EEcRX/3fn5jtd3CEyBeQMAj42vl/ZrbX4dokRe/5y89RSoHBbhcZg8RK5plBaU0oDAJBqKJ0RvIDZAFW4bgusYpBCGKt7LeCrMgWOYLciCsVE8ShDTdKkOVW23dAgF1bj7UBFduULQ3ZUpElmWDDBwHdoE8vQSfsE0SBDRlMvgWtjtIJjhVEISpBcu/ObQrkuwThODw42QakI3hoomvlCliP8x2k7RwUPJ9H3esBUCrzwDWb8FxpIwHwfQ/fk4g4VulHq+fmO/u1Ml7m3YmZKZbXR7l1cZ5asYyDyJNYTHcWGK7UODHdolEbsu+4UjLVarV63dkHFQre6YQgtgSzc92EwJ5U2OIIl1DFOMKxhdTZrqmXCBzhEoQB5aKPXyigERw/fmLxHW974wu3br35YrCN4N5piFJjQRxZbYucGc0Zt0XWil6/x6kzp3Gkx5EjR+fe/KbXvCgzbgnOnWshpQu5Q4NcsSyw+q5gc+5Kj5MnT3bf8fY3vmLXzu0XkRPn3ve+F3/4wx8ZGBjA8/wEHjKB50m7tpD2HhbSAs9qSblc4fSp03NveuNrX7Bj+9bzufMJCvV6ffS3v/3jfyabyzZGURQnngljSGAgXWMjIjsmMy2E47Tb7fizn/3EZ7dv2/IPoAJEQAdYBPoCSCETTysJhhKjLiCBVDuAyCEvBkApFSbSBXwgBkvQA0sS3AZ+Y6RwWgVOIwAAAABJRU5ErkJggg==";

  // old icons - low res/mpeg-24.png
  var mpeg_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFgklEQVR4AYWVA7AsTRKFv+ruGuPO1cw8m2vbtm07uLatwHo39Duwtq0fz7y277inVbX9KmL7YfHnxGn3OZkns2uE1hqAKFKPi7EvlXL8T37oc5mh1aPPGh3YOtDqtaNWu4uuuLJ6KPf3Z778kX9TkZYA+uqN2SuNIx17SkrnJwBCKUUssqXb9S4Im3xzucv4TxosTTTYaG2ysr5JaofPc9/2UHbs3E633UNrYmgM7aW9AWjin9IIS4SDldLdLUuccYQQACk7ZaWai11mf95FdtJUyiXCIETe1eNRr3wgtWo1Jne50xCglHaiKMoIYeGcPX+WVFqSVmWmf9qmGA1glQS6CZ1dAQ969t0ZHR3F8wKTIf8v++ScJJxHP+hx7Nl5YOQdz/2sLAZlokqIDmw6pRXu/sSdhjwMFU7KRmljJwLLXFMxribH4EoF53OvugVpy4c3F11U3kJpTTCyyYEnVanVaoa03WyxcG6dqA1ogVOwqB6sUKhkCX1lfE/6Yg5IxJyRyjB+EIjFlVVc18Pbt8H9nrSPer1Oz3U5/ZtxGqcCKrUyOx40ZLId+8MSY7++SO0eJQ4/eivCskw1iYAJbWD1vD5d1zXTomot7v+C/VRrNUN+8pdjsJSlmC9z+FlbKO5MU96Z5cgzt6ClZmOyz63fmyQKFUAikIgAVmwJfd+juEfzuFfdK/a8amw58/tx1HKa0t1tgnQfJ2MTeYrAi0jnJJRCdjy4zNjJWY79bBonbSW2XCXw12O3cXF5TD3nzQ+NbakRhiGtjRbz/2gTurB+vk+/G7E+0yZdkGQLaWbHF1lfaDH+zxW0srj1F2O01lyEZchNHzUYOO3RU1T3HPxd7Dm+52NLi5XJJpVqmXu9cAcyZ9PZcLn1+2PY/wAv6NNYcnnym+5PaTSL2/W55XN/YvzYInd7xC7CIEInXRY4X/3W54lV11stN4j3EiHoNTy23XcQJ2fhuwGFwSxD+/LMnWigLM2OfXXK9Rxu2yOTk9zt0dtZHG+S9AEMAJwoMt0HklFDKY3vhViWBUJg2xbtTofVtU083aNULSAMmcmSUAVEKkSDsedKBQsTSXPMTOcqGW79yTjL0xuEUcD5k5NMnVrmbg/dy70efJjluU2WZjbj7FN0uh1+8707GKwWUerKUTXAAa4oTRsP6/sGaTROcdNH/0yuatFYdXn5ex/L4Na8SaS6t8R3PvFztu4f4tStE7GlmoPv3IbfD02CJPRJBSQWqUiRK2a4xxN2Ua7muf+TD1IczDNQy9NrewYjW8ukiw5H770L39c89rn3pBhXHYXRtd/BlRUApgpMY+/5yL00N7rc+OXfEfZtNpZbDNdLgGBhbokzx2Y4d2Ke+z/qAI9+9t1wO35CLoQglZJIx0aERlXvara6F1SkpSZ5CGHBP+IZ//H1/8ROCR7xrCNoEfLjG/9Je03xtJfen0c+467m24lC4z+OlKyurKy4vcY902m5EAuERqDR7MUCSmq4qsxUxqbT7DNxZpmF6TVCFVHbOsiew1Xy5Syddg/HFuRyORA2MzOznde/9hXPOHbstl8DmL/MIAhjge7VAgbEUKYa27EQljDXoyjC9yIzNZ1Oh77bZe++A1y8ONZ87Wte9pzTp078KunB8vIKo6MjkKzrQEJu9mZtCvtJA5PlQCCMiO1I5ubmeq9/3SuefyU5gHXkyGFuuulmisUiUqZiSOOjlI45NnDMNQwcA6TZO7E1eRbmF5qvfMVLnn7yxLGfc3UgAAYGBoavv/7mH9W3bD0QxH7FGcbWGfvg0jH/rsScJ3shLGt9fT380Ife+6ETx+/4HpAHAqALdIC+MCIQJyfzMSoxqQ04gA1YgEhwdWiAuB9+HD0gBYRGAFwjAt6/AI6jkGgTk8nPAAAAAElFTkSuQmCC";

  // old icons - low res/pdf-24.png
  var pdf_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE7klEQVR4AYWUA7DtThKHvwnOudaz/da2bdu2bbuwtm0V1+bftq/te5CbmeneU5nKqaw79YvTX08jiaoC4L080Ht/Mqml+aff+taeh1x+wWMPD4+MbGTWNxoZC3sOpPEtbnHWrV7x0jMRSVFFgcquOIqSpEk8nqbJzwEKQEf7W63tn0qt3m+vvo4XbSxQ31zCLcwQrW4xd9u7sOcdb+fgkUO3am82XqgK2gUoWggURUUxkXFjo0O3iiJzeWKMAaVGT2/NXn8t9Y+8j/rMDdDbR5Rblu55H/a9/b3s2bOXbLPJ/zUDIpp473uMiUguv/pqkt5exprtjvP3M7g0B/2DaKPBNbe/O/XXvo3du3ZjswwF+F/RV65LSx56pztwk4OHdv3wtjdPBxemYGAQtY5rb31n0le+nj17d+EyobNCTMVxCSq96XaGioTLCiE54+EPox6Ze/VPXQNxhDYbXHX8psid7sbY+PU0r7oiOHAOogjFQAHSwBFFREhOnobBIVR8gAeRDO0c69C3Tatt6XEZ19/zgcSPeCxH3vU6jLOoMWBzWre4HbXIkF58Hj5KEFHEK94Lklv8x7+Av90di0CCaaGkaQXJHPlqg/V73IPBN7yTsbVlEE+cJAHgHbVjx5HZWYhSMBGKIsUGXiO6ndVR1RJvInIrjN/hbhx8+3vYvXsH2/MzYExXKFg1RIeO4s78Gy6p470GOcVZJRbtpgUqNbjy7xfC0IAc/eLn2LVvHzazlbEBKT+cmYYdu7DbDqdpkRrnBN+Ryz11qXRRsVEo+e2NT3LTo0f/eNf9+2hnOaRJWaSQYwXJPVlap3bwCNIBeOML584r3voCkIhgKoAQlSH5wHe+jqqubG62LSpp2dPOCxEGL7BNjN93GLu6jtz0ltgLLsLXesIKrHQAQq8ohhIA2q2Bl1AYugOCihYfGzVItk37JrcgbjRw3/8+8tKXY2cXsddcX3RTqINHJPS/dFQlJATrdkH5klglEiXPHNlt7kB8xhnYTor85DTJ699IftHF5OMTsLCEjk8jzmG6PiptSrBK7gLMb7uOchq3uT1R7sk2Gph6H/KXM8h+/Ueie9yd5PhJbP8QviOxjkjDz67rvrKCMkUhj15oakTrbvcivsMdiT/zeVhaLlrVCUVa3Fe/jaZ1ZGwUv76BPOMpqFTn4D+kCA0Qydps3fxWxDe/JfF3f0h7fAqX1ouW9BL6XzydYxuZ3QI8qtJtU2MMtVpKmsQVQFlk8ejAIANDw5jxSVytTny3u4FXoo5ikfCbULrpwHuiwUFUPGmtxtLi4uLszA3z9XpKUmarO+p5TnL4CCMf+mCRKk3TygAFp6FTwj3rPGlq6E1rhY/JyenGi174nKdeeOF5swBJHMdY6/7ZiQoCKBTAEl5KylwbaG01yNpNTpw8xTXXXLvxguc/8/GXXXrx77o1WFhYZPfuXRAGrFqLfx596QIgHMOchJ8i09PTrRe98NlP6jj/LRVLbnrTm/DpT3+GxzzmiTRbLaqRViESjv8MAvr6+rnqyis23vWutz3+kosvDM6rgNXVVV760pc0hofHzt+3/8Bpa61TVVMEGAimXFmZ+/JoTBStrKy4d7/7be+++KILrgBOAxZoAg0gSwCzvr6+8ehHP/zBaZqOqmoMJEAMRICpqGoaGsjnHWsBfYAlyEMo4z8ACvzMwwdMEzUAAAAASUVORK5CYII=";

  // old icons - low res/png-24.png
  var png_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAExklEQVR4AX1UA7AkSRP+qqe6n9e2vTvz/2fbtm3bNsN74fMFjuELnC+wtnef7ffG7J7L/mIqoo45L1+r6svML78sXS6XEZrvB2f6vr/I89zCM888W71t29ZLJ06cOK5QKPjJZBJTpkx1jzzyqA133333elnnQqz853+8BmVoV0daXVd/DzEGEJ+RyeS/87yqugMHGjE6OoJSqYT29naMjIxg9eooXnnldcydOzsaT6TuDPG4j5hypYfw8pMIylGlCePHRB1H7dVKqfCjV1NT4zU2NuL9999Gf38famtrkc/ncdRRR+OFF17GtGnTkEikoZjnf5gCgqCspcpqpRzogwcPQsCRTGYE/F3E46Oor28QsDhisf/hiSeexuTJU5DL5Qj8n9lbz8b0EUccgZkzZ06ORmPu8PAQxo4dS7DFi5fi4Ycfw9Sp0/gslRKc0LwvM12a4gcYcDuCPv3008PNJ3V2dsDzPOF/FIsWLcLtt98ulVUJXT0wFolECCrlVxpKzgnsOBFUVdfKfQAGq7gWpUCUojo6OhCq5ZhjjsUDDzwkNNUinU7Add0wAQLv2LEtXIvDDjuMz9oBioFPUM+tMhQZRdF1qJZisShqGcaxxx6HZ599URpcLb0Y5uKmpubwyuCZTIbqWr9+PSQxwsyePRtaRxAImDIBLNOO4zDA4YcfiZdffl04n4LBwQGhw0FfXz92796NcePGkR6jrN7eXuzdu1fWDeKKK67AvHnzKsCmwVYPwmwmTJgYfPTRp5g2fTqy0lBZTFoElOCTJk1CKpWSquLIZrP8XldXx6qkb+FaK4A4f6DrWCyGhQsX/jpjxnTkc3kABGfT+vr6WN3w8DDpEXDbKYh9+/ZhvlRQLJXhByaA6bKC/uKLL8KXQ4lEtijNcgFFTjdu3IS2tjY0NDQQyAI2wRj8q6++QhAEuOCCi5HJlcAAFkkycYHNn5lEVFV5oqI0JWkALXDOhtDGq/SGQUSylK4dQQM0gpN7gEpZuXKVZFjC77//DhECgcX/RpEcfjjttFOldwXZ74gzgJGpHcBwxz+WP3XqVIKIMVMbXLKnohYvXoxCvkC+zeDBwNsVWBQZFfEqYKRJTlUOmQkkA0iVkRoABK+4bTZFgHWI+X6Jw/Twww8TqLm5Ge+++y6l+dRTTyEajZJKObvkWiRUmL1JzvNcuDpiBYA9JIqNdhwlM8CJxXHHHYsnn3xCss9Bzi+hJ8f1QeDzuxPRKJR8uJ6Hgf7+/u6ult6qKhfasGWazMVOOLUNfKazBz6OPe4kZpeTIMyYlUojtSMZVwl4BO3tHam77rzl2u3bt3STIimfarHPcu16Fp8VXauwH1wnfCu5Bqw0lcpJ8AwWLlqMQ4ca43fcfuPle3bv/AmmB+F5M2XKZEGwaCIIrArMsUzndyPpQAJFtEZnZ2fmrjtvvkrAf4RlesWK5Vi79gNccsmVSIvOCWLcCmJUYgcSEyrrcGD/vvhLLz13+a6d221wmg7PmXvvvSc1duyErdNnzFxSFL5ks5L94oygTGWcUnFzVcpxhoaGSi+//NzLO3ds2wdgiXhRPC2eEs9pAEqGKX7xxeefLdoeL6CRinzDqyOuLLeNJciMFMQyYTEgON0XD8TLfwD2b6viX0EA4QAAAABJRU5ErkJggg==";

  // old icons - low res/powerpoint-24.png
  var powerpoint_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFIklEQVR4AYWVA5AkzRaFv8zKqmmPZ9a7z7Zt2zYDz7ZthOPZtm1rzcF6+G/vNKq6KvO+jM6oiH78T8Q355buSU20EhEArHX3tNZePUriwYff+LLKfbNfPXTP3MREf6uw2aWUi2N7YneVm/3hOk9+3u+VdTEIAoz8GboTTGyipTg23wVQzjlEZEe3mx13ZqyeXzhF67uvI1r/C1nWI11vszB5Fyaf/WF27N1NttVBBE8Z4H1IiBQnKK2KqcnWjbRWh41SCiAhqSbFuRNUvvgmks5ZJJkk0QOWrn4vph71Pubmt/vmXa5UCpwTY62tKKUxh48ex1RqTNsOY19+M43OFZBMw2Cdhem7UXnYG5mbnaPI+gjA/xv9yHUpc9873ozr7Ns5+4VHXT1udNYgmUXyjFMTNyZ62CuY276DIk0RFYUPlSAQGpW1ViAWKQpEYDTB/OlFdyaO5E6VreNYM4YerHBy8tboR76GuZrGHf4hBoeIAivIEEfwcN9uXiLfez3Uvmsg+QAEJIBpTk8heaqytQGJbLE0f0/iR7yaWdPHLP2eeNs8ygcr5zwWshQZWII0Ko7InGL94jrR1a6FDIQgGWKyviCZI1vpsHzNu1J7xNuZnRxHH/0FZrbF4FefRUmB7fSw0qB6rVuStFpInoNSEBtUkSKRwrmwB6MyUmjynmV5/i7MPOa9w9NSnD9GUo3BWWTlBKwcwVX30D2xyOYvf83uJ78EowuwFoyCbobUgHKDEUrphd/9laWFFTf7jHcyt803H2ThwVgdHVeJb/ZQ8tzQ8DObeszrSc8u0T34N1g86DkECwdRq+cQNC6couAwRH+zcWMWrn7Xn+/YHpoLhA31qDxHuin99ZR8AL3LOUXfoXddj6KdY5dPw8WLMDxl4WSVMERhXv/RT+JENrYu93PExYj2JuChs4moOt0roPv6J5D3hdknvIzmvR6J27oPxbll8l9/i2JlDbm6LY9vcIKMtS4kIiGUEO6Hi8rauNY+uhe67H3HR2ne5p7o330S3vpw9F2eRnLLe8Mt7oRbuUijn7OVpiDCaIImKNwfeShpB9WawyVTdJdToont6LEK+PsUKSzuh598ERD0/DZcMoaEwQ6BgCEoPCDcdFbAOpi5Bkm0nT2vfDPJ9l3gHNz8UWCm4NQh2HMNQDE4fpTu8UW4yS2RNAVACBgoJYRg786BqUJrJ0l1mp3PfVVofnkTVs9DYyfc9jpwg1sBkP3jr9hMoZQa/T/4zyWi3CDrQv7hb8PxX0D7ImgN49MwNQd53/sM5YeycBiqDcolAkiSmCQ2I0tUbrJzSGRoL/RQkUB2AKJjyPgcKA1RjDgNf96P/PUgFAVF0kRNTeCcJU4S1lZXV8+fW7w4NhajiqJARPZdaveOO+visBMKXyNOEEKoswWChHtSAnlRkFTHqNfrIMLp02c7z3rGkx/897//5ScAOooiyhMUCA1RgAaUDF2ZCBUZ754oAl9rXw98wPrqKsZfLy4ut5/6lMc9JDQP0isr/qGJYORHI2z0CFLWLiDiCe6c9VmGs2fP9p71zCc/6tDB/T9mRPq6170On//8F2g2m8Rx4okxnjg2njhgwr0hJhAP3VCr1Tl/7nz7KU9+/IMO7P/7D/g3KYCJiYmZz3zmC9/evmPnNfM8L0REieAR8HV5AFy4pnSltN7Y2Che//pXvX7/P/72daAO5EAX6ACpIoQYP9K6Z1JEIsAAUbkLI4xKAKy1A68ekAAFIaBPCMn+CR1qUHu5CaJ2AAAAAElFTkSuQmCC";

  // old icons - low res/quicktime-24.png
  var quicktime_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFPklEQVR4AXWUA5D8ShfFf510Mlx+a/65+mzbtm3btm3b9rNtm2tzdiYTdffLf1I7laebalZyTu49p640xgCglH5CMg65rh2+98vfyf9r+FHPKfSNtpu6r+J6wGS05jyorM99/xPvdY4ywjGAITulqzZIR9rTjiOPAmgQJGPA84J/5DGlK9YDznv0a7h5TWFW61Cp80RriW89eoiR4cF77njBG0i/wQDNvQFD8miDsETc2dF6T8sSV0khBAbcoi3cqyoBr12Ey4wkXxbUlcsTWeLHDxymr7eXihcgSIHvNARobaRSKi+Ehbz+6qsoOpL1Yjevmzdcky/TIgRVBM+sTvPdB3XT3d1NPYxTaMOd/33mvBfyno99Cv2HJ7rbPv5r5/JcmVYHQsvwpAT8m5Mt9CTgfqzJ2xZSpOCB0gRac3twGiPLIMd+dhpI55FXVi2IIyrA04NZvnWwRE9PD8IYrDjgoo0aV1YCHNvmnh1FxlpzKOtIGTU0wVMiDE0y2d7ZThBpwVqNONA8LQH/5j3aE/BepFGcMrPCh6YVF4ZFiEuAwbFjHtES8tWxPIfLkmpMpjxNRzWGJAgxoSbc9XhK6zY/uGdfo+bSaP567SKvmHaIc52M3wXuWzT4kebsbc01geKZF9b5y70LjJds6jpDkAnpAmEc83Rnhe88aKRRllhp5je3eefNEOfb+cCo4ENDgrJlcKTkOxcvJqTFpGwhb7hIcfzDWhGA3tOAjAbXX3oNbbbWX3/yfvr7Ure0OIJfTu+yZtp4cY/hC6MWlUijLZv/XT3P+y73uUdfnr6wwuXrRU5aDnlin6Sm0gzSh8aQD73pGIYPT57S3/8Q/CBACPDqASdsapAWbx2wCJTBtiyOv2GB55/j0d3Vxa8f0MIxN4b8f87j1CWfJ/eVaerQVFkgf/etz5FcblQq9chgHIHAixVznqalpBlwDaEWRFHAhy6uUWzr4O8PKjFRsrjUBfyAVS/CkBE6UySpVOpnME0Pu7ZFhw1LXshWmKOzAMK2+fSDB+kvSCZLolGOzWodIkWLaAqMTkaWQUIaTR8DZdfhoR0uV93o8+dpmy/cvcx6AI/rdYmVwdcCNw7469XrYJV4QE8OlXWRydo0jUztIDCCl+8v8csbt/j65TuM5xQvOlDCYCGloOp5fOrUGzlt1aFYggd1O4RKo03a7Jrw2QyyJfJjw327S3xkyucz5+3wxlMSv1+zyX3bDH4QcfJcjYvXBNgO3m7Ap89c5juP7kMYGiTZyJYIjGmKVYsN77lbOxLBVy7a4tjrfY6NIlCmATzWX+CJwzl+cO4ap1xXZeUBip6C1fhWCIHrOjjSzhBw68alDfgY3n33Np4yVODkeY/pSoQtYKLd4dHJXW9eMFq0mPGg6FiNv3dcl7XV1dXFhZuXczkHuVetrMjZxrUTaIZLNq+bakWQvhcpTT3SbPmJNuOt5FwLLfNoLGZn56pvfMOrX3LJJRcuAkjbtomiOOvhbF9vjEAf0SW1c9aOAsH6bhXfq3Hw8Bg3Xn/Dzutf94rnXXnFZSc2NVhZWaWnpxua5eF27Te9v/0A0FpjOw7z8/PeG9/wqhcm4CeQCTk1Ncn3vvd9nv3sF1DzvCxAlgS9d6ezBFAslrj2mqt3PvnJjz7v8ssuyYKnBJubm7zlLW+utrV1XtQ/MDgWJfUyxghjECZlEHuZ6fTcXIWwrI2NjfhTn/ropy679OKrgTEgAmpAFfAlILa3t3ee9aynPclxnI4E1AYkYAMWIDIjGwZAKRUm4QFFIEoHCtCAuQUihJJsv6/6mgAAAABJRU5ErkJggg==";

  // old icons - low res/sourcecode-24.png
  var sourcecode_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE40lEQVR4AYVVZXfjSBCskWdkWgrZUfaYmZmZmZnhPxx/3PsN+/WYmZn5wnkb5uXdOGaQfDX95Bcdd155njRSd1VNt6KazSZs+H5wEXGA6+rahg1PJ9av77nO87x1lUrFr9VqqNfrJpFI/njppZf9wHcMGM0//8gaNKGNjk0bo98DQwVBAL7QUyxWR5Vy0rncEkZHh7Ft2zaUy2WUSiXE4wmcc8752HPPPeWanIhmmJurwKbnHysoRzXa29Yc7ThqWCulwHBjsZi7e/duDA8PoFIpw3VdqvK5xnHqqWcgm80yeRn/GwoIgqbmuwkShh4ZGbHJyDKNkZEBSZpIJFCtVoXVccediK6uDGq1ujDEf7GPXLfCueCCC3Dfffd19fb+YkqlIqwi2kY0ccyxxyOTyaDRqIu/jhOT/RXH8ZfkEEQr6I0bN4L2nL1r1y672j1JdOSRx0hyMrcHDGMMZmemRG0m66FWrcGJOdHk4RqqDKHb2tpsAmUtYQjDE044XjxvNBqYmppgco22tk4UCstYs2Y1lpdzmBgfZaEsSfRErBJE9cGx7NiG0jFaG5x44ql8KcuiDWGQSqdoVx3z81NUqKSLpiZHSSSApgLHceDTUsZfi0hoPiA3kskUTjvtTLGF84AZ2hEEvlXHfd8qIyCqwvOlkjymZ35AKpXCgQce1rrPiBT47bffrPfBpZdege7ubvHcBj2nqgqLSEK0d3Ri9ep1Qmbnju1UNIMtWxZJoMYCSUuGCBXIHwTO2Ni4ZfwFpxZ1SW4fCtDe3kk7KpJg3bp2dHZ2k4gmDLyePbmfkXmxQ7jXXvuHyVcAAVWHN/ZZXi6PMrGxSWZmp7FAhrZjOI04gPLjbkK85rPiey6Xw48/fAUGC1VxyCGHY9/9DoRYCiCbaTveaP2bY/0mQuaQGYgbl92ytvWyDB+3ogcos8HvlOyl2Qhu3BUVgX2Ga+sYHITR6uMGX+jk5O6330FyBhw+qpkV1lprORtAYWR4kNNekfsnnXwmPG9PKbpCQgCNMGQDYWW+NDDQh927d8q3aHp6EoVikeeQJeMGpqcmsbg4Z5PzoDfj668+w9nnXigkhb2kFqwUaFnEH7Gp2/PYNatQo6fjY5swOTGG0U0jYdsGUMphax5MRXEpaq/9ph+dgb9bBFEB8TWb9XDwIUdgNz8hxWKBXdMuFtmD7+jokoGzFh5+5LE4+NAj0bCDGTYBg88ZuEZHLMJfvoqUWg2q0v/KUTj2mJPw5luvwFEKZ59zIb799ks2who5B7/hA0qSwJDAdv4zWVyY2hKPGyhOprTpUq40GviBiXYLCCcWE0Wsh7nZKfHd8/aQfSglXWa0kmmGimF2dq7w8IP3XNPb++unYGhOMX2VIoJIAQLw7R5EEfbaez+uQXgOQliGbalcxP4HHAQObe7BB+66YWiw3yaXcLZu3QatY0DEHkQ+v1HUa7Uwue33oNUQiGnDT8d86eGH7rmZyT9BJJzDDjsUL7zwIjtmNYxxCQNNGCM9D4GWexBoAYysmtaksbiwmLv3njuuHujv/RB/CUXwW7Ou89lnX3zH61l/EBk2yFCRHCEyVKsBglBda2VrOjt37mw89dSjT/X3/f4GgDRRJ4pEgaiosIgm0zTRxqSxcD7s6hAqgmiwirR0jVEC4BKNsEA5LFL9AzpAav1/iVa2AAAAAElFTkSuQmCC";

  // old icons - low res/spreadsheet-24.png
  var spreadsheet_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFa0lEQVR4AYWUA5Ar3R7Ef2cQbdbMXvPD1bNt27Zt2zZLz7Zt69q+a4bjc/4vlaSm5vHrrd5xd7oPHBEBQGtzF631zlzOjV7z1lcU5qf+8YDx6YGh0Fc68KEcb3Q3Dl/7p6ff9bF/1GJcACH7r3s0guM69kXXdb4P0DFoc9rzwq87Kt93fvkchZst4C8vcWxmiWrNcI17S556j+exZdPGAw2v+RQREJGetiAdgiCIEZSlkpHhgQOWpY47SimAXN4u5marZ/nmuVfTlNOM9jvEScANnZvznNu8jKnJKRpei+uEAmPE0VoXlLJwTp04TSFXJM77fOPsa9GF84wUSggBewu34jG3eCUTExMEUYAA/L9fn16TwrnlnW7E5h2bxu/y4v1ulDvNeL5tphMmgpvwwBu8ispUBS/wAIXqCvXOBREFAlbnoEhMgghkHZynfOxeYHHbS7VzFAsKIz6b9c15yN7XYIoxv734I/ry/SAKbYTEdCYEunMUjCjWmg22DW1i18RmoiQGAenRGRsrE0Sx8uZtGoFPJb4lD7nZq/FzdWZqZ7l2835ELPzEx3YslIJW6JEYg4hg2xbOsmFtbR1rcisi6Yzq0NGhImmzXhP2D9+aJ9/sVfQPlzk9/1e0VebtP/4Y99x3R3ZXtvO7Y3/n76dPcJcb35z+wW6VtqXwdNA+9mF6plk4Nnl0bNhTvBnPud0LqUxWOLt8gnJxkGJ+lF+d+zGrwUmefNMX8M7Pf5qt49Pkb+dSjWpESYQoQz2KGJEypPULqcEv/n6Fol0yb7n3K6lMTRFGIUopSrkyI/3DvO5eL+Fbx9/JJ3/+NiwpcNc7X59D1YP4cUisYxKJccMyo86GNEH3jw6dwcuTbNu19ZeVSoUwDLEsG8QCLBpBnRtsvCXr3lFODn6Ve+x7Afu234ifX/wFc7VZWibAcS1GUOBAugDTUVY4n33fxxCR1XrdjwVxETBGOvSNx/pawJu/fZS73TRPVPojOwYfzua926j66xxcPMqvZn7LSmMNM5Eg9AwyJTlad2OB9Ey7x2bsoUXzmT98BV/XuM30i/jhmXfgtd7PPa55FM2kxc6Rbdxo+vrUWi20pwjjCCNC1sGhizReNwHEGI7P/oyF2k8YKee5tOpz48ojeffPP8pkaS832nKAY4sn+NX6b7jbrrsSBwoxJtXouWQN0qFBGyHQAdevXJ+bVG7CfC1ksn8b20Y3supBI2rRCBus+2vsGNvO4uo65y7PcptdNyGJAlL5bIK0IoFEGxzb5YYb7oarcrARjBiWvRUefeOH4loOxxZOdIxuMnIjfnbkr5QYSPeiLLIVQS9FnCSMl8e74kBsYkIdApCYhKpfox7V2Ty0sfPOnxf/wj0n74HuVaSUIpdzcR07Y9BLYIyhmCty6PwZLs4vda5BEemoM+/L+f72MeJKbZ0+N6S+dILNuR2UC2VEDG4ux/LS0tLc7IWFfN7FAcnUI53lPz043k4wTG+GpbFFSBfTDSf3dmoLoogbV/ZS6itigMuXZ5pPfcrjH3Hw4N/mABzbtonjJBUSun1bykLZChFJaYROfMlUoeOYxXqVHYO7OHfmbO3JT3rMg44dPfwzenAWF5eYmBgHSWuCrljGVBAj/2YmKBTaaGzHYWZmxnvqUx730Lb4T8nAufbaa/jQhz7M/e//EFqelxVBMiamd8waAZRKfZw6eaL22te+8kFHDh9MxVODtbU1nvGMpzcHB0f+XpnesDtu9yUiSgQlXQeVToDudXpUyrJWV1eT173ula87fOgfJ4DdQAy0gCYQOICqVqu1+93vXndzXXdYRGzAAWzAAlSGWQiA1jpqwwNKQNyjBgwg/wQyt479BloqNgAAAABJRU5ErkJggg==";

  // old icons - low res/text-24.png
  var text_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEJElEQVR4AW2UA5A3ORDFf8lk/lh/WJ5tlc62bdsunO9KZ9tm6WwWz7b5mWvMJH3/qa6pfOqtt53q7Pbr9yaJEREAvA+7NLB6peImrrrm3Fr/lEcPmNrT1jE2Jn5kfITmsE66Uvv+Hx+7x4UfefEpCALEX5qD4FKX/JWm7jUAE0JARPqGh8d/cabePLP/e1749lh+mfYDA4OGhYMjrNa6Heft/QQrrbA8AyNDICBSEoiuRSklCMaafPKkto2sNT84YwxApZLUKzMWfMMrPx5Kf/YnHa11sryflZp34JSdHqO7u5fBRnMT5112GAhBnPe+ZozF/fzjb1QrzfjqbF754XCy5G86WlroN0OsJXtw2GaP0NXZyXg2jjUOKS0xYEoVRlAxeQOFI5HPbb3jeqy0Wlfn3ue2pmPmDya1t5DLCC3Z+uyyycXU2oeYMzwHtUWtKXPQteYQqKdTSW0zSIgEZ97eiU38tv/N/ZtapUpgIT12a3Zb/2Ymd7Y1Jh9Blm6uBCH67iVQEkaA7e5qorWlboaHE+YuHKBldDt2We+6RvN2smwCxKIwFFnEKMp1MGVWlegPKFw+IUxMBPqHBtmgcxeO2PJeWjqK2jjC0lNLgFAqKOpBrQqakaAEZVhjDbmfYM2OHTh5l8YH7eohy3MgAVkagi3Xqoi4J6VlIpHgg4/+5NdfJZyxx4P09vQyPjHGsj1HESiyTq8K4l5URGmSa/7vCFZba8UPenvL5oFCEWWTeFKIFpV2RJt88NScRxL9O2UzuEfvfqwozBsYGM0Q0hByRicWlBMSQnliWMJr3StruS8I2qm4Fu2NhvM+KCM6DVhS2xanN+ikRrRmtaHmSOatx5pEL1qIDE6TTgs6be6zqECt0KyKYm0Ji3zQYQuAIhLEDwk4jFaxFNOD0X/CgNaKPSOAqtM3zai6+JEjASgBGCAh1kq5JXvMpXRDAS1FBUtbhFBIDnjvSzXxUoUlL1lpndYLe/TpD+jznJK6hEhQKhCDNY6gRaIdaoUFBGWXwhr0w2MMBkuaVpg9e9bs6dP+nFmtpjiQaE+cdtkK4uTlHnmWU6k4WppaaWtg9sw5Q6eecvwRX331+XQAlyQJWZaj3qnUsUxv85KnJ76iWgcYHByivdrB2iuvzo8//9R/0olHH/T9d9+8iwZm5sxZdHV1rjx37sAvPvgUDMSnQsGSD13hNSjBIHk+QeLcyDFHH3bAt9989SYxsOuuuw7PPvscra2thX8450hc0oAtsiJJsAWKWlKgqOm6Vq8xbdq0/uOPO2rf2DyGAejo6Jj61FPPvdLbt9yaWcMvETEiNCBQrImeF4syG2PtvHnz8quuuvSqb77+8gWgGciAYWAIGDNKgkvTtLmBSSKSAA4osgVMRAxAALz3E40YASpArgSMKgnj/wPVLbMxJpf9iAAAAABJRU5ErkJggg==";

  // old icons - low res/tiff-24.png
  var tiff_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFQ0lEQVR4AYWVA5A0yRaFv6zKqh7b82zbtv3WthmOte0NrG3bxm/b5ljNSmxm1B/dvc6JU47z3Tn3Rraw1gKgtfmT0xdkLEvXnnFGzZ+2bPnfp1taWrLZrM5PTDDU0RnJb3xz5pcOPXSG0DoCsO86pGdjkZEMN0SRfAZAGGNwkL5strjKyKg+2b6VxnvvRqxaSWFyktzAAOu//BU6Tz2D/s98iuLElPseJ5va+rOXf+b/HEEEQrW1Nn07CMQyKYQAiMlkYrVlMzX330s8NoJtaSFOEjb+5Kd0H3ci3T09zjzLxy4Bxlipta4RIkAuW7kSWVNDe2LIPHAvDYUCNDXD+Dgbv/o16g84mK6uLpJC0dcHH1V95b685N9/9jO+8qlPdd775z9H9fkctLRiSyXWdHcjd9/Lm6OKRQhDrIwA/HtQ6gPMwauaIKfttx9xEPw63rIFVVuLNJbVn/yUM9+bLheL9h/HGZKhQZg1g1Ab+P4PcJmlhg5mjan0JSWWYbKprQ1TLIrC1BTGac23vk1mD1d5by+lfAGzZhXCmfHUE7S+/QbWAUqbNzLx/z3BFRV86cvYIHAQXQaky+Il88UixuVeGBxg5Ec/ofmwI+l0sZRc5vqh+2me9ia6uRWtEnSmBtc8jOtbeMHZxDt2oH7yM5JDj8AiyoDqFfgHygE2f/2bNJ5wMp2dXanJtq00OHMhI8TYKOHQEDpJME52YCfx8DA6DOHVlwhXrsBGUTmWaojcMGsWtqnJ9F96JR0uFg/DfYwDqa5u2LoVoxTmu98j19ePMJZg8ybsm69jfPbtHVjXs9TYVJoOXgTPfPKTbPzu917r7esrT0viqlU334AeHkHlsqivfZ3Rnj70449iHnmQxJmWfvhj1NQkpbEx8pdfgvXQUFY12ksQnHnbbfz/9NOGC4lK/EOiGLN4EXVvvErgolHaUPjs5wiffJxofBw7OYl97GH0F75ICYEeHcU++xT2tZexcVw1uumSWpuUiK3MsBA+Kl8Rxo9hovyUUMrlfH8IGhpQxvhvEO5e5/PIIG2ySd3LhIB0VebYxRR+6zuYv/6DUiaDymYxc2bBP/+D6egEP9b/253ctLexExOYOCZ2Yy1+/2dsvlCJiFSyAkhbg9aI5maKe+9HYcZ0ImMws2ZgXPX293/CCEt+xjTCt95ECwHakDn0KLSDm1w+NS/bUwFUR+TlR5EN61Heo5RgXcV62lsYrQmLJUwQYAC7cYNvMKajq7xlVNa7I0qNAeMM5ac/S+j+dTU55bcFVHu7N3cyWHfNpz6FyU5Ru98B4CK1vmemAojjiDiSCKW0f/iZ8YnsKqNtVN64EFhf5fKliE9+mrFrriC56XoPoc6Ba049G712DcHXv4H2HjrdKmQUMTgwMJDPjX03k4m2OYDCA8bGcw5gHAB/X8kyirHGoP3Ivvk6QiUEP/8lprUDCyS5LFEoqKurAxGyadPmqSMPP+g/CxbMfRlAeKMkUQ6QfR+gskMabBCCmyr/zORzmEQhhGByapJCPsvnv/AlVq9eM374YQfstnTJopfKPdi5cwApQ6ja16mYpwKsUn63dZr01+VvjTGEMnIb65bckUcctGeVeQr42te+yn333U9jYyNRFDtFPkd3lv46lfTPdkl67XompYumnm1bt40ffNB+/168aMHzH/ALCi0tLR13333/U719/V9KXF6uMhddGh/+GptGk96Xz0IEwfDwsDrrrFPPWrRw/mNAPZAAWWAKKIgU4ouL6p1anWno7wF/DgBR1ruXBdBal9zKATGgSAF5UkjxHcHfrgeYUQvBAAAAAElFTkSuQmCC";

  // old icons - low res/unknown-24.png
  var unknown_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADP0lEQVR4AaWVA5A8RxjFX/d0z+qPi23btm3bSdmMy5eydeUKS7FZjJOzbfvW251vensqvXXT4Zt6++3o16+/EdNaI1Ktpq4lHx2Gotzc/Fr6oIMOvPOAAw5oKhaLtXK5jEqlItPpzI833HDjD3SOBEk3/piqNIQUwaiU4hOQmFIKdMKBW1ulfsZ4bm1tFf393Zifn0ehUEA+n0cqlcbll1+FQw45xKxTJrK2bKrGgI4WpcE4q+65x67TOGfdgjEGUhgEQbiysoLu7g4UiwWEYUizqlFN4YILLsZ+++1H8AL+VgxQSgs6N02BIXp6egwslcqhp6fDQNPpNEqlkkl15pnnYJ999kW5XDEJ8VfpnfVY/Oqrr8aTTz65T2vrLzKf30I0I2obWeP0M87CvvvuG/UfhmxB8MJh7I4gWlpaQO25bHl5OapmH+cBTjnldANvSB5XH9xUe4y12GOPPaKELGoJyczg7LOj5PvZ5AlwsyTCjevSxjyC0G1o7hghJM4554KGtuik5ApUk+GxY3GS2ZDJZHHhhZdYeDUZDsCfHI6da/Dbb79FvVc33HAz9t9/f9Nzb3LAVBeUOBOzwJgPDAxGT/F39NSi4sK1D+7a3yYYMzC74fD19UK/1kpuT+69mP5tAPbbd4+zpBC/CUpvNjYkhy85/hauyLY/RgJW2+Fw4M4D5IfHtnBt7AygG1vjTQ4vXEVV2ZDWAlZxi/C3cO2HW7sStv5/uPpznTGGMJSQInAGgIXAC/fY9oLVqwxDLNDHZHpqZDaVkhBmKxyIe8FjQAzDdnilWoUUDLlsFmABxscnNp979okHW1t/nQaJ2zeoZ+po7K9qbAvJfJwWFhYgZAojI6NrTz7x0B0E/xpWfG5uHkIEgNMeJD36vv4rhUBITE5O5p979vH7ujrbv4IjfuKJJ+Dtt9/Bzp07IWVIlhBkKQVZ1i2ibdaibmmqQDabw/TU9NoTjz98W0d76+cJX1Cgqalp7zfeeOejAw486NgKvUopGaNwzM6GxTeAsrOLK2OcLy0tVV999YVX29t+fw9Ajlwhb5E3yUVmBxGUNEfeg6CBvX2jysnMsStNjr7hZVIeQEiu2gEKdpDSH7J0FR0Z1r54AAAAAElFTkSuQmCC";

  // old icons - low res/video-24.png
  var video_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEtElEQVR4AYWUA5D0ShuFn066k5mdtf3btm3btm3btkq/bdu+9l18/tbeYZLu96aqK7WZ0j1Vz3jOqX7PmygRAcBad39r7XXDyCSf/cibKg+48YWPvtbM8GDSSK1tJKzWJ02ncr3/3vC+r/yPEmdAEKD0AAhO0EaHJ4zRvwJQzjlEZLrR6Cw4KrW0vkTf5ltxh+eS1BPsQZ1T7XvTd+ePMzU3T9KsI0JOESD+tfhIcYIKVDY81H+LIFCXaaUUQERQjbKDBaorr0OzgI1iTCXhdOeB9N/2w4yPT+XmDa5WCpwTba2tKBWgL7t8AW16GKnViVfeQE0vQ9CDSlscS+5Hz83fm5uPk6VtirH4R0BAChBECiiEfsj9b88Nrz839q33XctU9ZWIqoFLOH5wF8x138fo2DhJYhFiKIz8iHwCDlSGuKwIo5yg//edR2GM3EN3/kcqgqHB8cN74qZfw1DyHbLlS3FZA0QhzjuII8cCVahcEzX5dESPIJLlSNfJ9MDYJC5tqvZuCmFubu9P5YbvZSQ+S9oYR9LT1MZuh3WAgDjBmyhsfZm2uQFh/WJk8H6IpDmCl5CDTtsWSVLsbpPTlXtTu+UHGBsfo71zEta+QjBwO9qDz8VZ8bMvNiYMSbY/jDr1KfQN3oBA0QFl6dBpskQ4nd2b/pu/n/Hc3KYpOEs48khELMq2wKZQMhFXQZkh9MzjcQ5E3FEHlDpY+u/fycKaG7z3FxidnM7D2hBEiCiSnYvQ1Wk0qmtT/IQUtr1PunNBXsM1i+I9xbYBwQ8unefKzq3/MjU1lZt3gKIkITIGExokrIDuhTBHezAxEFONI/AXaxc+UaHf+elv4kS2Dw9aKTgjAij/gzbXgZ0lgs6nsE4gR5zDFx2gDpeoV25AxdIdUBqSttanU95vAecg2vs9OjtEslVyY7Diza2AA9fcJDq4BBl6Kc63jMspJ2i8jswBn2DpDD+JJN2jcoMXY23WdaVKGJNc8TWshTgHcaXxQJESHAVIV4lOFGrhw8TNy7HO4rJ2iRbOWezOlejz34kShwOc+BOWx6QphBSXucdmcIO30GmuYWyntIbiyYNU37Vxt30/1oKUii6pfAL/IKXDJRd9CnWwhOgqBCZHH6F7sHsnyf77QSjC3VFAFBkio0sdFCUjvqwsxcw9CJe2SLeWcEUHBUGMUzHx9R6JZBaU9zFRxObGxsbK2eNrcWzQ0L1BAuAsQWWYThYhJ36FWfgeygWI4+iGl2WE1WHqMw+nt3+W3h4DlT5OnTpdf8Hzn/XkCy44dwVAiQhpml1zb7+x4KwzQhEUQGuNQDKcKG9arKEUfTkO6w3q9HOd61yHxcWl/ec99+mPvfSSi/6AF3p9fYP8/tN1r/cGGcQTpCi/HWWKWStI0gPCrM2ZM2eaL3j+M59QmBcKbnzjG/Gd73yXvr4+jIlyDNoY/6wDTAhRjikIul/3VGNWzq7sP+uZT33ExRdd8Fu65asZHBwc/eY3v/uLqemZ66f5vEREifjxkb8uTlaMp3hWKgi2t7ezd77zLe+86MLzfwLUgBRoAHWgrfAh2hhTyxkSkRDQQAgEgCpRlgBYa5NcTSACMnxACx/SuQpm544Dq2QY0wAAAABJRU5ErkJggg==";

  // old icons - low res/wmv-24.png
  var wmv_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEtElEQVR4AYWUA5D0ShuFn066k5mdtf3btm3btm3btkq/bdu+9l18/tbeYZLu96aqK7WZ0j1Vz3jOqX7PmygRAcBad39r7XXDyCSf/cibKg+48YWPvtbM8GDSSK1tJKzWJ02ncr3/3vC+r/yPEmdAEKD0AAhO0EaHJ4zRvwJQzjlEZLrR6Cw4KrW0vkTf5ltxh+eS1BPsQZ1T7XvTd+ePMzU3T9KsI0JOESD+tfhIcYIKVDY81H+LIFCXaaUUQERQjbKDBaorr0OzgI1iTCXhdOeB9N/2w4yPT+XmDa5WCpwTba2tKBWgL7t8AW16GKnViVfeQE0vQ9CDSlscS+5Hz83fm5uPk6VtirH4R0BAChBECiiEfsj9b88Nrz839q33XctU9ZWIqoFLOH5wF8x138fo2DhJYhFiKIz8iHwCDlSGuKwIo5yg//edR2GM3EN3/kcqgqHB8cN74qZfw1DyHbLlS3FZA0QhzjuII8cCVahcEzX5dESPIJLlSNfJ9MDYJC5tqvZuCmFubu9P5YbvZSQ+S9oYR9LT1MZuh3WAgDjBmyhsfZm2uQFh/WJk8H6IpDmCl5CDTtsWSVLsbpPTlXtTu+UHGBsfo71zEta+QjBwO9qDz8VZ8bMvNiYMSbY/jDr1KfQN3oBA0QFl6dBpskQ4nd2b/pu/n/Hc3KYpOEs48khELMq2wKZQMhFXQZkh9MzjcQ5E3FEHlDpY+u/fycKaG7z3FxidnM7D2hBEiCiSnYvQ1Wk0qmtT/IQUtr1PunNBXsM1i+I9xbYBwQ8unefKzq3/MjU1lZt3gKIkITIGExokrIDuhTBHezAxEFONI/AXaxc+UaHf+elv4kS2Dw9aKTgjAij/gzbXgZ0lgs6nsE4gR5zDFx2gDpeoV25AxdIdUBqSttanU95vAecg2vs9OjtEslVyY7Diza2AA9fcJDq4BBl6Kc63jMspJ2i8jswBn2DpDD+JJN2jcoMXY23WdaVKGJNc8TWshTgHcaXxQJESHAVIV4lOFGrhw8TNy7HO4rJ2iRbOWezOlejz34kShwOc+BOWx6QphBSXucdmcIO30GmuYWyntIbiyYNU37Vxt30/1oKUii6pfAL/IKXDJRd9CnWwhOgqBCZHH6F7sHsnyf77QSjC3VFAFBkio0sdFCUjvqwsxcw9CJe2SLeWcEUHBUGMUzHx9R6JZBaU9zFRxObGxsbK2eNrcWzQ0L1BAuAsQWWYThYhJ36FWfgeygWI4+iGl2WE1WHqMw+nt3+W3h4DlT5OnTpdf8Hzn/XkCy44dwVAiQhpml1zb7+x4KwzQhEUQGuNQDKcKG9arKEUfTkO6w3q9HOd61yHxcWl/ec99+mPvfSSi/6AF3p9fYP8/tN1r/cGGcQTpCi/HWWKWStI0gPCrM2ZM2eaL3j+M59QmBcKbnzjG/Gd73yXvr4+jIlyDNoY/6wDTAhRjikIul/3VGNWzq7sP+uZT33ExRdd8Fu65asZHBwc/eY3v/uLqemZ66f5vEREifjxkb8uTlaMp3hWKgi2t7ezd77zLe+86MLzfwLUgBRoAHWgrfAh2hhTyxkSkRDQQAgEgCpRlgBYa5NcTSACMnxACx/SuQpm544Dq2QY0wAAAABJRU5ErkJggg==";

  // old icons - low res/writer-24.png
  var writer_24_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEIElEQVR4AZVTA7DtSBTsmUySi2eb9fep9hfWtm3bu4W1C2vb5Vrbtm3b3r1WkptM/txMcmseq35XOp4+nT4nxPd91MA5X865P8GY5px32bWxF/KTB/WNTHaiUvHcko24mzYGWtlb5x617lNijS6XybW+shP3NUrpX7quvQGBoIDYukol6wtD8zv+ylo47skSXvm5Ar9ShpWzsE5jCjcdtgzTE6PIi2KQaxCZkxqBfHTPb2ttXJ0x+iEL6yZjDM2/piwc8kgGb/2rwdAZKo6JtfuzuHmvCSwbHUC+aAOIxBRxKOJi4z4nnscTlFKw33/9CXFT9/Jekh/8cAbvpE0k4xRl28VG7f/ipp0HMTrYj7Llzhb35zv3lXtRaGzTXQ9DT29vs77F2cZbqbgQB6wqsF7Df7h5hy6MDPSh7KyMuGQNRJCtfdhN8AiZfv4Pj+ikinKFYL2m/3HT9m11cfhLi0f3EIrXYyMA625LolLlRLPTsFwRS1dNvEfEIsTtRZxjcef1iMKCjFRdEOHSyZawab+DW3YfxUB/T+CcgyOVKYBSAkBtrLziHGhOJhTnUKZLvssY9+CJ0NdszeGKvScwWIvFrgZv/p8t4M6nX4dp6pgLzn0Rp4V9tl4f7Q3JQFiNKAL76JPfwaiLCw+awPjwAMpWtR5LW1MDtl13OTSNQoXncXS0NiNhmFFkUhxzeiDIethf6Olu+2p8pN+v2C5RM08XynjivW8RM3SoqLoepkd6sO7UaN05n9OHCCS8MZQvVL71OTfnNvTnf/6DRilUEEGX8+Brx7o7gvc5n12gu7ttfdPQ32DhAyp2ZK542XHw3R//Q2caVBBC4HoeimULPe3NMDVtljgXjKwwSCjdx6xcuV0G9xgUBOLDfd0YnBiV70buFYbZQVmpisujqesYHuid12Tu+ehsbVpw/nlYMILyBbPFIZgulPDU6x8jNm9MCTjnKFUs7CvGtCkWgz/3DwcE1QLqHxu+GDcNbLj6DFiYsURkQDY6bhhh7lyZIFJbQ5hGlYikA7XJQfNWHe6TbtRR5PNjiTQY05HL5so//PB9KpGIg0EuV8WjczWyRQh4ngdhFslkAj4Istmce+ppJxz6xmsvfWWaMVBCiJrfyogHsG0b//37Lyhl+Off/6wjjzj0gOeffeoey7JFsSyY4zgwDFNtrowDArx2VES5GgsHQOSRUvz3///O0Uceus/bb73+sDQtHdB1110PL7/8MmlIJommaaABGTQqzzVaZ/RMkMprSgNz6VTaOvLwQ/aoiUdDoP71aGxsbLn33gcfX2Vick1HQLxAQqdkbizqNSGUpjNp7+wzTzn37bffvA1AUrAqWBEsCFokLKLF4/GmRCLRLRZq4fhqglQ+VyjhSxJUq45dKBRyAAxBVylQFLRXAKBYqF+Wr3k8AAAAAElFTkSuQmCC";

  // custom icons/assignment.png
  var assignment_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQcSURBVEiJjZVbbFRVFIa/vfc5c+ttWui0hZZLDRgaiihEgXARgoYXjZoQiBeIJiSQiEpIxAcf+mCiL+iDiOHFqGA0AQIBE4OJT4CQRkylVBBpaYG2TEmBmZ65nsv2odOZNjOd+ifn4ay19vrWWnuffaCMvuvSc7+64jmnbrl7y8WVk5j80vMwNS/kyN2ABLC1qH6QkS/Vmm5nUPHvRJyGK60R//H/BTizf9unrqPfCYUq/gmu3TbHbtv8xFRssVQ6lnaOHbiQw/Uqo+XdjR0dTqlYw3W83QIRVkpGspeOI7p/w/Ikg5bkybCXD0w60G9J2sIedioeEOjNOdfmbPbuIeBaSQAa6Zvfhlr3OlWxAZSTRsTGEL13qWtvKwRaCbjeR117e96WHR1i7EYnptJqum4NAGPBMuK1rTTNX4hfakKZNL/3fM25P27lAx3bZvmq9YRXPpu3pe5cZ+xGZ1HS87ezb2spP14o1VKjFNXnD/DGe/umK6qsdn74948nfhjYsuvNllS0WTlTABU3b1A10Iv19ArsSAPBnh6kZWHPbQIhpySyG5uKku/Y3703PuZsD5pw5Nu+0S872uw8oPLhA2ovXWBs0yZmnT7J/V17iHx+EJHOQOOsQhYB+PwM7S3uMJPlYFVIYiiwbXwv7+lelgcoO4sdDmNGowjXBa0B0Jk0OjpSyCIFsrk57y9Uf+1kIuWZsysUILxE0nlNeLojD4g1zCX7IEJ191UyzS0gcyPxXEjYhUyq+MAMJ+fVJFL61XCVRABa62/iSW8BiK4pe/BozXqSa9dNXW2YiJAfpEQ0NhQlBzinX/leKUTQL9Ho5Mho/T5N9Jd00ttS8hRNllAKXREq2uQJuZiMpdT8SO24XyI/sJ37+6TQh389+lSiLODR9u0YsRiZxYsKI8vJrq+H4ThdVht21sNQhgsMDAw5Z6Ti6Okjyz6B3Ic2WQkHKnLW+AsvztQgZ++txh/0uBu1bz8zp31JtOqS6SbCO0HoIsBgQnCiT/H+Uge/gh0XFXFHsLFOF91/by32OHbWw3YldSGlpae2dnQIB3CA1ETcFMD5YYGn4fKIZEOTR8wWDFsex2OFI+lTgg2NkoeWy8W/PGprDEIydfGnI891leowP1hHw6IaOLDcwZxUrs8QNIYKTyQwbj98qA/TEAQDmi2VP3803QjzHRgCVtR7CGBNY+GaVhKqTYEADAkqBx8eSjOrTrEi2Mm8wKA1I2A6pW1NfxZMBWsi4w2L0QTNTSYtDbAqe7ns+rKA1kpN2CfYOBukABjfi/tdIyxYEmLraouhU+ULLAv4YqVb0n6vsp7mpgCpO9fLZ58AOP1XqW5ZinV7gJSbnnFRJfB4EDKjQzMDhJR/Jvu7nzdGP+OxnOFvX0qCm0IFeqdz/wdEjYZ4HZ7x9wAAAABJRU5ErkJggg==";

  // custom icons/forum.png
  var forum_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM2SURBVEiJrZVPaFxVFMZ/586bTJKZmDqtrdNQDekfAzUYtaKim278B+qmVTsWqiAJZlESqRaLCzciXRQpImIFFTsVMYhLrVAthSiFdJEGC5IWE1tpSehkMjNJ57157x4XLxmn7UydET+4XM69537f+8595z0pjKS/QdkBCI3BisihxAfH3mok2TRJDmBU9blGk51myCUKGFBw9Gz69lsme2Ur20YXnMpjrU1hUhvwJ8fBWiJb7gXPJZieAidK29OriayZXUnfiJK9pUA0hk7s/j4UMIa2ve8i8QTud19iL03T9vrbYC1L7+/DeWQ7ka5T4DbqtYKnDACqaCEXzvkculQEv4y6pXDk55tmXoZIYTitALS0YBKd2OxcuNOxCgI/FAPiL0SReACxOyHeC7lfwbqQ2AqmFfJnQBxY9Shcm4HSn0B4ySE8r0IOhI6qoIGPIND9BsRS4ciehJ79gMCF96C9B1K7IFiEc0OgFgP4TZl2rwAazkER/CLYEvi5cE0teLPhDEh+JH0AZUDg7huoJhG8lSC+w2yVBK2IgUgH+AvhhomBGAiuhbHTAcESaBAKABRG0gMonyxzjaEc6Dj81anrSjSx+3dgS1NuqboDQU4j+s7wS3suoCRf27XnwerE8/a4iRLcRBAXlzVSrMfvCkB2/87O5MHRhYGxH59A9Aea+3ToUOznsfucSw8BsX9WmQAOG4DkwdHlgtq+JskB5GN3+1GMvxnlCJWXRo9Kf+Zz0yRZfZW+ry9Kf2YQ64RCEtazpkAsEuH5uzbxwOp1AKxvT7Cz+x7WtycAePiOFM9u2EjU3Hxc7v9iWvozg5TjH0F1o1Xh8bVdPNPVg1VlOPcTL3b30tuZpKs9wWdTk7y6qQ8Brrolfpn9q7ajbUfKdR2cz+colD3O5a7iBQFn5+dwg4DJ+TmKfpmpfJac5/LHDd1eCzUdzCzm2Td+shKfuDzDicszlfjQb+P/SryC/+2SGxJQyP8XEiss1tu7rkQJuS2zpPmkNabyOzTWrlORV1ZiUY5pFaEgV7xS9Nt6Ag011eDY8YwKL6vy4aePPbm3kTM1HdRDSyQYcoOI07oQvNkMOcDfVEs3IcpbEZ4AAAAASUVORK5CYII=";

  // custom icons/link.png
  var link_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAACxAAAAsQHGLUmNAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABFBJREFUSImNlV1sFFUUx39nZrbt0m5pwFYKWIRCIKHCCkoJFOSjxWAgAhrAB6IBQ7ciEd8w8YHEF9AYiUb7ET8wREWxEaIVEpZCKARbI1l80mgaqFSECizbQtvdmTk+7HZautvW+zRzzj2//zlnzr0jjLKqW6teENE36haF52Xy64VVpajsRWUtMAnkOtCEbe6XlSevABijCQg6G3gsI7xl9TpcI4LKy8AUwASdClqNZV/W86urHhB4pW3VkurWyt2jCXrwc6s3gDQCeSlTDLgEdKfe81H5Vi+smuYJOGosFOH96rbK97wKBBtw0uAiXwNZKdNhbHuKLAsvxOebCvqdJ+IYez2B+vLwBwoHBfZUt1a+DZBw7UMqunUUeAMV4Rdl5dkeAFl8IoYv6yWvEmGtDC8/9HPVAVVdU78o/PgYmTdQEQ6JoGktbKn8BVgAxNMEMi09V7UU0TOAb0z4+aUB1N8JBIAOK9RWuVlUpgNgqJtw7K8+Xnz2mhdwZoWF6Bf/C64I5/0fpuCAnLCAN1U0OYqK4xPfFeAogO5bYXHdfY1HmAZANNFCc3yPLBsJXlkHbEuZurHN/SO2SEPBpa4lR2W2f6IEx2UB6A93ftOYM1HF3WF99Ov3GeA7U6Y4yiZZHm7KeNDsmuAGV2jG0WIMLM8h5ACFosZxOzR/4yjwzbI83AQZTrJdE9wgMDgtt+xTnnNOjj0gJSJ1um9uXjpct8jy8PGBkAcE0uDQIHPMjUAXgJT6Z0qhrzPlK9KSgovp8NPHhjI9AXtX8NnhcKM2EpLNF3vB2AGpD1s2booX3atlPfh5p2edM7PzwCXz6idbrJOxZUMFBMAOzV8nIo1pcAanRVuqNoLW6bV4kZ6LAXCkYj2vFu9xou23TKaXING7kHCxcgIdcb9RwdPj/hLdubDUNZ0IgxdXGtwT+WZFnrZ2X9T7TtmRkjVsW/wW3IkBik4oSEa0X8WaNBnpc+7F/YHJlms6ewfhetiovZwZDuKeib4LlN228tletF21vUOkrx+ys+DO3WRL+vpw/r6G2JprBfKaLWBtihEz+vt2jQivCXrTcrr4SSdeOsME0PYOmFEyuLnrX/D78d03UMOYawBFSYr8KZ/+3j0WHIg3zHjuy+H7vGVaYDvJQMfNMUD+Sdams3R3ef5YcIUtzQ8/0TaigOsirqZyFtdA+DHlCqjTf2hARHeX57s18z8fDrdqI8ewExckGkOiMcRO4D1HY2jPfSTWi9t3D0fjXaKh4KOucBkYyL4blT8QnYV3Kw6BD3Si8cZPaprlGotBVjaSk51sxPWbmP4CENBs3+uG1EWuuC7Pk/yvAgQQXTAE3q2waSgcwCkuekbH50cofAgSNuLPxUyYiGFh+HPRCeM/S2wtPGgA+OojpwxD5oHWAR1AHOhApN5Q5lm1kaa0Xi+R29rre8q0zWNmv+MYnTdxb3UpBRNuuDnmtsT63O0A/wGrjvEaWKziLQAAAABJRU5ErkJggg==";

  // custom icons/page.png
  var page_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAACxAAAAsQHGLUmNAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAgxJREFUSIm1ls9LlEEYx78z8464pNkhk7B1d1GItroIRVQYtakhBbrgD6STqAj9AXlTPEinCIugQxDSobWDIHgw1IMHyWDBsDqtrIpLG5a0Ku6y7zuzXVx5t92d9+1d+sLA+z4zz/fzzDO8P4Bc+bnGPhJCdAAZxZCM0UkADBYi5hvOaaTBfdLzqOuixjVaNGnkVRjxnUMwRqeEkL0AhB1ALYDtmWeteHDLo6zK3/ke36XE3uYeCIgSYi7TBQCuck1pntXZKzVoGr+BDDJdjJEpAAUTi/fBhrx33UcQBBkjoUKQkgB2IPb68ZcqXBzRtZ9Ye/PtOFZ9+TR+rO4EGaNvhZA9JQFGBxvRN7aE8PPPeXNCyG4AwwA2HAPabtYh/uFhXnx+JYbmodkc35LPwEr/HaBs0ZfILsZfr8IQMife134e9667Swccpgz8SqQgZSYnnthP2zK3BFy9dAZzL9tsm/0z4Pd+GtOLUeiGLDjPNYqOOz6cqixzBlj8FEP/2FJei7KilKCqogzBgM8ZIBjwQYQHVEssZfmgJQ7SljtwDAjNraNneEFp8O5JAN2t9c4A95s8mH7aojzk5mvnlAUoASdcGtpve5UGVjK/KpIAkEwZjs1MucnshXkHMc5p5PHEincrfqD86BeSbki8CH01OKdRXZexYuv8XGPLNn5b8gYhROcaWwZwwWz4B7Fas9QPhfswAAAAAElFTkSuQmCC";

  // custom icons/recording.png
  var recording_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPjSURBVEiJtZZPbNtkGMafz7Gd2HFTt26TrulCWLW0DLTSXhCXlVFAExUIDlTRhMSCkLhx2AkxiQOCCgQHxA2EGqZxCGUHBCpw6J+1YwculIHUloxWWULXv27cxH8SO7Y5bFk7mtB2guf6ve/v+d7Pn/2YuK6Lenrq1bdOMIZniNY8/ew28xBj0M0AYHGVLbPRmq/47WmLs0fHR4bn6jFILYNEIuGT5eiYV2ZPK90FUozoUI8aKDeZAABvnoWQ49CQ5SEuBNyyZE5JUmYwmUyW9jU4c+7CYCAtpDZ6FWH5yXW41M46rTBonhWht5dQbi3DajJBXILwZBCts6JaiKnxH794b6yuwbNDb3/qX/W9lo5nKf3Ins0ALgGf4cGt+CD8xUPuUaB2FQEA/IoPsVTE0dpKn38/+s7rewzOnLsw2LDk//b6Gzco11P/udSUQ+7AgJ5PjjvFY9rz1Uko4PaZB9JCKh3PHh4OgJUZdH4ZgUu5SMezVCAtpBKJhO+ugSxHxzZ6FaHmsRxAZquJQlRDy9UW6EdK2OhVBFmOjgGA56eseULI8R/eOJslIPfFBwDoER3tU0EYooV8r4LwZDD62bUfvqYYwzOkdBfI7tuyW51aGC9+3I+BXN+/OxBgKZ7Dse/a4VIulO4CYQzPEEVrnv5iRK/bx1e8eKAriMdvPYz4pQH0KJ11ax3Ohs3aICaFYkQHrXn6PY+0Pf3ByqlNwebsmk2hchN69E688v4Auh7tQOFiCcczHchHCijSezdG51nYrINy0ETo52aOZgy6udxkglYYVBort+9aHYW7JJy/9AJ+v3IT9EceGL1lXO67ck9N8UEN/iyPzVObYAy6maouiL81gl/y14UfVFqnBuXk9s5EFlfZ8ubZkBbREVgSoHeqdZuX/5Dx1btXoXAqZl7+Fcvezb1FxEVFtODNs7C4yhZtNlrzQo4L5buKCEyEsFYDXJQNXHxzAn+mb2H+uQyui4v7TiLkOJiN1jxd8dvTDVn+CfnkNhjDA2JScFnnbqFOl5GZX0PxJRUTj/2yL7iqhiyPit+epizOHhUXAi5xCG4+s4ro5Y57Chf9y/jm/Awmjh4cThwCcSHgWpw9So2PDM+VJXMqPBmEFlOht5UgXZMODKul8GQQZcmcGh8ZnqMAQJIyg62zosqv+LB2eh3iogB2w3tfcH7Fh9ZZUZWkzCBw52OXTCZLhZgaj6UiDnEIls7mYDVZh4YTmyCWijiFmBqvptu+gcNsetE20wKtvQQjVIIR1Wu+jPsGTlX/jEwAYLZYeNdZcKsctvryqIg70xHnEJFZ1f8a+rv1X/y2/A2uS/rFOkxWwAAAAABJRU5ErkJggg==";

  // custom icons/SCORM Interactive.png
  var SCORM_Interactive_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUbSURBVEiJpZVrbBRlFIaf75vZmb11u92lF0rrtluxoMQLEuMFxQiJAhqbmCgmaqJG4oUEohjjlXpLGoOmGhEviYnBGE3FGKpGjWIVqhDEIEhpKtDaCqWFdru97GV2Zj5/lG5qL/jD82/OvOd933PO5Izgf8bwebffMjzC+ztC0cjKmtGuKjf9FsWiUTQ1OQD6uYrr7++JCMO9BSlXo9QCUKXjb0QfQrRf3Ln7cPrb7Zu2L4+JCy730Zooi5vtHZvnnrbmAE8CiBmJH+4PCpV+BMHTIApmM3DHd42EO7qxGqqYu6gARwU48eZh4taojccbFt9uG5vWQf2D3YsEmR0IUf1f4wkmEwAUYwMKEMS9GbDQcVI1wEE5ueCFdX9dI6T6GciTKymwy02suA836vmXgFUSASDzTRKsMXI/9ZPcY5M+gUMm1wmgTYBfeuR4zFXyOxCRiZwb1knfUIRV68euMCld7MNc4EP2WCyrC5GpibGr7Thbiyu5rGyIw70eWvojlA+nDxW1Nb0Bk3bwwkPdPyjB9Xl7mmD0pgh2gc7gqItlQywqqIkKpKXIfZWgrztHJtFB++BhRgqCFNo5LrVNVGzFzue2VC7PCzz/UNdqhPxicvt2uUlqWZgzwy5VziluK+vj5Z5FLInrFBiCvi1959yPQqysf6vy6/EdCLl+KsD1nl2PY7O+7A9qo4KYNkQiBVIDpcupJf8KodQGANmw9lghgmVTAXrCBqDOe4BA8jhdnT0cd6JkHEHvKRdhu3ms3zdCPPYHpcU9CHE2L7ihfkNnWGYNz5UojKkCMpEj2jXACn5HKcWn7hVUzhFIoGbMYtV9ESKlOmuubeC6pc/Q9Nv3FMXe4d41LxEqGADwYGlXSFxRMVubK+2fMciRxeAu0ULpyCD+lgTHvkzSumOYuhU7uCC4h1/3xlh/tc7bzRfi6r3UrXr37JiYpwuIqkmkRcFRVtfuxOOmKC0f/+69ZClTWW5N/EhnsIR9zCd5xiYw8AUIuGeJjdcI8PVCDyOOl2jFEYLBIUbHiuZIBYn83DWHO6/eRcxsp2yuNe2QxEtPsSR+FEMf348ucwAcPS1A2eTsLDsP+cdNmSlw1RmJck5OEJQXDRLyp3BKalBGYMax+c0sG1Y3U1Y4RE9yIa4StHYkUW6W/cdOM9JrkT0hGUiUgcZJXZmqVVjYgC6lmpF0cng0B8eVpHMGn+9dx2Pz5rNWzEMmWlkaLmKpcRW7Dw6iXJlThrNX1jdWDwGtAInR4H8KAOw7Op9kyo9tG7zafTM9IRi2FnNqtJptnTW0tK0CaKlvrB7SAZTiNSFYNpzyYTsauubMSp7KmvzSsSD/bCvBh/2LoX8KULmvA0iATVsrm1G0+jxZtNTAOd23tC0ia+tITRIsClJYXEgoGsIf9mMGvHi8Brqp7d+0terLvIBAKKm5d99W+5ntGexCWOkZybv6Szj0VwwEBMMBdENHSIHUJYZp4At6CYR8yjCNjRM1+YPy7JtVnV7T2oxy0XqPIAdPIKwUwskhcmn+7gvx+b4rUQj8BX6krk0zoJQik7IffbyhuGUiN+2XaX+y8QFGBt4WjpUXH5IVbDnwMEoJPF6DQKF/OrnjOtmMdf8Tr5R8MDk/7STqd2x+TzOi5+e80XaEQEmNjzvWoNS4FzNgTnOds5z9QqbiU8ln7GByZD969qK2/vOeav7zxqBS4hJQxcFwwNR03XVdd9B13R/IWi9ufHVu22wc/wDSEgiFzYmyhwAAAABJRU5ErkJggg==";

  // src/iconsData.ts
  var ogIcons = {
    archive: archive_24_default,
    audio: audio_24_default,
    avi: avi_24_default,
    bmp: bmp_24_default,
    calc: calc_24_default,
    document: document_24_default,
    flash: flash_24_default,
    folder: folder_24_default,
    gif: gif_24_default,
    glossary: glossary_default,
    image: image_24_default,
    impress: impress_24_default,
    jpeg: jpeg_24_default,
    mp3: mp3_24_default,
    mpeg: mpeg_24_default,
    pdf: pdf_24_default,
    png: png_24_default,
    powerpoint: powerpoint_24_default,
    quicktime: quicktime_24_default,
    sourcecode: sourcecode_24_default,
    spreadsheet: spreadsheet_24_default,
    text: text_24_default,
    tiff: tiff_24_default,
    unknown: unknown_24_default,
    video: video_24_default,
    wmv: wmv_24_default,
    writer: writer_24_default
  };
  var icons = {
    assignment: assignment_default,
    forum: forum_default,
    link: link_default,
    page: page_default,
    recording: recording_default,
    scorm: SCORM_Interactive_default
    // SCORM is the name of the לומדה provider company
  };

  // src/style/replaceBadIcons.scss
  var replaceBadIcons_default = `/*
	Helper classes for replaceBadIcons
*/
/* '#topofscroll' is to get a higher specificity than the built-in CSS */
#topofscroll .activityiconcontainer.custom-icon {
  background: none !important;
}
#topofscroll .nofilter {
  filter: none !important;
}`;

  // src/replaceBadIcons.ts
  var ICON_URL_PREFIX = "https://lemida.biu.ac.il/theme/image.php/learnr";
  var fixedIconsMap = {
    "assign": icons.assignment,
    "forum": icons.forum,
    "url": icons.link,
    "page": icons.page,
    "mod_page": icons.page,
    "videostream": icons.recording,
    "scorm": icons.scorm,
    // If you find the original icons for the above, please let me know!
    "folder": ogIcons.folder,
    "glossary": ogIcons.glossary,
    ...Object.entries(ogIcons).reduce((currentObj, [iconName, iconData]) => {
      currentObj[iconName + "-24"] = iconData;
      return currentObj;
    }, {})
  };
  function replaceBadIcons() {
    for (const [oldSrcInfix, newSrc] of Object.entries(fixedIconsMap)) {
      const selector = `.activityicon[src^="${ICON_URL_PREFIX}"][src*="${oldSrcInfix}"], .icon[src^="${ICON_URL_PREFIX}"][src*="${oldSrcInfix}"]`;
      $m(selector).forEach((el) => {
        el.src = newSrc;
        el.parentElement?.classList.add("custom-icon");
        el.classList.add("nofilter");
      });
    }
    GM_addStyle(replaceBadIcons_default);
    log("Replace Bad Icons applied");
  }

  // src/index.ts
  window.addEventListener("load", () => {
    if (options.courseListRevamp)
      courseListRevamp();
    if (options.replaceBadIcons)
      replaceBadIcons();
    if (options.paddingMargin)
      paddingMargin();
    if (new URL(location.href).pathname === "/" && options.homepageRevamp)
      homepageRevamp();
  });
})();
