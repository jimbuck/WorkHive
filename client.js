$(function() {
	CreateIFrame(GetSource());
});
function GetSource() {
	var scripts = document.getElementsByTagName('script'),
		script = scripts[scripts.length - 1],
		src = ( script.getAttribute.length !== undefined ? script.src : script.getAttribute('src', -1) );
	
	//console.log(src);
	return src.replace('client.js','compute');
}
function CreateIFrame(src) {
	var ifrm = document.createElement("iframe");
	ifrm.setAttribute("src", src);
	ifrm.setAttribute('style', 'width:0px;height:0px;visiblilty:hidden;');
	ifrm.setAttribute('frameBorder', '0');
	document.body.appendChild(ifrm);
}
	
