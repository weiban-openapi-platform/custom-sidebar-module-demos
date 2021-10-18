(function _init() {
  var origin = new URLSearchParams(location.search).get("origin");

  var apiList = [
    "refresh",
    "showDialog",
    "changeCardProperty",
    "setStorageData",
    "sendCustomEvent",
  ];
  var wb = {};
  var events = {
    custom: {},
    storageData: {},
  };

  window.addEventListener("message", function (event) {
    if (event.origin !== origin) return;

    var eventData = event.data;
    if (eventData.type === "custom") {
      if (events.custom[eventData.name]) {
        events.custom[eventData.name](eventData.data);
      }
    } else if (eventData.type === "storageData") {
      if (events.storageData[eventData.id]) {
        events.storageData[eventData.id](eventData.data);
      }
    }
  });

  function apiCreate(action) {
    wb[action] = function (...params) {
      window.parent.postMessage(
        {
          action,
          params,
        },
        origin
      );
    };
  }

  apiList.forEach(function (action) {
    apiCreate(action);
  });

  wb.getStorageData = function (scope, key, callback) {
    var id =
      Date.now().toString(36) +
      parseInt(Math.random() * 100000 + "").toString(36);
    events.storageData[id] = callback;
    window.parent.postMessage(
      {
        action: "getStorageData",
        params: [scope, key, id],
      },
      origin
    );
  };

  wb.addCustomEventListener = function (eventName, handler) {
    events.custom[eventName] = handler;
  };
  window.wb = wb;
})();
