import OpenApi from "./OpenApi";
const chromeExtension =
  typeof chrome !== "undefined" && typeof chrome.tabs !== "undefined";

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    selector = document.documentElement;
  }
  return selector.outerHTML;
}

export default class FormFiller {
  constructor(profile) {
    this.profile = profile;
    this.openApi = new OpenApi();
    this.activeTabId = null;
    this.autofillFields = [];
    this.autoFillData = [];
  }

  async getPageHtml() {
    if (chromeExtension) {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      var activeTab = tabs[0];
      this.activeTabId = activeTab.id;

      const html = await chrome.scripting.executeScript({
        target: { tabId: this.activeTabId },
        injectImmediately: true, // uncomment this to make it execute straight away, other wise it will wait for document_idle
        func: DOMtoString,
        args: ["body"], // you can use this to target what element to get the html for
      });

      return html[0].result;
    }
  }

  async beginFill() {
    const pageHtml = await this.getPageHtml();
    await this.injectJquery();
    this.autofillFields = await this.openApi.parseHtml(pageHtml);
    this.buildFormData();
    await this.fillForm();
  }

  async fillForm() {
    if (chromeExtension) {
      await chrome.scripting.executeScript({
        target: { tabId: this.activeTabId },
        func: (data) => {
          for (const field of data) {
            let element;
            if (field.id) {
              element = jQuery(`#${field.id}`);
            } else {
              element = jQuery(`[name="${field.name}"]`);
            }
            if (element) {
              element.val(field.value);
              element.change();
            }
          }
        },
        args: [this.autoFillData],
        world: "MAIN",
      });
    }
  }

  buildFormData() {
    const textFieldTypes = [
      "text",
      "email",
      "tel",
      "url",
      "number",
      "date",
      "time",
      "week",
      "month",
      "datetime-local",
      "textarea",
      "select",
    ];
    const textFields = this.autofillFields.filter((v) =>
      textFieldTypes.includes(v.type)
    );
    const radioFields = this.autofillFields.filter((v) => v.type === "radio");
    const checkboxFields = this.autofillFields.filter(
      (v) => v.type === "checkbox"
    );

    const autofill = this.profile.autofill;
    for (const field of textFields) {
      if (!autofill[field.name]) {
        continue;
      }

      this.autoFillData.push({
        name: field.name,
        id: field.id,
        value: autofill[field.name],
      });
    }
  }

  async injectJquery() {
    await chrome.scripting.executeScript({
      target: { tabId: this.activeTabId },
      func: () => {
        if (window.jQuery) {
          window.jq = jQuery.noConflict(true);
        } else {
          // Create a script element to load jQuery
          var script = document.createElement("script");
          script.src = chrome.runtime.getURL("libs/jquery.min.js"); // Path to your local jQuery file
          script.onload = function () {
            window.jq = jQuery.noConflict(true);
            console.log("jQuery is loaded and available as jq.");
          };
          script.onerror = function () {
            reject(new Error("Failed to load jQuery"));
          };
          document.head.appendChild(script);
        }
      },
    });
  }
}
