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
    log("Course List Revamp applied");
  }

  // src/paddingMargin.ts
  var PADDING_MARGIN_CLASSNAME = "biu-fixer-padding-margin-on";
  function paddingMargin() {
    $m(".block-fcl__list__item--course").forEach((el) => el.classList.add(PADDING_MARGIN_CLASSNAME));
    log("PaddingMargin applied");
  }

  // src/iconsData.ts
  var ogIcons = {
    archive: browser.runtime.getURL("icons/old/low res/archive-24.png"),
    audio: browser.runtime.getURL("icons/old/low res/audio-24.png"),
    avi: browser.runtime.getURL("icons/old/low res/avi-24.png"),
    bmp: browser.runtime.getURL("icons/old/low res/bmp-24.png"),
    calc: browser.runtime.getURL("icons/old/low res/calc-24.png"),
    document: browser.runtime.getURL("icons/old/low res/document-24.png"),
    flash: browser.runtime.getURL("icons/old/low res/flash-24.png"),
    folder: browser.runtime.getURL("icons/old/low res/folder-24.png"),
    gif: browser.runtime.getURL("icons/old/low res/gif-24.png"),
    glossary: browser.runtime.getURL("icons/old/low res/res/glossary.png"),
    image: browser.runtime.getURL("icons/old/low res/image-24.png"),
    impress: browser.runtime.getURL("icons/old/low res/impress-24.png"),
    jpeg: browser.runtime.getURL("icons/old/low res/jpeg-24.png"),
    mp3: browser.runtime.getURL("icons/old/low res/mp3-24.png"),
    mpeg: browser.runtime.getURL("icons/old/low res/mpeg-24.png"),
    pdf: browser.runtime.getURL("icons/old/low res/pdf-24.png"),
    png: browser.runtime.getURL("icons/old/low res/png-24.png"),
    powerpoint: browser.runtime.getURL("icons/old/low res/powerpoint-24.png"),
    quicktime: browser.runtime.getURL("icons/old/low res/quicktime-24.png"),
    sourcecode: browser.runtime.getURL("icons/old/low res/sourcecode-24.png"),
    spreadsheet: browser.runtime.getURL("icons/old/low res/spreadsheet-24.png"),
    text: browser.runtime.getURL("icons/old/low res/text-24.png"),
    tiff: browser.runtime.getURL("icons/old/low res/tiff-24.png"),
    unknown: browser.runtime.getURL("icons/old/low res/unknown-24.png"),
    video: browser.runtime.getURL("icons/old/low res/video-24.png"),
    wmv: browser.runtime.getURL("icons/old/low res/wmv-24.png"),
    writer: browser.runtime.getURL("icons/old/low res/writer-24.png")
  };
  var icons = {
    assignment: browser.runtime.getURL("icons/custom/assignment.png"),
    forum: browser.runtime.getURL("icons/custom/forum.png"),
    link: browser.runtime.getURL("icons/custom/link.png"),
    page: browser.runtime.getURL("icons/custom/page.png"),
    recording: browser.runtime.getURL("icons/custom/recording.png"),
    // SCORM is the name of the לומדה provider company
    scorm: browser.runtime.getURL("icons/custom/SCORM Interactive.png")
  };

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
    log("Replace Bad Icons applied");
  }

  // src/index.ts
  if (options.courseListRevamp) courseListRevamp();
  if (options.replaceBadIcons) replaceBadIcons();
  if (options.paddingMargin) paddingMargin();
})();
