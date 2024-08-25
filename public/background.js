chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.storage.sync.set({
      userPrefills: {
        "First Name": "test",
      },
    });
  }
});

// chrome.runtime.onStartup.addListener(async () => {

// });
