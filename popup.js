document.getElementById("sendButton").addEventListener("click", myFunction);
document.getElementById("deleteButton").addEventListener("click", myFunction1);
document.getElementById("deleteNotPk").addEventListener("click", myFunction2);

// TODO: change to vanilla js
$(document).ready(function() {

  var hasChanged = false

  chrome.storage.local.get("encryptbook-on", function(result){
    if(result["encryptbook-on"] && !hasChanged){
      $("#button").addClass("on")
    }
  })

  $("#button").on("click", function() {
    hasChanged = true
    $(this).toggleClass("on");
    chrome.storage.local.set(
      { "encryptbook-on": $(this).hasClass("on") },
      function() {}
    );
  });
});

function myFunction() {
  console.log("sending");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getText" }, function(
      response
    ) {});
  });
}

function myFunction1() {
  console.log("deleting");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "deleteButton" }, function(
      response
    ) {});
  });
}

function myFunction2() {
  console.log("deleting all but pk");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "deleteNotPk" }, function(
      response
    ) {});
  });
}
