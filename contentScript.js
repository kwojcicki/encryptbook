const key = new JSEncrypt({ default_key_size: 2056 });

console.log(key.getPrivateKey());
console.log(key.getPublicKey());

console.log(key);

function decrypt(text) {
  return "ooga booga";
}

function encrypt(text) {}

setTimeout(function() {
  function mutationHandler(mutationRecords) {
    console.info("mutationHandler:");

    mutationRecords.forEach(function(mutation) {
      //console.log(mutation.type);

      //console.log(mutation)

      mutation.addedNodes.forEach(function(node) {
        //console.log($(node).find("._3oh-._58nk"))
        if ($(node).find("._3oh-._58nk").length > 0) {
          console.log($(node));
          $(node)
            .find("._3oh-._58nk")
            .text(decrypt($(node).find("._3oh-._58nk")));
        } else {
          //console.log("not it: " + $(node))
        }
      });

      // if (typeof mutation.removedNodes == "object") {
      //   var jq = $(mutation.removedNodes);
      //   console.log(jq);
      //   console.log(jq.is("span.myclass2"));
      //   console.log(jq.find("span"));
      // }
    });
  }

  // https://stackoverflow.com/questions/12596231/can-jquery-selectors-be-used-with-dom-mutation-observers
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  var myObserver = new MutationObserver(mutationHandler);
  var obsConfig = {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true
  };
  var targetNodes = $("div[id$='js_1']");

  console.log(targetNodes);

  targetNodes.each(function() {
    myObserver.observe(this, obsConfig);
  });

  $("._3oh-._58nk").each(function(index, node) {
    const href = location.href;
    $(node).text(decrypt($(node).text()));
  });

  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({ foo: "hello", bar: "hi" }, function() {
    console.log("Settings saved");
  });

  // Read it using the storage API
  chrome.storage.sync.get(["foo", "bar"], function(items) {
    //message("Settings retrieved", items);
  });
}, 5000);
