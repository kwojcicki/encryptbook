const key = new JSEncrypt({ default_key_size: 2056 });

// Save it using the Chrome extension storage API.
// chrome.storage.sync.set({ foo: "hello", bar: "hi" }, function() {
//   console.log("Settings saved");
// });

// Read it using the storage API
//chrome.storage.sync.get(["foo", "bar"], function(items) {
//message("Settings retrieved", items);
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  createPair(function(key) {
    sendText("Heres a cool public key: " + key, null)
  });
  sendResponse();
});

chrome.storage.sync.get(function(result) {
  console.log(result);
});

console.log(key.getPrivateKey());
console.log(key.getPublicKey());

console.log(key);

function decrypt(text, cb) {
  const fbURL = location.href.split("/");
  console.log("Getting key for: " + fbURL[fbURL.length - 1]);
  chrome.storage.sync.get([fbURL[fbURL.length - 1] + "-pk"], function(item) {
    console.log(item);
    key.setPrivateKey(item);
    cb(key.decrypt(text));
  });
}

function encrypt(text, cb) {
  const fbURL = location.href.split("/");
  console.log("Getting key for: " + fbURL[fbURL.length - 1]);
  chrome.storage.sync.get([fbURL[fbURL.length - 1] + "-pb"], function(item) {
    console.log(item);
    key.setPublicKey(item);
    cb(key.encrypt(text));
  });
}

function createPair(cb) {
  const fbURL = location.href.split("/");
  console.log("Getting key for: " + fbURL[fbURL.length - 1]);
  chrome.storage.sync.get([fbURL[fbURL.length - 1] + "-pk"], function(item) {
    // pair doesn't exist, creating
    console.log("checking if key exists")
    console.log(item)
    if (!item.hasOwnProperty(fbURL[fbURL.length - 1] + "-pk")) {
      const temp = new JSEncrypt({ default_key_size: 2056 });
      chrome.storage.sync.set(
        { [fbURL[fbURL.length - 1] + "-pk"]: temp.getPrivateKey() },
        function() {
          console.log("Settings saved");
          console.log(temp)
          cb(temp.getPublicKey());
        }
      );
    } else {
      // ask if user wants to override existing key
      cb(null);
    }
  });
}

function receivePair(key) {
  const fbURL = location.href.split("/");
  console.log("Getting key for: " + fbURL[fbURL.length - 1]);
  chrome.storage.sync.set(
    { [fbURL[fbURL.length - 1] + "-pb"]: key },
    function() {
      console.log("Settings saved");
    }
  );
}

function sendText(textToSend, clonet) {
  document.querySelector("._5rpb > div").dispatchEvent(
    new InputEvent("textInput", {
      data: textToSend,
      bubbles: true
    })
  );
  //     );
  //   }
  // }

  // last character lags a bit
  setTimeout(function() {
    //document.querySelector(
    //        "div._5rpb > div > div > div > div > span"
    //).innerHTML = clonet.find("span").get(0).innerHTML;

    console.log($("[aria-label='Send']").get());
    console.log($("[aria-label='Send']").get(0));

    $("[aria-label='Send']")
      .get(0)
      .click();

    //$("div._5rpb").append(cloneBackup);
    //clonet.remove();
    $("._1p1t._1p1u").css({ display: "none" });
    if (clonet != null) {
      clonet.empty();
      clonet.focus();
      clonet.click();

      setTimeout(function() {
        clonet.focus();
        clonet.get(0).focus();

        var p = clonet.get(0),
          s = window.getSelection(),
          r = document.createRange();
        p.innerHTML = "\u00a0";
        r.selectNodeContents(p);
        s.removeAllRanges();
        s.addRange(r);
        document.execCommand("delete", false, null);
      }, 0);
      F;
    }
  }, 500);
}

setTimeout(function() {
  function mutationHandler(mutationRecords) {
    //console.info("mutationHandler:");

    mutationRecords.forEach(function(mutation) {
      //console.log(mutation.type);

      //console.log(mutation)
      mutation.addedNodes.forEach(function(node) {
        //console.log($(node).find("._3oh-._58nk"))
        if ($(node).find("._3oh-._58nk").length > 0) {
          //console.log($(node));
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
    decrypt($(node).text(), function(text) {
      $(node).text(text);
    });
  });

  // should only be 1
  // $("div._5rpb").each(function(index, node) {
  //   console.log(
  //     $(node)
  //       .children()
  //       .first()
  //   );
  //   $(node)
  //     .children()
  //     .first()
  //     .keypress(function(e) {
  //       var key = e.which;
  //       console.log("blah: " + key);
  //       if (key == 13) {
  //         // the enter key code
  //         //$('input[name = butAssignProd]').click();
  //         //return false;
  //         //$(node).children().first().text = "testing ooga booga\n"
  //       }
  //     });
  // });

  // function asd(k) {
  //   var oEvent = new KeyboardEvent("keypress", { key: "a" });

  //   // Chromium Hack
  //   Object.defineProperty(oEvent, "keyCode", {
  //     get: function() {
  //       return this.keyCodeVal;
  //     }
  //   });
  //   Object.defineProperty(oEvent, "which", {
  //     get: function() {
  //       return this.keyCodeVal;
  //     }
  //   });

  //   oEvent.keyCodeVal = k;

  //   if (oEvent.keyCode !== k) {
  //     alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
  //   }

  //   console.log(oEvent);
  //   document.querySelector("._5rpb > div").dispatchEvent(oEvent);
  // }
  // setTimeout(function() {
  //   console.log("sending");
  //   var e = $.Event("keypress", { which: 100 });
  //   $("div._5rpb > div").trigger(e);
  //   e = $.Event("keypress", { which: 13 });
  //   $("div._5rpb > div").trigger(e);
  //   document.querySelector("._5rpb > div").dispatchEvent(new KeyboardEvent('keypress',{'key':'a'}));
  //   asd(100)
  // }, 5000);

  // initalize to <br data-text="true">
  //$("._1p1t._1p1u").remove(); cant remove causes react bugs
  $("._1p1t._1p1u").css({ display: "none" });
  const old = $("div._5rpb > div");
  const clonet = old.clone();
  const cloneBackup = old.clone();
  old.css({ display: "none" });

  clonet.keypress(function(event) {
    if (event.which === 13) {
      console.log("Enter");
      console.log($("[aria-label='Send']"));
      //$("[aria-label='Send']").click();
      // TODO: swap with actual span inside

      // force send button to appear
      console.log("text to send: " + clonet.text());
      var textToSend = clonet.text();
      encrypt(text, function(textToSend) {
        sendText(textToSend, clonet);
      });

      // for (var i = 0; i < clonet.text().length; i++) {
      //   if(clonet.text().charAt(i) === " "){
      //     document.querySelector("._5rpb > div").dispatchEvent(
      //       new InputEvent("textInput", {
      //         data: " ",
      //         bubbles: true
      //       })
      //     );
      //   } else {
    }
  });

  //clonet.keydown(function(event) {
    //console.log("In here: " + event.key);
//    console.log(event);
    // document
    //   .querySelector("._5rpb > div")
    //   .dispatchEvent(
    //     new InputEvent("textInput", { data: event.key, bubbles: true })
    //   );
  //});

  $("div._5rpb").append(clonet);
  clonet.focus();

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

  // console.log(
  //   $._data(
  //     $("div._5rpb")
  //       .children()
  //       .first()
  //       .get(),
  //     "events"
  //   )
  // );
  // console.log($._data($("div._1mf._1mj").get(), "events"));
  // console.log($._data(document, "events"));
  // console.log(
  //   $._data(
  //     $("div._5rpb")
  //       .children()
  //       .first(),
  //     "events"
  //   )
  // );

  // $.each($._data(document, "events"), function(i, event) {
  //   console.log(i);
  //   $.each(event, function(j, h) {
  //     console.log("- " + h.handler);
  //   });
  // });
}, 5000);
