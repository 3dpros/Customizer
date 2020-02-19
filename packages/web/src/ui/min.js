// == OpenJSCAD.org, Copyright (c) 2017, Licensed under MIT License
const AlertUserOfUncaughtExceptions = require('./errorDispatcher')

const version = require('../../package.json').version
const Processor = require('../jscad/processor')

var gProcessor = null


function init () {
  const versionText = 'OpenJSCAD.org Version ' + version
  console.log(versionText)

  // Show all exceptions to the user: // WARNING !! this is not practical at dev time
  AlertUserOfUncaughtExceptions()

  let viewer = document.getElementById('viewerContext')
  let design = viewer.getAttribute('design-url')
  var internalViewerMode = viewer.getAttribute('internalViewer')

  gProcessor = new Processor(viewer,
    { viewer: { plate: {size: 0,
      m: {i: 1,
        color: {r: 0.8, g: 0.8, b: 0.8, a: 0.5}
      },
      M: {i: 100,
        color: {r: 0.5, g: 0.5, b: 0.5, a: 0.5}
      }
    },
      camera: {position: {x: 0, y: 0, z:700},
        clip: {min: 0.5, max: 3000},
        angle: {x:-4, y:25, z:0}
      },
      axis: {draw: false
      }
    }, internalViewer: (internalViewerMode == 'true')
    })
    
    document.getElementById('copyDesignID').addEventListener('click', function (event) {
      copyText('designID');
    }, false)

  // load the given design
  if (design) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', design, true)
    gProcessor.setStatus('Loading ' + design + " <img id=busy src='imgs/busy.gif'>")

    xhr.onload = function () {
      var source = this.responseText
      // console.log(source);

      if (design.match(/\.jscad$/i) || design.match(/\.js$/i)) {
        gProcessor.setStatus('Processing ' + design + " <img id=busy src='imgs/busy.gif'>")
        gProcessor.setJsCad(source, design);      
      }
    }
    xhr.send()
  }
}



document.addEventListener('DOMContentLoaded', function (event) {
  init()
})

function copyText(controlID) {
  var copyText = document.getElementById(controlID);
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
}


