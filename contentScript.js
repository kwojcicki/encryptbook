const key = new JSEncrypt({ log: 10, default_key_size: 2056 });
const key1 = new JSEncrypt({ log: 10, default_key_size: 2056 });

// Save it using the Chrome extension storage API.
// chrome.storage.sync.set({ foo: "hello", bar: "hi" }, function() {
//   console.log("Settings saved");
// });

// Read it using the storage API
//chrome.storage.sync.get(["foo", "bar"], function(items) {
//message("Settings retrieved", items);
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message)
  if(message === "delete"){
    chrome.storage.sync.get(function(result) {
      toRemove = [];
      $.each(result, function(index, value) {
        toRemove.push(index);
      });
      chrome.storage.sync.remove(toRemove, function(Items) {
        chrome.storage.sync.get(function(result) {
          console.log(result);
        });
      });
    });
  } else if (message === "deleteNotPk"){
    chrome.storage.sync.get(function(result) {
      toRemove = [];
      $.each(result, function(index, value) {
        if(!index.endsWith("-pk-yours")){
          toRemove.push(index); 
        }
      });
      chrome.storage.sync.remove(toRemove, function(Items) {
        chrome.storage.sync.get(function(result) {
          console.log(result);
        });
      });
    });
  } else {
    createPair(function(key) {
      sendText(
        "Here's your Encryptbook (https://chrome.google.com/webstore/detail/mangowaffles-highlighter/cnbhfnmefmgngepojipphalclebolhhh/) public key:" +
          key,
        null
      );
    });
  }
  sendResponse();
});

chrome.storage.sync.get(function(result) {
  console.log(result);
  rest();
});

//console.log(key.getPrivateKey());
//console.log(key.getPublicKey());

  // [fbURL[fbURL.length - 1] + "-pk-yours"] private key yours for decrypting
  // [fbURL[fbURL.length - 1] + "-pb-yours"] public key yours for encrypting first repeat of message
  // [fbURL[fbURL.length - 1] + "-pb-theirs"] public key theirs for encrypting second repeat of message

  function decrypt(node, cb) {
    const fbURL = location.href.split("/");
    console.log("Getting key for: " + fbURL[fbURL.length - 1]);
    console.log("decrypting");

    if (
      $(node)
        .text()
        .includes("Here's your Encryptbook")
    ) {
      if (
        $(node)
          .parent()
          .parent()
          .parent()
          .attr("class")
          .includes("_3i_m")
      ) {
        cb($(node).text());
      } else {
        // received public key store it
        const messageReceived = $(node)
          .text()
          .split("public key:");
        receivePair(messageReceived[messageReceived.length - 1]);
        cb($(node).text());
      }
    } else if (
      !$(node)
        .text()
        .includes("@@@")
    ) {
      // unencrypted return original
      cb($(node).text());
    } else {
      // maybe left/right switched in RTL mode?
      console.log(
        $(node)
          .parent()
          .parent()
          .parent()
          .attr("class")
      );
      // ._3i_m == your message, decrypt second portion
      // ._3i_m != their message, decrypt first portion
      if (
        $(node)
          .parent()
          .parent()
          .parent()
          .attr("class")
          .includes("_3i_m")
      ) {
        chrome.storage.sync.get(
          [fbURL[fbURL.length - 1] + "-pk-yours"],
          function(item) {
            console.log(item);
            key.setPrivateKey(item[fbURL[fbURL.length - 1] + "-pk-yours"]);
            cb(
              key.decrypt(
                $(node)
                  .text()
                  .split("@@@")[0]
              )
            );
          }
        );
      } else {
        chrome.storage.sync.get(
          [fbURL[fbURL.length - 1] + "-pk-yours"],
          function(item) {
            console.log(item);
            key.setPrivateKey(item[fbURL[fbURL.length - 1] + "-pk-yours"]);
            console.log(
              "decrypting with: " + item[fbURL[fbURL.length - 1] + "-pk-yours"]
            );
            console.log(
              key.decrypt(
                $(node)
                  .text()
                  .split("@@@")[1]
              )
            );
            console.log(key);
            cb(
              key.decrypt(
                $(node)
                  .text()
                  .split("@@@")[1]
              )
            );
          }
        );
      }
    }
  }

  /**
 
    them               you
              firsttime(pb-yours)@@@secondtime(pb-theirs)
    
    firsttime(pb-yours)@@@secondtime(pb-theirs)

 */

  function encrypt(text, cb) {
    const fbURL = location.href.split("/");
    console.log("Getting key for: " + fbURL[fbURL.length - 1]);
    chrome.storage.sync.get(
      [
        fbURL[fbURL.length - 1] + "-pb-yours",
        fbURL[fbURL.length - 1] + "-pb-theirs"
      ],
      function(item) {
        console.log(item);
        console.log(
          "encrypting with: " + item[fbURL[fbURL.length - 1] + "-pb-theirs"]
        );
        key.setPublicKey(item[fbURL[fbURL.length - 1] + "-pb-yours"]);
        key1.setPublicKey(item[fbURL[fbURL.length - 1] + "-pb-theirs"]);
        if (!item.hasOwnProperty(fbURL[fbURL.length - 1] + "-pb-theirs")) {
          cb(text);
        } else {
          cb(key.encrypt(text) + "@@@" + key1.encrypt(text));
        }
      }
    );
  }

  function createPair(cb) {
    const fbURL = location.href.split("/");
    console.log("Creating pair for: " + fbURL[fbURL.length - 1]);
    chrome.storage.sync.get(
      [
        fbURL[fbURL.length - 1] + "-pk-yours",
        fbURL[fbURL.length - 1] + "-pb-yours"
      ],
      function(item) {
        // pair doesn't exist, creating
        console.log("checking if key exists");
        console.log(item);
        if (!item.hasOwnProperty(fbURL[fbURL.length - 1] + "-pk-yours")) {
          const temp = new JSEncrypt({ default_key_size: 2056 });
          chrome.storage.sync.set(
            {
              [fbURL[fbURL.length - 1] + "-pk-yours"]: temp.getPrivateKey(),
              [fbURL[fbURL.length - 1] + "-pb-yours"]: temp.getPublicKey()
            },
            function() {
              console.log("Settings saved");
              console.log(temp);
              cb(temp.getPublicKey());
            }
          );
        } else {
          // TODO: ask if user wants to override existing key
          cb(item[fbURL[fbURL.length - 1] + "-pb-yours"]);
        }
      }
    );
  }

  function receivePair(key) {
    const fbURL = location.href.split("/");
    console.log(
      "Setting public key for: " + fbURL[fbURL.length - 1] + " " + key
    );
    chrome.storage.sync.set(
      { [fbURL[fbURL.length - 1] + "-pb-theirs"]: key },
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
      }
    }, 500);
  }

function rest() {
  console.log(key);

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
            decrypt($(node).find("._3oh-._58nk"), function(text) {
              $(node)
                .find("._3oh-._58nk")
                .text(text);
            });
          }
        });
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
      decrypt(node, function(text) {
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
        encrypt(textToSend, function(textToSend) {
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
}
