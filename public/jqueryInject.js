(function () {
  function loadJQuery(callback) {
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    script.onload = function () {
      // Use noConflict to avoid conflicts and assign it to jq
      var jq = jQuery.noConflict(true);
      console.log("Your jQuery version:", jq.fn.jquery);
      if (callback && typeof callback === "function") {
        callback();
      }
    };
    document.head.appendChild(script);
  }

  function initialize() {
    if (typeof window.jq !== "undefined") {
      console.log("jq is already defined:", jq.fn.jquery);
    } else {
      console.log("jq is not defined, loading jQuery...");
      loadJQuery(function () {
        // Now `jq` is defined, and you can use it here
        jq(document).ready(function () {
          jq("body").css("background-color", "lightblue");
        });
      });
    }
  }

  // Initialize the script
  initialize();
})();
