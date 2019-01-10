/*!
* polyfill-es - Compatibility of common methods for different browsers. 
* git+https://github.com/yelloxing/polyfill.js.git
* 
* author 心叶
*
* version 1.0.0next
* 
* build Fri Jan 04 2019
*
* Copyright yelloxing
* Released under the MIT license
* 
* Date:Thu Jan 10 2019 14:51:14 GMT+0800 (GMT+08:00)
*/

// 命名空间路径
var _namespace = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};

// 空格、标志符
var _regexp = {
    // http://www.w3.org/TR/css3-selectors/#whitespace
    whitespace: "[\\x20\\t\\r\\n\\f]",
    // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    identifier: "(?:\\\\.|[\\w-]|[^\0-\\xa0])+"
};

// 记录需要使用xlink命名空间常见的xml属性
var _xlink = ["href", "title", "show", "type", "role", "actuate"];

// 判断一个数字正负
// IE不支持
if (Math.sign === undefined) {
    // https://www.ecma-international.org/ecma-262/6.0/#sec-math.sign
    Math.sign = function (x) {
        return (x < 0) ? - 1 : (x > 0) ? 1 : + x;
    };
}

// 用于复制属性
if (Object.assign === undefined) {
    // https://www.ecma-international.org/ecma-262/6.0/#sec-object.assign
    (function () {
        Object.assign = function (target) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

// 兼容老IE浏览器
// 请不要使用event.srcElement获取
// https://dom.spec.whatwg.org/#dom-event-srcelement
if ('target' in Event.prototype === false) {
    Object.defineProperty(Event.prototype, 'target', {
        get: function () {
            return this.srcElement;
        }
    });
}

// 取消冒泡事件
// 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理
// 此方法不会影响当前节点中的任何事件侦听器
// 如果需要取消包括本结点的方法，应该使用stopImmediatePropagation()
// https://dom.spec.whatwg.org/#dom-event-stopimmediatepropagation
if ('stopPropagation' in Event.prototype === false) {
    Event.prototype.stopPropagation = function () {
        this.cancelBubble = true;
    };
}

// 阻止默认事件
// https://dom.spec.whatwg.org/#dom-event-preventdefault
if ('preventDefault' in Event.prototype === false) {
    Event.prototype.preventDefault = function () {
        this.returnValue = false;
    };
}

// 获取键盘按下键编码
// https://www.w3.org/TR/uievents/#dom-keyboardevent-which
if ('keyCode' in Event.prototype === false) {
    Object.defineProperty(Event.prototype, 'keyCode', {
        get: function () {
            return this.which || this.charCode;
        }
    });
}

// 获取函数名称
// 部分旧浏览器不支持
if ('name' in Function.prototype === false) {
    // https://www.ecma-international.org/ecma-262/6.0/#sec-setfunctionname
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            return this.toString().match(/^\s*function\s*([^\(\s]*)/)[1];
        }
    });
}

// 针对部分浏览器svg上没有innerHTML进行加强
var _innerHTML = {
    get: function () {
        var frame = document.createElement("div"), i;
        for (i = 0; i < this.childNodes.length; i++) {
            // 深度克隆，克隆节点以及节点下面的子内容
            frame.appendChild(this.childNodes[i].cloneNode(true));
        }
        return frame.innerHTML;
    },
    set: function (svgstring) {
        var frame = document.createElement("div"), i;
        frame.innerHTML = svgstring;
        var toSvgNode = function (htmlNode) {
            var svgNode = document.createElementNS(_namespace.svg, (htmlNode.tagName + "").toLowerCase());
            var attrs = htmlNode.attributes, i;
            for (i = 0; attrs && i < attrs.length; i++) {
                if (_xlink.indexOf(attrs[i].nodeName) >= 0) {
                    // 特殊的svg属性需要使用特殊的方法设置
                    svgNode.setAttributeNS(_namespace.xlink, 'xlink:' + attrs[i].nodeName, htmlNode.getAttribute(attrs[i].nodeName));
                } else {
                    svgNode.setAttribute(attrs[i].nodeName, htmlNode.getAttribute(attrs[i].nodeName));
                }

            }
            return svgNode;
        };
        var rslNode = toSvgNode(frame.firstChild);
        (function toSVG(pnode, svgPnode) {
            var node = pnode.firstChild;
            if (node && node.nodeType == 3) {
                svgPnode.textContent = pnode.innerText;
                return;
            }
            while (node) {
                var svgNode = toSvgNode(node);
                svgPnode.appendChild(svgNode);
                if (node.firstChild) toSVG(node, svgNode);
                node = node.nextSibling;
            }
        })(frame.firstChild, rslNode);
        this.appendChild(rslNode);
    }
};

if ('innerHTML' in SVGElement.prototype === false) {
    Object.defineProperty(SVGElement.prototype, 'innerHTML', _innerHTML);
}

if ('innerHTML' in SVGSVGElement.prototype === false) {
    Object.defineProperty(SVGSVGElement.prototype, 'innerHTML', _innerHTML);
}

// 表示二个正的浮点数之间的最新差值
// 你可以由此判断二个浮点数是否相对
// （因为js浮点运算都不是准确的，不可以简单的等号判断）
// 老火狐和IE不支持
if (Number.EPSILON === undefined) {
    // https://www.ecma-international.org/ecma-262/6.0/#sec-number.epsilon
    Number.EPSILON = Math.pow(2, - 52);
}

// 判断是不是整数
// IE浏览器不支持
if (Number.isInteger === undefined) {
    Number.isInteger = function (value) {
        // https://www.ecma-international.org/ecma-262/6.0/#sec-isfinite-number
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };
}
