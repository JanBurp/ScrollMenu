"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ScrollMenu = /*#__PURE__*/function () {
  function ScrollMenu(el) {
    _classCallCheck(this, ScrollMenu);

    _defineProperty(this, "DOM", {});

    _defineProperty(this, "itemHeight", 0);

    _defineProperty(this, "scrollHeight", 0);

    _defineProperty(this, "clonesHeight", 0);

    _defineProperty(this, "activeItem", -1);

    _defineProperty(this, "scrollPos", 0);

    _defineProperty(this, "prevScrollPos", 0);

    _defineProperty(this, "timer", false);

    _defineProperty(this, "autoScroll", false);

    _defineProperty(this, "scrollSpeed", 0);

    this.DOM = {
      wrapper: el
    };
    this.DOM.el = this.DOM.wrapper.querySelector('ul');
    this.DOM.menuItems = _toConsumableArray(this.DOM.el.querySelectorAll('li'));
    this.DOM.currentItem = this.DOM.el.querySelector('.current-menu-item');
    this.prepareDOM();
    var self = this;
    window.addEventListener("load", function () {
      self.cloneItems();
      self.initScroll();
      self.initEvents();
      self.render();
      self.scrollToActiveItem(self, false); // console.log(self);
    });
  }

  _createClass(ScrollMenu, [{
    key: "prepareDOM",
    value: function prepareDOM() {
      // Unique ID as wrapper
      this.DOM.wrapper.id = 'scroll-menu-wrapper'; // transparent blocks on top and bottom

      var top = document.createElement("div");
      top.classList.add('top');
      this.DOM.wrapper.appendChild(top);
      var bottom = document.createElement("div");
      bottom.classList.add('bottom');
      this.DOM.wrapper.appendChild(bottom); // items a unique class

      this.DOM.menuItems.forEach(function (item, index) {
        return item.classList.add('item-' + (index + 1));
      }); // scroll block on top, so scrolling is possible

      var self = this;
      this.DOM.scrollContainer = document.createElement("div");
      this.DOM.scrollContainer.classList.add('scrollcontainer');
      this.DOM.scroller = document.createElement("div");
      this.DOM.scroller.classList.add('scroller');
      this.DOM.wrapper.appendChild(this.DOM.scrollContainer).appendChild(this.DOM.scroller);
    }
  }, {
    key: "cloneItems",
    value: function cloneItems() {
      var _this = this;

      this.itemHeight = this.DOM.menuItems[0].offsetHeight;
      var fitIn = Math.ceil(window.innerHeight / this.itemHeight); // Remove current clones

      this.DOM.el.querySelectorAll('._clone').forEach(function (clone) {
        return _this.DOM.el.removeChild(clone);
      }); // Add new clones

      var totalClones = 0;
      this.DOM.menuItems.filter(function (_, index) {
        return index < fitIn;
      }).map(function (target) {
        var clone = target.cloneNode(true);
        clone.classList.add('_clone');

        _this.DOM.el.appendChild(clone);

        totalClones++;
      }); // All clones height

      this.clonesHeight = totalClones * this.itemHeight; // Scrollable area height

      this.scrollHeight = this.clonesHeight * 2; //this.DOM.el.scrollHeight;

      this.DOM.scroller.style.height = this.scrollHeight;
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var self = this;
      this.timer = false;
      window.addEventListener('resize', function () {
        return self.resize();
      });
      this.DOM.scrollContainer.addEventListener('mousemove', function () {
        return self.setAutoScrollSpeed(event);
      });
      this.DOM.scrollContainer.addEventListener('mouseenter', function () {
        return self.startAutoScroll();
      });
      this.DOM.scrollContainer.addEventListener('mouseleave', function () {
        return self.stopAutoScroll();
      });
      this.DOM.scrollContainer.addEventListener('click', function (event) {
        var url = self.DOM.wrapper.querySelector('.active-menu-item a').getAttribute('href');
        location.href = url; // console.log(url);
        // alert(url);
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      this.cloneItems();
      this.initScroll();
    }
  }, {
    key: "initScroll",
    value: function initScroll() {
      // Scroll 1 pixel to allow upwards scrolling
      this.scrollPos = this.getScrollPos();
      this.prevScrollPos = this.scrollPos;

      if (this.scrollPos <= 0) {
        this.setScrollPos(1);
      }
    }
  }, {
    key: "getScrollPos",
    value: function getScrollPos() {
      var scrollPos = (this.DOM.scrollContainer.pageYOffset || this.DOM.scrollContainer.scrollTop) - (this.DOM.scrollContainer.clientTop || 0);
      this.DOM.el.scrollTo({
        top: scrollPos,
        behavior: 'instant'
      });
      return scrollPos;
    }
  }, {
    key: "setScrollPos",
    value: function setScrollPos(pos) {
      this.DOM.el.scrollTop = pos;
      this.DOM.scrollContainer.scrollTop = pos;
    }
  }, {
    key: "setAutoScrollSpeed",
    value: function setAutoScrollSpeed(event) {
      if (this.autoScroll) {
        var relativePos = event.clientY - this.DOM.el.clientHeight / 2;
        this.scrollSpeed = relativePos / (this.DOM.el.clientHeight / 2);
      }
    }
  }, {
    key: "startAutoScroll",
    value: function startAutoScroll() {
      this.autoScroll = true;
    }
  }, {
    key: "stopAutoScroll",
    value: function stopAutoScroll() {
      this.autoScroll = false;
    }
  }, {
    key: "scrollUpdate",
    value: function scrollUpdate() {
      if (this.autoScroll) {
        var pos = this.getScrollPos();
        pos += this.scrollSpeed * this.scrollSpeed * this.scrollSpeed * 20; // scroll speed factor

        this.setScrollPos(pos);
      }

      this.scrollPos = this.getScrollPos(); // Scroll to the top when you’ve reached the bottom

      if (this.scrollPos + this.clonesHeight >= this.scrollHeight) {
        this.setScrollPos(0);
      } // Scroll to the bottom when you reach the top
      else if (this.scrollPos <= 0) {
        this.setScrollPos(this.scrollHeight - this.clonesHeight);
      } // Scroll back to current item when scrolling stoppped


      if (this.prevScrollPos == this.scrollPos) {
        if (this.timer === false) {
          this.startWaitTimer();
        }
      } else {
        this.resetWaitTimer();
      }

      this.prevScrollPos = this.scrollPos;
      this.updateActiveItem();
    }
  }, {
    key: "startWaitTimer",
    value: function startWaitTimer() {
      var self = this;
      this.timer = setTimeout(function () {
        self.scrollToActiveItem(self);
      }, 3000);
    }
  }, {
    key: "resetWaitTimer",
    value: function resetWaitTimer() {
      clearTimeout(this.timer);
      this.timer = false;
    }
  }, {
    key: "scrollToActiveItem",
    value: function scrollToActiveItem(self, smooth) {
      var behavior = smooth !== false ? 'smooth' : 'instant';
      var scrollTo = self.DOM.currentItem.offsetTop - self.DOM.el.clientHeight / 2;
      var currentScroll = self.getScrollPos();

      if (scrollTo !== currentScroll) {
        // console.log('scrollToActiveItem',currentScroll,scrollTo);
        if (scrollTo <= 0) {
          scrollTo += self.clonesHeight;
        }

        self.DOM.el.scrollTo({
          top: scrollTo,
          behavior: behavior
        });
        self.DOM.scrollContainer.scrollTo({
          top: scrollTo,
          behavior: behavior
        });
      }
    }
  }, {
    key: "updateActiveItem",
    value: function updateActiveItem() {
      var middleScroll = this.getScrollPos() + this.DOM.el.clientHeight / 2;
      var newActiveItem = Math.floor(middleScroll / this.itemHeight) % this.DOM.menuItems.length;

      if (newActiveItem != this.activeItem) {
        this.activeItem = newActiveItem; // remove current active item

        var current = this.DOM.wrapper.querySelector('.active-menu-item');

        if (current) {
          this.DOM.wrapper.removeChild(current);
        } // clone active item


        var clone = this.DOM.menuItems[this.activeItem].cloneNode(true);
        clone.classList.add('active-menu-item');
        this.DOM.wrapper.appendChild(clone);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this.scrollUpdate();
      requestAnimationFrame(function () {
        return _this2.render();
      });
    }
  }]);

  return ScrollMenu;
}();
