(function() {
  'use strict';

  /* Extend Array Object */
  var Substrate, r, rs;

  Array.prototype.shuffle = function() {
    var i, j, t;
    i = this.length;
    while (i) {
      j = ~~(Math.random() * i);
      t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }
    return this;
  };


  /* Generate random number function */

  r = (function() {
    function r(n) {
      return ~~(Math.random() * n) + 1;
    }

    return r;

  })();

  rs = (function() {
    function rs(arr, n) {
      var ret;
      ret = arr;
      ret = (ret.shuffle()).slice(-n);
      return ret;
    }

    return rs;

  })();

  Substrate = (function() {
    var _colors, _lineLength, _svgns;

    _svgns = 'http://www.w3.org/2000/svg';

    _colors = ["#e2befc", "#ffb2d1", "#bdc8f5", "#bdc8f5"];

    _lineLength = 80;

    function Substrate(elem, url) {
      this.target = $(elem);
      this.url = url;
      this.init();
    }

    Substrate.prototype.init = function() {
      return this.getSvg();
    };

    Substrate.prototype.getSvg = function() {
      var that;
      that = this;
      return this.target.load(this.url, function() {
        that.initSvg();
        return that.loopAnimate();
      });
    };

    Substrate.prototype.initSvg = function() {
      var circle, group, i, k, l, len, line, paths, ref, results, that;
      that = this;
      this.svg = document.getElementById('electricSubstrate');
      this.groups = [];
      ref = [].slice.call(that.svg.querySelectorAll('.line'));
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        group = ref[i];
        this.groups[i] = group;
        paths = group.getElementsByTagName('path');
        line = paths[0];
        circle = paths[1];
        l = line.getTotalLength();
        line.style.strokeDasharray = _lineLength + ' ' + l;
        line.style.strokeDashoffset = l;
        line.style.strokeOpacity = 0;
        results.push(circle.style.opacity = 0);
      }
      return results;
    };

    Substrate.prototype.loopAnimate = function() {
      var that;
      that = this;
      return setInterval(function() {
        return that.runCurrent();
      }, 5000);
    };

    Substrate.prototype.runCurrent = function() {
      var circle, elems, endColor, groups, k, l, len, line, paths, results, startColor;
      groups = rs(this.groups, 5);
      results = [];
      for (k = 0, len = groups.length; k < len; k++) {
        elems = groups[k];
        startColor = _colors[r(_colors.length - 1)];
        endColor = _colors[r(_colors.length - 1)];
        paths = elems.querySelectorAll('path');
        line = paths[0];
        circle = paths[1];
        line.style.strokeOpacity = 1;
        line.style.stroke = startColor;
        circle.style.fill = endColor;
        l = line.getTotalLength();
        results.push($(line).velocity({
          strokeDashoffset: [_lineLength, l],
          stroke: endColor
        }, {
          duration: l * 10,
          easing: 'linear',
          progress: function(elements, complete, remaining) {
            var parent;
            if (remaining < 1000) {
              parent = elements[0].parentNode;
              return parent.children[1].style.opacity = 1;
            }
          },
          complete: function(elements) {
            var parent;
            parent = elements[0].parentNode;
            elements[0].style.strokeDashoffset = l;
            elements[0].style.strokeOpacity = 0;
            return parent.children[1].style.opacity = 0;
          }
        }));
      }
      return results;
    };

    return Substrate;

  })();

  window.Substrate = Substrate;

}).call(this);