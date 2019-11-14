const key = new JSEncrypt({ default_key_size: 2056 });

$(document).keypress(function(e) {
  console.log(e);
  console.log(e.target);
  console.log("asd: " + e.which);
});

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

  // should only be 1
  $("div._5rpb").each(function(index, node) {
    console.log(
      $(node)
        .children()
        .first()
    );
    $(node)
      .children()
      .first()
      .keypress(function(e) {
        var key = e.which;
        console.log("blah: " + key);
        if (key == 13) {
          // the enter key code
          //$('input[name = butAssignProd]').click();
          //return false;
          //$(node).children().first().text = "testing ooga booga\n"
        }
      });
  });

  function asd(k) {
    var oEvent = new KeyboardEvent('keypress',{'key':'a'});

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
    });     

    oEvent.keyCodeVal = k;

    if (oEvent.keyCode !== k) {
        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
    }

    console.log(oEvent)
    document.querySelector("._5rpb > div").dispatchEvent(oEvent);
}
  setTimeout(function() {
    console.log("sending");
    var e = $.Event("keypress", { which: 100 });
    $("div._5rpb > div").trigger(e);
    e = $.Event("keypress", { which: 13 });
    $("div._5rpb > div").trigger(e);
    document.querySelector("._5rpb > div").dispatchEvent(new KeyboardEvent('keypress',{'key':'a'}));
    asd(100)
  }, 5000);
  

  $("div._5rpb > div")
  const clonet = $("div._5rpb > div").clone()
  
  $("div._5rpb").append(clonet)
  
  // recreate input field
  // element.dispatchEvent(new InputEvent('textInput', {data: keyChar, bubbles: true}));
  // click send

  console.log($("._5rpb > div > div > div > div > span > span"));
  //document.querySelector("._5rpb > div > div > div > div > span > span").onkeypress  = function(){
  //    console.log("here?")
  //  }

  //  setTimeout(function(){
  //    $("div._5rpb").children().first().text("test oga boga")
  //}, 5000)

  console.log(
    $._data(
      $("div._5rpb")
        .children()
        .first()
        .get(),
      "events"
    )
  );
  console.log($._data($("div._1mf._1mj").get(), "events"));
  console.log($._data(document, "events"));
  console.log(
    $._data(
      $("div._5rpb")
        .children()
        .first(),
      "events"
    )
  );

  $.each($._data(document, "events"), function(i, event) {
    console.log(i);
    $.each(event, function(j, h) {
      console.log("- " + h.handler);
    });
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
