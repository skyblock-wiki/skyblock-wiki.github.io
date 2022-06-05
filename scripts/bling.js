/* bling.js */
/* https://gist.github.com/jhrr/6c9b72298547bc3d995d */

window.$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = (name, fn) => {
    this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = (name, fn) => {
    this.forEach((elem, i) => {
        elem.on(name, fn);
    });
};
