/**
 *  @author XC
 *  @version Xcript.ifeng.lazyLoad0.1
 */
(function () {
  var itools = {}
  itools.addListener = function (e, type, fn, scope) {
    if (scope) {
      var func = function () {
          fn.call(scope);
        }
    }
    if (e.addEventListener) {
      e.addEventListener(type, func, false);
    } else if (e.attachEvent) {
      e.attachEvent("on" + type, func);
    } else {
      e["on" + type] = func;
    }
  }
  itools.lazy = function (container, tag, trigger, trigger_el) {
    this.container = !! container ? (typeof container === "string" ? document.getElementById(container) : container) : document.body;
    this.tag = !! tag ? tag : "img";
    this.trigger = !! trigger ? trigger : "scroll";
    this.tri_el = !! trigger_el ? (typeof trigger_el === "string" ? document.getElementById(trigger_el) : trigger_el) : window;
    this.elements = this.container.getElementsByTagName(this.tag);
    this.count = 0;
  }
  itools.lazy.prototype = {
    play: function () {
      var _ = this;
      var el = !! _.tri_el ? _.tri_el : window;
      itools.addListener(el, _.trigger, _.load, _);
    },
    load: function () {
      var _ = this;
      var el = _.elements;
      var len = el.length;
      for (var i = 0; i < len; i++) {
        var obj = el[i];
        if (obj.getAttribute("_src") && _.isVisual(obj)) {
          obj.src = obj.getAttribute("_src");
          obj.removeAttribute("_src");
        }
      }
    },
    isVisual: function (el) {
      var _ = this;
      switch (_.trigger) {
      case "click":
        return true;
        break;
      case "mouseover":
        return true;
        break;
      default:
        return (function (el) {
          var doc = document.compatMode === "BackCompat" ? document.body : document.documentElement;
          var mintop = document.body.scrollTop + document.documentElement.scrollTop,
            minleft = document.body.scrollLeft + document.documentElement.scrollLeft,
            maxtop = doc.clientHeight + mintop,
            maxleft = doc.clientWidth + minleft,
            height = 0,
            width = 0;
          while (el) {
            height += el.offsetTop;
            width += el.offsetLeft;
            if(el.offsetParent == document.body || el.offsetParent == _.container){
              if(el.offsetParent == document.body){
                height -= _.container.offsetTop;
                width -= _.container.offsetLeft;
              }
              break;
            }else{
              el = el.offsetParent;
            }
          }
          if ((height >= mintop && height <= maxtop) && (width >= minleft && width <= maxleft)) {
            return true;
          } else {
            return false;
          }
        })(el);
      }
    }
  }
  window.X = window.itools = itools;
})();