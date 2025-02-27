var selectedName = "";
var scanning = false;
var scanningRequested = false;

var linkEbay = function () {
  window.open(link_ebay + "" + selectedName + "+lego", '_blank').focus();
}

var changeButton = function (what) {
  var button = document.getElementById('start');
  if (what == "stop") {
    button.disabled = false;
    button.innerHTML = "Stop";
  } else if (what == "starting") {
    button.disabled = true;
    button.innerHTML = "Starting";
  } else {
    button.disabled = false;
    button.innerHTML = "Scan";
  }
}

var html5qrcode = new Html5Qrcode("reader", true);
function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
function startScanning(facingMode) {
  var results = document.getElementById('scanned-result');
  var lastMessage;

  document.getElementById('name').innerText = "";
  document.getElementById('reader').style.height = "auto";

  function onScanSuccess(qrCodeMessage) {
    if (qrCodeMessage && lastMessage !== qrCodeMessage) {
      lastMessage = qrCodeMessage;

      var c = qrCodeMessage.split(' ')[0]
      var index = map[c];

      if (index) {
        stopScanning()
          .then(_ => {
            scanning = false;
            changeButton('start');
            var mf = minifigs[index];
            selectedName = mf.name;
            document.getElementById('name').innerText = mf.name;
            document.getElementById('reader').style.backgroundImage = "url('" + mf.image + "')";
            document.getElementById('reader').style.height = "350px";
            //document.getElementById('prices').style.display = "inline-block";

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          })
          .catch(err => {
            button.disabled = false;
            alert(err);
          })
      }
    }
  }

  setInterval(function () {
    html5qrcode.applyVideoConstraints({
      focusMode: "continuous",
      advanced: [{ zoom: 2.0 }],
    });
  }, 2000);

  return html5qrcode.start(
    { facingMode: facingMode },
    { fps: 10, qrbox: { width: 150, height: 150 }, aspectRatio: 1 },
    onScanSuccess);
}
function stopScanning() {
  return html5qrcode.stop();
}
docReady(function () {
  hljs.initHighlightingOnLoad();
  var button = document.getElementById('start');
  button.addEventListener('click', function () {
    if (!scanning) {
      button.disabled = true;
      changeButton('starting');
      //document.getElementById('prices').style.display = "none";
      document.getElementById('reader').style.height = "auto";
      document.getElementById('reader').style.backgroundImage = "url('images/intro.png')";
      startScanning("environment")
        .then(_ => {
          scanning = true;
          changeButton('stop');
        })
        .catch(err => {
          button.disabled = false;
          alert(err);
        })
    } else {
      button.disabled = true;
      stopScanning()
        .then(_ => {
          scanning = false;
          changeButton('start');
          document.getElementById('reader').style.backgroundImage = "url('images/intro.png')";
          document.getElementById('reader').style.height = "350px";
        })
        .catch(err => {
          button.disabled = false;
          alert(err);
        })
    }
  });
});
