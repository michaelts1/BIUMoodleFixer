"use strict";
(() => {
  // src/utils.ts
  var $m = document.querySelectorAll.bind(document);

  // src/getSettings.ts
  var DEFAULT_OPTIONS = {
    courseListRevamp: true,
    paddingMargin: false,
    restoreOldIcons: false
  };
  async function getSettings() {
    let settings = await browser.storage.sync.get();
    if (!settings || Object.keys(settings).length === 0) {
      await browser.storage.sync.set(DEFAULT_OPTIONS);
      settings = await browser.storage.sync.get();
    }
    return settings;
  }

  // src/options/options.ts
  function updateSetting(event) {
    console.log(event);
    const key = event.target?.id;
    const value = event.target?.checked;
    browser.storage.sync.set({ [key]: value });
    document.querySelector("#message").classList.remove("hidden");
  }
  async function init() {
    const settings = await getSettings();
    for (const settingInput of $m(".option input")) {
      settingInput.checked = settings[settingInput.id];
      settingInput.addEventListener("change", updateSetting);
    }
  }
  init();
})();
