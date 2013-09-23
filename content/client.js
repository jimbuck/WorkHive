(function () {
	var gridOptions = (function () {
		var scripts = document.getElementsByTagName('script');
		var script = scripts[scripts.length - 1];

		return {
			src : (script.getAttribute('src') || '').replace('client', 'compute'),
			delay : parseInt(script.getAttribute('data-delay')) || 0,
			visible : script.hasAttribute('data-visible'),
      width: script.getAttribute('data-width') || '100px',
      height: script.getAttribute('data-height') || '70px',
		};
	})();

	function createIFrame(options) {
		var ifrm = document.createElement('iframe');
		ifrm.setAttribute('src', options.src);

		if (!options.visible) {
			ifrm.setAttribute('style', 'width:0px;height:0px;visiblilty:hidden;overflow:hidden');
			ifrm.setAttribute('frameBorder', '0');
		} else {
      ifrm.setAttribute('style', 'width:'+options.width+';height:'+options.height+';');
    }
		document.body.appendChild(ifrm);
	}

	(function (options) {
		setTimeout(function () {
			createIFrame(options);
		}, options.delay);
	})(gridOptions);
})();