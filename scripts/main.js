/**
 * Swiper 8.3.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: July 6, 2022
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
})(this, (function () { 'use strict';

    /**
     * SSR Window 4.0.2
     * Better handling for window object in SSR environment
     * https://github.com/nolimits4web/ssr-window
     *
     * Copyright 2021, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: December 13, 2021
     */

    /* eslint-disable no-param-reassign */
    function isObject$1(obj) {
      return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
    }

    function extend$1(target, src) {
      if (target === void 0) {
        target = {};
      }

      if (src === void 0) {
        src = {};
      }

      Object.keys(src).forEach(key => {
        if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
          extend$1(target[key], src[key]);
        }
      });
    }

    const ssrDocument = {
      body: {},

      addEventListener() {},

      removeEventListener() {},

      activeElement: {
        blur() {},

        nodeName: ''
      },

      querySelector() {
        return null;
      },

      querySelectorAll() {
        return [];
      },

      getElementById() {
        return null;
      },

      createEvent() {
        return {
          initEvent() {}

        };
      },

      createElement() {
        return {
          children: [],
          childNodes: [],
          style: {},

          setAttribute() {},

          getElementsByTagName() {
            return [];
          }

        };
      },

      createElementNS() {
        return {};
      },

      importNode() {
        return null;
      },

      location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: ''
      }
    };

    function getDocument() {
      const doc = typeof document !== 'undefined' ? document : {};
      extend$1(doc, ssrDocument);
      return doc;
    }

    const ssrWindow = {
      document: ssrDocument,
      navigator: {
        userAgent: ''
      },
      location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: ''
      },
      history: {
        replaceState() {},

        pushState() {},

        go() {},

        back() {}

      },
      CustomEvent: function CustomEvent() {
        return this;
      },

      addEventListener() {},

      removeEventListener() {},

      getComputedStyle() {
        return {
          getPropertyValue() {
            return '';
          }

        };
      },

      Image() {},

      Date() {},

      screen: {},

      setTimeout() {},

      clearTimeout() {},

      matchMedia() {
        return {};
      },

      requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
          callback();
          return null;
        }

        return setTimeout(callback, 0);
      },

      cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
          return;
        }

        clearTimeout(id);
      }

    };

    function getWindow() {
      const win = typeof window !== 'undefined' ? window : {};
      extend$1(win, ssrWindow);
      return win;
    }

    /**
     * Dom7 4.0.4
     * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
     * https://framework7.io/docs/dom7.html
     *
     * Copyright 2022, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: January 11, 2022
     */
    /* eslint-disable no-proto */

    function makeReactive(obj) {
      const proto = obj.__proto__;
      Object.defineProperty(obj, '__proto__', {
        get() {
          return proto;
        },

        set(value) {
          proto.__proto__ = value;
        }

      });
    }

    class Dom7 extends Array {
      constructor(items) {
        if (typeof items === 'number') {
          super(items);
        } else {
          super(...(items || []));
          makeReactive(this);
        }
      }

    }

    function arrayFlat(arr) {
      if (arr === void 0) {
        arr = [];
      }

      const res = [];
      arr.forEach(el => {
        if (Array.isArray(el)) {
          res.push(...arrayFlat(el));
        } else {
          res.push(el);
        }
      });
      return res;
    }

    function arrayFilter(arr, callback) {
      return Array.prototype.filter.call(arr, callback);
    }

    function arrayUnique(arr) {
      const uniqueArray = [];

      for (let i = 0; i < arr.length; i += 1) {
        if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
      }

      return uniqueArray;
    }


    function qsa(selector, context) {
      if (typeof selector !== 'string') {
        return [selector];
      }

      const a = [];
      const res = context.querySelectorAll(selector);

      for (let i = 0; i < res.length; i += 1) {
        a.push(res[i]);
      }

      return a;
    }

    function $(selector, context) {
      const window = getWindow();
      const document = getDocument();
      let arr = [];

      if (!context && selector instanceof Dom7) {
        return selector;
      }

      if (!selector) {
        return new Dom7(arr);
      }

      if (typeof selector === 'string') {
        const html = selector.trim();

        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
          let toCreate = 'div';
          if (html.indexOf('<li') === 0) toCreate = 'ul';
          if (html.indexOf('<tr') === 0) toCreate = 'tbody';
          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
          if (html.indexOf('<tbody') === 0) toCreate = 'table';
          if (html.indexOf('<option') === 0) toCreate = 'select';
          const tempParent = document.createElement(toCreate);
          tempParent.innerHTML = html;

          for (let i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          arr = qsa(selector.trim(), context || document);
        } // arr = qsa(selector, document);

      } else if (selector.nodeType || selector === window || selector === document) {
        arr.push(selector);
      } else if (Array.isArray(selector)) {
        if (selector instanceof Dom7) return selector;
        arr = selector;
      }

      return new Dom7(arrayUnique(arr));
    }

    $.fn = Dom7.prototype; // eslint-disable-next-line

    function addClass() {
      for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
        classes[_key] = arguments[_key];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        el.classList.add(...classNames);
      });
      return this;
    }

    function removeClass() {
      for (var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        classes[_key2] = arguments[_key2];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        el.classList.remove(...classNames);
      });
      return this;
    }

    function toggleClass() {
      for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        classes[_key3] = arguments[_key3];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      this.forEach(el => {
        classNames.forEach(className => {
          el.classList.toggle(className);
        });
      });
    }

    function hasClass() {
      for (var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        classes[_key4] = arguments[_key4];
      }

      const classNames = arrayFlat(classes.map(c => c.split(' ')));
      return arrayFilter(this, el => {
        return classNames.filter(className => el.classList.contains(className)).length > 0;
      }).length > 0;
    }

    function attr(attrs, value) {
      if (arguments.length === 1 && typeof attrs === 'string') {
        // Get attr
        if (this[0]) return this[0].getAttribute(attrs);
        return undefined;
      } // Set attrs


      for (let i = 0; i < this.length; i += 1) {
        if (arguments.length === 2) {
          // String
          this[i].setAttribute(attrs, value);
        } else {
          // Object
          for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
          }
        }
      }

      return this;
    }

    function removeAttr(attr) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].removeAttribute(attr);
      }

      return this;
    }

    function transform(transform) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].style.transform = transform;
      }

      return this;
    }

    function transition$1(duration) {
      for (let i = 0; i < this.length; i += 1) {
        this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
      }

      return this;
    }

    function on() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
        [eventType, listener, capture] = args;
        targetSelector = undefined;
      }

      if (!capture) capture = false;

      function handleLiveEvent(e) {
        const target = e.target;
        if (!target) return;
        const eventData = e.target.dom7EventData || [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
          const parents = $(target).parents(); // eslint-disable-line

          for (let k = 0; k < parents.length; k += 1) {
            if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
          }
        }
      }

      function handleEvent(e) {
        const eventData = e && e.target ? e.target.dom7EventData || [] : [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        listener.apply(this, eventData);
      }

      const events = eventType.split(' ');
      let j;

      for (let i = 0; i < this.length; i += 1) {
        const el = this[i];

        if (!targetSelector) {
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            if (!el.dom7Listeners) el.dom7Listeners = {};
            if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
            el.dom7Listeners[event].push({
              listener,
              proxyListener: handleEvent
            });
            el.addEventListener(event, handleEvent, capture);
          }
        } else {
          // Live events
          for (j = 0; j < events.length; j += 1) {
            const event = events[j];
            if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
            if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
            el.dom7LiveListeners[event].push({
              listener,
              proxyListener: handleLiveEvent
            });
            el.addEventListener(event, handleLiveEvent, capture);
          }
        }
      }

      return this;
    }

    function off() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      let [eventType, targetSelector, listener, capture] = args;

      if (typeof args[1] === 'function') {
        [eventType, listener, capture] = args;
        targetSelector = undefined;
      }

      if (!capture) capture = false;
      const events = eventType.split(' ');

      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];

        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];
          let handlers;

          if (!targetSelector && el.dom7Listeners) {
            handlers = el.dom7Listeners[event];
          } else if (targetSelector && el.dom7LiveListeners) {
            handlers = el.dom7LiveListeners[event];
          }

          if (handlers && handlers.length) {
            for (let k = handlers.length - 1; k >= 0; k -= 1) {
              const handler = handlers[k];

              if (listener && handler.listener === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (!listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              }
            }
          }
        }
      }

      return this;
    }

    function trigger() {
      const window = getWindow();

      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      const events = args[0].split(' ');
      const eventData = args[1];

      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];

        for (let j = 0; j < this.length; j += 1) {
          const el = this[j];

          if (window.CustomEvent) {
            const evt = new window.CustomEvent(event, {
              detail: eventData,
              bubbles: true,
              cancelable: true
            });
            el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
            el.dispatchEvent(evt);
            el.dom7EventData = [];
            delete el.dom7EventData;
          }
        }
      }

      return this;
    }

    function transitionEnd$1(callback) {
      const dom = this;

      function fireCallBack(e) {
        if (e.target !== this) return;
        callback.call(this, e);
        dom.off('transitionend', fireCallBack);
      }

      if (callback) {
        dom.on('transitionend', fireCallBack);
      }

      return this;
    }

    function outerWidth(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
        }

        return this[0].offsetWidth;
      }

      return null;
    }

    function outerHeight(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          const styles = this.styles();
          return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
        }

        return this[0].offsetHeight;
      }

      return null;
    }

    function offset() {
      if (this.length > 0) {
        const window = getWindow();
        const document = getDocument();
        const el = this[0];
        const box = el.getBoundingClientRect();
        const body = document.body;
        const clientTop = el.clientTop || body.clientTop || 0;
        const clientLeft = el.clientLeft || body.clientLeft || 0;
        const scrollTop = el === window ? window.scrollY : el.scrollTop;
        const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
        return {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft
        };
      }

      return null;
    }

    function styles() {
      const window = getWindow();
      if (this[0]) return window.getComputedStyle(this[0], null);
      return {};
    }

    function css(props, value) {
      const window = getWindow();
      let i;

      if (arguments.length === 1) {
        if (typeof props === 'string') {
          // .css('width')
          if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
          // .css({ width: '100px' })
          for (i = 0; i < this.length; i += 1) {
            for (const prop in props) {
              this[i].style[prop] = props[prop];
            }
          }

          return this;
        }
      }

      if (arguments.length === 2 && typeof props === 'string') {
        // .css('width', '100px')
        for (i = 0; i < this.length; i += 1) {
          this[i].style[props] = value;
        }

        return this;
      }

      return this;
    }

    function each(callback) {
      if (!callback) return this;
      this.forEach((el, index) => {
        callback.apply(el, [el, index]);
      });
      return this;
    }

    function filter(callback) {
      const result = arrayFilter(this, callback);
      return $(result);
    }

    function html(html) {
      if (typeof html === 'undefined') {
        return this[0] ? this[0].innerHTML : null;
      }

      for (let i = 0; i < this.length; i += 1) {
        this[i].innerHTML = html;
      }

      return this;
    }

    function text(text) {
      if (typeof text === 'undefined') {
        return this[0] ? this[0].textContent.trim() : null;
      }

      for (let i = 0; i < this.length; i += 1) {
        this[i].textContent = text;
      }

      return this;
    }

    function is(selector) {
      const window = getWindow();
      const document = getDocument();
      const el = this[0];
      let compareWith;
      let i;
      if (!el || typeof selector === 'undefined') return false;

      if (typeof selector === 'string') {
        if (el.matches) return el.matches(selector);
        if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
        if (el.msMatchesSelector) return el.msMatchesSelector(selector);
        compareWith = $(selector);

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      if (selector === document) {
        return el === document;
      }

      if (selector === window) {
        return el === window;
      }

      if (selector.nodeType || selector instanceof Dom7) {
        compareWith = selector.nodeType ? [selector] : selector;

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      return false;
    }

    function index() {
      let child = this[0];
      let i;

      if (child) {
        i = 0; // eslint-disable-next-line

        while ((child = child.previousSibling) !== null) {
          if (child.nodeType === 1) i += 1;
        }

        return i;
      }

      return undefined;
    }

    function eq(index) {
      if (typeof index === 'undefined') return this;
      const length = this.length;

      if (index > length - 1) {
        return $([]);
      }

      if (index < 0) {
        const returnIndex = length + index;
        if (returnIndex < 0) return $([]);
        return $([this[returnIndex]]);
      }

      return $([this[index]]);
    }

    function append() {
      let newChild;
      const document = getDocument();

      for (let k = 0; k < arguments.length; k += 1) {
        newChild = k < 0 || arguments.length <= k ? undefined : arguments[k];

        for (let i = 0; i < this.length; i += 1) {
          if (typeof newChild === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;

            while (tempDiv.firstChild) {
              this[i].appendChild(tempDiv.firstChild);
            }
          } else if (newChild instanceof Dom7) {
            for (let j = 0; j < newChild.length; j += 1) {
              this[i].appendChild(newChild[j]);
            }
          } else {
            this[i].appendChild(newChild);
          }
        }
      }

      return this;
    }

    function prepend(newChild) {
      const document = getDocument();
      let i;
      let j;

      for (i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newChild;

          for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
          }
        } else if (newChild instanceof Dom7) {
          for (j = 0; j < newChild.length; j += 1) {
            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
          }
        } else {
          this[i].insertBefore(newChild, this[i].childNodes[0]);
        }
      }

      return this;
    }

    function next(selector) {
      if (this.length > 0) {
        if (selector) {
          if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
            return $([this[0].nextElementSibling]);
          }

          return $([]);
        }

        if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function nextAll(selector) {
      const nextEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.nextElementSibling) {
        const next = el.nextElementSibling; // eslint-disable-line

        if (selector) {
          if ($(next).is(selector)) nextEls.push(next);
        } else nextEls.push(next);

        el = next;
      }

      return $(nextEls);
    }

    function prev(selector) {
      if (this.length > 0) {
        const el = this[0];

        if (selector) {
          if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
            return $([el.previousElementSibling]);
          }

          return $([]);
        }

        if (el.previousElementSibling) return $([el.previousElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function prevAll(selector) {
      const prevEls = [];
      let el = this[0];
      if (!el) return $([]);

      while (el.previousElementSibling) {
        const prev = el.previousElementSibling; // eslint-disable-line

        if (selector) {
          if ($(prev).is(selector)) prevEls.push(prev);
        } else prevEls.push(prev);

        el = prev;
      }

      return $(prevEls);
    }

    function parent(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        if (this[i].parentNode !== null) {
          if (selector) {
            if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
          } else {
            parents.push(this[i].parentNode);
          }
        }
      }

      return $(parents);
    }

    function parents(selector) {
      const parents = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        let parent = this[i].parentNode; // eslint-disable-line

        while (parent) {
          if (selector) {
            if ($(parent).is(selector)) parents.push(parent);
          } else {
            parents.push(parent);
          }

          parent = parent.parentNode;
        }
      }

      return $(parents);
    }

    function closest(selector) {
      let closest = this; // eslint-disable-line

      if (typeof selector === 'undefined') {
        return $([]);
      }

      if (!closest.is(selector)) {
        closest = closest.parents(selector).eq(0);
      }

      return closest;
    }

    function find(selector) {
      const foundElements = [];

      for (let i = 0; i < this.length; i += 1) {
        const found = this[i].querySelectorAll(selector);

        for (let j = 0; j < found.length; j += 1) {
          foundElements.push(found[j]);
        }
      }

      return $(foundElements);
    }

    function children(selector) {
      const children = []; // eslint-disable-line

      for (let i = 0; i < this.length; i += 1) {
        const childNodes = this[i].children;

        for (let j = 0; j < childNodes.length; j += 1) {
          if (!selector || $(childNodes[j]).is(selector)) {
            children.push(childNodes[j]);
          }
        }
      }

      return $(children);
    }

    function remove() {
      for (let i = 0; i < this.length; i += 1) {
        if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
      }

      return this;
    }

    const Methods = {
      addClass,
      removeClass,
      hasClass,
      toggleClass,
      attr,
      removeAttr,
      transform,
      transition: transition$1,
      on,
      off,
      trigger,
      transitionEnd: transitionEnd$1,
      outerWidth,
      outerHeight,
      styles,
      offset,
      css,
      each,
      html,
      text,
      is,
      index,
      eq,
      append,
      prepend,
      next,
      nextAll,
      prev,
      prevAll,
      parent,
      parents,
      closest,
      find,
      children,
      filter,
      remove
    };
    Object.keys(Methods).forEach(methodName => {
      Object.defineProperty($.fn, methodName, {
        value: Methods[methodName],
        writable: true
      });
    });

    function deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach(key => {
        try {
          object[key] = null;
        } catch (e) {// no getter for object
        }

        try {
          delete object[key];
        } catch (e) {// something got wrong
        }
      });
    }

    function nextTick(callback, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      return setTimeout(callback, delay);
    }

    function now() {
      return Date.now();
    }

    function getComputedStyle$1(el) {
      const window = getWindow();
      let style;

      if (window.getComputedStyle) {
        style = window.getComputedStyle(el, null);
      }

      if (!style && el.currentStyle) {
        style = el.currentStyle;
      }

      if (!style) {
        style = el.style;
      }

      return style;
    }

    function getTranslate(el, axis) {
      if (axis === void 0) {
        axis = 'x';
      }

      const window = getWindow();
      let matrix;
      let curTransform;
      let transformMatrix;
      const curStyle = getComputedStyle$1(el);

      if (window.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;

        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
        } // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case


        transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
      }

      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
      }

      return curTransform || 0;
    }

    function isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function isNode(node) {
      // eslint-disable-next-line
      if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
        return node instanceof HTMLElement;
      }

      return node && (node.nodeType === 1 || node.nodeType === 11);
    }

    function extend() {
      const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
      const noExtend = ['__proto__', 'constructor', 'prototype'];

      for (let i = 1; i < arguments.length; i += 1) {
        const nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];

        if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
          const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend(to[nextKey], nextSource[nextKey]);
                }
              } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                to[nextKey] = {};

                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend(to[nextKey], nextSource[nextKey]);
                }
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }

      return to;
    }

    function setCSSProperty(el, varName, varValue) {
      el.style.setProperty(varName, varValue);
    }

    function animateCSSModeScroll(_ref) {
      let {
        swiper,
        targetPosition,
        side
      } = _ref;
      const window = getWindow();
      const startPosition = -swiper.translate;
      let startTime = null;
      let time;
      const duration = swiper.params.speed;
      swiper.wrapperEl.style.scrollSnapType = 'none';
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      const dir = targetPosition > startPosition ? 'next' : 'prev';

      const isOutOfBound = (current, target) => {
        return dir === 'next' && current >= target || dir === 'prev' && current <= target;
      };

      const animate = () => {
        time = new Date().getTime();

        if (startTime === null) {
          startTime = time;
        }

        const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

        if (isOutOfBound(currentPosition, targetPosition)) {
          currentPosition = targetPosition;
        }

        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });

        if (isOutOfBound(currentPosition, targetPosition)) {
          swiper.wrapperEl.style.overflow = 'hidden';
          swiper.wrapperEl.style.scrollSnapType = '';
          setTimeout(() => {
            swiper.wrapperEl.style.overflow = '';
            swiper.wrapperEl.scrollTo({
              [side]: currentPosition
            });
          });
          window.cancelAnimationFrame(swiper.cssModeFrameID);
          return;
        }

        swiper.cssModeFrameID = window.requestAnimationFrame(animate);
      };

      animate();
    }

    let support;

    function calcSupport() {
      const window = getWindow();
      const document = getDocument();
      return {
        smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
        passiveListener: function checkPassiveListener() {
          let supportsPassive = false;

          try {
            const opts = Object.defineProperty({}, 'passive', {
              // eslint-disable-next-line
              get() {
                supportsPassive = true;
              }

            });
            window.addEventListener('testPassiveListener', null, opts);
          } catch (e) {// No support
          }

          return supportsPassive;
        }(),
        gestures: function checkGestures() {
          return 'ongesturestart' in window;
        }()
      };
    }

    function getSupport() {
      if (!support) {
        support = calcSupport();
      }

      return support;
    }

    let deviceCached;

    function calcDevice(_temp) {
      let {
        userAgent
      } = _temp === void 0 ? {} : _temp;
      const support = getSupport();
      const window = getWindow();
      const platform = window.navigator.platform;
      const ua = userAgent || window.navigator.userAgent;
      const device = {
        ios: false,
        android: false
      };
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

      let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      const windows = platform === 'Win32';
      let macos = platform === 'MacIntel'; // iPadOs 13 fix

      const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

      if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
        ipad = ua.match(/(Version)\/([\d.]+)/);
        if (!ipad) ipad = [0, 1, '13_0_0'];
        macos = false;
      } // Android


      if (android && !windows) {
        device.os = 'android';
        device.android = true;
      }

      if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
      } // Export object


      return device;
    }

    function getDevice(overrides) {
      if (overrides === void 0) {
        overrides = {};
      }

      if (!deviceCached) {
        deviceCached = calcDevice(overrides);
      }

      return deviceCached;
    }

    let browser;

    function calcBrowser() {
      const window = getWindow();

      function isSafari() {
        const ua = window.navigator.userAgent.toLowerCase();
        return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
      }

      return {
        isSafari: isSafari(),
        isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
      };
    }

    function getBrowser() {
      if (!browser) {
        browser = calcBrowser();
      }

      return browser;
    }

    function Resize(_ref) {
      let {
        swiper,
        on,
        emit
      } = _ref;
      const window = getWindow();
      let observer = null;
      let animationFrame = null;

      const resizeHandler = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        emit('beforeResize');
        emit('resize');
      };

      const createObserver = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        observer = new ResizeObserver(entries => {
          animationFrame = window.requestAnimationFrame(() => {
            const {
              width,
              height
            } = swiper;
            let newWidth = width;
            let newHeight = height;
            entries.forEach(_ref2 => {
              let {
                contentBoxSize,
                contentRect,
                target
              } = _ref2;
              if (target && target !== swiper.el) return;
              newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
              newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
            });

            if (newWidth !== width || newHeight !== height) {
              resizeHandler();
            }
          });
        });
        observer.observe(swiper.el);
      };

      const removeObserver = () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        if (observer && observer.unobserve && swiper.el) {
          observer.unobserve(swiper.el);
          observer = null;
        }
      };

      const orientationChangeHandler = () => {
        if (!swiper || swiper.destroyed || !swiper.initialized) return;
        emit('orientationchange');
      };

      on('init', () => {
        if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
          createObserver();
          return;
        }

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('orientationchange', orientationChangeHandler);
      });
      on('destroy', () => {
        removeObserver();
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('orientationchange', orientationChangeHandler);
      });
    }

    function Observer(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const observers = [];
      const window = getWindow();

      const attach = function (target, options) {
        if (options === void 0) {
          options = {};
        }

        const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        const observer = new ObserverFunc(mutations => {
          // The observerUpdate event should only be triggered
          // once despite the number of mutations.  Additional
          // triggers are redundant and are very costly
          if (mutations.length === 1) {
            emit('observerUpdate', mutations[0]);
            return;
          }

          const observerUpdate = function observerUpdate() {
            emit('observerUpdate', mutations[0]);
          };

          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(observerUpdate);
          } else {
            window.setTimeout(observerUpdate, 0);
          }
        });
        observer.observe(target, {
          attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
          childList: typeof options.childList === 'undefined' ? true : options.childList,
          characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
        observers.push(observer);
      };

      const init = () => {
        if (!swiper.params.observer) return;

        if (swiper.params.observeParents) {
          const containerParents = swiper.$el.parents();

          for (let i = 0; i < containerParents.length; i += 1) {
            attach(containerParents[i]);
          }
        } // Observe container


        attach(swiper.$el[0], {
          childList: swiper.params.observeSlideChildren
        }); // Observe wrapper

        attach(swiper.$wrapperEl[0], {
          attributes: false
        });
      };

      const destroy = () => {
        observers.forEach(observer => {
          observer.disconnect();
        });
        observers.splice(0, observers.length);
      };

      extendParams({
        observer: false,
        observeParents: false,
        observeSlideChildren: false
      });
      on('init', init);
      on('destroy', destroy);
    }

    /* eslint-disable no-underscore-dangle */
    var eventsEmitter = {
      on(events, handler, priority) {
        const self = this;
        if (!self.eventsListeners || self.destroyed) return self;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';
        events.split(' ').forEach(event => {
          if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
          self.eventsListeners[event][method](handler);
        });
        return self;
      },

      once(events, handler, priority) {
        const self = this;
        if (!self.eventsListeners || self.destroyed) return self;
        if (typeof handler !== 'function') return self;

        function onceHandler() {
          self.off(events, onceHandler);

          if (onceHandler.__emitterProxy) {
            delete onceHandler.__emitterProxy;
          }

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          handler.apply(self, args);
        }

        onceHandler.__emitterProxy = handler;
        return self.on(events, onceHandler, priority);
      },

      onAny(handler, priority) {
        const self = this;
        if (!self.eventsListeners || self.destroyed) return self;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';

        if (self.eventsAnyListeners.indexOf(handler) < 0) {
          self.eventsAnyListeners[method](handler);
        }

        return self;
      },

      offAny(handler) {
        const self = this;
        if (!self.eventsListeners || self.destroyed) return self;
        if (!self.eventsAnyListeners) return self;
        const index = self.eventsAnyListeners.indexOf(handler);

        if (index >= 0) {
          self.eventsAnyListeners.splice(index, 1);
        }

        return self;
      },

      off(events, handler) {
        const self = this;
        if (!self.eventsListeners || self.destroyed) return self;
        if (!self.eventsListeners) return self;
        events.split(' ').forEach(event => {
          if (typeof handler === 'undefined') {
            self.eventsListeners[event] = [];
          } else if (self.eventsListeners[event]) {
            self.eventsListeners[event].forEach((eventHandler, index) => {
              if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                self.eventsListeners[event].splice(index, 1);
              }
            });
          }
        });
        return self;
      },

      emit() {
        const self = this;
        if (!self.eventsListeners || self.destroyed) return self;
        if (!self.eventsListeners) return self;
        let events;
        let data;
        let context;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (typeof args[0] === 'string' || Array.isArray(args[0])) {
          events = args[0];
          data = args.slice(1, args.length);
          context = self;
        } else {
          events = args[0].events;
          data = args[0].data;
          context = args[0].context || self;
        }

        data.unshift(context);
        const eventsArray = Array.isArray(events) ? events : events.split(' ');
        eventsArray.forEach(event => {
          if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
            self.eventsAnyListeners.forEach(eventHandler => {
              eventHandler.apply(context, [event, ...data]);
            });
          }

          if (self.eventsListeners && self.eventsListeners[event]) {
            self.eventsListeners[event].forEach(eventHandler => {
              eventHandler.apply(context, data);
            });
          }
        });
        return self;
      }

    };

    function updateSize() {
      const swiper = this;
      let width;
      let height;
      const $el = swiper.$el;

      if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
        width = swiper.params.width;
      } else {
        width = $el[0].clientWidth;
      }

      if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
        height = swiper.params.height;
      } else {
        height = $el[0].clientHeight;
      }

      if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
        return;
      } // Subtract paddings


      width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
      height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
      if (Number.isNaN(width)) width = 0;
      if (Number.isNaN(height)) height = 0;
      Object.assign(swiper, {
        width,
        height,
        size: swiper.isHorizontal() ? width : height
      });
    }

    function updateSlides() {
      const swiper = this;

      function getDirectionLabel(property) {
        if (swiper.isHorizontal()) {
          return property;
        } // prettier-ignore


        return {
          'width': 'height',
          'margin-top': 'margin-left',
          'margin-bottom ': 'margin-right',
          'margin-left': 'margin-top',
          'margin-right': 'margin-bottom',
          'padding-left': 'padding-top',
          'padding-right': 'padding-bottom',
          'marginRight': 'marginBottom'
        }[property];
      }

      function getDirectionPropertyValue(node, label) {
        return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      }

      const params = swiper.params;
      const {
        $wrapperEl,
        size: swiperSize,
        rtlTranslate: rtl,
        wrongRTL
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
      const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
      const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
      let snapGrid = [];
      const slidesGrid = [];
      const slidesSizesGrid = [];
      let offsetBefore = params.slidesOffsetBefore;

      if (typeof offsetBefore === 'function') {
        offsetBefore = params.slidesOffsetBefore.call(swiper);
      }

      let offsetAfter = params.slidesOffsetAfter;

      if (typeof offsetAfter === 'function') {
        offsetAfter = params.slidesOffsetAfter.call(swiper);
      }

      const previousSnapGridLength = swiper.snapGrid.length;
      const previousSlidesGridLength = swiper.slidesGrid.length;
      let spaceBetween = params.spaceBetween;
      let slidePosition = -offsetBefore;
      let prevSlideSize = 0;
      let index = 0;

      if (typeof swiperSize === 'undefined') {
        return;
      }

      if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
      }

      swiper.virtualSize = -spaceBetween; // reset margins

      if (rtl) slides.css({
        marginLeft: '',
        marginBottom: '',
        marginTop: ''
      });else slides.css({
        marginRight: '',
        marginBottom: '',
        marginTop: ''
      }); // reset cssMode offsets

      if (params.centeredSlides && params.cssMode) {
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
      }

      const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

      if (gridEnabled) {
        swiper.grid.initSlides(slidesLength);
      } // Calc slides


      let slideSize;
      const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
        return typeof params.breakpoints[key].slidesPerView !== 'undefined';
      }).length > 0;

      for (let i = 0; i < slidesLength; i += 1) {
        slideSize = 0;
        const slide = slides.eq(i);

        if (gridEnabled) {
          swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
        }

        if (slide.css('display') === 'none') continue; // eslint-disable-line

        if (params.slidesPerView === 'auto') {
          if (shouldResetSlideSize) {
            slides[i].style[getDirectionLabel('width')] = ``;
          }

          const slideStyles = getComputedStyle(slide[0]);
          const currentTransform = slide[0].style.transform;
          const currentWebKitTransform = slide[0].style.webkitTransform;

          if (currentTransform) {
            slide[0].style.transform = 'none';
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = 'none';
          }

          if (params.roundLengths) {
            slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
          } else {
            // eslint-disable-next-line
            const width = getDirectionPropertyValue(slideStyles, 'width');
            const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
            const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
            const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
            const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
            const boxSizing = slideStyles.getPropertyValue('box-sizing');

            if (boxSizing && boxSizing === 'border-box') {
              slideSize = width + marginLeft + marginRight;
            } else {
              const {
                clientWidth,
                offsetWidth
              } = slide[0];
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
            }
          }

          if (currentTransform) {
            slide[0].style.transform = currentTransform;
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = currentWebKitTransform;
          }

          if (params.roundLengths) slideSize = Math.floor(slideSize);
        } else {
          slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
          if (params.roundLengths) slideSize = Math.floor(slideSize);

          if (slides[i]) {
            slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
          }
        }

        if (slides[i]) {
          slides[i].swiperSlideSize = slideSize;
        }

        slidesSizesGrid.push(slideSize);

        if (params.centeredSlides) {
          slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
          if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
        } else {
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
          slidePosition = slidePosition + slideSize + spaceBetween;
        }

        swiper.virtualSize += slideSize + spaceBetween;
        prevSlideSize = slideSize;
        index += 1;
      }

      swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

      if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
        $wrapperEl.css({
          width: `${swiper.virtualSize + params.spaceBetween}px`
        });
      }

      if (params.setWrapperSize) {
        $wrapperEl.css({
          [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
        });
      }

      if (gridEnabled) {
        swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
      } // Remove last grid elements depending on width


      if (!params.centeredSlides) {
        const newSlidesGrid = [];

        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

          if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
            newSlidesGrid.push(slidesGridItem);
          }
        }

        snapGrid = newSlidesGrid;

        if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
          snapGrid.push(swiper.virtualSize - swiperSize);
        }
      }

      if (snapGrid.length === 0) snapGrid = [0];

      if (params.spaceBetween !== 0) {
        const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
        slides.filter((_, slideIndex) => {
          if (!params.cssMode) return true;

          if (slideIndex === slides.length - 1) {
            return false;
          }

          return true;
        }).css({
          [key]: `${spaceBetween}px`
        });
      }

      if (params.centeredSlides && params.centeredSlidesBounds) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach(slideSizeValue => {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;
        const maxSnap = allSlidesSize - swiperSize;
        snapGrid = snapGrid.map(snap => {
          if (snap < 0) return -offsetBefore;
          if (snap > maxSnap) return maxSnap + offsetAfter;
          return snap;
        });
      }

      if (params.centerInsufficientSlides) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach(slideSizeValue => {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;

        if (allSlidesSize < swiperSize) {
          const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
          snapGrid.forEach((snap, snapIndex) => {
            snapGrid[snapIndex] = snap - allSlidesOffset;
          });
          slidesGrid.forEach((snap, snapIndex) => {
            slidesGrid[snapIndex] = snap + allSlidesOffset;
          });
        }
      }

      Object.assign(swiper, {
        slides,
        snapGrid,
        slidesGrid,
        slidesSizesGrid
      });

      if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
        setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
        const addToSnapGrid = -swiper.snapGrid[0];
        const addToSlidesGrid = -swiper.slidesGrid[0];
        swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
        swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
      }

      if (slidesLength !== previousSlidesLength) {
        swiper.emit('slidesLengthChange');
      }

      if (snapGrid.length !== previousSnapGridLength) {
        if (swiper.params.watchOverflow) swiper.checkOverflow();
        swiper.emit('snapGridLengthChange');
      }

      if (slidesGrid.length !== previousSlidesGridLength) {
        swiper.emit('slidesGridLengthChange');
      }

      if (params.watchSlidesProgress) {
        swiper.updateSlidesOffset();
      }

      if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
        const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
        const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);

        if (slidesLength <= params.maxBackfaceHiddenSlides) {
          if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
        } else if (hasClassBackfaceClassAdded) {
          swiper.$el.removeClass(backFaceHiddenClass);
        }
      }
    }

    function updateAutoHeight(speed) {
      const swiper = this;
      const activeSlides = [];
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let newHeight = 0;
      let i;

      if (typeof speed === 'number') {
        swiper.setTransition(speed);
      } else if (speed === true) {
        swiper.setTransition(swiper.params.speed);
      }

      const getSlideByIndex = index => {
        if (isVirtual) {
          return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
        }

        return swiper.slides.eq(index)[0];
      }; // Find slides currently in view


      if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
        if (swiper.params.centeredSlides) {
          (swiper.visibleSlides || $([])).each(slide => {
            activeSlides.push(slide);
          });
        } else {
          for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
          }
        }
      } else {
        activeSlides.push(getSlideByIndex(swiper.activeIndex));
      } // Find new height from highest slide in view


      for (i = 0; i < activeSlides.length; i += 1) {
        if (typeof activeSlides[i] !== 'undefined') {
          const height = activeSlides[i].offsetHeight;
          newHeight = height > newHeight ? height : newHeight;
        }
      } // Update Height


      if (newHeight || newHeight === 0) swiper.$wrapperEl.css('height', `${newHeight}px`);
    }

    function updateSlidesOffset() {
      const swiper = this;
      const slides = swiper.slides;

      for (let i = 0; i < slides.length; i += 1) {
        slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
      }
    }

    function updateSlidesProgress(translate) {
      if (translate === void 0) {
        translate = this && this.translate || 0;
      }

      const swiper = this;
      const params = swiper.params;
      const {
        slides,
        rtlTranslate: rtl,
        snapGrid
      } = swiper;
      if (slides.length === 0) return;
      if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
      let offsetCenter = -translate;
      if (rtl) offsetCenter = translate; // Visible Slides

      slides.removeClass(params.slideVisibleClass);
      swiper.visibleSlidesIndexes = [];
      swiper.visibleSlides = [];

      for (let i = 0; i < slides.length; i += 1) {
        const slide = slides[i];
        let slideOffset = slide.swiperSlideOffset;

        if (params.cssMode && params.centeredSlides) {
          slideOffset -= slides[0].swiperSlideOffset;
        }

        const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
        const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
        const slideBefore = -(offsetCenter - slideOffset);
        const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
        const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

        if (isVisible) {
          swiper.visibleSlides.push(slide);
          swiper.visibleSlidesIndexes.push(i);
          slides.eq(i).addClass(params.slideVisibleClass);
        }

        slide.progress = rtl ? -slideProgress : slideProgress;
        slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
      }

      swiper.visibleSlides = $(swiper.visibleSlides);
    }

    function updateProgress(translate) {
      const swiper = this;

      if (typeof translate === 'undefined') {
        const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

        translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
      }

      const params = swiper.params;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      let {
        progress,
        isBeginning,
        isEnd
      } = swiper;
      const wasBeginning = isBeginning;
      const wasEnd = isEnd;

      if (translatesDiff === 0) {
        progress = 0;
        isBeginning = true;
        isEnd = true;
      } else {
        progress = (translate - swiper.minTranslate()) / translatesDiff;
        isBeginning = progress <= 0;
        isEnd = progress >= 1;
      }

      Object.assign(swiper, {
        progress,
        isBeginning,
        isEnd
      });
      if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

      if (isBeginning && !wasBeginning) {
        swiper.emit('reachBeginning toEdge');
      }

      if (isEnd && !wasEnd) {
        swiper.emit('reachEnd toEdge');
      }

      if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
        swiper.emit('fromEdge');
      }

      swiper.emit('progress', progress);
    }

    function updateSlidesClasses() {
      const swiper = this;
      const {
        slides,
        params,
        $wrapperEl,
        activeIndex,
        realIndex
      } = swiper;
      const isVirtual = swiper.virtual && params.virtual.enabled;
      slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
      let activeSlide;

      if (isVirtual) {
        activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
      } else {
        activeSlide = slides.eq(activeIndex);
      } // Active classes


      activeSlide.addClass(params.slideActiveClass);

      if (params.loop) {
        // Duplicate to all looped slides
        if (activeSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        }
      } // Next Slide


      let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

      if (params.loop && nextSlide.length === 0) {
        nextSlide = slides.eq(0);
        nextSlide.addClass(params.slideNextClass);
      } // Prev Slide


      let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

      if (params.loop && prevSlide.length === 0) {
        prevSlide = slides.eq(-1);
        prevSlide.addClass(params.slidePrevClass);
      }

      if (params.loop) {
        // Duplicate to all looped slides
        if (nextSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
        }

        if (prevSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
        } else {
          $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
        }
      }

      swiper.emitSlidesClasses();
    }

    function updateActiveIndex(newActiveIndex) {
      const swiper = this;
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
      const {
        slidesGrid,
        snapGrid,
        params,
        activeIndex: previousIndex,
        realIndex: previousRealIndex,
        snapIndex: previousSnapIndex
      } = swiper;
      let activeIndex = newActiveIndex;
      let snapIndex;

      if (typeof activeIndex === 'undefined') {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
              activeIndex = i;
            } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
              activeIndex = i + 1;
            }
          } else if (translate >= slidesGrid[i]) {
            activeIndex = i;
          }
        } // Normalize slideIndex


        if (params.normalizeSlideIndex) {
          if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
        }
      }

      if (snapGrid.indexOf(translate) >= 0) {
        snapIndex = snapGrid.indexOf(translate);
      } else {
        const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
        snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }

      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if (activeIndex === previousIndex) {
        if (snapIndex !== previousSnapIndex) {
          swiper.snapIndex = snapIndex;
          swiper.emit('snapIndexChange');
        }

        return;
      } // Get real index


      const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
      Object.assign(swiper, {
        snapIndex,
        realIndex,
        previousIndex,
        activeIndex
      });
      swiper.emit('activeIndexChange');
      swiper.emit('snapIndexChange');

      if (previousRealIndex !== realIndex) {
        swiper.emit('realIndexChange');
      }

      if (swiper.initialized || swiper.params.runCallbacksOnInit) {
        swiper.emit('slideChange');
      }
    }

    function updateClickedSlide(e) {
      const swiper = this;
      const params = swiper.params;
      const slide = $(e).closest(`.${params.slideClass}`)[0];
      let slideFound = false;
      let slideIndex;

      if (slide) {
        for (let i = 0; i < swiper.slides.length; i += 1) {
          if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
          }
        }
      }

      if (slide && slideFound) {
        swiper.clickedSlide = slide;

        if (swiper.virtual && swiper.params.virtual.enabled) {
          swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
        } else {
          swiper.clickedIndex = slideIndex;
        }
      } else {
        swiper.clickedSlide = undefined;
        swiper.clickedIndex = undefined;
        return;
      }

      if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
        swiper.slideToClickedSlide();
      }
    }

    var update = {
      updateSize,
      updateSlides,
      updateAutoHeight,
      updateSlidesOffset,
      updateSlidesProgress,
      updateProgress,
      updateSlidesClasses,
      updateActiveIndex,
      updateClickedSlide
    };

    function getSwiperTranslate(axis) {
      if (axis === void 0) {
        axis = this.isHorizontal() ? 'x' : 'y';
      }

      const swiper = this;
      const {
        params,
        rtlTranslate: rtl,
        translate,
        $wrapperEl
      } = swiper;

      if (params.virtualTranslate) {
        return rtl ? -translate : translate;
      }

      if (params.cssMode) {
        return translate;
      }

      let currentTranslate = getTranslate($wrapperEl[0], axis);
      if (rtl) currentTranslate = -currentTranslate;
      return currentTranslate || 0;
    }

    function setTranslate(translate, byController) {
      const swiper = this;
      const {
        rtlTranslate: rtl,
        params,
        $wrapperEl,
        wrapperEl,
        progress
      } = swiper;
      let x = 0;
      let y = 0;
      const z = 0;

      if (swiper.isHorizontal()) {
        x = rtl ? -translate : translate;
      } else {
        y = translate;
      }

      if (params.roundLengths) {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      if (params.cssMode) {
        wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
      } else if (!params.virtualTranslate) {
        $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
      }

      swiper.previousTranslate = swiper.translate;
      swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== progress) {
        swiper.updateProgress(translate);
      }

      swiper.emit('setTranslate', swiper.translate, byController);
    }

    function minTranslate() {
      return -this.snapGrid[0];
    }

    function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
    }

    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
      if (translate === void 0) {
        translate = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (translateBounds === void 0) {
        translateBounds = true;
      }

      const swiper = this;
      const {
        params,
        wrapperEl
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return false;
      }

      const minTranslate = swiper.minTranslate();
      const maxTranslate = swiper.maxTranslate();
      let newTranslate;
      if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

      swiper.updateProgress(newTranslate);

      if (params.cssMode) {
        const isH = swiper.isHorizontal();

        if (speed === 0) {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
        } else {
          if (!swiper.support.smoothScroll) {
            animateCSSModeScroll({
              swiper,
              targetPosition: -newTranslate,
              side: isH ? 'left' : 'top'
            });
            return true;
          }

          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: -newTranslate,
            behavior: 'smooth'
          });
        }

        return true;
      }

      if (speed === 0) {
        swiper.setTransition(0);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionEnd');
        }
      } else {
        swiper.setTransition(speed);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionStart');
        }

        if (!swiper.animating) {
          swiper.animating = true;

          if (!swiper.onTranslateToWrapperTransitionEnd) {
            swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
              if (!swiper || swiper.destroyed) return;
              if (e.target !== this) return;
              swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
              swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
              swiper.onTranslateToWrapperTransitionEnd = null;
              delete swiper.onTranslateToWrapperTransitionEnd;

              if (runCallbacks) {
                swiper.emit('transitionEnd');
              }
            };
          }

          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
        }
      }

      return true;
    }

    var translate = {
      getTranslate: getSwiperTranslate,
      setTranslate,
      minTranslate,
      maxTranslate,
      translateTo
    };

    function setTransition(duration, byController) {
      const swiper = this;

      if (!swiper.params.cssMode) {
        swiper.$wrapperEl.transition(duration);
      }

      swiper.emit('setTransition', duration, byController);
    }

    function transitionEmit(_ref) {
      let {
        swiper,
        runCallbacks,
        direction,
        step
      } = _ref;
      const {
        activeIndex,
        previousIndex
      } = swiper;
      let dir = direction;

      if (!dir) {
        if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
      }

      swiper.emit(`transition${step}`);

      if (runCallbacks && activeIndex !== previousIndex) {
        if (dir === 'reset') {
          swiper.emit(`slideResetTransition${step}`);
          return;
        }

        swiper.emit(`slideChangeTransition${step}`);

        if (dir === 'next') {
          swiper.emit(`slideNextTransition${step}`);
        } else {
          swiper.emit(`slidePrevTransition${step}`);
        }
      }
    }

    function transitionStart(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        params
      } = swiper;
      if (params.cssMode) return;

      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }

      transitionEmit({
        swiper,
        runCallbacks,
        direction,
        step: 'Start'
      });
    }

    function transitionEnd(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        params
      } = swiper;
      swiper.animating = false;
      if (params.cssMode) return;
      swiper.setTransition(0);
      transitionEmit({
        swiper,
        runCallbacks,
        direction,
        step: 'End'
      });
    }

    var transition = {
      setTransition,
      transitionStart,
      transitionEnd
    };

    function slideTo(index, speed, runCallbacks, internal, initial) {
      if (index === void 0) {
        index = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (typeof index !== 'number' && typeof index !== 'string') {
        throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
      }

      if (typeof index === 'string') {
        /**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
        const indexAsNumber = parseInt(index, 10);
        /**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

        const isValidNumber = isFinite(indexAsNumber);

        if (!isValidNumber) {
          throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
        } // Knowing that the converted `index` is a valid number,
        // we can update the original argument's value.


        index = indexAsNumber;
      }

      const swiper = this;
      let slideIndex = index;
      if (slideIndex < 0) slideIndex = 0;
      const {
        params,
        snapGrid,
        slidesGrid,
        previousIndex,
        activeIndex,
        rtlTranslate: rtl,
        wrapperEl,
        enabled
      } = swiper;

      if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
        return false;
      }

      const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
      let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
        swiper.emit('beforeSlideChangeStart');
      }

      const translate = -snapGrid[snapIndex]; // Update progress

      swiper.updateProgress(translate); // Normalize slideIndex

      if (params.normalizeSlideIndex) {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          const normalizedTranslate = -Math.floor(translate * 100);
          const normalizedGrid = Math.floor(slidesGrid[i] * 100);
          const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
              slideIndex = i;
            } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
              slideIndex = i + 1;
            }
          } else if (normalizedTranslate >= normalizedGrid) {
            slideIndex = i;
          }
        }
      } // Directions locks


      if (swiper.initialized && slideIndex !== activeIndex) {
        if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
          return false;
        }

        if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
          if ((activeIndex || 0) !== slideIndex) return false;
        }
      }

      let direction;
      if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

      if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
        swiper.updateActiveIndex(slideIndex); // Update Height

        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }

        swiper.updateSlidesClasses();

        if (params.effect !== 'slide') {
          swiper.setTranslate(translate);
        }

        if (direction !== 'reset') {
          swiper.transitionStart(runCallbacks, direction);
          swiper.transitionEnd(runCallbacks, direction);
        }

        return false;
      }

      if (params.cssMode) {
        const isH = swiper.isHorizontal();
        const t = rtl ? translate : -translate;

        if (speed === 0) {
          const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

          if (isVirtual) {
            swiper.wrapperEl.style.scrollSnapType = 'none';
            swiper._immediateVirtual = true;
          }

          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

          if (isVirtual) {
            requestAnimationFrame(() => {
              swiper.wrapperEl.style.scrollSnapType = '';
              swiper._swiperImmediateVirtual = false;
            });
          }
        } else {
          if (!swiper.support.smoothScroll) {
            animateCSSModeScroll({
              swiper,
              targetPosition: t,
              side: isH ? 'left' : 'top'
            });
            return true;
          }

          wrapperEl.scrollTo({
            [isH ? 'left' : 'top']: t,
            behavior: 'smooth'
          });
        }

        return true;
      }

      swiper.setTransition(speed);
      swiper.setTranslate(translate);
      swiper.updateActiveIndex(slideIndex);
      swiper.updateSlidesClasses();
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.transitionStart(runCallbacks, direction);

      if (speed === 0) {
        swiper.transitionEnd(runCallbacks, direction);
      } else if (!swiper.animating) {
        swiper.animating = true;

        if (!swiper.onSlideToWrapperTransitionEnd) {
          swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
            swiper.onSlideToWrapperTransitionEnd = null;
            delete swiper.onSlideToWrapperTransitionEnd;
            swiper.transitionEnd(runCallbacks, direction);
          };
        }

        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
      }

      return true;
    }

    function slideToLoop(index, speed, runCallbacks, internal) {
      if (index === void 0) {
        index = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (typeof index === 'string') {
        /**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
        const indexAsNumber = parseInt(index, 10);
        /**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

        const isValidNumber = isFinite(indexAsNumber);

        if (!isValidNumber) {
          throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
        } // Knowing that the converted `index` is a valid number,
        // we can update the original argument's value.


        index = indexAsNumber;
      }

      const swiper = this;
      let newIndex = index;

      if (swiper.params.loop) {
        newIndex += swiper.loopedSlides;
      }

      return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideNext(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        animating,
        enabled,
        params
      } = swiper;
      if (!enabled) return swiper;
      let perGroup = params.slidesPerGroup;

      if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
      }

      const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      if (params.rewind && swiper.isEnd) {
        return swiper.slideTo(0, speed, runCallbacks, internal);
      }

      return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slidePrev(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      const {
        params,
        animating,
        snapGrid,
        slidesGrid,
        rtlTranslate,
        enabled
      } = swiper;
      if (!enabled) return swiper;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      const translate = rtlTranslate ? swiper.translate : -swiper.translate;

      function normalize(val) {
        if (val < 0) return -Math.floor(Math.abs(val));
        return Math.floor(val);
      }

      const normalizedTranslate = normalize(translate);
      const normalizedSnapGrid = snapGrid.map(val => normalize(val));
      let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

      if (typeof prevSnap === 'undefined' && params.cssMode) {
        let prevSnapIndex;
        snapGrid.forEach((snap, snapIndex) => {
          if (normalizedTranslate >= snap) {
            // prevSnap = snap;
            prevSnapIndex = snapIndex;
          }
        });

        if (typeof prevSnapIndex !== 'undefined') {
          prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
      }

      let prevIndex = 0;

      if (typeof prevSnap !== 'undefined') {
        prevIndex = slidesGrid.indexOf(prevSnap);
        if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

        if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
          prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
          prevIndex = Math.max(prevIndex, 0);
        }
      }

      if (params.rewind && swiper.isBeginning) {
        const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
        return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
      }

      return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideReset(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      const swiper = this;
      return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideToClosest(speed, runCallbacks, internal, threshold) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (threshold === void 0) {
        threshold = 0.5;
      }

      const swiper = this;
      let index = swiper.activeIndex;
      const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
      const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
      const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

      if (translate >= swiper.snapGrid[snapIndex]) {
        // The current translate is on or after the current snap index, so the choice
        // is between the current index and the one after it.
        const currentSnap = swiper.snapGrid[snapIndex];
        const nextSnap = swiper.snapGrid[snapIndex + 1];

        if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
          index += swiper.params.slidesPerGroup;
        }
      } else {
        // The current translate is before the current snap index, so the choice
        // is between the current index and the one before it.
        const prevSnap = swiper.snapGrid[snapIndex - 1];
        const currentSnap = swiper.snapGrid[snapIndex];

        if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
          index -= swiper.params.slidesPerGroup;
        }
      }

      index = Math.max(index, 0);
      index = Math.min(index, swiper.slidesGrid.length - 1);
      return swiper.slideTo(index, speed, runCallbacks, internal);
    }

    function slideToClickedSlide() {
      const swiper = this;
      const {
        params,
        $wrapperEl
      } = swiper;
      const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
      let slideToIndex = swiper.clickedIndex;
      let realIndex;

      if (params.loop) {
        if (swiper.animating) return;
        realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

        if (params.centeredSlides) {
          if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
            swiper.loopFix();
            slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
            nextTick(() => {
              swiper.slideTo(slideToIndex);
            });
          } else {
            swiper.slideTo(slideToIndex);
          }
        } else if (slideToIndex > swiper.slides.length - slidesPerView) {
          swiper.loopFix();
          slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else {
        swiper.slideTo(slideToIndex);
      }
    }

    var slide = {
      slideTo,
      slideToLoop,
      slideNext,
      slidePrev,
      slideReset,
      slideToClosest,
      slideToClickedSlide
    };

    function loopCreate() {
      const swiper = this;
      const document = getDocument();
      const {
        params,
        $wrapperEl
      } = swiper; // Remove duplicated slides

      const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
      $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
      let slides = $selector.children(`.${params.slideClass}`);

      if (params.loopFillGroupWithBlank) {
        const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

        if (blankSlidesNum !== params.slidesPerGroup) {
          for (let i = 0; i < blankSlidesNum; i += 1) {
            const blankNode = $(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
            $selector.append(blankNode);
          }

          slides = $selector.children(`.${params.slideClass}`);
        }
      }

      if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
      swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
      swiper.loopedSlides += params.loopAdditionalSlides;

      if (swiper.loopedSlides > slides.length) {
        swiper.loopedSlides = slides.length;
      }

      const prependSlides = [];
      const appendSlides = [];
      slides.each((el, index) => {
        const slide = $(el);

        if (index < swiper.loopedSlides) {
          appendSlides.push(el);
        }

        if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
          prependSlides.push(el);
        }

        slide.attr('data-swiper-slide-index', index);
      });

      for (let i = 0; i < appendSlides.length; i += 1) {
        $selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }

      for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
        $selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }
    }

    function loopFix() {
      const swiper = this;
      swiper.emit('beforeLoopFix');
      const {
        activeIndex,
        slides,
        loopedSlides,
        allowSlidePrev,
        allowSlideNext,
        snapGrid,
        rtlTranslate: rtl
      } = swiper;
      let newIndex;
      swiper.allowSlidePrev = true;
      swiper.allowSlideNext = true;
      const snapTranslate = -snapGrid[activeIndex];
      const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

      if (activeIndex < loopedSlides) {
        newIndex = slides.length - loopedSlides * 3 + activeIndex;
        newIndex += loopedSlides;
        const slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      } else if (activeIndex >= slides.length - loopedSlides) {
        // Fix For Positive Oversliding
        newIndex = -slides.length + activeIndex + loopedSlides;
        newIndex += loopedSlides;
        const slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      }

      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit('loopFix');
    }

    function loopDestroy() {
      const swiper = this;
      const {
        $wrapperEl,
        params,
        slides
      } = swiper;
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
      slides.removeAttr('data-swiper-slide-index');
    }

    var loop = {
      loopCreate,
      loopFix,
      loopDestroy
    };

    function setGrabCursor(moving) {
      const swiper = this;
      if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
      const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
      el.style.cursor = 'move';
      el.style.cursor = moving ? 'grabbing' : 'grab';
    }

    function unsetGrabCursor() {
      const swiper = this;

      if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
        return;
      }

      swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
    }

    var grabCursor = {
      setGrabCursor,
      unsetGrabCursor
    };

    function closestElement(selector, base) {
      if (base === void 0) {
        base = this;
      }

      function __closestFrom(el) {
        if (!el || el === getDocument() || el === getWindow()) return null;
        if (el.assignedSlot) el = el.assignedSlot;
        const found = el.closest(selector);

        if (!found && !el.getRootNode) {
          return null;
        }

        return found || __closestFrom(el.getRootNode().host);
      }

      return __closestFrom(base);
    }

    function onTouchStart(event) {
      const swiper = this;
      const document = getDocument();
      const window = getWindow();
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        enabled
      } = swiper;
      if (!enabled) return;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return;
      }

      if (!swiper.animating && params.cssMode && params.loop) {
        swiper.loopFix();
      }

      let e = event;
      if (e.originalEvent) e = e.originalEvent;
      let $targetEl = $(e.target);

      if (params.touchEventsTarget === 'wrapper') {
        if (!$targetEl.closest(swiper.wrapperEl).length) return;
      }

      data.isTouchEvent = e.type === 'touchstart';
      if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
      if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
      if (data.isTouched && data.isMoved) return; // change target el for shadow root component

      const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

      if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
        $targetEl = $(event.path[0]);
      }

      const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
      const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

      if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
        swiper.allowClick = true;
        return;
      }

      if (params.swipeHandler) {
        if (!$targetEl.closest(params.swipeHandler)[0]) return;
      }

      touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      const startX = touches.currentX;
      const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

      const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
      const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

      if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
        if (edgeSwipeDetection === 'prevent') {
          event.preventDefault();
        } else {
          return;
        }
      }

      Object.assign(data, {
        isTouched: true,
        isMoved: false,
        allowTouchCallbacks: true,
        isScrolling: undefined,
        startMoving: undefined
      });
      touches.startX = startX;
      touches.startY = startY;
      data.touchStartTime = now();
      swiper.allowClick = true;
      swiper.updateSize();
      swiper.swipeDirection = undefined;
      if (params.threshold > 0) data.allowThresholdMove = false;

      if (e.type !== 'touchstart') {
        let preventDefault = true;

        if ($targetEl.is(data.focusableElements)) {
          preventDefault = false;

          if ($targetEl[0].nodeName === 'SELECT') {
            data.isTouched = false;
          }
        }

        if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
          document.activeElement.blur();
        }

        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
          e.preventDefault();
        }
      }

      if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
        swiper.freeMode.onTouchStart();
      }

      swiper.emit('touchStart', e);
    }

    function onTouchMove(event) {
      const document = getDocument();
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (!data.isTouched) {
        if (data.startMoving && data.isScrolling) {
          swiper.emit('touchMoveOpposite', e);
        }

        return;
      }

      if (data.isTouchEvent && e.type !== 'touchmove') return;
      const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
      const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
      const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

      if (e.preventedByNestedSwiper) {
        touches.startX = pageX;
        touches.startY = pageY;
        return;
      }

      if (!swiper.allowTouchMove) {
        if (!$(e.target).is(data.focusableElements)) {
          swiper.allowClick = false;
        }

        if (data.isTouched) {
          Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY
          });
          data.touchStartTime = now();
        }

        return;
      }

      if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
        if (swiper.isVertical()) {
          // Vertical
          if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
            data.isTouched = false;
            data.isMoved = false;
            return;
          }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
          return;
        }
      }

      if (data.isTouchEvent && document.activeElement) {
        if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
          data.isMoved = true;
          swiper.allowClick = false;
          return;
        }
      }

      if (data.allowTouchCallbacks) {
        swiper.emit('touchMove', e);
      }

      if (e.targetTouches && e.targetTouches.length > 1) return;
      touches.currentX = pageX;
      touches.currentY = pageY;
      const diffX = touches.currentX - touches.startX;
      const diffY = touches.currentY - touches.startY;
      if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

      if (typeof data.isScrolling === 'undefined') {
        let touchAngle;

        if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
          data.isScrolling = false;
        } else {
          // eslint-disable-next-line
          if (diffX * diffX + diffY * diffY >= 25) {
            touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
            data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
          }
        }
      }

      if (data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }

      if (typeof data.startMoving === 'undefined') {
        if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
          data.startMoving = true;
        }
      }

      if (data.isScrolling) {
        data.isTouched = false;
        return;
      }

      if (!data.startMoving) {
        return;
      }

      swiper.allowClick = false;

      if (!params.cssMode && e.cancelable) {
        e.preventDefault();
      }

      if (params.touchMoveStopPropagation && !params.nested) {
        e.stopPropagation();
      }

      if (!data.isMoved) {
        if (params.loop && !params.cssMode) {
          swiper.loopFix();
        }

        data.startTranslate = swiper.getTranslate();
        swiper.setTransition(0);

        if (swiper.animating) {
          swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
        }

        data.allowMomentumBounce = false; // Grab Cursor

        if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
          swiper.setGrabCursor(true);
        }

        swiper.emit('sliderFirstMove', e);
      }

      swiper.emit('sliderMove', e);
      data.isMoved = true;
      let diff = swiper.isHorizontal() ? diffX : diffY;
      touches.diff = diff;
      diff *= params.touchRatio;
      if (rtl) diff = -diff;
      swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
      data.currentTranslate = diff + data.startTranslate;
      let disableParentSwiper = true;
      let resistanceRatio = params.resistanceRatio;

      if (params.touchReleaseOnEdges) {
        resistanceRatio = 0;
      }

      if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }

      if (disableParentSwiper) {
        e.preventedByNestedSwiper = true;
      } // Directions locks


      if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
        data.currentTranslate = data.startTranslate;
      } // Threshold


      if (params.threshold > 0) {
        if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
          if (!data.allowThresholdMove) {
            data.allowThresholdMove = true;
            touches.startX = touches.currentX;
            touches.startY = touches.currentY;
            data.currentTranslate = data.startTranslate;
            touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
            return;
          }
        } else {
          data.currentTranslate = data.startTranslate;
          return;
        }
      }

      if (!params.followFinger || params.cssMode) return; // Update active index in free mode

      if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
        swiper.freeMode.onTouchMove();
      } // Update progress


      swiper.updateProgress(data.currentTranslate); // Update translate

      swiper.setTranslate(data.currentTranslate);
    }

    function onTouchEnd(event) {
      const swiper = this;
      const data = swiper.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        slidesGrid,
        enabled
      } = swiper;
      if (!enabled) return;
      let e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (data.allowTouchCallbacks) {
        swiper.emit('touchEnd', e);
      }

      data.allowTouchCallbacks = false;

      if (!data.isTouched) {
        if (data.isMoved && params.grabCursor) {
          swiper.setGrabCursor(false);
        }

        data.isMoved = false;
        data.startMoving = false;
        return;
      } // Return Grab Cursor


      if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(false);
      } // Time diff


      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

      if (swiper.allowClick) {
        const pathTree = e.path || e.composedPath && e.composedPath();
        swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
        swiper.emit('tap click', e);

        if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
          swiper.emit('doubleTap doubleClick', e);
        }
      }

      data.lastClickTime = now();
      nextTick(() => {
        if (!swiper.destroyed) swiper.allowClick = true;
      });

      if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        return;
      }

      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      let currentPos;

      if (params.followFinger) {
        currentPos = rtl ? swiper.translate : -swiper.translate;
      } else {
        currentPos = -data.currentTranslate;
      }

      if (params.cssMode) {
        return;
      }

      if (swiper.params.freeMode && params.freeMode.enabled) {
        swiper.freeMode.onTouchEnd({
          currentPos
        });
        return;
      } // Find current slide


      let stopIndex = 0;
      let groupSize = swiper.slidesSizesGrid[0];

      for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
        const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

        if (typeof slidesGrid[i + increment] !== 'undefined') {
          if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
            stopIndex = i;
            groupSize = slidesGrid[i + increment] - slidesGrid[i];
          }
        } else if (currentPos >= slidesGrid[i]) {
          stopIndex = i;
          groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
        }
      }

      let rewindFirstIndex = null;
      let rewindLastIndex = null;

      if (params.rewind) {
        if (swiper.isBeginning) {
          rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
        } else if (swiper.isEnd) {
          rewindFirstIndex = 0;
        }
      } // Find current slide size


      const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
      const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

      if (timeDiff > params.longSwipesMs) {
        // Long touches
        if (!params.longSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (swiper.swipeDirection === 'next') {
          if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
        }

        if (swiper.swipeDirection === 'prev') {
          if (ratio > 1 - params.longSwipesRatio) {
            swiper.slideTo(stopIndex + increment);
          } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
            swiper.slideTo(rewindLastIndex);
          } else {
            swiper.slideTo(stopIndex);
          }
        }
      } else {
        // Short swipes
        if (!params.shortSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

        if (!isNavButtonTarget) {
          if (swiper.swipeDirection === 'next') {
            swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
          }

          if (swiper.swipeDirection === 'prev') {
            swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
          }
        } else if (e.target === swiper.navigation.nextEl) {
          swiper.slideTo(stopIndex + increment);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    }

    function onResize() {
      const swiper = this;
      const {
        params,
        el
      } = swiper;
      if (el && el.offsetWidth === 0) return; // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      } // Save locks


      const {
        allowSlideNext,
        allowSlidePrev,
        snapGrid
      } = swiper; // Disable locks on resize

      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateSlidesClasses();

      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
        swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.run();
      } // Return locks after resize


      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;

      if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
    }

    function onClick(e) {
      const swiper = this;
      if (!swiper.enabled) return;

      if (!swiper.allowClick) {
        if (swiper.params.preventClicks) e.preventDefault();

        if (swiper.params.preventClicksPropagation && swiper.animating) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    }

    function onScroll() {
      const swiper = this;
      const {
        wrapperEl,
        rtlTranslate,
        enabled
      } = swiper;
      if (!enabled) return;
      swiper.previousTranslate = swiper.translate;

      if (swiper.isHorizontal()) {
        swiper.translate = -wrapperEl.scrollLeft;
      } else {
        swiper.translate = -wrapperEl.scrollTop;
      } // eslint-disable-next-line


      if (swiper.translate === 0) swiper.translate = 0;
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      let newProgress;
      const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== swiper.progress) {
        swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
      }

      swiper.emit('setTranslate', swiper.translate, false);
    }

    let dummyEventAttached = false;

    function dummyEventListener() {}

    const events = (swiper, method) => {
      const document = getDocument();
      const {
        params,
        touchEvents,
        el,
        wrapperEl,
        device,
        support
      } = swiper;
      const capture = !!params.nested;
      const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
      const swiperMethod = method; // Touch Events

      if (!support.touch) {
        el[domMethod](touchEvents.start, swiper.onTouchStart, false);
        document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
        document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
      } else {
        const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
        el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
          passive: false,
          capture
        } : capture);
        el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

        if (touchEvents.cancel) {
          el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
      } // Prevent Links Clicks


      if (params.preventClicks || params.preventClicksPropagation) {
        el[domMethod]('click', swiper.onClick, true);
      }

      if (params.cssMode) {
        wrapperEl[domMethod]('scroll', swiper.onScroll);
      } // Resize handler


      if (params.updateOnWindowResize) {
        swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
      } else {
        swiper[swiperMethod]('observerUpdate', onResize, true);
      }
    };

    function attachEvents() {
      const swiper = this;
      const document = getDocument();
      const {
        params,
        support
      } = swiper;
      swiper.onTouchStart = onTouchStart.bind(swiper);
      swiper.onTouchMove = onTouchMove.bind(swiper);
      swiper.onTouchEnd = onTouchEnd.bind(swiper);

      if (params.cssMode) {
        swiper.onScroll = onScroll.bind(swiper);
      }

      swiper.onClick = onClick.bind(swiper);

      if (support.touch && !dummyEventAttached) {
        document.addEventListener('touchstart', dummyEventListener);
        dummyEventAttached = true;
      }

      events(swiper, 'on');
    }

    function detachEvents() {
      const swiper = this;
      events(swiper, 'off');
    }

    var events$1 = {
      attachEvents,
      detachEvents
    };

    const isGridEnabled = (swiper, params) => {
      return swiper.grid && params.grid && params.grid.rows > 1;
    };

    function setBreakpoint() {
      const swiper = this;
      const {
        activeIndex,
        initialized,
        loopedSlides = 0,
        params,
        $el
      } = swiper;
      const breakpoints = params.breakpoints;
      if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

      const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
      if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
      const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
      const breakpointParams = breakpointOnlyParams || swiper.originalParams;
      const wasMultiRow = isGridEnabled(swiper, params);
      const isMultiRow = isGridEnabled(swiper, breakpointParams);
      const wasEnabled = params.enabled;

      if (wasMultiRow && !isMultiRow) {
        $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
        swiper.emitContainerClasses();
      } else if (!wasMultiRow && isMultiRow) {
        $el.addClass(`${params.containerModifierClass}grid`);

        if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
          $el.addClass(`${params.containerModifierClass}grid-column`);
        }

        swiper.emitContainerClasses();
      } // Toggle navigation, pagination, scrollbar


      ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
        const wasModuleEnabled = params[prop] && params[prop].enabled;
        const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;

        if (wasModuleEnabled && !isModuleEnabled) {
          swiper[prop].disable();
        }

        if (!wasModuleEnabled && isModuleEnabled) {
          swiper[prop].enable();
        }
      });
      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

      if (directionChanged && initialized) {
        swiper.changeDirection();
      }

      extend(swiper.params, breakpointParams);
      const isEnabled = swiper.params.enabled;
      Object.assign(swiper, {
        allowTouchMove: swiper.params.allowTouchMove,
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev
      });

      if (wasEnabled && !isEnabled) {
        swiper.disable();
      } else if (!wasEnabled && isEnabled) {
        swiper.enable();
      }

      swiper.currentBreakpoint = breakpoint;
      swiper.emit('_beforeBreakpoint', breakpointParams);

      if (needsReLoop && initialized) {
        swiper.loopDestroy();
        swiper.loopCreate();
        swiper.updateSlides();
        swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
      }

      swiper.emit('breakpoint', breakpointParams);
    }

    function getBreakpoint(breakpoints, base, containerEl) {
      if (base === void 0) {
        base = 'window';
      }

      if (!breakpoints || base === 'container' && !containerEl) return undefined;
      let breakpoint = false;
      const window = getWindow();
      const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
      const points = Object.keys(breakpoints).map(point => {
        if (typeof point === 'string' && point.indexOf('@') === 0) {
          const minRatio = parseFloat(point.substr(1));
          const value = currentHeight * minRatio;
          return {
            value,
            point
          };
        }

        return {
          value: point,
          point
        };
      });
      points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

      for (let i = 0; i < points.length; i += 1) {
        const {
          point,
          value
        } = points[i];

        if (base === 'window') {
          if (window.matchMedia(`(min-width: ${value}px)`).matches) {
            breakpoint = point;
          }
        } else if (value <= containerEl.clientWidth) {
          breakpoint = point;
        }
      }

      return breakpoint || 'max';
    }

    var breakpoints = {
      setBreakpoint,
      getBreakpoint
    };

    function prepareClasses(entries, prefix) {
      const resultClasses = [];
      entries.forEach(item => {
        if (typeof item === 'object') {
          Object.keys(item).forEach(classNames => {
            if (item[classNames]) {
              resultClasses.push(prefix + classNames);
            }
          });
        } else if (typeof item === 'string') {
          resultClasses.push(prefix + item);
        }
      });
      return resultClasses;
    }

    function addClasses() {
      const swiper = this;
      const {
        classNames,
        params,
        rtl,
        $el,
        device,
        support
      } = swiper; // prettier-ignore

      const suffixes = prepareClasses(['initialized', params.direction, {
        'pointer-events': !support.touch
      }, {
        'free-mode': swiper.params.freeMode && params.freeMode.enabled
      }, {
        'autoheight': params.autoHeight
      }, {
        'rtl': rtl
      }, {
        'grid': params.grid && params.grid.rows > 1
      }, {
        'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
      }, {
        'android': device.android
      }, {
        'ios': device.ios
      }, {
        'css-mode': params.cssMode
      }, {
        'centered': params.cssMode && params.centeredSlides
      }, {
        'watch-progress': params.watchSlidesProgress
      }], params.containerModifierClass);
      classNames.push(...suffixes);
      $el.addClass([...classNames].join(' '));
      swiper.emitContainerClasses();
    }

    function removeClasses() {
      const swiper = this;
      const {
        $el,
        classNames
      } = swiper;
      $el.removeClass(classNames.join(' '));
      swiper.emitContainerClasses();
    }

    var classes = {
      addClasses,
      removeClasses
    };

    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
      const window = getWindow();
      let image;

      function onReady() {
        if (callback) callback();
      }

      const isPicture = $(imageEl).parent('picture')[0];

      if (!isPicture && (!imageEl.complete || !checkForComplete)) {
        if (src) {
          image = new window.Image();
          image.onload = onReady;
          image.onerror = onReady;

          if (sizes) {
            image.sizes = sizes;
          }

          if (srcset) {
            image.srcset = srcset;
          }

          if (src) {
            image.src = src;
          }
        } else {
          onReady();
        }
      } else {
        // image already loaded...
        onReady();
      }
    }

    function preloadImages() {
      const swiper = this;
      swiper.imagesToLoad = swiper.$el.find('img');

      function onReady() {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
        if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

        if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
          if (swiper.params.updateOnImagesReady) swiper.update();
          swiper.emit('imagesReady');
        }
      }

      for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
        const imageEl = swiper.imagesToLoad[i];
        swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
      }
    }

    var images = {
      loadImage,
      preloadImages
    };

    function checkOverflow() {
      const swiper = this;
      const {
        isLocked: wasLocked,
        params
      } = swiper;
      const {
        slidesOffsetBefore
      } = params;

      if (slidesOffsetBefore) {
        const lastSlideIndex = swiper.slides.length - 1;
        const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
        swiper.isLocked = swiper.size > lastSlideRightEdge;
      } else {
        swiper.isLocked = swiper.snapGrid.length === 1;
      }

      if (params.allowSlideNext === true) {
        swiper.allowSlideNext = !swiper.isLocked;
      }

      if (params.allowSlidePrev === true) {
        swiper.allowSlidePrev = !swiper.isLocked;
      }

      if (wasLocked && wasLocked !== swiper.isLocked) {
        swiper.isEnd = false;
      }

      if (wasLocked !== swiper.isLocked) {
        swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
      }
    }

    var checkOverflow$1 = {
      checkOverflow
    };

    var defaults = {
      init: true,
      direction: 'horizontal',
      touchEventsTarget: 'wrapper',
      initialSlide: 0,
      speed: 300,
      cssMode: false,
      updateOnWindowResize: true,
      resizeObserver: true,
      nested: false,
      createElements: false,
      enabled: true,
      focusableElements: 'input, select, option, textarea, button, video, label',
      // Overrides
      width: null,
      height: null,
      //
      preventInteractionOnTransition: false,
      // ssr
      userAgent: null,
      url: null,
      // To support iOS's swipe-to-go-back gesture (when being used in-app).
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      // Autoheight
      autoHeight: false,
      // Set wrapper width
      setWrapperSize: false,
      // Virtual Translate
      virtualTranslate: false,
      // Effects
      effect: 'slide',
      // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
      // Breakpoints
      breakpoints: undefined,
      breakpointsBase: 'window',
      // Slides grid
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      slidesPerGroupAuto: false,
      centeredSlides: false,
      centeredSlidesBounds: false,
      slidesOffsetBefore: 0,
      // in px
      slidesOffsetAfter: 0,
      // in px
      normalizeSlideIndex: true,
      centerInsufficientSlides: false,
      // Disable swiper and hide navigation when container not overflow
      watchOverflow: true,
      // Round length
      roundLengths: false,
      // Touches
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 0,
      touchMoveStopPropagation: false,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchReleaseOnEdges: false,
      // Unique Navigation Elements
      uniqueNavElements: true,
      // Resistance
      resistance: true,
      resistanceRatio: 0.85,
      // Progress
      watchSlidesProgress: false,
      // Cursor
      grabCursor: false,
      // Clicks
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      // Images
      preloadImages: true,
      updateOnImagesReady: true,
      // loop
      loop: false,
      loopAdditionalSlides: 0,
      loopedSlides: null,
      loopFillGroupWithBlank: false,
      loopPreventsSlide: true,
      // rewind
      rewind: false,
      // Swiping/no swiping
      allowSlidePrev: true,
      allowSlideNext: true,
      swipeHandler: null,
      // '.swipe-handler',
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      noSwipingSelector: null,
      // Passive Listeners
      passiveListeners: true,
      maxBackfaceHiddenSlides: 10,
      // NS
      containerModifierClass: 'swiper-',
      // NEW
      slideClass: 'swiper-slide',
      slideBlankClass: 'swiper-slide-invisible-blank',
      slideActiveClass: 'swiper-slide-active',
      slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
      slideVisibleClass: 'swiper-slide-visible',
      slideDuplicateClass: 'swiper-slide-duplicate',
      slideNextClass: 'swiper-slide-next',
      slideDuplicateNextClass: 'swiper-slide-duplicate-next',
      slidePrevClass: 'swiper-slide-prev',
      slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
      wrapperClass: 'swiper-wrapper',
      // Callbacks
      runCallbacksOnInit: true,
      // Internals
      _emitClasses: false
    };

    function moduleExtendParams(params, allModulesParams) {
      return function extendParams(obj) {
        if (obj === void 0) {
          obj = {};
        }

        const moduleParamName = Object.keys(obj)[0];
        const moduleParams = obj[moduleParamName];

        if (typeof moduleParams !== 'object' || moduleParams === null) {
          extend(allModulesParams, obj);
          return;
        }

        if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
          params[moduleParamName] = {
            auto: true
          };
        }

        if (!(moduleParamName in params && 'enabled' in moduleParams)) {
          extend(allModulesParams, obj);
          return;
        }

        if (params[moduleParamName] === true) {
          params[moduleParamName] = {
            enabled: true
          };
        }

        if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
          params[moduleParamName].enabled = true;
        }

        if (!params[moduleParamName]) params[moduleParamName] = {
          enabled: false
        };
        extend(allModulesParams, obj);
      };
    }

    /* eslint no-param-reassign: "off" */
    const prototypes = {
      eventsEmitter,
      update,
      translate,
      transition,
      slide,
      loop,
      grabCursor,
      events: events$1,
      breakpoints,
      checkOverflow: checkOverflow$1,
      classes,
      images
    };
    const extendedDefaults = {};

    class Swiper {
      constructor() {
        let el;
        let params;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
          params = args[0];
        } else {
          [el, params] = args;
        }

        if (!params) params = {};
        params = extend({}, params);
        if (el && !params.el) params.el = el;

        if (params.el && $(params.el).length > 1) {
          const swipers = [];
          $(params.el).each(containerEl => {
            const newParams = extend({}, params, {
              el: containerEl
            });
            swipers.push(new Swiper(newParams));
          });
          return swipers;
        } // Swiper Instance


        const swiper = this;
        swiper.__swiper__ = true;
        swiper.support = getSupport();
        swiper.device = getDevice({
          userAgent: params.userAgent
        });
        swiper.browser = getBrowser();
        swiper.eventsListeners = {};
        swiper.eventsAnyListeners = [];
        swiper.modules = [...swiper.__modules__];

        if (params.modules && Array.isArray(params.modules)) {
          swiper.modules.push(...params.modules);
        }

        const allModulesParams = {};
        swiper.modules.forEach(mod => {
          mod({
            swiper,
            extendParams: moduleExtendParams(params, allModulesParams),
            on: swiper.on.bind(swiper),
            once: swiper.once.bind(swiper),
            off: swiper.off.bind(swiper),
            emit: swiper.emit.bind(swiper)
          });
        }); // Extend defaults with modules params

        const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

        swiper.params = extend({}, swiperParams, extendedDefaults, params);
        swiper.originalParams = extend({}, swiper.params);
        swiper.passedParams = extend({}, params); // add event listeners

        if (swiper.params && swiper.params.on) {
          Object.keys(swiper.params.on).forEach(eventName => {
            swiper.on(eventName, swiper.params.on[eventName]);
          });
        }

        if (swiper.params && swiper.params.onAny) {
          swiper.onAny(swiper.params.onAny);
        } // Save Dom lib


        swiper.$ = $; // Extend Swiper

        Object.assign(swiper, {
          enabled: swiper.params.enabled,
          el,
          // Classes
          classNames: [],
          // Slides
          slides: $(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],

          // isDirection
          isHorizontal() {
            return swiper.params.direction === 'horizontal';
          },

          isVertical() {
            return swiper.params.direction === 'vertical';
          },

          // Indexes
          activeIndex: 0,
          realIndex: 0,
          //
          isBeginning: true,
          isEnd: false,
          // Props
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: false,
          // Locks
          allowSlideNext: swiper.params.allowSlideNext,
          allowSlidePrev: swiper.params.allowSlidePrev,
          // Touch Events
          touchEvents: function touchEvents() {
            const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            const desktop = ['pointerdown', 'pointermove', 'pointerup'];
            swiper.touchEventsTouch = {
              start: touch[0],
              move: touch[1],
              end: touch[2],
              cancel: touch[3]
            };
            swiper.touchEventsDesktop = {
              start: desktop[0],
              move: desktop[1],
              end: desktop[2]
            };
            return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
          }(),
          touchEventsData: {
            isTouched: undefined,
            isMoved: undefined,
            allowTouchCallbacks: undefined,
            touchStartTime: undefined,
            isScrolling: undefined,
            currentTranslate: undefined,
            startTranslate: undefined,
            allowThresholdMove: undefined,
            // Form elements to match
            focusableElements: swiper.params.focusableElements,
            // Last click time
            lastClickTime: now(),
            clickTimeout: undefined,
            // Velocities
            velocities: [],
            allowMomentumBounce: undefined,
            isTouchEvent: undefined,
            startMoving: undefined
          },
          // Clicks
          allowClick: true,
          // Touches
          allowTouchMove: swiper.params.allowTouchMove,
          touches: {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
          },
          // Images
          imagesToLoad: [],
          imagesLoaded: 0
        });
        swiper.emit('_swiper'); // Init

        if (swiper.params.init) {
          swiper.init();
        } // Return app instance


        return swiper;
      }

      enable() {
        const swiper = this;
        if (swiper.enabled) return;
        swiper.enabled = true;

        if (swiper.params.grabCursor) {
          swiper.setGrabCursor();
        }

        swiper.emit('enable');
      }

      disable() {
        const swiper = this;
        if (!swiper.enabled) return;
        swiper.enabled = false;

        if (swiper.params.grabCursor) {
          swiper.unsetGrabCursor();
        }

        swiper.emit('disable');
      }

      setProgress(progress, speed) {
        const swiper = this;
        progress = Math.min(Math.max(progress, 0), 1);
        const min = swiper.minTranslate();
        const max = swiper.maxTranslate();
        const current = (max - min) * progress + min;
        swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      emitContainerClasses() {
        const swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        const cls = swiper.el.className.split(' ').filter(className => {
          return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
        });
        swiper.emit('_containerClasses', cls.join(' '));
      }

      getSlideClasses(slideEl) {
        const swiper = this;
        if (swiper.destroyed) return '';
        return slideEl.className.split(' ').filter(className => {
          return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
        }).join(' ');
      }

      emitSlidesClasses() {
        const swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        const updates = [];
        swiper.slides.each(slideEl => {
          const classNames = swiper.getSlideClasses(slideEl);
          updates.push({
            slideEl,
            classNames
          });
          swiper.emit('_slideClass', slideEl, classNames);
        });
        swiper.emit('_slideClasses', updates);
      }

      slidesPerViewDynamic(view, exact) {
        if (view === void 0) {
          view = 'current';
        }

        if (exact === void 0) {
          exact = false;
        }

        const swiper = this;
        const {
          params,
          slides,
          slidesGrid,
          slidesSizesGrid,
          size: swiperSize,
          activeIndex
        } = swiper;
        let spv = 1;

        if (params.centeredSlides) {
          let slideSize = slides[activeIndex].swiperSlideSize;
          let breakLoop;

          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }

          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }
        } else {
          // eslint-disable-next-line
          if (view === 'current') {
            for (let i = activeIndex + 1; i < slides.length; i += 1) {
              const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

              if (slideInView) {
                spv += 1;
              }
            }
          } else {
            // previous
            for (let i = activeIndex - 1; i >= 0; i -= 1) {
              const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

              if (slideInView) {
                spv += 1;
              }
            }
          }
        }

        return spv;
      }

      update() {
        const swiper = this;
        if (!swiper || swiper.destroyed) return;
        const {
          snapGrid,
          params
        } = swiper; // Breakpoints

        if (params.breakpoints) {
          swiper.setBreakpoint();
        }

        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateProgress();
        swiper.updateSlidesClasses();

        function setTranslate() {
          const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
          const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
          swiper.setTranslate(newTranslate);
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }

        let translated;

        if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
          setTranslate();

          if (swiper.params.autoHeight) {
            swiper.updateAutoHeight();
          }
        } else {
          if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
            translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
          } else {
            translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
          }

          if (!translated) {
            setTranslate();
          }
        }

        if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
          swiper.checkOverflow();
        }

        swiper.emit('update');
      }

      changeDirection(newDirection, needUpdate) {
        if (needUpdate === void 0) {
          needUpdate = true;
        }

        const swiper = this;
        const currentDirection = swiper.params.direction;

        if (!newDirection) {
          // eslint-disable-next-line
          newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
        }

        if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
          return swiper;
        }

        swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
        swiper.emitContainerClasses();
        swiper.params.direction = newDirection;
        swiper.slides.each(slideEl => {
          if (newDirection === 'vertical') {
            slideEl.style.width = '';
          } else {
            slideEl.style.height = '';
          }
        });
        swiper.emit('changeDirection');
        if (needUpdate) swiper.update();
        return swiper;
      }

      changeLanguageDirection(direction) {
        const swiper = this;
        if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
        swiper.rtl = direction === 'rtl';
        swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;

        if (swiper.rtl) {
          swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
          swiper.el.dir = 'rtl';
        } else {
          swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
          swiper.el.dir = 'ltr';
        }

        swiper.update();
      }

      mount(el) {
        const swiper = this;
        if (swiper.mounted) return true; // Find el

        const $el = $(el || swiper.params.el);
        el = $el[0];

        if (!el) {
          return false;
        }

        el.swiper = swiper;

        const getWrapperSelector = () => {
          return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
        };

        const getWrapper = () => {
          if (el && el.shadowRoot && el.shadowRoot.querySelector) {
            const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

            res.children = options => $el.children(options);

            return res;
          }

          if (!$el.children) {
            return $($el).children(getWrapperSelector());
          }

          return $el.children(getWrapperSelector());
        }; // Find Wrapper


        let $wrapperEl = getWrapper();

        if ($wrapperEl.length === 0 && swiper.params.createElements) {
          const document = getDocument();
          const wrapper = document.createElement('div');
          $wrapperEl = $(wrapper);
          wrapper.className = swiper.params.wrapperClass;
          $el.append(wrapper);
          $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
            $wrapperEl.append(slideEl);
          });
        }

        Object.assign(swiper, {
          $el,
          el,
          $wrapperEl,
          wrapperEl: $wrapperEl[0],
          mounted: true,
          // RTL
          rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
          rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
          wrongRTL: $wrapperEl.css('display') === '-webkit-box'
        });
        return true;
      }

      init(el) {
        const swiper = this;
        if (swiper.initialized) return swiper;
        const mounted = swiper.mount(el);
        if (mounted === false) return swiper;
        swiper.emit('beforeInit'); // Set breakpoint

        if (swiper.params.breakpoints) {
          swiper.setBreakpoint();
        } // Add Classes


        swiper.addClasses(); // Create loop

        if (swiper.params.loop) {
          swiper.loopCreate();
        } // Update size


        swiper.updateSize(); // Update slides

        swiper.updateSlides();

        if (swiper.params.watchOverflow) {
          swiper.checkOverflow();
        } // Set Grab Cursor


        if (swiper.params.grabCursor && swiper.enabled) {
          swiper.setGrabCursor();
        }

        if (swiper.params.preloadImages) {
          swiper.preloadImages();
        } // Slide To Initial Slide


        if (swiper.params.loop) {
          swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
        } else {
          swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
        } // Attach events


        swiper.attachEvents(); // Init Flag

        swiper.initialized = true; // Emit

        swiper.emit('init');
        swiper.emit('afterInit');
        return swiper;
      }

      destroy(deleteInstance, cleanStyles) {
        if (deleteInstance === void 0) {
          deleteInstance = true;
        }

        if (cleanStyles === void 0) {
          cleanStyles = true;
        }

        const swiper = this;
        const {
          params,
          $el,
          $wrapperEl,
          slides
        } = swiper;

        if (typeof swiper.params === 'undefined' || swiper.destroyed) {
          return null;
        }

        swiper.emit('beforeDestroy'); // Init Flag

        swiper.initialized = false; // Detach events

        swiper.detachEvents(); // Destroy loop

        if (params.loop) {
          swiper.loopDestroy();
        } // Cleanup styles


        if (cleanStyles) {
          swiper.removeClasses();
          $el.removeAttr('style');
          $wrapperEl.removeAttr('style');

          if (slides && slides.length) {
            slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
          }
        }

        swiper.emit('destroy'); // Detach emitter events

        Object.keys(swiper.eventsListeners).forEach(eventName => {
          swiper.off(eventName);
        });

        if (deleteInstance !== false) {
          swiper.$el[0].swiper = null;
          deleteProps(swiper);
        }

        swiper.destroyed = true;
        return null;
      }

      static extendDefaults(newDefaults) {
        extend(extendedDefaults, newDefaults);
      }

      static get extendedDefaults() {
        return extendedDefaults;
      }

      static get defaults() {
        return defaults;
      }

      static installModule(mod) {
        if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
        const modules = Swiper.prototype.__modules__;

        if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
          modules.push(mod);
        }
      }

      static use(module) {
        if (Array.isArray(module)) {
          module.forEach(m => Swiper.installModule(m));
          return Swiper;
        }

        Swiper.installModule(module);
        return Swiper;
      }

    }

    Object.keys(prototypes).forEach(prototypeGroup => {
      Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
        Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
      });
    });
    Swiper.use([Resize, Observer]);

    function Virtual(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        virtual: {
          enabled: false,
          slides: [],
          cache: true,
          renderSlide: null,
          renderExternal: null,
          renderExternalUpdate: true,
          addSlidesBefore: 0,
          addSlidesAfter: 0
        }
      });
      let cssModeTimeout;
      swiper.virtual = {
        cache: {},
        from: undefined,
        to: undefined,
        slides: [],
        offset: 0,
        slidesGrid: []
      };

      function renderSlide(slide, index) {
        const params = swiper.params.virtual;

        if (params.cache && swiper.virtual.cache[index]) {
          return swiper.virtual.cache[index];
        }

        const $slideEl = params.renderSlide ? $(params.renderSlide.call(swiper, slide, index)) : $(`<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`);
        if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
        if (params.cache) swiper.virtual.cache[index] = $slideEl;
        return $slideEl;
      }

      function update(force) {
        const {
          slidesPerView,
          slidesPerGroup,
          centeredSlides
        } = swiper.params;
        const {
          addSlidesBefore,
          addSlidesAfter
        } = swiper.params.virtual;
        const {
          from: previousFrom,
          to: previousTo,
          slides,
          slidesGrid: previousSlidesGrid,
          offset: previousOffset
        } = swiper.virtual;

        if (!swiper.params.cssMode) {
          swiper.updateActiveIndex();
        }

        const activeIndex = swiper.activeIndex || 0;
        let offsetProp;
        if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
        let slidesAfter;
        let slidesBefore;

        if (centeredSlides) {
          slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
          slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
        } else {
          slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
          slidesBefore = slidesPerGroup + addSlidesBefore;
        }

        const from = Math.max((activeIndex || 0) - slidesBefore, 0);
        const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
        const offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
        Object.assign(swiper.virtual, {
          from,
          to,
          offset,
          slidesGrid: swiper.slidesGrid
        });

        function onRendered() {
          swiper.updateSlides();
          swiper.updateProgress();
          swiper.updateSlidesClasses();

          if (swiper.lazy && swiper.params.lazy.enabled) {
            swiper.lazy.load();
          }

          emit('virtualUpdate');
        }

        if (previousFrom === from && previousTo === to && !force) {
          if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
            swiper.slides.css(offsetProp, `${offset}px`);
          }

          swiper.updateProgress();
          emit('virtualUpdate');
          return;
        }

        if (swiper.params.virtual.renderExternal) {
          swiper.params.virtual.renderExternal.call(swiper, {
            offset,
            from,
            to,
            slides: function getSlides() {
              const slidesToRender = [];

              for (let i = from; i <= to; i += 1) {
                slidesToRender.push(slides[i]);
              }

              return slidesToRender;
            }()
          });

          if (swiper.params.virtual.renderExternalUpdate) {
            onRendered();
          } else {
            emit('virtualUpdate');
          }

          return;
        }

        const prependIndexes = [];
        const appendIndexes = [];

        if (force) {
          swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
        } else {
          for (let i = previousFrom; i <= previousTo; i += 1) {
            if (i < from || i > to) {
              swiper.$wrapperEl.find(`.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`).remove();
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          if (i >= from && i <= to) {
            if (typeof previousTo === 'undefined' || force) {
              appendIndexes.push(i);
            } else {
              if (i > previousTo) appendIndexes.push(i);
              if (i < previousFrom) prependIndexes.push(i);
            }
          }
        }

        appendIndexes.forEach(index => {
          swiper.$wrapperEl.append(renderSlide(slides[index], index));
        });
        prependIndexes.sort((a, b) => b - a).forEach(index => {
          swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
        });
        swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, `${offset}px`);
        onRendered();
      }

      function appendSlide(slides) {
        if (typeof slides === 'object' && 'length' in slides) {
          for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) swiper.virtual.slides.push(slides[i]);
          }
        } else {
          swiper.virtual.slides.push(slides);
        }

        update(true);
      }

      function prependSlide(slides) {
        const activeIndex = swiper.activeIndex;
        let newActiveIndex = activeIndex + 1;
        let numberOfNewSlides = 1;

        if (Array.isArray(slides)) {
          for (let i = 0; i < slides.length; i += 1) {
            if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
          }

          newActiveIndex = activeIndex + slides.length;
          numberOfNewSlides = slides.length;
        } else {
          swiper.virtual.slides.unshift(slides);
        }

        if (swiper.params.virtual.cache) {
          const cache = swiper.virtual.cache;
          const newCache = {};
          Object.keys(cache).forEach(cachedIndex => {
            const $cachedEl = cache[cachedIndex];
            const cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

            if (cachedElIndex) {
              $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
            }

            newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
          });
          swiper.virtual.cache = newCache;
        }

        update(true);
        swiper.slideTo(newActiveIndex, 0);
      }

      function removeSlide(slidesIndexes) {
        if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
        let activeIndex = swiper.activeIndex;

        if (Array.isArray(slidesIndexes)) {
          for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
            swiper.virtual.slides.splice(slidesIndexes[i], 1);

            if (swiper.params.virtual.cache) {
              delete swiper.virtual.cache[slidesIndexes[i]];
            }

            if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
            activeIndex = Math.max(activeIndex, 0);
          }
        } else {
          swiper.virtual.slides.splice(slidesIndexes, 1);

          if (swiper.params.virtual.cache) {
            delete swiper.virtual.cache[slidesIndexes];
          }

          if (slidesIndexes < activeIndex) activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }

        update(true);
        swiper.slideTo(activeIndex, 0);
      }

      function removeAllSlides() {
        swiper.virtual.slides = [];

        if (swiper.params.virtual.cache) {
          swiper.virtual.cache = {};
        }

        update(true);
        swiper.slideTo(0, 0);
      }

      on('beforeInit', () => {
        if (!swiper.params.virtual.enabled) return;
        swiper.virtual.slides = swiper.params.virtual.slides;
        swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;

        if (!swiper.params.initialSlide) {
          update();
        }
      });
      on('setTranslate', () => {
        if (!swiper.params.virtual.enabled) return;

        if (swiper.params.cssMode && !swiper._immediateVirtual) {
          clearTimeout(cssModeTimeout);
          cssModeTimeout = setTimeout(() => {
            update();
          }, 100);
        } else {
          update();
        }
      });
      on('init update resize', () => {
        if (!swiper.params.virtual.enabled) return;

        if (swiper.params.cssMode) {
          setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
        }
      });
      Object.assign(swiper.virtual, {
        appendSlide,
        prependSlide,
        removeSlide,
        removeAllSlides,
        update
      });
    }

    /* eslint-disable consistent-return */
    function Keyboard(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const document = getDocument();
      const window = getWindow();
      swiper.keyboard = {
        enabled: false
      };
      extendParams({
        keyboard: {
          enabled: false,
          onlyInViewport: true,
          pageUpDown: true
        }
      });

      function handle(event) {
        if (!swiper.enabled) return;
        const {
          rtlTranslate: rtl
        } = swiper;
        let e = event;
        if (e.originalEvent) e = e.originalEvent; // jquery fix

        const kc = e.keyCode || e.charCode;
        const pageUpDown = swiper.params.keyboard.pageUpDown;
        const isPageUp = pageUpDown && kc === 33;
        const isPageDown = pageUpDown && kc === 34;
        const isArrowLeft = kc === 37;
        const isArrowRight = kc === 39;
        const isArrowUp = kc === 38;
        const isArrowDown = kc === 40; // Directions locks

        if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
          return false;
        }

        if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
          return false;
        }

        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
          return undefined;
        }

        if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
          return undefined;
        }

        if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
          let inView = false; // Check that swiper should be inside of visible area of window

          if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
            return undefined;
          }

          const $el = swiper.$el;
          const swiperWidth = $el[0].clientWidth;
          const swiperHeight = $el[0].clientHeight;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const swiperOffset = swiper.$el.offset();
          if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
          const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

          for (let i = 0; i < swiperCoord.length; i += 1) {
            const point = swiperCoord[i];

            if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
              if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

              inView = true;
            }
          }

          if (!inView) return undefined;
        }

        if (swiper.isHorizontal()) {
          if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
            if (e.preventDefault) e.preventDefault();else e.returnValue = false;
          }

          if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
          if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
        } else {
          if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
            if (e.preventDefault) e.preventDefault();else e.returnValue = false;
          }

          if (isPageDown || isArrowDown) swiper.slideNext();
          if (isPageUp || isArrowUp) swiper.slidePrev();
        }

        emit('keyPress', kc);
        return undefined;
      }

      function enable() {
        if (swiper.keyboard.enabled) return;
        $(document).on('keydown', handle);
        swiper.keyboard.enabled = true;
      }

      function disable() {
        if (!swiper.keyboard.enabled) return;
        $(document).off('keydown', handle);
        swiper.keyboard.enabled = false;
      }

      on('init', () => {
        if (swiper.params.keyboard.enabled) {
          enable();
        }
      });
      on('destroy', () => {
        if (swiper.keyboard.enabled) {
          disable();
        }
      });
      Object.assign(swiper.keyboard, {
        enable,
        disable
      });
    }

    /* eslint-disable consistent-return */
    function Mousewheel(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const window = getWindow();
      extendParams({
        mousewheel: {
          enabled: false,
          releaseOnEdges: false,
          invert: false,
          forceToAxis: false,
          sensitivity: 1,
          eventsTarget: 'container',
          thresholdDelta: null,
          thresholdTime: null
        }
      });
      swiper.mousewheel = {
        enabled: false
      };
      let timeout;
      let lastScrollTime = now();
      let lastEventBeforeSnap;
      const recentWheelEvents = [];

      function normalize(e) {
        // Reasonable defaults
        const PIXEL_STEP = 10;
        const LINE_HEIGHT = 40;
        const PAGE_HEIGHT = 800;
        let sX = 0;
        let sY = 0; // spinX, spinY

        let pX = 0;
        let pY = 0; // pixelX, pixelY
        // Legacy

        if ('detail' in e) {
          sY = e.detail;
        }

        if ('wheelDelta' in e) {
          sY = -e.wheelDelta / 120;
        }

        if ('wheelDeltaY' in e) {
          sY = -e.wheelDeltaY / 120;
        }

        if ('wheelDeltaX' in e) {
          sX = -e.wheelDeltaX / 120;
        } // side scrolling on FF with DOMMouseScroll


        if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
          sX = sY;
          sY = 0;
        }

        pX = sX * PIXEL_STEP;
        pY = sY * PIXEL_STEP;

        if ('deltaY' in e) {
          pY = e.deltaY;
        }

        if ('deltaX' in e) {
          pX = e.deltaX;
        }

        if (e.shiftKey && !pX) {
          // if user scrolls with shift he wants horizontal scroll
          pX = pY;
          pY = 0;
        }

        if ((pX || pY) && e.deltaMode) {
          if (e.deltaMode === 1) {
            // delta in LINE units
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
          } else {
            // delta in PAGE units
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
          }
        } // Fall-back if spin cannot be determined


        if (pX && !sX) {
          sX = pX < 1 ? -1 : 1;
        }

        if (pY && !sY) {
          sY = pY < 1 ? -1 : 1;
        }

        return {
          spinX: sX,
          spinY: sY,
          pixelX: pX,
          pixelY: pY
        };
      }

      function handleMouseEnter() {
        if (!swiper.enabled) return;
        swiper.mouseEntered = true;
      }

      function handleMouseLeave() {
        if (!swiper.enabled) return;
        swiper.mouseEntered = false;
      }

      function animateSlider(newEvent) {
        if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
          // Prevent if delta of wheel scroll delta is below configured threshold
          return false;
        }

        if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
          // Prevent if time between scrolls is below configured threshold
          return false;
        } // If the movement is NOT big enough and
        // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
        //   Don't go any further (avoid insignificant scroll movement).


        if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
          // Return false as a default
          return true;
        } // If user is scrolling towards the end:
        //   If the slider hasn't hit the latest slide or
        //   if the slider is a loop and
        //   if the slider isn't moving right now:
        //     Go to next slide and
        //     emit a scroll event.
        // Else (the user is scrolling towards the beginning) and
        // if the slider hasn't hit the first slide or
        // if the slider is a loop and
        // if the slider isn't moving right now:
        //   Go to prev slide and
        //   emit a scroll event.


        if (newEvent.direction < 0) {
          if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
            swiper.slideNext();
            emit('scroll', newEvent.raw);
          }
        } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
          swiper.slidePrev();
          emit('scroll', newEvent.raw);
        } // If you got here is because an animation has been triggered so store the current time


        lastScrollTime = new window.Date().getTime(); // Return false as a default

        return false;
      }

      function releaseScroll(newEvent) {
        const params = swiper.params.mousewheel;

        if (newEvent.direction < 0) {
          if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
            // Return true to animate scroll on edges
            return true;
          }
        } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }

        return false;
      }

      function handle(event) {
        let e = event;
        let disableParentSwiper = true;
        if (!swiper.enabled) return;
        const params = swiper.params.mousewheel;

        if (swiper.params.cssMode) {
          e.preventDefault();
        }

        let target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
        if (e.originalEvent) e = e.originalEvent; // jquery fix

        let delta = 0;
        const rtlFactor = swiper.rtlTranslate ? -1 : 1;
        const data = normalize(e);

        if (params.forceToAxis) {
          if (swiper.isHorizontal()) {
            if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
          } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
        } else {
          delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
        }

        if (delta === 0) return true;
        if (params.invert) delta = -delta; // Get the scroll positions

        let positions = swiper.getTranslate() + delta * params.sensitivity;
        if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
        if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
        //     the disableParentSwiper will be true.
        // When loop is false:
        //     if the scroll positions is not on edge,
        //     then the disableParentSwiper will be true.
        //     if the scroll on edge positions,
        //     then the disableParentSwiper will be false.

        disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
        if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

        if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
          // Register the new event in a variable which stores the relevant data
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta),
            raw: event
          }; // Keep the most recent events

          if (recentWheelEvents.length >= 2) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
          //   If direction has changed or
          //   if the scroll is quicker than the previous one:
          //     Animate the slider.
          // Else (this is the first time the wheel is moved):
          //     Animate the slider.

          if (prevEvent) {
            if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
              animateSlider(newEvent);
            }
          } else {
            animateSlider(newEvent);
          } // If it's time to release the scroll:
          //   Return now so you don't hit the preventDefault.


          if (releaseScroll(newEvent)) {
            return true;
          }
        } else {
          // Freemode or scrollContainer:
          // If we recently snapped after a momentum scroll, then ignore wheel events
          // to give time for the deceleration to finish. Stop ignoring after 500 msecs
          // or if it's a new scroll (larger delta or inverse sign as last event before
          // an end-of-momentum snap).
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta)
          };
          const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

          if (!ignoreWheelEvents) {
            lastEventBeforeSnap = undefined;

            if (swiper.params.loop) {
              swiper.loopFix();
            }

            let position = swiper.getTranslate() + delta * params.sensitivity;
            const wasBeginning = swiper.isBeginning;
            const wasEnd = swiper.isEnd;
            if (position >= swiper.minTranslate()) position = swiper.minTranslate();
            if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
            swiper.setTransition(0);
            swiper.setTranslate(position);
            swiper.updateProgress();
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();

            if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
              swiper.updateSlidesClasses();
            }

            if (swiper.params.freeMode.sticky) {
              // When wheel scrolling starts with sticky (aka snap) enabled, then detect
              // the end of a momentum scroll by storing recent (N=15?) wheel events.
              // 1. do all N events have decreasing or same (absolute value) delta?
              // 2. did all N events arrive in the last M (M=500?) msecs?
              // 3. does the earliest event have an (absolute value) delta that's
              //    at least P (P=1?) larger than the most recent event's delta?
              // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
              // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
              // Snap immediately and ignore remaining wheel events in this scroll.
              // See comment above for "remaining wheel events in this scroll" determination.
              // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
              clearTimeout(timeout);
              timeout = undefined;

              if (recentWheelEvents.length >= 15) {
                recentWheelEvents.shift(); // only store the last N events
              }

              const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
              const firstEvent = recentWheelEvents[0];
              recentWheelEvents.push(newEvent);

              if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
                // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
                recentWheelEvents.splice(0);
              } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
                // We're at the end of the deceleration of a momentum scroll, so there's no need
                // to wait for more events. Snap ASAP on the next tick.
                // Also, because there's some remaining momentum we'll bias the snap in the
                // direction of the ongoing scroll because it's better UX for the scroll to snap
                // in the same direction as the scroll instead of reversing to snap.  Therefore,
                // if it's already scrolled more than 20% in the current direction, keep going.
                const snapToThreshold = delta > 0 ? 0.8 : 0.2;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                timeout = nextTick(() => {
                  swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                }, 0); // no delay; move on next tick
              }

              if (!timeout) {
                // if we get here, then we haven't detected the end of a momentum scroll, so
                // we'll consider a scroll "complete" when there haven't been any wheel events
                // for 500ms.
                timeout = nextTick(() => {
                  const snapToThreshold = 0.5;
                  lastEventBeforeSnap = newEvent;
                  recentWheelEvents.splice(0);
                  swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                }, 500);
              }
            } // Emit event


            if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

            if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

            if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
          }
        }

        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        return false;
      }

      function events(method) {
        let target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        target[method]('mouseenter', handleMouseEnter);
        target[method]('mouseleave', handleMouseLeave);
        target[method]('wheel', handle);
      }

      function enable() {
        if (swiper.params.cssMode) {
          swiper.wrapperEl.removeEventListener('wheel', handle);
          return true;
        }

        if (swiper.mousewheel.enabled) return false;
        events('on');
        swiper.mousewheel.enabled = true;
        return true;
      }

      function disable() {
        if (swiper.params.cssMode) {
          swiper.wrapperEl.addEventListener(event, handle);
          return true;
        }

        if (!swiper.mousewheel.enabled) return false;
        events('off');
        swiper.mousewheel.enabled = false;
        return true;
      }

      on('init', () => {
        if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
          disable();
        }

        if (swiper.params.mousewheel.enabled) enable();
      });
      on('destroy', () => {
        if (swiper.params.cssMode) {
          enable();
        }

        if (swiper.mousewheel.enabled) disable();
      });
      Object.assign(swiper.mousewheel, {
        enable,
        disable
      });
    }

    function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
      const document = getDocument();

      if (swiper.params.createElements) {
        Object.keys(checkProps).forEach(key => {
          if (!params[key] && params.auto === true) {
            let element = swiper.$el.children(`.${checkProps[key]}`)[0];

            if (!element) {
              element = document.createElement('div');
              element.className = checkProps[key];
              swiper.$el.append(element);
            }

            params[key] = element;
            originalParams[key] = element;
          }
        });
      }

      return params;
    }

    function Navigation(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: false,
          disabledClass: 'swiper-button-disabled',
          hiddenClass: 'swiper-button-hidden',
          lockClass: 'swiper-button-lock',
          navigationDisabledClass: 'swiper-navigation-disabled'
        }
      });
      swiper.navigation = {
        nextEl: null,
        $nextEl: null,
        prevEl: null,
        $prevEl: null
      };

      function getEl(el) {
        let $el;

        if (el) {
          $el = $(el);

          if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
            $el = swiper.$el.find(el);
          }
        }

        return $el;
      }

      function toggleEl($el, disabled) {
        const params = swiper.params.navigation;

        if ($el && $el.length > 0) {
          $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
          if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

          if (swiper.params.watchOverflow && swiper.enabled) {
            $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
          }
        }
      }

      function update() {
        // Update Navigation Buttons
        if (swiper.params.loop) return;
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;
        toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
        toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
      }

      function onPrevClick(e) {
        e.preventDefault();
        if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
        swiper.slidePrev();
        emit('navigationPrev');
      }

      function onNextClick(e) {
        e.preventDefault();
        if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
        swiper.slideNext();
        emit('navigationNext');
      }

      function init() {
        const params = swiper.params.navigation;
        swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
          nextEl: 'swiper-button-next',
          prevEl: 'swiper-button-prev'
        });
        if (!(params.nextEl || params.prevEl)) return;
        const $nextEl = getEl(params.nextEl);
        const $prevEl = getEl(params.prevEl);

        if ($nextEl && $nextEl.length > 0) {
          $nextEl.on('click', onNextClick);
        }

        if ($prevEl && $prevEl.length > 0) {
          $prevEl.on('click', onPrevClick);
        }

        Object.assign(swiper.navigation, {
          $nextEl,
          nextEl: $nextEl && $nextEl[0],
          $prevEl,
          prevEl: $prevEl && $prevEl[0]
        });

        if (!swiper.enabled) {
          if ($nextEl) $nextEl.addClass(params.lockClass);
          if ($prevEl) $prevEl.addClass(params.lockClass);
        }
      }

      function destroy() {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($nextEl && $nextEl.length) {
          $nextEl.off('click', onNextClick);
          $nextEl.removeClass(swiper.params.navigation.disabledClass);
        }

        if ($prevEl && $prevEl.length) {
          $prevEl.off('click', onPrevClick);
          $prevEl.removeClass(swiper.params.navigation.disabledClass);
        }
      }

      on('init', () => {
        if (swiper.params.navigation.enabled === false) {
          // eslint-disable-next-line
          disable();
        } else {
          init();
          update();
        }
      });
      on('toEdge fromEdge lock unlock', () => {
        update();
      });
      on('destroy', () => {
        destroy();
      });
      on('enable disable', () => {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($nextEl) {
          $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
        }

        if ($prevEl) {
          $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
        }
      });
      on('click', (_s, e) => {
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;
        const targetEl = e.target;

        if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
          if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
          let isHidden;

          if ($nextEl) {
            isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
          } else if ($prevEl) {
            isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
          }

          if (isHidden === true) {
            emit('navigationShow');
          } else {
            emit('navigationHide');
          }

          if ($nextEl) {
            $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
          }

          if ($prevEl) {
            $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
          }
        }
      });

      const enable = () => {
        swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
        init();
        update();
      };

      const disable = () => {
        swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
        destroy();
      };

      Object.assign(swiper.navigation, {
        enable,
        disable,
        update,
        init,
        destroy
      });
    }

    function classesToSelector(classes) {
      if (classes === void 0) {
        classes = '';
      }

      return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
    }

    function Pagination(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const pfx = 'swiper-pagination';
      extendParams({
        pagination: {
          el: null,
          bulletElement: 'span',
          clickable: false,
          hideOnClick: false,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: false,
          type: 'bullets',
          // 'bullets' or 'progressbar' or 'fraction' or 'custom'
          dynamicBullets: false,
          dynamicMainBullets: 1,
          formatFractionCurrent: number => number,
          formatFractionTotal: number => number,
          bulletClass: `${pfx}-bullet`,
          bulletActiveClass: `${pfx}-bullet-active`,
          modifierClass: `${pfx}-`,
          currentClass: `${pfx}-current`,
          totalClass: `${pfx}-total`,
          hiddenClass: `${pfx}-hidden`,
          progressbarFillClass: `${pfx}-progressbar-fill`,
          progressbarOppositeClass: `${pfx}-progressbar-opposite`,
          clickableClass: `${pfx}-clickable`,
          lockClass: `${pfx}-lock`,
          horizontalClass: `${pfx}-horizontal`,
          verticalClass: `${pfx}-vertical`,
          paginationDisabledClass: `${pfx}-disabled`
        }
      });
      swiper.pagination = {
        el: null,
        $el: null,
        bullets: []
      };
      let bulletSize;
      let dynamicBulletIndex = 0;

      function isPaginationDisabled() {
        return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
      }

      function setSideBullets($bulletEl, position) {
        const {
          bulletActiveClass
        } = swiper.params.pagination;
        $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
      }

      function update() {
        // Render || Update Pagination bullets/items
        const rtl = swiper.rtl;
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
        const $el = swiper.pagination.$el; // Current/Total

        let current;
        const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

        if (swiper.params.loop) {
          current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

          if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
            current -= slidesLength - swiper.loopedSlides * 2;
          }

          if (current > total - 1) current -= total;
          if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
        } else if (typeof swiper.snapIndex !== 'undefined') {
          current = swiper.snapIndex;
        } else {
          current = swiper.activeIndex || 0;
        } // Types


        if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
          const bullets = swiper.pagination.bullets;
          let firstIndex;
          let lastIndex;
          let midIndex;

          if (params.dynamicBullets) {
            bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
            $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

            if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
              dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);

              if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
                dynamicBulletIndex = params.dynamicMainBullets - 1;
              } else if (dynamicBulletIndex < 0) {
                dynamicBulletIndex = 0;
              }
            }

            firstIndex = Math.max(current - dynamicBulletIndex, 0);
            lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
            midIndex = (lastIndex + firstIndex) / 2;
          }

          bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

          if ($el.length > 1) {
            bullets.each(bullet => {
              const $bullet = $(bullet);
              const bulletIndex = $bullet.index();

              if (bulletIndex === current) {
                $bullet.addClass(params.bulletActiveClass);
              }

              if (params.dynamicBullets) {
                if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                  $bullet.addClass(`${params.bulletActiveClass}-main`);
                }

                if (bulletIndex === firstIndex) {
                  setSideBullets($bullet, 'prev');
                }

                if (bulletIndex === lastIndex) {
                  setSideBullets($bullet, 'next');
                }
              }
            });
          } else {
            const $bullet = bullets.eq(current);
            const bulletIndex = $bullet.index();
            $bullet.addClass(params.bulletActiveClass);

            if (params.dynamicBullets) {
              const $firstDisplayedBullet = bullets.eq(firstIndex);
              const $lastDisplayedBullet = bullets.eq(lastIndex);

              for (let i = firstIndex; i <= lastIndex; i += 1) {
                bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
              }

              if (swiper.params.loop) {
                if (bulletIndex >= bullets.length) {
                  for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                    bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                  }

                  bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                } else {
                  setSideBullets($firstDisplayedBullet, 'prev');
                  setSideBullets($lastDisplayedBullet, 'next');
                }
              } else {
                setSideBullets($firstDisplayedBullet, 'prev');
                setSideBullets($lastDisplayedBullet, 'next');
              }
            }
          }

          if (params.dynamicBullets) {
            const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
            const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
            const offsetProp = rtl ? 'right' : 'left';
            bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
          }
        }

        if (params.type === 'fraction') {
          $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
          $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
        }

        if (params.type === 'progressbar') {
          let progressbarDirection;

          if (params.progressbarOpposite) {
            progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
          } else {
            progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
          }

          const scale = (current + 1) / total;
          let scaleX = 1;
          let scaleY = 1;

          if (progressbarDirection === 'horizontal') {
            scaleX = scale;
          } else {
            scaleY = scale;
          }

          $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
        }

        if (params.type === 'custom' && params.renderCustom) {
          $el.html(params.renderCustom(swiper, current + 1, total));
          emit('paginationRender', $el[0]);
        } else {
          emit('paginationUpdate', $el[0]);
        }

        if (swiper.params.watchOverflow && swiper.enabled) {
          $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
        }
      }

      function render() {
        // Render Container
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
        const $el = swiper.pagination.$el;
        let paginationHTML = '';

        if (params.type === 'bullets') {
          let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

          if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
            numberOfBullets = slidesLength;
          }

          for (let i = 0; i < numberOfBullets; i += 1) {
            if (params.renderBullet) {
              paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
            } else {
              paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
            }
          }

          $el.html(paginationHTML);
          swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
        }

        if (params.type === 'fraction') {
          if (params.renderFraction) {
            paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
          } else {
            paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
          }

          $el.html(paginationHTML);
        }

        if (params.type === 'progressbar') {
          if (params.renderProgressbar) {
            paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
          } else {
            paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
          }

          $el.html(paginationHTML);
        }

        if (params.type !== 'custom') {
          emit('paginationRender', swiper.pagination.$el[0]);
        }
      }

      function init() {
        swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
          el: 'swiper-pagination'
        });
        const params = swiper.params.pagination;
        if (!params.el) return;
        let $el = $(params.el);
        if ($el.length === 0) return;

        if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
          $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

          if ($el.length > 1) {
            $el = $el.filter(el => {
              if ($(el).parents('.swiper')[0] !== swiper.el) return false;
              return true;
            });
          }
        }

        if (params.type === 'bullets' && params.clickable) {
          $el.addClass(params.clickableClass);
        }

        $el.addClass(params.modifierClass + params.type);
        $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);

        if (params.type === 'bullets' && params.dynamicBullets) {
          $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
          dynamicBulletIndex = 0;

          if (params.dynamicMainBullets < 1) {
            params.dynamicMainBullets = 1;
          }
        }

        if (params.type === 'progressbar' && params.progressbarOpposite) {
          $el.addClass(params.progressbarOppositeClass);
        }

        if (params.clickable) {
          $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
            e.preventDefault();
            let index = $(this).index() * swiper.params.slidesPerGroup;
            if (swiper.params.loop) index += swiper.loopedSlides;
            swiper.slideTo(index);
          });
        }

        Object.assign(swiper.pagination, {
          $el,
          el: $el[0]
        });

        if (!swiper.enabled) {
          $el.addClass(params.lockClass);
        }
      }

      function destroy() {
        const params = swiper.params.pagination;
        if (isPaginationDisabled()) return;
        const $el = swiper.pagination.$el;
        $el.removeClass(params.hiddenClass);
        $el.removeClass(params.modifierClass + params.type);
        $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

        if (params.clickable) {
          $el.off('click', classesToSelector(params.bulletClass));
        }
      }

      on('init', () => {
        if (swiper.params.pagination.enabled === false) {
          // eslint-disable-next-line
          disable();
        } else {
          init();
          render();
          update();
        }
      });
      on('activeIndexChange', () => {
        if (swiper.params.loop) {
          update();
        } else if (typeof swiper.snapIndex === 'undefined') {
          update();
        }
      });
      on('snapIndexChange', () => {
        if (!swiper.params.loop) {
          update();
        }
      });
      on('slidesLengthChange', () => {
        if (swiper.params.loop) {
          render();
          update();
        }
      });
      on('snapGridLengthChange', () => {
        if (!swiper.params.loop) {
          render();
          update();
        }
      });
      on('destroy', () => {
        destroy();
      });
      on('enable disable', () => {
        const {
          $el
        } = swiper.pagination;

        if ($el) {
          $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
        }
      });
      on('lock unlock', () => {
        update();
      });
      on('click', (_s, e) => {
        const targetEl = e.target;
        const {
          $el
        } = swiper.pagination;

        if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
          if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
          const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

          if (isHidden === true) {
            emit('paginationShow');
          } else {
            emit('paginationHide');
          }

          $el.toggleClass(swiper.params.pagination.hiddenClass);
        }
      });

      const enable = () => {
        swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);

        if (swiper.pagination.$el) {
          swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
        }

        init();
        render();
        update();
      };

      const disable = () => {
        swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);

        if (swiper.pagination.$el) {
          swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
        }

        destroy();
      };

      Object.assign(swiper.pagination, {
        enable,
        disable,
        render,
        update,
        init,
        destroy
      });
    }

    function Scrollbar(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const document = getDocument();
      let isTouched = false;
      let timeout = null;
      let dragTimeout = null;
      let dragStartPos;
      let dragSize;
      let trackSize;
      let divider;
      extendParams({
        scrollbar: {
          el: null,
          dragSize: 'auto',
          hide: false,
          draggable: false,
          snapOnRelease: true,
          lockClass: 'swiper-scrollbar-lock',
          dragClass: 'swiper-scrollbar-drag',
          scrollbarDisabledClass: 'swiper-scrollbar-disabled',
          horizontalClass: `swiper-scrollbar-horizontal`,
          verticalClass: `swiper-scrollbar-vertical`
        }
      });
      swiper.scrollbar = {
        el: null,
        dragEl: null,
        $el: null,
        $dragEl: null
      };

      function setTranslate() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        const {
          scrollbar,
          rtlTranslate: rtl,
          progress
        } = swiper;
        const {
          $dragEl,
          $el
        } = scrollbar;
        const params = swiper.params.scrollbar;
        let newSize = dragSize;
        let newPos = (trackSize - dragSize) * progress;

        if (rtl) {
          newPos = -newPos;

          if (newPos > 0) {
            newSize = dragSize - newPos;
            newPos = 0;
          } else if (-newPos + dragSize > trackSize) {
            newSize = trackSize + newPos;
          }
        } else if (newPos < 0) {
          newSize = dragSize + newPos;
          newPos = 0;
        } else if (newPos + dragSize > trackSize) {
          newSize = trackSize - newPos;
        }

        if (swiper.isHorizontal()) {
          $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
          $dragEl[0].style.width = `${newSize}px`;
        } else {
          $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
          $dragEl[0].style.height = `${newSize}px`;
        }

        if (params.hide) {
          clearTimeout(timeout);
          $el[0].style.opacity = 1;
          timeout = setTimeout(() => {
            $el[0].style.opacity = 0;
            $el.transition(400);
          }, 1000);
        }
      }

      function setTransition(duration) {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        swiper.scrollbar.$dragEl.transition(duration);
      }

      function updateSize() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        const {
          scrollbar
        } = swiper;
        const {
          $dragEl,
          $el
        } = scrollbar;
        $dragEl[0].style.width = '';
        $dragEl[0].style.height = '';
        trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
        divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

        if (swiper.params.scrollbar.dragSize === 'auto') {
          dragSize = trackSize * divider;
        } else {
          dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
        }

        if (swiper.isHorizontal()) {
          $dragEl[0].style.width = `${dragSize}px`;
        } else {
          $dragEl[0].style.height = `${dragSize}px`;
        }

        if (divider >= 1) {
          $el[0].style.display = 'none';
        } else {
          $el[0].style.display = '';
        }

        if (swiper.params.scrollbar.hide) {
          $el[0].style.opacity = 0;
        }

        if (swiper.params.watchOverflow && swiper.enabled) {
          scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
        }
      }

      function getPointerPosition(e) {
        if (swiper.isHorizontal()) {
          return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
        }

        return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
      }

      function setDragPosition(e) {
        const {
          scrollbar,
          rtlTranslate: rtl
        } = swiper;
        const {
          $el
        } = scrollbar;
        let positionRatio;
        positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
        positionRatio = Math.max(Math.min(positionRatio, 1), 0);

        if (rtl) {
          positionRatio = 1 - positionRatio;
        }

        const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
        swiper.updateProgress(position);
        swiper.setTranslate(position);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      function onDragStart(e) {
        const params = swiper.params.scrollbar;
        const {
          scrollbar,
          $wrapperEl
        } = swiper;
        const {
          $el,
          $dragEl
        } = scrollbar;
        isTouched = true;
        dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
        e.preventDefault();
        e.stopPropagation();
        $wrapperEl.transition(100);
        $dragEl.transition(100);
        setDragPosition(e);
        clearTimeout(dragTimeout);
        $el.transition(0);

        if (params.hide) {
          $el.css('opacity', 1);
        }

        if (swiper.params.cssMode) {
          swiper.$wrapperEl.css('scroll-snap-type', 'none');
        }

        emit('scrollbarDragStart', e);
      }

      function onDragMove(e) {
        const {
          scrollbar,
          $wrapperEl
        } = swiper;
        const {
          $el,
          $dragEl
        } = scrollbar;
        if (!isTouched) return;
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        setDragPosition(e);
        $wrapperEl.transition(0);
        $el.transition(0);
        $dragEl.transition(0);
        emit('scrollbarDragMove', e);
      }

      function onDragEnd(e) {
        const params = swiper.params.scrollbar;
        const {
          scrollbar,
          $wrapperEl
        } = swiper;
        const {
          $el
        } = scrollbar;
        if (!isTouched) return;
        isTouched = false;

        if (swiper.params.cssMode) {
          swiper.$wrapperEl.css('scroll-snap-type', '');
          $wrapperEl.transition('');
        }

        if (params.hide) {
          clearTimeout(dragTimeout);
          dragTimeout = nextTick(() => {
            $el.css('opacity', 0);
            $el.transition(400);
          }, 1000);
        }

        emit('scrollbarDragEnd', e);

        if (params.snapOnRelease) {
          swiper.slideToClosest();
        }
      }

      function events(method) {
        const {
          scrollbar,
          touchEventsTouch,
          touchEventsDesktop,
          params,
          support
        } = swiper;
        const $el = scrollbar.$el;
        if (!$el) return;
        const target = $el[0];
        const activeListener = support.passiveListener && params.passiveListeners ? {
          passive: false,
          capture: false
        } : false;
        const passiveListener = support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        if (!target) return;
        const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

        if (!support.touch) {
          target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
          document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
          document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
        } else {
          target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
          target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
          target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
        }
      }

      function enableDraggable() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        events('on');
      }

      function disableDraggable() {
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        events('off');
      }

      function init() {
        const {
          scrollbar,
          $el: $swiperEl
        } = swiper;
        swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
          el: 'swiper-scrollbar'
        });
        const params = swiper.params.scrollbar;
        if (!params.el) return;
        let $el = $(params.el);

        if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
          $el = $swiperEl.find(params.el);
        }

        $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

        if ($dragEl.length === 0) {
          $dragEl = $(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
          $el.append($dragEl);
        }

        Object.assign(scrollbar, {
          $el,
          el: $el[0],
          $dragEl,
          dragEl: $dragEl[0]
        });

        if (params.draggable) {
          enableDraggable();
        }

        if ($el) {
          $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
        }
      }

      function destroy() {
        const params = swiper.params.scrollbar;
        const $el = swiper.scrollbar.$el;

        if ($el) {
          $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        }

        disableDraggable();
      }

      on('init', () => {
        if (swiper.params.scrollbar.enabled === false) {
          // eslint-disable-next-line
          disable();
        } else {
          init();
          updateSize();
          setTranslate();
        }
      });
      on('update resize observerUpdate lock unlock', () => {
        updateSize();
      });
      on('setTranslate', () => {
        setTranslate();
      });
      on('setTransition', (_s, duration) => {
        setTransition(duration);
      });
      on('enable disable', () => {
        const {
          $el
        } = swiper.scrollbar;

        if ($el) {
          $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
        }
      });
      on('destroy', () => {
        destroy();
      });

      const enable = () => {
        swiper.$el.removeClass(swiper.params.scrollbar.scrollbarDisabledClass);

        if (swiper.scrollbar.$el) {
          swiper.scrollbar.$el.removeClass(swiper.params.scrollbar.scrollbarDisabledClass);
        }

        init();
        updateSize();
        setTranslate();
      };

      const disable = () => {
        swiper.$el.addClass(swiper.params.scrollbar.scrollbarDisabledClass);

        if (swiper.scrollbar.$el) {
          swiper.scrollbar.$el.addClass(swiper.params.scrollbar.scrollbarDisabledClass);
        }

        destroy();
      };

      Object.assign(swiper.scrollbar, {
        enable,
        disable,
        updateSize,
        setTranslate,
        init,
        destroy
      });
    }

    function Parallax(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        parallax: {
          enabled: false
        }
      });

      const setTransform = (el, progress) => {
        const {
          rtl
        } = swiper;
        const $el = $(el);
        const rtlFactor = rtl ? -1 : 1;
        const p = $el.attr('data-swiper-parallax') || '0';
        let x = $el.attr('data-swiper-parallax-x');
        let y = $el.attr('data-swiper-parallax-y');
        const scale = $el.attr('data-swiper-parallax-scale');
        const opacity = $el.attr('data-swiper-parallax-opacity');

        if (x || y) {
          x = x || '0';
          y = y || '0';
        } else if (swiper.isHorizontal()) {
          x = p;
          y = '0';
        } else {
          y = p;
          x = '0';
        }

        if (x.indexOf('%') >= 0) {
          x = `${parseInt(x, 10) * progress * rtlFactor}%`;
        } else {
          x = `${x * progress * rtlFactor}px`;
        }

        if (y.indexOf('%') >= 0) {
          y = `${parseInt(y, 10) * progress}%`;
        } else {
          y = `${y * progress}px`;
        }

        if (typeof opacity !== 'undefined' && opacity !== null) {
          const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
          $el[0].style.opacity = currentOpacity;
        }

        if (typeof scale === 'undefined' || scale === null) {
          $el.transform(`translate3d(${x}, ${y}, 0px)`);
        } else {
          const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
          $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
        }
      };

      const setTranslate = () => {
        const {
          $el,
          slides,
          progress,
          snapGrid
        } = swiper;
        $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
          setTransform(el, progress);
        });
        slides.each((slideEl, slideIndex) => {
          let slideProgress = slideEl.progress;

          if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
            slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
          }

          slideProgress = Math.min(Math.max(slideProgress, -1), 1);
          $(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
            setTransform(el, slideProgress);
          });
        });
      };

      const setTransition = function (duration) {
        if (duration === void 0) {
          duration = swiper.params.speed;
        }

        const {
          $el
        } = swiper;
        $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
          const $parallaxEl = $(parallaxEl);
          let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
          if (duration === 0) parallaxDuration = 0;
          $parallaxEl.transition(parallaxDuration);
        });
      };

      on('beforeInit', () => {
        if (!swiper.params.parallax.enabled) return;
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      });
      on('init', () => {
        if (!swiper.params.parallax.enabled) return;
        setTranslate();
      });
      on('setTranslate', () => {
        if (!swiper.params.parallax.enabled) return;
        setTranslate();
      });
      on('setTransition', (_swiper, duration) => {
        if (!swiper.params.parallax.enabled) return;
        setTransition(duration);
      });
    }

    function Zoom(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      const window = getWindow();
      extendParams({
        zoom: {
          enabled: false,
          maxRatio: 3,
          minRatio: 1,
          toggle: true,
          containerClass: 'swiper-zoom-container',
          zoomedSlideClass: 'swiper-slide-zoomed'
        }
      });
      swiper.zoom = {
        enabled: false
      };
      let currentScale = 1;
      let isScaling = false;
      let gesturesEnabled;
      let fakeGestureTouched;
      let fakeGestureMoved;
      const gesture = {
        $slideEl: undefined,
        slideWidth: undefined,
        slideHeight: undefined,
        $imageEl: undefined,
        $imageWrapEl: undefined,
        maxRatio: 3
      };
      const image = {
        isTouched: undefined,
        isMoved: undefined,
        currentX: undefined,
        currentY: undefined,
        minX: undefined,
        minY: undefined,
        maxX: undefined,
        maxY: undefined,
        width: undefined,
        height: undefined,
        startX: undefined,
        startY: undefined,
        touchesStart: {},
        touchesCurrent: {}
      };
      const velocity = {
        x: undefined,
        y: undefined,
        prevPositionX: undefined,
        prevPositionY: undefined,
        prevTime: undefined
      };
      let scale = 1;
      Object.defineProperty(swiper.zoom, 'scale', {
        get() {
          return scale;
        },

        set(value) {
          if (scale !== value) {
            const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
            const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
            emit('zoomChange', value, imageEl, slideEl);
          }

          scale = value;
        }

      });

      function getDistanceBetweenTouches(e) {
        if (e.targetTouches.length < 2) return 1;
        const x1 = e.targetTouches[0].pageX;
        const y1 = e.targetTouches[0].pageY;
        const x2 = e.targetTouches[1].pageX;
        const y2 = e.targetTouches[1].pageY;
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance;
      } // Events


      function onGestureStart(e) {
        const support = swiper.support;
        const params = swiper.params.zoom;
        fakeGestureTouched = false;
        fakeGestureMoved = false;

        if (!support.gestures) {
          if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
            return;
          }

          fakeGestureTouched = true;
          gesture.scaleStart = getDistanceBetweenTouches(e);
        }

        if (!gesture.$slideEl || !gesture.$slideEl.length) {
          gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
          if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
          gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
          gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

          if (gesture.$imageWrapEl.length === 0) {
            gesture.$imageEl = undefined;
            return;
          }
        }

        if (gesture.$imageEl) {
          gesture.$imageEl.transition(0);
        }

        isScaling = true;
      }

      function onGestureChange(e) {
        const support = swiper.support;
        const params = swiper.params.zoom;
        const zoom = swiper.zoom;

        if (!support.gestures) {
          if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
            return;
          }

          fakeGestureMoved = true;
          gesture.scaleMove = getDistanceBetweenTouches(e);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
          if (e.type === 'gesturechange') onGestureStart(e);
          return;
        }

        if (support.gestures) {
          zoom.scale = e.scale * currentScale;
        } else {
          zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
        }

        if (zoom.scale > gesture.maxRatio) {
          zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
        }

        if (zoom.scale < params.minRatio) {
          zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
        }

        gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }

      function onGestureEnd(e) {
        const device = swiper.device;
        const support = swiper.support;
        const params = swiper.params.zoom;
        const zoom = swiper.zoom;

        if (!support.gestures) {
          if (!fakeGestureTouched || !fakeGestureMoved) {
            return;
          }

          if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
            return;
          }

          fakeGestureTouched = false;
          fakeGestureMoved = false;
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
        gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
        currentScale = zoom.scale;
        isScaling = false;
        if (zoom.scale === 1) gesture.$slideEl = undefined;
      }

      function onTouchStart(e) {
        const device = swiper.device;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        if (image.isTouched) return;
        if (device.android && e.cancelable) e.preventDefault();
        image.isTouched = true;
        image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      }

      function onTouchMove(e) {
        const zoom = swiper.zoom;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        swiper.allowClick = false;
        if (!image.isTouched || !gesture.$slideEl) return;

        if (!image.isMoved) {
          image.width = gesture.$imageEl[0].offsetWidth;
          image.height = gesture.$imageEl[0].offsetHeight;
          image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
          image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
          gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
          gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
          gesture.$imageWrapEl.transition(0);
        } // Define if we need image drag


        const scaledWidth = image.width * zoom.scale;
        const scaledHeight = image.height * zoom.scale;
        if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

        if (!image.isMoved && !isScaling) {
          if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
            image.isTouched = false;
            return;
          }

          if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
            image.isTouched = false;
            return;
          }
        }

        if (e.cancelable) {
          e.preventDefault();
        }

        e.stopPropagation();
        image.isMoved = true;
        image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
        image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

        if (image.currentX < image.minX) {
          image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
        }

        if (image.currentX > image.maxX) {
          image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
        }

        if (image.currentY < image.minY) {
          image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
        }

        if (image.currentY > image.maxY) {
          image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
        } // Velocity


        if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
        if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
        if (!velocity.prevTime) velocity.prevTime = Date.now();
        velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
        velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
        if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
        if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
        velocity.prevPositionX = image.touchesCurrent.x;
        velocity.prevPositionY = image.touchesCurrent.y;
        velocity.prevTime = Date.now();
        gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
      }

      function onTouchEnd() {
        const zoom = swiper.zoom;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

        if (!image.isTouched || !image.isMoved) {
          image.isTouched = false;
          image.isMoved = false;
          return;
        }

        image.isTouched = false;
        image.isMoved = false;
        let momentumDurationX = 300;
        let momentumDurationY = 300;
        const momentumDistanceX = velocity.x * momentumDurationX;
        const newPositionX = image.currentX + momentumDistanceX;
        const momentumDistanceY = velocity.y * momentumDurationY;
        const newPositionY = image.currentY + momentumDistanceY; // Fix duration

        if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
        if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
        const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
        image.currentX = newPositionX;
        image.currentY = newPositionY; // Define if we need image drag

        const scaledWidth = image.width * zoom.scale;
        const scaledHeight = image.height * zoom.scale;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
        image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
        gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
      }

      function onTransitionEnd() {
        const zoom = swiper.zoom;

        if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
          if (gesture.$imageEl) {
            gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
          }

          if (gesture.$imageWrapEl) {
            gesture.$imageWrapEl.transform('translate3d(0,0,0)');
          }

          zoom.scale = 1;
          currentScale = 1;
          gesture.$slideEl = undefined;
          gesture.$imageEl = undefined;
          gesture.$imageWrapEl = undefined;
        }
      }

      function zoomIn(e) {
        const zoom = swiper.zoom;
        const params = swiper.params.zoom;

        if (!gesture.$slideEl) {
          if (e && e.target) {
            gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
          }

          if (!gesture.$slideEl) {
            if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
              gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
            } else {
              gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
            }
          }

          gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
          gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

        if (swiper.params.cssMode) {
          swiper.wrapperEl.style.overflow = 'hidden';
          swiper.wrapperEl.style.touchAction = 'none';
        }

        gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
        let touchX;
        let touchY;
        let offsetX;
        let offsetY;
        let diffX;
        let diffY;
        let translateX;
        let translateY;
        let imageWidth;
        let imageHeight;
        let scaledWidth;
        let scaledHeight;
        let translateMinX;
        let translateMinY;
        let translateMaxX;
        let translateMaxY;
        let slideWidth;
        let slideHeight;

        if (typeof image.touchesStart.x === 'undefined' && e) {
          touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
          touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
        } else {
          touchX = image.touchesStart.x;
          touchY = image.touchesStart.y;
        }

        zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
        currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

        if (e) {
          slideWidth = gesture.$slideEl[0].offsetWidth;
          slideHeight = gesture.$slideEl[0].offsetHeight;
          offsetX = gesture.$slideEl.offset().left + window.scrollX;
          offsetY = gesture.$slideEl.offset().top + window.scrollY;
          diffX = offsetX + slideWidth / 2 - touchX;
          diffY = offsetY + slideHeight / 2 - touchY;
          imageWidth = gesture.$imageEl[0].offsetWidth;
          imageHeight = gesture.$imageEl[0].offsetHeight;
          scaledWidth = imageWidth * zoom.scale;
          scaledHeight = imageHeight * zoom.scale;
          translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
          translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
          translateMaxX = -translateMinX;
          translateMaxY = -translateMinY;
          translateX = diffX * zoom.scale;
          translateY = diffY * zoom.scale;

          if (translateX < translateMinX) {
            translateX = translateMinX;
          }

          if (translateX > translateMaxX) {
            translateX = translateMaxX;
          }

          if (translateY < translateMinY) {
            translateY = translateMinY;
          }

          if (translateY > translateMaxY) {
            translateY = translateMaxY;
          }
        } else {
          translateX = 0;
          translateY = 0;
        }

        gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
        gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      }

      function zoomOut() {
        const zoom = swiper.zoom;
        const params = swiper.params.zoom;

        if (!gesture.$slideEl) {
          if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
            gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
          } else {
            gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          }

          gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
          gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

        if (swiper.params.cssMode) {
          swiper.wrapperEl.style.overflow = '';
          swiper.wrapperEl.style.touchAction = '';
        }

        zoom.scale = 1;
        currentScale = 1;
        gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
        gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
        gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
        gesture.$slideEl = undefined;
      } // Toggle Zoom


      function zoomToggle(e) {
        const zoom = swiper.zoom;

        if (zoom.scale && zoom.scale !== 1) {
          // Zoom Out
          zoomOut();
        } else {
          // Zoom In
          zoomIn(e);
        }
      }

      function getListeners() {
        const support = swiper.support;
        const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        const activeListenerWithCapture = support.passiveListener ? {
          passive: false,
          capture: true
        } : true;
        return {
          passiveListener,
          activeListenerWithCapture
        };
      }

      function getSlideSelector() {
        return `.${swiper.params.slideClass}`;
      }

      function toggleGestures(method) {
        const {
          passiveListener
        } = getListeners();
        const slideSelector = getSlideSelector();
        swiper.$wrapperEl[method]('gesturestart', slideSelector, onGestureStart, passiveListener);
        swiper.$wrapperEl[method]('gesturechange', slideSelector, onGestureChange, passiveListener);
        swiper.$wrapperEl[method]('gestureend', slideSelector, onGestureEnd, passiveListener);
      }

      function enableGestures() {
        if (gesturesEnabled) return;
        gesturesEnabled = true;
        toggleGestures('on');
      }

      function disableGestures() {
        if (!gesturesEnabled) return;
        gesturesEnabled = false;
        toggleGestures('off');
      } // Attach/Detach Events


      function enable() {
        const zoom = swiper.zoom;
        if (zoom.enabled) return;
        zoom.enabled = true;
        const support = swiper.support;
        const {
          passiveListener,
          activeListenerWithCapture
        } = getListeners();
        const slideSelector = getSlideSelector(); // Scale image

        if (support.gestures) {
          swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
          swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
        } else if (swiper.touchEvents.start === 'touchstart') {
          swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
          swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
          swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

          if (swiper.touchEvents.cancel) {
            swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
          }
        } // Move image


        swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
      }

      function disable() {
        const zoom = swiper.zoom;
        if (!zoom.enabled) return;
        const support = swiper.support;
        zoom.enabled = false;
        const {
          passiveListener,
          activeListenerWithCapture
        } = getListeners();
        const slideSelector = getSlideSelector(); // Scale image

        if (support.gestures) {
          swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
          swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
        } else if (swiper.touchEvents.start === 'touchstart') {
          swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
          swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
          swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

          if (swiper.touchEvents.cancel) {
            swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
          }
        } // Move image


        swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
      }

      on('init', () => {
        if (swiper.params.zoom.enabled) {
          enable();
        }
      });
      on('destroy', () => {
        disable();
      });
      on('touchStart', (_s, e) => {
        if (!swiper.zoom.enabled) return;
        onTouchStart(e);
      });
      on('touchEnd', (_s, e) => {
        if (!swiper.zoom.enabled) return;
        onTouchEnd();
      });
      on('doubleTap', (_s, e) => {
        if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
          zoomToggle(e);
        }
      });
      on('transitionEnd', () => {
        if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
          onTransitionEnd();
        }
      });
      on('slideChange', () => {
        if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
          onTransitionEnd();
        }
      });
      Object.assign(swiper.zoom, {
        enable,
        disable,
        in: zoomIn,
        out: zoomOut,
        toggle: zoomToggle
      });
    }

    function Lazy(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        lazy: {
          checkInView: false,
          enabled: false,
          loadPrevNext: false,
          loadPrevNextAmount: 1,
          loadOnTransitionStart: false,
          scrollingElement: '',
          elementClass: 'swiper-lazy',
          loadingClass: 'swiper-lazy-loading',
          loadedClass: 'swiper-lazy-loaded',
          preloaderClass: 'swiper-lazy-preloader'
        }
      });
      swiper.lazy = {};
      let scrollHandlerAttached = false;
      let initialImageLoaded = false;

      function loadInSlide(index, loadInDuplicate) {
        if (loadInDuplicate === void 0) {
          loadInDuplicate = true;
        }

        const params = swiper.params.lazy;
        if (typeof index === 'undefined') return;
        if (swiper.slides.length === 0) return;
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        const $slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`) : swiper.slides.eq(index);
        const $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

        if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
          $images.push($slideEl[0]);
        }

        if ($images.length === 0) return;
        $images.each(imageEl => {
          const $imageEl = $(imageEl);
          $imageEl.addClass(params.loadingClass);
          const background = $imageEl.attr('data-background');
          const src = $imageEl.attr('data-src');
          const srcset = $imageEl.attr('data-srcset');
          const sizes = $imageEl.attr('data-sizes');
          const $pictureEl = $imageEl.parent('picture');
          swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
            if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

            if (background) {
              $imageEl.css('background-image', `url("${background}")`);
              $imageEl.removeAttr('data-background');
            } else {
              if (srcset) {
                $imageEl.attr('srcset', srcset);
                $imageEl.removeAttr('data-srcset');
              }

              if (sizes) {
                $imageEl.attr('sizes', sizes);
                $imageEl.removeAttr('data-sizes');
              }

              if ($pictureEl.length) {
                $pictureEl.children('source').each(sourceEl => {
                  const $source = $(sourceEl);

                  if ($source.attr('data-srcset')) {
                    $source.attr('srcset', $source.attr('data-srcset'));
                    $source.removeAttr('data-srcset');
                  }
                });
              }

              if (src) {
                $imageEl.attr('src', src);
                $imageEl.removeAttr('data-src');
              }
            }

            $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
            $slideEl.find(`.${params.preloaderClass}`).remove();

            if (swiper.params.loop && loadInDuplicate) {
              const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

              if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
                const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
                loadInSlide(originalSlide.index(), false);
              } else {
                const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
                loadInSlide(duplicatedSlide.index(), false);
              }
            }

            emit('lazyImageReady', $slideEl[0], $imageEl[0]);

            if (swiper.params.autoHeight) {
              swiper.updateAutoHeight();
            }
          });
          emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
        });
      }

      function load() {
        const {
          $wrapperEl,
          params: swiperParams,
          slides,
          activeIndex
        } = swiper;
        const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
        const params = swiperParams.lazy;
        let slidesPerView = swiperParams.slidesPerView;

        if (slidesPerView === 'auto') {
          slidesPerView = 0;
        }

        function slideExist(index) {
          if (isVirtual) {
            if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
              return true;
            }
          } else if (slides[index]) return true;

          return false;
        }

        function slideIndex(slideEl) {
          if (isVirtual) {
            return $(slideEl).attr('data-swiper-slide-index');
          }

          return $(slideEl).index();
        }

        if (!initialImageLoaded) initialImageLoaded = true;

        if (swiper.params.watchSlidesProgress) {
          $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each(slideEl => {
            const index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
            loadInSlide(index);
          });
        } else if (slidesPerView > 1) {
          for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
            if (slideExist(i)) loadInSlide(i);
          }
        } else {
          loadInSlide(activeIndex);
        }

        if (params.loadPrevNext) {
          if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
            const amount = params.loadPrevNextAmount;
            const spv = Math.ceil(slidesPerView);
            const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
            const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

            for (let i = activeIndex + spv; i < maxIndex; i += 1) {
              if (slideExist(i)) loadInSlide(i);
            } // Prev Slides


            for (let i = minIndex; i < activeIndex; i += 1) {
              if (slideExist(i)) loadInSlide(i);
            }
          } else {
            const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
            if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
            const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
            if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
          }
        }
      }

      function checkInViewOnLoad() {
        const window = getWindow();
        if (!swiper || swiper.destroyed) return;
        const $scrollElement = swiper.params.lazy.scrollingElement ? $(swiper.params.lazy.scrollingElement) : $(window);
        const isWindow = $scrollElement[0] === window;
        const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
        const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
        const swiperOffset = swiper.$el.offset();
        const {
          rtlTranslate: rtl
        } = swiper;
        let inView = false;
        if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
        const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];

          if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

            inView = true;
          }
        }

        const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;

        if (inView) {
          load();
          $scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
        } else if (!scrollHandlerAttached) {
          scrollHandlerAttached = true;
          $scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
        }
      }

      on('beforeInit', () => {
        if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
          swiper.params.preloadImages = false;
        }
      });
      on('init', () => {
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      });
      on('scroll', () => {
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
          load();
        }
      });
      on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      });
      on('transitionStart', () => {
        if (swiper.params.lazy.enabled) {
          if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
            if (swiper.params.lazy.checkInView) {
              checkInViewOnLoad();
            } else {
              load();
            }
          }
        }
      });
      on('transitionEnd', () => {
        if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      });
      on('slideChange', () => {
        const {
          lazy,
          cssMode,
          watchSlidesProgress,
          touchReleaseOnEdges,
          resistanceRatio
        } = swiper.params;

        if (lazy.enabled && (cssMode || watchSlidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
          load();
        }
      });
      on('destroy', () => {
        if (!swiper.$el) return;
        swiper.$el.find(`.${swiper.params.lazy.loadingClass}`).removeClass(swiper.params.lazy.loadingClass);
      });
      Object.assign(swiper.lazy, {
        load,
        loadInSlide
      });
    }

    /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
    function Controller(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        controller: {
          control: undefined,
          inverse: false,
          by: 'slide' // or 'container'

        }
      });
      swiper.controller = {
        control: undefined
      };

      function LinearSpline(x, y) {
        const binarySearch = function search() {
          let maxIndex;
          let minIndex;
          let guess;
          return (array, val) => {
            minIndex = -1;
            maxIndex = array.length;

            while (maxIndex - minIndex > 1) {
              guess = maxIndex + minIndex >> 1;

              if (array[guess] <= val) {
                minIndex = guess;
              } else {
                maxIndex = guess;
              }
            }

            return maxIndex;
          };
        }();

        this.x = x;
        this.y = y;
        this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
        // (x1,y1) is the known point before given value,
        // (x3,y3) is the known point after given value.

        let i1;
        let i3;

        this.interpolate = function interpolate(x2) {
          if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

          i3 = binarySearch(this.x, x2);
          i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
          // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

          return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
        };

        return this;
      } // xxx: for now i will just save one spline function to to


      function getInterpolateFunction(c) {
        if (!swiper.controller.spline) {
          swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
        }
      }

      function setTranslate(_t, byController) {
        const controlled = swiper.controller.control;
        let multiplier;
        let controlledTranslate;
        const Swiper = swiper.constructor;

        function setControlledTranslate(c) {
          // this will create an Interpolate function based on the snapGrids
          // x is the Grid of the scrolled scroller and y will be the controlled scroller
          // it makes sense to create this only once and recall it for the interpolation
          // the function does a lot of value caching for performance
          const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

          if (swiper.params.controller.by === 'slide') {
            getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
            // but it did not work out

            controlledTranslate = -swiper.controller.spline.interpolate(-translate);
          }

          if (!controlledTranslate || swiper.params.controller.by === 'container') {
            multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
            controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
          }

          if (swiper.params.controller.inverse) {
            controlledTranslate = c.maxTranslate() - controlledTranslate;
          }

          c.updateProgress(controlledTranslate);
          c.setTranslate(controlledTranslate, swiper);
          c.updateActiveIndex();
          c.updateSlidesClasses();
        }

        if (Array.isArray(controlled)) {
          for (let i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
              setControlledTranslate(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper && byController !== controlled) {
          setControlledTranslate(controlled);
        }
      }

      function setTransition(duration, byController) {
        const Swiper = swiper.constructor;
        const controlled = swiper.controller.control;
        let i;

        function setControlledTransition(c) {
          c.setTransition(duration, swiper);

          if (duration !== 0) {
            c.transitionStart();

            if (c.params.autoHeight) {
              nextTick(() => {
                c.updateAutoHeight();
              });
            }

            c.$wrapperEl.transitionEnd(() => {
              if (!controlled) return;

              if (c.params.loop && swiper.params.controller.by === 'slide') {
                c.loopFix();
              }

              c.transitionEnd();
            });
          }
        }

        if (Array.isArray(controlled)) {
          for (i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
              setControlledTransition(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper && byController !== controlled) {
          setControlledTransition(controlled);
        }
      }

      function removeSpline() {
        if (!swiper.controller.control) return;

        if (swiper.controller.spline) {
          swiper.controller.spline = undefined;
          delete swiper.controller.spline;
        }
      }

      on('beforeInit', () => {
        swiper.controller.control = swiper.params.controller.control;
      });
      on('update', () => {
        removeSpline();
      });
      on('resize', () => {
        removeSpline();
      });
      on('observerUpdate', () => {
        removeSpline();
      });
      on('setTranslate', (_s, translate, byController) => {
        if (!swiper.controller.control) return;
        swiper.controller.setTranslate(translate, byController);
      });
      on('setTransition', (_s, duration, byController) => {
        if (!swiper.controller.control) return;
        swiper.controller.setTransition(duration, byController);
      });
      Object.assign(swiper.controller, {
        setTranslate,
        setTransition
      });
    }

    function A11y(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        a11y: {
          enabled: true,
          notificationClass: 'swiper-notification',
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}',
          slideLabelMessage: '{{index}} / {{slidesLength}}',
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null,
          slideRole: 'group',
          id: null
        }
      });
      let liveRegion = null;

      function notify(message) {
        const notification = liveRegion;
        if (notification.length === 0) return;
        notification.html('');
        notification.html(message);
      }

      function getRandomNumber(size) {
        if (size === void 0) {
          size = 16;
        }

        const randomChar = () => Math.round(16 * Math.random()).toString(16);

        return 'x'.repeat(size).replace(/x/g, randomChar);
      }

      function makeElFocusable($el) {
        $el.attr('tabIndex', '0');
      }

      function makeElNotFocusable($el) {
        $el.attr('tabIndex', '-1');
      }

      function addElRole($el, role) {
        $el.attr('role', role);
      }

      function addElRoleDescription($el, description) {
        $el.attr('aria-roledescription', description);
      }

      function addElControls($el, controls) {
        $el.attr('aria-controls', controls);
      }

      function addElLabel($el, label) {
        $el.attr('aria-label', label);
      }

      function addElId($el, id) {
        $el.attr('id', id);
      }

      function addElLive($el, live) {
        $el.attr('aria-live', live);
      }

      function disableEl($el) {
        $el.attr('aria-disabled', true);
      }

      function enableEl($el) {
        $el.attr('aria-disabled', false);
      }

      function onEnterOrSpaceKey(e) {
        if (e.keyCode !== 13 && e.keyCode !== 32) return;
        const params = swiper.params.a11y;
        const $targetEl = $(e.target);

        if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
          if (!(swiper.isEnd && !swiper.params.loop)) {
            swiper.slideNext();
          }

          if (swiper.isEnd) {
            notify(params.lastSlideMessage);
          } else {
            notify(params.nextSlideMessage);
          }
        }

        if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
          if (!(swiper.isBeginning && !swiper.params.loop)) {
            swiper.slidePrev();
          }

          if (swiper.isBeginning) {
            notify(params.firstSlideMessage);
          } else {
            notify(params.prevSlideMessage);
          }
        }

        if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
          $targetEl[0].click();
        }
      }

      function updateNavigation() {
        if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
        const {
          $nextEl,
          $prevEl
        } = swiper.navigation;

        if ($prevEl && $prevEl.length > 0) {
          if (swiper.isBeginning) {
            disableEl($prevEl);
            makeElNotFocusable($prevEl);
          } else {
            enableEl($prevEl);
            makeElFocusable($prevEl);
          }
        }

        if ($nextEl && $nextEl.length > 0) {
          if (swiper.isEnd) {
            disableEl($nextEl);
            makeElNotFocusable($nextEl);
          } else {
            enableEl($nextEl);
            makeElFocusable($nextEl);
          }
        }
      }

      function hasPagination() {
        return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
      }

      function hasClickablePagination() {
        return hasPagination() && swiper.params.pagination.clickable;
      }

      function updatePagination() {
        const params = swiper.params.a11y;
        if (!hasPagination()) return;
        swiper.pagination.bullets.each(bulletEl => {
          const $bulletEl = $(bulletEl);

          if (swiper.params.pagination.clickable) {
            makeElFocusable($bulletEl);

            if (!swiper.params.pagination.renderBullet) {
              addElRole($bulletEl, 'button');
              addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
            }
          }

          if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
            $bulletEl.attr('aria-current', 'true');
          } else {
            $bulletEl.removeAttr('aria-current');
          }
        });
      }

      const initNavEl = ($el, wrapperId, message) => {
        makeElFocusable($el);

        if ($el[0].tagName !== 'BUTTON') {
          addElRole($el, 'button');
          $el.on('keydown', onEnterOrSpaceKey);
        }

        addElLabel($el, message);
        addElControls($el, wrapperId);
      };

      const handleFocus = e => {
        const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
        if (!slideEl || !swiper.slides.includes(slideEl)) return;
        const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
        const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
        if (isActive || isVisible) return;
        swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
      };

      const initSlides = () => {
        const params = swiper.params.a11y;

        if (params.itemRoleDescriptionMessage) {
          addElRoleDescription($(swiper.slides), params.itemRoleDescriptionMessage);
        }

        if (params.slideRole) {
          addElRole($(swiper.slides), params.slideRole);
        }

        const slidesLength = swiper.params.loop ? swiper.slides.filter(el => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;

        if (params.slideLabelMessage) {
          swiper.slides.each((slideEl, index) => {
            const $slideEl = $(slideEl);
            const slideIndex = swiper.params.loop ? parseInt($slideEl.attr('data-swiper-slide-index'), 10) : index;
            const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
            addElLabel($slideEl, ariaLabelMessage);
          });
        }
      };

      const init = () => {
        const params = swiper.params.a11y;
        swiper.$el.append(liveRegion); // Container

        const $containerEl = swiper.$el;

        if (params.containerRoleDescriptionMessage) {
          addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
        }

        if (params.containerMessage) {
          addElLabel($containerEl, params.containerMessage);
        } // Wrapper


        const $wrapperEl = swiper.$wrapperEl;
        const wrapperId = params.id || $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
        const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
        addElId($wrapperEl, wrapperId);
        addElLive($wrapperEl, live); // Slide

        initSlides(); // Navigation

        let $nextEl;
        let $prevEl;

        if (swiper.navigation && swiper.navigation.$nextEl) {
          $nextEl = swiper.navigation.$nextEl;
        }

        if (swiper.navigation && swiper.navigation.$prevEl) {
          $prevEl = swiper.navigation.$prevEl;
        }

        if ($nextEl && $nextEl.length) {
          initNavEl($nextEl, wrapperId, params.nextSlideMessage);
        }

        if ($prevEl && $prevEl.length) {
          initNavEl($prevEl, wrapperId, params.prevSlideMessage);
        } // Pagination


        if (hasClickablePagination()) {
          swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
        } // Tab focus


        swiper.$el.on('focus', handleFocus, true);
      };

      function destroy() {
        if (liveRegion && liveRegion.length > 0) liveRegion.remove();
        let $nextEl;
        let $prevEl;

        if (swiper.navigation && swiper.navigation.$nextEl) {
          $nextEl = swiper.navigation.$nextEl;
        }

        if (swiper.navigation && swiper.navigation.$prevEl) {
          $prevEl = swiper.navigation.$prevEl;
        }

        if ($nextEl) {
          $nextEl.off('keydown', onEnterOrSpaceKey);
        }

        if ($prevEl) {
          $prevEl.off('keydown', onEnterOrSpaceKey);
        } // Pagination


        if (hasClickablePagination()) {
          swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
        } // Tab focus


        swiper.$el.off('focus', handleFocus, true);
      }

      on('beforeInit', () => {
        liveRegion = $(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
      });
      on('afterInit', () => {
        if (!swiper.params.a11y.enabled) return;
        init();
      });
      on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
        if (!swiper.params.a11y.enabled) return;
        initSlides();
      });
      on('fromEdge toEdge afterInit lock unlock', () => {
        if (!swiper.params.a11y.enabled) return;
        updateNavigation();
      });
      on('paginationUpdate', () => {
        if (!swiper.params.a11y.enabled) return;
        updatePagination();
      });
      on('destroy', () => {
        if (!swiper.params.a11y.enabled) return;
        destroy();
      });
    }

    function History(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        history: {
          enabled: false,
          root: '',
          replaceState: false,
          key: 'slides',
          keepQuery: false
        }
      });
      let initialized = false;
      let paths = {};

      const slugify = text => {
        return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
      };

      const getPathValues = urlOverride => {
        const window = getWindow();
        let location;

        if (urlOverride) {
          location = new URL(urlOverride);
        } else {
          location = window.location;
        }

        const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
        const total = pathArray.length;
        const key = pathArray[total - 2];
        const value = pathArray[total - 1];
        return {
          key,
          value
        };
      };

      const setHistory = (key, index) => {
        const window = getWindow();
        if (!initialized || !swiper.params.history.enabled) return;
        let location;

        if (swiper.params.url) {
          location = new URL(swiper.params.url);
        } else {
          location = window.location;
        }

        const slide = swiper.slides.eq(index);
        let value = slugify(slide.attr('data-history'));

        if (swiper.params.history.root.length > 0) {
          let root = swiper.params.history.root;
          if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
          value = `${root}/${key}/${value}`;
        } else if (!location.pathname.includes(key)) {
          value = `${key}/${value}`;
        }

        if (swiper.params.history.keepQuery) {
          value += location.search;
        }

        const currentState = window.history.state;

        if (currentState && currentState.value === value) {
          return;
        }

        if (swiper.params.history.replaceState) {
          window.history.replaceState({
            value
          }, null, value);
        } else {
          window.history.pushState({
            value
          }, null, value);
        }
      };

      const scrollToSlide = (speed, value, runCallbacks) => {
        if (value) {
          for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
            const slide = swiper.slides.eq(i);
            const slideHistory = slugify(slide.attr('data-history'));

            if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
              const index = slide.index();
              swiper.slideTo(index, speed, runCallbacks);
            }
          }
        } else {
          swiper.slideTo(0, speed, runCallbacks);
        }
      };

      const setHistoryPopState = () => {
        paths = getPathValues(swiper.params.url);
        scrollToSlide(swiper.params.speed, paths.value, false);
      };

      const init = () => {
        const window = getWindow();
        if (!swiper.params.history) return;

        if (!window.history || !window.history.pushState) {
          swiper.params.history.enabled = false;
          swiper.params.hashNavigation.enabled = true;
          return;
        }

        initialized = true;
        paths = getPathValues(swiper.params.url);
        if (!paths.key && !paths.value) return;
        scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

        if (!swiper.params.history.replaceState) {
          window.addEventListener('popstate', setHistoryPopState);
        }
      };

      const destroy = () => {
        const window = getWindow();

        if (!swiper.params.history.replaceState) {
          window.removeEventListener('popstate', setHistoryPopState);
        }
      };

      on('init', () => {
        if (swiper.params.history.enabled) {
          init();
        }
      });
      on('destroy', () => {
        if (swiper.params.history.enabled) {
          destroy();
        }
      });
      on('transitionEnd _freeModeNoMomentumRelease', () => {
        if (initialized) {
          setHistory(swiper.params.history.key, swiper.activeIndex);
        }
      });
      on('slideChange', () => {
        if (initialized && swiper.params.cssMode) {
          setHistory(swiper.params.history.key, swiper.activeIndex);
        }
      });
    }

    function HashNavigation(_ref) {
      let {
        swiper,
        extendParams,
        emit,
        on
      } = _ref;
      let initialized = false;
      const document = getDocument();
      const window = getWindow();
      extendParams({
        hashNavigation: {
          enabled: false,
          replaceState: false,
          watchState: false
        }
      });

      const onHashChange = () => {
        emit('hashChange');
        const newHash = document.location.hash.replace('#', '');
        const activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

        if (newHash !== activeSlideHash) {
          const newIndex = swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`).index();
          if (typeof newIndex === 'undefined') return;
          swiper.slideTo(newIndex);
        }
      };

      const setHash = () => {
        if (!initialized || !swiper.params.hashNavigation.enabled) return;

        if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
          window.history.replaceState(null, null, `#${swiper.slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
          emit('hashSet');
        } else {
          const slide = swiper.slides.eq(swiper.activeIndex);
          const hash = slide.attr('data-hash') || slide.attr('data-history');
          document.location.hash = hash || '';
          emit('hashSet');
        }
      };

      const init = () => {
        if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
        initialized = true;
        const hash = document.location.hash.replace('#', '');

        if (hash) {
          const speed = 0;

          for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
            const slide = swiper.slides.eq(i);
            const slideHash = slide.attr('data-hash') || slide.attr('data-history');

            if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
              const index = slide.index();
              swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
            }
          }
        }

        if (swiper.params.hashNavigation.watchState) {
          $(window).on('hashchange', onHashChange);
        }
      };

      const destroy = () => {
        if (swiper.params.hashNavigation.watchState) {
          $(window).off('hashchange', onHashChange);
        }
      };

      on('init', () => {
        if (swiper.params.hashNavigation.enabled) {
          init();
        }
      });
      on('destroy', () => {
        if (swiper.params.hashNavigation.enabled) {
          destroy();
        }
      });
      on('transitionEnd _freeModeNoMomentumRelease', () => {
        if (initialized) {
          setHash();
        }
      });
      on('slideChange', () => {
        if (initialized && swiper.params.cssMode) {
          setHash();
        }
      });
    }

    /* eslint no-underscore-dangle: "off" */
    function Autoplay(_ref) {
      let {
        swiper,
        extendParams,
        on,
        emit
      } = _ref;
      let timeout;
      swiper.autoplay = {
        running: false,
        paused: false
      };
      extendParams({
        autoplay: {
          enabled: false,
          delay: 3000,
          waitForTransition: true,
          disableOnInteraction: true,
          stopOnLastSlide: false,
          reverseDirection: false,
          pauseOnMouseEnter: false
        }
      });

      function run() {
        const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
        let delay = swiper.params.autoplay.delay;

        if ($activeSlideEl.attr('data-swiper-autoplay')) {
          delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
        }

        clearTimeout(timeout);
        timeout = nextTick(() => {
          let autoplayResult;

          if (swiper.params.autoplay.reverseDirection) {
            if (swiper.params.loop) {
              swiper.loopFix();
              autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
              emit('autoplay');
            } else if (!swiper.isBeginning) {
              autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
              emit('autoplay');
            } else if (!swiper.params.autoplay.stopOnLastSlide) {
              autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
              emit('autoplay');
            } else {
              stop();
            }
          } else if (swiper.params.loop) {
            swiper.loopFix();
            autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
            emit('autoplay');
          } else if (!swiper.isEnd) {
            autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
            emit('autoplay');
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
            emit('autoplay');
          } else {
            stop();
          }

          if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
            run();
          }
        }, delay);
      }

      function start() {
        if (typeof timeout !== 'undefined') return false;
        if (swiper.autoplay.running) return false;
        swiper.autoplay.running = true;
        emit('autoplayStart');
        run();
        return true;
      }

      function stop() {
        if (!swiper.autoplay.running) return false;
        if (typeof timeout === 'undefined') return false;

        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        swiper.autoplay.running = false;
        emit('autoplayStop');
        return true;
      }

      function pause(speed) {
        if (!swiper.autoplay.running) return;
        if (swiper.autoplay.paused) return;
        if (timeout) clearTimeout(timeout);
        swiper.autoplay.paused = true;

        if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
          swiper.autoplay.paused = false;
          run();
        } else {
          ['transitionend', 'webkitTransitionEnd'].forEach(event => {
            swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
          });
        }
      }

      function onVisibilityChange() {
        const document = getDocument();

        if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
          pause();
        }

        if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
          run();
          swiper.autoplay.paused = false;
        }
      }

      function onTransitionEnd(e) {
        if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
        if (e.target !== swiper.$wrapperEl[0]) return;
        ['transitionend', 'webkitTransitionEnd'].forEach(event => {
          swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
        });
        swiper.autoplay.paused = false;

        if (!swiper.autoplay.running) {
          stop();
        } else {
          run();
        }
      }

      function onMouseEnter() {
        if (swiper.params.autoplay.disableOnInteraction) {
          stop();
        } else {
          emit('autoplayPause');
          pause();
        }

        ['transitionend', 'webkitTransitionEnd'].forEach(event => {
          swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
        });
      }

      function onMouseLeave() {
        if (swiper.params.autoplay.disableOnInteraction) {
          return;
        }

        swiper.autoplay.paused = false;
        emit('autoplayResume');
        run();
      }

      function attachMouseEvents() {
        if (swiper.params.autoplay.pauseOnMouseEnter) {
          swiper.$el.on('mouseenter', onMouseEnter);
          swiper.$el.on('mouseleave', onMouseLeave);
        }
      }

      function detachMouseEvents() {
        swiper.$el.off('mouseenter', onMouseEnter);
        swiper.$el.off('mouseleave', onMouseLeave);
      }

      on('init', () => {
        if (swiper.params.autoplay.enabled) {
          start();
          const document = getDocument();
          document.addEventListener('visibilitychange', onVisibilityChange);
          attachMouseEvents();
        }
      });
      on('beforeTransitionStart', (_s, speed, internal) => {
        if (swiper.autoplay.running) {
          if (internal || !swiper.params.autoplay.disableOnInteraction) {
            swiper.autoplay.pause(speed);
          } else {
            stop();
          }
        }
      });
      on('sliderFirstMove', () => {
        if (swiper.autoplay.running) {
          if (swiper.params.autoplay.disableOnInteraction) {
            stop();
          } else {
            pause();
          }
        }
      });
      on('touchEnd', () => {
        if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
          run();
        }
      });
      on('destroy', () => {
        detachMouseEvents();

        if (swiper.autoplay.running) {
          stop();
        }

        const document = getDocument();
        document.removeEventListener('visibilitychange', onVisibilityChange);
      });
      Object.assign(swiper.autoplay, {
        pause,
        run,
        start,
        stop
      });
    }

    function Thumb(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        thumbs: {
          swiper: null,
          multipleActiveThumbs: true,
          autoScrollOffset: 0,
          slideThumbActiveClass: 'swiper-slide-thumb-active',
          thumbsContainerClass: 'swiper-thumbs'
        }
      });
      let initialized = false;
      let swiperCreated = false;
      swiper.thumbs = {
        swiper: null
      };

      function onThumbClick() {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        const clickedIndex = thumbsSwiper.clickedIndex;
        const clickedSlide = thumbsSwiper.clickedSlide;
        if (clickedSlide && $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
        if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
        let slideToIndex;

        if (thumbsSwiper.params.loop) {
          slideToIndex = parseInt($(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
        } else {
          slideToIndex = clickedIndex;
        }

        if (swiper.params.loop) {
          let currentIndex = swiper.activeIndex;

          if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
            swiper.loopFix(); // eslint-disable-next-line

            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
            currentIndex = swiper.activeIndex;
          }

          const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
          const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
          if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
        }

        swiper.slideTo(slideToIndex);
      }

      function init() {
        const {
          thumbs: thumbsParams
        } = swiper.params;
        if (initialized) return false;
        initialized = true;
        const SwiperClass = swiper.constructor;

        if (thumbsParams.swiper instanceof SwiperClass) {
          swiper.thumbs.swiper = thumbsParams.swiper;
          Object.assign(swiper.thumbs.swiper.originalParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          Object.assign(swiper.thumbs.swiper.params, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
        } else if (isObject(thumbsParams.swiper)) {
          const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
          Object.assign(thumbsSwiperParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
          swiperCreated = true;
        }

        swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
        swiper.thumbs.swiper.on('tap', onThumbClick);
        return true;
      }

      function update(initial) {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView; // Activate thumbs

        let thumbsToActivate = 1;
        const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

        if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
          thumbsToActivate = swiper.params.slidesPerView;
        }

        if (!swiper.params.thumbs.multipleActiveThumbs) {
          thumbsToActivate = 1;
        }

        thumbsToActivate = Math.floor(thumbsToActivate);
        thumbsSwiper.slides.removeClass(thumbActiveClass);

        if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
          for (let i = 0; i < thumbsToActivate; i += 1) {
            thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
          }
        } else {
          for (let i = 0; i < thumbsToActivate; i += 1) {
            thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
          }
        }

        const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
        const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

        if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
          let currentThumbsIndex = thumbsSwiper.activeIndex;
          let newThumbsIndex;
          let direction;

          if (thumbsSwiper.params.loop) {
            if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
              thumbsSwiper.loopFix(); // eslint-disable-next-line

              thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
              currentThumbsIndex = thumbsSwiper.activeIndex;
            } // Find actual thumbs index to slide to


            const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
            const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();

            if (typeof prevThumbsIndex === 'undefined') {
              newThumbsIndex = nextThumbsIndex;
            } else if (typeof nextThumbsIndex === 'undefined') {
              newThumbsIndex = prevThumbsIndex;
            } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
              newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
            } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
              newThumbsIndex = nextThumbsIndex;
            } else {
              newThumbsIndex = prevThumbsIndex;
            }

            direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
          } else {
            newThumbsIndex = swiper.realIndex;
            direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
          }

          if (useOffset) {
            newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
          }

          if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
            if (thumbsSwiper.params.centeredSlides) {
              if (newThumbsIndex > currentThumbsIndex) {
                newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
              } else {
                newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
              }
            } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;

            thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
          }
        }
      }

      on('beforeInit', () => {
        const {
          thumbs
        } = swiper.params;
        if (!thumbs || !thumbs.swiper) return;
        init();
        update(true);
      });
      on('slideChange update resize observerUpdate', () => {
        update();
      });
      on('setTransition', (_s, duration) => {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;
        thumbsSwiper.setTransition(duration);
      });
      on('beforeDestroy', () => {
        const thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed) return;

        if (swiperCreated) {
          thumbsSwiper.destroy();
        }
      });
      Object.assign(swiper.thumbs, {
        init,
        update
      });
    }

    function freeMode(_ref) {
      let {
        swiper,
        extendParams,
        emit,
        once
      } = _ref;
      extendParams({
        freeMode: {
          enabled: false,
          momentum: true,
          momentumRatio: 1,
          momentumBounce: true,
          momentumBounceRatio: 1,
          momentumVelocityRatio: 1,
          sticky: false,
          minimumVelocity: 0.02
        }
      });

      function onTouchStart() {
        const translate = swiper.getTranslate();
        swiper.setTranslate(translate);
        swiper.setTransition(0);
        swiper.touchEventsData.velocities.length = 0;
        swiper.freeMode.onTouchEnd({
          currentPos: swiper.rtl ? swiper.translate : -swiper.translate
        });
      }

      function onTouchMove() {
        const {
          touchEventsData: data,
          touches
        } = swiper; // Velocity

        if (data.velocities.length === 0) {
          data.velocities.push({
            position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
            time: data.touchStartTime
          });
        }

        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
          time: now()
        });
      }

      function onTouchEnd(_ref2) {
        let {
          currentPos
        } = _ref2;
        const {
          params,
          $wrapperEl,
          rtlTranslate: rtl,
          snapGrid,
          touchEventsData: data
        } = swiper; // Time diff

        const touchEndTime = now();
        const timeDiff = touchEndTime - data.touchStartTime;

        if (currentPos < -swiper.minTranslate()) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (currentPos > -swiper.maxTranslate()) {
          if (swiper.slides.length < snapGrid.length) {
            swiper.slideTo(snapGrid.length - 1);
          } else {
            swiper.slideTo(swiper.slides.length - 1);
          }

          return;
        }

        if (params.freeMode.momentum) {
          if (data.velocities.length > 1) {
            const lastMoveEvent = data.velocities.pop();
            const velocityEvent = data.velocities.pop();
            const distance = lastMoveEvent.position - velocityEvent.position;
            const time = lastMoveEvent.time - velocityEvent.time;
            swiper.velocity = distance / time;
            swiper.velocity /= 2;

            if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
              swiper.velocity = 0;
            } // this implies that the user stopped moving a finger then released.
            // There would be no events with distance zero, so the last event is stale.


            if (time > 150 || now() - lastMoveEvent.time > 300) {
              swiper.velocity = 0;
            }
          } else {
            swiper.velocity = 0;
          }

          swiper.velocity *= params.freeMode.momentumVelocityRatio;
          data.velocities.length = 0;
          let momentumDuration = 1000 * params.freeMode.momentumRatio;
          const momentumDistance = swiper.velocity * momentumDuration;
          let newPosition = swiper.translate + momentumDistance;
          if (rtl) newPosition = -newPosition;
          let doBounce = false;
          let afterBouncePosition;
          const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
          let needsLoopFix;

          if (newPosition < swiper.maxTranslate()) {
            if (params.freeMode.momentumBounce) {
              if (newPosition + swiper.maxTranslate() < -bounceAmount) {
                newPosition = swiper.maxTranslate() - bounceAmount;
              }

              afterBouncePosition = swiper.maxTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper.maxTranslate();
            }

            if (params.loop && params.centeredSlides) needsLoopFix = true;
          } else if (newPosition > swiper.minTranslate()) {
            if (params.freeMode.momentumBounce) {
              if (newPosition - swiper.minTranslate() > bounceAmount) {
                newPosition = swiper.minTranslate() + bounceAmount;
              }

              afterBouncePosition = swiper.minTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper.minTranslate();
            }

            if (params.loop && params.centeredSlides) needsLoopFix = true;
          } else if (params.freeMode.sticky) {
            let nextSlide;

            for (let j = 0; j < snapGrid.length; j += 1) {
              if (snapGrid[j] > -newPosition) {
                nextSlide = j;
                break;
              }
            }

            if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
              newPosition = snapGrid[nextSlide];
            } else {
              newPosition = snapGrid[nextSlide - 1];
            }

            newPosition = -newPosition;
          }

          if (needsLoopFix) {
            once('transitionEnd', () => {
              swiper.loopFix();
            });
          } // Fix duration


          if (swiper.velocity !== 0) {
            if (rtl) {
              momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
            } else {
              momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
            }

            if (params.freeMode.sticky) {
              // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
              // event, then durations can be 20+ seconds to slide one (or zero!) slides.
              // It's easy to see this when simulating touch with mouse events. To fix this,
              // limit single-slide swipes to the default slide duration. This also has the
              // nice side effect of matching slide speed if the user stopped moving before
              // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
              // For faster swipes, also apply limits (albeit higher ones).
              const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
              const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

              if (moveDistance < currentSlideSize) {
                momentumDuration = params.speed;
              } else if (moveDistance < 2 * currentSlideSize) {
                momentumDuration = params.speed * 1.5;
              } else {
                momentumDuration = params.speed * 2.5;
              }
            }
          } else if (params.freeMode.sticky) {
            swiper.slideToClosest();
            return;
          }

          if (params.freeMode.momentumBounce && doBounce) {
            swiper.updateProgress(afterBouncePosition);
            swiper.setTransition(momentumDuration);
            swiper.setTranslate(newPosition);
            swiper.transitionStart(true, swiper.swipeDirection);
            swiper.animating = true;
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
              emit('momentumBounce');
              swiper.setTransition(params.speed);
              setTimeout(() => {
                swiper.setTranslate(afterBouncePosition);
                $wrapperEl.transitionEnd(() => {
                  if (!swiper || swiper.destroyed) return;
                  swiper.transitionEnd();
                });
              }, 0);
            });
          } else if (swiper.velocity) {
            emit('_freeModeNoMomentumRelease');
            swiper.updateProgress(newPosition);
            swiper.setTransition(momentumDuration);
            swiper.setTranslate(newPosition);
            swiper.transitionStart(true, swiper.swipeDirection);

            if (!swiper.animating) {
              swiper.animating = true;
              $wrapperEl.transitionEnd(() => {
                if (!swiper || swiper.destroyed) return;
                swiper.transitionEnd();
              });
            }
          } else {
            swiper.updateProgress(newPosition);
          }

          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        } else if (params.freeMode.sticky) {
          swiper.slideToClosest();
          return;
        } else if (params.freeMode) {
          emit('_freeModeNoMomentumRelease');
        }

        if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }
      }

      Object.assign(swiper, {
        freeMode: {
          onTouchStart,
          onTouchMove,
          onTouchEnd
        }
      });
    }

    function Grid(_ref) {
      let {
        swiper,
        extendParams
      } = _ref;
      extendParams({
        grid: {
          rows: 1,
          fill: 'column'
        }
      });
      let slidesNumberEvenToRows;
      let slidesPerRow;
      let numFullColumns;

      const initSlides = slidesLength => {
        const {
          slidesPerView
        } = swiper.params;
        const {
          rows,
          fill
        } = swiper.params.grid;
        slidesPerRow = slidesNumberEvenToRows / rows;
        numFullColumns = Math.floor(slidesLength / rows);

        if (Math.floor(slidesLength / rows) === slidesLength / rows) {
          slidesNumberEvenToRows = slidesLength;
        } else {
          slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
        }

        if (slidesPerView !== 'auto' && fill === 'row') {
          slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
        }
      };

      const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
        const {
          slidesPerGroup,
          spaceBetween
        } = swiper.params;
        const {
          rows,
          fill
        } = swiper.params.grid; // Set slides order

        let newSlideOrderIndex;
        let column;
        let row;

        if (fill === 'row' && slidesPerGroup > 1) {
          const groupIndex = Math.floor(i / (slidesPerGroup * rows));
          const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
          const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
          row = Math.floor(slideIndexInGroup / columnsInGroup);
          column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
          newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
          slide.css({
            '-webkit-order': newSlideOrderIndex,
            order: newSlideOrderIndex
          });
        } else if (fill === 'column') {
          column = Math.floor(i / rows);
          row = i - column * rows;

          if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
            row += 1;

            if (row >= rows) {
              row = 0;
              column += 1;
            }
          }
        } else {
          row = Math.floor(i / slidesPerRow);
          column = i - row * slidesPerRow;
        }

        slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
      };

      const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
        const {
          spaceBetween,
          centeredSlides,
          roundLengths
        } = swiper.params;
        const {
          rows
        } = swiper.params.grid;
        swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
        swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
        swiper.$wrapperEl.css({
          [getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
        });

        if (centeredSlides) {
          snapGrid.splice(0, snapGrid.length);
          const newSlidesGrid = [];

          for (let i = 0; i < snapGrid.length; i += 1) {
            let slidesGridItem = snapGrid[i];
            if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
            if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
          }

          snapGrid.push(...newSlidesGrid);
        }
      };

      swiper.grid = {
        initSlides,
        updateSlide,
        updateWrapperSize
      };
    }

    function appendSlide(slides) {
      const swiper = this;
      const {
        $wrapperEl,
        params
      } = swiper;

      if (params.loop) {
        swiper.loopDestroy();
      }

      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.append(slides[i]);
        }
      } else {
        $wrapperEl.append(slides);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }
    }

    function prependSlide(slides) {
      const swiper = this;
      const {
        params,
        $wrapperEl,
        activeIndex
      } = swiper;

      if (params.loop) {
        swiper.loopDestroy();
      }

      let newActiveIndex = activeIndex + 1;

      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.prepend(slides[i]);
        }

        newActiveIndex = activeIndex + slides.length;
      } else {
        $wrapperEl.prepend(slides);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }

      swiper.slideTo(newActiveIndex, 0, false);
    }

    function addSlide(index, slides) {
      const swiper = this;
      const {
        $wrapperEl,
        params,
        activeIndex
      } = swiper;
      let activeIndexBuffer = activeIndex;

      if (params.loop) {
        activeIndexBuffer -= swiper.loopedSlides;
        swiper.loopDestroy();
        swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
      }

      const baseLength = swiper.slides.length;

      if (index <= 0) {
        swiper.prependSlide(slides);
        return;
      }

      if (index >= baseLength) {
        swiper.appendSlide(slides);
        return;
      }

      let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
      const slidesBuffer = [];

      for (let i = baseLength - 1; i >= index; i -= 1) {
        const currentSlide = swiper.slides.eq(i);
        currentSlide.remove();
        slidesBuffer.unshift(currentSlide);
      }

      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.append(slides[i]);
        }

        newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
      } else {
        $wrapperEl.append(slides);
      }

      for (let i = 0; i < slidesBuffer.length; i += 1) {
        $wrapperEl.append(slidesBuffer[i]);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }

      if (params.loop) {
        swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
        swiper.slideTo(newActiveIndex, 0, false);
      }
    }

    function removeSlide(slidesIndexes) {
      const swiper = this;
      const {
        params,
        $wrapperEl,
        activeIndex
      } = swiper;
      let activeIndexBuffer = activeIndex;

      if (params.loop) {
        activeIndexBuffer -= swiper.loopedSlides;
        swiper.loopDestroy();
        swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
      }

      let newActiveIndex = activeIndexBuffer;
      let indexToRemove;

      if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
        for (let i = 0; i < slidesIndexes.length; i += 1) {
          indexToRemove = slidesIndexes[i];
          if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
          if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
        }

        newActiveIndex = Math.max(newActiveIndex, 0);
      } else {
        indexToRemove = slidesIndexes;
        if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
        newActiveIndex = Math.max(newActiveIndex, 0);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!params.observer) {
        swiper.update();
      }

      if (params.loop) {
        swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
        swiper.slideTo(newActiveIndex, 0, false);
      }
    }

    function removeAllSlides() {
      const swiper = this;
      const slidesIndexes = [];

      for (let i = 0; i < swiper.slides.length; i += 1) {
        slidesIndexes.push(i);
      }

      swiper.removeSlide(slidesIndexes);
    }

    function Manipulation(_ref) {
      let {
        swiper
      } = _ref;
      Object.assign(swiper, {
        appendSlide: appendSlide.bind(swiper),
        prependSlide: prependSlide.bind(swiper),
        addSlide: addSlide.bind(swiper),
        removeSlide: removeSlide.bind(swiper),
        removeAllSlides: removeAllSlides.bind(swiper)
      });
    }

    function effectInit(params) {
      const {
        effect,
        swiper,
        on,
        setTranslate,
        setTransition,
        overwriteParams,
        perspective,
        recreateShadows,
        getEffectParams
      } = params;
      on('beforeInit', () => {
        if (swiper.params.effect !== effect) return;
        swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

        if (perspective && perspective()) {
          swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        }

        const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
        Object.assign(swiper.params, overwriteParamsResult);
        Object.assign(swiper.originalParams, overwriteParamsResult);
      });
      on('setTranslate', () => {
        if (swiper.params.effect !== effect) return;
        setTranslate();
      });
      on('setTransition', (_s, duration) => {
        if (swiper.params.effect !== effect) return;
        setTransition(duration);
      });
      on('transitionEnd', () => {
        if (swiper.params.effect !== effect) return;

        if (recreateShadows) {
          if (!getEffectParams || !getEffectParams().slideShadows) return; // remove shadows

          swiper.slides.each(slideEl => {
            const $slideEl = swiper.$(slideEl);
            $slideEl.find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').remove();
          }); // create new one

          recreateShadows();
        }
      });
      let requireUpdateOnVirtual;
      on('virtualUpdate', () => {
        if (swiper.params.effect !== effect) return;

        if (!swiper.slides.length) {
          requireUpdateOnVirtual = true;
        }

        requestAnimationFrame(() => {
          if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
            setTranslate();
            requireUpdateOnVirtual = false;
          }
        });
      });
    }

    function effectTarget(effectParams, $slideEl) {
      if (effectParams.transformEl) {
        return $slideEl.find(effectParams.transformEl).css({
          'backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden'
        });
      }

      return $slideEl;
    }

    function effectVirtualTransitionEnd(_ref) {
      let {
        swiper,
        duration,
        transformEl,
        allSlides
      } = _ref;
      const {
        slides,
        activeIndex,
        $wrapperEl
      } = swiper;

      if (swiper.params.virtualTranslate && duration !== 0) {
        let eventTriggered = false;
        let $transitionEndTarget;

        if (allSlides) {
          $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
        } else {
          $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
        }

        $transitionEndTarget.transitionEnd(() => {
          if (eventTriggered) return;
          if (!swiper || swiper.destroyed) return;
          eventTriggered = true;
          swiper.animating = false;
          const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

          for (let i = 0; i < triggerEvents.length; i += 1) {
            $wrapperEl.trigger(triggerEvents[i]);
          }
        });
      }
    }

    function EffectFade(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        fadeEffect: {
          crossFade: false,
          transformEl: null
        }
      });

      const setTranslate = () => {
        const {
          slides
        } = swiper;
        const params = swiper.params.fadeEffect;

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset = $slideEl[0].swiperSlideOffset;
          let tx = -offset;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;

          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }

          const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.css({
            opacity: slideOpacity
          }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.fadeEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl,
          allSlides: true
        });
      };

      effectInit({
        effect: 'fade',
        swiper,
        on,
        setTranslate,
        setTransition,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    function EffectCube(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }
      });

      const createSlideShadows = ($slideEl, progress, isHorizontal) => {
        let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if (shadowBefore.length === 0) {
          shadowBefore = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
          $slideEl.append(shadowBefore);
        }

        if (shadowAfter.length === 0) {
          shadowAfter = $(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
          $slideEl.append(shadowAfter);
        }

        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
      };

      const recreateShadows = () => {
        // create new ones
        const isHorizontal = swiper.isHorizontal();
        swiper.slides.each(slideEl => {
          const progress = Math.max(Math.min(slideEl.progress, 1), -1);
          createSlideShadows($(slideEl), progress, isHorizontal);
        });
      };

      const setTranslate = () => {
        const {
          $el,
          $wrapperEl,
          slides,
          width: swiperWidth,
          height: swiperHeight,
          rtlTranslate: rtl,
          size: swiperSize,
          browser
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }

            $cubeShadowEl.css({
              height: `${swiperWidth}px`
            });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');

            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;

          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }

          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);

          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }

          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;

          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + round * 4 * swiperSize;
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = 3 * swiperSize + swiperSize * 4 * round;
          }

          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

          if (progress <= 1 && progress > -1) {
            wrapperRotate = slideIndex * 90 + progress * 90;
            if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
          }

          $slideEl.transform(transform);

          if (params.slideShadows) {
            createSlideShadows($slideEl, progress, isHorizontal);
          }
        }

        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
            const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }

        const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
        $wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
        $wrapperEl[0].style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
      };

      const setTransition = duration => {
        const {
          $el,
          slides
        } = swiper;
        slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      };

      effectInit({
        effect: 'cube',
        swiper,
        on,
        setTranslate,
        setTransition,
        recreateShadows,
        getEffectParams: () => swiper.params.cubeEffect,
        perspective: () => true,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true
        })
      });
    }

    function createShadow(params, $slideEl, side) {
      const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
      const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
      let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

      if (!$shadowEl.length) {
        $shadowEl = $(`<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>`);
        $shadowContainer.append($shadowEl);
      }

      return $shadowEl;
    }

    function EffectFlip(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        flipEffect: {
          slideShadows: true,
          limitRotation: true,
          transformEl: null
        }
      });

      const createSlideShadows = ($slideEl, progress, params) => {
        let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if (shadowBefore.length === 0) {
          shadowBefore = createShadow(params, $slideEl, swiper.isHorizontal() ? 'left' : 'top');
        }

        if (shadowAfter.length === 0) {
          shadowAfter = createShadow(params, $slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
        }

        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
      };

      const recreateShadows = () => {
        // Set shadows
        const params = swiper.params.flipEffect;
        swiper.slides.each(slideEl => {
          const $slideEl = $(slideEl);
          let progress = $slideEl[0].progress;

          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min(slideEl.progress, 1), -1);
          }

          createSlideShadows($slideEl, progress, params);
        });
      };

      const setTranslate = () => {
        const {
          slides,
          rtlTranslate: rtl
        } = swiper;
        const params = swiper.params.flipEffect;

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;

          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }

          const offset = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
          let ty = 0;

          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

          if (params.slideShadows) {
            createSlideShadows($slideEl, progress, params);
          }

          const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(transform);
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.flipEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl
        });
      };

      effectInit({
        effect: 'flip',
        swiper,
        on,
        setTranslate,
        setTransition,
        recreateShadows,
        getEffectParams: () => swiper.params.flipEffect,
        perspective: () => true,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    function EffectCoverflow(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          scale: 1,
          modifier: 1,
          slideShadows: true,
          transformEl: null
        }
      });

      const setTranslate = () => {
        const {
          width: swiperWidth,
          height: swiperHeight,
          slides,
          slidesSizesGrid
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform = swiper.translate;
        const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth; // Each slide offset from center

        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
          const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

          let translateZ = -translate * Math.abs(offsetMultiplier);
          let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

          if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
            stretch = parseFloat(params.stretch) / 100 * slideSize;
          }

          let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
          let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
          let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;
          if (Math.abs(scale) < 0.001) scale = 0;
          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = createShadow(params, $slideEl, isHorizontal ? 'left' : 'top');
            }

            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = createShadow(params, $slideEl, isHorizontal ? 'right' : 'bottom');
            }

            if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
          }
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.coverflowEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
      };

      effectInit({
        effect: 'coverflow',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => true,
        overwriteParams: () => ({
          watchSlidesProgress: true
        })
      });
    }

    function EffectCreative(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        creativeEffect: {
          transformEl: null,
          limitProgress: 1,
          shadowPerProgress: false,
          progressMultiplier: 1,
          perspective: true,
          prev: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1
          },
          next: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1
          }
        }
      });

      const getTranslateValue = value => {
        if (typeof value === 'string') return value;
        return `${value}px`;
      };

      const setTranslate = () => {
        const {
          slides,
          $wrapperEl,
          slidesSizesGrid
        } = swiper;
        const params = swiper.params.creativeEffect;
        const {
          progressMultiplier: multiplier
        } = params;
        const isCenteredSlides = swiper.params.centeredSlides;

        if (isCenteredSlides) {
          const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
          $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideProgress = $slideEl[0].progress;
          const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
          let originalProgress = progress;

          if (!isCenteredSlides) {
            originalProgress = Math.min(Math.max($slideEl[0].originalProgress, -params.limitProgress), params.limitProgress);
          }

          const offset = $slideEl[0].swiperSlideOffset;
          const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
          const r = [0, 0, 0];
          let custom = false;

          if (!swiper.isHorizontal()) {
            t[1] = t[0];
            t[0] = 0;
          }

          let data = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: 1,
            opacity: 1
          };

          if (progress < 0) {
            data = params.next;
            custom = true;
          } else if (progress > 0) {
            data = params.prev;
            custom = true;
          } // set translate


          t.forEach((value, index) => {
            t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
          }); // set rotates

          r.forEach((value, index) => {
            r[index] = data.rotate[index] * Math.abs(progress * multiplier);
          });
          $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
          const translateString = t.join(', ');
          const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
          const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
          const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
          const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

          if (custom && data.shadow || !custom) {
            let $shadowEl = $slideEl.children('.swiper-slide-shadow');

            if ($shadowEl.length === 0 && data.shadow) {
              $shadowEl = createShadow(params, $slideEl);
            }

            if ($shadowEl.length) {
              const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
              $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
            }
          }

          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(transform).css({
            opacity: opacityString
          });

          if (data.origin) {
            $targetEl.css('transform-origin', data.origin);
          }
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.creativeEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl,
          allSlides: true
        });
      };

      effectInit({
        effect: 'creative',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => swiper.params.creativeEffect.perspective,
        overwriteParams: () => ({
          watchSlidesProgress: true,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    function EffectCards(_ref) {
      let {
        swiper,
        extendParams,
        on
      } = _ref;
      extendParams({
        cardsEffect: {
          slideShadows: true,
          transformEl: null,
          rotate: true
        }
      });

      const setTranslate = () => {
        const {
          slides,
          activeIndex
        } = swiper;
        const params = swiper.params.cardsEffect;
        const {
          startTranslate,
          isTouched
        } = swiper.touchEventsData;
        const currentTranslate = swiper.translate;

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideProgress = $slideEl[0].progress;
          const progress = Math.min(Math.max(slideProgress, -4), 4);
          let offset = $slideEl[0].swiperSlideOffset;

          if (swiper.params.centeredSlides && !swiper.params.cssMode) {
            swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
          }

          if (swiper.params.centeredSlides && swiper.params.cssMode) {
            offset -= slides[0].swiperSlideOffset;
          }

          let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
          let tY = 0;
          const tZ = -100 * Math.abs(progress);
          let scale = 1;
          let rotate = -2 * progress;
          let tXAdd = 8 - Math.abs(progress) * 0.75;
          const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
          const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
          const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

          if (isSwipeToNext || isSwipeToPrev) {
            const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
            rotate += -28 * progress * subProgress;
            scale += -0.5 * subProgress;
            tXAdd += 96 * subProgress;
            tY = `${-25 * subProgress * Math.abs(progress)}%`;
          }

          if (progress < 0) {
            // next
            tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
          } else if (progress > 0) {
            // prev
            tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
          } else {
            tX = `${tX}px`;
          }

          if (!swiper.isHorizontal()) {
            const prevY = tY;
            tY = tX;
            tX = prevY;
          }

          const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
          const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rotate : 0}deg)
        scale(${scaleString})
      `;

          if (params.slideShadows) {
            // Set shadows
            let $shadowEl = $slideEl.find('.swiper-slide-shadow');

            if ($shadowEl.length === 0) {
              $shadowEl = createShadow(params, $slideEl);
            }

            if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
          const $targetEl = effectTarget(params, $slideEl);
          $targetEl.transform(transform);
        }
      };

      const setTransition = duration => {
        const {
          transformEl
        } = swiper.params.cardsEffect;
        const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
        $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
        effectVirtualTransitionEnd({
          swiper,
          duration,
          transformEl
        });
      };

      effectInit({
        effect: 'cards',
        swiper,
        on,
        setTranslate,
        setTransition,
        perspective: () => true,
        overwriteParams: () => ({
          watchSlidesProgress: true,
          virtualTranslate: !swiper.params.cssMode
        })
      });
    }

    // Swiper Class
    const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
    Swiper.use(modules);

    return Swiper;

}));
//# sourceMappingURL=swiper-bundle.js.map
/**
 * Swiper 8.3.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: July 26, 2022
 */

!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e = "undefined" != typeof globalThis ? globalThis : e || self).Swiper = t());
})(this, function () {
  "use strict";
  function e(e) {
    return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object;
  }
  function t(s, a) {
    void 0 === s && (s = {}),
      void 0 === a && (a = {}),
      Object.keys(a).forEach((i) => {
        void 0 === s[i] ? (s[i] = a[i]) : e(a[i]) && e(s[i]) && Object.keys(a[i]).length > 0 && t(s[i], a[i]);
      });
  }
  const s = {
    body: {},
    addEventListener() {},
    removeEventListener() {},
    activeElement: { blur() {}, nodeName: "" },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createEvent: () => ({ initEvent() {} }),
    createElement: () => ({ children: [], childNodes: [], style: {}, setAttribute() {}, getElementsByTagName: () => [] }),
    createElementNS: () => ({}),
    importNode: () => null,
    location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" },
  };
  function a() {
    const e = "undefined" != typeof document ? document : {};
    return t(e, s), e;
  }
  const i = {
    document: s,
    navigator: { userAgent: "" },
    location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" },
    history: { replaceState() {}, pushState() {}, go() {}, back() {} },
    CustomEvent: function () {
      return this;
    },
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    Image() {},
    Date() {},
    screen: {},
    setTimeout() {},
    clearTimeout() {},
    matchMedia: () => ({}),
    requestAnimationFrame: (e) => ("undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0)),
    cancelAnimationFrame(e) {
      "undefined" != typeof setTimeout && clearTimeout(e);
    },
  };
  function r() {
    const e = "undefined" != typeof window ? window : {};
    return t(e, i), e;
  }
  class n extends Array {
    constructor(e) {
      "number" == typeof e
        ? super(e)
        : (super(...(e || [])),
          (function (e) {
            const t = e.__proto__;
            Object.defineProperty(e, "__proto__", {
              get: () => t,
              set(e) {
                t.__proto__ = e;
              },
            });
          })(this));
    }
  }
  function l(e) {
    void 0 === e && (e = []);
    const t = [];
    return (
      e.forEach((e) => {
        Array.isArray(e) ? t.push(...l(e)) : t.push(e);
      }),
      t
    );
  }
  function o(e, t) {
    return Array.prototype.filter.call(e, t);
  }
  function d(e, t) {
    const s = r(),
      i = a();
    let l = [];
    if (!t && e instanceof n) return e;
    if (!e) return new n(l);
    if ("string" == typeof e) {
      const s = e.trim();
      if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
        let e = "div";
        0 === s.indexOf("<li") && (e = "ul"),
          0 === s.indexOf("<tr") && (e = "tbody"),
          (0 !== s.indexOf("<td") && 0 !== s.indexOf("<th")) || (e = "tr"),
          0 === s.indexOf("<tbody") && (e = "table"),
          0 === s.indexOf("<option") && (e = "select");
        const t = i.createElement(e);
        t.innerHTML = s;
        for (let e = 0; e < t.childNodes.length; e += 1) l.push(t.childNodes[e]);
      } else
        l = (function (e, t) {
          if ("string" != typeof e) return [e];
          const s = [],
            a = t.querySelectorAll(e);
          for (let e = 0; e < a.length; e += 1) s.push(a[e]);
          return s;
        })(e.trim(), t || i);
    } else if (e.nodeType || e === s || e === i) l.push(e);
    else if (Array.isArray(e)) {
      if (e instanceof n) return e;
      l = e;
    }
    return new n(
      (function (e) {
        const t = [];
        for (let s = 0; s < e.length; s += 1) -1 === t.indexOf(e[s]) && t.push(e[s]);
        return t;
      })(l)
    );
  }
  d.fn = n.prototype;
  const c = {
    addClass: function () {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
      const a = l(t.map((e) => e.split(" ")));
      return (
        this.forEach((e) => {
          e.classList.add(...a);
        }),
        this
      );
    },
    removeClass: function () {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
      const a = l(t.map((e) => e.split(" ")));
      return (
        this.forEach((e) => {
          e.classList.remove(...a);
        }),
        this
      );
    },
    hasClass: function () {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
      const a = l(t.map((e) => e.split(" ")));
      return o(this, (e) => a.filter((t) => e.classList.contains(t)).length > 0).length > 0;
    },
    toggleClass: function () {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
      const a = l(t.map((e) => e.split(" ")));
      this.forEach((e) => {
        a.forEach((t) => {
          e.classList.toggle(t);
        });
      });
    },
    attr: function (e, t) {
      if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
      for (let s = 0; s < this.length; s += 1)
        if (2 === arguments.length) this[s].setAttribute(e, t);
        else for (const t in e) (this[s][t] = e[t]), this[s].setAttribute(t, e[t]);
      return this;
    },
    removeAttr: function (e) {
      for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
      return this;
    },
    transform: function (e) {
      for (let t = 0; t < this.length; t += 1) this[t].style.transform = e;
      return this;
    },
    transition: function (e) {
      for (let t = 0; t < this.length; t += 1) this[t].style.transitionDuration = "string" != typeof e ? `${e}ms` : e;
      return this;
    },
    on: function () {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
      let [a, i, r, n] = t;
      function l(e) {
        const t = e.target;
        if (!t) return;
        const s = e.target.dom7EventData || [];
        if ((s.indexOf(e) < 0 && s.unshift(e), d(t).is(i))) r.apply(t, s);
        else {
          const e = d(t).parents();
          for (let t = 0; t < e.length; t += 1) d(e[t]).is(i) && r.apply(e[t], s);
        }
      }
      function o(e) {
        const t = (e && e.target && e.target.dom7EventData) || [];
        t.indexOf(e) < 0 && t.unshift(e), r.apply(this, t);
      }
      "function" == typeof t[1] && (([a, r, n] = t), (i = void 0)), n || (n = !1);
      const c = a.split(" ");
      let p;
      for (let e = 0; e < this.length; e += 1) {
        const t = this[e];
        if (i)
          for (p = 0; p < c.length; p += 1) {
            const e = c[p];
            t.dom7LiveListeners || (t.dom7LiveListeners = {}),
              t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []),
              t.dom7LiveListeners[e].push({ listener: r, proxyListener: l }),
              t.addEventListener(e, l, n);
          }
        else
          for (p = 0; p < c.length; p += 1) {
            const e = c[p];
            t.dom7Listeners || (t.dom7Listeners = {}),
              t.dom7Listeners[e] || (t.dom7Listeners[e] = []),
              t.dom7Listeners[e].push({ listener: r, proxyListener: o }),
              t.addEventListener(e, o, n);
          }
      }
      return this;
    },
    off: function () {
      for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
      let [a, i, r, n] = t;
      "function" == typeof t[1] && (([a, r, n] = t), (i = void 0)), n || (n = !1);
      const l = a.split(" ");
      for (let e = 0; e < l.length; e += 1) {
        const t = l[e];
        for (let e = 0; e < this.length; e += 1) {
          const s = this[e];
          let a;
          if ((!i && s.dom7Listeners ? (a = s.dom7Listeners[t]) : i && s.dom7LiveListeners && (a = s.dom7LiveListeners[t]), a && a.length))
            for (let e = a.length - 1; e >= 0; e -= 1) {
              const i = a[e];
              (r && i.listener === r) || (r && i.listener && i.listener.dom7proxy && i.listener.dom7proxy === r)
                ? (s.removeEventListener(t, i.proxyListener, n), a.splice(e, 1))
                : r || (s.removeEventListener(t, i.proxyListener, n), a.splice(e, 1));
            }
        }
      }
      return this;
    },
    trigger: function () {
      const e = r();
      for (var t = arguments.length, s = new Array(t), a = 0; a < t; a++) s[a] = arguments[a];
      const i = s[0].split(" "),
        n = s[1];
      for (let t = 0; t < i.length; t += 1) {
        const a = i[t];
        for (let t = 0; t < this.length; t += 1) {
          const i = this[t];
          if (e.CustomEvent) {
            const t = new e.CustomEvent(a, { detail: n, bubbles: !0, cancelable: !0 });
            (i.dom7EventData = s.filter((e, t) => t > 0)), i.dispatchEvent(t), (i.dom7EventData = []), delete i.dom7EventData;
          }
        }
      }
      return this;
    },
    transitionEnd: function (e) {
      const t = this;
      return (
        e &&
          t.on("transitionend", function s(a) {
            a.target === this && (e.call(this, a), t.off("transitionend", s));
          }),
        this
      );
    },
    outerWidth: function (e) {
      if (this.length > 0) {
        if (e) {
          const e = this.styles();
          return this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"));
        }
        return this[0].offsetWidth;
      }
      return null;
    },
    outerHeight: function (e) {
      if (this.length > 0) {
        if (e) {
          const e = this.styles();
          return this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"));
        }
        return this[0].offsetHeight;
      }
      return null;
    },
    styles: function () {
      const e = r();
      return this[0] ? e.getComputedStyle(this[0], null) : {};
    },
    offset: function () {
      if (this.length > 0) {
        const e = r(),
          t = a(),
          s = this[0],
          i = s.getBoundingClientRect(),
          n = t.body,
          l = s.clientTop || n.clientTop || 0,
          o = s.clientLeft || n.clientLeft || 0,
          d = s === e ? e.scrollY : s.scrollTop,
          c = s === e ? e.scrollX : s.scrollLeft;
        return { top: i.top + d - l, left: i.left + c - o };
      }
      return null;
    },
    css: function (e, t) {
      const s = r();
      let a;
      if (1 === arguments.length) {
        if ("string" != typeof e) {
          for (a = 0; a < this.length; a += 1) for (const t in e) this[a].style[t] = e[t];
          return this;
        }
        if (this[0]) return s.getComputedStyle(this[0], null).getPropertyValue(e);
      }
      if (2 === arguments.length && "string" == typeof e) {
        for (a = 0; a < this.length; a += 1) this[a].style[e] = t;
        return this;
      }
      return this;
    },
    each: function (e) {
      return e
        ? (this.forEach((t, s) => {
            e.apply(t, [t, s]);
          }),
          this)
        : this;
    },
    html: function (e) {
      if (void 0 === e) return this[0] ? this[0].innerHTML : null;
      for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
      return this;
    },
    text: function (e) {
      if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
      for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
      return this;
    },
    is: function (e) {
      const t = r(),
        s = a(),
        i = this[0];
      let l, o;
      if (!i || void 0 === e) return !1;
      if ("string" == typeof e) {
        if (i.matches) return i.matches(e);
        if (i.webkitMatchesSelector) return i.webkitMatchesSelector(e);
        if (i.msMatchesSelector) return i.msMatchesSelector(e);
        for (l = d(e), o = 0; o < l.length; o += 1) if (l[o] === i) return !0;
        return !1;
      }
      if (e === s) return i === s;
      if (e === t) return i === t;
      if (e.nodeType || e instanceof n) {
        for (l = e.nodeType ? [e] : e, o = 0; o < l.length; o += 1) if (l[o] === i) return !0;
        return !1;
      }
      return !1;
    },
    index: function () {
      let e,
        t = this[0];
      if (t) {
        for (e = 0; null !== (t = t.previousSibling); ) 1 === t.nodeType && (e += 1);
        return e;
      }
    },
    eq: function (e) {
      if (void 0 === e) return this;
      const t = this.length;
      if (e > t - 1) return d([]);
      if (e < 0) {
        const s = t + e;
        return d(s < 0 ? [] : [this[s]]);
      }
      return d([this[e]]);
    },
    append: function () {
      let e;
      const t = a();
      for (let s = 0; s < arguments.length; s += 1) {
        e = s < 0 || arguments.length <= s ? void 0 : arguments[s];
        for (let s = 0; s < this.length; s += 1)
          if ("string" == typeof e) {
            const a = t.createElement("div");
            for (a.innerHTML = e; a.firstChild; ) this[s].appendChild(a.firstChild);
          } else if (e instanceof n) for (let t = 0; t < e.length; t += 1) this[s].appendChild(e[t]);
          else this[s].appendChild(e);
      }
      return this;
    },
    prepend: function (e) {
      const t = a();
      let s, i;
      for (s = 0; s < this.length; s += 1)
        if ("string" == typeof e) {
          const a = t.createElement("div");
          for (a.innerHTML = e, i = a.childNodes.length - 1; i >= 0; i -= 1) this[s].insertBefore(a.childNodes[i], this[s].childNodes[0]);
        } else if (e instanceof n) for (i = 0; i < e.length; i += 1) this[s].insertBefore(e[i], this[s].childNodes[0]);
        else this[s].insertBefore(e, this[s].childNodes[0]);
      return this;
    },
    next: function (e) {
      return this.length > 0
        ? e
          ? this[0].nextElementSibling && d(this[0].nextElementSibling).is(e)
            ? d([this[0].nextElementSibling])
            : d([])
          : this[0].nextElementSibling
          ? d([this[0].nextElementSibling])
          : d([])
        : d([]);
    },
    nextAll: function (e) {
      const t = [];
      let s = this[0];
      if (!s) return d([]);
      for (; s.nextElementSibling; ) {
        const a = s.nextElementSibling;
        e ? d(a).is(e) && t.push(a) : t.push(a), (s = a);
      }
      return d(t);
    },
    prev: function (e) {
      if (this.length > 0) {
        const t = this[0];
        return e
          ? t.previousElementSibling && d(t.previousElementSibling).is(e)
            ? d([t.previousElementSibling])
            : d([])
          : t.previousElementSibling
          ? d([t.previousElementSibling])
          : d([]);
      }
      return d([]);
    },
    prevAll: function (e) {
      const t = [];
      let s = this[0];
      if (!s) return d([]);
      for (; s.previousElementSibling; ) {
        const a = s.previousElementSibling;
        e ? d(a).is(e) && t.push(a) : t.push(a), (s = a);
      }
      return d(t);
    },
    parent: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1)
        null !== this[s].parentNode && (e ? d(this[s].parentNode).is(e) && t.push(this[s].parentNode) : t.push(this[s].parentNode));
      return d(t);
    },
    parents: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1) {
        let a = this[s].parentNode;
        for (; a; ) e ? d(a).is(e) && t.push(a) : t.push(a), (a = a.parentNode);
      }
      return d(t);
    },
    closest: function (e) {
      let t = this;
      return void 0 === e ? d([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
    },
    find: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1) {
        const a = this[s].querySelectorAll(e);
        for (let e = 0; e < a.length; e += 1) t.push(a[e]);
      }
      return d(t);
    },
    children: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1) {
        const a = this[s].children;
        for (let s = 0; s < a.length; s += 1) (e && !d(a[s]).is(e)) || t.push(a[s]);
      }
      return d(t);
    },
    filter: function (e) {
      return d(o(this, e));
    },
    remove: function () {
      for (let e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
      return this;
    },
  };
  function p(e, t) {
    return void 0 === t && (t = 0), setTimeout(e, t);
  }
  function u() {
    return Date.now();
  }
  function h(e, t) {
    void 0 === t && (t = "x");
    const s = r();
    let a, i, n;
    const l = (function (e) {
      const t = r();
      let s;
      return t.getComputedStyle && (s = t.getComputedStyle(e, null)), !s && e.currentStyle && (s = e.currentStyle), s || (s = e.style), s;
    })(e);
    return (
      s.WebKitCSSMatrix
        ? ((i = l.transform || l.webkitTransform),
          i.split(",").length > 6 &&
            (i = i
              .split(", ")
              .map((e) => e.replace(",", "."))
              .join(", ")),
          (n = new s.WebKitCSSMatrix("none" === i ? "" : i)))
        : ((n =
            l.MozTransform ||
            l.OTransform ||
            l.MsTransform ||
            l.msTransform ||
            l.transform ||
            l.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")),
          (a = n.toString().split(","))),
      "x" === t && (i = s.WebKitCSSMatrix ? n.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])),
      "y" === t && (i = s.WebKitCSSMatrix ? n.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])),
      i || 0
    );
  }
  function m(e) {
    return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1);
  }
  function f(e) {
    return "undefined" != typeof window && void 0 !== window.HTMLElement ? e instanceof HTMLElement : e && (1 === e.nodeType || 11 === e.nodeType);
  }
  function g() {
    const e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
      t = ["__proto__", "constructor", "prototype"];
    for (let s = 1; s < arguments.length; s += 1) {
      const a = s < 0 || arguments.length <= s ? void 0 : arguments[s];
      if (null != a && !f(a)) {
        const s = Object.keys(Object(a)).filter((e) => t.indexOf(e) < 0);
        for (let t = 0, i = s.length; t < i; t += 1) {
          const i = s[t],
            r = Object.getOwnPropertyDescriptor(a, i);
          void 0 !== r &&
            r.enumerable &&
            (m(e[i]) && m(a[i])
              ? a[i].__swiper__
                ? (e[i] = a[i])
                : g(e[i], a[i])
              : !m(e[i]) && m(a[i])
              ? ((e[i] = {}), a[i].__swiper__ ? (e[i] = a[i]) : g(e[i], a[i]))
              : (e[i] = a[i]));
        }
      }
    }
    return e;
  }
  function v(e, t, s) {
    e.style.setProperty(t, s);
  }
  function w(e) {
    let { swiper: t, targetPosition: s, side: a } = e;
    const i = r(),
      n = -t.translate;
    let l,
      o = null;
    const d = t.params.speed;
    (t.wrapperEl.style.scrollSnapType = "none"), i.cancelAnimationFrame(t.cssModeFrameID);
    const c = s > n ? "next" : "prev",
      p = (e, t) => ("next" === c && e >= t) || ("prev" === c && e <= t),
      u = () => {
        (l = new Date().getTime()), null === o && (o = l);
        const e = Math.max(Math.min((l - o) / d, 1), 0),
          r = 0.5 - Math.cos(e * Math.PI) / 2;
        let c = n + r * (s - n);
        if ((p(c, s) && (c = s), t.wrapperEl.scrollTo({ [a]: c }), p(c, s)))
          return (
            (t.wrapperEl.style.overflow = "hidden"),
            (t.wrapperEl.style.scrollSnapType = ""),
            setTimeout(() => {
              (t.wrapperEl.style.overflow = ""), t.wrapperEl.scrollTo({ [a]: c });
            }),
            void i.cancelAnimationFrame(t.cssModeFrameID)
          );
        t.cssModeFrameID = i.requestAnimationFrame(u);
      };
    u();
  }
  let b, x, y;
  function E() {
    return (
      b ||
        (b = (function () {
          const e = r(),
            t = a();
          return {
            smoothScroll: t.documentElement && "scrollBehavior" in t.documentElement.style,
            touch: !!("ontouchstart" in e || (e.DocumentTouch && t instanceof e.DocumentTouch)),
            passiveListener: (function () {
              let t = !1;
              try {
                const s = Object.defineProperty({}, "passive", {
                  get() {
                    t = !0;
                  },
                });
                e.addEventListener("testPassiveListener", null, s);
              } catch (e) {}
              return t;
            })(),
            gestures: "ongesturestart" in e,
          };
        })()),
      b
    );
  }
  function C(e) {
    return (
      void 0 === e && (e = {}),
      x ||
        (x = (function (e) {
          let { userAgent: t } = void 0 === e ? {} : e;
          const s = E(),
            a = r(),
            i = a.navigator.platform,
            n = t || a.navigator.userAgent,
            l = { ios: !1, android: !1 },
            o = a.screen.width,
            d = a.screen.height,
            c = n.match(/(Android);?[\s\/]+([\d.]+)?/);
          let p = n.match(/(iPad).*OS\s([\d_]+)/);
          const u = n.match(/(iPod)(.*OS\s([\d_]+))?/),
            h = !p && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
            m = "Win32" === i;
          let f = "MacIntel" === i;
          return (
            !p &&
              f &&
              s.touch &&
              [
                "1024x1366",
                "1366x1024",
                "834x1194",
                "1194x834",
                "834x1112",
                "1112x834",
                "768x1024",
                "1024x768",
                "820x1180",
                "1180x820",
                "810x1080",
                "1080x810",
              ].indexOf(`${o}x${d}`) >= 0 &&
              ((p = n.match(/(Version)\/([\d.]+)/)), p || (p = [0, 1, "13_0_0"]), (f = !1)),
            c && !m && ((l.os = "android"), (l.android = !0)),
            (p || h || u) && ((l.os = "ios"), (l.ios = !0)),
            l
          );
        })(e)),
      x
    );
  }
  function T() {
    return (
      y ||
        (y = (function () {
          const e = r();
          return {
            isSafari: (function () {
              const t = e.navigator.userAgent.toLowerCase();
              return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0;
            })(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent),
          };
        })()),
      y
    );
  }
  Object.keys(c).forEach((e) => {
    Object.defineProperty(d.fn, e, { value: c[e], writable: !0 });
  });
  var $ = {
    on(e, t, s) {
      const a = this;
      if (!a.eventsListeners || a.destroyed) return a;
      if ("function" != typeof t) return a;
      const i = s ? "unshift" : "push";
      return (
        e.split(" ").forEach((e) => {
          a.eventsListeners[e] || (a.eventsListeners[e] = []), a.eventsListeners[e][i](t);
        }),
        a
      );
    },
    once(e, t, s) {
      const a = this;
      if (!a.eventsListeners || a.destroyed) return a;
      if ("function" != typeof t) return a;
      function i() {
        a.off(e, i), i.__emitterProxy && delete i.__emitterProxy;
        for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++) r[n] = arguments[n];
        t.apply(a, r);
      }
      return (i.__emitterProxy = t), a.on(e, i, s);
    },
    onAny(e, t) {
      const s = this;
      if (!s.eventsListeners || s.destroyed) return s;
      if ("function" != typeof e) return s;
      const a = t ? "unshift" : "push";
      return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[a](e), s;
    },
    offAny(e) {
      const t = this;
      if (!t.eventsListeners || t.destroyed) return t;
      if (!t.eventsAnyListeners) return t;
      const s = t.eventsAnyListeners.indexOf(e);
      return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
    },
    off(e, t) {
      const s = this;
      return !s.eventsListeners || s.destroyed
        ? s
        : s.eventsListeners
        ? (e.split(" ").forEach((e) => {
            void 0 === t
              ? (s.eventsListeners[e] = [])
              : s.eventsListeners[e] &&
                s.eventsListeners[e].forEach((a, i) => {
                  (a === t || (a.__emitterProxy && a.__emitterProxy === t)) && s.eventsListeners[e].splice(i, 1);
                });
          }),
          s)
        : s;
    },
    emit() {
      const e = this;
      if (!e.eventsListeners || e.destroyed) return e;
      if (!e.eventsListeners) return e;
      let t, s, a;
      for (var i = arguments.length, r = new Array(i), n = 0; n < i; n++) r[n] = arguments[n];
      "string" == typeof r[0] || Array.isArray(r[0])
        ? ((t = r[0]), (s = r.slice(1, r.length)), (a = e))
        : ((t = r[0].events), (s = r[0].data), (a = r[0].context || e)),
        s.unshift(a);
      return (
        (Array.isArray(t) ? t : t.split(" ")).forEach((t) => {
          e.eventsAnyListeners &&
            e.eventsAnyListeners.length &&
            e.eventsAnyListeners.forEach((e) => {
              e.apply(a, [t, ...s]);
            }),
            e.eventsListeners &&
              e.eventsListeners[t] &&
              e.eventsListeners[t].forEach((e) => {
                e.apply(a, s);
              });
        }),
        e
      );
    },
  };
  var S = {
    updateSize: function () {
      const e = this;
      let t, s;
      const a = e.$el;
      (t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : a[0].clientWidth),
        (s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : a[0].clientHeight),
        (0 === t && e.isHorizontal()) ||
          (0 === s && e.isVertical()) ||
          ((t = t - parseInt(a.css("padding-left") || 0, 10) - parseInt(a.css("padding-right") || 0, 10)),
          (s = s - parseInt(a.css("padding-top") || 0, 10) - parseInt(a.css("padding-bottom") || 0, 10)),
          Number.isNaN(t) && (t = 0),
          Number.isNaN(s) && (s = 0),
          Object.assign(e, { width: t, height: s, size: e.isHorizontal() ? t : s }));
    },
    updateSlides: function () {
      const e = this;
      function t(t) {
        return e.isHorizontal()
          ? t
          : {
              width: "height",
              "margin-top": "margin-left",
              "margin-bottom ": "margin-right",
              "margin-left": "margin-top",
              "margin-right": "margin-bottom",
              "padding-left": "padding-top",
              "padding-right": "padding-bottom",
              marginRight: "marginBottom",
            }[t];
      }
      function s(e, s) {
        return parseFloat(e.getPropertyValue(t(s)) || 0);
      }
      const a = e.params,
        { $wrapperEl: i, size: r, rtlTranslate: n, wrongRTL: l } = e,
        o = e.virtual && a.virtual.enabled,
        d = o ? e.virtual.slides.length : e.slides.length,
        c = i.children(`.${e.params.slideClass}`),
        p = o ? e.virtual.slides.length : c.length;
      let u = [];
      const h = [],
        m = [];
      let f = a.slidesOffsetBefore;
      "function" == typeof f && (f = a.slidesOffsetBefore.call(e));
      let g = a.slidesOffsetAfter;
      "function" == typeof g && (g = a.slidesOffsetAfter.call(e));
      const w = e.snapGrid.length,
        b = e.slidesGrid.length;
      let x = a.spaceBetween,
        y = -f,
        E = 0,
        C = 0;
      if (void 0 === r) return;
      "string" == typeof x && x.indexOf("%") >= 0 && (x = (parseFloat(x.replace("%", "")) / 100) * r),
        (e.virtualSize = -x),
        n ? c.css({ marginLeft: "", marginBottom: "", marginTop: "" }) : c.css({ marginRight: "", marginBottom: "", marginTop: "" }),
        a.centeredSlides && a.cssMode && (v(e.wrapperEl, "--swiper-centered-offset-before", ""), v(e.wrapperEl, "--swiper-centered-offset-after", ""));
      const T = a.grid && a.grid.rows > 1 && e.grid;
      let $;
      T && e.grid.initSlides(p);
      const S = "auto" === a.slidesPerView && a.breakpoints && Object.keys(a.breakpoints).filter((e) => void 0 !== a.breakpoints[e].slidesPerView).length > 0;
      for (let i = 0; i < p; i += 1) {
        $ = 0;
        const n = c.eq(i);
        if ((T && e.grid.updateSlide(i, n, p, t), "none" !== n.css("display"))) {
          if ("auto" === a.slidesPerView) {
            S && (c[i].style[t("width")] = "");
            const r = getComputedStyle(n[0]),
              l = n[0].style.transform,
              o = n[0].style.webkitTransform;
            if ((l && (n[0].style.transform = "none"), o && (n[0].style.webkitTransform = "none"), a.roundLengths))
              $ = e.isHorizontal() ? n.outerWidth(!0) : n.outerHeight(!0);
            else {
              const e = s(r, "width"),
                t = s(r, "padding-left"),
                a = s(r, "padding-right"),
                i = s(r, "margin-left"),
                l = s(r, "margin-right"),
                o = r.getPropertyValue("box-sizing");
              if (o && "border-box" === o) $ = e + i + l;
              else {
                const { clientWidth: s, offsetWidth: r } = n[0];
                $ = e + t + a + i + l + (r - s);
              }
            }
            l && (n[0].style.transform = l), o && (n[0].style.webkitTransform = o), a.roundLengths && ($ = Math.floor($));
          } else ($ = (r - (a.slidesPerView - 1) * x) / a.slidesPerView), a.roundLengths && ($ = Math.floor($)), c[i] && (c[i].style[t("width")] = `${$}px`);
          c[i] && (c[i].swiperSlideSize = $),
            m.push($),
            a.centeredSlides
              ? ((y = y + $ / 2 + E / 2 + x),
                0 === E && 0 !== i && (y = y - r / 2 - x),
                0 === i && (y = y - r / 2 - x),
                Math.abs(y) < 0.001 && (y = 0),
                a.roundLengths && (y = Math.floor(y)),
                C % a.slidesPerGroup == 0 && u.push(y),
                h.push(y))
              : (a.roundLengths && (y = Math.floor(y)),
                (C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup == 0 && u.push(y),
                h.push(y),
                (y = y + $ + x)),
            (e.virtualSize += $ + x),
            (E = $),
            (C += 1);
        }
      }
      if (
        ((e.virtualSize = Math.max(e.virtualSize, r) + g),
        n && l && ("slide" === a.effect || "coverflow" === a.effect) && i.css({ width: `${e.virtualSize + a.spaceBetween}px` }),
        a.setWrapperSize && i.css({ [t("width")]: `${e.virtualSize + a.spaceBetween}px` }),
        T && e.grid.updateWrapperSize($, u, t),
        !a.centeredSlides)
      ) {
        const t = [];
        for (let s = 0; s < u.length; s += 1) {
          let i = u[s];
          a.roundLengths && (i = Math.floor(i)), u[s] <= e.virtualSize - r && t.push(i);
        }
        (u = t), Math.floor(e.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 && u.push(e.virtualSize - r);
      }
      if ((0 === u.length && (u = [0]), 0 !== a.spaceBetween)) {
        const s = e.isHorizontal() && n ? "marginLeft" : t("marginRight");
        c.filter((e, t) => !a.cssMode || t !== c.length - 1).css({ [s]: `${x}px` });
      }
      if (a.centeredSlides && a.centeredSlidesBounds) {
        let e = 0;
        m.forEach((t) => {
          e += t + (a.spaceBetween ? a.spaceBetween : 0);
        }),
          (e -= a.spaceBetween);
        const t = e - r;
        u = u.map((e) => (e < 0 ? -f : e > t ? t + g : e));
      }
      if (a.centerInsufficientSlides) {
        let e = 0;
        if (
          (m.forEach((t) => {
            e += t + (a.spaceBetween ? a.spaceBetween : 0);
          }),
          (e -= a.spaceBetween),
          e < r)
        ) {
          const t = (r - e) / 2;
          u.forEach((e, s) => {
            u[s] = e - t;
          }),
            h.forEach((e, s) => {
              h[s] = e + t;
            });
        }
      }
      if ((Object.assign(e, { slides: c, snapGrid: u, slidesGrid: h, slidesSizesGrid: m }), a.centeredSlides && a.cssMode && !a.centeredSlidesBounds)) {
        v(e.wrapperEl, "--swiper-centered-offset-before", -u[0] + "px"),
          v(e.wrapperEl, "--swiper-centered-offset-after", e.size / 2 - m[m.length - 1] / 2 + "px");
        const t = -e.snapGrid[0],
          s = -e.slidesGrid[0];
        (e.snapGrid = e.snapGrid.map((e) => e + t)), (e.slidesGrid = e.slidesGrid.map((e) => e + s));
      }
      if (
        (p !== d && e.emit("slidesLengthChange"),
        u.length !== w && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")),
        h.length !== b && e.emit("slidesGridLengthChange"),
        a.watchSlidesProgress && e.updateSlidesOffset(),
        !(o || a.cssMode || ("slide" !== a.effect && "fade" !== a.effect)))
      ) {
        const t = `${a.containerModifierClass}backface-hidden`,
          s = e.$el.hasClass(t);
        p <= a.maxBackfaceHiddenSlides ? s || e.$el.addClass(t) : s && e.$el.removeClass(t);
      }
    },
    updateAutoHeight: function (e) {
      const t = this,
        s = [],
        a = t.virtual && t.params.virtual.enabled;
      let i,
        r = 0;
      "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
      const n = (e) => (a ? t.slides.filter((t) => parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e)[0] : t.slides.eq(e)[0]);
      if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
        if (t.params.centeredSlides)
          (t.visibleSlides || d([])).each((e) => {
            s.push(e);
          });
        else
          for (i = 0; i < Math.ceil(t.params.slidesPerView); i += 1) {
            const e = t.activeIndex + i;
            if (e > t.slides.length && !a) break;
            s.push(n(e));
          }
      else s.push(n(t.activeIndex));
      for (i = 0; i < s.length; i += 1)
        if (void 0 !== s[i]) {
          const e = s[i].offsetHeight;
          r = e > r ? e : r;
        }
      (r || 0 === r) && t.$wrapperEl.css("height", `${r}px`);
    },
    updateSlidesOffset: function () {
      const e = this,
        t = e.slides;
      for (let s = 0; s < t.length; s += 1) t[s].swiperSlideOffset = e.isHorizontal() ? t[s].offsetLeft : t[s].offsetTop;
    },
    updateSlidesProgress: function (e) {
      void 0 === e && (e = (this && this.translate) || 0);
      const t = this,
        s = t.params,
        { slides: a, rtlTranslate: i, snapGrid: r } = t;
      if (0 === a.length) return;
      void 0 === a[0].swiperSlideOffset && t.updateSlidesOffset();
      let n = -e;
      i && (n = e), a.removeClass(s.slideVisibleClass), (t.visibleSlidesIndexes = []), (t.visibleSlides = []);
      for (let e = 0; e < a.length; e += 1) {
        const l = a[e];
        let o = l.swiperSlideOffset;
        s.cssMode && s.centeredSlides && (o -= a[0].swiperSlideOffset);
        const d = (n + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween),
          c = (n - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween),
          p = -(n - o),
          u = p + t.slidesSizesGrid[e];
        ((p >= 0 && p < t.size - 1) || (u > 1 && u <= t.size) || (p <= 0 && u >= t.size)) &&
          (t.visibleSlides.push(l), t.visibleSlidesIndexes.push(e), a.eq(e).addClass(s.slideVisibleClass)),
          (l.progress = i ? -d : d),
          (l.originalProgress = i ? -c : c);
      }
      t.visibleSlides = d(t.visibleSlides);
    },
    updateProgress: function (e) {
      const t = this;
      if (void 0 === e) {
        const s = t.rtlTranslate ? -1 : 1;
        e = (t && t.translate && t.translate * s) || 0;
      }
      const s = t.params,
        a = t.maxTranslate() - t.minTranslate();
      let { progress: i, isBeginning: r, isEnd: n } = t;
      const l = r,
        o = n;
      0 === a ? ((i = 0), (r = !0), (n = !0)) : ((i = (e - t.minTranslate()) / a), (r = i <= 0), (n = i >= 1)),
        Object.assign(t, { progress: i, isBeginning: r, isEnd: n }),
        (s.watchSlidesProgress || (s.centeredSlides && s.autoHeight)) && t.updateSlidesProgress(e),
        r && !l && t.emit("reachBeginning toEdge"),
        n && !o && t.emit("reachEnd toEdge"),
        ((l && !r) || (o && !n)) && t.emit("fromEdge"),
        t.emit("progress", i);
    },
    updateSlidesClasses: function () {
      const e = this,
        { slides: t, params: s, $wrapperEl: a, activeIndex: i, realIndex: r } = e,
        n = e.virtual && s.virtual.enabled;
      let l;
      t.removeClass(
        `${s.slideActiveClass} ${s.slideNextClass} ${s.slidePrevClass} ${s.slideDuplicateActiveClass} ${s.slideDuplicateNextClass} ${s.slideDuplicatePrevClass}`
      ),
        (l = n ? e.$wrapperEl.find(`.${s.slideClass}[data-swiper-slide-index="${i}"]`) : t.eq(i)),
        l.addClass(s.slideActiveClass),
        s.loop &&
          (l.hasClass(s.slideDuplicateClass)
            ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass)
            : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass));
      let o = l.nextAll(`.${s.slideClass}`).eq(0).addClass(s.slideNextClass);
      s.loop && 0 === o.length && ((o = t.eq(0)), o.addClass(s.slideNextClass));
      let d = l.prevAll(`.${s.slideClass}`).eq(0).addClass(s.slidePrevClass);
      s.loop && 0 === d.length && ((d = t.eq(-1)), d.addClass(s.slidePrevClass)),
        s.loop &&
          (o.hasClass(s.slideDuplicateClass)
            ? a
                .children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`)
                .addClass(s.slideDuplicateNextClass)
            : a
                .children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`)
                .addClass(s.slideDuplicateNextClass),
          d.hasClass(s.slideDuplicateClass)
            ? a
                .children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`)
                .addClass(s.slideDuplicatePrevClass)
            : a
                .children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`)
                .addClass(s.slideDuplicatePrevClass)),
        e.emitSlidesClasses();
    },
    updateActiveIndex: function (e) {
      const t = this,
        s = t.rtlTranslate ? t.translate : -t.translate,
        { slidesGrid: a, snapGrid: i, params: r, activeIndex: n, realIndex: l, snapIndex: o } = t;
      let d,
        c = e;
      if (void 0 === c) {
        for (let e = 0; e < a.length; e += 1)
          void 0 !== a[e + 1] ? (s >= a[e] && s < a[e + 1] - (a[e + 1] - a[e]) / 2 ? (c = e) : s >= a[e] && s < a[e + 1] && (c = e + 1)) : s >= a[e] && (c = e);
        r.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0);
      }
      if (i.indexOf(s) >= 0) d = i.indexOf(s);
      else {
        const e = Math.min(r.slidesPerGroupSkip, c);
        d = e + Math.floor((c - e) / r.slidesPerGroup);
      }
      if ((d >= i.length && (d = i.length - 1), c === n)) return void (d !== o && ((t.snapIndex = d), t.emit("snapIndexChange")));
      const p = parseInt(t.slides.eq(c).attr("data-swiper-slide-index") || c, 10);
      Object.assign(t, { snapIndex: d, realIndex: p, previousIndex: n, activeIndex: c }),
        t.emit("activeIndexChange"),
        t.emit("snapIndexChange"),
        l !== p && t.emit("realIndexChange"),
        (t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange");
    },
    updateClickedSlide: function (e) {
      const t = this,
        s = t.params,
        a = d(e).closest(`.${s.slideClass}`)[0];
      let i,
        r = !1;
      if (a)
        for (let e = 0; e < t.slides.length; e += 1)
          if (t.slides[e] === a) {
            (r = !0), (i = e);
            break;
          }
      if (!a || !r) return (t.clickedSlide = void 0), void (t.clickedIndex = void 0);
      (t.clickedSlide = a),
        t.virtual && t.params.virtual.enabled ? (t.clickedIndex = parseInt(d(a).attr("data-swiper-slide-index"), 10)) : (t.clickedIndex = i),
        s.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide();
    },
  };
  var M = {
    getTranslate: function (e) {
      void 0 === e && (e = this.isHorizontal() ? "x" : "y");
      const { params: t, rtlTranslate: s, translate: a, $wrapperEl: i } = this;
      if (t.virtualTranslate) return s ? -a : a;
      if (t.cssMode) return a;
      let r = h(i[0], e);
      return s && (r = -r), r || 0;
    },
    setTranslate: function (e, t) {
      const s = this,
        { rtlTranslate: a, params: i, $wrapperEl: r, wrapperEl: n, progress: l } = s;
      let o,
        d = 0,
        c = 0;
      s.isHorizontal() ? (d = a ? -e : e) : (c = e),
        i.roundLengths && ((d = Math.floor(d)), (c = Math.floor(c))),
        i.cssMode
          ? (n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -d : -c)
          : i.virtualTranslate || r.transform(`translate3d(${d}px, ${c}px, 0px)`),
        (s.previousTranslate = s.translate),
        (s.translate = s.isHorizontal() ? d : c);
      const p = s.maxTranslate() - s.minTranslate();
      (o = 0 === p ? 0 : (e - s.minTranslate()) / p), o !== l && s.updateProgress(e), s.emit("setTranslate", s.translate, t);
    },
    minTranslate: function () {
      return -this.snapGrid[0];
    },
    maxTranslate: function () {
      return -this.snapGrid[this.snapGrid.length - 1];
    },
    translateTo: function (e, t, s, a, i) {
      void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), void 0 === a && (a = !0);
      const r = this,
        { params: n, wrapperEl: l } = r;
      if (r.animating && n.preventInteractionOnTransition) return !1;
      const o = r.minTranslate(),
        d = r.maxTranslate();
      let c;
      if (((c = a && e > o ? o : a && e < d ? d : e), r.updateProgress(c), n.cssMode)) {
        const e = r.isHorizontal();
        if (0 === t) l[e ? "scrollLeft" : "scrollTop"] = -c;
        else {
          if (!r.support.smoothScroll) return w({ swiper: r, targetPosition: -c, side: e ? "left" : "top" }), !0;
          l.scrollTo({ [e ? "left" : "top"]: -c, behavior: "smooth" });
        }
        return !0;
      }
      return (
        0 === t
          ? (r.setTransition(0), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i), r.emit("transitionEnd")))
          : (r.setTransition(t),
            r.setTranslate(c),
            s && (r.emit("beforeTransitionStart", t, i), r.emit("transitionStart")),
            r.animating ||
              ((r.animating = !0),
              r.onTranslateToWrapperTransitionEnd ||
                (r.onTranslateToWrapperTransitionEnd = function (e) {
                  r &&
                    !r.destroyed &&
                    e.target === this &&
                    (r.$wrapperEl[0].removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd),
                    r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd),
                    (r.onTranslateToWrapperTransitionEnd = null),
                    delete r.onTranslateToWrapperTransitionEnd,
                    s && r.emit("transitionEnd"));
                }),
              r.$wrapperEl[0].addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd),
              r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd))),
        !0
      );
    },
  };
  function P(e) {
    let { swiper: t, runCallbacks: s, direction: a, step: i } = e;
    const { activeIndex: r, previousIndex: n } = t;
    let l = a;
    if ((l || (l = r > n ? "next" : r < n ? "prev" : "reset"), t.emit(`transition${i}`), s && r !== n)) {
      if ("reset" === l) return void t.emit(`slideResetTransition${i}`);
      t.emit(`slideChangeTransition${i}`), "next" === l ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`);
    }
  }
  var k = {
    slideTo: function (e, t, s, a, i) {
      if ((void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), "number" != typeof e && "string" != typeof e))
        throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof e}] given.`);
      if ("string" == typeof e) {
        const t = parseInt(e, 10);
        if (!isFinite(t)) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
        e = t;
      }
      const r = this;
      let n = e;
      n < 0 && (n = 0);
      const { params: l, snapGrid: o, slidesGrid: d, previousIndex: c, activeIndex: p, rtlTranslate: u, wrapperEl: h, enabled: m } = r;
      if ((r.animating && l.preventInteractionOnTransition) || (!m && !a && !i)) return !1;
      const f = Math.min(r.params.slidesPerGroupSkip, n);
      let g = f + Math.floor((n - f) / r.params.slidesPerGroup);
      g >= o.length && (g = o.length - 1), (p || l.initialSlide || 0) === (c || 0) && s && r.emit("beforeSlideChangeStart");
      const v = -o[g];
      if ((r.updateProgress(v), l.normalizeSlideIndex))
        for (let e = 0; e < d.length; e += 1) {
          const t = -Math.floor(100 * v),
            s = Math.floor(100 * d[e]),
            a = Math.floor(100 * d[e + 1]);
          void 0 !== d[e + 1] ? (t >= s && t < a - (a - s) / 2 ? (n = e) : t >= s && t < a && (n = e + 1)) : t >= s && (n = e);
        }
      if (r.initialized && n !== p) {
        if (!r.allowSlideNext && v < r.translate && v < r.minTranslate()) return !1;
        if (!r.allowSlidePrev && v > r.translate && v > r.maxTranslate() && (p || 0) !== n) return !1;
      }
      let b;
      if (((b = n > p ? "next" : n < p ? "prev" : "reset"), (u && -v === r.translate) || (!u && v === r.translate)))
        return (
          r.updateActiveIndex(n),
          l.autoHeight && r.updateAutoHeight(),
          r.updateSlidesClasses(),
          "slide" !== l.effect && r.setTranslate(v),
          "reset" !== b && (r.transitionStart(s, b), r.transitionEnd(s, b)),
          !1
        );
      if (l.cssMode) {
        const e = r.isHorizontal(),
          s = u ? v : -v;
        if (0 === t) {
          const t = r.virtual && r.params.virtual.enabled;
          t && ((r.wrapperEl.style.scrollSnapType = "none"), (r._immediateVirtual = !0)),
            (h[e ? "scrollLeft" : "scrollTop"] = s),
            t &&
              requestAnimationFrame(() => {
                (r.wrapperEl.style.scrollSnapType = ""), (r._swiperImmediateVirtual = !1);
              });
        } else {
          if (!r.support.smoothScroll) return w({ swiper: r, targetPosition: s, side: e ? "left" : "top" }), !0;
          h.scrollTo({ [e ? "left" : "top"]: s, behavior: "smooth" });
        }
        return !0;
      }
      return (
        r.setTransition(t),
        r.setTranslate(v),
        r.updateActiveIndex(n),
        r.updateSlidesClasses(),
        r.emit("beforeTransitionStart", t, a),
        r.transitionStart(s, b),
        0 === t
          ? r.transitionEnd(s, b)
          : r.animating ||
            ((r.animating = !0),
            r.onSlideToWrapperTransitionEnd ||
              (r.onSlideToWrapperTransitionEnd = function (e) {
                r &&
                  !r.destroyed &&
                  e.target === this &&
                  (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
                  r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd),
                  (r.onSlideToWrapperTransitionEnd = null),
                  delete r.onSlideToWrapperTransitionEnd,
                  r.transitionEnd(s, b));
              }),
            r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd),
            r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd)),
        !0
      );
    },
    slideToLoop: function (e, t, s, a) {
      if ((void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), "string" == typeof e)) {
        const t = parseInt(e, 10);
        if (!isFinite(t)) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
        e = t;
      }
      const i = this;
      let r = e;
      return i.params.loop && (r += i.loopedSlides), i.slideTo(r, t, s, a);
    },
    slideNext: function (e, t, s) {
      void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
      const a = this,
        { animating: i, enabled: r, params: n } = a;
      if (!r) return a;
      let l = n.slidesPerGroup;
      "auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (l = Math.max(a.slidesPerViewDynamic("current", !0), 1));
      const o = a.activeIndex < n.slidesPerGroupSkip ? 1 : l;
      if (n.loop) {
        if (i && n.loopPreventsSlide) return !1;
        a.loopFix(), (a._clientLeft = a.$wrapperEl[0].clientLeft);
      }
      return n.rewind && a.isEnd ? a.slideTo(0, e, t, s) : a.slideTo(a.activeIndex + o, e, t, s);
    },
    slidePrev: function (e, t, s) {
      void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
      const a = this,
        { params: i, animating: r, snapGrid: n, slidesGrid: l, rtlTranslate: o, enabled: d } = a;
      if (!d) return a;
      if (i.loop) {
        if (r && i.loopPreventsSlide) return !1;
        a.loopFix(), (a._clientLeft = a.$wrapperEl[0].clientLeft);
      }
      function c(e) {
        return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
      }
      const p = c(o ? a.translate : -a.translate),
        u = n.map((e) => c(e));
      let h = n[u.indexOf(p) - 1];
      if (void 0 === h && i.cssMode) {
        let e;
        n.forEach((t, s) => {
          p >= t && (e = s);
        }),
          void 0 !== e && (h = n[e > 0 ? e - 1 : e]);
      }
      let m = 0;
      if (
        (void 0 !== h &&
          ((m = l.indexOf(h)),
          m < 0 && (m = a.activeIndex - 1),
          "auto" === i.slidesPerView &&
            1 === i.slidesPerGroup &&
            i.slidesPerGroupAuto &&
            ((m = m - a.slidesPerViewDynamic("previous", !0) + 1), (m = Math.max(m, 0)))),
        i.rewind && a.isBeginning)
      ) {
        const i = a.params.virtual && a.params.virtual.enabled && a.virtual ? a.virtual.slides.length - 1 : a.slides.length - 1;
        return a.slideTo(i, e, t, s);
      }
      return a.slideTo(m, e, t, s);
    },
    slideReset: function (e, t, s) {
      return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, s);
    },
    slideToClosest: function (e, t, s, a) {
      void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === a && (a = 0.5);
      const i = this;
      let r = i.activeIndex;
      const n = Math.min(i.params.slidesPerGroupSkip, r),
        l = n + Math.floor((r - n) / i.params.slidesPerGroup),
        o = i.rtlTranslate ? i.translate : -i.translate;
      if (o >= i.snapGrid[l]) {
        const e = i.snapGrid[l];
        o - e > (i.snapGrid[l + 1] - e) * a && (r += i.params.slidesPerGroup);
      } else {
        const e = i.snapGrid[l - 1];
        o - e <= (i.snapGrid[l] - e) * a && (r -= i.params.slidesPerGroup);
      }
      return (r = Math.max(r, 0)), (r = Math.min(r, i.slidesGrid.length - 1)), i.slideTo(r, e, t, s);
    },
    slideToClickedSlide: function () {
      const e = this,
        { params: t, $wrapperEl: s } = e,
        a = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
      let i,
        r = e.clickedIndex;
      if (t.loop) {
        if (e.animating) return;
        (i = parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10)),
          t.centeredSlides
            ? r < e.loopedSlides - a / 2 || r > e.slides.length - e.loopedSlides + a / 2
              ? (e.loopFix(),
                (r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index()),
                p(() => {
                  e.slideTo(r);
                }))
              : e.slideTo(r)
            : r > e.slides.length - a
            ? (e.loopFix(),
              (r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index()),
              p(() => {
                e.slideTo(r);
              }))
            : e.slideTo(r);
      } else e.slideTo(r);
    },
  };
  var z = {
    loopCreate: function () {
      const e = this,
        t = a(),
        { params: s, $wrapperEl: i } = e,
        r = i.children().length > 0 ? d(i.children()[0].parentNode) : i;
      r.children(`.${s.slideClass}.${s.slideDuplicateClass}`).remove();
      let n = r.children(`.${s.slideClass}`);
      if (s.loopFillGroupWithBlank) {
        const e = s.slidesPerGroup - (n.length % s.slidesPerGroup);
        if (e !== s.slidesPerGroup) {
          for (let a = 0; a < e; a += 1) {
            const e = d(t.createElement("div")).addClass(`${s.slideClass} ${s.slideBlankClass}`);
            r.append(e);
          }
          n = r.children(`.${s.slideClass}`);
        }
      }
      "auto" !== s.slidesPerView || s.loopedSlides || (s.loopedSlides = n.length),
        (e.loopedSlides = Math.ceil(parseFloat(s.loopedSlides || s.slidesPerView, 10))),
        (e.loopedSlides += s.loopAdditionalSlides),
        e.loopedSlides > n.length && e.params.loopedSlidesLimit && (e.loopedSlides = n.length);
      const l = [],
        o = [];
      n.each((e, t) => {
        d(e).attr("data-swiper-slide-index", t);
      });
      for (let t = 0; t < e.loopedSlides; t += 1) {
        const e = t - Math.floor(t / n.length) * n.length;
        o.push(n.eq(e)[0]), l.unshift(n.eq(n.length - e - 1)[0]);
      }
      for (let e = 0; e < o.length; e += 1) r.append(d(o[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
      for (let e = l.length - 1; e >= 0; e -= 1) r.prepend(d(l[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
    },
    loopFix: function () {
      const e = this;
      e.emit("beforeLoopFix");
      const { activeIndex: t, slides: s, loopedSlides: a, allowSlidePrev: i, allowSlideNext: r, snapGrid: n, rtlTranslate: l } = e;
      let o;
      (e.allowSlidePrev = !0), (e.allowSlideNext = !0);
      const d = -n[t] - e.getTranslate();
      if (t < a) {
        (o = s.length - 3 * a + t), (o += a);
        e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d);
      } else if (t >= s.length - a) {
        (o = -s.length + t + a), (o += a);
        e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d);
      }
      (e.allowSlidePrev = i), (e.allowSlideNext = r), e.emit("loopFix");
    },
    loopDestroy: function () {
      const { $wrapperEl: e, params: t, slides: s } = this;
      e.children(`.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`).remove(), s.removeAttr("data-swiper-slide-index");
    },
  };
  function L(e) {
    const t = this,
      s = a(),
      i = r(),
      n = t.touchEventsData,
      { params: l, touches: o, enabled: c } = t;
    if (!c) return;
    if (t.animating && l.preventInteractionOnTransition) return;
    !t.animating && l.cssMode && l.loop && t.loopFix();
    let p = e;
    p.originalEvent && (p = p.originalEvent);
    let h = d(p.target);
    if ("wrapper" === l.touchEventsTarget && !h.closest(t.wrapperEl).length) return;
    if (((n.isTouchEvent = "touchstart" === p.type), !n.isTouchEvent && "which" in p && 3 === p.which)) return;
    if (!n.isTouchEvent && "button" in p && p.button > 0) return;
    if (n.isTouched && n.isMoved) return;
    !!l.noSwipingClass && "" !== l.noSwipingClass && p.target && p.target.shadowRoot && e.path && e.path[0] && (h = d(e.path[0]));
    const m = l.noSwipingSelector ? l.noSwipingSelector : `.${l.noSwipingClass}`,
      f = !(!p.target || !p.target.shadowRoot);
    if (
      l.noSwiping &&
      (f
        ? (function (e, t) {
            return (
              void 0 === t && (t = this),
              (function t(s) {
                if (!s || s === a() || s === r()) return null;
                s.assignedSlot && (s = s.assignedSlot);
                const i = s.closest(e);
                return i || s.getRootNode ? i || t(s.getRootNode().host) : null;
              })(t)
            );
          })(m, h[0])
        : h.closest(m)[0])
    )
      return void (t.allowClick = !0);
    if (l.swipeHandler && !h.closest(l.swipeHandler)[0]) return;
    (o.currentX = "touchstart" === p.type ? p.targetTouches[0].pageX : p.pageX), (o.currentY = "touchstart" === p.type ? p.targetTouches[0].pageY : p.pageY);
    const g = o.currentX,
      v = o.currentY,
      w = l.edgeSwipeDetection || l.iOSEdgeSwipeDetection,
      b = l.edgeSwipeThreshold || l.iOSEdgeSwipeThreshold;
    if (w && (g <= b || g >= i.innerWidth - b)) {
      if ("prevent" !== w) return;
      e.preventDefault();
    }
    if (
      (Object.assign(n, { isTouched: !0, isMoved: !1, allowTouchCallbacks: !0, isScrolling: void 0, startMoving: void 0 }),
      (o.startX = g),
      (o.startY = v),
      (n.touchStartTime = u()),
      (t.allowClick = !0),
      t.updateSize(),
      (t.swipeDirection = void 0),
      l.threshold > 0 && (n.allowThresholdMove = !1),
      "touchstart" !== p.type)
    ) {
      let e = !0;
      h.is(n.focusableElements) && ((e = !1), "SELECT" === h[0].nodeName && (n.isTouched = !1)),
        s.activeElement && d(s.activeElement).is(n.focusableElements) && s.activeElement !== h[0] && s.activeElement.blur();
      const a = e && t.allowTouchMove && l.touchStartPreventDefault;
      (!l.touchStartForcePreventDefault && !a) || h[0].isContentEditable || p.preventDefault();
    }
    t.params.freeMode && t.params.freeMode.enabled && t.freeMode && t.animating && !l.cssMode && t.freeMode.onTouchStart(), t.emit("touchStart", p);
  }
  function O(e) {
    const t = a(),
      s = this,
      i = s.touchEventsData,
      { params: r, touches: n, rtlTranslate: l, enabled: o } = s;
    if (!o) return;
    let c = e;
    if ((c.originalEvent && (c = c.originalEvent), !i.isTouched)) return void (i.startMoving && i.isScrolling && s.emit("touchMoveOpposite", c));
    if (i.isTouchEvent && "touchmove" !== c.type) return;
    const p = "touchmove" === c.type && c.targetTouches && (c.targetTouches[0] || c.changedTouches[0]),
      h = "touchmove" === c.type ? p.pageX : c.pageX,
      m = "touchmove" === c.type ? p.pageY : c.pageY;
    if (c.preventedByNestedSwiper) return (n.startX = h), void (n.startY = m);
    if (!s.allowTouchMove)
      return (
        d(c.target).is(i.focusableElements) || (s.allowClick = !1),
        void (i.isTouched && (Object.assign(n, { startX: h, startY: m, currentX: h, currentY: m }), (i.touchStartTime = u())))
      );
    if (i.isTouchEvent && r.touchReleaseOnEdges && !r.loop)
      if (s.isVertical()) {
        if ((m < n.startY && s.translate <= s.maxTranslate()) || (m > n.startY && s.translate >= s.minTranslate()))
          return (i.isTouched = !1), void (i.isMoved = !1);
      } else if ((h < n.startX && s.translate <= s.maxTranslate()) || (h > n.startX && s.translate >= s.minTranslate())) return;
    if (i.isTouchEvent && t.activeElement && c.target === t.activeElement && d(c.target).is(i.focusableElements))
      return (i.isMoved = !0), void (s.allowClick = !1);
    if ((i.allowTouchCallbacks && s.emit("touchMove", c), c.targetTouches && c.targetTouches.length > 1)) return;
    (n.currentX = h), (n.currentY = m);
    const f = n.currentX - n.startX,
      g = n.currentY - n.startY;
    if (s.params.threshold && Math.sqrt(f ** 2 + g ** 2) < s.params.threshold) return;
    if (void 0 === i.isScrolling) {
      let e;
      (s.isHorizontal() && n.currentY === n.startY) || (s.isVertical() && n.currentX === n.startX)
        ? (i.isScrolling = !1)
        : f * f + g * g >= 25 &&
          ((e = (180 * Math.atan2(Math.abs(g), Math.abs(f))) / Math.PI), (i.isScrolling = s.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle));
    }
    if (
      (i.isScrolling && s.emit("touchMoveOpposite", c),
      void 0 === i.startMoving && ((n.currentX === n.startX && n.currentY === n.startY) || (i.startMoving = !0)),
      i.isScrolling)
    )
      return void (i.isTouched = !1);
    if (!i.startMoving) return;
    (s.allowClick = !1),
      !r.cssMode && c.cancelable && c.preventDefault(),
      r.touchMoveStopPropagation && !r.nested && c.stopPropagation(),
      i.isMoved ||
        (r.loop && !r.cssMode && s.loopFix(),
        (i.startTranslate = s.getTranslate()),
        s.setTransition(0),
        s.animating && s.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
        (i.allowMomentumBounce = !1),
        !r.grabCursor || (!0 !== s.allowSlideNext && !0 !== s.allowSlidePrev) || s.setGrabCursor(!0),
        s.emit("sliderFirstMove", c)),
      s.emit("sliderMove", c),
      (i.isMoved = !0);
    let v = s.isHorizontal() ? f : g;
    (n.diff = v), (v *= r.touchRatio), l && (v = -v), (s.swipeDirection = v > 0 ? "prev" : "next"), (i.currentTranslate = v + i.startTranslate);
    let w = !0,
      b = r.resistanceRatio;
    if (
      (r.touchReleaseOnEdges && (b = 0),
      v > 0 && i.currentTranslate > s.minTranslate()
        ? ((w = !1), r.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + v) ** b))
        : v < 0 &&
          i.currentTranslate < s.maxTranslate() &&
          ((w = !1), r.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - v) ** b)),
      w && (c.preventedByNestedSwiper = !0),
      !s.allowSlideNext && "next" === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate),
      !s.allowSlidePrev && "prev" === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate),
      s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate),
      r.threshold > 0)
    ) {
      if (!(Math.abs(v) > r.threshold || i.allowThresholdMove)) return void (i.currentTranslate = i.startTranslate);
      if (!i.allowThresholdMove)
        return (
          (i.allowThresholdMove = !0),
          (n.startX = n.currentX),
          (n.startY = n.currentY),
          (i.currentTranslate = i.startTranslate),
          void (n.diff = s.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY)
        );
    }
    r.followFinger &&
      !r.cssMode &&
      (((r.freeMode && r.freeMode.enabled && s.freeMode) || r.watchSlidesProgress) && (s.updateActiveIndex(), s.updateSlidesClasses()),
      s.params.freeMode && r.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(),
      s.updateProgress(i.currentTranslate),
      s.setTranslate(i.currentTranslate));
  }
  function I(e) {
    const t = this,
      s = t.touchEventsData,
      { params: a, touches: i, rtlTranslate: r, slidesGrid: n, enabled: l } = t;
    if (!l) return;
    let o = e;
    if ((o.originalEvent && (o = o.originalEvent), s.allowTouchCallbacks && t.emit("touchEnd", o), (s.allowTouchCallbacks = !1), !s.isTouched))
      return s.isMoved && a.grabCursor && t.setGrabCursor(!1), (s.isMoved = !1), void (s.startMoving = !1);
    a.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
    const d = u(),
      c = d - s.touchStartTime;
    if (t.allowClick) {
      const e = o.path || (o.composedPath && o.composedPath());
      t.updateClickedSlide((e && e[0]) || o.target), t.emit("tap click", o), c < 300 && d - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", o);
    }
    if (
      ((s.lastClickTime = u()),
      p(() => {
        t.destroyed || (t.allowClick = !0);
      }),
      !s.isTouched || !s.isMoved || !t.swipeDirection || 0 === i.diff || s.currentTranslate === s.startTranslate)
    )
      return (s.isTouched = !1), (s.isMoved = !1), void (s.startMoving = !1);
    let h;
    if (((s.isTouched = !1), (s.isMoved = !1), (s.startMoving = !1), (h = a.followFinger ? (r ? t.translate : -t.translate) : -s.currentTranslate), a.cssMode))
      return;
    if (t.params.freeMode && a.freeMode.enabled) return void t.freeMode.onTouchEnd({ currentPos: h });
    let m = 0,
      f = t.slidesSizesGrid[0];
    for (let e = 0; e < n.length; e += e < a.slidesPerGroupSkip ? 1 : a.slidesPerGroup) {
      const t = e < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
      void 0 !== n[e + t] ? h >= n[e] && h < n[e + t] && ((m = e), (f = n[e + t] - n[e])) : h >= n[e] && ((m = e), (f = n[n.length - 1] - n[n.length - 2]));
    }
    let g = null,
      v = null;
    a.rewind &&
      (t.isBeginning
        ? (v = t.params.virtual && t.params.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1)
        : t.isEnd && (g = 0));
    const w = (h - n[m]) / f,
      b = m < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
    if (c > a.longSwipesMs) {
      if (!a.longSwipes) return void t.slideTo(t.activeIndex);
      "next" === t.swipeDirection && (w >= a.longSwipesRatio ? t.slideTo(a.rewind && t.isEnd ? g : m + b) : t.slideTo(m)),
        "prev" === t.swipeDirection &&
          (w > 1 - a.longSwipesRatio ? t.slideTo(m + b) : null !== v && w < 0 && Math.abs(w) > a.longSwipesRatio ? t.slideTo(v) : t.slideTo(m));
    } else {
      if (!a.shortSwipes) return void t.slideTo(t.activeIndex);
      t.navigation && (o.target === t.navigation.nextEl || o.target === t.navigation.prevEl)
        ? o.target === t.navigation.nextEl
          ? t.slideTo(m + b)
          : t.slideTo(m)
        : ("next" === t.swipeDirection && t.slideTo(null !== g ? g : m + b), "prev" === t.swipeDirection && t.slideTo(null !== v ? v : m));
    }
  }
  function A() {
    const e = this,
      { params: t, el: s } = e;
    if (s && 0 === s.offsetWidth) return;
    t.breakpoints && e.setBreakpoint();
    const { allowSlideNext: a, allowSlidePrev: i, snapGrid: r } = e;
    (e.allowSlideNext = !0),
      (e.allowSlidePrev = !0),
      e.updateSize(),
      e.updateSlides(),
      e.updateSlidesClasses(),
      ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides
        ? e.slideTo(e.slides.length - 1, 0, !1, !0)
        : e.slideTo(e.activeIndex, 0, !1, !0),
      e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(),
      (e.allowSlidePrev = i),
      (e.allowSlideNext = a),
      e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
  }
  function D(e) {
    const t = this;
    t.enabled &&
      (t.allowClick ||
        (t.params.preventClicks && e.preventDefault(),
        t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())));
  }
  function G() {
    const e = this,
      { wrapperEl: t, rtlTranslate: s, enabled: a } = e;
    if (!a) return;
    let i;
    (e.previousTranslate = e.translate),
      e.isHorizontal() ? (e.translate = -t.scrollLeft) : (e.translate = -t.scrollTop),
      0 === e.translate && (e.translate = 0),
      e.updateActiveIndex(),
      e.updateSlidesClasses();
    const r = e.maxTranslate() - e.minTranslate();
    (i = 0 === r ? 0 : (e.translate - e.minTranslate()) / r),
      i !== e.progress && e.updateProgress(s ? -e.translate : e.translate),
      e.emit("setTranslate", e.translate, !1);
  }
  let N = !1;
  function B() {}
  const H = (e, t) => {
    const s = a(),
      { params: i, touchEvents: r, el: n, wrapperEl: l, device: o, support: d } = e,
      c = !!i.nested,
      p = "on" === t ? "addEventListener" : "removeEventListener",
      u = t;
    if (d.touch) {
      const t = !("touchstart" !== r.start || !d.passiveListener || !i.passiveListeners) && { passive: !0, capture: !1 };
      n[p](r.start, e.onTouchStart, t),
        n[p](r.move, e.onTouchMove, d.passiveListener ? { passive: !1, capture: c } : c),
        n[p](r.end, e.onTouchEnd, t),
        r.cancel && n[p](r.cancel, e.onTouchEnd, t);
    } else n[p](r.start, e.onTouchStart, !1), s[p](r.move, e.onTouchMove, c), s[p](r.end, e.onTouchEnd, !1);
    (i.preventClicks || i.preventClicksPropagation) && n[p]("click", e.onClick, !0),
      i.cssMode && l[p]("scroll", e.onScroll),
      i.updateOnWindowResize
        ? e[u](o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", A, !0)
        : e[u]("observerUpdate", A, !0);
  };
  var X = {
    attachEvents: function () {
      const e = this,
        t = a(),
        { params: s, support: i } = e;
      (e.onTouchStart = L.bind(e)),
        (e.onTouchMove = O.bind(e)),
        (e.onTouchEnd = I.bind(e)),
        s.cssMode && (e.onScroll = G.bind(e)),
        (e.onClick = D.bind(e)),
        i.touch && !N && (t.addEventListener("touchstart", B), (N = !0)),
        H(e, "on");
    },
    detachEvents: function () {
      H(this, "off");
    },
  };
  const Y = (e, t) => e.grid && t.grid && t.grid.rows > 1;
  var R = {
    addClasses: function () {
      const e = this,
        { classNames: t, params: s, rtl: a, $el: i, device: r, support: n } = e,
        l = (function (e, t) {
          const s = [];
          return (
            e.forEach((e) => {
              "object" == typeof e
                ? Object.keys(e).forEach((a) => {
                    e[a] && s.push(t + a);
                  })
                : "string" == typeof e && s.push(t + e);
            }),
            s
          );
        })(
          [
            "initialized",
            s.direction,
            { "pointer-events": !n.touch },
            { "free-mode": e.params.freeMode && s.freeMode.enabled },
            { autoheight: s.autoHeight },
            { rtl: a },
            { grid: s.grid && s.grid.rows > 1 },
            { "grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill },
            { android: r.android },
            { ios: r.ios },
            { "css-mode": s.cssMode },
            { centered: s.cssMode && s.centeredSlides },
            { "watch-progress": s.watchSlidesProgress },
          ],
          s.containerModifierClass
        );
      t.push(...l), i.addClass([...t].join(" ")), e.emitContainerClasses();
    },
    removeClasses: function () {
      const { $el: e, classNames: t } = this;
      e.removeClass(t.join(" ")), this.emitContainerClasses();
    },
  };
  var W = {
    init: !0,
    direction: "horizontal",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: !1,
    updateOnWindowResize: !0,
    resizeObserver: !0,
    nested: !1,
    createElements: !1,
    enabled: !0,
    focusableElements: "input, select, option, textarea, button, video, label",
    width: null,
    height: null,
    preventInteractionOnTransition: !1,
    userAgent: null,
    url: null,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsBase: "window",
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: !1,
    centeredSlides: !1,
    centeredSlidesBounds: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !0,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 0,
    touchMoveStopPropagation: !1,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: 0.85,
    watchSlidesProgress: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    preloadImages: !0,
    updateOnImagesReady: !0,
    loop: !1,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopedSlidesLimit: !0,
    loopFillGroupWithBlank: !1,
    loopPreventsSlide: !0,
    rewind: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    maxBackfaceHiddenSlides: 10,
    containerModifierClass: "swiper-",
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-invisible-blank",
    slideActiveClass: "swiper-slide-active",
    slideDuplicateActiveClass: "swiper-slide-duplicate-active",
    slideVisibleClass: "swiper-slide-visible",
    slideDuplicateClass: "swiper-slide-duplicate",
    slideNextClass: "swiper-slide-next",
    slideDuplicateNextClass: "swiper-slide-duplicate-next",
    slidePrevClass: "swiper-slide-prev",
    slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
    wrapperClass: "swiper-wrapper",
    runCallbacksOnInit: !0,
    _emitClasses: !1,
  };
  function j(e, t) {
    return function (s) {
      void 0 === s && (s = {});
      const a = Object.keys(s)[0],
        i = s[a];
      "object" == typeof i && null !== i
        ? (["navigation", "pagination", "scrollbar"].indexOf(a) >= 0 && !0 === e[a] && (e[a] = { auto: !0 }),
          a in e && "enabled" in i
            ? (!0 === e[a] && (e[a] = { enabled: !0 }),
              "object" != typeof e[a] || "enabled" in e[a] || (e[a].enabled = !0),
              e[a] || (e[a] = { enabled: !1 }),
              g(t, s))
            : g(t, s))
        : g(t, s);
    };
  }
  const q = {
      eventsEmitter: $,
      update: S,
      translate: M,
      transition: {
        setTransition: function (e, t) {
          const s = this;
          s.params.cssMode || s.$wrapperEl.transition(e), s.emit("setTransition", e, t);
        },
        transitionStart: function (e, t) {
          void 0 === e && (e = !0);
          const s = this,
            { params: a } = s;
          a.cssMode || (a.autoHeight && s.updateAutoHeight(), P({ swiper: s, runCallbacks: e, direction: t, step: "Start" }));
        },
        transitionEnd: function (e, t) {
          void 0 === e && (e = !0);
          const s = this,
            { params: a } = s;
          (s.animating = !1), a.cssMode || (s.setTransition(0), P({ swiper: s, runCallbacks: e, direction: t, step: "End" }));
        },
      },
      slide: k,
      loop: z,
      grabCursor: {
        setGrabCursor: function (e) {
          const t = this;
          if (t.support.touch || !t.params.simulateTouch || (t.params.watchOverflow && t.isLocked) || t.params.cssMode) return;
          const s = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
          (s.style.cursor = "move"), (s.style.cursor = e ? "grabbing" : "grab");
        },
        unsetGrabCursor: function () {
          const e = this;
          e.support.touch ||
            (e.params.watchOverflow && e.isLocked) ||
            e.params.cssMode ||
            (e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "");
        },
      },
      events: X,
      breakpoints: {
        setBreakpoint: function () {
          const e = this,
            { activeIndex: t, initialized: s, loopedSlides: a = 0, params: i, $el: r } = e,
            n = i.breakpoints;
          if (!n || (n && 0 === Object.keys(n).length)) return;
          const l = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
          if (!l || e.currentBreakpoint === l) return;
          const o = (l in n ? n[l] : void 0) || e.originalParams,
            d = Y(e, i),
            c = Y(e, o),
            p = i.enabled;
          d && !c
            ? (r.removeClass(`${i.containerModifierClass}grid ${i.containerModifierClass}grid-column`), e.emitContainerClasses())
            : !d &&
              c &&
              (r.addClass(`${i.containerModifierClass}grid`),
              ((o.grid.fill && "column" === o.grid.fill) || (!o.grid.fill && "column" === i.grid.fill)) && r.addClass(`${i.containerModifierClass}grid-column`),
              e.emitContainerClasses()),
            ["navigation", "pagination", "scrollbar"].forEach((t) => {
              const s = i[t] && i[t].enabled,
                a = o[t] && o[t].enabled;
              s && !a && e[t].disable(), !s && a && e[t].enable();
            });
          const u = o.direction && o.direction !== i.direction,
            h = i.loop && (o.slidesPerView !== i.slidesPerView || u);
          u && s && e.changeDirection(), g(e.params, o);
          const m = e.params.enabled;
          Object.assign(e, { allowTouchMove: e.params.allowTouchMove, allowSlideNext: e.params.allowSlideNext, allowSlidePrev: e.params.allowSlidePrev }),
            p && !m ? e.disable() : !p && m && e.enable(),
            (e.currentBreakpoint = l),
            e.emit("_beforeBreakpoint", o),
            h && s && (e.loopDestroy(), e.loopCreate(), e.updateSlides(), e.slideTo(t - a + e.loopedSlides, 0, !1)),
            e.emit("breakpoint", o);
        },
        getBreakpoint: function (e, t, s) {
          if ((void 0 === t && (t = "window"), !e || ("container" === t && !s))) return;
          let a = !1;
          const i = r(),
            n = "window" === t ? i.innerHeight : s.clientHeight,
            l = Object.keys(e).map((e) => {
              if ("string" == typeof e && 0 === e.indexOf("@")) {
                const t = parseFloat(e.substr(1));
                return { value: n * t, point: e };
              }
              return { value: e, point: e };
            });
          l.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
          for (let e = 0; e < l.length; e += 1) {
            const { point: r, value: n } = l[e];
            "window" === t ? i.matchMedia(`(min-width: ${n}px)`).matches && (a = r) : n <= s.clientWidth && (a = r);
          }
          return a || "max";
        },
      },
      checkOverflow: {
        checkOverflow: function () {
          const e = this,
            { isLocked: t, params: s } = e,
            { slidesOffsetBefore: a } = s;
          if (a) {
            const t = e.slides.length - 1,
              s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * a;
            e.isLocked = e.size > s;
          } else e.isLocked = 1 === e.snapGrid.length;
          !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked),
            !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
            t && t !== e.isLocked && (e.isEnd = !1),
            t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
        },
      },
      classes: R,
      images: {
        loadImage: function (e, t, s, a, i, n) {
          const l = r();
          let o;
          function c() {
            n && n();
          }
          d(e).parent("picture")[0] || (e.complete && i)
            ? c()
            : t
            ? ((o = new l.Image()), (o.onload = c), (o.onerror = c), a && (o.sizes = a), s && (o.srcset = s), t && (o.src = t))
            : c();
        },
        preloadImages: function () {
          const e = this;
          function t() {
            null != e &&
              e &&
              !e.destroyed &&
              (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
              e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(), e.emit("imagesReady")));
          }
          e.imagesToLoad = e.$el.find("img");
          for (let s = 0; s < e.imagesToLoad.length; s += 1) {
            const a = e.imagesToLoad[s];
            e.loadImage(a, a.currentSrc || a.getAttribute("src"), a.srcset || a.getAttribute("srcset"), a.sizes || a.getAttribute("sizes"), !0, t);
          }
        },
      },
    },
    _ = {};
  class V {
    constructor() {
      let e, t;
      for (var s = arguments.length, a = new Array(s), i = 0; i < s; i++) a[i] = arguments[i];
      if (
        (1 === a.length && a[0].constructor && "Object" === Object.prototype.toString.call(a[0]).slice(8, -1) ? (t = a[0]) : ([e, t] = a),
        t || (t = {}),
        (t = g({}, t)),
        e && !t.el && (t.el = e),
        t.el && d(t.el).length > 1)
      ) {
        const e = [];
        return (
          d(t.el).each((s) => {
            const a = g({}, t, { el: s });
            e.push(new V(a));
          }),
          e
        );
      }
      const r = this;
      (r.__swiper__ = !0),
        (r.support = E()),
        (r.device = C({ userAgent: t.userAgent })),
        (r.browser = T()),
        (r.eventsListeners = {}),
        (r.eventsAnyListeners = []),
        (r.modules = [...r.__modules__]),
        t.modules && Array.isArray(t.modules) && r.modules.push(...t.modules);
      const n = {};
      r.modules.forEach((e) => {
        e({ swiper: r, extendParams: j(t, n), on: r.on.bind(r), once: r.once.bind(r), off: r.off.bind(r), emit: r.emit.bind(r) });
      });
      const l = g({}, W, n);
      return (
        (r.params = g({}, l, _, t)),
        (r.originalParams = g({}, r.params)),
        (r.passedParams = g({}, t)),
        r.params &&
          r.params.on &&
          Object.keys(r.params.on).forEach((e) => {
            r.on(e, r.params.on[e]);
          }),
        r.params && r.params.onAny && r.onAny(r.params.onAny),
        (r.$ = d),
        Object.assign(r, {
          enabled: r.params.enabled,
          el: e,
          classNames: [],
          slides: d(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: () => "horizontal" === r.params.direction,
          isVertical: () => "vertical" === r.params.direction,
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: r.params.allowSlideNext,
          allowSlidePrev: r.params.allowSlidePrev,
          touchEvents: (function () {
            const e = ["touchstart", "touchmove", "touchend", "touchcancel"],
              t = ["pointerdown", "pointermove", "pointerup"];
            return (
              (r.touchEventsTouch = { start: e[0], move: e[1], end: e[2], cancel: e[3] }),
              (r.touchEventsDesktop = { start: t[0], move: t[1], end: t[2] }),
              r.support.touch || !r.params.simulateTouch ? r.touchEventsTouch : r.touchEventsDesktop
            );
          })(),
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: r.params.focusableElements,
            lastClickTime: u(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            isTouchEvent: void 0,
            startMoving: void 0,
          },
          allowClick: !0,
          allowTouchMove: r.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        r.emit("_swiper"),
        r.params.init && r.init(),
        r
      );
    }
    enable() {
      const e = this;
      e.enabled || ((e.enabled = !0), e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
    }
    disable() {
      const e = this;
      e.enabled && ((e.enabled = !1), e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
    }
    setProgress(e, t) {
      const s = this;
      e = Math.min(Math.max(e, 0), 1);
      const a = s.minTranslate(),
        i = (s.maxTranslate() - a) * e + a;
      s.translateTo(i, void 0 === t ? 0 : t), s.updateActiveIndex(), s.updateSlidesClasses();
    }
    emitContainerClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t = e.el.className.split(" ").filter((t) => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass));
      e.emit("_containerClasses", t.join(" "));
    }
    getSlideClasses(e) {
      const t = this;
      return t.destroyed
        ? ""
        : e.className
            .split(" ")
            .filter((e) => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))
            .join(" ");
    }
    emitSlidesClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t = [];
      e.slides.each((s) => {
        const a = e.getSlideClasses(s);
        t.push({ slideEl: s, classNames: a }), e.emit("_slideClass", s, a);
      }),
        e.emit("_slideClasses", t);
    }
    slidesPerViewDynamic(e, t) {
      void 0 === e && (e = "current"), void 0 === t && (t = !1);
      const { params: s, slides: a, slidesGrid: i, slidesSizesGrid: r, size: n, activeIndex: l } = this;
      let o = 1;
      if (s.centeredSlides) {
        let e,
          t = a[l].swiperSlideSize;
        for (let s = l + 1; s < a.length; s += 1) a[s] && !e && ((t += a[s].swiperSlideSize), (o += 1), t > n && (e = !0));
        for (let s = l - 1; s >= 0; s -= 1) a[s] && !e && ((t += a[s].swiperSlideSize), (o += 1), t > n && (e = !0));
      } else if ("current" === e)
        for (let e = l + 1; e < a.length; e += 1) {
          (t ? i[e] + r[e] - i[l] < n : i[e] - i[l] < n) && (o += 1);
        }
      else
        for (let e = l - 1; e >= 0; e -= 1) {
          i[l] - i[e] < n && (o += 1);
        }
      return o;
    }
    update() {
      const e = this;
      if (!e || e.destroyed) return;
      const { snapGrid: t, params: s } = e;
      function a() {
        const t = e.rtlTranslate ? -1 * e.translate : e.translate,
          s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
        e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
      }
      let i;
      s.breakpoints && e.setBreakpoint(),
        e.updateSize(),
        e.updateSlides(),
        e.updateProgress(),
        e.updateSlidesClasses(),
        e.params.freeMode && e.params.freeMode.enabled
          ? (a(), e.params.autoHeight && e.updateAutoHeight())
          : ((i =
              ("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides
                ? e.slideTo(e.slides.length - 1, 0, !1, !0)
                : e.slideTo(e.activeIndex, 0, !1, !0)),
            i || a()),
        s.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
        e.emit("update");
    }
    changeDirection(e, t) {
      void 0 === t && (t = !0);
      const s = this,
        a = s.params.direction;
      return (
        e || (e = "horizontal" === a ? "vertical" : "horizontal"),
        e === a ||
          ("horizontal" !== e && "vertical" !== e) ||
          (s.$el.removeClass(`${s.params.containerModifierClass}${a}`).addClass(`${s.params.containerModifierClass}${e}`),
          s.emitContainerClasses(),
          (s.params.direction = e),
          s.slides.each((t) => {
            "vertical" === e ? (t.style.width = "") : (t.style.height = "");
          }),
          s.emit("changeDirection"),
          t && s.update()),
        s
      );
    }
    changeLanguageDirection(e) {
      const t = this;
      (t.rtl && "rtl" === e) ||
        (!t.rtl && "ltr" === e) ||
        ((t.rtl = "rtl" === e),
        (t.rtlTranslate = "horizontal" === t.params.direction && t.rtl),
        t.rtl
          ? (t.$el.addClass(`${t.params.containerModifierClass}rtl`), (t.el.dir = "rtl"))
          : (t.$el.removeClass(`${t.params.containerModifierClass}rtl`), (t.el.dir = "ltr")),
        t.update());
    }
    mount(e) {
      const t = this;
      if (t.mounted) return !0;
      const s = d(e || t.params.el);
      if (!(e = s[0])) return !1;
      e.swiper = t;
      const i = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
      let r = (() => {
        if (e && e.shadowRoot && e.shadowRoot.querySelector) {
          const t = d(e.shadowRoot.querySelector(i()));
          return (t.children = (e) => s.children(e)), t;
        }
        return s.children ? s.children(i()) : d(s).children(i());
      })();
      if (0 === r.length && t.params.createElements) {
        const e = a().createElement("div");
        (r = d(e)),
          (e.className = t.params.wrapperClass),
          s.append(e),
          s.children(`.${t.params.slideClass}`).each((e) => {
            r.append(e);
          });
      }
      return (
        Object.assign(t, {
          $el: s,
          el: e,
          $wrapperEl: r,
          wrapperEl: r[0],
          mounted: !0,
          rtl: "rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction"),
          rtlTranslate: "horizontal" === t.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction")),
          wrongRTL: "-webkit-box" === r.css("display"),
        }),
        !0
      );
    }
    init(e) {
      const t = this;
      if (t.initialized) return t;
      return (
        !1 === t.mount(e) ||
          (t.emit("beforeInit"),
          t.params.breakpoints && t.setBreakpoint(),
          t.addClasses(),
          t.params.loop && t.loopCreate(),
          t.updateSize(),
          t.updateSlides(),
          t.params.watchOverflow && t.checkOverflow(),
          t.params.grabCursor && t.enabled && t.setGrabCursor(),
          t.params.preloadImages && t.preloadImages(),
          t.params.loop
            ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit, !1, !0)
            : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
          t.attachEvents(),
          (t.initialized = !0),
          t.emit("init"),
          t.emit("afterInit")),
        t
      );
    }
    destroy(e, t) {
      void 0 === e && (e = !0), void 0 === t && (t = !0);
      const s = this,
        { params: a, $el: i, $wrapperEl: r, slides: n } = s;
      return (
        void 0 === s.params ||
          s.destroyed ||
          (s.emit("beforeDestroy"),
          (s.initialized = !1),
          s.detachEvents(),
          a.loop && s.loopDestroy(),
          t &&
            (s.removeClasses(),
            i.removeAttr("style"),
            r.removeAttr("style"),
            n &&
              n.length &&
              n
                .removeClass([a.slideVisibleClass, a.slideActiveClass, a.slideNextClass, a.slidePrevClass].join(" "))
                .removeAttr("style")
                .removeAttr("data-swiper-slide-index")),
          s.emit("destroy"),
          Object.keys(s.eventsListeners).forEach((e) => {
            s.off(e);
          }),
          !1 !== e &&
            ((s.$el[0].swiper = null),
            (function (e) {
              const t = e;
              Object.keys(t).forEach((e) => {
                try {
                  t[e] = null;
                } catch (e) {}
                try {
                  delete t[e];
                } catch (e) {}
              });
            })(s)),
          (s.destroyed = !0)),
        null
      );
    }
    static extendDefaults(e) {
      g(_, e);
    }
    static get extendedDefaults() {
      return _;
    }
    static get defaults() {
      return W;
    }
    static installModule(e) {
      V.prototype.__modules__ || (V.prototype.__modules__ = []);
      const t = V.prototype.__modules__;
      "function" == typeof e && t.indexOf(e) < 0 && t.push(e);
    }
    static use(e) {
      return Array.isArray(e) ? (e.forEach((e) => V.installModule(e)), V) : (V.installModule(e), V);
    }
  }
  function F(e, t, s, i) {
    const r = a();
    return (
      e.params.createElements &&
        Object.keys(i).forEach((a) => {
          if (!s[a] && !0 === s.auto) {
            let n = e.$el.children(`.${i[a]}`)[0];
            n || ((n = r.createElement("div")), (n.className = i[a]), e.$el.append(n)), (s[a] = n), (t[a] = n);
          }
        }),
      s
    );
  }
  function U(e) {
    return (
      void 0 === e && (e = ""),
      `.${e
        .trim()
        .replace(/([\.:!\/])/g, "\\$1")
        .replace(/ /g, ".")}`
    );
  }
  function K(e) {
    const t = this,
      { $wrapperEl: s, params: a } = t;
    if ((a.loop && t.loopDestroy(), "object" == typeof e && "length" in e)) for (let t = 0; t < e.length; t += 1) e[t] && s.append(e[t]);
    else s.append(e);
    a.loop && t.loopCreate(), a.observer || t.update();
  }
  function Z(e) {
    const t = this,
      { params: s, $wrapperEl: a, activeIndex: i } = t;
    s.loop && t.loopDestroy();
    let r = i + 1;
    if ("object" == typeof e && "length" in e) {
      for (let t = 0; t < e.length; t += 1) e[t] && a.prepend(e[t]);
      r = i + e.length;
    } else a.prepend(e);
    s.loop && t.loopCreate(), s.observer || t.update(), t.slideTo(r, 0, !1);
  }
  function Q(e, t) {
    const s = this,
      { $wrapperEl: a, params: i, activeIndex: r } = s;
    let n = r;
    i.loop && ((n -= s.loopedSlides), s.loopDestroy(), (s.slides = a.children(`.${i.slideClass}`)));
    const l = s.slides.length;
    if (e <= 0) return void s.prependSlide(t);
    if (e >= l) return void s.appendSlide(t);
    let o = n > e ? n + 1 : n;
    const d = [];
    for (let t = l - 1; t >= e; t -= 1) {
      const e = s.slides.eq(t);
      e.remove(), d.unshift(e);
    }
    if ("object" == typeof t && "length" in t) {
      for (let e = 0; e < t.length; e += 1) t[e] && a.append(t[e]);
      o = n > e ? n + t.length : n;
    } else a.append(t);
    for (let e = 0; e < d.length; e += 1) a.append(d[e]);
    i.loop && s.loopCreate(), i.observer || s.update(), i.loop ? s.slideTo(o + s.loopedSlides, 0, !1) : s.slideTo(o, 0, !1);
  }
  function J(e) {
    const t = this,
      { params: s, $wrapperEl: a, activeIndex: i } = t;
    let r = i;
    s.loop && ((r -= t.loopedSlides), t.loopDestroy(), (t.slides = a.children(`.${s.slideClass}`)));
    let n,
      l = r;
    if ("object" == typeof e && "length" in e) {
      for (let s = 0; s < e.length; s += 1) (n = e[s]), t.slides[n] && t.slides.eq(n).remove(), n < l && (l -= 1);
      l = Math.max(l, 0);
    } else (n = e), t.slides[n] && t.slides.eq(n).remove(), n < l && (l -= 1), (l = Math.max(l, 0));
    s.loop && t.loopCreate(), s.observer || t.update(), s.loop ? t.slideTo(l + t.loopedSlides, 0, !1) : t.slideTo(l, 0, !1);
  }
  function ee() {
    const e = this,
      t = [];
    for (let s = 0; s < e.slides.length; s += 1) t.push(s);
    e.removeSlide(t);
  }
  function te(e) {
    const { effect: t, swiper: s, on: a, setTranslate: i, setTransition: r, overwriteParams: n, perspective: l, recreateShadows: o, getEffectParams: d } = e;
    let c;
    a("beforeInit", () => {
      if (s.params.effect !== t) return;
      s.classNames.push(`${s.params.containerModifierClass}${t}`), l && l() && s.classNames.push(`${s.params.containerModifierClass}3d`);
      const e = n ? n() : {};
      Object.assign(s.params, e), Object.assign(s.originalParams, e);
    }),
      a("setTranslate", () => {
        s.params.effect === t && i();
      }),
      a("setTransition", (e, a) => {
        s.params.effect === t && r(a);
      }),
      a("transitionEnd", () => {
        if (s.params.effect === t && o) {
          if (!d || !d().slideShadows) return;
          s.slides.each((e) => {
            s.$(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").remove();
          }),
            o();
        }
      }),
      a("virtualUpdate", () => {
        s.params.effect === t &&
          (s.slides.length || (c = !0),
          requestAnimationFrame(() => {
            c && s.slides && s.slides.length && (i(), (c = !1));
          }));
      });
  }
  function se(e, t) {
    return e.transformEl ? t.find(e.transformEl).css({ "backface-visibility": "hidden", "-webkit-backface-visibility": "hidden" }) : t;
  }
  function ae(e) {
    let { swiper: t, duration: s, transformEl: a, allSlides: i } = e;
    const { slides: r, activeIndex: n, $wrapperEl: l } = t;
    if (t.params.virtualTranslate && 0 !== s) {
      let e,
        s = !1;
      (e = i ? (a ? r.find(a) : r) : a ? r.eq(n).find(a) : r.eq(n)),
        e.transitionEnd(() => {
          if (s) return;
          if (!t || t.destroyed) return;
          (s = !0), (t.animating = !1);
          const e = ["webkitTransitionEnd", "transitionend"];
          for (let t = 0; t < e.length; t += 1) l.trigger(e[t]);
        });
    }
  }
  function ie(e, t, s) {
    const a = "swiper-slide-shadow" + (s ? `-${s}` : ""),
      i = e.transformEl ? t.find(e.transformEl) : t;
    let r = i.children(`.${a}`);
    return r.length || ((r = d(`<div class="swiper-slide-shadow${s ? `-${s}` : ""}"></div>`)), i.append(r)), r;
  }
  Object.keys(q).forEach((e) => {
    Object.keys(q[e]).forEach((t) => {
      V.prototype[t] = q[e][t];
    });
  }),
    V.use([
      function (e) {
        let { swiper: t, on: s, emit: a } = e;
        const i = r();
        let n = null,
          l = null;
        const o = () => {
            t && !t.destroyed && t.initialized && (a("beforeResize"), a("resize"));
          },
          d = () => {
            t && !t.destroyed && t.initialized && a("orientationchange");
          };
        s("init", () => {
          t.params.resizeObserver && void 0 !== i.ResizeObserver
            ? t &&
              !t.destroyed &&
              t.initialized &&
              ((n = new ResizeObserver((e) => {
                l = i.requestAnimationFrame(() => {
                  const { width: s, height: a } = t;
                  let i = s,
                    r = a;
                  e.forEach((e) => {
                    let { contentBoxSize: s, contentRect: a, target: n } = e;
                    (n && n !== t.el) || ((i = a ? a.width : (s[0] || s).inlineSize), (r = a ? a.height : (s[0] || s).blockSize));
                  }),
                    (i === s && r === a) || o();
                });
              })),
              n.observe(t.el))
            : (i.addEventListener("resize", o), i.addEventListener("orientationchange", d));
        }),
          s("destroy", () => {
            l && i.cancelAnimationFrame(l),
              n && n.unobserve && t.el && (n.unobserve(t.el), (n = null)),
              i.removeEventListener("resize", o),
              i.removeEventListener("orientationchange", d);
          });
      },
      function (e) {
        let { swiper: t, extendParams: s, on: a, emit: i } = e;
        const n = [],
          l = r(),
          o = function (e, t) {
            void 0 === t && (t = {});
            const s = new (l.MutationObserver || l.WebkitMutationObserver)((e) => {
              if (1 === e.length) return void i("observerUpdate", e[0]);
              const t = function () {
                i("observerUpdate", e[0]);
              };
              l.requestAnimationFrame ? l.requestAnimationFrame(t) : l.setTimeout(t, 0);
            });
            s.observe(e, {
              attributes: void 0 === t.attributes || t.attributes,
              childList: void 0 === t.childList || t.childList,
              characterData: void 0 === t.characterData || t.characterData,
            }),
              n.push(s);
          };
        s({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
          a("init", () => {
            if (t.params.observer) {
              if (t.params.observeParents) {
                const e = t.$el.parents();
                for (let t = 0; t < e.length; t += 1) o(e[t]);
              }
              o(t.$el[0], { childList: t.params.observeSlideChildren }), o(t.$wrapperEl[0], { attributes: !1 });
            }
          }),
          a("destroy", () => {
            n.forEach((e) => {
              e.disconnect();
            }),
              n.splice(0, n.length);
          });
      },
    ]);
  const re = [
    function (e) {
      let t,
        { swiper: s, extendParams: a, on: i, emit: r } = e;
      function n(e, t) {
        const a = s.params.virtual;
        if (a.cache && s.virtual.cache[t]) return s.virtual.cache[t];
        const i = a.renderSlide ? d(a.renderSlide.call(s, e, t)) : d(`<div class="${s.params.slideClass}" data-swiper-slide-index="${t}">${e}</div>`);
        return i.attr("data-swiper-slide-index") || i.attr("data-swiper-slide-index", t), a.cache && (s.virtual.cache[t] = i), i;
      }
      function l(e) {
        const { slidesPerView: t, slidesPerGroup: a, centeredSlides: i } = s.params,
          { addSlidesBefore: l, addSlidesAfter: o } = s.params.virtual,
          { from: d, to: c, slides: p, slidesGrid: u, offset: h } = s.virtual;
        s.params.cssMode || s.updateActiveIndex();
        const m = s.activeIndex || 0;
        let f, g, v;
        (f = s.rtlTranslate ? "right" : s.isHorizontal() ? "left" : "top"),
          i ? ((g = Math.floor(t / 2) + a + o), (v = Math.floor(t / 2) + a + l)) : ((g = t + (a - 1) + o), (v = a + l));
        const w = Math.max((m || 0) - v, 0),
          b = Math.min((m || 0) + g, p.length - 1),
          x = (s.slidesGrid[w] || 0) - (s.slidesGrid[0] || 0);
        function y() {
          s.updateSlides(), s.updateProgress(), s.updateSlidesClasses(), s.lazy && s.params.lazy.enabled && s.lazy.load(), r("virtualUpdate");
        }
        if ((Object.assign(s.virtual, { from: w, to: b, offset: x, slidesGrid: s.slidesGrid }), d === w && c === b && !e))
          return s.slidesGrid !== u && x !== h && s.slides.css(f, `${x}px`), s.updateProgress(), void r("virtualUpdate");
        if (s.params.virtual.renderExternal)
          return (
            s.params.virtual.renderExternal.call(s, {
              offset: x,
              from: w,
              to: b,
              slides: (function () {
                const e = [];
                for (let t = w; t <= b; t += 1) e.push(p[t]);
                return e;
              })(),
            }),
            void (s.params.virtual.renderExternalUpdate ? y() : r("virtualUpdate"))
          );
        const E = [],
          C = [];
        if (e) s.$wrapperEl.find(`.${s.params.slideClass}`).remove();
        else for (let e = d; e <= c; e += 1) (e < w || e > b) && s.$wrapperEl.find(`.${s.params.slideClass}[data-swiper-slide-index="${e}"]`).remove();
        for (let t = 0; t < p.length; t += 1) t >= w && t <= b && (void 0 === c || e ? C.push(t) : (t > c && C.push(t), t < d && E.push(t)));
        C.forEach((e) => {
          s.$wrapperEl.append(n(p[e], e));
        }),
          E.sort((e, t) => t - e).forEach((e) => {
            s.$wrapperEl.prepend(n(p[e], e));
          }),
          s.$wrapperEl.children(".swiper-slide").css(f, `${x}px`),
          y();
      }
      a({
        virtual: {
          enabled: !1,
          slides: [],
          cache: !0,
          renderSlide: null,
          renderExternal: null,
          renderExternalUpdate: !0,
          addSlidesBefore: 0,
          addSlidesAfter: 0,
        },
      }),
        (s.virtual = { cache: {}, from: void 0, to: void 0, slides: [], offset: 0, slidesGrid: [] }),
        i("beforeInit", () => {
          s.params.virtual.enabled &&
            ((s.virtual.slides = s.params.virtual.slides),
            s.classNames.push(`${s.params.containerModifierClass}virtual`),
            (s.params.watchSlidesProgress = !0),
            (s.originalParams.watchSlidesProgress = !0),
            s.params.initialSlide || l());
        }),
        i("setTranslate", () => {
          s.params.virtual.enabled &&
            (s.params.cssMode && !s._immediateVirtual
              ? (clearTimeout(t),
                (t = setTimeout(() => {
                  l();
                }, 100)))
              : l());
        }),
        i("init update resize", () => {
          s.params.virtual.enabled && s.params.cssMode && v(s.wrapperEl, "--swiper-virtual-size", `${s.virtualSize}px`);
        }),
        Object.assign(s.virtual, {
          appendSlide: function (e) {
            if ("object" == typeof e && "length" in e) for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.push(e[t]);
            else s.virtual.slides.push(e);
            l(!0);
          },
          prependSlide: function (e) {
            const t = s.activeIndex;
            let a = t + 1,
              i = 1;
            if (Array.isArray(e)) {
              for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.unshift(e[t]);
              (a = t + e.length), (i = e.length);
            } else s.virtual.slides.unshift(e);
            if (s.params.virtual.cache) {
              const e = s.virtual.cache,
                t = {};
              Object.keys(e).forEach((s) => {
                const a = e[s],
                  r = a.attr("data-swiper-slide-index");
                r && a.attr("data-swiper-slide-index", parseInt(r, 10) + i), (t[parseInt(s, 10) + i] = a);
              }),
                (s.virtual.cache = t);
            }
            l(!0), s.slideTo(a, 0);
          },
          removeSlide: function (e) {
            if (null == e) return;
            let t = s.activeIndex;
            if (Array.isArray(e))
              for (let a = e.length - 1; a >= 0; a -= 1)
                s.virtual.slides.splice(e[a], 1), s.params.virtual.cache && delete s.virtual.cache[e[a]], e[a] < t && (t -= 1), (t = Math.max(t, 0));
            else s.virtual.slides.splice(e, 1), s.params.virtual.cache && delete s.virtual.cache[e], e < t && (t -= 1), (t = Math.max(t, 0));
            l(!0), s.slideTo(t, 0);
          },
          removeAllSlides: function () {
            (s.virtual.slides = []), s.params.virtual.cache && (s.virtual.cache = {}), l(!0), s.slideTo(0, 0);
          },
          update: l,
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: i, emit: n } = e;
      const l = a(),
        o = r();
      function c(e) {
        if (!t.enabled) return;
        const { rtlTranslate: s } = t;
        let a = e;
        a.originalEvent && (a = a.originalEvent);
        const i = a.keyCode || a.charCode,
          r = t.params.keyboard.pageUpDown,
          d = r && 33 === i,
          c = r && 34 === i,
          p = 37 === i,
          u = 39 === i,
          h = 38 === i,
          m = 40 === i;
        if (!t.allowSlideNext && ((t.isHorizontal() && u) || (t.isVertical() && m) || c)) return !1;
        if (!t.allowSlidePrev && ((t.isHorizontal() && p) || (t.isVertical() && h) || d)) return !1;
        if (
          !(
            a.shiftKey ||
            a.altKey ||
            a.ctrlKey ||
            a.metaKey ||
            (l.activeElement &&
              l.activeElement.nodeName &&
              ("input" === l.activeElement.nodeName.toLowerCase() || "textarea" === l.activeElement.nodeName.toLowerCase()))
          )
        ) {
          if (t.params.keyboard.onlyInViewport && (d || c || p || u || h || m)) {
            let e = !1;
            if (t.$el.parents(`.${t.params.slideClass}`).length > 0 && 0 === t.$el.parents(`.${t.params.slideActiveClass}`).length) return;
            const a = t.$el,
              i = a[0].clientWidth,
              r = a[0].clientHeight,
              n = o.innerWidth,
              l = o.innerHeight,
              d = t.$el.offset();
            s && (d.left -= t.$el[0].scrollLeft);
            const c = [
              [d.left, d.top],
              [d.left + i, d.top],
              [d.left, d.top + r],
              [d.left + i, d.top + r],
            ];
            for (let t = 0; t < c.length; t += 1) {
              const s = c[t];
              if (s[0] >= 0 && s[0] <= n && s[1] >= 0 && s[1] <= l) {
                if (0 === s[0] && 0 === s[1]) continue;
                e = !0;
              }
            }
            if (!e) return;
          }
          t.isHorizontal()
            ? ((d || c || p || u) && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1)),
              (((c || u) && !s) || ((d || p) && s)) && t.slideNext(),
              (((d || p) && !s) || ((c || u) && s)) && t.slidePrev())
            : ((d || c || h || m) && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1)), (c || m) && t.slideNext(), (d || h) && t.slidePrev()),
            n("keyPress", i);
        }
      }
      function p() {
        t.keyboard.enabled || (d(l).on("keydown", c), (t.keyboard.enabled = !0));
      }
      function u() {
        t.keyboard.enabled && (d(l).off("keydown", c), (t.keyboard.enabled = !1));
      }
      (t.keyboard = { enabled: !1 }),
        s({ keyboard: { enabled: !1, onlyInViewport: !0, pageUpDown: !0 } }),
        i("init", () => {
          t.params.keyboard.enabled && p();
        }),
        i("destroy", () => {
          t.keyboard.enabled && u();
        }),
        Object.assign(t.keyboard, { enable: p, disable: u });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a, emit: i } = e;
      const n = r();
      let l;
      s({
        mousewheel: {
          enabled: !1,
          releaseOnEdges: !1,
          invert: !1,
          forceToAxis: !1,
          sensitivity: 1,
          eventsTarget: "container",
          thresholdDelta: null,
          thresholdTime: null,
        },
      }),
        (t.mousewheel = { enabled: !1 });
      let o,
        c = u();
      const h = [];
      function m() {
        t.enabled && (t.mouseEntered = !0);
      }
      function f() {
        t.enabled && (t.mouseEntered = !1);
      }
      function g(e) {
        return (
          !(t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta) &&
          !(t.params.mousewheel.thresholdTime && u() - c < t.params.mousewheel.thresholdTime) &&
          ((e.delta >= 6 && u() - c < 60) ||
            (e.direction < 0
              ? (t.isEnd && !t.params.loop) || t.animating || (t.slideNext(), i("scroll", e.raw))
              : (t.isBeginning && !t.params.loop) || t.animating || (t.slidePrev(), i("scroll", e.raw)),
            (c = new n.Date().getTime()),
            !1))
        );
      }
      function v(e) {
        let s = e,
          a = !0;
        if (!t.enabled) return;
        const r = t.params.mousewheel;
        t.params.cssMode && s.preventDefault();
        let n = t.$el;
        if (
          ("container" !== t.params.mousewheel.eventsTarget && (n = d(t.params.mousewheel.eventsTarget)),
          !t.mouseEntered && !n[0].contains(s.target) && !r.releaseOnEdges)
        )
          return !0;
        s.originalEvent && (s = s.originalEvent);
        let c = 0;
        const m = t.rtlTranslate ? -1 : 1,
          f = (function (e) {
            let t = 0,
              s = 0,
              a = 0,
              i = 0;
            return (
              "detail" in e && (s = e.detail),
              "wheelDelta" in e && (s = -e.wheelDelta / 120),
              "wheelDeltaY" in e && (s = -e.wheelDeltaY / 120),
              "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120),
              "axis" in e && e.axis === e.HORIZONTAL_AXIS && ((t = s), (s = 0)),
              (a = 10 * t),
              (i = 10 * s),
              "deltaY" in e && (i = e.deltaY),
              "deltaX" in e && (a = e.deltaX),
              e.shiftKey && !a && ((a = i), (i = 0)),
              (a || i) && e.deltaMode && (1 === e.deltaMode ? ((a *= 40), (i *= 40)) : ((a *= 800), (i *= 800))),
              a && !t && (t = a < 1 ? -1 : 1),
              i && !s && (s = i < 1 ? -1 : 1),
              { spinX: t, spinY: s, pixelX: a, pixelY: i }
            );
          })(s);
        if (r.forceToAxis)
          if (t.isHorizontal()) {
            if (!(Math.abs(f.pixelX) > Math.abs(f.pixelY))) return !0;
            c = -f.pixelX * m;
          } else {
            if (!(Math.abs(f.pixelY) > Math.abs(f.pixelX))) return !0;
            c = -f.pixelY;
          }
        else c = Math.abs(f.pixelX) > Math.abs(f.pixelY) ? -f.pixelX * m : -f.pixelY;
        if (0 === c) return !0;
        r.invert && (c = -c);
        let v = t.getTranslate() + c * r.sensitivity;
        if (
          (v >= t.minTranslate() && (v = t.minTranslate()),
          v <= t.maxTranslate() && (v = t.maxTranslate()),
          (a = !!t.params.loop || !(v === t.minTranslate() || v === t.maxTranslate())),
          a && t.params.nested && s.stopPropagation(),
          t.params.freeMode && t.params.freeMode.enabled)
        ) {
          const e = { time: u(), delta: Math.abs(c), direction: Math.sign(c) },
            a = o && e.time < o.time + 500 && e.delta <= o.delta && e.direction === o.direction;
          if (!a) {
            (o = void 0), t.params.loop && t.loopFix();
            let n = t.getTranslate() + c * r.sensitivity;
            const d = t.isBeginning,
              u = t.isEnd;
            if (
              (n >= t.minTranslate() && (n = t.minTranslate()),
              n <= t.maxTranslate() && (n = t.maxTranslate()),
              t.setTransition(0),
              t.setTranslate(n),
              t.updateProgress(),
              t.updateActiveIndex(),
              t.updateSlidesClasses(),
              ((!d && t.isBeginning) || (!u && t.isEnd)) && t.updateSlidesClasses(),
              t.params.freeMode.sticky)
            ) {
              clearTimeout(l), (l = void 0), h.length >= 15 && h.shift();
              const s = h.length ? h[h.length - 1] : void 0,
                a = h[0];
              if ((h.push(e), s && (e.delta > s.delta || e.direction !== s.direction))) h.splice(0);
              else if (h.length >= 15 && e.time - a.time < 500 && a.delta - e.delta >= 1 && e.delta <= 6) {
                const s = c > 0 ? 0.8 : 0.2;
                (o = e),
                  h.splice(0),
                  (l = p(() => {
                    t.slideToClosest(t.params.speed, !0, void 0, s);
                  }, 0));
              }
              l ||
                (l = p(() => {
                  (o = e), h.splice(0), t.slideToClosest(t.params.speed, !0, void 0, 0.5);
                }, 500));
            }
            if (
              (a || i("scroll", s),
              t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(),
              n === t.minTranslate() || n === t.maxTranslate())
            )
              return !0;
          }
        } else {
          const s = { time: u(), delta: Math.abs(c), direction: Math.sign(c), raw: e };
          h.length >= 2 && h.shift();
          const a = h.length ? h[h.length - 1] : void 0;
          if (
            (h.push(s),
            a ? (s.direction !== a.direction || s.delta > a.delta || s.time > a.time + 150) && g(s) : g(s),
            (function (e) {
              const s = t.params.mousewheel;
              if (e.direction < 0) {
                if (t.isEnd && !t.params.loop && s.releaseOnEdges) return !0;
              } else if (t.isBeginning && !t.params.loop && s.releaseOnEdges) return !0;
              return !1;
            })(s))
          )
            return !0;
        }
        return s.preventDefault ? s.preventDefault() : (s.returnValue = !1), !1;
      }
      function w(e) {
        let s = t.$el;
        "container" !== t.params.mousewheel.eventsTarget && (s = d(t.params.mousewheel.eventsTarget)),
          s[e]("mouseenter", m),
          s[e]("mouseleave", f),
          s[e]("wheel", v);
      }
      function b() {
        return t.params.cssMode ? (t.wrapperEl.removeEventListener("wheel", v), !0) : !t.mousewheel.enabled && (w("on"), (t.mousewheel.enabled = !0), !0);
      }
      function x() {
        return t.params.cssMode ? (t.wrapperEl.addEventListener(event, v), !0) : !!t.mousewheel.enabled && (w("off"), (t.mousewheel.enabled = !1), !0);
      }
      a("init", () => {
        !t.params.mousewheel.enabled && t.params.cssMode && x(), t.params.mousewheel.enabled && b();
      }),
        a("destroy", () => {
          t.params.cssMode && b(), t.mousewheel.enabled && x();
        }),
        Object.assign(t.mousewheel, { enable: b, disable: x });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a, emit: i } = e;
      function r(e) {
        let s;
        return e && ((s = d(e)), t.params.uniqueNavElements && "string" == typeof e && s.length > 1 && 1 === t.$el.find(e).length && (s = t.$el.find(e))), s;
      }
      function n(e, s) {
        const a = t.params.navigation;
        e &&
          e.length > 0 &&
          (e[s ? "addClass" : "removeClass"](a.disabledClass),
          e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = s),
          t.params.watchOverflow && t.enabled && e[t.isLocked ? "addClass" : "removeClass"](a.lockClass));
      }
      function l() {
        if (t.params.loop) return;
        const { $nextEl: e, $prevEl: s } = t.navigation;
        n(s, t.isBeginning && !t.params.rewind), n(e, t.isEnd && !t.params.rewind);
      }
      function o(e) {
        e.preventDefault(), (!t.isBeginning || t.params.loop || t.params.rewind) && (t.slidePrev(), i("navigationPrev"));
      }
      function c(e) {
        e.preventDefault(), (!t.isEnd || t.params.loop || t.params.rewind) && (t.slideNext(), i("navigationNext"));
      }
      function p() {
        const e = t.params.navigation;
        if (
          ((t.params.navigation = F(t, t.originalParams.navigation, t.params.navigation, { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" })),
          !e.nextEl && !e.prevEl)
        )
          return;
        const s = r(e.nextEl),
          a = r(e.prevEl);
        s && s.length > 0 && s.on("click", c),
          a && a.length > 0 && a.on("click", o),
          Object.assign(t.navigation, { $nextEl: s, nextEl: s && s[0], $prevEl: a, prevEl: a && a[0] }),
          t.enabled || (s && s.addClass(e.lockClass), a && a.addClass(e.lockClass));
      }
      function u() {
        const { $nextEl: e, $prevEl: s } = t.navigation;
        e && e.length && (e.off("click", c), e.removeClass(t.params.navigation.disabledClass)),
          s && s.length && (s.off("click", o), s.removeClass(t.params.navigation.disabledClass));
      }
      s({
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: !1,
          disabledClass: "swiper-button-disabled",
          hiddenClass: "swiper-button-hidden",
          lockClass: "swiper-button-lock",
          navigationDisabledClass: "swiper-navigation-disabled",
        },
      }),
        (t.navigation = { nextEl: null, $nextEl: null, prevEl: null, $prevEl: null }),
        a("init", () => {
          !1 === t.params.navigation.enabled ? h() : (p(), l());
        }),
        a("toEdge fromEdge lock unlock", () => {
          l();
        }),
        a("destroy", () => {
          u();
        }),
        a("enable disable", () => {
          const { $nextEl: e, $prevEl: s } = t.navigation;
          e && e[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass),
            s && s[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass);
        }),
        a("click", (e, s) => {
          const { $nextEl: a, $prevEl: r } = t.navigation,
            n = s.target;
          if (t.params.navigation.hideOnClick && !d(n).is(r) && !d(n).is(a)) {
            if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === n || t.pagination.el.contains(n))) return;
            let e;
            a ? (e = a.hasClass(t.params.navigation.hiddenClass)) : r && (e = r.hasClass(t.params.navigation.hiddenClass)),
              i(!0 === e ? "navigationShow" : "navigationHide"),
              a && a.toggleClass(t.params.navigation.hiddenClass),
              r && r.toggleClass(t.params.navigation.hiddenClass);
          }
        });
      const h = () => {
        t.$el.addClass(t.params.navigation.navigationDisabledClass), u();
      };
      Object.assign(t.navigation, {
        enable: () => {
          t.$el.removeClass(t.params.navigation.navigationDisabledClass), p(), l();
        },
        disable: h,
        update: l,
        init: p,
        destroy: u,
      });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a, emit: i } = e;
      const r = "swiper-pagination";
      let n;
      s({
        pagination: {
          el: null,
          bulletElement: "span",
          clickable: !1,
          hideOnClick: !1,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: !1,
          type: "bullets",
          dynamicBullets: !1,
          dynamicMainBullets: 1,
          formatFractionCurrent: (e) => e,
          formatFractionTotal: (e) => e,
          bulletClass: `${r}-bullet`,
          bulletActiveClass: `${r}-bullet-active`,
          modifierClass: `${r}-`,
          currentClass: `${r}-current`,
          totalClass: `${r}-total`,
          hiddenClass: `${r}-hidden`,
          progressbarFillClass: `${r}-progressbar-fill`,
          progressbarOppositeClass: `${r}-progressbar-opposite`,
          clickableClass: `${r}-clickable`,
          lockClass: `${r}-lock`,
          horizontalClass: `${r}-horizontal`,
          verticalClass: `${r}-vertical`,
          paginationDisabledClass: `${r}-disabled`,
        },
      }),
        (t.pagination = { el: null, $el: null, bullets: [] });
      let l = 0;
      function o() {
        return !t.params.pagination.el || !t.pagination.el || !t.pagination.$el || 0 === t.pagination.$el.length;
      }
      function c(e, s) {
        const { bulletActiveClass: a } = t.params.pagination;
        e[s]().addClass(`${a}-${s}`)[s]().addClass(`${a}-${s}-${s}`);
      }
      function p() {
        const e = t.rtl,
          s = t.params.pagination;
        if (o()) return;
        const a = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
          r = t.pagination.$el;
        let p;
        const u = t.params.loop ? Math.ceil((a - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
        if (
          (t.params.loop
            ? ((p = Math.ceil((t.activeIndex - t.loopedSlides) / t.params.slidesPerGroup)),
              p > a - 1 - 2 * t.loopedSlides && (p -= a - 2 * t.loopedSlides),
              p > u - 1 && (p -= u),
              p < 0 && "bullets" !== t.params.paginationType && (p = u + p))
            : (p = void 0 !== t.snapIndex ? t.snapIndex : t.activeIndex || 0),
          "bullets" === s.type && t.pagination.bullets && t.pagination.bullets.length > 0)
        ) {
          const a = t.pagination.bullets;
          let i, o, u;
          if (
            (s.dynamicBullets &&
              ((n = a.eq(0)[t.isHorizontal() ? "outerWidth" : "outerHeight"](!0)),
              r.css(t.isHorizontal() ? "width" : "height", n * (s.dynamicMainBullets + 4) + "px"),
              s.dynamicMainBullets > 1 &&
                void 0 !== t.previousIndex &&
                ((l += p - (t.previousIndex - t.loopedSlides || 0)), l > s.dynamicMainBullets - 1 ? (l = s.dynamicMainBullets - 1) : l < 0 && (l = 0)),
              (i = Math.max(p - l, 0)),
              (o = i + (Math.min(a.length, s.dynamicMainBullets) - 1)),
              (u = (o + i) / 2)),
            a.removeClass(["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((e) => `${s.bulletActiveClass}${e}`).join(" ")),
            r.length > 1)
          )
            a.each((e) => {
              const t = d(e),
                a = t.index();
              a === p && t.addClass(s.bulletActiveClass),
                s.dynamicBullets && (a >= i && a <= o && t.addClass(`${s.bulletActiveClass}-main`), a === i && c(t, "prev"), a === o && c(t, "next"));
            });
          else {
            const e = a.eq(p),
              r = e.index();
            if ((e.addClass(s.bulletActiveClass), s.dynamicBullets)) {
              const e = a.eq(i),
                n = a.eq(o);
              for (let e = i; e <= o; e += 1) a.eq(e).addClass(`${s.bulletActiveClass}-main`);
              if (t.params.loop)
                if (r >= a.length) {
                  for (let e = s.dynamicMainBullets; e >= 0; e -= 1) a.eq(a.length - e).addClass(`${s.bulletActiveClass}-main`);
                  a.eq(a.length - s.dynamicMainBullets - 1).addClass(`${s.bulletActiveClass}-prev`);
                } else c(e, "prev"), c(n, "next");
              else c(e, "prev"), c(n, "next");
            }
          }
          if (s.dynamicBullets) {
            const i = Math.min(a.length, s.dynamicMainBullets + 4),
              r = (n * i - n) / 2 - u * n,
              l = e ? "right" : "left";
            a.css(t.isHorizontal() ? l : "top", `${r}px`);
          }
        }
        if (
          ("fraction" === s.type && (r.find(U(s.currentClass)).text(s.formatFractionCurrent(p + 1)), r.find(U(s.totalClass)).text(s.formatFractionTotal(u))),
          "progressbar" === s.type)
        ) {
          let e;
          e = s.progressbarOpposite ? (t.isHorizontal() ? "vertical" : "horizontal") : t.isHorizontal() ? "horizontal" : "vertical";
          const a = (p + 1) / u;
          let i = 1,
            n = 1;
          "horizontal" === e ? (i = a) : (n = a),
            r.find(U(s.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${i}) scaleY(${n})`).transition(t.params.speed);
        }
        "custom" === s.type && s.renderCustom ? (r.html(s.renderCustom(t, p + 1, u)), i("paginationRender", r[0])) : i("paginationUpdate", r[0]),
          t.params.watchOverflow && t.enabled && r[t.isLocked ? "addClass" : "removeClass"](s.lockClass);
      }
      function u() {
        const e = t.params.pagination;
        if (o()) return;
        const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
          a = t.pagination.$el;
        let r = "";
        if ("bullets" === e.type) {
          let i = t.params.loop ? Math.ceil((s - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
          t.params.freeMode && t.params.freeMode.enabled && !t.params.loop && i > s && (i = s);
          for (let s = 0; s < i; s += 1)
            e.renderBullet ? (r += e.renderBullet.call(t, s, e.bulletClass)) : (r += `<${e.bulletElement} class="${e.bulletClass}"></${e.bulletElement}>`);
          a.html(r), (t.pagination.bullets = a.find(U(e.bulletClass)));
        }
        "fraction" === e.type &&
          ((r = e.renderFraction
            ? e.renderFraction.call(t, e.currentClass, e.totalClass)
            : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`),
          a.html(r)),
          "progressbar" === e.type &&
            ((r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`), a.html(r)),
          "custom" !== e.type && i("paginationRender", t.pagination.$el[0]);
      }
      function h() {
        t.params.pagination = F(t, t.originalParams.pagination, t.params.pagination, { el: "swiper-pagination" });
        const e = t.params.pagination;
        if (!e.el) return;
        let s = d(e.el);
        0 !== s.length &&
          (t.params.uniqueNavElements &&
            "string" == typeof e.el &&
            s.length > 1 &&
            ((s = t.$el.find(e.el)), s.length > 1 && (s = s.filter((e) => d(e).parents(".swiper")[0] === t.el))),
          "bullets" === e.type && e.clickable && s.addClass(e.clickableClass),
          s.addClass(e.modifierClass + e.type),
          s.addClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
          "bullets" === e.type &&
            e.dynamicBullets &&
            (s.addClass(`${e.modifierClass}${e.type}-dynamic`), (l = 0), e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)),
          "progressbar" === e.type && e.progressbarOpposite && s.addClass(e.progressbarOppositeClass),
          e.clickable &&
            s.on("click", U(e.bulletClass), function (e) {
              e.preventDefault();
              let s = d(this).index() * t.params.slidesPerGroup;
              t.params.loop && (s += t.loopedSlides), t.slideTo(s);
            }),
          Object.assign(t.pagination, { $el: s, el: s[0] }),
          t.enabled || s.addClass(e.lockClass));
      }
      function m() {
        const e = t.params.pagination;
        if (o()) return;
        const s = t.pagination.$el;
        s.removeClass(e.hiddenClass),
          s.removeClass(e.modifierClass + e.type),
          s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
          t.pagination.bullets && t.pagination.bullets.removeClass && t.pagination.bullets.removeClass(e.bulletActiveClass),
          e.clickable && s.off("click", U(e.bulletClass));
      }
      a("init", () => {
        !1 === t.params.pagination.enabled ? f() : (h(), u(), p());
      }),
        a("activeIndexChange", () => {
          (t.params.loop || void 0 === t.snapIndex) && p();
        }),
        a("snapIndexChange", () => {
          t.params.loop || p();
        }),
        a("slidesLengthChange", () => {
          t.params.loop && (u(), p());
        }),
        a("snapGridLengthChange", () => {
          t.params.loop || (u(), p());
        }),
        a("destroy", () => {
          m();
        }),
        a("enable disable", () => {
          const { $el: e } = t.pagination;
          e && e[t.enabled ? "removeClass" : "addClass"](t.params.pagination.lockClass);
        }),
        a("lock unlock", () => {
          p();
        }),
        a("click", (e, s) => {
          const a = s.target,
            { $el: r } = t.pagination;
          if (t.params.pagination.el && t.params.pagination.hideOnClick && r && r.length > 0 && !d(a).hasClass(t.params.pagination.bulletClass)) {
            if (t.navigation && ((t.navigation.nextEl && a === t.navigation.nextEl) || (t.navigation.prevEl && a === t.navigation.prevEl))) return;
            const e = r.hasClass(t.params.pagination.hiddenClass);
            i(!0 === e ? "paginationShow" : "paginationHide"), r.toggleClass(t.params.pagination.hiddenClass);
          }
        });
      const f = () => {
        t.$el.addClass(t.params.pagination.paginationDisabledClass),
          t.pagination.$el && t.pagination.$el.addClass(t.params.pagination.paginationDisabledClass),
          m();
      };
      Object.assign(t.pagination, {
        enable: () => {
          t.$el.removeClass(t.params.pagination.paginationDisabledClass),
            t.pagination.$el && t.pagination.$el.removeClass(t.params.pagination.paginationDisabledClass),
            h(),
            u(),
            p();
        },
        disable: f,
        render: u,
        update: p,
        init: h,
        destroy: m,
      });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: i, emit: r } = e;
      const n = a();
      let l,
        o,
        c,
        u,
        h = !1,
        m = null,
        f = null;
      function g() {
        if (!t.params.scrollbar.el || !t.scrollbar.el) return;
        const { scrollbar: e, rtlTranslate: s, progress: a } = t,
          { $dragEl: i, $el: r } = e,
          n = t.params.scrollbar;
        let l = o,
          d = (c - o) * a;
        s ? ((d = -d), d > 0 ? ((l = o - d), (d = 0)) : -d + o > c && (l = c + d)) : d < 0 ? ((l = o + d), (d = 0)) : d + o > c && (l = c - d),
          t.isHorizontal()
            ? (i.transform(`translate3d(${d}px, 0, 0)`), (i[0].style.width = `${l}px`))
            : (i.transform(`translate3d(0px, ${d}px, 0)`), (i[0].style.height = `${l}px`)),
          n.hide &&
            (clearTimeout(m),
            (r[0].style.opacity = 1),
            (m = setTimeout(() => {
              (r[0].style.opacity = 0), r.transition(400);
            }, 1e3)));
      }
      function v() {
        if (!t.params.scrollbar.el || !t.scrollbar.el) return;
        const { scrollbar: e } = t,
          { $dragEl: s, $el: a } = e;
        (s[0].style.width = ""),
          (s[0].style.height = ""),
          (c = t.isHorizontal() ? a[0].offsetWidth : a[0].offsetHeight),
          (u = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0))),
          (o = "auto" === t.params.scrollbar.dragSize ? c * u : parseInt(t.params.scrollbar.dragSize, 10)),
          t.isHorizontal() ? (s[0].style.width = `${o}px`) : (s[0].style.height = `${o}px`),
          (a[0].style.display = u >= 1 ? "none" : ""),
          t.params.scrollbar.hide && (a[0].style.opacity = 0),
          t.params.watchOverflow && t.enabled && e.$el[t.isLocked ? "addClass" : "removeClass"](t.params.scrollbar.lockClass);
      }
      function w(e) {
        return t.isHorizontal()
          ? "touchstart" === e.type || "touchmove" === e.type
            ? e.targetTouches[0].clientX
            : e.clientX
          : "touchstart" === e.type || "touchmove" === e.type
          ? e.targetTouches[0].clientY
          : e.clientY;
      }
      function b(e) {
        const { scrollbar: s, rtlTranslate: a } = t,
          { $el: i } = s;
        let r;
        (r = (w(e) - i.offset()[t.isHorizontal() ? "left" : "top"] - (null !== l ? l : o / 2)) / (c - o)), (r = Math.max(Math.min(r, 1), 0)), a && (r = 1 - r);
        const n = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * r;
        t.updateProgress(n), t.setTranslate(n), t.updateActiveIndex(), t.updateSlidesClasses();
      }
      function x(e) {
        const s = t.params.scrollbar,
          { scrollbar: a, $wrapperEl: i } = t,
          { $el: n, $dragEl: o } = a;
        (h = !0),
          (l = e.target === o[0] || e.target === o ? w(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null),
          e.preventDefault(),
          e.stopPropagation(),
          i.transition(100),
          o.transition(100),
          b(e),
          clearTimeout(f),
          n.transition(0),
          s.hide && n.css("opacity", 1),
          t.params.cssMode && t.$wrapperEl.css("scroll-snap-type", "none"),
          r("scrollbarDragStart", e);
      }
      function y(e) {
        const { scrollbar: s, $wrapperEl: a } = t,
          { $el: i, $dragEl: n } = s;
        h && (e.preventDefault ? e.preventDefault() : (e.returnValue = !1), b(e), a.transition(0), i.transition(0), n.transition(0), r("scrollbarDragMove", e));
      }
      function E(e) {
        const s = t.params.scrollbar,
          { scrollbar: a, $wrapperEl: i } = t,
          { $el: n } = a;
        h &&
          ((h = !1),
          t.params.cssMode && (t.$wrapperEl.css("scroll-snap-type", ""), i.transition("")),
          s.hide &&
            (clearTimeout(f),
            (f = p(() => {
              n.css("opacity", 0), n.transition(400);
            }, 1e3))),
          r("scrollbarDragEnd", e),
          s.snapOnRelease && t.slideToClosest());
      }
      function C(e) {
        const { scrollbar: s, touchEventsTouch: a, touchEventsDesktop: i, params: r, support: l } = t,
          o = s.$el;
        if (!o) return;
        const d = o[0],
          c = !(!l.passiveListener || !r.passiveListeners) && { passive: !1, capture: !1 },
          p = !(!l.passiveListener || !r.passiveListeners) && { passive: !0, capture: !1 };
        if (!d) return;
        const u = "on" === e ? "addEventListener" : "removeEventListener";
        l.touch ? (d[u](a.start, x, c), d[u](a.move, y, c), d[u](a.end, E, p)) : (d[u](i.start, x, c), n[u](i.move, y, c), n[u](i.end, E, p));
      }
      function T() {
        const { scrollbar: e, $el: s } = t;
        t.params.scrollbar = F(t, t.originalParams.scrollbar, t.params.scrollbar, { el: "swiper-scrollbar" });
        const a = t.params.scrollbar;
        if (!a.el) return;
        let i = d(a.el);
        t.params.uniqueNavElements && "string" == typeof a.el && i.length > 1 && 1 === s.find(a.el).length && (i = s.find(a.el)),
          i.addClass(t.isHorizontal() ? a.horizontalClass : a.verticalClass);
        let r = i.find(`.${t.params.scrollbar.dragClass}`);
        0 === r.length && ((r = d(`<div class="${t.params.scrollbar.dragClass}"></div>`)), i.append(r)),
          Object.assign(e, { $el: i, el: i[0], $dragEl: r, dragEl: r[0] }),
          a.draggable && t.params.scrollbar.el && t.scrollbar.el && C("on"),
          i && i[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass);
      }
      function $() {
        const e = t.params.scrollbar,
          s = t.scrollbar.$el;
        s && s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass), t.params.scrollbar.el && t.scrollbar.el && C("off");
      }
      s({
        scrollbar: {
          el: null,
          dragSize: "auto",
          hide: !1,
          draggable: !1,
          snapOnRelease: !0,
          lockClass: "swiper-scrollbar-lock",
          dragClass: "swiper-scrollbar-drag",
          scrollbarDisabledClass: "swiper-scrollbar-disabled",
          horizontalClass: "swiper-scrollbar-horizontal",
          verticalClass: "swiper-scrollbar-vertical",
        },
      }),
        (t.scrollbar = { el: null, dragEl: null, $el: null, $dragEl: null }),
        i("init", () => {
          !1 === t.params.scrollbar.enabled ? S() : (T(), v(), g());
        }),
        i("update resize observerUpdate lock unlock", () => {
          v();
        }),
        i("setTranslate", () => {
          g();
        }),
        i("setTransition", (e, s) => {
          !(function (e) {
            t.params.scrollbar.el && t.scrollbar.el && t.scrollbar.$dragEl.transition(e);
          })(s);
        }),
        i("enable disable", () => {
          const { $el: e } = t.scrollbar;
          e && e[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass);
        }),
        i("destroy", () => {
          $();
        });
      const S = () => {
        t.$el.addClass(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.$el && t.scrollbar.$el.addClass(t.params.scrollbar.scrollbarDisabledClass), $();
      };
      Object.assign(t.scrollbar, {
        enable: () => {
          t.$el.removeClass(t.params.scrollbar.scrollbarDisabledClass),
            t.scrollbar.$el && t.scrollbar.$el.removeClass(t.params.scrollbar.scrollbarDisabledClass),
            T(),
            v(),
            g();
        },
        disable: S,
        updateSize: v,
        setTranslate: g,
        init: T,
        destroy: $,
      });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ parallax: { enabled: !1 } });
      const i = (e, s) => {
          const { rtl: a } = t,
            i = d(e),
            r = a ? -1 : 1,
            n = i.attr("data-swiper-parallax") || "0";
          let l = i.attr("data-swiper-parallax-x"),
            o = i.attr("data-swiper-parallax-y");
          const c = i.attr("data-swiper-parallax-scale"),
            p = i.attr("data-swiper-parallax-opacity");
          if (
            (l || o ? ((l = l || "0"), (o = o || "0")) : t.isHorizontal() ? ((l = n), (o = "0")) : ((o = n), (l = "0")),
            (l = l.indexOf("%") >= 0 ? parseInt(l, 10) * s * r + "%" : l * s * r + "px"),
            (o = o.indexOf("%") >= 0 ? parseInt(o, 10) * s + "%" : o * s + "px"),
            null != p)
          ) {
            const e = p - (p - 1) * (1 - Math.abs(s));
            i[0].style.opacity = e;
          }
          if (null == c) i.transform(`translate3d(${l}, ${o}, 0px)`);
          else {
            const e = c - (c - 1) * (1 - Math.abs(s));
            i.transform(`translate3d(${l}, ${o}, 0px) scale(${e})`);
          }
        },
        r = () => {
          const { $el: e, slides: s, progress: a, snapGrid: r } = t;
          e
            .children(
              "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
            )
            .each((e) => {
              i(e, a);
            }),
            s.each((e, s) => {
              let n = e.progress;
              t.params.slidesPerGroup > 1 && "auto" !== t.params.slidesPerView && (n += Math.ceil(s / 2) - a * (r.length - 1)),
                (n = Math.min(Math.max(n, -1), 1)),
                d(e)
                  .find(
                    "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
                  )
                  .each((e) => {
                    i(e, n);
                  });
            });
        };
      a("beforeInit", () => {
        t.params.parallax.enabled && ((t.params.watchSlidesProgress = !0), (t.originalParams.watchSlidesProgress = !0));
      }),
        a("init", () => {
          t.params.parallax.enabled && r();
        }),
        a("setTranslate", () => {
          t.params.parallax.enabled && r();
        }),
        a("setTransition", (e, s) => {
          t.params.parallax.enabled &&
            (function (e) {
              void 0 === e && (e = t.params.speed);
              const { $el: s } = t;
              s.find(
                "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
              ).each((t) => {
                const s = d(t);
                let a = parseInt(s.attr("data-swiper-parallax-duration"), 10) || e;
                0 === e && (a = 0), s.transition(a);
              });
            })(s);
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a, emit: i } = e;
      const n = r();
      s({ zoom: { enabled: !1, maxRatio: 3, minRatio: 1, toggle: !0, containerClass: "swiper-zoom-container", zoomedSlideClass: "swiper-slide-zoomed" } }),
        (t.zoom = { enabled: !1 });
      let l,
        o,
        c,
        p = 1,
        u = !1;
      const m = { $slideEl: void 0, slideWidth: void 0, slideHeight: void 0, $imageEl: void 0, $imageWrapEl: void 0, maxRatio: 3 },
        f = {
          isTouched: void 0,
          isMoved: void 0,
          currentX: void 0,
          currentY: void 0,
          minX: void 0,
          minY: void 0,
          maxX: void 0,
          maxY: void 0,
          width: void 0,
          height: void 0,
          startX: void 0,
          startY: void 0,
          touchesStart: {},
          touchesCurrent: {},
        },
        g = { x: void 0, y: void 0, prevPositionX: void 0, prevPositionY: void 0, prevTime: void 0 };
      let v = 1;
      function w(e) {
        if (e.targetTouches.length < 2) return 1;
        const t = e.targetTouches[0].pageX,
          s = e.targetTouches[0].pageY,
          a = e.targetTouches[1].pageX,
          i = e.targetTouches[1].pageY;
        return Math.sqrt((a - t) ** 2 + (i - s) ** 2);
      }
      function b(e) {
        const s = t.support,
          a = t.params.zoom;
        if (((o = !1), (c = !1), !s.gestures)) {
          if ("touchstart" !== e.type || ("touchstart" === e.type && e.targetTouches.length < 2)) return;
          (o = !0), (m.scaleStart = w(e));
        }
        (m.$slideEl && m.$slideEl.length) ||
        ((m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`)),
        0 === m.$slideEl.length && (m.$slideEl = t.slides.eq(t.activeIndex)),
        (m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0)),
        (m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`)),
        (m.maxRatio = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio),
        0 !== m.$imageWrapEl.length)
          ? (m.$imageEl && m.$imageEl.transition(0), (u = !0))
          : (m.$imageEl = void 0);
      }
      function x(e) {
        const s = t.support,
          a = t.params.zoom,
          i = t.zoom;
        if (!s.gestures) {
          if ("touchmove" !== e.type || ("touchmove" === e.type && e.targetTouches.length < 2)) return;
          (c = !0), (m.scaleMove = w(e));
        }
        m.$imageEl && 0 !== m.$imageEl.length
          ? (s.gestures ? (i.scale = e.scale * p) : (i.scale = (m.scaleMove / m.scaleStart) * p),
            i.scale > m.maxRatio && (i.scale = m.maxRatio - 1 + (i.scale - m.maxRatio + 1) ** 0.5),
            i.scale < a.minRatio && (i.scale = a.minRatio + 1 - (a.minRatio - i.scale + 1) ** 0.5),
            m.$imageEl.transform(`translate3d(0,0,0) scale(${i.scale})`))
          : "gesturechange" === e.type && b(e);
      }
      function y(e) {
        const s = t.device,
          a = t.support,
          i = t.params.zoom,
          r = t.zoom;
        if (!a.gestures) {
          if (!o || !c) return;
          if ("touchend" !== e.type || ("touchend" === e.type && e.changedTouches.length < 2 && !s.android)) return;
          (o = !1), (c = !1);
        }
        m.$imageEl &&
          0 !== m.$imageEl.length &&
          ((r.scale = Math.max(Math.min(r.scale, m.maxRatio), i.minRatio)),
          m.$imageEl.transition(t.params.speed).transform(`translate3d(0,0,0) scale(${r.scale})`),
          (p = r.scale),
          (u = !1),
          1 === r.scale && (m.$slideEl = void 0));
      }
      function E(e) {
        const s = t.zoom;
        if (!m.$imageEl || 0 === m.$imageEl.length) return;
        if (((t.allowClick = !1), !f.isTouched || !m.$slideEl)) return;
        f.isMoved ||
          ((f.width = m.$imageEl[0].offsetWidth),
          (f.height = m.$imageEl[0].offsetHeight),
          (f.startX = h(m.$imageWrapEl[0], "x") || 0),
          (f.startY = h(m.$imageWrapEl[0], "y") || 0),
          (m.slideWidth = m.$slideEl[0].offsetWidth),
          (m.slideHeight = m.$slideEl[0].offsetHeight),
          m.$imageWrapEl.transition(0));
        const a = f.width * s.scale,
          i = f.height * s.scale;
        if (!(a < m.slideWidth && i < m.slideHeight)) {
          if (
            ((f.minX = Math.min(m.slideWidth / 2 - a / 2, 0)),
            (f.maxX = -f.minX),
            (f.minY = Math.min(m.slideHeight / 2 - i / 2, 0)),
            (f.maxY = -f.minY),
            (f.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX),
            (f.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY),
            !f.isMoved && !u)
          ) {
            if (
              t.isHorizontal() &&
              ((Math.floor(f.minX) === Math.floor(f.startX) && f.touchesCurrent.x < f.touchesStart.x) ||
                (Math.floor(f.maxX) === Math.floor(f.startX) && f.touchesCurrent.x > f.touchesStart.x))
            )
              return void (f.isTouched = !1);
            if (
              !t.isHorizontal() &&
              ((Math.floor(f.minY) === Math.floor(f.startY) && f.touchesCurrent.y < f.touchesStart.y) ||
                (Math.floor(f.maxY) === Math.floor(f.startY) && f.touchesCurrent.y > f.touchesStart.y))
            )
              return void (f.isTouched = !1);
          }
          e.cancelable && e.preventDefault(),
            e.stopPropagation(),
            (f.isMoved = !0),
            (f.currentX = f.touchesCurrent.x - f.touchesStart.x + f.startX),
            (f.currentY = f.touchesCurrent.y - f.touchesStart.y + f.startY),
            f.currentX < f.minX && (f.currentX = f.minX + 1 - (f.minX - f.currentX + 1) ** 0.8),
            f.currentX > f.maxX && (f.currentX = f.maxX - 1 + (f.currentX - f.maxX + 1) ** 0.8),
            f.currentY < f.minY && (f.currentY = f.minY + 1 - (f.minY - f.currentY + 1) ** 0.8),
            f.currentY > f.maxY && (f.currentY = f.maxY - 1 + (f.currentY - f.maxY + 1) ** 0.8),
            g.prevPositionX || (g.prevPositionX = f.touchesCurrent.x),
            g.prevPositionY || (g.prevPositionY = f.touchesCurrent.y),
            g.prevTime || (g.prevTime = Date.now()),
            (g.x = (f.touchesCurrent.x - g.prevPositionX) / (Date.now() - g.prevTime) / 2),
            (g.y = (f.touchesCurrent.y - g.prevPositionY) / (Date.now() - g.prevTime) / 2),
            Math.abs(f.touchesCurrent.x - g.prevPositionX) < 2 && (g.x = 0),
            Math.abs(f.touchesCurrent.y - g.prevPositionY) < 2 && (g.y = 0),
            (g.prevPositionX = f.touchesCurrent.x),
            (g.prevPositionY = f.touchesCurrent.y),
            (g.prevTime = Date.now()),
            m.$imageWrapEl.transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`);
        }
      }
      function C() {
        const e = t.zoom;
        m.$slideEl &&
          t.previousIndex !== t.activeIndex &&
          (m.$imageEl && m.$imageEl.transform("translate3d(0,0,0) scale(1)"),
          m.$imageWrapEl && m.$imageWrapEl.transform("translate3d(0,0,0)"),
          (e.scale = 1),
          (p = 1),
          (m.$slideEl = void 0),
          (m.$imageEl = void 0),
          (m.$imageWrapEl = void 0));
      }
      function T(e) {
        const s = t.zoom,
          a = t.params.zoom;
        if (
          (m.$slideEl ||
            (e && e.target && (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`)),
            m.$slideEl ||
              (t.params.virtual && t.params.virtual.enabled && t.virtual
                ? (m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`))
                : (m.$slideEl = t.slides.eq(t.activeIndex))),
            (m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0)),
            (m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`))),
          !m.$imageEl || 0 === m.$imageEl.length || !m.$imageWrapEl || 0 === m.$imageWrapEl.length)
        )
          return;
        let i, r, l, o, c, u, h, g, v, w, b, x, y, E, C, T, $, S;
        t.params.cssMode && ((t.wrapperEl.style.overflow = "hidden"), (t.wrapperEl.style.touchAction = "none")),
          m.$slideEl.addClass(`${a.zoomedSlideClass}`),
          void 0 === f.touchesStart.x && e
            ? ((i = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX), (r = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY))
            : ((i = f.touchesStart.x), (r = f.touchesStart.y)),
          (s.scale = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio),
          (p = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio),
          e
            ? (($ = m.$slideEl[0].offsetWidth),
              (S = m.$slideEl[0].offsetHeight),
              (l = m.$slideEl.offset().left + n.scrollX),
              (o = m.$slideEl.offset().top + n.scrollY),
              (c = l + $ / 2 - i),
              (u = o + S / 2 - r),
              (v = m.$imageEl[0].offsetWidth),
              (w = m.$imageEl[0].offsetHeight),
              (b = v * s.scale),
              (x = w * s.scale),
              (y = Math.min($ / 2 - b / 2, 0)),
              (E = Math.min(S / 2 - x / 2, 0)),
              (C = -y),
              (T = -E),
              (h = c * s.scale),
              (g = u * s.scale),
              h < y && (h = y),
              h > C && (h = C),
              g < E && (g = E),
              g > T && (g = T))
            : ((h = 0), (g = 0)),
          m.$imageWrapEl.transition(300).transform(`translate3d(${h}px, ${g}px,0)`),
          m.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${s.scale})`);
      }
      function $() {
        const e = t.zoom,
          s = t.params.zoom;
        m.$slideEl ||
          (t.params.virtual && t.params.virtual.enabled && t.virtual
            ? (m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`))
            : (m.$slideEl = t.slides.eq(t.activeIndex)),
          (m.$imageEl = m.$slideEl.find(`.${s.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0)),
          (m.$imageWrapEl = m.$imageEl.parent(`.${s.containerClass}`))),
          m.$imageEl &&
            0 !== m.$imageEl.length &&
            m.$imageWrapEl &&
            0 !== m.$imageWrapEl.length &&
            (t.params.cssMode && ((t.wrapperEl.style.overflow = ""), (t.wrapperEl.style.touchAction = "")),
            (e.scale = 1),
            (p = 1),
            m.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),
            m.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),
            m.$slideEl.removeClass(`${s.zoomedSlideClass}`),
            (m.$slideEl = void 0));
      }
      function S(e) {
        const s = t.zoom;
        s.scale && 1 !== s.scale ? $() : T(e);
      }
      function M() {
        const e = t.support;
        return {
          passiveListener: !("touchstart" !== t.touchEvents.start || !e.passiveListener || !t.params.passiveListeners) && { passive: !0, capture: !1 },
          activeListenerWithCapture: !e.passiveListener || { passive: !1, capture: !0 },
        };
      }
      function P() {
        return `.${t.params.slideClass}`;
      }
      function k(e) {
        const { passiveListener: s } = M(),
          a = P();
        t.$wrapperEl[e]("gesturestart", a, b, s), t.$wrapperEl[e]("gesturechange", a, x, s), t.$wrapperEl[e]("gestureend", a, y, s);
      }
      function z() {
        l || ((l = !0), k("on"));
      }
      function L() {
        l && ((l = !1), k("off"));
      }
      function O() {
        const e = t.zoom;
        if (e.enabled) return;
        e.enabled = !0;
        const s = t.support,
          { passiveListener: a, activeListenerWithCapture: i } = M(),
          r = P();
        s.gestures
          ? (t.$wrapperEl.on(t.touchEvents.start, z, a), t.$wrapperEl.on(t.touchEvents.end, L, a))
          : "touchstart" === t.touchEvents.start &&
            (t.$wrapperEl.on(t.touchEvents.start, r, b, a),
            t.$wrapperEl.on(t.touchEvents.move, r, x, i),
            t.$wrapperEl.on(t.touchEvents.end, r, y, a),
            t.touchEvents.cancel && t.$wrapperEl.on(t.touchEvents.cancel, r, y, a)),
          t.$wrapperEl.on(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i);
      }
      function I() {
        const e = t.zoom;
        if (!e.enabled) return;
        const s = t.support;
        e.enabled = !1;
        const { passiveListener: a, activeListenerWithCapture: i } = M(),
          r = P();
        s.gestures
          ? (t.$wrapperEl.off(t.touchEvents.start, z, a), t.$wrapperEl.off(t.touchEvents.end, L, a))
          : "touchstart" === t.touchEvents.start &&
            (t.$wrapperEl.off(t.touchEvents.start, r, b, a),
            t.$wrapperEl.off(t.touchEvents.move, r, x, i),
            t.$wrapperEl.off(t.touchEvents.end, r, y, a),
            t.touchEvents.cancel && t.$wrapperEl.off(t.touchEvents.cancel, r, y, a)),
          t.$wrapperEl.off(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i);
      }
      Object.defineProperty(t.zoom, "scale", {
        get: () => v,
        set(e) {
          if (v !== e) {
            const t = m.$imageEl ? m.$imageEl[0] : void 0,
              s = m.$slideEl ? m.$slideEl[0] : void 0;
            i("zoomChange", e, t, s);
          }
          v = e;
        },
      }),
        a("init", () => {
          t.params.zoom.enabled && O();
        }),
        a("destroy", () => {
          I();
        }),
        a("touchStart", (e, s) => {
          t.zoom.enabled &&
            (function (e) {
              const s = t.device;
              m.$imageEl &&
                0 !== m.$imageEl.length &&
                (f.isTouched ||
                  (s.android && e.cancelable && e.preventDefault(),
                  (f.isTouched = !0),
                  (f.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX),
                  (f.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY)));
            })(s);
        }),
        a("touchEnd", (e, s) => {
          t.zoom.enabled &&
            (function () {
              const e = t.zoom;
              if (!m.$imageEl || 0 === m.$imageEl.length) return;
              if (!f.isTouched || !f.isMoved) return (f.isTouched = !1), void (f.isMoved = !1);
              (f.isTouched = !1), (f.isMoved = !1);
              let s = 300,
                a = 300;
              const i = g.x * s,
                r = f.currentX + i,
                n = g.y * a,
                l = f.currentY + n;
              0 !== g.x && (s = Math.abs((r - f.currentX) / g.x)), 0 !== g.y && (a = Math.abs((l - f.currentY) / g.y));
              const o = Math.max(s, a);
              (f.currentX = r), (f.currentY = l);
              const d = f.width * e.scale,
                c = f.height * e.scale;
              (f.minX = Math.min(m.slideWidth / 2 - d / 2, 0)),
                (f.maxX = -f.minX),
                (f.minY = Math.min(m.slideHeight / 2 - c / 2, 0)),
                (f.maxY = -f.minY),
                (f.currentX = Math.max(Math.min(f.currentX, f.maxX), f.minX)),
                (f.currentY = Math.max(Math.min(f.currentY, f.maxY), f.minY)),
                m.$imageWrapEl.transition(o).transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`);
            })();
        }),
        a("doubleTap", (e, s) => {
          !t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && S(s);
        }),
        a("transitionEnd", () => {
          t.zoom.enabled && t.params.zoom.enabled && C();
        }),
        a("slideChange", () => {
          t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && C();
        }),
        Object.assign(t.zoom, { enable: O, disable: I, in: T, out: $, toggle: S });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a, emit: i } = e;
      s({
        lazy: {
          checkInView: !1,
          enabled: !1,
          loadPrevNext: !1,
          loadPrevNextAmount: 1,
          loadOnTransitionStart: !1,
          scrollingElement: "",
          elementClass: "swiper-lazy",
          loadingClass: "swiper-lazy-loading",
          loadedClass: "swiper-lazy-loaded",
          preloaderClass: "swiper-lazy-preloader",
        },
      }),
        (t.lazy = {});
      let n = !1,
        l = !1;
      function o(e, s) {
        void 0 === s && (s = !0);
        const a = t.params.lazy;
        if (void 0 === e) return;
        if (0 === t.slides.length) return;
        const r = t.virtual && t.params.virtual.enabled ? t.$wrapperEl.children(`.${t.params.slideClass}[data-swiper-slide-index="${e}"]`) : t.slides.eq(e),
          n = r.find(`.${a.elementClass}:not(.${a.loadedClass}):not(.${a.loadingClass})`);
        !r.hasClass(a.elementClass) || r.hasClass(a.loadedClass) || r.hasClass(a.loadingClass) || n.push(r[0]),
          0 !== n.length &&
            n.each((e) => {
              const n = d(e);
              n.addClass(a.loadingClass);
              const l = n.attr("data-background"),
                c = n.attr("data-src"),
                p = n.attr("data-srcset"),
                u = n.attr("data-sizes"),
                h = n.parent("picture");
              t.loadImage(n[0], c || l, p, u, !1, () => {
                if (null != t && t && (!t || t.params) && !t.destroyed) {
                  if (
                    (l
                      ? (n.css("background-image", `url("${l}")`), n.removeAttr("data-background"))
                      : (p && (n.attr("srcset", p), n.removeAttr("data-srcset")),
                        u && (n.attr("sizes", u), n.removeAttr("data-sizes")),
                        h.length &&
                          h.children("source").each((e) => {
                            const t = d(e);
                            t.attr("data-srcset") && (t.attr("srcset", t.attr("data-srcset")), t.removeAttr("data-srcset"));
                          }),
                        c && (n.attr("src", c), n.removeAttr("data-src"))),
                    n.addClass(a.loadedClass).removeClass(a.loadingClass),
                    r.find(`.${a.preloaderClass}`).remove(),
                    t.params.loop && s)
                  ) {
                    const e = r.attr("data-swiper-slide-index");
                    if (r.hasClass(t.params.slideDuplicateClass)) {
                      o(t.$wrapperEl.children(`[data-swiper-slide-index="${e}"]:not(.${t.params.slideDuplicateClass})`).index(), !1);
                    } else {
                      o(t.$wrapperEl.children(`.${t.params.slideDuplicateClass}[data-swiper-slide-index="${e}"]`).index(), !1);
                    }
                  }
                  i("lazyImageReady", r[0], n[0]), t.params.autoHeight && t.updateAutoHeight();
                }
              }),
                i("lazyImageLoad", r[0], n[0]);
            });
      }
      function c() {
        const { $wrapperEl: e, params: s, slides: a, activeIndex: i } = t,
          r = t.virtual && s.virtual.enabled,
          n = s.lazy;
        let c = s.slidesPerView;
        function p(t) {
          if (r) {
            if (e.children(`.${s.slideClass}[data-swiper-slide-index="${t}"]`).length) return !0;
          } else if (a[t]) return !0;
          return !1;
        }
        function u(e) {
          return r ? d(e).attr("data-swiper-slide-index") : d(e).index();
        }
        if (("auto" === c && (c = 0), l || (l = !0), t.params.watchSlidesProgress))
          e.children(`.${s.slideVisibleClass}`).each((e) => {
            o(r ? d(e).attr("data-swiper-slide-index") : d(e).index());
          });
        else if (c > 1) for (let e = i; e < i + c; e += 1) p(e) && o(e);
        else o(i);
        if (n.loadPrevNext)
          if (c > 1 || (n.loadPrevNextAmount && n.loadPrevNextAmount > 1)) {
            const e = n.loadPrevNextAmount,
              t = Math.ceil(c),
              s = Math.min(i + t + Math.max(e, t), a.length),
              r = Math.max(i - Math.max(t, e), 0);
            for (let e = i + t; e < s; e += 1) p(e) && o(e);
            for (let e = r; e < i; e += 1) p(e) && o(e);
          } else {
            const t = e.children(`.${s.slideNextClass}`);
            t.length > 0 && o(u(t));
            const a = e.children(`.${s.slidePrevClass}`);
            a.length > 0 && o(u(a));
          }
      }
      function p() {
        const e = r();
        if (!t || t.destroyed) return;
        const s = t.params.lazy.scrollingElement ? d(t.params.lazy.scrollingElement) : d(e),
          a = s[0] === e,
          i = a ? e.innerWidth : s[0].offsetWidth,
          l = a ? e.innerHeight : s[0].offsetHeight,
          o = t.$el.offset(),
          { rtlTranslate: u } = t;
        let h = !1;
        u && (o.left -= t.$el[0].scrollLeft);
        const m = [
          [o.left, o.top],
          [o.left + t.width, o.top],
          [o.left, o.top + t.height],
          [o.left + t.width, o.top + t.height],
        ];
        for (let e = 0; e < m.length; e += 1) {
          const t = m[e];
          if (t[0] >= 0 && t[0] <= i && t[1] >= 0 && t[1] <= l) {
            if (0 === t[0] && 0 === t[1]) continue;
            h = !0;
          }
        }
        const f = !("touchstart" !== t.touchEvents.start || !t.support.passiveListener || !t.params.passiveListeners) && { passive: !0, capture: !1 };
        h ? (c(), s.off("scroll", p, f)) : n || ((n = !0), s.on("scroll", p, f));
      }
      a("beforeInit", () => {
        t.params.lazy.enabled && t.params.preloadImages && (t.params.preloadImages = !1);
      }),
        a("init", () => {
          t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c());
        }),
        a("scroll", () => {
          t.params.freeMode && t.params.freeMode.enabled && !t.params.freeMode.sticky && c();
        }),
        a("scrollbarDragMove resize _freeModeNoMomentumRelease", () => {
          t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c());
        }),
        a("transitionStart", () => {
          t.params.lazy.enabled &&
            (t.params.lazy.loadOnTransitionStart || (!t.params.lazy.loadOnTransitionStart && !l)) &&
            (t.params.lazy.checkInView ? p() : c());
        }),
        a("transitionEnd", () => {
          t.params.lazy.enabled && !t.params.lazy.loadOnTransitionStart && (t.params.lazy.checkInView ? p() : c());
        }),
        a("slideChange", () => {
          const { lazy: e, cssMode: s, watchSlidesProgress: a, touchReleaseOnEdges: i, resistanceRatio: r } = t.params;
          e.enabled && (s || (a && (i || 0 === r))) && c();
        }),
        a("destroy", () => {
          t.$el && t.$el.find(`.${t.params.lazy.loadingClass}`).removeClass(t.params.lazy.loadingClass);
        }),
        Object.assign(t.lazy, { load: c, loadInSlide: o });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      function i(e, t) {
        const s = (function () {
          let e, t, s;
          return (a, i) => {
            for (t = -1, e = a.length; e - t > 1; ) (s = (e + t) >> 1), a[s] <= i ? (t = s) : (e = s);
            return e;
          };
        })();
        let a, i;
        return (
          (this.x = e),
          (this.y = t),
          (this.lastIndex = e.length - 1),
          (this.interpolate = function (e) {
            return e ? ((i = s(this.x, e)), (a = i - 1), ((e - this.x[a]) * (this.y[i] - this.y[a])) / (this.x[i] - this.x[a]) + this.y[a]) : 0;
          }),
          this
        );
      }
      function r() {
        t.controller.control && t.controller.spline && ((t.controller.spline = void 0), delete t.controller.spline);
      }
      s({ controller: { control: void 0, inverse: !1, by: "slide" } }),
        (t.controller = { control: void 0 }),
        a("beforeInit", () => {
          t.controller.control = t.params.controller.control;
        }),
        a("update", () => {
          r();
        }),
        a("resize", () => {
          r();
        }),
        a("observerUpdate", () => {
          r();
        }),
        a("setTranslate", (e, s, a) => {
          t.controller.control && t.controller.setTranslate(s, a);
        }),
        a("setTransition", (e, s, a) => {
          t.controller.control && t.controller.setTransition(s, a);
        }),
        Object.assign(t.controller, {
          setTranslate: function (e, s) {
            const a = t.controller.control;
            let r, n;
            const l = t.constructor;
            function o(e) {
              const s = t.rtlTranslate ? -t.translate : t.translate;
              "slide" === t.params.controller.by &&
                (!(function (e) {
                  t.controller.spline || (t.controller.spline = t.params.loop ? new i(t.slidesGrid, e.slidesGrid) : new i(t.snapGrid, e.snapGrid));
                })(e),
                (n = -t.controller.spline.interpolate(-s))),
                (n && "container" !== t.params.controller.by) ||
                  ((r = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate())), (n = (s - t.minTranslate()) * r + e.minTranslate())),
                t.params.controller.inverse && (n = e.maxTranslate() - n),
                e.updateProgress(n),
                e.setTranslate(n, t),
                e.updateActiveIndex(),
                e.updateSlidesClasses();
            }
            if (Array.isArray(a)) for (let e = 0; e < a.length; e += 1) a[e] !== s && a[e] instanceof l && o(a[e]);
            else a instanceof l && s !== a && o(a);
          },
          setTransition: function (e, s) {
            const a = t.constructor,
              i = t.controller.control;
            let r;
            function n(s) {
              s.setTransition(e, t),
                0 !== e &&
                  (s.transitionStart(),
                  s.params.autoHeight &&
                    p(() => {
                      s.updateAutoHeight();
                    }),
                  s.$wrapperEl.transitionEnd(() => {
                    i && (s.params.loop && "slide" === t.params.controller.by && s.loopFix(), s.transitionEnd());
                  }));
            }
            if (Array.isArray(i)) for (r = 0; r < i.length; r += 1) i[r] !== s && i[r] instanceof a && n(i[r]);
            else i instanceof a && s !== i && n(i);
          },
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({
        a11y: {
          enabled: !0,
          notificationClass: "swiper-notification",
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          firstSlideMessage: "This is the first slide",
          lastSlideMessage: "This is the last slide",
          paginationBulletMessage: "Go to slide {{index}}",
          slideLabelMessage: "{{index}} / {{slidesLength}}",
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null,
          slideRole: "group",
          id: null,
        },
      });
      let i = null;
      function r(e) {
        const t = i;
        0 !== t.length && (t.html(""), t.html(e));
      }
      function n(e) {
        e.attr("tabIndex", "0");
      }
      function l(e) {
        e.attr("tabIndex", "-1");
      }
      function o(e, t) {
        e.attr("role", t);
      }
      function c(e, t) {
        e.attr("aria-roledescription", t);
      }
      function p(e, t) {
        e.attr("aria-label", t);
      }
      function u(e) {
        e.attr("aria-disabled", !0);
      }
      function h(e) {
        e.attr("aria-disabled", !1);
      }
      function m(e) {
        if (13 !== e.keyCode && 32 !== e.keyCode) return;
        const s = t.params.a11y,
          a = d(e.target);
        t.navigation &&
          t.navigation.$nextEl &&
          a.is(t.navigation.$nextEl) &&
          ((t.isEnd && !t.params.loop) || t.slideNext(), t.isEnd ? r(s.lastSlideMessage) : r(s.nextSlideMessage)),
          t.navigation &&
            t.navigation.$prevEl &&
            a.is(t.navigation.$prevEl) &&
            ((t.isBeginning && !t.params.loop) || t.slidePrev(), t.isBeginning ? r(s.firstSlideMessage) : r(s.prevSlideMessage)),
          t.pagination && a.is(U(t.params.pagination.bulletClass)) && a[0].click();
      }
      function f() {
        return t.pagination && t.pagination.bullets && t.pagination.bullets.length;
      }
      function g() {
        return f() && t.params.pagination.clickable;
      }
      const v = (e, t, s) => {
          n(e),
            "BUTTON" !== e[0].tagName && (o(e, "button"), e.on("keydown", m)),
            p(e, s),
            (function (e, t) {
              e.attr("aria-controls", t);
            })(e, t);
        },
        w = (e) => {
          const s = e.target.closest(`.${t.params.slideClass}`);
          if (!s || !t.slides.includes(s)) return;
          const a = t.slides.indexOf(s) === t.activeIndex,
            i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(s);
          a || i || (t.isHorizontal() ? (t.el.scrollLeft = 0) : (t.el.scrollTop = 0), t.slideTo(t.slides.indexOf(s), 0));
        },
        b = () => {
          const e = t.params.a11y;
          e.itemRoleDescriptionMessage && c(d(t.slides), e.itemRoleDescriptionMessage), e.slideRole && o(d(t.slides), e.slideRole);
          const s = t.params.loop ? t.slides.filter((e) => !e.classList.contains(t.params.slideDuplicateClass)).length : t.slides.length;
          e.slideLabelMessage &&
            t.slides.each((a, i) => {
              const r = d(a),
                n = t.params.loop ? parseInt(r.attr("data-swiper-slide-index"), 10) : i;
              p(r, e.slideLabelMessage.replace(/\{\{index\}\}/, n + 1).replace(/\{\{slidesLength\}\}/, s));
            });
        },
        x = () => {
          const e = t.params.a11y;
          t.$el.append(i);
          const s = t.$el;
          e.containerRoleDescriptionMessage && c(s, e.containerRoleDescriptionMessage), e.containerMessage && p(s, e.containerMessage);
          const a = t.$wrapperEl,
            r =
              e.id ||
              a.attr("id") ||
              `swiper-wrapper-${((n = 16), void 0 === n && (n = 16), "x".repeat(n).replace(/x/g, () => Math.round(16 * Math.random()).toString(16)))}`;
          var n;
          const l = t.params.autoplay && t.params.autoplay.enabled ? "off" : "polite";
          var o;
          let d, u;
          (o = r),
            a.attr("id", o),
            (function (e, t) {
              e.attr("aria-live", t);
            })(a, l),
            b(),
            t.navigation && t.navigation.$nextEl && (d = t.navigation.$nextEl),
            t.navigation && t.navigation.$prevEl && (u = t.navigation.$prevEl),
            d && d.length && v(d, r, e.nextSlideMessage),
            u && u.length && v(u, r, e.prevSlideMessage),
            g() && t.pagination.$el.on("keydown", U(t.params.pagination.bulletClass), m),
            t.$el.on("focus", w, !0);
        };
      a("beforeInit", () => {
        i = d(`<span class="${t.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
      }),
        a("afterInit", () => {
          t.params.a11y.enabled && x();
        }),
        a("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
          t.params.a11y.enabled && b();
        }),
        a("fromEdge toEdge afterInit lock unlock", () => {
          t.params.a11y.enabled &&
            (function () {
              if (t.params.loop || t.params.rewind || !t.navigation) return;
              const { $nextEl: e, $prevEl: s } = t.navigation;
              s && s.length > 0 && (t.isBeginning ? (u(s), l(s)) : (h(s), n(s))), e && e.length > 0 && (t.isEnd ? (u(e), l(e)) : (h(e), n(e)));
            })();
        }),
        a("paginationUpdate", () => {
          t.params.a11y.enabled &&
            (function () {
              const e = t.params.a11y;
              f() &&
                t.pagination.bullets.each((s) => {
                  const a = d(s);
                  t.params.pagination.clickable &&
                    (n(a), t.params.pagination.renderBullet || (o(a, "button"), p(a, e.paginationBulletMessage.replace(/\{\{index\}\}/, a.index() + 1)))),
                    a.is(`.${t.params.pagination.bulletActiveClass}`) ? a.attr("aria-current", "true") : a.removeAttr("aria-current");
                });
            })();
        }),
        a("destroy", () => {
          t.params.a11y.enabled &&
            (function () {
              let e, s;
              i && i.length > 0 && i.remove(),
                t.navigation && t.navigation.$nextEl && (e = t.navigation.$nextEl),
                t.navigation && t.navigation.$prevEl && (s = t.navigation.$prevEl),
                e && e.off("keydown", m),
                s && s.off("keydown", m),
                g() && t.pagination.$el.off("keydown", U(t.params.pagination.bulletClass), m),
                t.$el.off("focus", w, !0);
            })();
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ history: { enabled: !1, root: "", replaceState: !1, key: "slides", keepQuery: !1 } });
      let i = !1,
        n = {};
      const l = (e) =>
          e
            .toString()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, ""),
        o = (e) => {
          const t = r();
          let s;
          s = e ? new URL(e) : t.location;
          const a = s.pathname
              .slice(1)
              .split("/")
              .filter((e) => "" !== e),
            i = a.length;
          return { key: a[i - 2], value: a[i - 1] };
        },
        d = (e, s) => {
          const a = r();
          if (!i || !t.params.history.enabled) return;
          let n;
          n = t.params.url ? new URL(t.params.url) : a.location;
          const o = t.slides.eq(s);
          let d = l(o.attr("data-history"));
          if (t.params.history.root.length > 0) {
            let s = t.params.history.root;
            "/" === s[s.length - 1] && (s = s.slice(0, s.length - 1)), (d = `${s}/${e}/${d}`);
          } else n.pathname.includes(e) || (d = `${e}/${d}`);
          t.params.history.keepQuery && (d += n.search);
          const c = a.history.state;
          (c && c.value === d) || (t.params.history.replaceState ? a.history.replaceState({ value: d }, null, d) : a.history.pushState({ value: d }, null, d));
        },
        c = (e, s, a) => {
          if (s)
            for (let i = 0, r = t.slides.length; i < r; i += 1) {
              const r = t.slides.eq(i);
              if (l(r.attr("data-history")) === s && !r.hasClass(t.params.slideDuplicateClass)) {
                const s = r.index();
                t.slideTo(s, e, a);
              }
            }
          else t.slideTo(0, e, a);
        },
        p = () => {
          (n = o(t.params.url)), c(t.params.speed, n.value, !1);
        };
      a("init", () => {
        t.params.history.enabled &&
          (() => {
            const e = r();
            if (t.params.history) {
              if (!e.history || !e.history.pushState) return (t.params.history.enabled = !1), void (t.params.hashNavigation.enabled = !0);
              (i = !0),
                (n = o(t.params.url)),
                (n.key || n.value) && (c(0, n.value, t.params.runCallbacksOnInit), t.params.history.replaceState || e.addEventListener("popstate", p));
            }
          })();
      }),
        a("destroy", () => {
          t.params.history.enabled &&
            (() => {
              const e = r();
              t.params.history.replaceState || e.removeEventListener("popstate", p);
            })();
        }),
        a("transitionEnd _freeModeNoMomentumRelease", () => {
          i && d(t.params.history.key, t.activeIndex);
        }),
        a("slideChange", () => {
          i && t.params.cssMode && d(t.params.history.key, t.activeIndex);
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, emit: i, on: n } = e,
        l = !1;
      const o = a(),
        c = r();
      s({ hashNavigation: { enabled: !1, replaceState: !1, watchState: !1 } });
      const p = () => {
          i("hashChange");
          const e = o.location.hash.replace("#", "");
          if (e !== t.slides.eq(t.activeIndex).attr("data-hash")) {
            const s = t.$wrapperEl.children(`.${t.params.slideClass}[data-hash="${e}"]`).index();
            if (void 0 === s) return;
            t.slideTo(s);
          }
        },
        u = () => {
          if (l && t.params.hashNavigation.enabled)
            if (t.params.hashNavigation.replaceState && c.history && c.history.replaceState)
              c.history.replaceState(null, null, `#${t.slides.eq(t.activeIndex).attr("data-hash")}` || ""), i("hashSet");
            else {
              const e = t.slides.eq(t.activeIndex),
                s = e.attr("data-hash") || e.attr("data-history");
              (o.location.hash = s || ""), i("hashSet");
            }
        };
      n("init", () => {
        t.params.hashNavigation.enabled &&
          (() => {
            if (!t.params.hashNavigation.enabled || (t.params.history && t.params.history.enabled)) return;
            l = !0;
            const e = o.location.hash.replace("#", "");
            if (e) {
              const s = 0;
              for (let a = 0, i = t.slides.length; a < i; a += 1) {
                const i = t.slides.eq(a);
                if ((i.attr("data-hash") || i.attr("data-history")) === e && !i.hasClass(t.params.slideDuplicateClass)) {
                  const e = i.index();
                  t.slideTo(e, s, t.params.runCallbacksOnInit, !0);
                }
              }
            }
            t.params.hashNavigation.watchState && d(c).on("hashchange", p);
          })();
      }),
        n("destroy", () => {
          t.params.hashNavigation.enabled && t.params.hashNavigation.watchState && d(c).off("hashchange", p);
        }),
        n("transitionEnd _freeModeNoMomentumRelease", () => {
          l && u();
        }),
        n("slideChange", () => {
          l && t.params.cssMode && u();
        });
    },
    function (e) {
      let t,
        { swiper: s, extendParams: i, on: r, emit: n } = e;
      function l() {
        if (!s.size) return (s.autoplay.running = !1), void (s.autoplay.paused = !1);
        const e = s.slides.eq(s.activeIndex);
        let a = s.params.autoplay.delay;
        e.attr("data-swiper-autoplay") && (a = e.attr("data-swiper-autoplay") || s.params.autoplay.delay),
          clearTimeout(t),
          (t = p(() => {
            let e;
            s.params.autoplay.reverseDirection
              ? s.params.loop
                ? (s.loopFix(), (e = s.slidePrev(s.params.speed, !0, !0)), n("autoplay"))
                : s.isBeginning
                ? s.params.autoplay.stopOnLastSlide
                  ? d()
                  : ((e = s.slideTo(s.slides.length - 1, s.params.speed, !0, !0)), n("autoplay"))
                : ((e = s.slidePrev(s.params.speed, !0, !0)), n("autoplay"))
              : s.params.loop
              ? (s.loopFix(), (e = s.slideNext(s.params.speed, !0, !0)), n("autoplay"))
              : s.isEnd
              ? s.params.autoplay.stopOnLastSlide
                ? d()
                : ((e = s.slideTo(0, s.params.speed, !0, !0)), n("autoplay"))
              : ((e = s.slideNext(s.params.speed, !0, !0)), n("autoplay")),
              ((s.params.cssMode && s.autoplay.running) || !1 === e) && l();
          }, a));
      }
      function o() {
        return void 0 === t && !s.autoplay.running && ((s.autoplay.running = !0), n("autoplayStart"), l(), !0);
      }
      function d() {
        return !!s.autoplay.running && void 0 !== t && (t && (clearTimeout(t), (t = void 0)), (s.autoplay.running = !1), n("autoplayStop"), !0);
      }
      function c(e) {
        s.autoplay.running &&
          (s.autoplay.paused ||
            (t && clearTimeout(t),
            (s.autoplay.paused = !0),
            0 !== e && s.params.autoplay.waitForTransition
              ? ["transitionend", "webkitTransitionEnd"].forEach((e) => {
                  s.$wrapperEl[0].addEventListener(e, h);
                })
              : ((s.autoplay.paused = !1), l())));
      }
      function u() {
        const e = a();
        "hidden" === e.visibilityState && s.autoplay.running && c(), "visible" === e.visibilityState && s.autoplay.paused && (l(), (s.autoplay.paused = !1));
      }
      function h(e) {
        s &&
          !s.destroyed &&
          s.$wrapperEl &&
          e.target === s.$wrapperEl[0] &&
          (["transitionend", "webkitTransitionEnd"].forEach((e) => {
            s.$wrapperEl[0].removeEventListener(e, h);
          }),
          (s.autoplay.paused = !1),
          s.autoplay.running ? l() : d());
      }
      function m() {
        s.params.autoplay.disableOnInteraction ? d() : (n("autoplayPause"), c()),
          ["transitionend", "webkitTransitionEnd"].forEach((e) => {
            s.$wrapperEl[0].removeEventListener(e, h);
          });
      }
      function f() {
        s.params.autoplay.disableOnInteraction || ((s.autoplay.paused = !1), n("autoplayResume"), l());
      }
      (s.autoplay = { running: !1, paused: !1 }),
        i({
          autoplay: {
            enabled: !1,
            delay: 3e3,
            waitForTransition: !0,
            disableOnInteraction: !0,
            stopOnLastSlide: !1,
            reverseDirection: !1,
            pauseOnMouseEnter: !1,
          },
        }),
        r("init", () => {
          if (s.params.autoplay.enabled) {
            o();
            a().addEventListener("visibilitychange", u), s.params.autoplay.pauseOnMouseEnter && (s.$el.on("mouseenter", m), s.$el.on("mouseleave", f));
          }
        }),
        r("beforeTransitionStart", (e, t, a) => {
          s.autoplay.running && (a || !s.params.autoplay.disableOnInteraction ? s.autoplay.pause(t) : d());
        }),
        r("sliderFirstMove", () => {
          s.autoplay.running && (s.params.autoplay.disableOnInteraction ? d() : c());
        }),
        r("touchEnd", () => {
          s.params.cssMode && s.autoplay.paused && !s.params.autoplay.disableOnInteraction && l();
        }),
        r("destroy", () => {
          s.$el.off("mouseenter", m), s.$el.off("mouseleave", f), s.autoplay.running && d();
          a().removeEventListener("visibilitychange", u);
        }),
        Object.assign(s.autoplay, { pause: c, run: l, start: o, stop: d });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({
        thumbs: {
          swiper: null,
          multipleActiveThumbs: !0,
          autoScrollOffset: 0,
          slideThumbActiveClass: "swiper-slide-thumb-active",
          thumbsContainerClass: "swiper-thumbs",
        },
      });
      let i = !1,
        r = !1;
      function n() {
        const e = t.thumbs.swiper;
        if (!e || e.destroyed) return;
        const s = e.clickedIndex,
          a = e.clickedSlide;
        if (a && d(a).hasClass(t.params.thumbs.slideThumbActiveClass)) return;
        if (null == s) return;
        let i;
        if (((i = e.params.loop ? parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10) : s), t.params.loop)) {
          let e = t.activeIndex;
          t.slides.eq(e).hasClass(t.params.slideDuplicateClass) && (t.loopFix(), (t._clientLeft = t.$wrapperEl[0].clientLeft), (e = t.activeIndex));
          const s = t.slides.eq(e).prevAll(`[data-swiper-slide-index="${i}"]`).eq(0).index(),
            a = t.slides.eq(e).nextAll(`[data-swiper-slide-index="${i}"]`).eq(0).index();
          i = void 0 === s ? a : void 0 === a ? s : a - e < e - s ? a : s;
        }
        t.slideTo(i);
      }
      function l() {
        const { thumbs: e } = t.params;
        if (i) return !1;
        i = !0;
        const s = t.constructor;
        if (e.swiper instanceof s)
          (t.thumbs.swiper = e.swiper),
            Object.assign(t.thumbs.swiper.originalParams, { watchSlidesProgress: !0, slideToClickedSlide: !1 }),
            Object.assign(t.thumbs.swiper.params, { watchSlidesProgress: !0, slideToClickedSlide: !1 });
        else if (m(e.swiper)) {
          const a = Object.assign({}, e.swiper);
          Object.assign(a, { watchSlidesProgress: !0, slideToClickedSlide: !1 }), (t.thumbs.swiper = new s(a)), (r = !0);
        }
        return t.thumbs.swiper.$el.addClass(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on("tap", n), !0;
      }
      function o(e) {
        const s = t.thumbs.swiper;
        if (!s || s.destroyed) return;
        const a = "auto" === s.params.slidesPerView ? s.slidesPerViewDynamic() : s.params.slidesPerView;
        let i = 1;
        const r = t.params.thumbs.slideThumbActiveClass;
        if (
          (t.params.slidesPerView > 1 && !t.params.centeredSlides && (i = t.params.slidesPerView),
          t.params.thumbs.multipleActiveThumbs || (i = 1),
          (i = Math.floor(i)),
          s.slides.removeClass(r),
          s.params.loop || (s.params.virtual && s.params.virtual.enabled))
        )
          for (let e = 0; e < i; e += 1) s.$wrapperEl.children(`[data-swiper-slide-index="${t.realIndex + e}"]`).addClass(r);
        else for (let e = 0; e < i; e += 1) s.slides.eq(t.realIndex + e).addClass(r);
        const n = t.params.thumbs.autoScrollOffset,
          l = n && !s.params.loop;
        if (t.realIndex !== s.realIndex || l) {
          let i,
            r,
            o = s.activeIndex;
          if (s.params.loop) {
            s.slides.eq(o).hasClass(s.params.slideDuplicateClass) && (s.loopFix(), (s._clientLeft = s.$wrapperEl[0].clientLeft), (o = s.activeIndex));
            const e = s.slides.eq(o).prevAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index(),
              a = s.slides.eq(o).nextAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index();
            (i = void 0 === e ? a : void 0 === a ? e : a - o == o - e ? (s.params.slidesPerGroup > 1 ? a : o) : a - o < o - e ? a : e),
              (r = t.activeIndex > t.previousIndex ? "next" : "prev");
          } else (i = t.realIndex), (r = i > t.previousIndex ? "next" : "prev");
          l && (i += "next" === r ? n : -1 * n),
            s.visibleSlidesIndexes &&
              s.visibleSlidesIndexes.indexOf(i) < 0 &&
              (s.params.centeredSlides ? (i = i > o ? i - Math.floor(a / 2) + 1 : i + Math.floor(a / 2) - 1) : i > o && s.params.slidesPerGroup,
              s.slideTo(i, e ? 0 : void 0));
        }
      }
      (t.thumbs = { swiper: null }),
        a("beforeInit", () => {
          const { thumbs: e } = t.params;
          e && e.swiper && (l(), o(!0));
        }),
        a("slideChange update resize observerUpdate", () => {
          o();
        }),
        a("setTransition", (e, s) => {
          const a = t.thumbs.swiper;
          a && !a.destroyed && a.setTransition(s);
        }),
        a("beforeDestroy", () => {
          const e = t.thumbs.swiper;
          e && !e.destroyed && r && e.destroy();
        }),
        Object.assign(t.thumbs, { init: l, update: o });
    },
    function (e) {
      let { swiper: t, extendParams: s, emit: a, once: i } = e;
      s({
        freeMode: {
          enabled: !1,
          momentum: !0,
          momentumRatio: 1,
          momentumBounce: !0,
          momentumBounceRatio: 1,
          momentumVelocityRatio: 1,
          sticky: !1,
          minimumVelocity: 0.02,
        },
      }),
        Object.assign(t, {
          freeMode: {
            onTouchStart: function () {
              const e = t.getTranslate();
              t.setTranslate(e),
                t.setTransition(0),
                (t.touchEventsData.velocities.length = 0),
                t.freeMode.onTouchEnd({ currentPos: t.rtl ? t.translate : -t.translate });
            },
            onTouchMove: function () {
              const { touchEventsData: e, touches: s } = t;
              0 === e.velocities.length && e.velocities.push({ position: s[t.isHorizontal() ? "startX" : "startY"], time: e.touchStartTime }),
                e.velocities.push({ position: s[t.isHorizontal() ? "currentX" : "currentY"], time: u() });
            },
            onTouchEnd: function (e) {
              let { currentPos: s } = e;
              const { params: r, $wrapperEl: n, rtlTranslate: l, snapGrid: o, touchEventsData: d } = t,
                c = u() - d.touchStartTime;
              if (s < -t.minTranslate()) t.slideTo(t.activeIndex);
              else if (s > -t.maxTranslate()) t.slides.length < o.length ? t.slideTo(o.length - 1) : t.slideTo(t.slides.length - 1);
              else {
                if (r.freeMode.momentum) {
                  if (d.velocities.length > 1) {
                    const e = d.velocities.pop(),
                      s = d.velocities.pop(),
                      a = e.position - s.position,
                      i = e.time - s.time;
                    (t.velocity = a / i),
                      (t.velocity /= 2),
                      Math.abs(t.velocity) < r.freeMode.minimumVelocity && (t.velocity = 0),
                      (i > 150 || u() - e.time > 300) && (t.velocity = 0);
                  } else t.velocity = 0;
                  (t.velocity *= r.freeMode.momentumVelocityRatio), (d.velocities.length = 0);
                  let e = 1e3 * r.freeMode.momentumRatio;
                  const s = t.velocity * e;
                  let c = t.translate + s;
                  l && (c = -c);
                  let p,
                    h = !1;
                  const m = 20 * Math.abs(t.velocity) * r.freeMode.momentumBounceRatio;
                  let f;
                  if (c < t.maxTranslate())
                    r.freeMode.momentumBounce
                      ? (c + t.maxTranslate() < -m && (c = t.maxTranslate() - m), (p = t.maxTranslate()), (h = !0), (d.allowMomentumBounce = !0))
                      : (c = t.maxTranslate()),
                      r.loop && r.centeredSlides && (f = !0);
                  else if (c > t.minTranslate())
                    r.freeMode.momentumBounce
                      ? (c - t.minTranslate() > m && (c = t.minTranslate() + m), (p = t.minTranslate()), (h = !0), (d.allowMomentumBounce = !0))
                      : (c = t.minTranslate()),
                      r.loop && r.centeredSlides && (f = !0);
                  else if (r.freeMode.sticky) {
                    let e;
                    for (let t = 0; t < o.length; t += 1)
                      if (o[t] > -c) {
                        e = t;
                        break;
                      }
                    (c = Math.abs(o[e] - c) < Math.abs(o[e - 1] - c) || "next" === t.swipeDirection ? o[e] : o[e - 1]), (c = -c);
                  }
                  if (
                    (f &&
                      i("transitionEnd", () => {
                        t.loopFix();
                      }),
                    0 !== t.velocity)
                  ) {
                    if (((e = l ? Math.abs((-c - t.translate) / t.velocity) : Math.abs((c - t.translate) / t.velocity)), r.freeMode.sticky)) {
                      const s = Math.abs((l ? -c : c) - t.translate),
                        a = t.slidesSizesGrid[t.activeIndex];
                      e = s < a ? r.speed : s < 2 * a ? 1.5 * r.speed : 2.5 * r.speed;
                    }
                  } else if (r.freeMode.sticky) return void t.slideToClosest();
                  r.freeMode.momentumBounce && h
                    ? (t.updateProgress(p),
                      t.setTransition(e),
                      t.setTranslate(c),
                      t.transitionStart(!0, t.swipeDirection),
                      (t.animating = !0),
                      n.transitionEnd(() => {
                        t &&
                          !t.destroyed &&
                          d.allowMomentumBounce &&
                          (a("momentumBounce"),
                          t.setTransition(r.speed),
                          setTimeout(() => {
                            t.setTranslate(p),
                              n.transitionEnd(() => {
                                t && !t.destroyed && t.transitionEnd();
                              });
                          }, 0));
                      }))
                    : t.velocity
                    ? (a("_freeModeNoMomentumRelease"),
                      t.updateProgress(c),
                      t.setTransition(e),
                      t.setTranslate(c),
                      t.transitionStart(!0, t.swipeDirection),
                      t.animating ||
                        ((t.animating = !0),
                        n.transitionEnd(() => {
                          t && !t.destroyed && t.transitionEnd();
                        })))
                    : t.updateProgress(c),
                    t.updateActiveIndex(),
                    t.updateSlidesClasses();
                } else {
                  if (r.freeMode.sticky) return void t.slideToClosest();
                  r.freeMode && a("_freeModeNoMomentumRelease");
                }
                (!r.freeMode.momentum || c >= r.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses());
              }
            },
          },
        });
    },
    function (e) {
      let t,
        s,
        a,
        { swiper: i, extendParams: r } = e;
      r({ grid: { rows: 1, fill: "column" } }),
        (i.grid = {
          initSlides: (e) => {
            const { slidesPerView: r } = i.params,
              { rows: n, fill: l } = i.params.grid;
            (s = t / n),
              (a = Math.floor(e / n)),
              (t = Math.floor(e / n) === e / n ? e : Math.ceil(e / n) * n),
              "auto" !== r && "row" === l && (t = Math.max(t, r * n));
          },
          updateSlide: (e, r, n, l) => {
            const { slidesPerGroup: o, spaceBetween: d } = i.params,
              { rows: c, fill: p } = i.params.grid;
            let u, h, m;
            if ("row" === p && o > 1) {
              const s = Math.floor(e / (o * c)),
                a = e - c * o * s,
                i = 0 === s ? o : Math.min(Math.ceil((n - s * c * o) / c), o);
              (m = Math.floor(a / i)), (h = a - m * i + s * o), (u = h + (m * t) / c), r.css({ "-webkit-order": u, order: u });
            } else
              "column" === p
                ? ((h = Math.floor(e / c)), (m = e - h * c), (h > a || (h === a && m === c - 1)) && ((m += 1), m >= c && ((m = 0), (h += 1))))
                : ((m = Math.floor(e / s)), (h = e - m * s));
            r.css(l("margin-top"), 0 !== m ? d && `${d}px` : "");
          },
          updateWrapperSize: (e, s, a) => {
            const { spaceBetween: r, centeredSlides: n, roundLengths: l } = i.params,
              { rows: o } = i.params.grid;
            if (
              ((i.virtualSize = (e + r) * t),
              (i.virtualSize = Math.ceil(i.virtualSize / o) - r),
              i.$wrapperEl.css({ [a("width")]: `${i.virtualSize + r}px` }),
              n)
            ) {
              s.splice(0, s.length);
              const e = [];
              for (let t = 0; t < s.length; t += 1) {
                let a = s[t];
                l && (a = Math.floor(a)), s[t] < i.virtualSize + s[0] && e.push(a);
              }
              s.push(...e);
            }
          },
        });
    },
    function (e) {
      let { swiper: t } = e;
      Object.assign(t, { appendSlide: K.bind(t), prependSlide: Z.bind(t), addSlide: Q.bind(t), removeSlide: J.bind(t), removeAllSlides: ee.bind(t) });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ fadeEffect: { crossFade: !1, transformEl: null } }),
        te({
          effect: "fade",
          swiper: t,
          on: a,
          setTranslate: () => {
            const { slides: e } = t,
              s = t.params.fadeEffect;
            for (let a = 0; a < e.length; a += 1) {
              const e = t.slides.eq(a);
              let i = -e[0].swiperSlideOffset;
              t.params.virtualTranslate || (i -= t.translate);
              let r = 0;
              t.isHorizontal() || ((r = i), (i = 0));
              const n = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e[0].progress), 0) : 1 + Math.min(Math.max(e[0].progress, -1), 0);
              se(s, e).css({ opacity: n }).transform(`translate3d(${i}px, ${r}px, 0px)`);
            }
          },
          setTransition: (e) => {
            const { transformEl: s } = t.params.fadeEffect;
            (s ? t.slides.find(s) : t.slides).transition(e), ae({ swiper: t, duration: e, transformEl: s, allSlides: !0 });
          },
          overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !t.params.cssMode }),
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: 0.94 } });
      const i = (e, t, s) => {
        let a = s ? e.find(".swiper-slide-shadow-left") : e.find(".swiper-slide-shadow-top"),
          i = s ? e.find(".swiper-slide-shadow-right") : e.find(".swiper-slide-shadow-bottom");
        0 === a.length && ((a = d(`<div class="swiper-slide-shadow-${s ? "left" : "top"}"></div>`)), e.append(a)),
          0 === i.length && ((i = d(`<div class="swiper-slide-shadow-${s ? "right" : "bottom"}"></div>`)), e.append(i)),
          a.length && (a[0].style.opacity = Math.max(-t, 0)),
          i.length && (i[0].style.opacity = Math.max(t, 0));
      };
      te({
        effect: "cube",
        swiper: t,
        on: a,
        setTranslate: () => {
          const { $el: e, $wrapperEl: s, slides: a, width: r, height: n, rtlTranslate: l, size: o, browser: c } = t,
            p = t.params.cubeEffect,
            u = t.isHorizontal(),
            h = t.virtual && t.params.virtual.enabled;
          let m,
            f = 0;
          p.shadow &&
            (u
              ? ((m = s.find(".swiper-cube-shadow")),
                0 === m.length && ((m = d('<div class="swiper-cube-shadow"></div>')), s.append(m)),
                m.css({ height: `${r}px` }))
              : ((m = e.find(".swiper-cube-shadow")), 0 === m.length && ((m = d('<div class="swiper-cube-shadow"></div>')), e.append(m))));
          for (let e = 0; e < a.length; e += 1) {
            const t = a.eq(e);
            let s = e;
            h && (s = parseInt(t.attr("data-swiper-slide-index"), 10));
            let r = 90 * s,
              n = Math.floor(r / 360);
            l && ((r = -r), (n = Math.floor(-r / 360)));
            const d = Math.max(Math.min(t[0].progress, 1), -1);
            let c = 0,
              m = 0,
              g = 0;
            s % 4 == 0
              ? ((c = 4 * -n * o), (g = 0))
              : (s - 1) % 4 == 0
              ? ((c = 0), (g = 4 * -n * o))
              : (s - 2) % 4 == 0
              ? ((c = o + 4 * n * o), (g = o))
              : (s - 3) % 4 == 0 && ((c = -o), (g = 3 * o + 4 * o * n)),
              l && (c = -c),
              u || ((m = c), (c = 0));
            const v = `rotateX(${u ? 0 : -r}deg) rotateY(${u ? r : 0}deg) translate3d(${c}px, ${m}px, ${g}px)`;
            d <= 1 && d > -1 && ((f = 90 * s + 90 * d), l && (f = 90 * -s - 90 * d)), t.transform(v), p.slideShadows && i(t, d, u);
          }
          if ((s.css({ "-webkit-transform-origin": `50% 50% -${o / 2}px`, "transform-origin": `50% 50% -${o / 2}px` }), p.shadow))
            if (u) m.transform(`translate3d(0px, ${r / 2 + p.shadowOffset}px, ${-r / 2}px) rotateX(90deg) rotateZ(0deg) scale(${p.shadowScale})`);
            else {
              const e = Math.abs(f) - 90 * Math.floor(Math.abs(f) / 90),
                t = 1.5 - (Math.sin((2 * e * Math.PI) / 360) / 2 + Math.cos((2 * e * Math.PI) / 360) / 2),
                s = p.shadowScale,
                a = p.shadowScale / t,
                i = p.shadowOffset;
              m.transform(`scale3d(${s}, 1, ${a}) translate3d(0px, ${n / 2 + i}px, ${-n / 2 / a}px) rotateX(-90deg)`);
            }
          const g = c.isSafari || c.isWebView ? -o / 2 : 0;
          s.transform(`translate3d(0px,0,${g}px) rotateX(${t.isHorizontal() ? 0 : f}deg) rotateY(${t.isHorizontal() ? -f : 0}deg)`),
            s[0].style.setProperty("--swiper-cube-translate-z", `${g}px`);
        },
        setTransition: (e) => {
          const { $el: s, slides: a } = t;
          a.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
            t.params.cubeEffect.shadow && !t.isHorizontal() && s.find(".swiper-cube-shadow").transition(e);
        },
        recreateShadows: () => {
          const e = t.isHorizontal();
          t.slides.each((t) => {
            const s = Math.max(Math.min(t.progress, 1), -1);
            i(d(t), s, e);
          });
        },
        getEffectParams: () => t.params.cubeEffect,
        perspective: () => !0,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: !0,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: !1,
          virtualTranslate: !0,
        }),
      });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ flipEffect: { slideShadows: !0, limitRotation: !0, transformEl: null } });
      const i = (e, s, a) => {
        let i = t.isHorizontal() ? e.find(".swiper-slide-shadow-left") : e.find(".swiper-slide-shadow-top"),
          r = t.isHorizontal() ? e.find(".swiper-slide-shadow-right") : e.find(".swiper-slide-shadow-bottom");
        0 === i.length && (i = ie(a, e, t.isHorizontal() ? "left" : "top")),
          0 === r.length && (r = ie(a, e, t.isHorizontal() ? "right" : "bottom")),
          i.length && (i[0].style.opacity = Math.max(-s, 0)),
          r.length && (r[0].style.opacity = Math.max(s, 0));
      };
      te({
        effect: "flip",
        swiper: t,
        on: a,
        setTranslate: () => {
          const { slides: e, rtlTranslate: s } = t,
            a = t.params.flipEffect;
          for (let r = 0; r < e.length; r += 1) {
            const n = e.eq(r);
            let l = n[0].progress;
            t.params.flipEffect.limitRotation && (l = Math.max(Math.min(n[0].progress, 1), -1));
            const o = n[0].swiperSlideOffset;
            let d = -180 * l,
              c = 0,
              p = t.params.cssMode ? -o - t.translate : -o,
              u = 0;
            t.isHorizontal() ? s && (d = -d) : ((u = p), (p = 0), (c = -d), (d = 0)),
              (n[0].style.zIndex = -Math.abs(Math.round(l)) + e.length),
              a.slideShadows && i(n, l, a);
            const h = `translate3d(${p}px, ${u}px, 0px) rotateX(${c}deg) rotateY(${d}deg)`;
            se(a, n).transform(h);
          }
        },
        setTransition: (e) => {
          const { transformEl: s } = t.params.flipEffect;
          (s ? t.slides.find(s) : t.slides)
            .transition(e)
            .find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left")
            .transition(e),
            ae({ swiper: t, duration: e, transformEl: s });
        },
        recreateShadows: () => {
          const e = t.params.flipEffect;
          t.slides.each((s) => {
            const a = d(s);
            let r = a[0].progress;
            t.params.flipEffect.limitRotation && (r = Math.max(Math.min(s.progress, 1), -1)), i(a, r, e);
          });
        },
        getEffectParams: () => t.params.flipEffect,
        perspective: () => !0,
        overwriteParams: () => ({ slidesPerView: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !t.params.cssMode }),
      });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ coverflowEffect: { rotate: 50, stretch: 0, depth: 100, scale: 1, modifier: 1, slideShadows: !0, transformEl: null } }),
        te({
          effect: "coverflow",
          swiper: t,
          on: a,
          setTranslate: () => {
            const { width: e, height: s, slides: a, slidesSizesGrid: i } = t,
              r = t.params.coverflowEffect,
              n = t.isHorizontal(),
              l = t.translate,
              o = n ? e / 2 - l : s / 2 - l,
              d = n ? r.rotate : -r.rotate,
              c = r.depth;
            for (let e = 0, t = a.length; e < t; e += 1) {
              const t = a.eq(e),
                s = i[e],
                l = (o - t[0].swiperSlideOffset - s / 2) / s,
                p = "function" == typeof r.modifier ? r.modifier(l) : l * r.modifier;
              let u = n ? d * p : 0,
                h = n ? 0 : d * p,
                m = -c * Math.abs(p),
                f = r.stretch;
              "string" == typeof f && -1 !== f.indexOf("%") && (f = (parseFloat(r.stretch) / 100) * s);
              let g = n ? 0 : f * p,
                v = n ? f * p : 0,
                w = 1 - (1 - r.scale) * Math.abs(p);
              Math.abs(v) < 0.001 && (v = 0),
                Math.abs(g) < 0.001 && (g = 0),
                Math.abs(m) < 0.001 && (m = 0),
                Math.abs(u) < 0.001 && (u = 0),
                Math.abs(h) < 0.001 && (h = 0),
                Math.abs(w) < 0.001 && (w = 0);
              const b = `translate3d(${v}px,${g}px,${m}px)  rotateX(${h}deg) rotateY(${u}deg) scale(${w})`;
              if ((se(r, t).transform(b), (t[0].style.zIndex = 1 - Math.abs(Math.round(p))), r.slideShadows)) {
                let e = n ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top"),
                  s = n ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
                0 === e.length && (e = ie(r, t, n ? "left" : "top")),
                  0 === s.length && (s = ie(r, t, n ? "right" : "bottom")),
                  e.length && (e[0].style.opacity = p > 0 ? p : 0),
                  s.length && (s[0].style.opacity = -p > 0 ? -p : 0);
              }
            }
          },
          setTransition: (e) => {
            const { transformEl: s } = t.params.coverflowEffect;
            (s ? t.slides.find(s) : t.slides)
              .transition(e)
              .find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left")
              .transition(e);
          },
          perspective: () => !0,
          overwriteParams: () => ({ watchSlidesProgress: !0 }),
        });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({
        creativeEffect: {
          transformEl: null,
          limitProgress: 1,
          shadowPerProgress: !1,
          progressMultiplier: 1,
          perspective: !0,
          prev: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 },
          next: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 },
        },
      });
      const i = (e) => ("string" == typeof e ? e : `${e}px`);
      te({
        effect: "creative",
        swiper: t,
        on: a,
        setTranslate: () => {
          const { slides: e, $wrapperEl: s, slidesSizesGrid: a } = t,
            r = t.params.creativeEffect,
            { progressMultiplier: n } = r,
            l = t.params.centeredSlides;
          if (l) {
            const e = a[0] / 2 - t.params.slidesOffsetBefore || 0;
            s.transform(`translateX(calc(50% - ${e}px))`);
          }
          for (let s = 0; s < e.length; s += 1) {
            const a = e.eq(s),
              o = a[0].progress,
              d = Math.min(Math.max(a[0].progress, -r.limitProgress), r.limitProgress);
            let c = d;
            l || (c = Math.min(Math.max(a[0].originalProgress, -r.limitProgress), r.limitProgress));
            const p = a[0].swiperSlideOffset,
              u = [t.params.cssMode ? -p - t.translate : -p, 0, 0],
              h = [0, 0, 0];
            let m = !1;
            t.isHorizontal() || ((u[1] = u[0]), (u[0] = 0));
            let f = { translate: [0, 0, 0], rotate: [0, 0, 0], scale: 1, opacity: 1 };
            d < 0 ? ((f = r.next), (m = !0)) : d > 0 && ((f = r.prev), (m = !0)),
              u.forEach((e, t) => {
                u[t] = `calc(${e}px + (${i(f.translate[t])} * ${Math.abs(d * n)}))`;
              }),
              h.forEach((e, t) => {
                h[t] = f.rotate[t] * Math.abs(d * n);
              }),
              (a[0].style.zIndex = -Math.abs(Math.round(o)) + e.length);
            const g = u.join(", "),
              v = `rotateX(${h[0]}deg) rotateY(${h[1]}deg) rotateZ(${h[2]}deg)`,
              w = c < 0 ? `scale(${1 + (1 - f.scale) * c * n})` : `scale(${1 - (1 - f.scale) * c * n})`,
              b = c < 0 ? 1 + (1 - f.opacity) * c * n : 1 - (1 - f.opacity) * c * n,
              x = `translate3d(${g}) ${v} ${w}`;
            if ((m && f.shadow) || !m) {
              let e = a.children(".swiper-slide-shadow");
              if ((0 === e.length && f.shadow && (e = ie(r, a)), e.length)) {
                const t = r.shadowPerProgress ? d * (1 / r.limitProgress) : d;
                e[0].style.opacity = Math.min(Math.max(Math.abs(t), 0), 1);
              }
            }
            const y = se(r, a);
            y.transform(x).css({ opacity: b }), f.origin && y.css("transform-origin", f.origin);
          }
        },
        setTransition: (e) => {
          const { transformEl: s } = t.params.creativeEffect;
          (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e),
            ae({ swiper: t, duration: e, transformEl: s, allSlides: !0 });
        },
        perspective: () => t.params.creativeEffect.perspective,
        overwriteParams: () => ({ watchSlidesProgress: !0, virtualTranslate: !t.params.cssMode }),
      });
    },
    function (e) {
      let { swiper: t, extendParams: s, on: a } = e;
      s({ cardsEffect: { slideShadows: !0, transformEl: null, rotate: !0 } }),
        te({
          effect: "cards",
          swiper: t,
          on: a,
          setTranslate: () => {
            const { slides: e, activeIndex: s } = t,
              a = t.params.cardsEffect,
              { startTranslate: i, isTouched: r } = t.touchEventsData,
              n = t.translate;
            for (let l = 0; l < e.length; l += 1) {
              const o = e.eq(l),
                d = o[0].progress,
                c = Math.min(Math.max(d, -4), 4);
              let p = o[0].swiperSlideOffset;
              t.params.centeredSlides && !t.params.cssMode && t.$wrapperEl.transform(`translateX(${t.minTranslate()}px)`),
                t.params.centeredSlides && t.params.cssMode && (p -= e[0].swiperSlideOffset);
              let u = t.params.cssMode ? -p - t.translate : -p,
                h = 0;
              const m = -100 * Math.abs(c);
              let f = 1,
                g = -2 * c,
                v = 8 - 0.75 * Math.abs(c);
              const w = t.virtual && t.params.virtual.enabled ? t.virtual.from + l : l,
                b = (w === s || w === s - 1) && c > 0 && c < 1 && (r || t.params.cssMode) && n < i,
                x = (w === s || w === s + 1) && c < 0 && c > -1 && (r || t.params.cssMode) && n > i;
              if (b || x) {
                const e = (1 - Math.abs((Math.abs(c) - 0.5) / 0.5)) ** 0.5;
                (g += -28 * c * e), (f += -0.5 * e), (v += 96 * e), (h = -25 * e * Math.abs(c) + "%");
              }
              if (((u = c < 0 ? `calc(${u}px + (${v * Math.abs(c)}%))` : c > 0 ? `calc(${u}px + (-${v * Math.abs(c)}%))` : `${u}px`), !t.isHorizontal())) {
                const e = h;
                (h = u), (u = e);
              }
              const y = c < 0 ? "" + (1 + (1 - f) * c) : "" + (1 - (1 - f) * c),
                E = `\n        translate3d(${u}, ${h}, ${m}px)\n        rotateZ(${a.rotate ? g : 0}deg)\n        scale(${y})\n      `;
              if (a.slideShadows) {
                let e = o.find(".swiper-slide-shadow");
                0 === e.length && (e = ie(a, o)), e.length && (e[0].style.opacity = Math.min(Math.max((Math.abs(c) - 0.5) / 0.5, 0), 1));
              }
              o[0].style.zIndex = -Math.abs(Math.round(d)) + e.length;
              se(a, o).transform(E);
            }
          },
          setTransition: (e) => {
            const { transformEl: s } = t.params.cardsEffect;
            (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e), ae({ swiper: t, duration: e, transformEl: s });
          },
          perspective: () => !0,
          overwriteParams: () => ({ watchSlidesProgress: !0, virtualTranslate: !t.params.cssMode }),
        });
    },
  ];
  return V.use(re), V;
});
//# sourceMappingURL=swiper-bundle.min.js.map

// Variable to turn off fixed position for header component
let turnOffFixedNavigation = false;

// PAGINATION
function initPagination(options) {
  let { container, totalItems = 0, itemsPerPage = 10, onRenderPage, onAfterRender } = options;

  if (!container) return;

  const startBtn = container.querySelector(".pagination__btn--start");
  const endBtn = container.querySelector(".pagination__btn--end");
  const firstBtn = container.querySelector(".pagination__btn--first-page");
  const lastBtn = container.querySelector(".pagination__btn--last-page");

  const displayedEntries = container.querySelector(".pagination__displayed-entries");
  const totalEntries = container.querySelector(".pagination__total-entries");
  const paginationCounter = container.querySelector(".pagination__counter");

  let currentPage = 1;
  let totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  let isUserInitiated = false; // Track if the page change is from user action using arrows

  function toggleButtonState(button, shouldDisable, targetPage) {
    if (!button) return;

    button.classList.toggle("button--icon--single--disabled", shouldDisable);
    button.disabled = shouldDisable;
    button.setAttribute("aria-disabled", shouldDisable);

    button.setAttribute("aria-label", !shouldDisable && targetPage ? `Go to page ${targetPage}` : `No more pages`);
  }

  function updatePagination() {
    totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    if (totalItems === 0) {
      if (paginationCounter) paginationCounter.textContent = "Showing 0 - 0 of 0 entries";
      if (displayedEntries) displayedEntries.textContent = "0 - 0";
      if (totalEntries) totalEntries.textContent = "0";

      toggleButtonState(startBtn, true);
      toggleButtonState(endBtn, true);
      toggleButtonState(firstBtn, true);
      toggleButtonState(lastBtn, true);

      if (typeof onRenderPage === "function") onRenderPage(0, 0, 1, 1);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    if (displayedEntries) displayedEntries.textContent = `${startIndex + 1} - ${endIndex}`;
    if (totalEntries) totalEntries.textContent = totalItems;
    if (paginationCounter) paginationCounter.textContent = `Showing ${startIndex + 1} - ${endIndex} of ${totalItems} entries`;

    toggleButtonState(startBtn, currentPage === 1, currentPage - 1);
    toggleButtonState(endBtn, currentPage === totalPages, currentPage + 1);
    toggleButtonState(firstBtn, currentPage === 1, 1);
    toggleButtonState(lastBtn, currentPage === totalPages, totalPages);

    if (typeof onRenderPage === "function") onRenderPage(startIndex, endIndex, currentPage, totalPages);
  }

  function goToPage(page, userInitiated = false) {
    currentPage = page;
    updatePagination();

    if (userInitiated && typeof onAfterRender === "function") {
      onAfterRender(currentPage, totalPages);
    }
  }

  function setTotalItems(newTotalItems) {
    totalItems = newTotalItems;
    if (currentPage > totalPages) currentPage = totalPages;
    updatePagination();
  }

  // Only pass `true` for user-initiated clicks
  if (startBtn) startBtn.addEventListener("click", () => goToPage(currentPage - 1, true));
  if (endBtn) endBtn.addEventListener("click", () => goToPage(currentPage + 1, true));
  if (firstBtn) firstBtn.addEventListener("click", () => goToPage(1, true));
  if (lastBtn) lastBtn.addEventListener("click", () => goToPage(totalPages, true));

  updatePagination();

  return {
    goToPage,
    updatePagination,
    setTotalItems,
    get currentPage() {
      return currentPage;
    },
    get totalPages() {
      return totalPages;
    },
  };
}

// COURSE AND ARTICLES CARDS TO RENDER FROM JSON

// COURSE CARD

function renderCourseCard(course) {
  const shortUrl = course.pagePath.replace("/content/uon/gb/en", ""); // Remove '/content/uon/gb/en' from the pagePath
  // Ensure the URL contains 'nottingham.ac.uk'
  const shareUrl = shortUrl.includes("nottingham.ac.uk") ? shortUrl : `https://www.nottingham.ac.uk${shortUrl}`;
  const fallbackImage = "/etc.clientlibs/uon/clientlibs/clientlib-site/resources/images/default.png"; // Define a fallback image URL

  // Append image transformation parameters
  const baseImageUrl = course.carouselCourseImage || fallbackImage;
  const imageUrl = `${baseImageUrl}?fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&wid=580`;

  // Helper function to conditionally render tags
  function renderTag(label, value) {
    if (value && value !== "") {
      return `
                <span class="tag tag--primary tag--small" aria-label="${label}${value}">
                    <span class="tag--txt">${label}${value}</span>
                </span>
            `;
    }
    return ""; // Return empty string if value is N/A
  }

  // Shorten startDate
  let startDateShort = course.startDate;
  if (startDateShort) {
    const parts = startDateShort.split(" ");
    if (parts.length === 2) {
      const month = parts[0].substring(0, 3);
      const year = parts[1];
      startDateShort = `${month} ${year}`;
    }
  }

  //Clearing
  let clearingValue = "";

  if (course.clearingOpen === "open" && course.clearingOpenOptions) {
    if (course.clearingOpenOptions === "openToAll") {
      clearingValue = "Open to all students";
    } else if (course.clearingOpenOptions === "openToInternationalOnly") {
      clearingValue = "Open to international applicants only";
    } else if (course.clearingOpenOptions === "openToUkStudentOnly") {
      clearingValue = "Open to UK applicants only";
    } else {
      clearingValue = course.clearingOpenOptions;
    }
  }

  return `
       <div class="cmp-tile cmp-tile--course">
         <a href="${shortUrl}"  title="${course.title}"  aria-label="${course.title} ">
            <div class="cmp-tile__image">
                <img
                    src="${imageUrl}"
                    alt=""
                    loading="lazy"
                    height="170"
                    width="303"
                />

            </div>
            <div class="cmp-tile__contents">
                <span class="body-small">${course.faculty || course.category || "Faculty Unknown"}</span>
                <h3 class="cmp-tile__title heading-small">${course.title}</h3>
                <div class="cmp-tile__tags">
                    ${course.clearingOpen !== "open" ? renderTag("Entry ", course.entryRequirementsCode) : ""}
                    ${course.clearingOpen !== "open" ? renderTag("UCAS ", course.ucasCode) : ""}
                    ${course.clearingOpen !== "open" ? renderTag("", course.duration) : ""}
                    ${course.clearingOpen !== "open" ? renderTag("Start ", startDateShort) : ""}
                    ${
                      course.clearingOpen === "open" && clearingValue
                        ? `<span class="tag tag--full tag--primary tag--small" aria-label="Primary small tag"><span class="tag--txt">${clearingValue}</span></span>`
                        : ""
                    }
                    ${
                      course.clearingOpen === "open"
                        ? `<span  class="tag tag--full tag--primary tag--small tag--icon tag--bg" aria-label="Primary small tag"><span class="tag--txt">View clearing entry requirements</span></span>`
                        : ""
                    }                              
                </div>
            </div>
          </a>
          <div class="cmp-tile__buttons">
            <button data-share-link="${shareUrl}" data-share-title="${
    course.title
  }" data-share-img="${imageUrl}" class="share-button button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--single--medium--saved" aria-label="Share ${
    course.title
  }"></button>
        </div>
      </div>
    `;
}

// CLEARING COURSE CARD

function renderClearingCourseCard(course) {
  const shortUrl = course.pagePath.replace("/content/uon/gb/en", "");
  const shareUrl = shortUrl.includes("nottingham.ac.uk") ? shortUrl : `https://www.nottingham.ac.uk${shortUrl}`;

  const fallbackImage = "/etc.clientlibs/uon/clientlibs/clientlib-site/resources/images/default.png";

  const baseImageUrl = course.carouselCourseImage || fallbackImage;
  const imageUrl = `${baseImageUrl}?fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&wid=580`;

  // Tooltip logic
  let tooltipHTML = "";

  const tooltipId = `tooltip-${course.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  const disclosureId = `disclosure-${course.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  if (course.clearingOpenOptions !== "openToAll") {
    let tagText = "";
    let disclaimer = "";

    if (course.clearingOpenOptions === "openToInternationalOnly") {
      tagText = "Open to international applicants only";
      disclaimer = course.internationalStudentDisclaimer || "";
    }

    if (course.clearingOpenOptions === "openToUkStudentOnly") {
      tagText = "Open to UK applicants only";
      disclaimer = course.ukStudentDisclaimer || "";
    }

    tooltipHTML = `
      <div class="tag__tooltip-container">
    
        <button class="tag tag--tooltip tag--medium tag__tooltip-trigger" aria-describedby="${tooltipId}" aria-expanded="false">
            <span class="tag--txt">${tagText}</span> <span class="tag__info-icon"></span>
        </button>

        <div class="tag__tooltip-txt body-small" id="${tooltipId}" role="tooltip">
          <div>${disclaimer}</div>
          <button class="tag__tooltip-close-btn" aria-label="Close tooltip"></button>

        </div>
      </div>
    `;
  }

  return `
    <div class="cmp-tile cmp-tile--clearing">

     <div class="cmp-tile--clearing-container">

        <div class="cmp-tile__image">
          <a href="${shortUrl}" tabindex="-1" aria-label="Learn more about ${course.title}">
            <img
              src="${imageUrl}"
              alt=""
              loading="lazy"
              height="170"
              width="303"
            />
          </a>
        </div>

        <div class="cmp-tile__contents">
          <a  class="cmp-tile--clearing-title-link" href="${shortUrl}" tabindex="0" aria-label="Learn more about ${course.title}">
            <h3 class="cmp-tile__title heading-small">${course.title}</h3>
          </a>

          ${tooltipHTML}

          <div class="cmp-tile__clearing-entry">
            ${
              course.aLevelRequirementsClearing || course.gcseRequirementsClearing
                ? `
                <div class="entry-requirements-card" role="group" aria-label="Entry Requirements Card">
                  
                  ${
                    course.aLevelRequirementsClearing
                      ? `
                    <div class="entry-requirements-card__container">
                      <div class="entry-requirements-card__container--card-icon"></div>
                      <div class="entry-requirements-card__container__content">
                        <p class="body-small">A level requirements</p>
                        <p class="body-medium">${course.aLevelRequirementsClearing}</p>
                      </div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    course.gcseRequirementsClearing
                      ? `
                    <div class="entry-requirements-card__container">
                      <div class="entry-requirements-card__container--card-icon"></div>
                      <div class="entry-requirements-card__container__content">
                        <p class="body-small">GCSE requirements</p>
                        <p class="body-medium">${course.gcseRequirementsClearing}</p>
                      </div>
                    </div>
                  `
                      : ""
                  }

                </div>
              `
                : ""
            }
          </div>

          <div class="req-tags">
            ${
              course.ibRequirementsClearing
                ? `<span class="tag tag--green-border tag--ib tag--icon tag--medium" aria-label="IB">
                    <span class="tag__icon"></span>
                    <span class="tag--txt">${course.ibRequirementsClearing}</span>
                  </span>`
                : ""
            }

            ${
              course.ieltsOverallScoreClearing && (course.clearingOpenOptions === "openToAll" || course.clearingOpenOptions === "openToInternationalOnly")
                ? `<span class="tag--ielts tag tag--green-border tag--icon tag--medium" aria-label="IELTS">
                    <span class="tag__icon"></span>
                    <span class="tag--txt">IELTS ${course.ieltsOverallScoreClearing}</span>
                  </span>`
                : ""
            }

            ${
              (
                (
                  course.altQualClearing &&
                  (
                    course.clearingOpenOptions === "openToAll" ||
                    course.clearingOpenOptions === "openToUkStudentOnly"
                  )
                ) ||
                (
                  course.altQualClearingInternational &&
                  course.clearingOpenOptions === "openToInternationalOnly"
                )
              )
                ? `<span class="tag--alternative tag tag--primary tag--icon tag--medium" aria-label="Alternative qualifications">
                    <span class="tag__icon"></span>
                    <span class="tag--txt">Alternative qualifications considered</span>
                  </span>`
                : ""
            }
          </div>

          ${
            course.aLevelSubjectsRequiredClearing
              ? `<div class="subjects-req">
            <span class="grey-txt">Subjects required</span>
            ${course.aLevelSubjectsRequiredClearing}
          </div>`
              : ""
          }



          ${
            course.otherRequirementsClearing
              ? `
            <div class="other-req other-req--desktop">
              <span class="grey-txt">Other requirements</span>
              <span class="grey-txt">${course.otherRequirementsClearing}</span>
            </div>

            <div class="other-req other-req--mobile">
              <button class="disclosure__btn cmp-tile--clearing-disclosure-btn" type="button" aria-expanded="false" aria-controls="${disclosureId}">
                <span class="grey-txt">Other requirements</span>
                <span
                  class="
                    disclosure__btn-icon
                    button button--secondary button--outline button--small button--icon--secondary--outline button--icon--single--small
                  "
                ></span>
              </button>

              <div id="${disclosureId}" class="disclosure__content cmp-tile--clearing-disclosure-content" hidden>
               ${course.otherRequirementsClearing}
              </div>
            </div>
            `
              : ""
          }

          <span class="horizontal-line"></span>

          <a
            href="${shortUrl}"
            class="
              button
              button--secondary
              button--outline
              button--medium
              button--icon--secondary--outline
              button--icon--before--medium
              button--icon--after--medium
              cmp-tile--clearing-learnMore-btn
            "
            aria-label="Learn more about ${course.title}"
          >
            <span>Learn more</span>
          </a>


        </div>

        <div class="cmp-tile__buttons">
          <button data-share-link="${shareUrl}" data-share-title="${
    course.title
  }" data-share-img="${imageUrl}" class="share-button button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--single--medium--saved" aria-label="Share ${
    course.title
  }"></button>
        </div>

        </div>
  
    </div>
  `;
}

// ARTICLE CARD

function renderArticleCard(article) {
  const shortUrl = article.pagePath.replace("/content/uon/gb/en", ""); // Remove '/content/uon/gb/en' from the pagePath
  // Ensure the URL contains 'nottingham.ac.uk'
  const shareUrl = shortUrl.includes("nottingham.ac.uk") ? shortUrl : `https://www.nottingham.ac.uk${shortUrl}`;
  const shortUrlBookMark = shortUrl.replace(/\.html$/, "");
  const fallbackImage = "/etc.clientlibs/uon/clientlibs/clientlib-v2/resources/images/uon-holding-course-image.jpg"; // Define a fallback image URL

  // Append image transformation parameters
  const baseImageUrl = article.carouselCourseImage || fallbackImage;
  const imageUrl = `${baseImageUrl}?fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&wid=580`;

  return `
      <div class="cmp-tile cmp-tile--article">
        <a href="${shortUrl}"  title="${article.title}"  tabindex="0" aria-label="${article.title} ">
          <div class="cmp-tile__image">
            <img src="${imageUrl}" alt="" loading="lazy" height="170" width="303">
          </div>
          <div class="cmp-tile__contents">
            <span class="tag tag--primary tag--small" aria-label="Primary small tag">
              <span class="tag--txt">${article.category || "Uncategorized"}</span>
            </span>
            <h3 class="cmp-tile__title heading-small">${article.title}</h3>
            <p class="cmp-tile__description body-medium ">${article.description ?? ""}</p>
          </div>
        </a>
            <div class="cmp-tile__buttons">
                <button data-share-link="${shareUrl}" data-share-title="${
    article.title
  }" data-share-img="${imageUrl}" class="share-button button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--single--medium--saved" aria-label="Share ${
    article.title
  }"></button>
            </div>
      </div> 
    `;
}

// DISCLOSURE SHOW AND HIDE

function toggleDisclosure(button) {
  const contentId = button.getAttribute("aria-controls");
  const content = document.getElementById(contentId);

  if (!content) return;

  const isExpanded = button.getAttribute("aria-expanded") === "true";

  button.setAttribute("aria-expanded", !isExpanded);
  content.hidden = isExpanded;

  button.classList.toggle("disclosure__btn-open", !isExpanded);
}

function createDisclosure(button) {
  const contentId = button.getAttribute("aria-controls");
  const content = document.getElementById(contentId);

  if (!content) return;

  const expanded = button.getAttribute("aria-expanded") === "true";
  content.hidden = !expanded;

  if (expanded) {
    button.classList.add("disclosure__btn-open");
  }

  button.addEventListener("click", () => {
    toggleDisclosure(button);
  });
}

document.querySelectorAll(".carouselV2--accolades").forEach((accolades) => {
  const swiperEl = accolades.querySelector(".mySwiper");
  const slidesCount = swiperEl.querySelectorAll(".swiper-slide").length;

  const nextBtn = accolades.querySelector(".carouselV2__arrows--desktop .swiper-button-next");
  const prevBtn = accolades.querySelector(".carouselV2__arrows--desktop .swiper-button-prev");

  const nextBtnMobile = accolades.querySelector(".carouselV2__arrows--mobile .swiper-button-next");
  const prevBtnMobile = accolades.querySelector(".carouselV2__arrows--mobile .swiper-button-prev");

  const progressBar = accolades.querySelector(".swiper-pagination");

  const swiperAccolades = new Swiper(swiperEl, {
    spaceBetween: 16,
    cssWidthAndHeight: true,
    freeMode: false,
    loop: false,
    watchSlidesProgress: true,

    pagination: {
      el: [progressBar],
      type: "progressbar",
    },
    navigation: {
      nextEl: [nextBtn, nextBtnMobile],
      prevEl: [prevBtn, prevBtnMobile],
    },
    breakpoints: {
      1280: {
        slidesPerView: Math.min(4, slidesCount),
      },
      1024: {
        slidesPerView: Math.min(3, slidesCount),
      },
      768: {
        slidesPerView: Math.min(2, slidesCount),
      },

      0: {
        slidesPerView: 1,
      },
    },
  });
});

// Select all accordions on the page
const accordions = document.querySelectorAll(".accordion");

// Set ARIA attributes for accessibility
function setAriaAttributes(button, content, isExpanded) {
  // Derive the visible header title from the button's constructed DOM
  // Prefer the dedicated span if present; otherwise fall back to button text
  const headerTitleEl = button.querySelector(".cmp-accordion__header-title");
  const headerTitle = headerTitleEl ? headerTitleEl.textContent.trim() : (button.textContent || "").trim();

  // Standard ARIA state
  button.setAttribute("aria-expanded", isExpanded);
  content.setAttribute("aria-hidden", !isExpanded);

  // Descriptive label announces the section title and action/state
  let newHeaderTitle = headerTitle;
  if (headerTitle.includes("years full") || headerTitle.includes("years part")) {
    newHeaderTitle = "Duration " + headerTitle;
  } else if (headerTitle.includes("per year")) {
    newHeaderTitle = "Fees " + headerTitle;
  } else {
    newHeaderTitle = headerTitle;
  }

  button.setAttribute("aria-label", isExpanded ? `${newHeaderTitle} - Collapse section` : `${newHeaderTitle} - Expand section`);
}

// Function to close all cmp-accordion__panel--expanded accordion contents within the same accordion container
function closeAccordions(accordion, currentButton) {
  // Get all buttons in the accordion (only within this accordion container)
  const allAccordionButtons = accordion.querySelectorAll(".cmp-accordion__header button");

  allAccordionButtons.forEach((btn) => {
    const content = btn.closest(".cmp-accordion__header").nextElementSibling;

    // Close other accordion sections that are cmp-accordion__panel--expanded (except the one clicked)
    if (btn !== currentButton && content.classList.contains("cmp-accordion__panel--expanded")) {
      content.classList.remove("cmp-accordion__panel--expanded");
      setAriaAttributes(btn, content, false);
    }
  });
}

// Function to handle toggling of the accordion content
function toggleAccordionContent(event) {
  const button = event.currentTarget;
  const header = button.closest(".cmp-accordion__header");
  const content = header.nextElementSibling; // Get the content directly below the header
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  const accordion = header.closest(".accordion"); // Get the parent accordion container

  const isDesktop = window.innerWidth >= 768; // desktop check

  // Close other accordion sections ONLY if auto-close is enabled AND on desktop
  if (isDesktop && !accordion.classList.contains("accordion--auto-close-off")) {
    closeAccordions(accordion, button);
  }

  // Toggle the clicked accordion section
  content.classList.toggle("cmp-accordion__panel--expanded", !isExpanded);
  setAriaAttributes(button, content, !isExpanded);

  // Scroll into view only if newly opened AND on desktop
  if (!isExpanded && isDesktop) {
    const rect = header.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    const topThreshold = viewportHeight * 0.25;
    const bottomThreshold = viewportHeight * 0.75;

    if (rect.top < topThreshold || rect.bottom > bottomThreshold) {
      header.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }
}

// Create button inside the header
function createBtn(header) {
  // Only add button if not already present
  const existingButton = header.querySelector("button");
  if (existingButton) return;

  const button = document.createElement("button");
  button.classList.add("cmp-accordion__button");

  // Get the category HTML (previous sibling of the header)
  const categoryHtml = header.previousElementSibling;

  // Create the button text container <span class="cmp-accordion__button-text">
  const buttonText = document.createElement("span");
  buttonText.classList.add("cmp-accordion__button-text");

  // If categoryHtml exists, move it to the button and remove it from the DOM
  if (categoryHtml) {
    const headerCategory = document.createElement("span");
    headerCategory.classList.add("cmp-accordion__header-category");
    headerCategory.textContent = categoryHtml.textContent; // Set the category text content
    buttonText.appendChild(headerCategory); // Append the category span first

    // Remove the categoryHtml from the DOM after appending it to the button
    categoryHtml.remove();
  }

  // Create a span for the header text (second item) and add it inside buttonText
  const headerTitle = document.createElement("span");
  headerTitle.classList.add("cmp-accordion__header-title");
  headerTitle.textContent = header.textContent; // Set the header's text content
  buttonText.appendChild(headerTitle); // Append the header title second

  // Append the buttonText span to the button
  button.appendChild(buttonText);

  // Clear the original header text and insert the button
  header.textContent = ""; // Clear original text
  header.appendChild(button);

  // Create the plus/minus icon and append it to the button
  const buttonIcon = document.createElement("span");
  buttonIcon.classList.add(
    "cmp-accordion__icon",
    "button",
    "button--secondary",
    "button--outline",
    "button--small",
    "button--icon--secondary--outline",
    "button--icon--single--small",
  );
  button.appendChild(buttonIcon);

  // Get content below the header
  const content = header.nextElementSibling;
  button.setAttribute("aria-controls", content.getAttribute("id")); // Set aria-controls attribute

  // Ensure the content is labelled by the header element's id (the <h*> retains its id)
  if (header && header.id) {
    content.setAttribute("aria-labelledby", header.id);
  }

  setAriaAttributes(button, content, false); // Initially collapsed

  // Attach event listener to the button
  button.addEventListener("click", toggleAccordionContent);
}

// Remove button and restore header
function removeBtn(header) {
  const button = header.querySelector("button");
  if (!button) return; // No button to remove

  const content = header.nextElementSibling; // Get content below the header

  // Remove ARIA attributes
  button.removeAttribute("aria-expanded");
  button.removeAttribute("aria-controls");
  button.removeAttribute("aria-label");
  content.removeAttribute("aria-hidden");
  content.removeAttribute("aria-labelledby");

  // Restore the original header content
  const buttonText = button.querySelector("span.cmp-accordion__button-text");

  // Extract the category and header title
  const categorySpan = buttonText.querySelector("span.cmp-accordion__header-category");
  const headerTitleSpan = buttonText.querySelector("span.cmp-accordion__header-title");

  // Create a new category element and insert it before the header, if needed
  if (categorySpan) {
    const restoredCategory = document.createElement("span");
    restoredCategory.classList.add("cmp-accordion__header-category");
    restoredCategory.textContent = categorySpan.textContent; // Restore the category text
    header.parentElement.insertBefore(restoredCategory, header); // Add it before the header
  }

  // Restore the header's text content
  if (headerTitleSpan) {
    header.textContent = headerTitleSpan.textContent; // Restore header text
  }

  // Remove the button if it's still present in the DOM
  if (button && header.contains(button)) {
    header.removeChild(button);
  }
}

// Main function that calls the correct behavior based on window size
function updateBehaviour(accordion, match) {
  const headers = accordion.querySelectorAll(".cmp-accordion__header");

  headers.forEach((header) => {
    const content = header.nextElementSibling; // Get content below the header

    // Call appropriate function based on whether match is true or false
    if (match) {
      handleMatch(header, content);
    } else {
      handleNoMatch(header);
    }
  });
}

// Function to handle behavior when media query matches
function handleMatch(header, content) {
  // Check if button is removed (no need to update)
  if (!header.querySelector("button")) {
    return;
  }
  content.classList.remove("cmp-accordion__panel--expanded"); // Remove cmp-accordion__panel--expanded class because no longer accordion functionallity is there
  removeBtn(header); // Remove button
}

// Function to handle behavior when media query does not match
function handleNoMatch(header) {
  // Check if button already exists (no need to update)
  if (header.querySelector("button")) {
    return;
  }
  createBtn(header); // Create button if no match
}

// Initialize all accordions
function activateAccordions() {
  accordions.forEach((accordion) => {
    const mediaQuery = accordion.getAttribute("data-inactive");

    if (mediaQuery) {
      const match = window.matchMedia(mediaQuery).matches;

      // Initial check based on media query
      updateBehaviour(accordion, match);

      // Set up resize listener to update behavior on window resize
      window.addEventListener("resize", () => {
        const currentMatch = window.matchMedia(mediaQuery).matches;
        updateBehaviour(accordion, currentMatch); // Recheck and update accordion behavior on resize
      });
    } else {
      // If no data-inactive attribute, just create buttons and collapse content
      const headers = accordion.querySelectorAll(".cmp-accordion__header");
      headers.forEach((header) => {
        createBtn(header); // Always create button
      });

      // Check for any initially expanded panels and set the correct ARIA attributes
      const panels = accordion.querySelectorAll(".cmp-accordion__panel");
      panels.forEach((panel) => {
        if (panel.classList.contains("cmp-accordion__panel--expanded")) {
          const button = panel.previousElementSibling.querySelector("button"); // Get the button inside the header
          if (button) {
            const content = panel;
            setAriaAttributes(button, content, true); // Set ARIA attributes for expanded state
            content.classList.add("cmp-accordion__panel--expanded"); // Ensure panel is expanded visually
          }
        }
      });
    }
  });
}

activateAccordions();

// Accordion pagination
const paginatedAccordions = document.querySelectorAll(".accordion-component.accordion--paginated");

paginatedAccordions.forEach((component) => {
  const itemsPerPage = parseInt(component.getAttribute("data-accordions-per-page")) || 2;
  const panelContainer = component.querySelector(".panelcontainer");
  const accordionItems = panelContainer.querySelectorAll(".cmp-accordion");
  const pagination = component.querySelector(".pagination--accordion");

  initPagination({
    container: pagination,
    totalItems: accordionItems.length,
    itemsPerPage,
    onRenderPage: (startIndex, endIndex) => {
      accordionItems.forEach((item, index) => {
        item.style.display = index >= startIndex && index < endIndex ? "block" : "none";
      });
    },
    onAfterRender: () => {
      // Scroll and focus first accordion into view
      const firstVisible = Array.from(accordionItems).find((item) => window.getComputedStyle(item).display === "block");

      if (firstVisible) {
        setTimeout(() => {
          // Scroll the first visible accordion into view
          firstVisible.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Focus its button without additional scrolling
          const btn = firstVisible.querySelector(".cmp-accordion__button");
          if (btn) btn.focus({ preventScroll: true });
        }, 100); // 100ms delay
      }
    },
  });
});

const alertCloseButtons = document.querySelectorAll("[data-alert-close]");

alertCloseButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const alertCard = button.closest(".alert-card");
    if (alertCard) {
      alertCard.style.display = "none";
      alertCard.setAttribute("aria-hidden", "true");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("change", function (event) {
        const toggle = event.target;

        // Check if the changed element is a relevant toggle with the class 'boolean__select'
        if (toggle.matches('input.boolean__select[type="checkbox"][role="switch"], input.boolean__select[type="radio"][role="radio"], input.boolean__select[type="checkbox"]:not([role="switch"])')) {
            // Update aria-checked based on the toggle's state
            toggle.setAttribute("aria-checked", toggle.checked.toString());
        }
    });
});
//console.log("Breadcrumbs script loaded");
function toggleMobileBreadcrumbs() {
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
  const breadcrumbList = document.querySelector(".cmp-breadcrumbs__list");
  if (!breadcrumbList) return;

  // Store original HTML once (first time only)
  if (!breadcrumbList.dataset.originalHtml) {
    breadcrumbList.dataset.originalHtml = breadcrumbList.innerHTML;
  }

  // Always reset before applying ellipsis
  breadcrumbList.innerHTML = breadcrumbList.dataset.originalHtml;

  const items = Array.from(breadcrumbList.children);

  if (isTablet && items.length > 4) {
    const first = items[0];
    const secondLast = items[items.length - 2];
    const last = items[items.length - 1];

    const ellipsis = document.createElement("li");
    ellipsis.className = "cmp-breadcrumbs__item ellipsis";
    ellipsis.innerHTML = '<span class="cmp-breadcrumbs__link">...</span>';

    breadcrumbList.innerHTML = "";
    breadcrumbList.appendChild(first);
    breadcrumbList.appendChild(ellipsis);
    breadcrumbList.appendChild(secondLast);
    breadcrumbList.appendChild(last);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  toggleMobileBreadcrumbs();
  window.addEventListener("resize", toggleMobileBreadcrumbs);
  window.addEventListener("orientationchange", toggleMobileBreadcrumbs);
});
document.querySelectorAll(".carousel").forEach((carousel) => {
  const swiperEl = carousel.querySelector(".mySwiper");

  const nextBtn = carousel.querySelector(".carousel__arrows--desktop .swiper-button-next");
  const prevBtn = carousel.querySelector(".carousel__arrows--desktop .swiper-button-prev");

  const nextBtnMobile = carousel.querySelector(".carousel__arrows--mobile .swiper-button-next");
  const prevBtnMobile = carousel.querySelector(".carousel__arrows--mobile .swiper-button-prev");

  const swiper = new Swiper(swiperEl, {
    spaceBetween: 16,
    cssWidthAndHeight: true,
    freeMode: false,
    loop: false,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: [nextBtn, nextBtnMobile],
      prevEl: [prevBtn, prevBtnMobile],
    },
    breakpoints: {
      // desktop
      1440: {
        slidesPerView: 4, // 4 equal-width slides
      },
      // tablet & mobile
      0: {
        slidesPerView: "auto", // auto sizing
      },
    },
  });
});

// Desktop sticky search bar

const stickyClearingFilters = document.querySelector(".listing__clearing-filters");

if (stickyClearingFilters) {
  turnOffFixedNavigation = true;

  let spacer = null;
  let isSticky = false;
  let enabled = true;
  let prevScrollY = window.scrollY;
  let wasMobile = window.innerWidth <= 767;

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function getFiltersBottom() {
    const rect = stickyClearingFilters.getBoundingClientRect();
    return rect.top + window.scrollY + rect.height;
  }

  let filtersBottom = getFiltersBottom();

  if (isMobile()) {
    disableSticky();
  }

  function createSpacer(height) {
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.style.height = `${height}px`;
      spacer.style.pointerEvents = "none";
      spacer.style.visibility = "hidden";
      spacer.className = "listing__clearing-filters-spacer";

      stickyClearingFilters.parentNode.insertBefore(spacer, stickyClearingFilters);
    }
  }

  function removeSpacer() {
    if (spacer) {
      spacer.remove();
      spacer = null;
    }
  }

  function disableSticky() {
    enabled = false;

    if (isSticky) {
      stickyClearingFilters.classList.remove("listing__clearing-filters--sticky");
      removeSpacer();
      isSticky = false;
    }
  }

  function enableSticky() {
    enabled = true;
  }

  function updateStickyFilters() {
    if (!enabled) return;

    const scrollY = window.scrollY;
    const scrollingUp = scrollY < prevScrollY;

    if (!isSticky && scrollY >= filtersBottom) {
      const height = stickyClearingFilters.offsetHeight;
      createSpacer(height);

      stickyClearingFilters.classList.add("listing__clearing-filters--sticky");
      isSticky = true;

      // Start slide-in animation after 1 second
      stickyClearingFilters.classList.remove("slide-in"); // reset in case
      setTimeout(() => {
        stickyClearingFilters.classList.add("slide-in");
      }, 100); // small delay to allow class to apply transform -100%
    }

    if (isSticky && scrollingUp && scrollY <= filtersBottom) {
      stickyClearingFilters.classList.remove("listing__clearing-filters--sticky", "slide-in");
      removeSpacer();
      isSticky = false;
    }

    prevScrollY = scrollY;
  }

  window.addEventListener("scroll", updateStickyFilters);

  window.addEventListener("resize", () => {
    const mobile = isMobile();

    // Only react when breakpoint changes
    if (mobile === wasMobile) return;

    wasMobile = mobile;

    if (mobile) {
      disableSticky();
    } else {
      enableSticky();
      filtersBottom = getFiltersBottom();
      updateStickyFilters();
    }
  });
}

// Filters modal pop up on mobile

document.addEventListener("DOMContentLoaded", function () {
  const openFiltersBtnClearing = document.getElementById("open-filters-clearing");
  const closeFiltersBtnClearing = document.getElementById("close-filters-clearing");
  const modalClearing = document.querySelector(".listing__clearing-filters-modal");
  const dialogClearing = document.querySelector(".listing__clearing-filters-modal-dialog");

  if (!openFiltersBtnClearing || !closeFiltersBtnClearing || !modalClearing || !dialogClearing) return;

  function openModalClearing() {
    const triggerButton = openFiltersBtnClearing;
    const modalWrapper = modalClearing;
    const modalDialog = dialogClearing;

    triggerButton.setAttribute("aria-expanded", "true");
    modalWrapper.classList.add("listing__clearing-filters-modal--visible");

    // Focus the close button immediately
    closeFiltersBtnClearing.focus();

    // Trap focus within the modal
    function trapFocusClearing(e) {
      if (e.key !== "Tab") return;

      const ukRadio = modalDialog.querySelector("#uk");
      const intRadio = modalDialog.querySelector("#int");
      const closeBtn = closeFiltersBtnClearing;
      const focusableEls = [ukRadio, intRadio, closeBtn];

      let currentIndex = focusableEls.indexOf(document.activeElement);

      if (e.shiftKey) {
        // Shift+Tab
        currentIndex = currentIndex - 1 < 0 ? focusableEls.length - 1 : currentIndex - 1;
      } else {
        // Tab
        currentIndex = currentIndex + 1 >= focusableEls.length ? 0 : currentIndex + 1;
      }

      e.preventDefault();
      focusableEls[currentIndex].focus();
    }

    function handleEscClearing(e) {
      if (e.key === "Escape") closeModalClearing();
    }

    function handleOutsideClick(e) {
      if (e.target === modalWrapper) closeModalClearing();
    }

    function closeModalClearing() {
      modalWrapper.classList.remove("listing__clearing-filters-modal--visible");
      triggerButton.setAttribute("aria-expanded", "false");

      document.removeEventListener("keydown", trapFocusClearing);
      document.removeEventListener("keydown", handleEscClearing);
      modalWrapper.removeEventListener("click", handleOutsideClick);
      closeFiltersBtnClearing.removeEventListener("click", closeModalClearing);

      triggerButton.focus();
    }

    // Bind events
    closeFiltersBtnClearing.addEventListener("click", closeModalClearing);
    document.addEventListener("keydown", trapFocusClearing);
    document.addEventListener("keydown", handleEscClearing);
    modalWrapper.addEventListener("click", handleOutsideClick);
  }

  openFiltersBtnClearing.addEventListener("click", openModalClearing);
});

// Call utility disclosure show/hide function

document.addEventListener("click", (e) => {
  const clearingDisclosureBtn = e.target.closest(".cmp-tile--clearing-disclosure-btn");
  if (!clearingDisclosureBtn) return;

  toggleDisclosure(clearingDisclosureBtn);
});

// move home int buttons dekstop and mobile location
// update filter text home or international

document.addEventListener("DOMContentLoaded", () => {
  const homeIntContainer = document.querySelector(".listing__clearing-filters-homeInt");
  const modalBody = document.querySelector(".listing__clearing-filters-modal-body");
  const openFiltersBtnClearing = document.getElementById("open-filters-clearing");
  const breakpoint = 767;

  if (!homeIntContainer || !modalBody || !openFiltersBtnClearing) return;

  // Move container based on screen size
  function updatePlacement() {
    if (window.innerWidth <= breakpoint) {
      if (!modalBody.contains(homeIntContainer)) modalBody.appendChild(homeIntContainer);
    } else {
      const desktopColumn = document.querySelector(".listing__clearing-column1");
      if (desktopColumn && !desktopColumn.contains(homeIntContainer)) {
        desktopColumn.insertBefore(homeIntContainer, desktopColumn.querySelector(".search-container").nextSibling);
      }
    }
  }

  // Update open-filters-clearing button text
  function updateButtonText(selectedId) {
    if (selectedId === "uk") openFiltersBtnClearing.querySelector("span").textContent = "UK student";
    else if (selectedId === "int") openFiltersBtnClearing.querySelector("span").textContent = "International student";
  }

  // Initialize selection based on query param
  const urlParams = new URLSearchParams(window.location.search);
  const studentParam = urlParams.get("student"); // expects ?student=home or ?student=international
  if (studentParam === "home") {
    const ukRadio = homeIntContainer.querySelector("#uk");
    if (ukRadio) {
      ukRadio.checked = true;
      updateButtonText("uk");
    }
  } else if (studentParam === "international") {
    const intRadio = homeIntContainer.querySelector("#int");
    if (intRadio) {
      intRadio.checked = true;
      updateButtonText("int");
    }
  }

  // Sync radio button change -> update button text
  homeIntContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      updateButtonText(radio.id);
    });
  });

  // Initial placement & resize listener
  updatePlacement();
  window.addEventListener("resize", updatePlacement);
});

(function () {
  document.querySelectorAll(".content-search__form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const input = form.querySelector('input[name="query"]');
      const select = form.querySelector('select[name="searchSelect"]');

      const errorEl = form.querySelector(".content-search__input-error");
      const errorTextEl = errorEl?.querySelector("p");

      const rawKeyword = input.value.trim();
      const keyword = encodeURIComponent(rawKeyword);

      // Error messages
      const noKeyword = "Enter a keyword to search.";
      const noSelectOption = "Select search option.";
      const bothError = "Enter a keyword and select search option.";

      // Reset state
      errorEl.style.display = "none";
      input.classList.remove("content-search--hasError");
      select?.classList.remove("content-search--hasError");

      let hasError = false;

      // Validation
      if (!rawKeyword && select && !select.value) {
        errorTextEl.textContent = bothError;
        hasError = true;
        input.classList.add("content-search--hasError");
        select.classList.add("content-search--hasError");
      } else if (!rawKeyword) {
        errorTextEl.textContent = noKeyword;
        hasError = true;
        input.classList.add("content-search--hasError");
      } else if (select && !select.value) {
        errorTextEl.textContent = noSelectOption;
        hasError = true;
        select.classList.add("content-search--hasError");
      }

      if (hasError) {
        errorEl.style.display = "block";
        return;
      }

      // URLs
      const ugUrl = `https://www.nottingham.ac.uk/studywithus/ugstudy/search-results.html?search=${keyword}`;
      const pgUrl = `https://www.nottingham.ac.uk/pgstudy/courses/courses.aspx?search_keywords=${keyword}`;

      // With dropdown
      if (select) {
        if (select.value === "Undergraduate") {
          window.location.href = ugUrl;
        } else if (select.value === "Postgraduate") {
          window.location.href = pgUrl;
        }
      }
      // Without dropdown
      else {
        const type = form.dataset.searchType;

        if (type === "Undergraduate") {
          window.location.href = ugUrl;
        } else if (type === "Postgraduate") {
          window.location.href = pgUrl;
        } else {
          console.warn("No search type defined");
        }
      }
    });
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  const overlays = document.querySelectorAll(".dropdown-overlay"); //background overlay when opening dropdown filter on mobile
  const mobileBreakpoint = 768;

  function isMobile() {
    return window.innerWidth < mobileBreakpoint;
  }

  document.addEventListener("change", function (event) {
    // Check if the changed element is a dropdown option (e.g., checkbox)
    if (event.target.classList.contains("dropdown-option__check")) {
      // Re-query dropdownOptions in case of dynamic elements
      const dropdownOptions = document.querySelectorAll(".dropdown-option__check");

      dropdownOptions.forEach(function (btn) {
        const parent = btn.parentNode;
        if (btn.checked) {
          parent.classList.add("dropdown-option__container--checked");
        } else {
          parent.classList.remove("dropdown-option__container--checked");
        }

        // Removed as this is reundant for native checkbox
        // btn.setAttribute('aria-checked', btn.checked ? 'true' : 'false');
      });
    }
  });

  // Function to update dropdown button to white whiel overlay is active
  function updateButtonWhiteClass() {
    const buttons = document.querySelectorAll(".dropdown-btn");
    const overlayOpen = Array.from(overlays).some((overlay) => overlay.classList.contains("dropdown-overlay--open"));

    buttons.forEach((btn) => {
      if (overlayOpen && isMobile()) {
        btn.classList.add("dropdown-btn--white");
      } else {
        btn.classList.remove("dropdown-btn--white");
      }
    });
  }

  function openDropdown(selectBtn, selectContent) {
    selectBtn.classList.add("dropdown-btn--active");
    selectBtn.setAttribute("aria-expanded", "true");
    selectContent.style.display = "block";
    selectContent.setAttribute("aria-hidden", "false");

    // Move focus into dropdown
    const firstFocusable = selectContent.querySelector('input, button, a, select, textarea, [tabindex]:not([tabindex="-1"])');

    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 0);
    }

    if (overlays.length && isMobile()) {
      overlays.forEach((overlay) => overlay.classList.add("dropdown-overlay--open"));
      updateButtonWhiteClass();
    }
  }

  window.closeDropdown = function (selectBtn, selectContent) {
    selectBtn.classList.remove("dropdown-btn--active");
    selectBtn.setAttribute("aria-expanded", "false");
    selectContent.style.display = "none";
    selectContent.setAttribute("aria-hidden", "true");

    // Return focus to button
    selectBtn.focus();

    if (overlays.length && isMobile()) {
      overlays.forEach((overlay) => overlay.classList.remove("dropdown-overlay--open"));
      updateButtonWhiteClass();
    }
  };

  function closeAllDropdowns() {
    const activeDropdowns = document.querySelectorAll(".dropdown-btn--active");
    activeDropdowns.forEach((activeButton) => {
      const activeDropdownContent = activeButton.nextElementSibling;
      closeDropdown(activeButton, activeDropdownContent);
    });
  }

  // ESC KEY HANDLER
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
      const activeDropdowns = document.querySelectorAll(".dropdown-btn--active");

      if (activeDropdowns.length > 0) {
        event.preventDefault();
        closeAllDropdowns();
      }
    }
  });

  // FOCUS OUTSIDE DROPDOWN HANDLER
  document.addEventListener("focusin", function (event) {
    const activeDropdowns = document.querySelectorAll(".dropdown-btn--active");

    if (activeDropdowns.length === 0) return; // Nothing open

    const isFocusInsideDropdown = Array.from(activeDropdowns).some((activeButton) => {
      const dropdownContent = activeButton.nextElementSibling;
      return activeButton.contains(event.target) || dropdownContent.contains(event.target);
    });

    if (!isFocusInsideDropdown) {
      closeAllDropdowns();
    }
  });

  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("dropdown-btn")) {
      const selectBtn = event.target;
      const selectContent = selectBtn.nextElementSibling;

      if (selectBtn.classList.contains("dropdown-btn--active")) {
        closeDropdown(selectBtn, selectContent);
      } else {
        closeAllDropdowns();
        openDropdown(selectBtn, selectContent);
      }
    } else if (overlays.length && isMobile() && event.target.classList.contains("dropdown-overlay")) {
      closeAllDropdowns();
    } else {
      const activeDropdowns = document.querySelectorAll(".dropdown-btn--active");
      const isClickInsideDropdown = Array.from(activeDropdowns).some((activeButton) => {
        const activeDropdownContent = activeButton.nextElementSibling;
        return activeDropdownContent.contains(event.target);
      });

      if (!isClickInsideDropdown) {
        closeAllDropdowns();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile() && overlays.length) {
      overlays.forEach((overlay) => overlay.classList.remove("dropdown-overlay--open"));
    }
    if (overlays.length) {
      updateButtonWhiteClass();
    }
  });

  const observer = new MutationObserver(() => {
    if (overlays.length) {
      updateButtonWhiteClass();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

// Get the current year
const currentYear = new Date().getFullYear();

// Add current year to the footer copyright span element

const copyCheck = document.querySelector('.footer__copyright-year');
if (copyCheck) {
    copyCheck.innerText = currentYear;
}
// Copy to clipboard UCAS code
document.addEventListener("DOMContentLoaded", function () {
  const copyButtons = document.querySelectorAll(".hero-banner__ucas-copy");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const codeElement = button.querySelector(".hero-banner__ucas-code");
      if (!codeElement) return;

      const code = codeElement.textContent.trim();

      navigator.clipboard
        .writeText(code)
        .then(() => {
          // Update aria-label for accessibility
          const originalLabel = button.getAttribute("aria-label");
          button.setAttribute("aria-label", `${code} copied to clipboard`);
          setTimeout(() => {
            button.setAttribute("aria-label", originalLabel);
          }, 2000);

          // Bounce animation
          const icon = button.querySelector(".hero-banner__ucas-copy-icon");
          if (icon) {
            icon.classList.remove("bounce");
            void icon.offsetWidth; // force reflow
            icon.classList.add("bounce");
          }
        })
        .catch((err) => {
          console.error("Clipboard copy failed:", err);
        });
    });
  });
});

// Add has alert class to hero banner to update faded gradient to increase contrast
document.querySelectorAll(".hero-banner").forEach((banner) => {
  if (banner.querySelector(".alert-card")) {
    banner.classList.add("hero-banner--has-alert");
  }
  if (banner.querySelector(".hero-banner__img")) {
    banner.classList.add("hero-banner--has-img");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const title = document.querySelector(".hero-banner__planCode");
  const params = new URLSearchParams(window.location.search);

  if (title && params.get("planCode") === "true") {
    title.style.display = "inline-block";
  }
});

/*
// Function to open the dropdown and update ARIA attributes for accessibility
function openHubDropdown(hubButtonDropDown, hubButtonDropDownContent) {
  // Add the 'active' class to the hub button, marking it as expanded
  hubButtonDropDown.classList.add("button--hubIcon--active");
  // Set the ARIA attribute for accessibility, indicating the button is now expanded
  hubButtonDropDown.setAttribute("aria-expanded", "true");
  //   update aria label
  hubButtonDropDown.setAttribute("aria-label", "Edit Account Settings, Preferences or Sign out - close nav");
  // Display the dropdown content by setting its style to block
  if (hubButtonDropDownContent) {
    hubButtonDropDownContent.style.display = "block";
    // Update the ARIA attribute to indicate that the dropdown content is now visible
    hubButtonDropDownContent.setAttribute("aria-hidden", "false");
  }
}

// Function to close the dropdown and update ARIA attributes for accessibility
function closeHubDropdown(hubButtonDropDown, hubButtonDropDownContent) {
  // Remove the 'active' class to mark the button as collapsed
  hubButtonDropDown.classList.remove("button--hubIcon--active");
  // Update the ARIA attribute for accessibility to indicate the button is now collapsed
  hubButtonDropDown.setAttribute("aria-expanded", "false");
  //  Update aria label
  hubButtonDropDown.setAttribute("aria-label", "Edit Account Settings, Preferences or Sign out - open nav");
  // Hide the dropdown content by setting its display style to 'none'
  if (hubButtonDropDownContent) {
    hubButtonDropDownContent.style.display = "none";
    // Update the ARIA attribute to indicate the dropdown content is hidden
    hubButtonDropDownContent.setAttribute("aria-hidden", "true");
  }
}

// Add a click event listener to the body to capture all clicks, including on dynamically added elements
document.body.addEventListener("click", function (event) {
  // Dynamically select the hub button and the dropdown content container each time a click occurs
  const hubButtonDropDown = document.querySelector(".button--hubIcon");
  const hubButtonDropDownContent = document.querySelector(".button--container--dropdown");

  // Check if the clicked element is the hub button and the dropdown is not already active
  if (event.target.classList.contains("button--hubIcon") && !hubButtonDropDown.classList.contains("button--hubIcon--active")) {
    openHubDropdown(hubButtonDropDown, hubButtonDropDownContent);
  }
  // If the hub button is clicked and it is already active, close the dropdown
  else if (event.target.classList.contains("button--hubIcon") && hubButtonDropDown.classList.contains("button--hubIcon--active")) {
    closeHubDropdown(hubButtonDropDown, hubButtonDropDownContent);
  }
  // If a element is clicked and the dropdown is active, close the dropdown
  else if (!event.target.classList.contains("button--hubIcon") && hubButtonDropDown.classList.contains("button--hubIcon--active")) {
    closeHubDropdown(hubButtonDropDown, hubButtonDropDownContent);
  }
});

// Close the dropdown if the user presses the Escape key
document.body.addEventListener("keydown", function (event) {
  // Dynamically select the hub button and the dropdown content container each time a keydown occurs
  const hubButtonDropDown = document.querySelector(".button--hubIcon");
  const hubButtonDropDownContent = document.querySelector(".button--container--dropdown");

  // Check if the Escape key is pressed
  if (event.key === "Escape") {
    closeHubDropdown(hubButtonDropDown, hubButtonDropDownContent);
    // Refocus on the parent container of the hub button to maintain keyboard navigation
    hubButtonDropDown.parentElement.focus();
  }
});
*/
const informationBarComponent = document.querySelector(".info-bar--course");

// only run this for course page info bar
if (informationBarComponent) {
  let spacer = null;
  let isMenuOpen = false;
  let previousFocusedElement = null;
  turnOffFixedNavigation = true; // turn off global nav so we dont have two sticky navs
  let activeSectionId = "";

  // === DOM Elements ===
  const infoBar = document.querySelector(".info-bar");
  const infoBarContent = document.querySelector(".info-bar__content");
  const infoBarNav = document.querySelector(".info-bar__nav");
  const buttonsContainer = document.querySelector(".info-bar__container--buttons");
  const menu = document.querySelector(".info-bar__nav-items");
  const toggleMenuBtn = document.querySelector(".info-bar__toggle");
  const arrow = document.querySelector(".info-bar__toggle-arrow");

  function setTabIndex(menu, isTabbable) {
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];
    const focusableElements = menu.querySelectorAll(focusableSelectors.join(","));

    focusableElements.forEach((el) => {
      if (isTabbable) {
        el.removeAttribute("tabindex");
      } else {
        el.setAttribute("tabindex", "-1");
      }
    });
  }

  function isItMobile() {
    return window.innerWidth <= 767;
  }

  let trapKeydownHandler = null;

  function infoBarTrapFocus(container) {
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors.join(","))).filter((el) => el.offsetParent !== null); //  ignore display:none

    if (!focusableElements.length) return;

    previousFocusedElement = document.activeElement;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    trapKeydownHandler = function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", trapKeydownHandler);
    first.focus();
  }

  function infoBarReleaseFocus() {
    if (trapKeydownHandler && infoBarNav) {
      infoBarNav.removeEventListener("keydown", trapKeydownHandler);
      trapKeydownHandler = null;
    }

    if (previousFocusedElement && typeof previousFocusedElement.focus === "function") {
      previousFocusedElement.focus();
    }
  }

  // create spacer div when info bar items become sticky so there is no shift when div dissapears from dom
  function createSpacer(height) {
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.style.height = `${height}px`;
      spacer.style.pointerEvents = "none";
      spacer.style.visibility = "hidden";
      spacer.className = "info-bar__spacer";
      infoBarContent?.parentNode?.insertBefore(spacer, infoBarContent);
    }
  }

  function removeSpacer() {
    if (spacer) {
      spacer.parentNode?.removeChild(spacer);
      spacer = null;
    }
  }

  function resetNavState() {
    infoBarNav.classList.remove("info-bar__nav--open");
    menu.style.display = "";
    menu.removeAttribute("aria-hidden");
    toggleMenuBtn.removeAttribute("aria-expanded");
    arrow.classList.remove("info-bar__toggle-arrow--up", "info-bar__toggle-arrow--down");
    isMenuOpen = false;
    setTabIndex(menu, true);
    document.body.classList.remove("no-scroll");
    infoBarReleaseFocus();
  }

  function resetStickyUI() {
    // reset menu & focus state
    resetNavState();
    // remove all sticky / slide classes
    infoBarNav.classList.remove("info-bar__nav--sticky", "info-bar__nav--slidein", "info-bar__nav--open");

    buttonsContainer.classList.remove("info-bar__buttons--sticky", "info-bar__buttons--slidein");

    infoBarContent.classList.remove("info-bar__content--sticky", "info-bar__content--slidein");

    // remove spacer
    removeSpacer();

    // reset sticky flags
    isSticky = false;
    prevScrollY = window.scrollY;
  }

  function closeCollapsedMenuUI() {
    menu.setAttribute("aria-hidden", "true");
    toggleMenuBtn.setAttribute("aria-expanded", "false");
    arrow.classList.remove("info-bar__toggle-arrow--up");
    arrow.classList.add("info-bar__toggle-arrow--down");
    infoBarNav.classList.remove("info-bar__nav--open");
    setTabIndex(menu, false);
  }

  const infoBarTop = infoBarContent.offsetTop;
  const infoBarBottom = infoBar.offsetTop + infoBar.offsetHeight - infoBarContent.offsetHeight;

  let isSticky = false;
  let prevScrollY = window.scrollY;

  function updateStickyMobile() {
    const triggerPoint = infoBar.offsetTop + infoBar.offsetHeight;
    const shouldStick = window.scrollY >= triggerPoint;
    const currentScrollY = window.scrollY;
    const isScrollingUp = currentScrollY < prevScrollY;
    const isAlreadySticky = infoBarNav.classList.contains("info-bar__nav--sticky");
    const isAlreadySlideIn = infoBarNav.classList.contains("info-bar__nav--slidein") && buttonsContainer.classList.contains("info-bar__buttons--slidein");

    if (shouldStick) {
      //  ADD STICKY ONLY ONCE
      if (!isAlreadySticky) {
        const heightTop = infoBarNav.offsetHeight;
        const heightBottom = buttonsContainer.offsetHeight;
        createSpacer(heightTop + heightBottom);

        infoBarNav.classList.add("info-bar__nav--sticky");
        buttonsContainer.classList.add("info-bar__buttons--sticky");

        if (!isMenuOpen) closeCollapsedMenuUI();
      }

      //  TOGGLE SLIDE-IN BASED ON SCROLL DIRECTION
      if (isScrollingUp) {
        if (!isAlreadySlideIn) {
          infoBarNav.classList.add("info-bar__nav--slidein");
          buttonsContainer.classList.add("info-bar__buttons--slidein");
        }
      } else {
        if (isAlreadySlideIn) {
          infoBarNav.classList.remove("info-bar__nav--slidein");
          buttonsContainer.classList.remove("info-bar__buttons--slidein");
        }
      }
    } else {
      if (isAlreadySticky) {
        resetStickyUI();
      }
    }

    // Update scroll position for next event
    prevScrollY = currentScrollY;
  }

  function updateStickyDesktop() {
    const scrollY = window.scrollY;
    const scrollingUp = scrollY < prevScrollY;

    // STICK: scrolling down past top
    if (!isSticky && scrollY >= infoBarTop) {
      const height = infoBarContent.offsetHeight;
      createSpacer(height);

      infoBarContent.classList.add("info-bar__content--sticky");
      isSticky = true;
    }

    // UNSTICK: scrolling UP past original bottom
    if (isSticky && scrollingUp && scrollY <= infoBarBottom) {
      infoBarContent.classList.remove("info-bar__content--sticky");
      removeSpacer();
      isSticky = false;
    }

    prevScrollY = scrollY;
  }

  function updateStickyClass() {
    const isMobile = isItMobile();

    if (isMobile) {
      updateStickyMobile();
    } else {
      updateStickyDesktop();
    }
  }

  function toggleMenu() {
    const isSticky = infoBarNav.classList.contains("info-bar__nav--sticky");
    if (!isItMobile() || !isSticky || !menu || !toggleMenuBtn || !arrow) return;

    const isOpen = !isMenuOpen;

    toggleMenuBtn.setAttribute("aria-expanded", isOpen);
    menu.setAttribute("aria-hidden", !isOpen);
    setTabIndex(menu, isOpen);
    infoBarNav.classList.toggle("info-bar__nav--open", isOpen);

    arrow.classList.remove("info-bar__toggle-arrow--up", "info-bar__toggle-arrow--down");
    arrow.classList.add(isOpen ? "info-bar__toggle-arrow--up" : "info-bar__toggle-arrow--down");

    isMenuOpen = isOpen;

    if (isOpen) {
      infoBarTrapFocus(infoBarNav);
      document.documentElement.classList.add("no-scroll");
      document.body.classList.add("no-scroll");
    } else {
      infoBarReleaseFocus();
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
    }
  }

  function updateActiveLinkOnScroll() {
    const navLinks = document.querySelectorAll('.info-bar__list-link[href^="#"]');

    activeSectionId = ""; // reset

    const offset = isItMobile() ? 106 : infoBarContent.offsetHeight;

    navLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (!section) return;

      const rect = section.getBoundingClientRect();

      if (rect.top <= offset && rect.bottom > offset) {
        activeSectionId = id;
      }
    });

    navLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      link.classList.toggle("info-bar__list-link--active", id === activeSectionId);
    });
  }

  function updateActiveLinkOnClick(link, e) {
    e.preventDefault();

    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    const offset = isItMobile() ? 106 : infoBarContent.offsetHeight;
    const scrollTo = targetTop - offset + 2;

    window.scrollTo({ top: scrollTo, behavior: "smooth" });

    // close menu on click if it's open
    if (isItMobile() && isMenuOpen) {
      toggleMenu();
    }
  }

  if (toggleMenuBtn) {
    toggleMenuBtn.addEventListener("click", toggleMenu);

    // Close go to section when pressing Escape (if open)
    document.addEventListener("keydown", function (e) {
      if (!isMenuOpen) return;

      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  let wasMobile = isItMobile();

  window.addEventListener("resize", () => {
    const isMobileNow = isItMobile();

    // breakpoint changed
    if (wasMobile && !isMobileNow) {
      // mobile to desktop
      resetStickyUI();
      updateStickyClass();
    }

    if (!wasMobile && isMobileNow) {
      // desktop to mobile
      resetStickyUI();
      updateStickyClass();
    }

    updateActiveLinkOnScroll();

    wasMobile = isMobileNow;
  });

  window.addEventListener("scroll", () => {
    updateStickyClass();
    updateActiveLinkOnScroll();
  });

  document.addEventListener("DOMContentLoaded", () => {
    updateStickyClass();
    updateActiveLinkOnScroll();
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest('.info-bar__list-link[href^="#"]');
    if (link) {
      updateActiveLinkOnClick(link, e);
    }
  });

  document.addEventListener("keydown", (e) => {
    const link = e.target.closest('.info-bar__list-link[href^="#"]');
    if (link && (e.key === "Enter" || e.key === " ")) {
      updateActiveLinkOnClick(link, e);
    }
  });
}


const startDateElement = document.querySelector(".start_date");
const startDate = startDateElement ? startDateElement.innerText.trim() : null;
const ucasCode = startDateElement ? startDateElement.dataset.ucas : null;

if (startDate && ucasCode) {
  const loadData = async () => {
    try {
      const response = await fetch("/bin/uon/coursepages.json");

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      const data = await response.json();
      const courses = Array.isArray(data) ? data : (data.Facilities || []);
      const targetCourses = courses.filter(function(course) {
        return course.ucasCode === ucasCode;
      });

      const heading = document.querySelector(".start_date_heading");
      const yearsList = document.querySelector("#years");
      const yearsWrapper = document.querySelector(".start_date_links");
      const toggleButton = document.querySelector("#start-date-toggle");
      const toggleText = document.querySelector("#start-date-toggle-text");
      const startDateNodes = document.querySelectorAll(".start_date");
      const currentPath = window.location.pathname;

      if (targetCourses.length > 1 && yearsList && yearsWrapper && toggleButton && toggleText) {
        Array.prototype.forEach.call(startDateNodes, function(node) {
          node.setAttribute("aria-hidden", "true");
          node.style.display = "none";
        });

        yearsList.innerHTML = "";

        targetCourses.forEach(function(course) {
          const shortUrl = course.shortUrl || "";
          const courseStartDate = course.startDate || "";

          if (shortUrl && courseStartDate && courseStartDate != startDate) {
            const listItem = document.createElement("li");
            const link = document.createElement("a");

            link.href = shortUrl;
            link.textContent = courseStartDate;
            link.title = courseStartDate;

            listItem.appendChild(link);
            yearsList.appendChild(listItem);
          }
        });

        if (toggleText.textContent === "Select start date") {
          toggleText.textContent = startDate;
        }

        toggleButton.hidden = false;

        yearsWrapper.style.display = "block";

        if (heading) {
          heading.textContent = "Select start date";
        }

        const closeYearsList = function() {
          toggleButton.setAttribute("aria-expanded", "false");
          yearsList.hidden = true;
        };

        toggleButton.addEventListener("click", function(event) {
          event.stopPropagation();
          const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
          toggleButton.setAttribute("aria-expanded", isExpanded ? "false" : "true");
          yearsList.hidden = isExpanded;
        });

        document.addEventListener("click", function(event) {
          if (!yearsWrapper.contains(event.target)) {
            closeYearsList();
          }
        });

        document.addEventListener("keydown", function(event) {
          if (event.key === "Escape") {
            closeYearsList();
          }
        });
      } else {
        if (heading) {
          heading.textContent = "Start date";
          const startDateHide = document.querySelector(".info-bar__nav");
          startDateHide.classList.add("info-bar__start");
        }
      } 
    } catch (error) {
      console.error("Could not fetch data:", error);
    }
  };

  loadData();
}
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Granite === "undefined" || !Granite?.author) return;

  const lastRefreshed = parseInt(document.getElementById("instagramLastRefreshed")?.value || "0", 10);
  const expiresIn = parseInt(document.getElementById("instagramExpiresIn")?.value || "0", 10);

  if (!lastRefreshed || !expiresIn) {
    console.warn("Instagram token refresh info is incomplete.");
    return;
  }

  const now = Date.now();
  const expiryDate = lastRefreshed + expiresIn * 1000;
  const daysRemaining = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

  console.log(daysRemaining);

  if (daysRemaining <= 5) {
    console.warn(`Instagram token expiring in ${daysRemaining} day(s). Refreshing...`);

    fetch("/bin/refresh-instagram-token")
      .then((res) => res.json())
      .then((data) => {
        console.log("Token refreshed automatically:", data);
      })
      .catch((err) => {
        console.error("Token auto-refresh failed:", err);
      });
  }
});

const instagramComponent = document.querySelector(".instagram-posts");
/****************************************************
 * 1) Function to Check If User Has Given Consent
 ****************************************************/
function hasUserConsentedIG() {
  const cookies = document.cookie.split("; ");
  const consentCookie = cookies.find((c) => c.startsWith("OptanonConsent="));

  if (consentCookie) {
    try {
      const decoded = decodeURIComponent(consentCookie);
      const groupsPart = decoded.split("groups=")[1];

      if (groupsPart) {
        const groups = groupsPart.split("&")[0].split(",");
        if (groups.includes("C0002:1")) {
          return true; // Consent is granted
        }
      }
    } catch (err) {
      console.error("Error parsing OneTrust cookie:", err);
    }
  }
  return false; // Default to no consent if cookie is missing or invalid
}

/****************************************************
 * 2) Show Message if Cookies Are Not Enabled
 ****************************************************/

function showFollowUsMessageIG() {
  const container = document.getElementById("card-container");
  document.getElementById("instagram-followUs-message").hidden = false;

  const instagramHeading = document.getElementById("instagram-heading");
  const instagramHeadingMobile = document.getElementById("instagram-heading-mobile");
  instagramHeading.style.display = "none";
  instagramHeadingMobile.style.display = "none";

  if (container) {
    container.innerHTML = "";
  }
}

/****************************************************
 * 3) Blocked Functionality When No Consent is Given
 ****************************************************/
function getInstagramToken() {
  return fetch("/bin/get-instagram-token")
    .then((res) => res.json())
    .then((data) => data.accessToken)
    .catch((err) => {
      console.error("Token fetch failed:", err);
      return null;
    });
}

function getResultIG() {
  const baseUrl = document.getElementById("instagramSourceApiUrl")?.value || "";
  const hashtag = document.getElementById("instagramHashtag")?.value || "";

  return getInstagramToken().then((access_token) => {
    if (!baseUrl || !access_token) {
      console.warn("Missing baseUrl or access token.");
      return null;
    }

    const url = `${baseUrl}?fields=username,media.limit(${
      hashtag ? 400 : 25
    }){comments_count,like_count,media_url,timestamp,caption,media_type,permalink,thumbnail_url}&access_token=${access_token}`;

    return $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
    });
  });
}

/****************************************************
 * 4) Create Instagram Cards
 ****************************************************/
function CreateCardsIG(posts, classes) {
  var ctr = 0;
  $.each(posts, function (key, value) {
    if (ctr == 8) {
      return false;
    }
    let texturl = new String(value.media_type);
    const shortTitle = value.caption ? value.caption.split(/\s+/).slice(0, 10).join(" ") : "";
    const mediaURL = texturl.includes("VIDEO") ? value.thumbnail_url : value.media_url;

    postElement = `<article class="instagram-card post-column ${classes}">
                            <a  target="_blank" rel="noopener noreferrer" aria-label="${shortTitle}... (View on Instagram)  This post has ${value.like_count} likes" href="${value.permalink}">
                            <div class="content-overlay"></div>
                            <div class="card-image">
                                <img loading="lazy"
                                    src="${mediaURL}"
                                    alt="${shortTitle}"
                                    width="308"
                                    height="308"
                                >
                            </div>
                            <div class="card-content">
                                <span class="btn-heart" aria-hidden="true">
                                <span class="fa-heart heart-icon"></span>
                                </span>
                                <span class="likes-count">${value.like_count} likes</span>
                            </div>
                            </a>
                        </article>`;
    $("#card-container").append(postElement);
    ctr++;
  });

  var cards = $(".instagram-card");
  if (cards.length > 6) cards[6].classList.add("no-xs");
  if (cards.length > 7) cards[7].classList.add("no-xs");
}

/****************************************************
 * 5) Load Instagram Cards Only If Consent Is Given
 ****************************************************/

async function LoadInstagramCards() {
  if (!hasUserConsentedIG()) {
    showFollowUsMessageIG(); // Show follow us message
    return;
  }

  try {
    const response = await getResultIG();

    // Get hashtag
    const hashtag = document.getElementById("instagramHashtag")?.value || "";

    // Set posts data
    let posts = response.media.data;

    // If there is hashtag - filter caption and find all posts with hashtag
    if (hashtag) {
      const hashtagRegex = new RegExp(`(^|\\s)#${hashtag}(?=\\s|$|[.,!?])`, "i");
      posts = posts.filter((post) => post.caption && hashtagRegex.test(post.caption));
    }

    if (posts.length) {
      // Hide the follow message if it was previously shown
      document.getElementById("instagram-followUs-message").hidden = true;

      // Display heading and follow us button
      const instagramHeading = document.getElementById("instagram-heading");
      const instagramHeadingMobile = document.getElementById("instagram-heading-mobile");
      instagramHeading.style.display = "flex";
      instagramHeadingMobile.style.display = "block";

      // Display cards
      CreateCardsIG(posts, "");
    } else {
      console.log("There are no instagram posts to display");
      // Display follow us message if there are no posts to display
      document.getElementById("instagram-followUs-message").hidden = false;
    }
  } catch (error) {
    console.error(error);

    // If api fails - display follow us message
    document.getElementById("instagram-followUs-message").hidden = false;
  }
}

/****************************************************
 * 6) Listen for OneTrust Consent Changes & Reload Content
 ****************************************************/

if (instagramComponent) {
  document.addEventListener("click", function (event) {
    const oneTrustSelectorsIG = [
      ".save-preference-btn-handler",
      "#onetrust-accept-btn-handler",
      ".ot-pc-refuse-all-handler",
      "#accept-recommended-btn-handler",
    ];

    if (oneTrustSelectorsIG.some((selector) => event.target.matches(selector))) {
      setTimeout(() => {
        if (hasUserConsentedIG()) {
          LoadInstagramCards(); // Reload Instagram cards if consent is granted
        } else {
          showFollowUsMessageIG(); // Show follow us message
        }
      }, 500); // Timeout for OneTrust processing
    }
  });
}

/****************************************************
 * 7) Load Instagram Cards On Document Ready
 ****************************************************/

if (instagramComponent) {
  LoadInstagramCards();
}

(function () {
  let dataVariationClearing = document.getElementById("dataVariation") ? document.getElementById("dataVariation").value : null;

  if (dataVariationClearing !== "clearingList") return;

  // DOM elements
  const tileContainer = document.querySelector(".listing__tile-container");
  const listingPagination = document.querySelector(".pagination--listing");

  const clearingSearchBar = document.querySelector("#clearing-search-input");
  const clearBtn = document.querySelector(".clearing-search-bar-clear");

  const homeButton = document.querySelector(".clearing-filter-button--home");
  const internationalButton = document.querySelector(".clearing-filter-button--int");

  // Pagination
  const itemsPerPageElement = document.getElementById("itemsPerPage");
  const itemsPerPage = itemsPerPageElement ? parseInt(itemsPerPageElement.value, 10) : 10;

  let pagination;

  // Data storage
  let originalData = [];
  let Data = [];

  // URL params
  const params = new URLSearchParams(window.location.search);
  const studentParam = params.get("student") || "home";

  // API endpoint
  const DATA_URL = "/bin/uon/coursepages.json";

  // Map clearing options
  const clearingValueMap = {
    home: ["openToAll", "openToUkStudentOnly"],
    international: ["openToAll", "openToInternationalOnly"],
  };

  // Current variation
  let variation = studentParam;

  // ==============================
  // Utility functions
  // ==============================

  function scrollToResults(focusTile = true) {
    const filterBar = document.querySelector(".listing");
    const firstTileLink = tileContainer.querySelector(".cmp-tile--clearing-title-link");

    setTimeout(() => {
      if (filterBar) {
        filterBar.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (focusTile && firstTileLink) {
        firstTileLink.focus({ preventScroll: true });
      }
    }, 100);
  }

  function updateURLParameter(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, "", url);
  }

  function setHomeIntActive(button) {
    homeButton.setAttribute("aria-checked", "false");
    internationalButton.setAttribute("aria-checked", "false");

    button.setAttribute("aria-checked", "true");
    button.checked = true;
  }

  function toggleDescriptionVisibility(type) {
    const homeDescription = document.querySelector(".listing__description");
    const internationalDescription = document.querySelector(".listing__description--international");

    if (!homeDescription || !internationalDescription) return;

    if (type === "home") {
      homeDescription.style.display = "block";
      internationalDescription.style.display = "none";
    } else {
      homeDescription.style.display = "none";
      internationalDescription.style.display = "block";
    }
  }

  // ==============================
  // Filtering
  // ==============================

  function applyFilters() {
    let filteredData = [...originalData];

    // Home / international filter
    const values = clearingValueMap[variation];

    filteredData = filteredData.filter((course) => values.includes(course.clearingOpenOptions));

    // Search filter
    const query = clearingSearchBar.value.trim().toLowerCase();
    const queryWords = query.split(" ");

    if (query) {
      filteredData = filteredData
        .filter((course) => {
          const searchable = `
        ${course.title || ""}
        ${course.subject || ""}
        ${course.description || ""}
      `.toLowerCase();

          return queryWords.every((word) => searchable.includes(word));
        })

        // Relevance sort
        .sort((a, b) => {
          const aTitle = (a.title || "").toLowerCase();
          const bTitle = (b.title || "").toLowerCase();

          function rank(title) {
            if (title === query) return 1;
            if (title.startsWith(query)) return 2;
            if (title.includes(query)) return 3;
            return 4;
          }

          const aRank = rank(aTitle);
          const bRank = rank(bTitle);

          if (aRank !== bRank) return aRank - bRank;

          if (aRank === 3 && bRank === 3) {
            const aIndex = aTitle.indexOf(query);
            const bIndex = bTitle.indexOf(query);

            if (aIndex !== bIndex) return aIndex - bIndex;
          }

          if (aTitle.length !== bTitle.length) {
            return aTitle.length - bTitle.length;
          }

          return aTitle.localeCompare(bTitle);
        });
    }

    Data = filteredData;

    pagination.setTotalItems(Data.length);
    pagination.goToPage(1);
  }

  // ==============================
  // Rendering
  // ==============================

  function renderData(startIndex, endIndex) {
    tileContainer.innerHTML = "";

    if (Data.length === 0) {
      tileContainer.appendChild(renderNoResultsTxt("No results!", "Please try a different search or change your filters"));

      return;
    }

    const items = Data.slice(startIndex, endIndex);

    const html = items.map((record) => renderClearingCourseCard(record)).join("");

    tileContainer.innerHTML = html;
  }

  // ==============================
  // Data fetching
  // ==============================

  async function fetchData() {
    try {
      const response = await fetch(DATA_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch clearing data");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function filterClearing(courses) {
    return courses.filter((course) => course.clearingOpen === "open").sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }

  async function loadData() {
    const data = await fetchData();

    if (!data) return;

    originalData = filterClearing(data.Facilities);

    Data = [...originalData];

    pagination = initPagination({
      container: listingPagination,
      totalItems: Data.length,
      itemsPerPage,

      onRenderPage: (startIndex, endIndex) => {
        renderData(startIndex, endIndex);
      },
      onAfterRender: () => {
        scrollToResults();
      },
    });

    applyFilters();
  }

  // ==============================
  // Events
  // ==============================

  // Search input
  clearingSearchBar.addEventListener("input", (e) => {
    if (e.target.value.length > 0) {
      clearBtn.style.display = "block";
      clearBtn.style.opacity = "1";
      clearBtn.setAttribute("aria-hidden", "false");
      clearBtn.setAttribute("tabindex", "0");
    } else {
      clearBtn.style.display = "none";
      clearBtn.style.opacity = "0";
      clearBtn.setAttribute("aria-hidden", "true");
      clearBtn.setAttribute("tabindex", "-1");
    }
  });

  clearingSearchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      applyFilters();
      scrollToResults();
    }
  });

  clearBtn.addEventListener("click", () => {
    clearingSearchBar.value = "";
    clearBtn.style.display = "none";
    clearBtn.setAttribute("aria-hidden", "true");
    clearBtn.setAttribute("tabindex", "-1");

    applyFilters();

    clearingSearchBar.focus();
  });

  // Home button
  homeButton.addEventListener("click", () => {
    variation = "home";

    setHomeIntActive(homeButton);
    toggleDescriptionVisibility("home");

    updateURLParameter("student", "home");

    applyFilters();
    scrollToResults(false); // scroll only
  });

  // International button
  internationalButton.addEventListener("click", () => {
    variation = "international";

    setHomeIntActive(internationalButton);
    toggleDescriptionVisibility("international");

    updateURLParameter("student", "international");

    applyFilters();
    scrollToResults(false); // scroll only
  });

  // ==============================
  // initClearing
  // ==============================

  function initClearing() {
    if (variation === "home") {
      setHomeIntActive(homeButton);
    } else {
      setHomeIntActive(internationalButton);
    }

    toggleDescriptionVisibility(variation);

    loadData();
  }

  initClearing();
})();

// Listing variation objects
const dataHandlers = {
  recentlyViewed: {
    sortKey: "title",
    card: null, // Initially null, will be set dynamically
    url: "", // picked up from localstorage
    filters: {},
  },
  courses: {
    sortKey: "title",
    card: renderCourseCard,
    url: "/bin/uon/coursepages.json",
    filters: {
      clearingOpenOptions: "Clearing",
      location: "Location",
      subject: "Subject",
      startDate: "Start date",
    },
  },
  articles: {
    sortKey: "title",
    card: renderArticleCard,
    url: "/bin/uon/readjsonservice.allarticles.json",
    filters: {
      articleType: "Article type",
    },
  },
};

let dataVariation = document.getElementById("dataVariation") ? document.getElementById("dataVariation").value : null;

const currentHandler = dataHandlers[dataVariation]; // What we are working with on current page

if (currentHandler) {
  const filterBarContainer = document.querySelector(".listing__filter-bar-container"); // Container for filters
  const tileContainer = document.querySelector(".listing__tile-container"); // Container for tiles
  const newSessionObject = window.localStorage.getItem("journeyDetails"); // Fetch data from local storage
  let Data = []; // Store filtered or manipulated data
  let originalData = []; // Store unmodified data as fetched from the API. For example, when you apply filters, the data in originalData is filtered and the result is stored in Data and when sorting or pagination is applied, Data is updated accordingly.

  // Pagination variables
  let pagination; // pagination variable for initialization
  const itemsPerPageElement = document.getElementById("itemsPerPage");
  const itemsPerPage = itemsPerPageElement ? parseInt(itemsPerPageElement.value, 10) : 10; // Default to 10 if missing
  const listingPagination = document.querySelector(".pagination--listing");

  // Get url params
  const params = new URLSearchParams(window.location.search);

  // Get search query from url
  const searchQuery = params.get("search")?.trim().toLowerCase();
  const queryWords = searchQuery ? searchQuery.split(/\s+/) : [];

  // Restore dropdown + sort state from query string
  function applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    document.querySelectorAll(".dropdown-wrapper").forEach((wrapper) => {
      const button = wrapper.querySelector(".dropdown-btn");
      const filterType = button?.dataset?.value;
      const clearFilter = wrapper.querySelector(".clear-filter");

      if (!filterType) return;

      if (filterType === "sort") {
        // Restore sort radio selection
        const sortValue = params.get("sort");
        const radioButtons = wrapper.querySelectorAll('.dropdown-option__check[type="radio"]');

        radioButtons.forEach((radio) => {
          radio.checked = radio.value === sortValue;
        });

        // Update button text and checked classes
        updateButtonText(button, radioButtons, clearFilter, "radio", "Sort");

        // Add checked class to selected option container
        wrapper.querySelectorAll(".dropdown-option__container").forEach((el) => {
          const input = el.querySelector(".dropdown-option__check");
          el.classList.toggle("dropdown-option__container--checked", input.checked);
        });
      } else {
        // Restore checkbox filters

        const values = params.get(filterType)?.split(",") || [];

        const checkboxes = wrapper.querySelectorAll('.dropdown-option__check[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
          checkbox.checked = values.includes(checkbox.value);
          checkbox.parentNode.classList.toggle("dropdown-option__container--checked", checkbox.checked);
        });

        // Update button text
        updateButtonText(button, checkboxes, clearFilter, "checkbox", button.textContent);
      }
    });
  }

  // General function to handle both radio and checkbox dropdowns
  function setupDropdown(button, options, clearFilter, type, originalButtonText) {
    const clearFilterButton = clearFilter.querySelector(".clear-filter__btn");

    // Attach event listener for changes
    options.forEach((option) => {
      option.addEventListener("change", () => {
        updateButtonText(button, options, clearFilter, type, originalButtonText);
        applyFilters(); // Apply filters immediately when selection changes
      });
    });

    // Initialize button text and clear filter visibility based on current state
    updateButtonText(button, options, clearFilter, type, originalButtonText);

    // Reset options when clear filter button is clicked
    clearFilterButton.addEventListener("click", () => {
      resetOptions(options);
      updateButtonText(button, options, clearFilter, type, originalButtonText);
      applyFilters(); // Reapply filters after reset to update results
    });
  }

  // Update button text based on selected options
  function updateButtonText(button, options, clearFilter, type, originalButtonText) {
    let selectedCount = 0;

    if (type === "radio") {
      const selectedOption = Array.from(options).find((option) => option.checked);
      if (selectedOption) {
        button.textContent = selectedOption.value;
        selectedCount = 1; // Only one radio button can be selected at a time
      } else {
        button.textContent = originalButtonText;
      }
    } else if (type === "checkbox") {
      selectedCount = Array.from(options).filter((option) => option.checked).length;
      if (selectedCount > 0) {
        button.textContent = `${originalButtonText} (${selectedCount})`;
      } else {
        button.textContent = originalButtonText;
      }
    }

    button.classList.toggle("dropdown-btn--selected", selectedCount > 0);
    clearFilter.style.display = selectedCount > 0 ? "block" : "none";
  }

  // Reset all options (checkbox or radio)
  function resetOptions(options) {
    options.forEach((option) => {
      option.checked = false;
      option.parentNode.classList.remove("dropdown-option__container--checked");
    });
  }

  // Apply filters based on selected dropdown options
  function applyFilters() {
    syncFiltersToURL();
    const filters = getSelectedFilters();
    let filteredData = [...originalData]; // Work with a copy of the original data

    // Apply each selected filter dynamically
    filters.forEach(({ filterType, selectedValues }) => {
      if (selectedValues.length > 0) {
        let valuesToMatch = [...selectedValues];

        if (filterType === "clearingOpenOptions") {
          const shouldIncludeAllStudents = valuesToMatch.some(
            (val) => val === "openToInternationalOnly" || val === "openToUkStudentOnly"
          );

          if (shouldIncludeAllStudents && !valuesToMatch.includes("openToAll")) {
            valuesToMatch.push("openToAll");
          }
        }

        // strip commas from course data and selected values
        filteredData = filteredData.filter((course) => {
          return valuesToMatch.some((val) => {
            const courseVal = (course[filterType] || "").replace(/,/g, "").toLowerCase().trim();
            const normalizedVal = val.replace(/,/g, "").toLowerCase().trim();

            if (filterType === "clearingOpenOptions") {
              return course.clearingOpen === "open" && courseVal.includes(normalizedVal);
            }

            return courseVal.includes(normalizedVal);
          });
        });
      }
    });

    // Apply sorting if selected
    const sortOrder = getSortOrder();
    if (sortOrder) {
      filteredData = sortData(filteredData, sortOrder);
    }

    Data = filteredData; // Update the data array and re-render

    // Reset pagination to the first page after filtering
    pagination.setTotalItems(Data.length);
    pagination.goToPage(1);
  }

  // Get selected filters dynamically (Subject, StartDate, Location, etc.)
  function getSelectedFilters() {
    const filters = [];
    const dropdownWrappers = document.querySelectorAll(".dropdown-wrapper");

    dropdownWrappers.forEach((wrapper) => {
      const button = wrapper.querySelector(".dropdown-btn");
      const filterType = button.dataset.value; // Get the filter type (e.g., 'startDate', 'location')
      const checkboxes = wrapper.querySelectorAll('.dropdown-option__check[type="checkbox"]:checked');

      let selectedValues = [];
      if (checkboxes.length) {
        selectedValues = Array.from(checkboxes).map((checkbox) => checkbox.value);
      }

      // If there are selected values, add the filter to the array
      if (selectedValues.length > 0) {
        filters.push({ filterType, selectedValues });
      }
    });

    return filters;
  }

  // Apply filters to query string
  function syncFiltersToURL() {
    const url = new URL(window.location);

    // Remove existing filter params
    Object.keys(currentHandler.filters).forEach((key) => {
      url.searchParams.delete(key);
    });
    url.searchParams.delete("sort");

    // Add active dropdown filters
    const filters = getSelectedFilters();

    filters.forEach(({ filterType, selectedValues }) => {
      if (selectedValues.length) {
        url.searchParams.set(filterType, selectedValues.join(","));
      }
    });

    // Add sort
    const sortOrder = getSortOrder();
    if (sortOrder) {
      url.searchParams.set("sort", sortOrder);
    }

    window.history.replaceState({}, "", url);
  }

  // Get selected sort order (A-Z or Z-A)
  function getSortOrder() {
    const selectedRadio = document.querySelector('.dropdown-wrapper #sortOptions input[type="radio"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  }

  // Sort data dynamically
  function sortData(items, sortOrder) {
    return items.sort((a, b) => {
      const key = currentHandler.sortKey;

      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      // If both values are null/undefined, keep their relative order
      if (!aValue && !bValue) return 0;
      // If only a is null/undefined, push it to the end
      if (!aValue) return 1;
      // If only b is null/undefined, push it to the end
      if (!bValue) return -1;

      return sortOrder === "A to Z" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }

  // Update listing title if there is search query
  function updateSearchTitle() {
    if (!searchQuery) return;

    const titleElement = document.querySelector(".listing__title");

    if (!titleElement) return;

    titleElement.textContent = `Results for "${searchQuery}"`;
  }

  updateSearchTitle();

  // Filtering logic for courses to only return items with at least title and start date, and only if not hidden in sitemap
  // Also checks with search parameter is in the query string

  function filterCourses(courses) {
    return (
      courses
        .filter((course) => course.title && course.startDate && course.hideinsitemap !== true)

        // Search filter
        .filter((course) => {
          // No search param? Return everything.
          if (!searchQuery) return true;

          const searchable = `
        ${course.title || ""}
        ${course.clearingOpenOptions || ""}
        ${course.subject || ""}
        ${course.description || ""}
        ${course.location || ""}
        ${course.qualification || ""}
        ${course.ucasCode || ""}
      `.toLowerCase();

          // Every word must exist somewhere in the combined text
          return queryWords.every((word) => searchable.includes(word));
        })

        // Sort with relevance
        .sort((a, b) => {
          // === RELEVANCE SORT (only when searching) ===
          if (searchQuery) {
            const aTitle = (a.title || "").toLowerCase();
            const bTitle = (b.title || "").toLowerCase();

            function rank(title) {
              if (title === searchQuery) return 1; // exact
              if (title.startsWith(searchQuery)) return 2; // starts with
              if (title.includes(searchQuery)) return 3; // contains
              return 4; // other
            }

            const aRank = rank(aTitle);
            const bRank = rank(bTitle);

            // Compare relevance first
            if (aRank !== bRank) return aRank - bRank;

            // If both contain, prioritise closest one
            if (aRank === 3 && bRank === 3) {
              const aIndex = aTitle.indexOf(searchQuery);
              const bIndex = bTitle.indexOf(searchQuery);
              if (aIndex !== bIndex) return aIndex - bIndex;
            }

            // Shorter title ranks higher
            if (aTitle.length !== bTitle.length) {
              return aTitle.length - bTitle.length;
            }
          }

          // === default sorting by title and date ===
          const dateA = new Date(courseDateToISO(a.startDate)).getTime();
          const dateB = new Date(courseDateToISO(b.startDate)).getTime();

          if (dateB !== dateA) {
            return dateB - dateA;
          }

          return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
        })
    );
  }

  // Converts "Sep 2025" to "2025-09-01"
  function courseDateToISO(dateStr) {
    const [monthStr, yearStr] = dateStr.split(" ");
    const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth() + 1;
    const monthPadded = String(month).padStart(2, "0");
    return `${yearStr}-${monthPadded}-01`;
  }

  // Utility function to filter out duplicate values
  function getUniqueValues(data, field) {
    return [...new Set(data.map((item) => item[field]))].filter(Boolean).sort(); // Alphabetically sorted
  }

  // Render filters
  function renderFilters() {
    filterBarContainer.innerHTML = ""; // Clear previous results

    renderSortFilter(); // Render sort filter

    // Dynamically fetch unique filter values based on data variation
    for (const filterKey in currentHandler.filters) {
      if (currentHandler.filters.hasOwnProperty(filterKey)) {
        const uniqueValues = getUniqueValues(originalData, filterKey);
        // Render the corresponding filter only if there are any dropdown values
        if (uniqueValues.length != 0) {
          renderFiltersForKey(filterKey, uniqueValues);
        }
      }
    }
  }

  function renderFiltersForKey(filterKey, uniqueValues) {
    const filterDisplayText = currentHandler.filters[filterKey];
    let valuesToRender = uniqueValues;

    if (filterKey === "clearingOpenOptions") {
      valuesToRender = uniqueValues.filter((value) => value !== "openToAll");
    }

    renderDropdown(filterBarContainer, filterDisplayText, valuesToRender, filterKey);
  }

  // Render sort filter dropdown
  function renderSortFilter() {
    const sortWrapper = document.createElement("div");
    sortWrapper.classList.add("dropdown-wrapper");
    filterBarContainer.appendChild(sortWrapper);

    // Create the Sort dropdown button
    const sortButtonHTML = `
        <button class="dropdown-btn dropdown-btn--round" aria-label="Select Sort order" aria-expanded="false" aria-haspopup="listbox" aria-controls="sortOptions" data-value="sort">Sort</button>
      `;

    sortWrapper.innerHTML = sortButtonHTML;

    // Create the dropdown list for sort options (A-Z and Z-A)
    const sortListHTML = `
        <ul class="dropdown-list" id="sortOptions" role="group" aria-hidden="true">
          <li class="dropdown-list__item">
            <label for="AToZ" class="dropdown-option">
              <span class="dropdown-option__container">
                <input class="dropdown-option__check" type="radio" name="sortOption" id="AToZ" value="A to Z">
                <span class="dropdown-option__label">A-Z</span>
              </span>
            </label>
          </li>
          <li class="dropdown-list__item">
            <label for="ZToA" class="dropdown-option">
              <span class="dropdown-option__container">
                <input class="dropdown-option__check" type="radio" name="sortOption" id="ZToA" value="Z to A">
                <span class="dropdown-option__label">Z-A</span>
              </span>
            </label>
          </li>
          <li class="dropdown-list__item clear-filter" id="clearFilterAToZ">
            <button class="clear-filter__btn">Clear Filter</button>
          </li>
        </ul>
      `;

    sortWrapper.innerHTML += sortListHTML;

    const button = sortWrapper.querySelector(".dropdown-btn");
    const clearFilter = sortWrapper.querySelector(".clear-filter");
    const radioButtons = sortWrapper.querySelectorAll('.dropdown-option__check[type="radio"]');
    const originalButtonText = button.textContent.trim();

    // Initialize the sort filter just like the other dropdowns
    setupDropdown(button, radioButtons, clearFilter, "radio", originalButtonText);
  }

  // Render filter dropdown
  function renderDropdown(container, filterType, options, jsonKey) {
    if (!options || options.length === 0) return;

    // turn option text into a safe HTML id
    function makeSafeId(text) {
      return text
        .toLowerCase()
        .trim()
        .replace(/&/g, "and") // replace ampersands
        .replace(/[^a-z0-9]+/g, "-") // replace spaces & special chars with -
        .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
    }

    // Create dropdown wrapper and append it
    const dropdownWrapper = document.createElement("div");
    dropdownWrapper.classList.add("dropdown-wrapper");
    container.appendChild(dropdownWrapper);

    const clearingFilterToggle = document.getElementById("clearingFilter") ? document.getElementById("clearingFilter").value === "true" : false;

    // If this is the clearing filter and the toggle is off, don't render it
    if (jsonKey === "clearingOpenOptions" && !clearingFilterToggle) {
      dropdownWrapper.remove();
      return;
    }

    // Create button for the dropdown using template strings
    const buttonHTML = `
        <button class="dropdown-btn dropdown-btn--round" aria-label="Select ${filterType} dropdown" aria-expanded="false" aria-haspopup="true" data-value="${jsonKey}">${filterType}</button>
      `;
    dropdownWrapper.innerHTML = buttonHTML;

    const button = dropdownWrapper.querySelector(".dropdown-btn");

    // Create the list of options using template strings
    const allowedClearingOptions = [
      "openToUkStudentOnly",
      "openToInternationalOnly"
    ];

    //Change order for clearing options to show UK students first, then international students, if both are present
    const orderedOptions = [...options]
      .filter((option) => allowedClearingOptions.includes(option))
      .sort((a, b) => {
        const order = {
          openToUkStudentOnly: 1,
          openToInternationalOnly: 2
        };

        return order[a] - order[b];
      });

      if(jsonKey === "clearingOpenOptions") {
        options = orderedOptions;
      }

    // Create the list of options using template strings
    const dropdownListHTML = options
      .map((option) => {
        const safeId = `${jsonKey}-${makeSafeId(option)}`;
        var clearingOption;
        if (option == "openToUkStudentOnly") {
          clearingOption = "UK students";
        } 
        else if (option == "openToInternationalOnly") {
          clearingOption = "International students";
        }

        return `
          <li class="dropdown-list__item">
            <label class="dropdown-option dropdown-option--checkmark" for="${safeId}">
              <span class="dropdown-option__container">
                <input class="dropdown-option__check" type="checkbox" id="${safeId}" value="${option.replace(/,/g, "")}">
                <span class="dropdown-option__select"></span>
                <span class="dropdown-option__label">${clearingOption ? clearingOption : option}</span>
              </span>
            </label>
          </li>
        `;
      })
      .join("");

    const dropdownList = document.createElement("ul");
    dropdownList.setAttribute("role", "group");
    dropdownList.setAttribute("aria-hidden", "true");
    dropdownList.classList.add("dropdown-list");
    dropdownList.innerHTML = dropdownListHTML;
    dropdownWrapper.appendChild(dropdownList);

    // Add Clear Filter Button using template strings
    const clearFilterHTML = `
        <li class="dropdown-list__item clear-filter">
          <button class="clear-filter__btn">Clear Filter</button>
        </li>
      `;
    dropdownList.innerHTML += clearFilterHTML;

    const clearFilter = dropdownList.querySelector(".clear-filter");

    // Set up the dropdown (e.g., event listeners)
    setupDropdown(button, dropdownList.querySelectorAll(".dropdown-option__check"), clearFilter, "checkbox", filterType);
  }

  // Render cards to the dom
  function renderData(startIndex, endIndex) {
    tileContainer.innerHTML = ""; // Clear previous results

    if (Data.length === 0) {
      // If no data, render a "No results found" message
      tileContainer.appendChild(renderNoResultsTxt("No results!", "Please try a different search or change your filters"));
      return;
    }

    // Calculate the range of items to display for the current page
    const itemsToDisplay = Data.slice(startIndex, endIndex);

    let cardHTML = null;

    if (dataVariation === "recentlyViewed") {
      cardHTML = itemsToDisplay
        .map((record) => {
          if (record.carousalType === "course") {
            return renderCourseCard(record);
          } else {
            return renderArticleCard(record);
          }
        })
        .join("");
    } else {
      cardHTML = itemsToDisplay
        .map((record) => {
          return currentHandler.card(record);
        })
        .join("");
    }

    tileContainer.innerHTML = cardHTML; // Append all cards at once
  }

  // Fetch data
  async function fetchData() {
    let data = [];

    if (dataVariation === "recentlyViewed") {
      const sessionData = JSON.parse(newSessionObject);

      if (!sessionData) {
        console.error("No session data found in localStorage.");
        return null;
      } else {
        const recentlyViewedData = sessionData.recentlyViewed || [];
        data = recentlyViewedData;
        return data;
      }
    } else {
      // Check if currentHandler.url is valid
      if (!currentHandler.url || currentHandler.url.trim() === "") {
        console.error("Invalid json. Unable to fetch data.");
        return null;
      }

      try {
        const response = await fetch(currentHandler.url);

        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${currentHandler.url}`);
        }

        data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }

  async function loadVariationData() {
    const data = await fetchData(); // get data

    if (data) {
      // Handle different data variations
      switch (dataVariation) {
        case "courses":
          originalData = filterCourses(data.Facilities);
          break;
        case "articles":
        case "recentlyViewed":
          originalData = [...data];
          break;
        default:
          originalData = [...data];
      }
    } else {
      originalData = []; // just use empty data string
    }

    Data = [...originalData]; // Initial Data setup

    // Initialize pagination
    pagination = initPagination({
      container: listingPagination,
      totalItems: Data.length,
      itemsPerPage,
      onRenderPage: (startIndex, endIndex) => {
        renderData(startIndex, endIndex); // Render data for current page
      },
      onAfterRender: () => {
        // Focus and scroll into view
        let filterBar = document.querySelector(".listing");
        let firstTileLink = tileContainer.querySelector(".cmp-tile a");

        setTimeout(() => {
          if (filterBar) {
            filterBar.scrollIntoView({
              behavior: "smooth", // smooth scroll
              block: "start", // align to top of viewport
            });
          }

          if (firstTileLink) {
            firstTileLink.focus({ preventScroll: true }); // focus without jumping
          }
        }, 100); // 100ms delay
      },
    });

    renderFilters(); // Render filters
    applyFiltersFromURL();
    applyFilters();
  }

  if (dataVariation) {
    loadVariationData();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();

      const targetSelector = trigger.getAttribute("data-target");
      const modal = trigger.closest(".modal").querySelector(targetSelector);
      const modalWrapper = modal.closest(".modal-popup");

      if (modalWrapper) {
        openModal(modalWrapper, trigger);
      }
    });
  });

  function openModal(modalWrapper, triggerButton) {
    const modalDialog = modalWrapper.querySelector(".modal-popup__dialog");
    const closeBtn = modalWrapper.querySelector(".modal-popup__close-btn");

    // Show modal
    modalWrapper.classList.add("modal-popup--visible");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    triggerButton.setAttribute("aria-expanded", "true");

    // Focusable elements
    const focusableElements = modalDialog.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    // Focus trap
    function trapFocus(e) {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    // Escape key to close
    function handleEscape(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    // Click outside to close
    function handleOutsideClick(e) {
      if (e.target === modalWrapper) {
        closeModal();
      }
    }

    function closeModal() {
      modalWrapper.classList.remove("modal-popup--visible");
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
      triggerButton.setAttribute("aria-expanded", "false");

      document.removeEventListener("keydown", trapFocus);
      document.removeEventListener("keydown", handleEscape);
      modalWrapper.removeEventListener("click", handleOutsideClick);

      // Restore focus to trigger
      triggerButton.focus();
    }

    // Bind events
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", trapFocus);
    document.addEventListener("keydown", handleEscape);
    modalWrapper.addEventListener("click", handleOutsideClick);

    // Focus modal or first element
    if (firstEl) {
      firstEl.focus();
    } else {
      modalDialog.focus(); // fallback
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const moduleTimeUpdate = document.querySelector(".modulesContainer__footer--disclaimer");

  if (moduleTimeUpdate) {
    const metaLastModified = document.querySelector(
      'meta[property="lastModified"]'
    );

    if (metaLastModified) {
      const getDate = metaLastModified.getAttribute("content");

      if (getDate) {
        moduleTimeUpdate.innerHTML =
          moduleTimeUpdate.innerHTML.replace("LASTMODDATE", getDate);
      }
    }
  }
});
// Selectors
const navDropdown = document.getElementById("navDropdown");
const openNavBtn = document.getElementById("openNav");
const closeNavBtn = document.getElementById("closeNav");
const navBackground = document.querySelector(".navigation-bar-bg");
const signBtnContainer = document.querySelector("#navMobile");

// Function to handle opening the nav dropdown
function openNav() {
  const navItems = navDropdown.querySelectorAll(".navigation-bar__nav-item");

  // Add open class to navbar
  navDropdown.classList.add("open");

  // Focus to navDropdown
  navDropdown.focus();

  // Update ARIA attributes
  updateAriaAttributes(openNavBtn, true, true, "-1");
  updateAriaAttributes(closeNavBtn, true, false, "0");
  navDropdown.setAttribute("aria-hidden", "false");

  // Change tabindex
  changeTabindex(navItems);

  // Trap focus
  trapFocus(navDropdown);

  // Add overlay
  const navBackground = document.querySelector(".navigation-bar-bg");
  if (navBackground) {
    navBackground.classList.add("open");
  }
}

// if user presses escape key, close the nav dropdown
var navOpenEscape = document.querySelector(".navigation-bar");
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navOpenEscape.classList.contains("open")) {
    console.log("Escape key pressed");
    closeNav();
  }
});

// Function to handle closing the nav dropdown
function closeNav() {
  const navItems = navDropdown.querySelectorAll(".navigation-bar__nav-item a");

  // Remove open class
  navDropdown.classList.remove("open");

  // Focus to openNavBtn
  openNavBtn.focus();

  // Update ARIA attributes
  updateAriaAttributes(openNavBtn, false, false, "0");
  updateAriaAttributes(closeNavBtn, false, true, "-1");
  navDropdown.setAttribute("aria-hidden", "true");

  // Set all tabindexes to -1
  navItems.forEach((link) => {
    link.setAttribute("tabindex", "-1");
  });

  // Remove focus trap when closed
  removeFocusTrap(navDropdown);

  // Remove background overlay
  const navBackground = document.querySelector(".navigation-bar-bg");
  if (navBackground) {
    navBackground.classList.remove("open");
  }
}

// Function to update tabindex
function changeTabindex(arr) {
  arr.forEach((link) => {
    // Check if the link's display property is block because sign in buttons are not always displayed as block
    const linkStyle = window.getComputedStyle(link);
    const anchor = link.querySelector("a");

    if (linkStyle.display === "block" || linkStyle.display === "flex") {
      // If the display is block, set tabindex of the anchor element inside the link to 0
      if (anchor) {
        anchor.setAttribute("tabindex", "0");
      }
    } else {
      if (anchor) {
        anchor.setAttribute("tabindex", "-1");
      }
    }
  });
}

// Function to update ARIA attributes
function updateAriaAttributes(element, expanded, hidden, tabindex) {
  element.setAttribute("aria-expanded", expanded);
  element.setAttribute("aria-hidden", hidden);
  element.setAttribute("tabindex", tabindex);
}

// Function to trap focus inside the nav dropdown
function trapFocus(navDropdown) {
  const focusableElements = navDropdown.querySelectorAll('a[tabindex="0"], button[tabindex="0"], input[tabindex="0"], [tabindex="0"]');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Handle the tab and shift+tab keypresses for focus cycling
  navDropdown.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift+Tab (backwards)
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  // Focus the first element when dropdown opens
  firstFocusable.focus();
}

// Function to remove focus trap
function removeFocusTrap(navDropdown) {
  navDropdown.removeEventListener("keydown", trapFocus); // Stop trapping focus
}

// Function to toggle active class for mobile only navigation links
function toggleSignBtn() {
  if (signBtnContainer) {
    // Toggle the visibility of the sign button based on screen width
    if (window.innerWidth <= 768) {
      // Show the container and set aria-hidden to false (visible)
      signBtnContainer.classList.add("active");
      signBtnContainer.setAttribute("aria-hidden", "false");
    } else {
      // Hide the container and set aria-hidden to true (hidden)
      signBtnContainer.classList.remove("active");
      signBtnContainer.setAttribute("aria-hidden", "true");
    }
  }
}

// Load event listeners if navigation is on the page
if (navDropdown) {
  // Add event listeners for the buttons
  document.body.addEventListener("click", function (event) {
    // Check if the click is inside the navDropdown
    const isClickInsideNavDropdown = navDropdown.contains(event.target);

    // If the click occurred on the open button and the dropdown is not open, open the nav
    if (event.target === openNavBtn && !navDropdown.classList.contains("open")) {
      openNav();
    }
    // If the click occurred on the close button and nav is open, close the nav
    else if (event.target === closeNavBtn && navDropdown.classList.contains("open")) {
      closeNav();
    }
    // If the dropdown is open and the click is outside the navDropdown, close the dropdown
    else if (!isClickInsideNavDropdown && navDropdown.classList.contains("open")) {
      closeNav();
    }
  });

  // Check if mobile links should be visible
  toggleSignBtn();

  // Run changetabindex and togglesignbtn on window resize if navbar container is open
  window.addEventListener("resize", () => {
    const navItems = navDropdown.querySelectorAll(".navigation-bar__nav-item");
    if (navDropdown.classList.contains("open")) {
      changeTabindex(navItems);
    }
    toggleSignBtn();
  });
}

// Selectors
const navigationSearchMobile = document.querySelector(".navigation-options .button--icon--single--medium--search");
const navigationSearchContainer = document.querySelector(".search-container");
const navigationSearchClose = document.querySelector(".searchClose");
//const searchInput = document.querySelector('#search-input');

// Functions
const openSearchContainer = () => {
  if (navigationSearchContainer && searchInput) {
    navigationSearchContainer.classList.add("open");
    searchInput.focus();
  }
};

const closeSearchContainer = () => {
  if (navigationSearchContainer && navigationSearchMobile) {
    navigationSearchContainer.classList.remove("open");
    navigationSearchMobile.focus();
  }
};

// Event listeners with null checks
if (navigationSearchMobile) {
  navigationSearchMobile.addEventListener("click", openSearchContainer);
}

if (navigationSearchClose) {
  navigationSearchClose.addEventListener("click", closeSearchContainer);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigationSearchContainer && navigationSearchContainer.classList.contains("open")) {
    closeSearchContainer();
  }
});

window.addEventListener("resize", () => {
  if (navigationSearchContainer && navigationSearchContainer.classList.contains("open")) {
    closeSearchContainer();
  }
});

let prevScrollPos = window.pageYOffset;
const navigation = document.querySelector("header");

if (navigation && turnOffFixedNavigation == false) {
  let isFirstScroll = true;

  window.addEventListener("scroll", () => {
    const currentScrollPos = window.pageYOffset;

    window.requestAnimationFrame(() => {
      if (isFirstScroll && currentScrollPos > 3) {
        navigation.style.position = "fixed";
        isFirstScroll = false; // Ensure this only runs once on first scroll
      }

      if (prevScrollPos > currentScrollPos) {
        navigation.style.top = "0"; // Scrolling up
      } else if (currentScrollPos > 3) {
        navigation.style.top = "-80px"; // Scrolling down
      }

      if (currentScrollPos <= 3) {
        navigation.style.position = "relative";
        navigation.style.top = "0";
        isFirstScroll = true; // Reset if scrolled back to the top
      }

      prevScrollPos = currentScrollPos;
    });
  });
}

const skipButton = document.querySelector(".skip-content-button");

if (skipButton) {
  // Add click and keydown events
  skipButton.addEventListener("click", skiptoContent);
  skipButton.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault(); // Prevent default spacebar or enter action
      skiptoContent(); // Call skiptoContent directly
    }
  });

  // Set aria-hidden based on focus
  skipButton.addEventListener("focus", () => {
    skipButton.setAttribute("aria-hidden", "false");
  });

  skipButton.addEventListener("blur", () => {
    skipButton.setAttribute("aria-hidden", "true");
  });
}

function skiptoContent() {
  const contentNew = document.querySelector(".header");
  if (contentNew) {
    contentNew.scrollIntoView({ behavior: "smooth", block: "start" }); // Smooth scrolling
    contentNew.setAttribute("tabindex", "-1"); // Temporary tabindex to make the element focusable

    let nextElement = contentNew.nextElementSibling;

    // If .header is inside .experiencefragment, find the next sibling of .experiencefragment
    if (!nextElement) {
      const parentFragment = contentNew.closest(".experiencefragment");
      if (parentFragment) {
        nextElement = parentFragment.nextElementSibling;
      }
    }

    // If a next sibling is found, focus on it
    if (nextElement) {
      nextElement.setAttribute("tabindex", "-1"); // Make it focusable if not already
      nextElement.focus();
    }
  }
}

// FLY OUT MENU

const flyoutOpenBtn = document.querySelector(".menuOpen");
const flyoutCloseBtn = document.querySelector(".menuClose");
const flyout = document.getElementById("flyoutNav");
const flyoutInner = document.querySelector(".flyout-inner");
const level1Buttons = document.querySelectorAll(".headerv2-nav-level-1-btn");
const levelBackBtn = document.querySelector(".headerv2-nav__back-btn");
const desktopQuery = window.matchMedia("(min-width:1024px)");
const mobileQuery = window.matchMedia("(max-width:767px)");
const flyoutBottom = document.querySelector(".flyout-bottom");

const headerTop = document.querySelector(".headerv2__top"); // the top header
const headerContainer = document.querySelector(".headerv2-container"); // original container
const flyoutTop = document.querySelector(".flyout-top"); // where it goes in flyout

let currentLevel2 = null;

// -------------------- Focus Trap --------------------

let focusableElements = [];
let firstFocusable = null;
let lastFocusable = null;
let lastOpenedLevel1Btn = null;

function getFocusableElements(container) {
  const focusableSelectors = [
    'a[href]:not([tabindex="-1"])',
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  return Array.from(container.querySelectorAll(focusableSelectors)).filter((el) => {
    const isVisible = el.offsetParent !== null;
    if (!isVisible) return false;

    // Exclude elements inside inert containers
    if (el.closest("[inert]")) return false;

    return true;
  });
}

function trapFocus(container) {
  focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  firstFocusable = focusableElements[0];
  lastFocusable = focusableElements[focusableElements.length - 1];

  container.addEventListener("keydown", handleFocusTrap);
}

function releaseFocus(container) {
  container.removeEventListener("keydown", handleFocusTrap);
}

function handleFocusTrap(e) {
  if (e.key !== "Tab") return;
  if (focusableElements.length === 0) return;

  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
}

// -------------------- Flyout open/close --------------------

function setFlyoutAttributes(open) {
  if (open) {
    flyout.classList.add("active");
    flyout.removeAttribute("inert");
    flyout.setAttribute("aria-hidden", "false");
    flyoutOpenBtn.setAttribute("aria-expanded", "true");
  } else {
    flyout.classList.remove("active");
    flyout.setAttribute("inert", "");
    flyout.setAttribute("aria-hidden", "true");
    flyoutOpenBtn.setAttribute("aria-expanded", "false");
  }
}

function setFlyoutOpen(open) {
  const liveRegion = document.getElementById("flyout-status");

  if (open) {
    // Move headerv2-top into flyout
    flyoutTop.appendChild(headerTop);

    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    setFlyoutAttributes(true);

    // Show close button, hide open button
    flyoutCloseBtn.style.display = "block";
    flyoutOpenBtn.style.display = "none";

    flyoutCloseBtn.focus();
    trapFocus(flyout);

    // Announce to screen readers
    if (liveRegion) liveRegion.textContent = "Menu opened";

    window.addEventListener("resize", headerHandleResize);
    window.addEventListener("orientationchange", headerHandleResize);
    headerHandleResize();
  } else {
    // Move headerv2-top back to original position
    headerContainer.prepend(headerTop);

    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");

    setFlyoutAttributes(false);

    // Show open button, hide close button
    flyoutCloseBtn.style.display = "none";
    flyoutOpenBtn.style.display = "block";

    releaseFocus(flyout);
    flyoutOpenBtn.focus();

    // Announce to screen readers
    if (liveRegion) liveRegion.textContent = "Menu closed";

    window.removeEventListener("resize", headerHandleResize);
    window.removeEventListener("orientationchange", headerHandleResize);
  }
}

if (flyoutOpenBtn) {
  flyoutOpenBtn.addEventListener("click", () => {
    resetToLevel1();
    setFlyoutOpen(true);

    // Only auto-open first section on desktop
    if (desktopQuery.matches) {
      const firstLevel1Btn = document.querySelector(".headerv2-nav-level-1-btn");

      if (firstLevel1Btn) {
        firstLevel1Btn.click();
      }
    }
  });
}

if (flyoutCloseBtn) {
  flyoutCloseBtn.addEventListener("click", () => {
    resetToLevel1();
    setFlyoutOpen(false);
  });

  // Close flyout when pressing Escape (if open)
  document.addEventListener("keydown", function (e) {
    // Only act when flyout is active
    if (!flyout.classList.contains("active")) return;

    if (e.key === "Escape" || e.key === "Esc") {
      resetToLevel1();
      e.preventDefault();
      setFlyoutOpen(false);
    }
  });
}

// -------------------- Level 2 Navigation --------------------

function showLevel2ForButton(btn) {
  const li = btn.closest("li");
  const level2 = li.querySelector(".headerv2-nav-level-2");
  if (!level2) return;

  document.querySelectorAll(".headerv2-nav-level-2").forEach((el) => {
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
  });

  level2.classList.add("show");
  level2.setAttribute("aria-hidden", "false");
  currentLevel2 = level2;

  if (desktopQuery.matches) {
    level1Buttons.forEach((b) => b.classList.remove("hidden"));
    levelBackBtn.style.display = "none";
    levelBackBtn.setAttribute("aria-hidden", "true");
    flyoutBottom.style.display = "";
  } else {
    level1Buttons.forEach((b) => b.classList.add("hidden"));
    levelBackBtn.style.display = "block";
    levelBackBtn.setAttribute("aria-hidden", "false");
    levelBackBtn.focus();
    flyoutBottom.style.display = "none";
  }

  initFlyoutAccordions();
  trapFocus(flyout);
}

function resetToLevel1() {
  document.querySelectorAll(".headerv2-nav-level-2").forEach((el) => {
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
  });
  currentLevel2 = null;

  // Reset Level 1 button states
  level1Buttons.forEach((b) => {
    b.classList.remove("activeBtn", "inactiveBtn");
    b.setAttribute("aria-expanded", "false");
    b.classList.remove("hidden");
  });

  levelBackBtn.style.display = "none";
  levelBackBtn.setAttribute("aria-hidden", "true");

  if (!desktopQuery.matches) {
    flyoutBottom.style.display = "";
  }

  trapFocus(flyout);
}

if (level1Buttons) {
  level1Buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!flyout.classList.contains("active")) setFlyoutOpen(true);

      lastOpenedLevel1Btn = btn; // store the source of activation

      level1Buttons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("activeBtn", isActive);
        b.classList.toggle("inactiveBtn", !isActive);
        b.setAttribute("aria-expanded", String(isActive));
      });

      showLevel2ForButton(btn);
    });
  });
}

if (levelBackBtn) {
  levelBackBtn.addEventListener("click", () => {
    resetToLevel1();
    if (lastOpenedLevel1Btn) {
      lastOpenedLevel1Btn.focus();
    }
  });
}

// -------------------- Mobile accordion for level 2 --------------------

// Expand/collapse a UL
function setAccordionState(ul, expanded) {
  if (!ul || ul.tagName !== "UL") return;

  if (expanded) {
    ul.classList.add("active");
    ul.removeAttribute("aria-hidden");
    ul.removeAttribute("inert");
  } else {
    ul.classList.remove("active");
    ul.setAttribute("aria-hidden", "true");
    ul.setAttribute("inert", "");
  }
}

// Update button state
function setButtonState(btn, expanded) {
  if (!btn) return;
  btn.setAttribute("aria-expanded", String(expanded));
  btn.classList.toggle("headerv2-nav-level-2__accordion-btn--active", expanded);
}

// Create accordion button
function flyoutCreateAccordionBtn(span, index) {
  const text = span.textContent.trim();
  span.textContent = "";

  const btn = document.createElement("button");
  btn.classList.add("headerv2-nav-level-2__accordion-btn");
  btn.type = "button";
  const id = `accordion-${index}`;
  btn.id = `${id}-btn`;
  btn.setAttribute("aria-controls", id);
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = text;

  span.appendChild(btn);
  return btn;
}

// Setup UL with initial accordion attributes
function flyoutSetupAccordionList(ul, id) {
  ul.id = id;
  ul.setAttribute("role", "region");
  ul.setAttribute("aria-labelledby", `${id}-btn`);
  setAccordionState(ul, false);
}

// Toggle accordion
function flyoutToggleAccordion(btn) {
  const ul = btn.parentNode.nextElementSibling;
  const expanded = btn.getAttribute("aria-expanded") === "true";

  // Close all other accordions
  document.querySelectorAll(".headerv2-nav-level-2__accordion-btn").forEach((otherBtn) => {
    if (otherBtn !== btn) {
      setButtonState(otherBtn, false);
      const otherUl = otherBtn.parentNode.nextElementSibling;
      setAccordionState(otherUl, false);
    }
  });

  // Toggle current
  const newExpanded = !expanded;
  setButtonState(btn, newExpanded);
  setAccordionState(ul, newExpanded);

  trapFocus(flyout);
}

// Initialize accordions
function initFlyoutAccordions() {
  if (!flyout.classList.contains("active")) return;
  const isMobile = mobileQuery.matches;

  // Loop each visible level-2 panel independently
  const level2Panels = document.querySelectorAll(".headerv2-nav-level-2.show");

  level2Panels.forEach((panel) => {
    const columns = panel.querySelectorAll(".headerv2-nav-level-2__content-column span");

    columns.forEach((span, index) => {
      let btn = span.querySelector("button");
      const ul = span.nextElementSibling;
      if (!ul || ul.tagName !== "UL") return;

      if (isMobile) {
        // Create accordion
        if (!btn) {
          btn = flyoutCreateAccordionBtn(span, index);
          flyoutSetupAccordionList(ul, `accordion-${index}`);
        }

        // Replace button to remove old listeners
        const newBtn = btn.cloneNode(true);
        btn.replaceWith(newBtn);
        newBtn.addEventListener("click", () => flyoutToggleAccordion(newBtn));

        // If only 1 column  start OPEN
        if (columns.length === 1) {
          setButtonState(newBtn, true);
          setAccordionState(ul, true);
        } else {
          // More than 1  start closed (normal accordion behavior)
          setButtonState(newBtn, false);
          setAccordionState(ul, false);
        }
      } else {
        // Desktop: remove accordion behavior
        if (btn) {
          span.textContent = btn.textContent;
          span.classList.add("headerv2-nav-level-2__content-column-title");
        }

        ul.style.display = "";
        ul.removeAttribute("aria-hidden");
        ul.removeAttribute("role");
        ul.removeAttribute("aria-labelledby");
        ul.removeAttribute("inert");
      }
    });
  });
}

// -------------------- Responsive --------------------

function headerHandleResize() {
  initFlyoutAccordions();

  if (!flyout.classList.contains("active")) return;

  if (currentLevel2) {
    currentLevel2.classList.add("show");
    currentLevel2.setAttribute("aria-hidden", "false");

    if (desktopQuery.matches) {
      level1Buttons.forEach((b) => b.classList.remove("hidden"));
      levelBackBtn.style.display = "none";
      levelBackBtn.setAttribute("aria-hidden", "true");
      flyoutBottom.style.display = "";
    } else {
      level1Buttons.forEach((b) => b.classList.add("hidden"));
      levelBackBtn.style.display = "block";
      levelBackBtn.setAttribute("aria-hidden", "false");
      flyoutBottom.style.display = "none";
    }
  } else {
    resetToLevel1();
  }

  trapFocus(flyout);
}

// -------------------- Search bar visibility --------------------

const searchOpenButtons = document.querySelectorAll(".searchOpen");
const searchContainers = document.querySelectorAll(".search-container");
const searchCloseButtons = document.querySelectorAll(".searchClose");

const setHeaderElementsInert = (inert) => {
  const logo = document.querySelector(".headerv2__logo");
  const searchBtn = document.querySelector(".searchOpen");
  const menuOpen = document.querySelector(".menuOpen");
  const menuClose = document.querySelector(".menuClose");

  const elements = [logo, searchBtn, menuOpen, menuClose].filter(Boolean);

  elements.forEach((el) => {
    if (inert) {
      el.setAttribute("tabindex", "-1");
      el.setAttribute("aria-hidden", "true");
      el.style.pointerEvents = "none";
    } else {
      el.removeAttribute("tabindex");
      el.removeAttribute("aria-hidden");
      el.style.pointerEvents = "";
    }
  });
};

// Attach event listeners to each set
searchOpenButtons.forEach((btn, index) => {
  const container = searchContainers[index];
  const flyoutCloseBtn = searchCloseButtons[index];
  // const input = container?.querySelector("input[type='search']"); not compatible with V1 clientlibs
  const input = container ? container.querySelector("input[type='search']") : null;

  // Open search
  const openSearch = () => {
    if (container && input) {
      container.classList.add("open");
      setHeaderElementsInert(true); //  disable header elements
      trapFocus(flyout);
      input.focus();
    }
  };

  // Close search
  const closeSearch = () => {
    if (container && btn) {
      container.classList.remove("open");
      setHeaderElementsInert(false); //  re-enable header elements
      trapFocus(flyout);
      btn.focus();
    }
  };

  // Listeners for open/close
  btn.addEventListener("click", openSearch);
  flyoutCloseBtn.addEventListener("click", closeSearch);

  // Close on ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && container.classList.contains("open")) {
      closeSearch();
    }
  });

  // Close on resize if screen is larger than mobile
  window.addEventListener("resize", () => {
    const MOBILE_MAX_WIDTH = 767;

    if (window.innerWidth > MOBILE_MAX_WIDTH && container.classList.contains("open")) {
      closeSearch();
    }
  });
});

// -------------------- Header animation - fixed to the top --------------------

let previousScrollPos = window.pageYOffset;
const headerv2 = document.querySelector(".headerv2");

if (headerv2 && (typeof turnOffFixedNavigation === "undefined" || turnOffFixedNavigation === false)) {
  let isItFirstScroll = true;

  window.addEventListener("scroll", () => {
    const currentScrollPosition = window.pageYOffset;

    window.requestAnimationFrame(() => {
      if (isItFirstScroll && currentScrollPosition > 3) {
        headerv2.style.position = "fixed";
        isItFirstScroll = false; // Ensure this only runs once on first scroll
      }

      if (previousScrollPos > currentScrollPosition) {
        headerv2.style.top = "0"; // Scrolling up
      } else if (currentScrollPosition > 3) {
        headerv2.style.top = "-80px"; // Scrolling down
      }

      if (currentScrollPosition <= 3) {
        headerv2.style.position = "relative";
        headerv2.style.top = "0";
        isItFirstScroll = true; // Reset if scrolled back to the top
      }

      previousScrollPos = currentScrollPosition;
    });
  });
}

// -------------------- Skip navigation --------------------

const headerSkipBtn = document.querySelector(".headerv2-skip-content-button");

if (headerSkipBtn) {
  // Add click and keydown events
  headerSkipBtn.addEventListener("click", headerSkipContent);
  headerSkipBtn.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault(); // Prevent default spacebar or enter action
      headerSkipContent(); // Call headerSkipContent directly
    }
  });
}

function headerSkipContent() {
  const contentNew = document.querySelector(".headerv2-component");
  if (contentNew) {
    contentNew.scrollIntoView({ behavior: "smooth", block: "start" }); // Smooth scrolling
    contentNew.setAttribute("tabindex", "-1"); // Temporary tabindex to make the element focusable

    let nextElement = contentNew.nextElementSibling;

    // If .headerv2-component is inside .experiencefragment, find the next sibling of .experiencefragment
    if (!nextElement) {
      const parentFragment = contentNew.closest(".experiencefragment");
      if (parentFragment) {
        nextElement = parentFragment.nextElementSibling;
      }
    }

    // If a next sibling is found, focus on it
    if (nextElement) {
      nextElement.setAttribute("tabindex", "-1"); // Make it focusable if not already
      nextElement.focus();
    }
  }
}

// Function to return no results text. For example, used in listing component. 
function renderNoResultsTxt(noResultsTitle, noResultsText) {
    const noResults = document.createElement("div");
    noResults.classList.add("no-results");
    
    const img = document.createElement("img");
    img.classList.add("no-results__logo");
    img.setAttribute("src", "/etc.clientlibs/uon/clientlibs/clientlib-v2/resources/images/noresultimage.png");
    img.setAttribute("alt", "");
    img.setAttribute("loading", "lazy");

    const title = document.createElement("div");
    title.classList.add("no-results__title");
    title.textContent = noResultsTitle;

    const text = document.createElement("p");
    text.classList.add("no-results__text");
    text.textContent = noResultsText;

    noResults.appendChild(img);
    noResults.appendChild(title);
    noResults.appendChild(text);

    return noResults;
}
const searchInput = document.querySelector('#search-input');
const searchBarClear = document.querySelector('.search-bar-clear');

if(searchInput) {
// Add an 'input' event listener to the search field
// This will trigger every time the user types in the search input
searchInput.addEventListener('input', (event) => {
    // Check if the input length is greater than 1 character
    if (event.target.value.length > 0) {
        // If so, make the clear button visible by removing aria-hidden
        searchBarClear.setAttribute('aria-hidden', 'false');
        // If so, make the clear button tabbable by updating tabindex
        searchBarClear.setAttribute('tabindex', '0');

        searchBarClear.style.display = 'block';
    } else {
        // If the input length is 1 or less, hide the clear button
        searchBarClear.setAttribute('aria-hidden', 'true');
        // If so, make the clear button not tabbable by updating tabindex
        searchBarClear.setAttribute('tabindex', '-1');

        searchBarClear.style.display = 'none';
    }
});
}

// Add a 'click' event listener to the body
// This will capture clicks, even if the clear button was dynamically added
document.body.addEventListener('click', function (event) {
    // Check if the clicked element has the 'search-bar-clear' class (i.e., it's the clear button)
    if (event.target.classList.contains('search-bar-clear')) {
        // Clear the search input value
        searchInput.value = '';
        // Hide the clear button again by setting aria-hidden to 'true'
        searchBarClear.setAttribute('aria-hidden', 'true');
        // If so, make the clear button not tabbable by updating tabindex
        searchBarClear.setAttribute('tabindex', '-1');

        searchBarClear.style.display = 'none';
        // Return focus to the search input field after clearing it
        searchInput.focus();
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Get the search input field by its ID
    const searchInput = document.getElementById("search-input");

    // Ensure search input exists before attaching event listener
    if (searchInput) {
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                // Get the search term entered by the user and trim any extra spaces
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {   
                    // Encode the search term to make it URL-safe (e.g., replace spaces with +)
                    const formattedSearchTerm = encodeURIComponent(searchTerm);
                    // Get search URL safely, checking if the element exists before accessing `.value`
                    const searchResultElement = document.querySelector(".search-container #searchResult");
                    let searchURL = "/content/uon/gb/en/studywithus/ugstudy/search-results.html";
                    
                    if (searchResultElement && searchResultElement.value) {
                        searchURL = searchResultElement.value;
                    }

                    // Redirect the user to the search results page with the formatted search term as a query parameter
                    window.location.href = searchURL + `?search=${formattedSearchTerm}`;
                }
            }
        });
    }
});
function startSearch() {
  console.log("Starting search...");
  var allRecords = [];
  var initialLoad = true;
  var apiRequest;
  // Prevent out-of-order AJAX responses from overwriting newer pages
  var mbRequestSeq = 0;
  var mbLatestSeqStudy = 0;
  var mbLatestSeqArticles = 0;
  var path;
  var orderBy = "";
  var pageNumber = 1;
  var currentPageStudy = 1;
  var currentPageArticle = 1;
  var pagination = false;
  var estimatedCount;
  var order_direction = "";
  var filterArray;
  var articlefilterArray;
  var articleconstraintsArray;
  var studyconstraintsArray;
  var filterId = [];
  var index;
  var serviceId;
  var qengId;
  var labelId = [];
  var articlefilterId = [];
  var articlelabelId = [];
  var articleArray = [];
  var articlePaginationFlag = true;
  var studyPaginationFlag = true;
  var recordsPerPage;
  var studyloadFlag = true;
  var queryString = "string";
  var articleloadFlag = true;
  var studyArray = [];
  var firstClick = true;
  var studyFacets;
  var apiResponse;
  var maxPageCount;
  var resultPagesStudy = null;
  var resultPagesArticles = null;
  var subjectArray = [];
  var clearingArray = [];
  var locationArray = [];
  var dateArray = [];
  var levelArray = [];
  var subjectStudyArray = [];
  var locationStudyArray = [];
  var clearingStudyArray = [];
  var dateStudyArray = [];
  var levelStudyArray = [];
  var query;
  var apiError = false;

  // var windowSize = document.documentElement.clientWidth;
  var articleconstraintsArray = {
    label: "articleType",
    filtered_name: "articleType",
    filter_base: [],
  };
  var subjectconstraintsArray = {
    label: "subject",
    filtered_name: "subject",
    filter_base: [],
  };
  var dateconstraintsArray = {
    label: "startDate",
    filtered_name: "startDate",
    filter_base: [],
  };
  var locationconstraintsArray = {
    label: "location",
    filtered_name: "location",
    filter_base: [],
  };
  var clearingconstraintsArray = {
    label: "clearing",
    filtered_name: "clearing",
    filter_base: [],
  };
  var levelconstraintsArray = {
    label: "studyLevel",
    filtered_name: "studyLevel",
    filter_base: [],
  };
  //Stop special characters in Search Box
  const searchInputBox = document.querySelector(".nav__search-box-input");
  if (searchInputBox) {
    const specialCharactersRemoval = /[A-Za-z0-9 \/]+/;
    searchInputBox.addEventListener("keypress", (event) => {
      if (!specialCharactersRemoval.test(event.key)) {
        event.preventDefault();
      }
    });
  }
  //Check for filter options
  function checkFilterOptions(id) {
    const activeFiltersSelected = document.querySelectorAll(".activeFilters--lists li").length;
    const clearAllOption = document.getElementById(id);
    if (activeFiltersSelected == 0 && clearAllOption) {
      clearAllOption.style.display = "none";
    } else if (activeFiltersSelected > 0 && clearAllOption) {
      clearAllOption.style.display = "block";
    }
  }

  // Show no results function

  function showNoResultsState(hasResults) {
    const container = document.querySelector(".no-results");
    const textEl = document.querySelector(".no-results__text");

    if (hasResults) {
      container.style.display = "none";
      return;
    }

    container.style.display = "flex";

    if (apiError) {
      textEl.textContent = "Something went wrong while searching. If the problem continues, try again later.";
    } else {
      textEl.textContent = "Please try a different search or change your filters";
    }
  }

  // Display Options for filters
  function displayFilterOptions(optionClass, displayOption) {
    const filterOption = document.querySelector(optionClass);
    if (filterOption) {
      document.querySelectorAll(optionClass).forEach(function (el) {
        el.style.display = displayOption;
      });
    }
  }
  function paginationHeader(id, display) {
    var paginationHeaderOption = document.getElementById(id + "header");
    if (paginationHeaderOption) {
      paginationHeaderOption.style.display = display;
      document.getElementById(id + "footer").style.display = display;
    }
  }

  function paginationNavigation() {
    $(document).off("click", ".pagination-prev");
    $(document).off("click", ".pagination-next");
    $(document).off("click", ".pagination-start");
    $(document).off("click", ".pagination-end");
    $(document).off("click", ".activeFilters--lists button.x");

    $(document).on("click", ".pagination-prev", function (e) {
      e.preventDefault();
      var type = $(this).attr("data-content"); // "study" | "articles"
      var targetPage = Number($(this).attr("data-page"));
      if (!targetPage || targetPage < 1) {
        return;
      }

      if (type === "study") {
        if (currentPageStudy === targetPage) {
          return;
        }
        currentPageStudy = targetPage;
      } else if (type === "articles") {
        if (currentPageArticle === targetPage) {
          return;
        }
        currentPageArticle = targetPage;
      }

      searchresult.requestCreation(type, orderBy, order_direction);
    });

    $(document).on("click", ".pagination-next", function (e) {
      e.preventDefault();
      var type = $(this).attr("data-content"); // "study" | "articles"
      var targetPage = Number($(this).attr("data-page"));
      if (!targetPage || targetPage < 1) {
        return;
      }

      if (type === "study") {
        currentPageStudy = targetPage;
      } else if (type === "articles") {
        currentPageArticle = targetPage;
      }

      searchresult.requestCreation(type, orderBy, order_direction);
    });

    $(document).on("click", ".pagination-start", function (e) {
      e.preventDefault();
      var type = $(this).attr("data-content");
      var targetPage = 1;

      if (type === "study") {
        if (currentPageStudy === 1) {
          return;
        }
        currentPageStudy = targetPage;
      } else if (type === "articles") {
        if (currentPageArticle === 1) {
          return;
        }
        currentPageArticle = targetPage;
      }

      searchresult.requestCreation(type, orderBy, order_direction);
    });

    $(document).on("click", ".pagination-end", function (e) {
      e.preventDefault();
      var type = $(this).attr("data-content");
      var targetPage = Number($(this).attr("data-page"));
      if (!targetPage || targetPage < 1) {
        return;
      }

      if (type === "study") {
        if (currentPageStudy === targetPage) {
          return;
        }
        currentPageStudy = targetPage;
      } else if (type === "articles") {
        if (currentPageArticle === targetPage) {
          return;
        }
        currentPageArticle = targetPage;
      }

      searchresult.requestCreation(type, orderBy, order_direction);
    });

    // Remove filters update
    $(document).on("click", ".activeFilters--lists button.x", function (e) {
      e.preventDefault();

      try {
        var $btn = $(this);
        var $li = $btn.closest("li");

        // sanitised checkbox
        var filterValueId = $btn.attr("value") || $btn.val() || "";
        if (!filterValueId) {
          var cls = ($li.attr("class") || "").split(/\s+/);
          if (cls && cls.length > 1) {
            filterValueId = cls[1];
          }
        }
        var desktopCb = filterValueId ? document.getElementById(filterValueId) : null;
        // var mobileCb = filterValueId ? document.getElementById("mobile" + filterValueId) : null;
        var cb = desktopCb;

        if (cb) {
          cb.click();
        } else {
          // Last resort
          $li.remove();
          var pageType = ($li.attr("data-pagetype") || "").toLowerCase();
          var type = pageType === "article" || pageType === "articles" ? "articles" : "study";
          searchresult.requestCreation(type, orderBy, order_direction);
        }
        var pt = ($li.attr("data-pagetype") || "").toLowerCase();
        if (pt === "article" || pt === "articles") {
          checkFilterOptions("clearAllArticle");
        } else {
          checkFilterOptions("clearAllStudy");
        }
      } catch (err) {
        // Errors
      }
    });
  }

  function ResetPagination(event) {
    var type;

    if (firstClick) {
      articleloadFlag = true;
    }

    if (event.currentTarget.id == "nav--articles" || event.currentTarget.id == "nav--articles_mob") {
      checkFilterOptions("clearAllArticle");

      $("#study_options_desktop").hide();
      $("#nav--study_options").attr("aria-label", "Click or press enter for Study Options results");
      $("#nav--articles").attr("aria-label", "You are currently viewing Articles results");

      $("#articles_desktop").show();

      $("#nav--articles").addClass("active");
      $("#nav--study_options").removeClass("active");

      type = "articles";

      searchresult.requestCreation(type);

      $(".activeFilters--lists").find(`[data-pagetype='study']`).hide();
      $(".activeFilters--lists").find(`[data-pagetype='article']`).show();
    } else if (event.currentTarget.id == "nav--study_options" || event.currentTarget.id == "nav--study_options_mob") {
      checkFilterOptions("clearAllStudy");

      $("#nav--articles").attr("aria-label", "Click or press enter for Articles results");
      $("#nav--study_options").attr("aria-label", "You are currently viewing Study Options results");

      $("#study_options_desktop").show();
      $("#articles_desktop").hide();

      $("#nav--articles").removeClass("active");
      $("#nav--study_options").addClass("active");

      type = "study";

      searchresult.requestCreation(type);

      $(".activeFilters--lists").find(`[data-pagetype='article']`).hide();
      $(".activeFilters--lists").find(`[data-pagetype='study']`).show();
    }
  }

  function sortTile(event) {
    let selectBtn = document.querySelector("#study_alpha_sort");
    let selectBtnArticles = document.querySelector("#article_time_sort");
    let selectContent = event.target.closest(".dropdown-list");

    if (event.currentTarget.id == "AtoZ") {
      $("#study_alpha_sort").find(".select_number-study").empty();
      $("#study_alpha_sort").find(".select_number-study").append(": A-Z");
      orderBy = "title";
      order_direction = "ASCENDING";
      searchresult.requestCreation("study", orderBy, order_direction);
      closeDropdown(selectBtn, selectContent);
    } else if (event.currentTarget.id == "ZtoA") {
      $("#study_alpha_sort").find(".select_number-study").empty();
      $("#study_alpha_sort").find(".select_number-study").append(": Z-A");
      orderBy = "title";
      order_direction = "DESCENDING";
      searchresult.requestCreation("study", orderBy, order_direction);
      closeDropdown(selectBtn, selectContent);
    } else if (event.currentTarget.id == "AtoZarticle") {
      $("#time_sort").find(".select_number-article").empty();
      $("#time_sort").find(".select_number-article").append(": A-Z");
      orderBy = "title";
      order_direction = "ASCENDING";
      searchresult.requestCreation("articles", orderBy, order_direction);
      closeDropdown(selectBtnArticles, selectContent);
    } else if (event.currentTarget.id == "ZtoAarticle") {
      $("#time_sort").find(".select_number-article").empty();
      $("#time_sort").find(".select_number-article").append(": Z-A");
      orderBy = "title";
      order_direction = "DESCENDING";
      searchresult.requestCreation("articles", orderBy, order_direction);
      closeDropdown(selectBtnArticles, selectContent);
    } else if (event.currentTarget.id == "latest") {
      $("#time_sort").find(".select_number-article").empty();
      $("#time_sort").find(".select_number-article").append(": Latest");
      orderBy = "publishedDate";
      order_direction = "DESCENDING";
      searchresult.requestCreation("articles", orderBy, order_direction);
      closeDropdown(selectBtnArticles, selectContent);
    } else if (event.currentTarget.id == "oldest") {
      $("#time_sort").find(".select_number-article").empty();
      $("#time_sort").find(".select_number-article").append(": Oldest");
      orderBy = "publishedDate";
      order_direction = "ASCENDING";
      searchresult.requestCreation("articles", orderBy, order_direction);
      closeDropdown(selectBtnArticles, selectContent);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const searchText = params.get("search");
  var isEmptySearch = !searchText || searchText.trim() === "";
  var activeFilter = [
    {
      sort: [],
      clearing: [],
      studyLevel: [],
      subject: [],
      date: [],
      location: [],
      time: [],
      articleType: [],
    },
  ];
  if (document.getElementById("searchresult")) {
    searchresult = {
      studyoptions: [],
      initialLoad: true,
      init: function () {
        path = "/bin/uon/search";
        recordsPerPage = JSON.parse(document.getElementById("recordsPage").value);
        index = "aem-content";
        serviceId = document.getElementById("serviceId").value;
        qengId = document.getElementById("qengId").value;
        maxPageCount = JSON.parse(document.getElementById("maximumCount").value);
        var type = "study";
        this.requestCreation(type);
        this.bindEvents();
      },
      bindEvents: function () {
        var selectTrigger = document.querySelector(".select__trigger");
        var headingText = document.querySelector(".heading_text");

        if (selectTrigger) {
          selectTrigger.addEventListener("focus", function () {
            if (!document.activeElement.classList.contains("select_focused")) {
              searchresult.dropdowncloseonFocus();
            }
          });

          selectTrigger.addEventListener("keypress", function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
              if (!document.activeElement.classList.contains("select_focused")) {
                searchresult.dropdowncloseonFocus();
              }
            }
          });
        }

        if (headingText) {
          headingText.addEventListener("focus", function () {
            var select = document.querySelector(".select");
            if (select && select.classList.contains("open")) {
              searchresult.dropdowncloseonFocus();
            }
          });

          headingText.addEventListener("keypress", function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
              var select = document.querySelector(".select");
              if (select && select.classList.contains("open")) {
                searchresult.dropdowncloseonFocus();
              }
            }
          });
        }
      },
      methods_placeholder_remove: null,

      dropdowncloseonFocus: function () {
        document.querySelectorAll(".custom-option").forEach(function (el) {
          el.setAttribute("aria-hidden", "true");
        });
        document.querySelectorAll(".select__trigger").forEach(function (el) {
          el.setAttribute("aria-expanded", "false");
        });
        document.querySelectorAll(".select_text").forEach(function (el) {
          el.classList.remove("select_focused_select_text");
        });
        document.querySelectorAll(".select__trigger").forEach(function (el) {
          el.classList.remove("select_focused");
        });
        document.querySelectorAll(".arrow").forEach(function (el) {
          el.classList.remove("select_focused_arrow");
        });
      },
      requestCreation: function (type, orderBy, order_direction) {
        var pageType;
        var searchQuery;
        // Keep the request pageNumber in sync with the current UI page
        if (type === "study") {
          pageNumber = currentPageStudy;
        } else if (type === "articles") {
          pageNumber = currentPageArticle;
        }
        if (orderBy == undefined) {
          //orderBy = 'relevance';
        }
        if (order_direction == undefined) {
          //order_direction = "DESCENDING";
        }
        queryString = queryString.replace("string", searchText);
        document.querySelector(".tile-heading").innerHTML = "";
        if (isEmptySearch) {
          document.querySelector(".tile-heading").append(`Search`);
        } else {
          document.querySelector(".tile-heading").append(`Results for "${queryString}"`);
        }

        if (type == "study") {
          if (isEmptySearch) {
            query = {
              or: [
                {
                  unparsed: "*", // match all
                  id: "query",
                },
              ],
            };
          } else {
            query = {
              or: [
                {
                  unparsed: "title:" + searchText,
                  id: "query",
                },
                {
                  unparsed: "ucasCode:" + searchText,
                  id: "query",
                },
              ],
            };
          }
        } else if (type == "articles") {
          if (isEmptySearch) {
            query = {
              or: [
                {
                  unparsed: "*",
                  id: "query",
                },
              ],
            };
          } else {
            query = {
              or: [
                {
                  unparsed: searchText,
                  id: "query",
                },
              ],
            };
          }
        }
        var facets;
        apiRequest = {
          name: "default",
          user: {
            query: query,
            constraints: [],
          },
          source_context: {
            constraints: [
              {
                filter_base: [
                  {
                    and: [
                      {
                        label: "fqcategory",
                        regex: "^\\QWeb:\\E.*$",
                      },
                      {
                        label: "fqcategory",
                        quoted_term: "Web:" + index,
                      },
                    ],
                    id: "aem-content",
                  },
                ],
              },
            ],
          },
          // Default offset pagination (keeps paging working even if result_pages is ignored)
          start: (pageNumber - 1) * recordsPerPage,
          // Pagination: Mindbreeze uses result_pages (max_page_count + result_pages.current_page)
          count: recordsPerPage,
          max_page_count: maxPageCount,
          properties: [
            {
              name: "title",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "facultyTag",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "articleTag",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "duration",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "location",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "clearing",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "qualification",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "entryRequirements",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "articleDescription",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "startDate",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "ucasCode",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "clearingALevel",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "entryRequirementsToggle",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "imagePath",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "altText",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "overview",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "learnMore",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "howtoapplyurl",
              formats: ["HTML", "VALUE"],
            },
            {
              name: "articledate",
              formats: ["HTML"],
            },
            {
              name: "publishedDate",
              formats: ["HTML"],
            },
            {
              name: "mes:date",
              formats: ["HTML"],
            },
            {
              name: "mes:summary",
              formats: ["PROPERTY"],
            },
            {
              name: "content",
              formats: ["PROPERTY"],
            },
          ],
          facets: [],
        };
        // adding sort logic in api request
        if (orderBy != "" && order_direction != "") {
          apiRequest.orderby = orderBy;
          apiRequest.order_direction = order_direction;
        }
        // adding page type and facets in api request for study
        if (type == "study") {
          if (studyArray.length != 0) {
            apiRequest.user.constraints = studyArray;
          }
          var studyPageType = {
            label: "pageType",
            filtered_name: "pageType",
            filter_base: [
              {
                label: "pageType",
                regex: "^\\QCourseDetail\\E$",
                description: "CourseDetail",
                id: "CourseDetail",
                value: {
                  str: "CourseDetail",
                },
              },
            ],
          };
          (studyFacets = [
            {
              name: "pageType",
              formats: ["HTML"],
            },
            {
              name: "studyLevel",
              formats: ["PROPERTY"],
            },
            {
              name: "subject",
              formats: ["PROPERTY"],
            },
            {
              name: "startDate",
              formats: ["PROPERTY"],
            },
            {
              name: "location",
              formats: ["PROPERTY"],
            },
            {
              name: "clearing",
              formats: ["PROPERTY"],
            },
          ]),
            (initialLoad = false);
          pageType = studyPageType;
          facets = studyFacets;
        }
        // adding page type and facets in api request for articles
        else if (type == "articles") {
          if (articleArray.length != 0) {
            apiRequest.user.constraints = articleArray;
          }
          var articlePageType = {
            label: "pageType",
            filtered_name: "pageType",
            filter_base: [
              {
                label: "pageType",
                regex: "^\\QArticle\\E$",
                description: "Article",
                id: "Article",
                value: {
                  str: "Article",
                },
              },
            ],
          };
          var articleFacets = [
              {
                name: "pageType",
                formats: ["HTML"],
              },
              {
                name: "articleType",
                formats: ["PROPERTY"],
              },
            ],
            pageType = articlePageType;
          facets = articleFacets;
        }
        apiRequest.user.constraints.push(pageType);
        apiRequest.facets = facets;

        var cachedResultPages = null;
        if (type === "study") {
          cachedResultPages = resultPagesStudy;
        } else if (type === "articles") {
          cachedResultPages = resultPagesArticles;
        }
        try {
        } catch (e) {
          // ignore
        }

        if (cachedResultPages && cachedResultPages.pages && cachedResultPages.pages.length) {
          // Mindbreeze uses 0-based page_number, UI uses 1-based
          var targetPageNumber0 = pageNumber - 1;

          // Clone so we don't mutate cached structure (important for subsequent clicks)
          var rp = JSON.parse(JSON.stringify(cachedResultPages));

          // Clear any existing current_page flags
          for (var rpi = 0; rpi < rp.pages.length; rpi++) {
            if (rp.pages[rpi] && rp.pages[rpi].current_page) {
              delete rp.pages[rpi].current_page;
            }
          }

          // Find the requested page entry; if it's missing, fall back to page 0
          var found = false;
          var selectedPageEntry = null;
          for (var rpj = 0; rpj < rp.pages.length; rpj++) {
            if (rp.pages[rpj] && rp.pages[rpj].page_number === targetPageNumber0) {
              rp.pages[rpj].current_page = true;
              found = true;
              selectedPageEntry = rp.pages[rpj];
              break;
            }
          }

          if (!found) {
            // Safety fallback: reset UI to page 1
            pageNumber = 1;
            if (type === "study") {
              currentPageStudy = 1;
            } else if (type === "articles") {
              currentPageArticle = 1;
            }
            // Mark page_number 0 as current (if present)
            for (var rpk = 0; rpk < rp.pages.length; rpk++) {
              if (rp.pages[rpk] && rp.pages[rpk].page_number === 0) {
                rp.pages[rpk].current_page = true;
                break;
              }
            }
          }

          try {
            var entryForStart = selectedPageEntry;
            if (!entryForStart) {
              // If we fell back to page 0, use that entry for start
              for (var sfi = 0; sfi < rp.pages.length; sfi++) {
                if (rp.pages[sfi] && rp.pages[sfi].page_number === 0) {
                  entryForStart = rp.pages[sfi];
                  break;
                }
              }
            }

            if (entryForStart) {
              var startVal = 0;
              var countVal = recordsPerPage;

              if (entryForStart.starts && entryForStart.starts.length) {
                for (var ss = 0; ss < entryForStart.starts.length; ss++) {
                  if (typeof entryForStart.starts[ss] === "number" && entryForStart.starts[ss] > startVal) {
                    startVal = entryForStart.starts[ss];
                  }
                }
              }

              if (entryForStart.counts && entryForStart.counts.length) {
                for (var cc = 0; cc < entryForStart.counts.length; cc++) {
                  if (typeof entryForStart.counts[cc] === "number" && entryForStart.counts[cc] > countVal) {
                    countVal = entryForStart.counts[cc];
                  }
                }
              }

              apiRequest.start = startVal;
              apiRequest.count = countVal;
            }
          } catch (e) {
            // ignore
          }

          apiRequest.result_pages = rp;
        }

        // Stamp this request so we can ignore stale responses that return later
        mbRequestSeq = mbRequestSeq + 1;
        apiRequest.__clientSeq = mbRequestSeq;
        // Also stamp the UI page number that this request is for (do NOT rely on globals later)
        apiRequest.__clientPageNumber = pageNumber;
        if (type === "study") {
          mbLatestSeqStudy = mbRequestSeq;
        } else if (type === "articles") {
          mbLatestSeqArticles = mbRequestSeq;
        }

        // Debug: log outgoing request essentials (do not log full state blob)
        try {
        } catch (e) {
          // ignore
        }
        this.apiCall(type);
      },
      apiCall: function (type) {
        var sortDropDown = [];
        var studyLevel = [];
        var subject = [];
        var startDate = [];
        var clearingArray = [];
        var locationArray = [];
        var articleType = [];
        var studyoptions = [];
        var response = [];

        // Capture request values now (apiRequest is global and may change before the response returns)
        var requestSeq = apiRequest && apiRequest.__clientSeq;
        var requestCount = apiRequest && apiRequest.count;
        var requestPageNumber =
          apiRequest && apiRequest.__clientPageNumber ? apiRequest.__clientPageNumber : type === "study" ? currentPageStudy : currentPageArticle;

        $.ajax({
          type: "POST",
          dataType: "json",
          timeout: 2600,
          url: path,
          // Send raw JSON body so result_pages payload is preserved
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(apiRequest),
          processData: false,
          error: function (x, textStatus, m) {
            if (textStatus == "timeout") {
              startSearch();
            }
            apiError = true;
            // Show API error UI
            showNoResultsState(false);
          },
          success: function (msg) {
            apiError = false;
            // If Mindbreeze returns an error payload, `msg.resultset` is missing.
            if (!msg || !msg.resultset) {
              apiError = true;
              showNoResultsState(false);
              return;
            }

            // Cache result_pages for deterministic page navigation
            // Mindbreeze/proxies can return it at different levels or even as top-level pages/page_size/page_count.
            try {
              var extractedResultPages = null;

              // 1) Common locations
              if (msg && msg.result_pages) {
                extractedResultPages = msg.result_pages;
              } else if (msg && msg.search_request && msg.search_request.result_pages) {
                extractedResultPages = msg.search_request.result_pages;
              } else if (msg && msg.resultset && msg.resultset.result_pages) {
                extractedResultPages = msg.resultset.result_pages;
              } else if (msg && msg.per_service_dataset && msg.per_service_dataset.length) {
                // Some responses wrap per dataset
                if (msg.per_service_dataset[0] && msg.per_service_dataset[0].result_pages) {
                  extractedResultPages = msg.per_service_dataset[0].result_pages;
                } else if (msg.per_service_dataset[0] && msg.per_service_dataset[0].search_request && msg.per_service_dataset[0].search_request.result_pages) {
                  extractedResultPages = msg.per_service_dataset[0].search_request.result_pages;
                } else if (msg.per_service_dataset[0] && msg.per_service_dataset[0].resultset && msg.per_service_dataset[0].resultset.result_pages) {
                  extractedResultPages = msg.per_service_dataset[0].resultset.result_pages;
                }
              }

              // 2) Some servlets flatten result_pages into top-level pages/page_size/page_count
              if (!extractedResultPages && msg && msg.pages && msg.page_size != null && msg.page_count != null) {
                extractedResultPages = {
                  pages: msg.pages,
                  page_size: msg.page_size,
                  page_count: msg.page_count,
                };
              }

              // 3) Last resort: walk a few levels to find something that looks like result_pages
              if (!extractedResultPages) {
                var seen = [];
                var queue = [{ v: msg, depth: 0 }];
                while (queue.length) {
                  var cur = queue.shift();
                  if (!cur || !cur.v || cur.depth > 4) {
                    continue;
                  }
                  if (seen.indexOf(cur.v) !== -1) {
                    continue;
                  }
                  seen.push(cur.v);

                  if (cur.v && cur.v.pages && cur.v.page_size != null && cur.v.page_count != null) {
                    extractedResultPages = {
                      pages: cur.v.pages,
                      page_size: cur.v.page_size,
                      page_count: cur.v.page_count,
                    };
                    break;
                  }
                  if (cur.v && cur.v.result_pages && cur.v.result_pages.pages) {
                    extractedResultPages = cur.v.result_pages;
                    break;
                  }

                  if (typeof cur.v === "object") {
                    for (var k in cur.v) {
                      if (Object.prototype.hasOwnProperty.call(cur.v, k)) {
                        var child = cur.v[k];
                        if (child && typeof child === "object") {
                          queue.push({ v: child, depth: cur.depth + 1 });
                        }
                      }
                    }
                  }
                }
              }

              if (extractedResultPages && extractedResultPages.pages && extractedResultPages.pages.length) {
                if (type === "study") {
                  resultPagesStudy = extractedResultPages;
                } else if (type === "articles") {
                  resultPagesArticles = extractedResultPages;
                }
              }
            } catch (e) {
              // ignore
            }

            // Ignore stale responses for UI rendering (e.g. page 1 returning after page 3)
            if (type === "study" && requestSeq && requestSeq < mbLatestSeqStudy) {
              return;
            }
            if (type === "articles" && requestSeq && requestSeq < mbLatestSeqArticles) {
              return;
            }
            apiResponse = msg;
            // Debug: log response essentials and a stable signature of returned results
            try {
              var resCount = msg && msg.resultset && msg.resultset.results ? msg.resultset.results.length : 0;
              var hasPrev = msg && msg.resultset ? msg.resultset.prev_avail : undefined;
              var hasNext = msg && msg.resultset ? msg.resultset.next_avail : undefined;
              var sigTitles = [];
              if (msg && msg.resultset && msg.resultset.results) {
                for (var si = 0; si < Math.min(5, msg.resultset.results.length); si++) {
                  var propsArr = msg.resultset.results[si] && msg.resultset.results[si].properties ? msg.resultset.results[si].properties : [];
                  var titleVal = null;
                  for (var pj = 0; pj < propsArr.length; pj++) {
                    if (propsArr[pj] && propsArr[pj].id === "title" && propsArr[pj].data && propsArr[pj].data[0] && propsArr[pj].data[0].value) {
                      titleVal = propsArr[pj].data[0].value.str;
                      break;
                    }
                  }
                  sigTitles.push(titleVal || "");
                }
              }
            } catch (e) {
              // ignore
            }

            estimatedCount = msg.estimated_count;
            var properties = [];
            //extracting drop down values from response
            if (msg.facets) {
              for (var i = 0; i < msg.facets.length; i++) {
                if (msg.facets[i].id == "extension") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    sortDropDown.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
                if (msg.facets[i].id == "location") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    locationArray.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
                if (msg.facets[i].id == "clearing") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    clearingArray.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
                if (msg.facets[i].id == "subject") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    subject.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
                if (msg.facets[i].id == "studyLevel") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    studyLevel.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
                if (msg.facets[i].id == "startDate") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    startDate.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
                if (msg.facets[i].id == "articleType") {
                  for (var j = 0; j < msg.facets[i].entries.length; j++) {
                    articleType.push(msg.facets[i].entries[j].query_expr.value.str);
                  }
                }
              }
            }
            // extracting tile values from response
            if (msg.resultset && msg.resultset.results) {
              for (var i = 0; i < msg.resultset.results.length; i++) {
                properties.push(msg.resultset.results[i].properties);
              }
            }
            for (var i = 0; i < properties.length; i++) {
              var test = {};
              for (var j = 0; j < properties[i].length; j++) {
                if (properties[i][j].id == "title") {
                  test.title = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "duration") {
                  test.duration = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "ucasCode") {
                  test.ucasCode = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "facultyTag") {
                  test.facultyTag = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "clearingALevel") {
                  test.clearingALevel = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "entryRequirementsToggle") {
                  test.entryRequirementsToggle = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "articleTag") {
                  test.articleTag = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "learnMore") {
                  test.learnMore = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "entryRequirements") {
                  test.entryReq = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "imagePath") {
                  test.imagePath = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "altText") {
                  test.altText = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "clearing") {
                  test.clearing = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "articleDescription") {
                  test.description = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "startDate") {
                  test.startDate = properties[i][j].data[0].value.str;
                }
                if (properties[i][j].id == "publishedDate") {
                  test.publishedDate = properties[i][j].data[0].html;
                }
              }
              response.push(test);
            }
            studyoptions = response;

            // Debug: capture titles returned for this page so we can verify the API is actually paging
            try {
              var returnedTitles = (studyoptions || [])
                .map(function (item) {
                  return item && item.title ? item.title : "";
                })
                .filter(Boolean);
              var returnedLinks = (studyoptions || [])
                .map(function (item) {
                  return item && item.learnMore ? item.learnMore : "";
                })
                .filter(Boolean);

              window.__mbLastTitles = returnedTitles;
              // console.log("[MB][TITLES] type=", type, "page=", requestPageNumber, "titles=", returnedTitles);
              window.__mbLastLinks = returnedLinks;
              window.__mbAllTitles = (window.__mbAllTitles || []).concat(returnedTitles);
            } catch (e) {
              //console.log("Mindbreeze response debug failed", e);
            }

            studyoptions = studyoptions.filter(function (item) {
              return !(item.hasOwnProperty("hideinsitemap") && item.hideinsitemap === "true");
            });

            // appending tile values (titles are also available in window.__mbLastTitles / window.__mbAllTitles)
            searchresult.createTiles(studyoptions, type);
            //Filter Options
            function filterOptions(id, item) {
              filterValue = item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_");
              filterValueID = id.replace("#", "");
              if (filterValueID != "clearing") {
                $(id).append(`
                <li class="dropdown-list__item">
                    <label class=" dropdown-option dropdown-option--checkmark filter_text" for="${filterValue}">
                    <span class="dropdown-option__container">
                    <input
                        class="dropdown-option__check"
                        type="checkbox"
                        id="${filterValue}"
                        name="${item}"
                        data-item="${item}"
                        data-pageType="${filterValueID}"
                        value="${filterValue}">
                        <span class="dropdown-option__select"></span>
                        <span class="dropdown-option__label">${item}</span>
                        </span>
                    </label>
                </li>
                `);
              } else if (filterValueID == "clearing") {
                let clearingOptions = [];

                if (filterValue === "UK_students") {
                  clearingOptions.push({
                    value: "UK_students",
                    label: "UK students",
                  });
                }

                if (filterValue === "International_students") {
                  clearingOptions.push({
                    value: "International_students",
                    label: "International students",
                  });
                }

                if (filterValue === "All_students") {
                  clearingOptions.push(
                    {
                      value: "UK_students",
                      label: "UK students",
                    },
                    {
                      value: "International_students",
                      label: "International students",
                    },
                  );
                }

                clearingOptions.forEach(function (option) {
                  if ($(id).find(`#${option.value}`).length === 0) {
                    $(id).append(`
                        <li class="dropdown-list__item">
                          <label class="dropdown-option dropdown-option--checkmark filter_text" for="${option.value}">
                            <span class="dropdown-option__container">
                              <input
                                class="dropdown-option__check"
                                type="checkbox"
                                id="${option.value}"
                                name="${option.label}"
                                data-item="${option.value}"
                                data-pageType="${filterValueID}"
                                value="${option.value}">
                              <span class="dropdown-option__select"></span>
                              <span class="dropdown-option__label">${option.label}</span>
                            </span>
                          </label>
                        </li>
                      `);
                  }
                });
              }
            }
            //appending drop down values
            if (studyloadFlag) {
              studyloadFlag = false;
              //desktop view
              document.getElementById("subject").innerHTML = "";
              subject.filter((item) => {
                filterOptions("#subject", item);
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.addFilter("subject", item, this);
                  },
                });
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.filterTiles(this);
                    clearFilterDesktop();
                  },
                });
              });
              document.getElementById("location").innerHTML = "";
              locationArray.filter((item, key) => {
                var lastcheckbox = "";
                if (key == locationArray.length - 1) {
                  lastcheckbox = "searchresult.dropdowncloseonFocus()";
                }
                filterOptions("#location", item);
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.addFilter("location", item, this);
                  },
                });
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.filterTiles(this);
                    clearFilterDesktop();
                  },
                });
              });

              if (document.getElementById("clearing") != null) {
                document.getElementById("clearing").innerHTML = "";
                clearingArray.filter((item, key) => {
                  var lastcheckbox = "";
                  if (key == clearingArray.length - 1) {
                    lastcheckbox = "searchresult.dropdowncloseonFocus()";
                  }
                  filterOptions("#clearing", item);
                });

                $("#clearing .dropdown-option__check")
                  .off("click")
                  .on({
                    click: function () {
                      var clearingLabel = this.name || this.dataset.item;
                      searchresult.addFilter("clearing", clearingLabel, this);
                      searchresult.filterTiles(this);
                      clearFilterDesktop();
                    },
                  });
              }

              document.getElementById("studyLevel").innerHTML = "";
              studyLevel.filter((item) => {
                filterOptions("#studyLevel", item);
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.addFilter("study", item, this);
                  },
                });
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.filterTiles(this);
                    clearFilterDesktop();
                  },
                });
              });
              document.getElementById("startDate").innerHTML = "";
              startDate.filter((item) => {
                filterOptions("#startDate", item);
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.addFilter("date", item, this);
                  },
                });
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.filterTiles(this);
                    clearFilterDesktop();
                  },
                });
              });
            }
            if (articleloadFlag) {
              articleloadFlag = false;
              document.getElementById("articleType").innerHTML = "";
              articleType.filter((item, key) => {
                var lastcheckbox = "";
                if (key == locationArray.length - 1) {
                  lastcheckbox = "searchresult.dropdowncloseonFocus()";
                }
                filterOptions("#articleType", item);
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.addFilter("articleType", item, this);
                  },
                });
                $(`#${item.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_")}`).on({
                  click: function () {
                    searchresult.filterTiles(this);
                  },
                });
              });
            }
            //loop to check the filters after the filters are rendered again
            for (var i = 0; i < filterId.length; i++) {
              document.getElementById(`${filterId[i]}`).checked = true;
            }
            for (var i = 0; i < articlefilterId.length; i++) {
              document.getElementById(`${articlefilterId[i]}`).checked = true;
            }
            if (msg.resultset && msg.resultset.results) {
              if (type == "study") {
                studyPaginationFlag = false;
                paginationNavigation();
                searchresult.CreatePagination(currentPageStudy, msg.resultset.results, type);
              }
              if (type == "articles") {
                articlePaginationFlag = false;
                paginationNavigation();
                searchresult.CreatePagination(currentPageArticle, msg.resultset.results, type);
              }
            }
          },
        });
      },
      createTiles: function (studyoptions, type) {
        //appending tile values
        document.querySelector(".grid_container_row").style.display = "block";
        document.getElementById("cmp_study_options--container").innerHTML = "";
        window.scrollTo(0, 0);
        if (type == "articles") {
          document.getElementById("nav--study_options").classList.remove("tab--active");
          document.getElementById("study_options_desktop").style.display = "none";
          document.getElementById("articles_desktop").style.display = "block";
          document.getElementById("nav--articles").classList.add("tab--active");
          checkFilterOptions("clearAll");
        }
        if (type == "study") {
          document.getElementById("nav--study_options").classList.add("tab--active");
          document.getElementById("study_options_desktop").style.display = "block";
          document.getElementById("articles_desktop").style.display = "none";
          document.getElementById("nav--articles").classList.remove("tab--active");
          checkFilterOptions("clearAll");
        }

        // Show Error
        showNoResultsState(studyoptions.length > 0);

        studyoptions.filter((item) => {
          var entryRequirementsCheck = item.clearingALevel !== undefined ? item.clearingALevel : item.entryReq !== undefined ? item.entryReq : "";
          var entryRequirements =
            entryRequirementsCheck !== "" && item.entryRequirementsToggle !== "True" ? `Entry requirements<br><strong>${entryRequirementsCheck}</strong>` : "";

          $("#cmp_study_options--container").append(`<div class="cmp-tile cmp-tile--course">
         <a href="${item.learnMore}" title="${item.title}" aria-label="${item.title}">
            <div class="cmp-tile__image">
              
                <img loading="lazy" alt=""  src="${
                  item.imagePath != undefined ? item.imagePath : "/etc.clientlibs/uon/clientlibs/clientlib-site/resources/images/default.png"
                }?fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&wid=303" height="170" width="303">

            </div>
            
            <div class="cmp-tile__contents">
                <span class="body-small" style="${item.facultyTag == undefined ? "display:none;" : ""}">${
            item.facultyTag == undefined ? "" : item.facultyTag
          }</span>

                <span class="body-small" style="${item.articleTag == undefined ? "display:none;" : ""}">${
            item.articleTag == undefined ? "" : item.articleTag
          }</span>


                <h3 class="cmp-tile__title heading-small">${item.title}</h3>
                
                
                <div class="cmp-tile__tags" style="${item.facultyTag == undefined ? "display:none;" : ""}">
                    ${item.clearing !== undefined ? '<div style="display:none;">' : ""}
                <span class="tag tag--primary tag--small" aria-label="Entry ${item.entryReq}">
                    <span class="tag--txt">Entry ${item.entryReq}</span>
                </span>
            
                    
                <span class="tag tag--primary tag--small" aria-label='UCAS ${item.ucasCode == undefined ? "" : item.ucasCode}'>
                    <span class="tag--txt">UCAS ${item.ucasCode == undefined ? "" : item.ucasCode}</span>
                </span>
            
                    
                <span class="tag tag--primary tag--small" aria-label='${item.duration == undefined ? "" : item.duration}'>
                    <span class="tag--txt">${item.duration == undefined ? "" : item.duration}</span>
                </span>
            
                    
                <span class="tag tag--primary tag--small" aria-label="${item.startDate == undefined ? "" : item.startDate}">
                    <span class="tag--txt">${item.startDate == undefined ? "" : item.startDate}</span>
                </span>

                ${item.clearing !== undefined ? "</div>" : ""}

                ${
                  item.clearing == "All students"
                    ? `<span class="tag tag--full tag--primary tag--small" aria-label="Primary small tag"><span class="tag--txt">Open to all students</span></span>`
                    : ""
                }
                ${
                  item.clearing == "International students"
                    ? `<span class="tag tag--full tag--primary tag--small" aria-label="Primary small tag"><span class="tag--txt">Open to international applicants only</span></span>`
                    : ""
                }
                ${
                  item.clearing == "UK students"
                    ? `<span class="tag tag--full tag--primary tag--small" aria-label="Primary small tag"><span class="tag--txt">Open to UK applicants only</span></span>`
                    : ""
                }
                ${
                  item.clearing !== undefined
                    ? '<span class="tag tag--full tag--primary tag--small tag--icon tag--bg" aria-label="View clearing entry requirements"><span class="tag--txt">View clearing entry requirements</span></span>'
                    : ""
                }
                  

                </div>
            </div>
          </a>
          <div class="cmp-tile__buttons">
            <button data-share-link="${item.learnMore}" data-share-title="${item.title}" data-share-img="${
            item.imagePath != undefined ? item.imagePath : "/etc.clientlibs/uon/clientlibs/clientlib-site/resources/images/default.png"
          }?fmt=jpg&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&wid=580" class="share-button button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--single--medium--saved" aria-label="Share ${
            item.title
          }"></button>
        </div>
      </div>`);
        });
        if (type == "study") {
          displayFilterOptions(".article", "none");
          displayFilterOptions(".study", "block");
          displayFilterOptions(".study_ptag", "-webkit-box");
          displayFilterOptions(".article_ptag", "none");
          paginationHeader("paginationarticles", "none");
          paginationHeader("paginationstudy", "block");
        } else if (type == "articles") {
          displayFilterOptions(".article", "block");
          displayFilterOptions(".study", "none");
          displayFilterOptions(".study_ptag", "none");
          displayFilterOptions(".article_ptag", "-webkit-box");
          paginationHeader("paginationarticles", "block");
          paginationHeader("paginationstudy", "none");
        }
        if (studyoptions.length == 0) {
          if (type == "articles") {
            paginationHeader("paginationarticles", "none");
          }
          if (type == "study") {
            paginationHeader("paginationstudy", "none");
          }
        }
        if (type == "articles") {
          checkFilterOptions("clearAllArticle");
        }
        if (type == "study") {
          checkFilterOptions("clearAllStudy");
        }
      },
      NumPages: function (objJson) {
        return Math.ceil(estimatedCount / recordsPerPage);
      },

      CreatePagination(page, value, classes) {
        //top pagination
        $("#paginationstudyheader").remove();
        $("#paginationstudyfooter").remove();
        $("#paginationarticlesfooter").remove();
        $("#paginationarticlesheader").remove();
        var currentIndex = page * recordsPerPage - (recordsPerPage - 1);
        var lastIndex = page * recordsPerPage <= estimatedCount ? page * recordsPerPage : estimatedCount;
        //Validate page
        if (page < 1) {
          page = 0;
        }
        if (page > this.NumPages(value)) {
          page = this.NumPages(value);
        }
        var pagePlus = Number(page) + 1;
        var pageMinus = Number(page) - 1;

        var forText = !isEmptySearch ? " for" : "";

        var querySpan = !isEmptySearch ? `<span class="search-results__search-query-text search_query_text" id="pagination_query">"${queryString}"</span>` : "";

        var ariaQueryText = !isEmptySearch ? ` entries for ${queryString}` : " items";

        var topEl = `<div class="search-results__pagination-top anchor_content" data-content="${classes}" id="pagination${classes}header">
                        <font id="pagination_label"
                          class="pagination_label"
                          aria-label="You are currently viewing, items ${currentIndex} to ${lastIndex} of ${estimatedCount}${ariaQueryText}">
                          ${currentIndex}-${lastIndex} of ${estimatedCount} entries ${forText}
                        </font>
                        ${querySpan}
                      </div>
                    `;

        var botEl = `<div id="pagination${classes}footer" class="pagination__wrapper" data-content="${classes}">
                      
                                <button
                                        id="${classes}--btn_prev-start"
                                        aria-label="Go to the start, page 1"
                                        tabindex="${page == 1 ? "-1" : "0"}"
                                        class="pagination-start pagination__btn--first-page swiper-button-prev ${
                                          page == 1 ? "button--icon--single--disabled" : ""
                                        }"
                                        data-content="${classes}"
                                    >Back to first</button>
                                    <div class="pagination__container">

                                    <button
                                        id="${classes}--btn_prev"
                                        aria-label="Go to Previous page, page ${pageMinus}"
                                        tabindex="${page == 1 ? "-1" : "0"}"
                                        class="swiper-button-prev  pagination-prev pagination__btn--start button button--secondary button--outline button--small button--icon--secondary--outline button--icon--single--small--left-arrow ${
                                          page == 1 ? "button--icon--single--disabled" : ""
                                        }"
                                        data-content="${classes}" data-page="${pageMinus}"
                                    ></button>
                                    <span
                                        id="${classes}--pagination_bottom"
                                        class="pagination_text anchor_content pagination__counter"
                                        data-content="${classes}"
                                        aria-label="You are now on page ${page} of ${this.NumPages(
          value,
        )} and looking at  ${currentIndex} - ${lastIndex} of ${estimatedCount} entries "
                                    >Showing ${currentIndex} - ${lastIndex} of ${estimatedCount} entries</span>
                                    <button
                                        id="${classes}--btn_next"
                                        aria-label="Go to next page, page ${pagePlus}"
                                        tabindex="${page == this.NumPages(value) ? "-1" : "0"}"
                                        class="pagination-next swiper-button-next pagination__btn--end button button--secondary button--outline button--small button--icon--secondary--outline button--icon--single--small--right-arrow ${
                                          page == this.NumPages(value) ? "button--icon--single--disabled" : ""
                                        }"
                                        data-content="${classes}" data-page="${pagePlus}"
                                    ></button>
                                    
                                    </div>

                                    

                                    <button
                                        id="${classes}--btn_next-end"
                                        aria-label="Goto the last page, page ${this.NumPages(value)}"
                                        tabindex="${page == this.NumPages(value) ? "-1" : "0"}"
                                        class="pagination-end swiper-button-next  pagination__btn--last-page ${
                                          page == this.NumPages(value) ? "button--icon--single--disabled" : ""
                                        }"
                                        data-content="${classes}" data-page="${this.NumPages(value)}"
                                    >Go to last</button>
                              
                        </div>`;
        document.querySelector("#top--pagination-container").insertAdjacentHTML("beforeend", topEl);
        document.querySelector("#bottom--pagination-container").insertAdjacentHTML("beforeend", botEl);
        paginationNavigation();
        if (pageNumber === 1) {
          $("#" + document.querySelector(".swiper-button-prev").id).attr("tabindex", -1);
        }
        if (pageNumber === this.NumPages(value)) {
          $("#" + document.querySelector(".swiper-button-next").id).attr("tabindex", -1);
        }
        document
          .querySelector(".tile-heading")
          .setAttribute("aria-label", `Search results for ${queryString}, There are currently ${estimatedCount} items for ${queryString}`);
      },
      filterTiles: function (val) {
        checkFilterOptions("clearAll");

        // Filters change the result set, so cached pagination is no longer valid
        resultPagesStudy = null;
        resultPagesArticles = null;

        currentPageStudy = 1;
        currentPageArticle = 1;
        pageNumber = 1;

        filterArray = [];
        articlefilterArray = [];
        var type;
        function normaliseClearingValue(value) {
          if (value === "UK_students") {
            return "UK students";
          }
          if (value === "International_students") {
            return "International students";
          }
          if (value === "All_students") {
            return "All students";
          }
          return value;
        }

        function buildFilter(label, value) {
          return {
            label: `${label}`,
            regex: `^\\Q${value}\\E$`,
            description: `${value}`,
            id: `${value}`,
            value: {
              str: `${value}`,
            },
          };
        }

        function rebuildStudyFiltersFromCheckedBoxes() {
          subjectArray = [];
          dateArray = [];
          locationArray = [];
          clearingArray = [];
          levelArray = [];
          filterArray = [];
          studyArray = [];
          filterId = [];
          labelId = [];

          $(
            "#subject .dropdown-option__check:checked, #startDate .dropdown-option__check:checked, #location .dropdown-option__check:checked, #clearing .dropdown-option__check:checked, #studyLevel .dropdown-option__check:checked",
          ).each(function () {
            var checkbox = this;
            var label = checkbox.dataset.pagetype;
            var filterItemValue = checkbox.dataset.item;

            if (!label || !filterItemValue) {
              return;
            }

            filterId.push(checkbox.id);
            labelId.push(label);

            if (label == "subject") {
              subjectArray.push(buildFilter(label, filterItemValue));
            }
            if (label == "startDate") {
              dateArray.push(buildFilter(label, filterItemValue));
            }
            if (label == "location") {
              locationArray.push(buildFilter(label, filterItemValue));
            }
            if (label == "clearing") {
              var clearingValue = normaliseClearingValue(filterItemValue);
              clearingArray.push(buildFilter(label, clearingValue));

              if (clearingValue === "UK students" || clearingValue === "International students") {
                clearingArray.push(buildFilter(label, "All students"));
              }
            }
            if (label == "studyLevel") {
              levelArray.push(buildFilter(label, filterItemValue));
            }
          });

          filterId = Array.from(new Set(filterId.map(JSON.stringify)), JSON.parse);
          labelId = Array.from(new Set(labelId.map(JSON.stringify)), JSON.parse);

          subjectconstraintsArray["filter_base"] = Array.from(new Set(subjectArray.map(JSON.stringify)), JSON.parse);
          dateconstraintsArray["filter_base"] = Array.from(new Set(dateArray.map(JSON.stringify)), JSON.parse);
          locationconstraintsArray["filter_base"] = Array.from(new Set(locationArray.map(JSON.stringify)), JSON.parse);
          clearingconstraintsArray["filter_base"] = Array.from(new Set(clearingArray.map(JSON.stringify)), JSON.parse);
          levelconstraintsArray["filter_base"] = Array.from(new Set(levelArray.map(JSON.stringify)), JSON.parse);

          if (subjectconstraintsArray["filter_base"].length != 0) {
            studyArray.push(subjectconstraintsArray);
          }
          if (dateconstraintsArray["filter_base"].length != 0) {
            studyArray.push(dateconstraintsArray);
          }
          if (locationconstraintsArray["filter_base"].length != 0) {
            studyArray.push(locationconstraintsArray);
          }
          if (clearingconstraintsArray["filter_base"].length != 0) {
            studyArray.push(clearingconstraintsArray);
          }
          if (levelconstraintsArray["filter_base"].length != 0) {
            studyArray.push(levelconstraintsArray);
          }
        }
        if (val.dataset.pagetype != "articleType") {
          type = "study";
          rebuildStudyFiltersFromCheckedBoxes();
        } else if (val.dataset.pagetype == "articleType") {
          type = "articles";
          if (val.checked == true) {
            articlefilterId.push(val.id);
            articlelabelId.push(val.dataset.pagetype);
            articlefilterId = Array.from(new Set(articlefilterId.map(JSON.stringify)), JSON.parse);
            articlelabelId = Array.from(new Set(articlelabelId.map(JSON.stringify)), JSON.parse);
            for (var i = 0; i < articlefilterId.length; i++) {
              articleArray = [];
              label = $(`#${articlefilterId[i]}`)[0].attributes["data-pagetype"].value;
              var filters = {
                label: `${label}`,
                regex: `^\\Q${$(`#${articlefilterId[i]}`)[0].dataset.item}\\E$`,
                description: `${$(`#${articlefilterId[i]}`)[0].dataset.item}`,
                id: `${$(`#${articlefilterId[i]}`)[0].dataset.item}`,
                value: {
                  str: `${$(`#${articlefilterId[i]}`)[0].dataset.item}`,
                },
              };
            }
            articleconstraintsArray["filter_base"].push(filters);
            articleArray.push(articleconstraintsArray);
            articleArray = Array.from(new Set(articleArray.map(JSON.stringify)), JSON.parse);
            articlefilterArray = Array.from(new Set(articlefilterArray.map(JSON.stringify)), JSON.parse);
          } else if (val.checked == false) {
            for (var i = 0; i < articleArray[0]["filter_base"].length; i++) {
              if (articleArray[0]["filter_base"][i].id.replaceAll(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_") == val.id) {
                articleArray[0]["filter_base"].splice(i, 1);
              }
            }
            articleconstraintsArray["filter_base"] = articleArray[0]["filter_base"];
            for (var i = 0; i < articlefilterId.length; i++) {
              if (articlefilterId[i] === val.id) {
                articlefilterId.splice(i, 1);
              }
            }
          }
        }
        this.requestCreation(type);
      },

      addFilter: function (type, filter, val) {
        if (type === "sort") {
          if (val.checked) {
            activeFilter[0].sort.push(filter);
          } else {
            activeFilter[0].sort.splice(
              activeFilter[0].sort.findIndex((e) => e == filter),
              1,
            );
          }
          document.querySelector(".select_number-sort").innerHTML = `(${activeFilter[0].sort.length})`;
        }
        if (type === "study") {
          if (val.checked) {
            activeFilter[0].studyLevel.push(filter);
          } else {
            activeFilter[0].studyLevel.splice(
              activeFilter[0].studyLevel.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].studyLevel.length >= 1) {
            document.querySelector(".select_number-studyLevel").innerHTML = `(${activeFilter[0].studyLevel.length})`;
          } else {
            document.querySelector(".select_number-studyLevel").innerHTML = "";
          }
        }
        if (type === "subject") {
          if (val.checked) {
            activeFilter[0].subject.push(filter);
          } else {
            activeFilter[0].subject.splice(
              activeFilter[0].subject.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].subject.length >= 1) {
            document.querySelector(".select_number-subject").innerHTML = `(${activeFilter[0].subject.length})`;
          } else {
            document.querySelector(".select_number-subject").innerHTML = "";
          }
        }
        if (type === "date") {
          if (val.checked) {
            activeFilter[0].date.push(filter);
          } else {
            activeFilter[0].date.splice(
              activeFilter[0].date.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].date.length >= 1) {
            document.querySelector(".select_number-date").innerHTML = `(${activeFilter[0].date.length})`;
          } else {
            document.querySelector(".select_number-date").innerHTML = "";
          }
        }
        if (type === "location") {
          if (val.checked) {
            activeFilter[0].location.push(filter);
          } else {
            activeFilter[0].location.splice(
              activeFilter[0].location.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].location.length >= 1) {
            document.querySelector(".select_number-location").innerHTML = `(${activeFilter[0].location.length})`;
          } else {
            document.querySelector(".select_number-location").innerHTML = "";
          }
        }
        if (type === "clearing") {
          if (val.checked) {
            activeFilter[0].clearing.push(filter);
          } else {
            activeFilter[0].clearing.splice(
              activeFilter[0].clearing.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].clearing.length >= 1) {
            document.querySelector(".select_number-clearing").innerHTML = `(${activeFilter[0].clearing.length})`;
          } else {
            document.querySelector(".select_number-clearing").innerHTML = "";
          }
        }
        if (type === "time") {
          if (val.checked) {
            activeFilter[0].time.push(filter);
          } else {
            activeFilter[0].time.splice(
              activeFilter[0].time.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].time.length >= 1) {
            document.querySelector(".select_number-time").innerHTML = `(${activeFilter[0].time.length})`;
          } else {
            document.querySelector(".select_number-time").innerHTML = "";
          }
        }
        if (type === "articleType") {
          if (val.checked) {
            activeFilter[0].articleType.push(filter);
          } else {
            activeFilter[0].articleType.splice(
              activeFilter[0].articleType.findIndex((e) => e == filter),
              1,
            );
          }
          if (activeFilter[0].articleType.length >= 1) {
            document.querySelector(".select_number-articleType").innerHTML = ` (${activeFilter[0].articleType.length})`;
          } else {
            document.querySelector(".select_number-articleType").innerHTML = "";
          }
        }

        var filterParent = document.querySelector(".activeFilters--lists");
        var numb = filterParent.childElementCount;

        if (type != "articleType") {
          var filterList = `<li class="activerFilters--list ${filter.replaceAll(
            /[&\/\\#, +()$~%.'":*?<>{}]/g,
            "_",
          )}"  value=${numb} id="${type}" data-pageType="study">
                                    <button class="button button--primary button--small x" aria-label="${filter} - Clear this Filter" value='${filter.replaceAll(
            /[&\/\\#, +()$~%.'":*?<>{}]/g,
            "_",
          )}'><span class="search-results__x-title">${filter} <span class="search-results__x-icon">x</span></span></button>
                                </li>`;
          $(".activeFilters--lists").find(`[data-pagetype='article']`).hide();
          var clearallbutton = `<button id="clearAllStudy" aria-label="Clear all Filters" class="search-results__clear-all-btn button button--secondary button--outline button--small study"><span>Clear All</span></button>`;
        } else if (type == "articleType") {
          var filterList = `<li class="activerFilters--list ${filter.replaceAll(
            /[&\/\\#, +()$~%.'":*?<>{}]/g,
            "_",
          )}"  value=${numb} id="${type}" data-pageType="article">
                <button class="button button--primary button--small x" aria-label="${filter} - Clear this Filter" value='${filter.replaceAll(
            /[&\/\\#, +()$~%.'":*?<>{}]/g,
            "_",
          )}'><span class="search-results__x-title">${filter} <span class="search-results__x-icon">x</span></span></button>
            </li>`;
          var clearallarticlebutton = `<button id="clearAllArticle" aria-label="Clear all Filters" class="search-results__clear-all-btn button button--secondary button--outline button--small article"><span>Clear All</span></button>`;
          $(".activeFilters--lists").find(`[data-pagetype='study']`).hide();
        }
        if (val.checked) {
          if (type != "articleType") {
            var previousBtn = document.getElementById("clearAllStudy");
            if (previousBtn && previousBtn != undefined) {
              filterParent.removeChild(previousBtn);
            }
          }
          if (type == "articleType") {
            var previousBtn = document.getElementById("clearAllArticle");
            if (previousBtn && previousBtn != undefined) {
              filterParent.removeChild(previousBtn);
            }
          }
          filterParent.insertAdjacentHTML("beforeend", filterList);
          if (type != "articleType") {
            filterParent.insertAdjacentHTML("beforeend", clearallbutton);
          }
          if (type == "articleType") {
            filterParent.insertAdjacentHTML("beforeend", clearallarticlebutton);
          }
        } else {
          document.getElementsByClassName(filter.replaceAll(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_"))[0].remove();
        }
        // if (windowSize > 767) {
        this.assessFilter();
        // }
        var clearAllButtonStudy = document.getElementById("clearAllStudy");
        if (clearAllButtonStudy != null) {
          clearAllButtonStudy.addEventListener("click", function () {
            searchresult.resetFilters("study");
          });

          clearAllButtonStudy.addEventListener("keyup", function () {
            if (keyCode == 13) {
              searchresult.resetFilters("study");
            }
          });
        }
        var clearAllButtonArticle = document.getElementById("clearAllArticle");
        if (clearAllButtonArticle != null) {
          clearAllButtonArticle.addEventListener("click", function () {
            searchresult.resetFilters("article");
          });

          clearAllButtonArticle.addEventListener("keyup", function () {
            if (keyCode == 13) {
              searchresult.resetFilters("article");
            }
          });
        }
      },
      assessFilter() {
        var filteredValues = [];
        if (
          activeFilter[0].sort.length == 0 &&
          activeFilter[0].studyLevel.length == 0 &&
          activeFilter[0].subject.length == 0 &&
          activeFilter[0].date.length == 0 &&
          activeFilter[0].location.length == 0 &&
          activeFilter[0].clearing.length == 0 &&
          activeFilter[0].articleType.length == 0 &&
          activeFilter[0].time.length == 0
        ) {
          allRecords = [];
          filteredValues = [];
          document.getElementsByClassName("activeFilters")[0].style.display = "none";
        } else {
          document.getElementsByClassName("activeFilters")[0].style.display = "block";
        }
      },
      resetFilters: function (event) {
        var type = event;

        // Reset cached pagination when filters are cleared
        resultPagesStudy = null;
        resultPagesArticles = null;

        currentPageStudy = 1;
        currentPageArticle = 1;
        pageNumber = 1;
        if (event.id == "clearAllStudy" || (event.currentTarget && event.currentTarget.id == "studyClear") || type === "study") {
          type = "study";
          filterArray = [];
          filterId = [];
          studyArray = [];
          $("#study_alpha_sort").find(".select_number-study").empty();
          document.querySelector(".select_number-studyLevel").innerHTML = "";
          document.querySelector(".select_number-subject").innerHTML = "";
          document.querySelector(".select_number-date").innerHTML = "";
          document.querySelector(".select_number-location").innerHTML = "";
          if (document.querySelector(".select_number-clearing") != null) {
            document.querySelector(".select_number-clearing").innerHTML = "";
          }
          activeFilter[0].subject = [];
          activeFilter[0].studyLevel = [];
          activeFilter[0].date = [];
          activeFilter[0].location = [];
          activeFilter[0].clearing = [];
          activeFilter[0].time = [];
          subjectArray = [];
          dateArray = [];
          locationArray = [];
          clearingArray = [];
          levelArray = [];
          subjectconstraintsArray["filter_base"] = [];
          dateconstraintsArray["filter_base"] = [];
          locationconstraintsArray["filter_base"] = [];
          clearingconstraintsArray["filter_base"] = [];
          levelconstraintsArray["filter_base"] = [];
          document
            .querySelector(".activeFilters--lists")
            .querySelectorAll(`[data-pagetype='study']`)
            .forEach(function (el) {
              el.remove();
            });
        } else {
          type = "articles";
          articlefilterId = [];
          articlefilterArray = [];
          articleArray = [];
          articleconstraintsArray["filter_base"] = [];
          document.querySelector(".select_number-articleType").innerHTML = "";
          activeFilter[0].articleType = [];
          document
            .querySelector(".activeFilters--lists")
            .querySelectorAll(`[data-pagetype='article']`)
            .forEach(function (el) {
              el.remove();
            });
        }
        this.requestCreation(type);
        document.querySelector(".select_number-sort").innerHTML = "";
        var input = document.querySelectorAll("input");
        for (let i = 0; i < input.length; i++) {
          input[i].checked = false;
        }

        var checkedContainers = document.querySelectorAll(".dropdown-option__container--checked");
        for (let i = 0; i < checkedContainers.length; i++) {
          checkedContainers[i].classList.remove("dropdown-option__container--checked");
        }

        checkFilterOptions("clearAll");
      },
      deletingFilter: function (data) {
        var name = data.closest("li").getAttribute("id");
        var child = data.closest("li").getAttribute("class");
        var label = data.getAttribute("value");
        var uncheck = document.getElementById(label);
        uncheck.checked = false;
        document.getElementById(label).checked = false;
        data.classList.remove();
        document.getElementById(label).closest(".dropdown-option__container")?.classList.remove("dropdown-option__container--checked");

        var type;
        if (name != "articleType") {
          type = "study";
        } else {
          type = "articles";
        }
        for (var j = 0; j < studyArray.length; j++) {
          for (var i = 0; i < studyArray[j]["filter_base"].length; i++) {
            if (studyArray[j]["filter_base"][i].id.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_") == label) {
              studyArray[j]["filter_base"].splice(i, 1);
            }
          }
          //check filter base label and accordingly remove from the arrays also
          if (studyArray[j].label == "startDate") {
            for (var k = 0; k < dateArray.length; k++) {
              if (dateArray[k].id == label) {
                dateArray.splice(k, 1);
              }
            }
          }
          if (studyArray[j].label == "subject") {
            for (var k = 0; k < subjectArray.length; k++) {
              if (subjectArray[k].id == label) {
                subjectArray.splice(k, 1);
              }
            }
          }
          if (studyArray[j].label == "location") {
            for (var k = 0; k < locationArray.length; k++) {
              if (locationArray[k].id == label) {
                locationArray.splice(k, 1);
              }
            }
          }
          if (studyArray[j].label == "clearing") {
            for (var k = 0; k < clearingArray.length; k++) {
              if (clearingArray[k].id == label) {
                clearingArray.splice(k, 1);
              }
            }
          }
          if (studyArray[j].label == "studyLevel") {
            for (var k = 0; k < levelArray.length; k++) {
              if (levelArray[k].id == label) {
                levelArray.splice(k, 1);
              }
            }
          }
          if (studyArray[j]["filter_base"].length == 0) {
            studyArray.splice(j, 1);
          }
        }
        if (articleArray[0] && articleArray[0]["filter_base"]) {
          for (var i = 0; i < articleArray[0]["filter_base"].length; i++) {
            if (articleArray[0]["filter_base"][i].id.replaceAll(/[&\/\\#|, +()$~%.'":*?<>{}]/g, "_") == label) {
              articleArray[0]["filter_base"].splice(i, 1);
            }
          }
          articleconstraintsArray["filter_base"] = articleArray[0]["filter_base"];
          if (articleArray[0]["filter_base"].length == 0) {
            articleArray.splice(0, 1);
          }
        }
        for (var j = 0; j < studyArray.length; j++) {
          if (studyArray[j].label == "subject") {
            subjectconstraintsArray["filter_base"] = studyArray[j]["filter_base"];
          }
          if (studyArray[j].label == "startDate") {
            dateconstraintsArray["filter_base"] = studyArray[j]["filter_base"];
          }
          if (studyArray[j].label == "location") {
            locationconstraintsArray["filter_base"] = studyArray[j]["filter_base"];
          }
          if (studyArray[j].label == "clearing") {
            clearingconstraintsArray["filter_base"] = studyArray[j]["filter_base"];
          }
          if (studyArray[j].label == "studyLevel") {
            levelconstraintsArray["filter_base"] = studyArray[j]["filter_base"];
          }
        }
        for (var i = 0; i < filterId.length; i++) {
          if (filterId[i] == label) {
            filterId.splice(i, 1);
          }
        }
        for (var i = 0; i < articlefilterId.length; i++) {
          if (articlefilterId[i] == label) {
            articlefilterId.splice(i, 1);
          }
        }
        searchresult.requestCreation(type);
        const checkForFilters = document.getElementsByClassName(child)[0];

        if (checkForFilters) {
          checkForFilters.remove();
        }
        if (name === "sort") {
          activeFilter[0].sort.splice(
            activeFilter[0].sort.findIndex((e) => e == label),
            1,
          );
          document.querySelector(".select_number-sort").innerHTML = `(${activeFilter[0].sort.length})`;
        }
        if (name === "studyLevel") {
          activeFilter[0].studyLevel.splice(
            activeFilter[0].studyLevel.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].studyLevel.length >= 1) {
            document.querySelector(".select_number-studyLevel").innerHTML = `(${activeFilter[0].studyLevel.length})`;
          } else {
            document.querySelector(".select_number-studyLevel").innerHTML = "";
          }
        }
        if (name === "subject") {
          activeFilter[0].subject.splice(
            activeFilter[0].subject.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].subject.length >= 1) {
            document.querySelector(".select_number-subject").innerHTML = `(${activeFilter[0].subject.length})`;
          } else {
            document.querySelector(".select_number-subject").innerHTML = "";
          }
        }
        if (name === "date") {
          activeFilter[0].date.splice(
            activeFilter[0].date.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].date.length >= 1) {
            document.querySelector(".select_number-date").innerHTML = `(${activeFilter[0].date.length})`;
          } else {
            document.querySelector(".select_number-date").innerHTML = "";
          }
        }
        if (name === "location") {
          activeFilter[0].location.splice(
            activeFilter[0].location.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].location.length >= 1) {
            document.querySelector(".select_number-location").innerHTML = `(${activeFilter[0].location.length})`;
          } else {
            document.querySelector(".select_number-location").innerHTML = "";
          }
        }
        if (name === "clearing") {
          activeFilter[0].clearing.splice(
            activeFilter[0].clearing.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].clearing.length >= 1) {
            document.querySelector(".select_number-clearing").innerHTML = `(${activeFilter[0].clearing.length})`;
          } else {
            document.querySelector(".select_number-clearing").innerHTML = "";
          }
        }
        if (name === "time") {
          activeFilter[0].time.splice(
            activeFilter[0].time.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].time.length >= 1) {
            document.querySelector(".select_number-time").innerHTML = `(${activeFilter[0].time.length})`;
          } else {
            document.querySelector(".select_number-time").innerHTML = "";
          }
        }
        if (name === "articleType") {
          activeFilter[0].articleType.splice(
            activeFilter[0].articleType.findIndex((e) => e == label),
            1,
          );
          if (activeFilter[0].articleType.length >= 1) {
            document.querySelector(".select_number-articleType").innerHTML = `(${activeFilter[0].articleType.length})`;
          } else {
            document.querySelector(".select_number-articleType").innerHTML = "";
          }
        }
        checkFilterOptions("clearAll");
        if (type == "articles") {
          checkFilterOptions("clearAllArticle");
        }
        if (type == "study") {
          checkFilterOptions("clearAllStudy");
        }
      },

      NextPage: function (id, value) {
        if (id == "study") {
          currentPageStudy = currentPageStudy + 1;
        }
        if (id == "articles") {
          currentPageArticle = currentPageArticle + 1;
        }
        this.requestCreation(id, orderBy, order_direction);
      },
      PrevPage: function (id, value) {
        if (id == "study") {
          if (currentPageStudy > 1) {
            currentPageStudy = currentPageStudy - 1;
          }
        }
        if (id == "articles") {
          if (currentPageArticle > 1) {
            currentPageArticle = currentPageArticle - 1;
          }
        }
        this.requestCreation(id, orderBy, order_direction);
      },
      EndPage: function (id, value) {
        var lastPage = Number(value) || 1;
        if (id == "study") {
          currentPageStudy = lastPage;
        }
        if (id == "articles") {
          currentPageArticle = lastPage;
        }
        this.requestCreation(id, orderBy, order_direction);
      },
      StartPage: function (id, value) {
        if (id == "study") {
          currentPageStudy = 1;
        }
        if (id == "articles") {
          currentPageArticle = 1;
        }
        this.requestCreation(id, orderBy, order_direction);
      },
      // -- end of methods
    };
    // Remove temporary placeholder for methods
    delete searchresult.methods_placeholder_remove;
    searchresult.init();
  }
  // Event listeners

  // Study/Article tab clicks
  document.querySelectorAll("#nav--articles, #nav--study_options").forEach((el) => el.addEventListener("click", ResetPagination));

  // Sort clicks
  document.querySelectorAll(".sort-input").forEach((el) => {
    el.addEventListener("click", sortTile);

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // stops page scrolling
        sortTile(e);
      }
    });
  });
}

startSearch();

//User presses escape key

function clearFilterDesktop() {
  //Clear Single filter Selected

  $(".x").click(function () {
    var filtersActive = document.querySelectorAll(".activerFilters--list").length;
    if (filtersActive == 0) {
      document.getElementById("clearAllStudy").click();
    } else {
      searchresult.deletingFilter(this);
    }
  });

  $(".x").keypress(function (e) {
    var filtersActive = document.querySelectorAll(".activerFilters--list").length;
    if (e.key === "Enter" || e.keyCode === 13) {
      if (filtersActive == 0) {
        document.getElementById("clearAllStudy").click();
      } else {
        searchresult.deletingFilter(this);
      }
    }
  });
}

// Sub Navigation

const subNavigation = document.querySelector(".sub-nav");

if (subNavigation) {
  // Focus Utilities

  function subNavFocusFirstItem(container) {
    if (!container) return;

    const firstFocusable = container.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 0);
    }
  }

  // Close Helpers

  function subNavCloseDropdownContent(contentEl) {
    if (!contentEl || !contentEl.id) return;

    contentEl.classList.remove("is-active");
    contentEl.inert = true;

    const btn = document.querySelector(`.sub-nav__dropdown-btn[aria-controls="${contentEl.id}"]`);

    if (btn) {
      btn.classList.remove("sub-nav__dropdown-btn--active");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function subNavClose() {
    document.querySelectorAll(".sub-nav__lvl1-content, .sub-nav__lvl2-content, .sub-nav__lvl3-content").forEach(subNavCloseDropdownContent);

    subNavigation.classList.remove("two-column", "three-column", "four-column", "no-desc");
  }

  // Keyboard Handling (Esc)

  function subNavHandleEscKey(e) {
    if (e.key !== "Escape" && e.key !== "Esc") return;

    const activeEl = document.activeElement;

    if (!subNavigation.contains(activeEl)) return;

    const currentContent = activeEl.closest(".sub-nav__lvl1-content, .sub-nav__lvl2-content, .sub-nav__lvl3-content");

    if (!currentContent) return;

    const btn = document.querySelector(`.sub-nav__dropdown-btn[aria-controls="${currentContent.id}"]`);

    subNavCloseDropdownContent(currentContent);

    if (btn) btn.focus();
  }

  subNavigation.addEventListener("keydown", subNavHandleEscKey);

  document.addEventListener("focusin", (e) => {
    if (!subNavigation.contains(e.target)) {
      subNavClose();
    }
  });

  // Active Page Detection

  let savedActiveLink = null;

  function subNavDetectActivePage() {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = "";
    currentUrl.search = "";

    const normalizedCurrent = currentUrl.href.replace(/\/$/, "");

    document.querySelectorAll(".sub-nav__link").forEach((link) => {
      const rawHref = link.getAttribute("href");

      if (!rawHref || rawHref === "#" || rawHref.startsWith("javascript:")) return;

      let linkUrl;

      try {
        linkUrl = new URL(link.href);
      } catch {
        return;
      }

      linkUrl.hash = "";
      linkUrl.search = "";

      const normalizedLink = linkUrl.href.replace(/\/$/, "");

      if (normalizedLink === normalizedCurrent) {
        link.setAttribute("aria-current", "page");
        link.classList.add("sub-nav__link--active");
        savedActiveLink = link;
      }
    });
  }

  subNavDetectActivePage();

  // Dropdown Chain Logic - open dropdowns with current page

  function subNavOpenDropdownChain(link) {
    let current = link.closest(".sub-nav__item");

    while (current) {
      const parentContent = current.closest(".sub-nav__lvl1-content, .sub-nav__lvl2-content, .sub-nav__lvl3-content");

      if (!parentContent) break;

      const parentBtn = document.querySelector(`.sub-nav__dropdown-btn[aria-controls="${parentContent.id}"]`);

      if (!parentBtn) break;

      const islvl1 = parentBtn.classList.contains("sub-nav__lvl1-dropdown");
      const isDesktop = window.innerWidth >= 768;

      if (islvl1 && isDesktop) {
        parentBtn.classList.add("sub-nav__dropdown-btn--chain");
        break;
      }

      parentContent.classList.add("is-active");
      parentContent.inert = false;
      parentBtn.classList.add("sub-nav__dropdown-btn--active");
      parentBtn.setAttribute("aria-expanded", "true");

      if (parentBtn.classList.contains("sub-nav__lvl2-dropdown")) {
        subNavigation.classList.add("three-column");
      }

      if (parentBtn.classList.contains("sub-nav__lvl3-dropdown")) {
        subNavigation.classList.add("four-column");
      }

      current = parentBtn.closest(".sub-nav__item");
    }
  }

  if (savedActiveLink) {
    subNavOpenDropdownChain(savedActiveLink);
  }

  // Click Handling

  document.addEventListener("click", (e) => {
    const isInsideSubNav = subNavigation.contains(e.target);

    if (!isInsideSubNav) {
      subNavClose();
      return;
    }

    const button = e.target.closest(".sub-nav__dropdown-btn");
    if (!button) return;

    // ---------------- Level 1 ----------------

    if (button.classList.contains("sub-nav__lvl1-dropdown")) {
      const item = button.closest(".sub-nav__item--lvl1");
      const content = item.querySelector(".sub-nav__lvl1-content");

      const container = content.querySelector(".sub-nav__lvl1-container");
      const description = container.querySelector(".sub-nav__lvl1-description");

      const isOpen = content.classList.contains("is-active");

      document.querySelectorAll(".sub-nav__lvl1-content, .sub-nav__lvl2-content, .sub-nav__lvl3-content").forEach(subNavCloseDropdownContent);

      subNavigation.classList.remove("two-column", "three-column", "four-column", "no-desc");

      if (!isOpen) {
        content.classList.add("is-active");
        content.inert = false;
        button.classList.add("sub-nav__dropdown-btn--active");
        button.setAttribute("aria-expanded", "true");

        subNavigation.classList.add("two-column");

        if (!description) {
          subNavigation.classList.add("no-desc");
        }

        if (savedActiveLink && item.contains(savedActiveLink)) {
          subNavOpenDropdownChain(savedActiveLink);
        }

        subNavFocusFirstItem(content);
      }
    }

    // ---------------- Level 2 ----------------

    if (button.classList.contains("sub-nav__lvl2-dropdown")) {
      const item = button.closest(".sub-nav__item--lvl2");
      const content = item.querySelector(".sub-nav__lvl2-content");

      const isOpen = content.classList.contains("is-active");

      document.querySelectorAll(".sub-nav__lvl2-content").forEach(subNavCloseDropdownContent);

      document.querySelectorAll(".sub-nav__lvl3-content").forEach(subNavCloseDropdownContent);

      subNavigation.classList.remove("two-column", "three-column", "four-column");
      subNavigation.classList.add("three-column");

      if (!isOpen) {
        content.classList.add("is-active");
        content.inert = false;
        button.classList.add("sub-nav__dropdown-btn--active");
        button.setAttribute("aria-expanded", "true");

        subNavFocusFirstItem(content);
      }
    }

    // ---------------- Level 3 ----------------

    if (button.classList.contains("sub-nav__lvl3-dropdown")) {
      const item = button.closest(".sub-nav__item--lvl3");
      const content = item.querySelector(".sub-nav__lvl3-content");

      const isOpen = content.classList.contains("is-active");

      document.querySelectorAll(".sub-nav__lvl3-content").forEach(subNavCloseDropdownContent);

      subNavigation.classList.remove("two-column", "three-column", "four-column");
      subNavigation.classList.add("four-column");

      if (!isOpen) {
        content.classList.add("is-active");
        content.inert = false;
        button.classList.add("sub-nav__dropdown-btn--active");
        button.setAttribute("aria-expanded", "true");

        subNavFocusFirstItem(content);
      }
    }
  });

  // Scroll Arrows

  const subNavScrollContainer = document.querySelector(".sub-nav__lvl1");
  const subNavLeftArrow = document.querySelector(".sub-nav__arrow-left");
  const subNavRightArrow = document.querySelector(".sub-nav__arrow-right");

  if (subNavScrollContainer && subNavLeftArrow && subNavRightArrow) {
    const SCROLL_AMOUNT = 200;

    function subNavUpdateArrows() {
      const { scrollLeft, scrollWidth, clientWidth } = subNavScrollContainer;

      if (scrollWidth <= clientWidth) {
        subNavLeftArrow.style.display = "none";
        subNavRightArrow.style.display = "none";
        return;
      }

      subNavLeftArrow.style.display = scrollLeft > 5 ? "flex" : "none";

      const atRightEdge = scrollLeft + clientWidth >= scrollWidth - 5;

      subNavRightArrow.style.display = atRightEdge ? "none" : "flex";
    }

    subNavRightArrow.addEventListener("click", () =>
      subNavScrollContainer.scrollBy({
        left: SCROLL_AMOUNT,
        behavior: "smooth",
      }),
    );

    subNavLeftArrow.addEventListener("click", () =>
      subNavScrollContainer.scrollBy({
        left: -SCROLL_AMOUNT,
        behavior: "smooth",
      }),
    );

    subNavScrollContainer.addEventListener("scroll", subNavUpdateArrows);
    window.addEventListener("resize", subNavUpdateArrows);

    subNavUpdateArrows();
  }

  // Mobile Layout

  const subNavMobileQuery = window.matchMedia("(max-width: 767px)");

  function subNavUpdateMobile(e) {
    const isMobile = e.matches;

    const items = document.querySelectorAll(".sub-nav__item--lvl1, .sub-nav__item--lvl2, .sub-nav__item--lvl3, .sub-nav__item--lvl4");

    const levels = document.querySelectorAll(".sub-nav__lvl1, .sub-nav__lvl2, .sub-nav__lvl3, .sub-nav__lvl4");

    const lvl1 = document.querySelector(".sub-nav__lvl1");

    if (isMobile) {
      lvl1.setAttribute("aria-hidden", "true");
      lvl1.style.display = "none";
    } else {
      lvl1.setAttribute("aria-hidden", "false");
      lvl1.style.display = "flex";
    }

    items.forEach((item) => item.classList.toggle("dropdown-list__item", isMobile));

    levels.forEach((level) => level.classList.toggle("dropdown-list", isMobile));

    if (savedActiveLink) {
      subNavClose();
      subNavOpenDropdownChain(savedActiveLink);
    }
  }

  subNavUpdateMobile(subNavMobileQuery);
  subNavMobileQuery.addEventListener("change", subNavUpdateMobile);

  // Mobile Expand Button Text

  function subNavupdateExpandBtnText() {
    const expandBtn = document.querySelector(".sub-nav__expand-btn");
    const activeLink = document.querySelector(".sub-nav__link[aria-current='page']");

    if (!expandBtn) return;

    expandBtn.textContent = activeLink ? activeLink.textContent : "Home";
  }

  document.addEventListener("DOMContentLoaded", subNavupdateExpandBtnText);
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("share-button")) {
    displayShareModal(e.target);
  }
});

function displayShareModal(button) {
  closeExistingModal();

  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");

  const shareURL = button.getAttribute("data-share-link");
  const shareTitle = button.getAttribute("data-share-title");
  var shareThumbnail = button.getAttribute("data-share-img");

  // Set default image if shareThumbnail is null, empty, or undefined
  if (!shareThumbnail) {
    shareThumbnail = "/etc.clientlibs/uon/clientlibs/clientlib-v2/resources/images/uon-holding-course-image.jpg";
  }

  const modal = document.createElement("div");
  modal.id = "share-modal";
  modal.classList.add("share-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "share_modal_heading");

  modal.innerHTML = `
      <div class="share-modal__dialog">
        <div class="share-modal__content">
          <div class="share-modal__header">
            <button 
              id="close-share-modal"
              class="button button--secondary button--outline button--small button--icon--secondary--outline button--icon--single--small share-modal__close-btn"
              aria-label="Close share options"
            ></button>
            <h2 class="share-modal__title heading-medium" id="share_modal_heading">Share</h2>
          </div>
          <div class="share-modal__body">
            <div class="share-modal__preview">
              <img loading="lazy" src="${shareThumbnail}" alt="${shareTitle}">
              <div class="share-modal__preview-title">
                <p>${shareTitle}</p>
              </div>
            </div>
            <div class="share-modal__options" id="share-options">
              <div class="socials" id="whatsapp">
                <button 
                  id="whatsapp-button" 
                  class="button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--before--medium button--icon--after--medium share-modal__whatsapp-btn"
                  onclick="shareOnWhatsApp('${shareTitle}', '${shareURL}')">
                  WhatsApp
                </button>
              </div>
              <div class="socials" id="facebook">
                <button 
                  class="button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--before--medium button--icon--after--medium share-modal__facebook-btn"
                  onclick="shareOnFacebook('${shareURL}')">
                  Facebook
                </button>
              </div>
              <div class="socials" id="twitter">
                <button 
                  class="button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--before--medium button--icon--after--medium share-modal__twitter-btn"
                  onclick="shareOnTwitter('${shareTitle}', '${shareURL}')">
                  X (Twitter)
                </button>
              </div>
              <div class="socials" id="messenger">
                <button 
                  id="messenger-button" 
                  class="button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--before--medium button--icon--after--medium share-modal__messenger-btn"
                  onclick="shareOnMessenger('${shareURL}')">
                  Messenger
                </button>
              </div>
              <div class="socials" id="email">
                <button 
                  class="button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--before--medium button--icon--after--medium share-modal__email-btn"
                  onclick="shareOnEmail('${shareTitle}', '${shareURL}')">
                  Email
                </button>
              </div>
              <div class="socials" id="copy-link">
                <button 
                  id="copy-link-button" 
                  class="button button--secondary button--outline button--medium button--icon--secondary--outline button--icon--before--medium button--icon--after--medium share-modal__copy-btn"
                  onclick="copyLink('${shareURL}')">
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  document.body.appendChild(modal);

  // Delay the addition of the 'share-modal--visible' class to trigger CSS transition
  setTimeout(() => {
    modal.classList.add("share-modal--visible");
  }, 10);

  const closeModalButton = document.getElementById("close-share-modal");
  const focusableElements = modal.querySelectorAll("button, a");

  // Store the last focused element before opening modal
  let lastFocusedElement = document.activeElement;

  // Function to trap focus inside modal
  function trapFocus(event) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  function maintainFocus(e) {
    if (!modal.contains(e.target)) {
      e.stopPropagation();
      focusableElements[0].focus();
    }
  }

  // Function to close modal and restore focus
  function closeModal() {
    modal.classList.remove("share-modal--visible");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");

    setTimeout(() => {
      modal.remove();
      document.removeEventListener("keydown", trapFocus);
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("focusin", maintainFocus);
      lastFocusedElement.focus(); // Restore focus
    }, 300);
  }

  // Handle Escape key to close modal
  function handleEscapeKey(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  // Event listeners
  closeModalButton.addEventListener("click", closeModal);

  // Close modal if clicking outside of the dialog
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", trapFocus);
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("focusin", maintainFocus);

  // Auto-focus modal on open
  focusableElements[0].focus();
}

// Share on WhatsApp
function shareOnWhatsApp(title, url) {
  const shareURL = `https://wa.me/?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`;
  window.open(shareURL, "_blank");
}

// Share on Messenger
function shareOnMessenger(url) {
  const appId = isMobile() === "Android" ? "com.facebook.orca" : "725895788683306"; // Use app ID for Android or iOS
  const message = encodeURIComponent(url);
  const mobileLink = `fb-messenger://share?link=${message}&app_id=${appId}`;
  const browserLink = `https://www.facebook.com/dialog/send?app_id=${appId}&link=${message}&redirect_uri=${message}`;

  if (isMobile()) {
    window.open(mobileLink, "_blank");
  } else {
    window.open(browserLink, "_blank");
  }
}

// Share on Facebook
function shareOnFacebook(url) {
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookURL, "_blank");
}

// Share on Twitter (X)
function shareOnTwitter(title, url) {
  const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  window.open(twitterURL, "_blank");
}

// Copy link to clipboard
function copyLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    const copyLinkButton = document.getElementById("copy-link-button");
    copyLinkButton.textContent = "Copied!";
    // copyLinkButton.disabled = true;
    copyLinkButton.classList.add("share-modal__copy-btn--copied");
  });
}

// Share on Email
function shareOnEmail(title, url) {
  const mailtoLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
  window.open(mailtoLink, "_self");
}

// Close opened modal
function closeExistingModal() {
  const existingModal = document.getElementById("share-modal");
  if (existingModal) {
    existingModal.remove();
  }
}

// Check is user is on mobile
function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check if the user is on an Android or iOS device
  if (/android/i.test(userAgent)) {
    return "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "iOS";
  }
  return false; // Desktop
}

document.querySelectorAll(".carouselV2--stats").forEach((stats) => {
  const swiperEl = stats.querySelector(".mySwiper");
  const slidesCount = swiperEl.querySelectorAll(".swiper-slide").length;

  const nextBtn = stats.querySelector(".carouselV2__arrows--desktop .swiper-button-next");
  const prevBtn = stats.querySelector(".carouselV2__arrows--desktop .swiper-button-prev");

  const nextBtnMobile = stats.querySelector(".carouselV2__arrows--mobile .swiper-button-next");
  const prevBtnMobile = stats.querySelector(".carouselV2__arrows--mobile .swiper-button-prev");

  const progressBar = stats.querySelector(".swiper-pagination");

  const swiperStats = new Swiper(swiperEl, {
    spaceBetween: 16,
    cssWidthAndHeight: true,
    freeMode: false,
    loop: false,
    watchSlidesProgress: true,

    pagination: {
      el: [progressBar],
      type: "progressbar",
    },
    navigation: {
      nextEl: [nextBtn, nextBtnMobile],
      prevEl: [prevBtn, prevBtnMobile],
    },
    breakpoints: {
      1280: {
        slidesPerView: Math.min(4, slidesCount),
      },
      1024: {
        slidesPerView: Math.min(3, slidesCount),
      },
      768: {
        slidesPerView: Math.min(2, slidesCount),
      },

      0: {
        slidesPerView: 1,
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Open panel on tab click
  document.querySelectorAll(".tabs").forEach((tabsContainer) => {
    // Tolerant selectors: handle presence/absence of scroll wrapper
    const tabList = tabsContainer.querySelector(":scope > .tabs__scroll-wrapper > .tabs__list") || tabsContainer.querySelector(":scope .tabs__list");

    if (!tabList) return;

    const tabs = tabList.querySelectorAll('li > [role="tab"]');
    if (!tabs.length) return;

    const panelsRoot = tabsContainer.querySelector(":scope > .tabs__panels") || tabsContainer.querySelector(":scope .tabs__panels");

    if (!panelsRoot) return;

    const panels = panelsRoot.querySelectorAll(':scope > [role="tabpanel"]');

    // Respect server-rendered selection (e.g., first year has aria-selected="true")
    const preselected = tabList.querySelector('[role="tab"][aria-selected="true"]');

    if (preselected) {
      // Do not call activateTab (which would reset everything).
      // Just ensure the linked panel is visible.
      const pid = preselected.getAttribute("aria-controls");
      const prePanel = pid ? document.getElementById(pid) : null;
      if (prePanel) {
        prePanel.hidden = false; // ensure visible
      }
    } else {
      // Fallback: previous behavior (auto-activate active or first tab)
      const activeTab = tabsContainer.querySelector('[role="tab"].tab--active') || tabs[0];
      if (activeTab) activateTab(activeTab, tabs, panels);
    }

    // Click & keyboard interactions
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateTab(tab, tabs, panels);
      });

      tab.addEventListener("keydown", (e) => {
        const key = e.key;
        const currentIndex = Array.prototype.indexOf.call(tabs, document.activeElement);
        let newIndex = null;

        if (key === "ArrowRight") newIndex = (currentIndex + 1) % tabs.length;
        else if (key === "ArrowLeft") newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else if (key === "Home") newIndex = 0;
        else if (key === "End") newIndex = tabs.length - 1;

        if (newIndex !== null) {
          const newTab = tabs[newIndex];
          newTab.focus();

          // scroll-to-center
          const list = newTab.closest(".tabs__list");
          if (list) {
            const listRect = list.getBoundingClientRect();
            const tabRect = newTab.getBoundingClientRect();

            const listScrollLeft = list.scrollLeft;
            const offset = tabRect.left - listRect.left; // tab's x position inside list
            const targetScrollLeft = listScrollLeft + offset - list.clientWidth / 2 + tabRect.width / 2;

            // Clamp so it never overscrolls
            const maxScrollLeft = list.scrollWidth - list.clientWidth;
            list.scrollTo({
              left: Math.max(0, Math.min(maxScrollLeft, targetScrollLeft)),
              behavior: "smooth",
            });
          }

          e.preventDefault();
        }
      });
    });
  });

  // Function to activate panel on tab click
  function activateTab(tab, tabs, panels) {
    tabs.forEach((t) => {
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
      t.classList.remove("tab--active");
    });

    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    tab.classList.add("tab--active");

    panels.forEach((panel) => {
      panel.hidden = true;
    });

    const panelId = tab.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.hidden = false;
    }
  }

  // Tab list scroll and desktop mobile display

  document.querySelectorAll(".tabs__scroll-wrapper").forEach((wrapper) => {
    const list = wrapper.querySelector(".tabs__list");
    const leftBtn = wrapper.querySelectorAll(".tabs__scroll-button--left");
    const rightBtn = wrapper.querySelectorAll(".tabs__scroll-button--right");
    const leftBtnDesktop = wrapper.querySelector(".tabScrollLeftDesktop");
    const rightBtnDesktop = wrapper.querySelector(".tabScrollRightDesktop");
    const overlayDesktop = wrapper.querySelector(".tabs__scroll-buttons");
    const overlayLeft = wrapper.querySelector(".tabs__scroll-overlay-left");
    const overlayRight = wrapper.querySelector(".tabs__scroll-overlay-right");
    const tabs = list ? list.querySelectorAll(".tabs__tab") : [];

    function getScrollAmount() {
      return window.matchMedia("(max-width: 640px)").matches ? 60 : 120;
    }

    function updateScrollUI() {
      if (!list) return;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const hasEnoughTabs = tabs.length > 2;
      const isOverflowing = list.scrollWidth > list.clientWidth;
      const scrollActive = hasEnoughTabs && isOverflowing;

      wrapper.classList.toggle("tabs__scroll-wrapper--active", scrollActive);

      // Desktop
      if (!isMobile) {
        if (overlayDesktop) {
          overlayDesktop.style.display = scrollActive ? "inline-flex" : "none";
        }
        if (scrollActive) updateArrowButtonsState();
        if (overlayLeft) overlayLeft.style.display = "none";
        if (overlayRight) overlayRight.style.display = "none";
      }

      // Mobile
      if (isMobile) {
        if (overlayDesktop) {
          overlayDesktop.style.display = "none";
        }

        if (scrollActive) {
          updateMobileOverlayState();
        } else {
          if (overlayLeft) overlayLeft.style.display = "none";
          if (overlayRight) overlayRight.style.display = "none";
        }
      }
    }

    function updateWordWrapClasses() {
      if (!list) return;
      const tabCount = tabs.length;
      list.classList.toggle("tabs__list--word-no-wrap", tabCount > 2);
      list.classList.toggle("tabs__list--word-wrap", tabCount <= 2);
      list.classList.toggle("tabs__list--column", tabCount <= 2);
    }

    function updateArrowButtonsState() {
      if (!list) return;
      const maxScrollLeft = list.scrollWidth - list.clientWidth;
      const atStart = list.scrollLeft <= 0;
      const atEnd = list.scrollLeft >= maxScrollLeft - 1;

      if (leftBtnDesktop) {
        leftBtnDesktop.disabled = atStart;
        leftBtnDesktop.classList.toggle("button--disabled", atStart);
        leftBtnDesktop.style.display = atStart && atEnd ? "none" : "inline-block";
      }

      if (rightBtnDesktop) {
        rightBtnDesktop.disabled = atEnd;
        rightBtnDesktop.classList.toggle("button--disabled", atEnd);
        rightBtnDesktop.style.display = atStart && atEnd ? "none" : "inline-block";
      }
    }

    function updateMobileOverlayState() {
      if (!list) return;

      const tabsContainer = wrapper.closest(".tabs");
      const isPrimary = tabsContainer?.classList.contains("tabs--primary");
      if (!isPrimary) {
        // Ensure shadows are hidden for secondary tabs
        overlayLeft.style.display = "none";
        overlayRight.style.display = "none";
        return;
      }

      const maxScrollLeft = list.scrollWidth - list.clientWidth;
      const atStart = list.scrollLeft <= 1;
      const atEnd = list.scrollLeft >= maxScrollLeft - 1;

      if (overlayLeft) overlayLeft.style.display = !atStart ? "flex" : "none";
      if (overlayRight) overlayRight.style.display = !atEnd ? "flex" : "none";
    }
    leftBtn.forEach((btn) => {
      btn?.addEventListener("click", () => {
        list?.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth",
        });
      });
    });

    rightBtn.forEach((btn) => {
      btn?.addEventListener("click", () => {
        list?.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth",
        });
      });
    });
    list?.addEventListener("scroll", () => {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      if (isMobile) {
        updateMobileOverlayState();
      } else {
        updateArrowButtonsState();
      }
    });

    updateWordWrapClasses();
    updateScrollUI(); // initial run
    window.addEventListener("resize", updateScrollUI);
  });

  // Enhance secondary tabs on mobile with dropdown classes and attributes
  function enhanceSecondaryTabsForMobile() {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    document.querySelectorAll(".tabs.tabs--secondary").forEach((tabsContainer) => {
      const dropdownBtn = tabsContainer.querySelector(".tabs__list-dropdown");
      const dropdownList = tabsContainer.querySelector(".tabs__list");

      if (!dropdownBtn || !dropdownList) return;

      if (isMobile) {
        // ADD mobile-specific classes and attributes
        dropdownList.classList.add("dropdown-list");
        dropdownList.setAttribute("aria-hidden", "false");
        dropdownList.style.display = "none";

        const dropdownId = dropdownBtn.getAttribute("aria-controls");
        if (dropdownId) {
          dropdownList.setAttribute("id", dropdownId);
        }

        dropdownList.querySelectorAll("li").forEach((li) => {
          li.classList.add("dropdown-list__item");
          const button = li.querySelector("button");
          if (button) {
            button.classList.add("dropdown-option", "dropdown-option--button");
            // REMOVE classes from dropdownBtn on mobile
            button.classList.remove("tab", "tab--primary", "tab--small");
          }
        });
      } else {
        // REMOVE mobile-specific classes and attributes
        dropdownList.classList.remove("dropdown-list");
        dropdownList.style.display = "flex";
        dropdownList.removeAttribute("aria-hidden");
        dropdownList.removeAttribute("id");

        dropdownList.querySelectorAll("li").forEach((li) => {
          li.classList.remove("dropdown-list__item");
          const button = li.querySelector("button");
          if (button) {
            button.classList.remove("dropdown-option", "dropdown-option--button");
            // RESTORE classes to dropdownBtn on desktop
            button.classList.add("tab", "tab--primary", "tab--small");
          }
        });
      }
    });
  }

  window.addEventListener("load", enhanceSecondaryTabsForMobile);
  window.addEventListener("resize", enhanceSecondaryTabsForMobile);

  // Track active tab for secondary tabs and update dropdown text
  document.querySelectorAll(".tabs.tabs--secondary").forEach((tabsContainer) => {
    const dropdownBtn = tabsContainer.querySelector(".tabs__list-dropdown");
    const tabList = tabsContainer.querySelector(".tabs__list");
    const tabs = tabList ? tabList.querySelectorAll('li > [role="tab"]') : [];

    if (!dropdownBtn || !tabList) return;

    // Initial setting: use whichever is marked selected
    const initiallyActive = tabList.querySelector('[aria-selected="true"]');
    if (initiallyActive) {
      dropdownBtn.textContent = initiallyActive.textContent.trim();
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Update dropdown text on tab click
        dropdownBtn.textContent = tab.textContent.trim();
        const isMobile = window.matchMedia("(max-width: 640px)").matches;
        if (isMobile) {
          closeActiveTabDropdown(dropdownBtn, tabList);
        }
      });
    });
  });

  function closeActiveTabDropdown(btn, content) {
    btn.classList.remove("dropdown-btn--active");
    btn.setAttribute("aria-expanded", "false");
    content.style.display = "none";
    content.setAttribute("aria-hidden", "true");
  }
});

document.addEventListener("click", (e) => {
  // Toggle tooltip
  if (e.target.closest(".tag__tooltip-trigger")) {
    const container = e.target.closest(".tag__tooltip-container");
    const trigger = container.querySelector(".tag__tooltip-trigger");
    const isOpen = container.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", isOpen);
    e.stopPropagation();
  }

  // Close button
  if (e.target.closest(".tag__tooltip-close-btn")) {
    const container = e.target.closest(".tag__tooltip-container");
    const trigger = container.querySelector(".tag__tooltip-trigger");
    container.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    e.stopPropagation();
  }

  // Click outside
  document.querySelectorAll(".tag__tooltip-container.is-open").forEach((container) => {
    if (!container.contains(e.target)) {
      const trigger = container.querySelector(".tag__tooltip-trigger");
      container.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".tag__tooltip-container.is-open").forEach((container) => {
      const trigger = container.querySelector(".tag__tooltip-trigger");
      container.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const carousels = document.querySelectorAll(".dynamic-tile-block--course-carousel, .dynamic-tile-block--course-block");

  if (!carousels.length) return;

  try {
    const response = await fetch("/bin/uon/coursepages.json");
    if (!response.ok) throw new Error(`Failed to fetch JSON: ${response.status}`);
    const data = await response.json();
    const allCourses = Object.values(data).flat();

    carousels.forEach((carousel) => {
      const tagString = carousel.dataset.tag;
      const maxItems = carousel.dataset.max;
      const currentCourse = carousel.dataset.current;

      if (!tagString) return;

      // convert pipe-separated string into trimmed tag array
      const selectedTags = tagString
        .split("|")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const isRelatedCarousel = carousel.classList.contains("carousel--related-courses");

      // Converts "Sep 2025" to "2025-09-01"
      function dateToISO(dateStr) {
        const [monthStr, yearStr] = dateStr.split(" ");
        const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth() + 1;
        const monthPadded = String(month).padStart(2, "0");
        return `${yearStr}-${monthPadded}-01`;
      }

      // Combined filter and sort logic
      function filterCoursesByTags(allCourses, selectedTags, currentCourse) {
        return (
          allCourses
            // Filter by tags, title, startDate, hideinsitemap, and exclude currentCourse
            .filter((course) => {
              const hasValidTags = Array.isArray(course.tags) && selectedTags.some((selTag) => course.tags.some((ct) => ct.toLowerCase().includes(selTag)));

              const hasTitleAndDate = course.title && course.startDate;
              const isVisible = course.hideinsitemap !== true;

              // Exclude courses where courseId includes currentCourse (current course for related courses only)
              const isNotCurrent = !course.courseId || !course.courseId.includes(currentCourse);

              return hasValidTags && hasTitleAndDate && isVisible && isNotCurrent;
            })
            // Sort by start date (descending), then by title (A–Z)
            .sort((a, b) => {
              const dateA = new Date(dateToISO(a.startDate)).getTime();
              const dateB = new Date(dateToISO(b.startDate)).getTime();

              if (dateB !== dateA) {
                return dateB - dateA;
              }
              return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
            })
        );
      }

      let filteredCourses = filterCoursesByTags(allCourses, selectedTags, currentCourse);

      // ---toggle 'carousel--hide' based on filteredCourses for related courses ---
      if (isRelatedCarousel) {

        let relatedCourses = document.querySelectorAll(".carousel--related-courses");
        let startMeta = document.querySelector('meta[name="startDate"]');
        let currentCourseStartDate = startMeta ? startMeta.getAttribute("content").replace(/\D/g, "") : "";

        if (relatedCourses && currentCourseStartDate && filteredCourses.length > 0) {
            filteredCourses = filteredCourses.filter(course => {
            const courseStartDate = course.startDate ? course.startDate.replace(/\D/g, "") : "";
            return courseStartDate === currentCourseStartDate;
            });
        }

        if (carousel.classList.contains("carousel--hide")) {
          if (filteredCourses.length > 0) {
            carousel.classList.remove("carousel--hide");
          }
          // if filteredCourses.length === 0, keep it hidden
        } else {
          if (filteredCourses.length === 0) {
            carousel.classList.add("carousel--hide");
          }
        }
      }

      // --- Render logic  ---
      if (carousel.classList.contains("dynamic-tile-block--course-carousel")) {
        const wrapper = carousel.querySelector(".swiper-wrapper");
        if (!wrapper) return;
        filteredCourses.slice(0, maxItems).forEach((course) => {
          const slide = document.createElement("div");
          slide.classList.add("swiper-slide");
          slide.innerHTML = renderCourseCard(course);
          wrapper.appendChild(slide);
        });
      } else if (carousel.classList.contains("dynamic-tile-block--course-block")) {
        const wrapper = carousel.querySelector(".tile-block__tile-container-wrapper");
        if (!wrapper) return;
        filteredCourses.slice(0, maxItems).forEach((course) => {
          const tile = document.createElement("div");
          tile.classList.add("tile-block__tile");
          tile.innerHTML = renderCourseCard(course);
          wrapper.appendChild(tile);
        });
      }
    });

    // Initialize Load More JS AFTER tiles are rendered ---
    initTileBlockLoadMore();
  } catch (err) {
    console.error("Error loading courses:", err);
  }
});

// Function to run the Load More functionality
function initTileBlockLoadMore() {
  document.querySelectorAll(".tile-block--loadMore").forEach((tileBlock) => {
    const tileWrapper = tileBlock.querySelector(".tile-block__tile-container-wrapper");
    const tiles = Array.from(tileWrapper.children);
    const loadMoreBtn = tileBlock.querySelector(".tile-block__loadMore-btn");

    const initialCount = parseInt(tileBlock.dataset.initial, 10) || 2;
    const increment = parseInt(tileBlock.dataset.increment, 10) || 2;

    let visibleCount = initialCount;

    function updateTiles() {
      tiles.forEach((tile, i) => {
        const link = tile.querySelector("a");

        if (!link) return; // skip tiles without links

        if (i < visibleCount) {
          tile.classList.add("active");
          link.setAttribute("tabindex", "0"); // make tabbable
        } else {
          tile.classList.remove("active");
          link.setAttribute("tabindex", "-1"); // remove from tab order
        }
      });

      loadMoreBtn.style.display = visibleCount >= tiles.length ? "none" : "block";
    }

    // Hide all initially
    tiles.forEach((tile) => tile.classList.remove("active"));

    updateTiles();

    loadMoreBtn.addEventListener("click", () => {
      const prevVisible = visibleCount;
      visibleCount = Math.min(visibleCount + increment, tiles.length);

      updateTiles();

      // Focus & scroll first <a> within newly revealed tile to center
      const firstNewTile = tiles[prevVisible];
      if (firstNewTile) {
        const link = firstNewTile.querySelector("a");
        if (link) {
          link.focus();
          link.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  });
}

// Any other variations
initTileBlockLoadMore();

function initVideoComponents() {
  const videoWrappers = document.querySelectorAll(".video");
  if (!videoWrappers.length) return;

  videoWrappers.forEach((videoWrapper) => {
    const playBtn = videoWrapper.querySelector(".video__play-btn");
    const stopBtn = videoWrapper.querySelector(".video__stop-btn");
    const dialogId = playBtn ? playBtn.dataset.dialogId : undefined;
    const dialog = document.getElementById(dialogId);
    const video = dialog ? dialog.querySelector("video") : null;

    if (!playBtn || !stopBtn || !dialog || !video) return;

    let savedTime = 0;

    // Update aria-expanded on play button
    playBtn.setAttribute("aria-expanded", "false");

    playBtn.addEventListener("click", () => {
      dialog.classList.add("video-modal--open");
      document.documentElement.classList.add("no-scroll");
      document.body.classList.add("no-scroll");
      dialog.showModal();
      playBtn.setAttribute("aria-expanded", "true");

      video.currentTime = savedTime;
      video.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });

      stopBtn.focus();
    });

    stopBtn.addEventListener("click", () => {
      savedTime = video.currentTime;
      video.pause();
      dialog.close();
      dialog.classList.remove("video-modal--open");
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
      playBtn.setAttribute("aria-expanded", "false");
      playBtn.focus();
    });

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault(); // prevents the dialog from auto-closing
      stopBtn.click(); // trigger the same behavior as clicking stop
    });

    dialog.addEventListener("close", () => {
      // Just in case dialog is closed by any means
      savedTime = video.currentTime;
      video.pause();
      playBtn.setAttribute("aria-expanded", "false");
      playBtn.focus();
    });

    // close video dialog if you click outside of video player
    dialog.addEventListener("click", (event) => {
      const container = dialog.querySelector(".video-modal__container");

      if (!container.contains(event.target)) {
        savedTime = video.currentTime;
        video.pause();
        dialog.close();
        dialog.classList.remove("video-modal--open");
        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
        playBtn.setAttribute("aria-expanded", "false");
        playBtn.focus();
      }
    });

    // Responsive button size update
    function updatePlayButtonClassForMobile() {
      const isMobile = window.innerWidth <= 768;

      // Only update buttons that are originally xlarge (i.e., not the small one with description)
      if (!playBtn.classList.contains("video__play-btn--large")) return;

      if (isMobile) {
        playBtn.classList.remove("button--icon--single--xlarge--play", "button--xlarge");
        playBtn.classList.add("button--icon--single--large--play", "button--large");
      } else {
        playBtn.classList.remove("button--icon--single--large--play", "button--large");
        playBtn.classList.add("button--icon--single--xlarge--play", "button--xlarge");
      }
    }

    updatePlayButtonClassForMobile();

    window.addEventListener("resize", updatePlayButtonClassForMobile);
  });
}

initVideoComponents();

const toggles = document.querySelectorAll(".homeInternationalToggle");
const homeDetails = document.querySelectorAll(".home-student-detail");
const internationalDetails = document.querySelectorAll(".international-student-detail");
const homeInternationalTabs = document.getElementById("homeInternationalTabs");

// Anchors to update
const feesAnchor = document.querySelector('a[href^="#fees-home"]');
const durationAnchor = document.querySelector('a[href^="#duration-home"]');
const entryReqAnchor = document.querySelector('a[href^="#entryRequirements-home"]');

if (toggles.length && homeDetails.length && internationalDetails.length && homeInternationalTabs) {
  // Grab tabs and panels
  const homeTab = document.getElementById("homeInternationalTabs-tab-0");
  const intlTab = document.getElementById("homeInternationalTabs-tab-1");
  const homePanel = document.getElementById("homeInternationalTabs-panel-0");
  const intlPanel = document.getElementById("homeInternationalTabs-panel-1");

  // URL helpers
  function setStudentParam(value) {
    const url = new URL(window.location.href);
    url.searchParams.set("student", value);
    window.history.replaceState({}, "", url);
  }

  function getStudentParam() {
    return new URLSearchParams(window.location.search).get("student");
  }

  // Tab helpers
  function openHomeTab(tab, panel) {
    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    tab.classList.add("tab--active");
    panel.hidden = false;
  }

  function closeIntTab(tab, panel) {
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("tabindex", "-1");
    tab.classList.remove("tab--active");
    panel.hidden = true;
  }

  // UI updates
  function showHome(updateUrl = true) {
    homeDetails.forEach((el) => (el.style.display = "block"));
    internationalDetails.forEach((el) => (el.style.display = "none"));
    toggles.forEach((t) => (t.checked = false));
    updateAnchors(false);

    openHomeTab(homeTab, homePanel);
    closeIntTab(intlTab, intlPanel);

    if (updateUrl) setStudentParam("home");
  }

  function showInternational(updateUrl = true) {
    homeDetails.forEach((el) => (el.style.display = "none"));
    internationalDetails.forEach((el) => (el.style.display = "block"));
    toggles.forEach((t) => (t.checked = true));
    updateAnchors(true);

    openHomeTab(intlTab, intlPanel);
    closeIntTab(homeTab, homePanel);

    if (updateUrl) setStudentParam("international");
  }

  function updateDetails(trigger) {
    if (trigger.checked) {
      showInternational();
    } else {
      showHome();
    }
  }

  // Update multiple anchors at once
  function updateAnchors(isInternational) {
    if (feesAnchor) feesAnchor.setAttribute("href", isInternational ? "#fees-international" : "#fees-home");
    if (durationAnchor) durationAnchor.setAttribute("href", isInternational ? "#duration-international" : "#duration-home");
    if (entryReqAnchor) entryReqAnchor.setAttribute("href", isInternational ? "#entryRequirements-international" : "#entryRequirements-home");
  }

  // Initial load based on URL
  const studentType = getStudentParam();
  if (studentType === "international") {
    showInternational(false);
  } else {
    showHome(false);
  }

  // Event listeners
  toggles.forEach((toggle) => toggle.addEventListener("change", () => updateDetails(toggle)));
  homeTab.addEventListener("click", () => showHome());
  intlTab.addEventListener("click", () => showInternational());

  const tabs = [homeTab, intlTab];

  tabs.forEach((tab) => {
    tab.addEventListener("focus", () => {
      if (tab.getAttribute("aria-selected") === "true") return;

      if (tab === homeTab) showHome();
      else showInternational();
    });
  });
}

//console.log("V2: Adobe-Tracking");

/** Sign in tracking Start */
function updateSignInTrackingInitial(url) {
    console.log("V2: Sign in tracking start");
    window.adobeDataLayer.push({
        event: 'login initiate',
        user: {
            auth: {
                touchpoint: localStorage.getItem("signUpSuccessItem"),
            }
        },
        component: {
            componentName: 'Sign in header',
            componentType: ''
        },
        linkInfo: {
            linkRegion: 'Header',
            linkName: 'Sign in',
            linkUrl: url,
            linkType: 'internal',
            linkSubType: ''
        }
    });
}

//Sign up tracking Initial
function updateSignUpTrackingInitial(url) {
    console.log("V2: Sign up tracking start");
    window.adobeDataLayer.push({
        event: 'signup-click',
        user: {
            auth: {
                touchpoint: localStorage.getItem("signUpSuccessItem"),
            }
        },
        component: {
            componentName: 'Sign up header',
            componentType: ''
        },
        linkInfo: {
            linkRegion: 'Header',
            linkName: 'Sign up',
            linkUrl: url,
            linkType: 'internal',
            linkSubType: ''
        }
    });
}

//Generic Link click tracking
function genericLinkClickTracking(componentName, componentTitle, linkRegion, linkName, linkUrl, linkType, linkSubType) {
	window.adobeDataLayer.push({
		event: 'link click',
		component: {
			componentName: componentName,
			componentTitle: componentTitle
		},
		linkInfo: {
			linkRegion: linkRegion,
			linkName: linkName,
			linkUrl: linkUrl,
			linkType: linkType,
			linkSubType: linkSubType
		}
	});
}

//Social Link click tracking
function socialLinkClickTracking(socialNetwork, componentName, componentTitle, linkRegion, linkName, linkUrl, linkType, linkSubType) {
	window.adobeDataLayer.push({
		event: 'social link click',
		page: {
		    socialNetwork: socialNetwork
		},
		component: {
			componentName: componentName,
			componentTitle: componentTitle
		},
		linkInfo: {
			linkRegion: linkRegion,
			linkName: linkName,
			linkUrl: linkUrl,
			linkType: linkType,
			linkSubType: linkSubType
		}
	});
}

//Social Share Initiate
function updateSocialShareInitiateDatalayer(method, title, componentName, componentTitle, shareLink) {
	const currentPage = window.location.pathname;

	window.adobeDataLayer.push({
		event: 'content share initiate',
		content: {
			contentId: title,
			articleTitle: title,
			shareMethod: method
		},
		component: {
			componentName: componentName,
			componentType: '',
			componentTitle: componentTitle
		},
		linkInfo: {
			linkRegion: 'Body',
			linkName: title ? title : '',
			linkUrl: shareLink,
			linkType: 'Non-link click',
			linkSubType: 'Initiate social share button'
		}
	});
}

//Update bookmark initiate
function updateBookmarkDataLayer(title, componentName, componentTitle, bookmarkUrl, isSelected) {
    const currentPage = window.location.pathname;
    console.log('updateBookmarkDataLayer=', title, componentName, componentTitle, bookmarkUrl, isSelected);
    const isAdd = isSelected.includes("selected");
    const eventName = isAdd ? 'bookmark remove click' : 'bookmark add click';
    const linkSubType = isAdd ? 'remove' : 'add';

    window.adobeDataLayer.push({
        event: eventName,
        content: {
            contentId: title,
            articleTitle: title
        },
        component: {
            componentName: componentName,
            componentTitle: componentTitle
        },
        linkInfo: {
            linkRegion: 'Body',
            linkName: title ? title : '',
            linkUrl: bookmarkUrl,
            linkType: 'internal',
            linkSubType: linkSubType
        }
    });
}

function updateSocialShareDatalayer (method, title, currentPage) {
    window.adobeDataLayer.push({
        event: 'content share complete',
        content:{
            contentId: title ? title : '',
            articleTitle: title ? title : '',
            shareMethod: method
        },
        component: {
            componentName: 'Social Share',
            componentType: ''
        },
        linkInfo:{
            linkRegion: 'Body',
            linkName: method + ' share',
            linkUrl: currentPage,
            linkType: 'Non-link click',
            linkSubType: 'Social share modal button'
        }
    });
}

//Promocard Tracking
document.addEventListener("DOMContentLoaded", function () {
    const promoButtons = document.querySelectorAll('.promoCard-content-cta .button');

    promoButtons.forEach(button => {
        button.addEventListener('click', function () {
            const promoCard = button.closest('.promoCard-container');

            const promoTitleElement = promoCard ? promoCard.querySelector('.promoCard-content-text h2') : null;
            const promoTitle = promoTitleElement ? promoTitleElement.textContent.trim() : 'Unknown Title';

            const buttonText = button.querySelector('span') ? button.querySelector('span').textContent.trim() : 'Unknown Button';
            const buttonHref = button.getAttribute('href') || '#';

            genericLinkClickTracking('promoCard', promoTitle, 'Body', buttonText, buttonHref, 'internal', 'CTA');

            console.log(`V2: Promo Card Clicked: Title - "${promoTitle}", Button - "${buttonText}", Link - "${buttonHref}"`);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    //Accordion: Expand/Collapse
    const accordions = document.querySelectorAll('.cmp-accordion__button');
    if (accordions.length > 0) {
        accordions.forEach(button => {
            button.addEventListener('click', () => {
                const expanded = button.getAttribute('aria-expanded') === 'true';
                const expandedValue = expanded ? 'Accordion Expand' : 'Accordion Collapse';

                const accordionContainer = button.closest('.accordion');
                const accordionHeading = accordionContainer
                    ? accordionContainer.querySelector('.accordion-title')?.textContent.trim()
                    : button.textContent.trim();

                genericLinkClickTracking('accordion', accordionHeading, 'Body', button.textContent.trim(), '', 'Non-link click', expandedValue);
                console.log("Accordion clicked");
            });
        });
    }

    //Accordion: Internal Link Click
    const accordionInternalLinks = document.querySelectorAll('.accordion-component .cmp-accordion__panel .cmp-container a');
    if (accordionInternalLinks.length > 0) {
        accordionInternalLinks.forEach(link => {
            link.addEventListener('click', () => {
                const accordionContainer = link.closest('.accordion');
                const accordionHeading = accordionContainer
                    ? accordionContainer.querySelector('.accordion-title')?.textContent.trim()
                    : link.textContent.trim();
                const linkText = link.textContent.trim();
                const linkUrl = link.href;

                genericLinkClickTracking('accordion', accordionHeading, 'Body', linkText, linkUrl, 'internal', '');
                console.log("Accordion internal link clicked");
            });
        });
    }
});

window.addEventListener('load', function() {

    // Header: Logo
    const uonLogo = document.querySelectorAll('.navigation-link');
    if (uonLogo.length > 0) {
        uonLogo.forEach(link => {
            link.addEventListener('click', () => {
                genericLinkClickTracking('header', '', 'Header', 'University of Nottingham Logo', link.href, 'internal', '');
                console.log("UON Logo clicked");
            });
        });
    }

    // Header: Hamburger Menu(Open, Close, Nav Links)
    const hamburgerButton = document.getElementById('openNav');
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', () => {
            const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
            genericLinkClickTracking('header', '', 'Header', 'Hamburger Menu Open', '', 'Non-link click', 'Hamburger Menu Open');
            console.log("Hamburger menu open clicked");
        });
    }

    const navBarCloseMenu = document.getElementById('closeNav');
    if (navBarCloseMenu) {
        navBarCloseMenu.addEventListener('click', () => {
            genericLinkClickTracking('header', '', 'Header', 'Hamburger Menu Close', '', 'Non-link click', 'Hamburger Menu Close');
            console.log("Hamburger menu close clicked");
        });
    }

    const navItems = document.querySelectorAll('.navigation-bar__nav-item');
    if (navItems) {
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                const anchor = link.querySelector('a');
                if (anchor) {
                    genericLinkClickTracking('header', '', 'Header', anchor.innerText, anchor.href, 'internal', '');
                    console.log("Nav item clicked: " + anchor.innerText);
                }
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {

    // Footer: Accordion footer links
    const footerAccordionLinks = document.querySelectorAll('.footer__accordion-link a')
    if(footerAccordionLinks.length > 0) {
        footerAccordionLinks.forEach(link => {
            link.addEventListener('click', () => {
                const footerAccordionContainer = link.closest('.cmp-accordion');
                const footerAccordionHeading = footerAccordionContainer
                                    ? footerAccordionContainer.querySelector('.cmp-accordion__header')?.textContent.trim()
                                    : link.textContent.trim();
                const footerAccordionLinkText = link.textContent.trim();
                const footerAccordionLinkUrl = link.href || '#';

                genericLinkClickTracking('footer', footerAccordionHeading, 'footer', footerAccordionLinkText, footerAccordionLinkUrl, 'internal', '');
                console.log("Footer internal link clicked");
            });
        });
    }

    // Footer: Non-accordion footer links (privacy, terms, accessibility, etc.)
    const footerLinks = document.querySelectorAll('.footer_links-container a');
    if (footerLinks.length > 0) {
        footerLinks.forEach(link => {
            link.addEventListener('click', () => {
                const footerLinkText = link.textContent.trim();
                const footerLinkUrl = link.href || '#';

                genericLinkClickTracking('footer', 'Footer Links', 'footer', footerLinkText, footerLinkUrl, 'internal', '');
                console.log("Footer general link clicked:", footerLinkText, footerLinkUrl);
            });
        });
    }

    // Footer: Social links
    const footerSocialLinks = document.querySelectorAll('.footer__socials a');
    if (footerSocialLinks.length > 0) {
        footerSocialLinks.forEach(link => {
            link.addEventListener('click', () => {
                const socialNetwork = link.title.replace(' link', '').trim();
                const footerSocialLinkUrl = link.href || '#';

                socialLinkClickTracking(socialNetwork, 'footer', 'Footer Social Links', 'footer', socialNetwork, footerSocialLinkUrl, 'internal', '');
                console.log("Footer social link clicked:", socialNetwork, footerSocialLinkUrl);
            });
        });
    }
});

// Article and course grid: Share button
document.addEventListener('click', e => {
    const listingTilesShare = e.target.closest('.share-button');
    if(listingTilesShare) {
        const tile = listingTilesShare.closest('.cmp-tile');

        const titleElement = tile ? tile.querySelector('.cmp-tile__title') : null;
        const title = titleElement ? titleElement.textContent.trim() : 'Unknown Title';

        const componentTitleElement = document.querySelector('.listing h1');
        const componentTitle = componentTitleElement ? componentTitleElement.textContent.trim() : 'Unknown Component Title';

        const shareLink = listingTilesShare.getAttribute('data-share-link') || 'Unknown Link';

        updateSocialShareInitiateDatalayer("Article and Course Grid Tile", title, 'articleandcoursegrid', componentTitle, shareLink);

        console.log(`V2: Article and Course Grid: Title - "${title}", ComponentTitle - "${componentTitle}", shareLink - "${shareLink}"`);
    }
});

// Article and course grid: Bookmark button
document.addEventListener('click', e => {
    const listingTilesBookmark = e.target.closest('.cmp-button-bookmark');
    if(listingTilesBookmark) {
        const tile = listingTilesBookmark.closest('.cmp-tile');
        const titleElement = tile ? tile.querySelector('.cmp-tile__title') : null;
        const title = titleElement ? titleElement.textContent.trim() : 'Unknown Title';

        const bookmarkUrl = listingTilesBookmark.getAttribute('data-bookmark') || 'Unknown URL';

        const componentTitleElement = document.querySelector('.listing h1');
        const componentTitle = componentTitleElement ? componentTitleElement.textContent.trim() : 'Unknown Component Title';

        const isSelected = listingTilesBookmark.classList.contains('selected') ? 'Selected' : 'Not Selected';

        updateBookmarkDataLayer(title, 'articleandcoursegrid', componentTitle, bookmarkUrl , isSelected);

        console.log(`V2: Article and Course Grid: Title - "${title}", ComponentTitle - "${componentTitle}" , bookmarkUrl - "${bookmarkUrl}" , isSelected - "${isSelected}"`);
    }
});

document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.socials')) {
        const socialElem = target.closest('.socials');
        const socialId = socialElem.getAttribute('id');

        const heading = document.querySelector('.share-modal__preview-title p')?.innerText || '';

        let currentPage = '';
        const onclickAttr = target.getAttribute('onclick') || '';

        const matchArgs = onclickAttr.match(/'(.*?)'(?:,\s*'(.*?)')?/);
        if (matchArgs) {
            currentPage = matchArgs[2] || matchArgs[1];
        }

        updateSocialShareDatalayer(socialId, heading, currentPage);
        console.log(`V2: Social Share Modal: socialId - "${socialId}", heading - "${heading}" , currentPage - "${currentPage}"`);
    }
});




!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=39)}({39:function(e,t,r){}});