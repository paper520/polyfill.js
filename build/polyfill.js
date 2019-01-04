/*!
* polyfill-es - Compatibility of common methods for different browsers. 
* git+https://github.com/yelloxing/polyfill.js.git
* 
* author 心叶
*
* version 0.0.1next
* 
* build Fri Jan 04 2019
*
* Copyright yelloxing
* Released under the MIT license
* 
* Date:Fri Jan 04 2019 14:22:46 GMT+0800 (GMT+08:00)
*/

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
