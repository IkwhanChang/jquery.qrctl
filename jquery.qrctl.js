// Generated by CoffeeScript 1.7.1
(function() {
  var $, jQueryPlugIn, jqueryQrctl,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  jQueryPlugIn = (function() {
    jQueryPlugIn.defaultOptions = {};

    function jQueryPlugIn(element, options) {
      this.element = element;
      this.initialize(options);
    }

    jQueryPlugIn.prototype.initialize = function(options) {
      this.options = options;
    };

    jQueryPlugIn.installAsjQueryPlugIn = function(pluginName) {
      var pluginClass;
      if (pluginName == null) {
        pluginName = this.name;
      }
      pluginClass = this;
      return $.fn[pluginName] = function() {
        var args, options;
        options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if ($.type(options) === "object") {
          options = $.extend(pluginClass.defaultOptions, options || {});
        }
        return this.each(function() {
          var $this, instance, plugin;
          $this = $(this);
          instance = $this.data(pluginName);
          if (instance != null) {
            if ($.type(options) === "string") {
              return instance[options].apply(instance, args);
            } else if (instance.initialize != null) {
              return instance.initialize.apply(instance, [options].concat(args));
            }
          } else {
            plugin = (function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(pluginClass, [$this, options].concat(__slice.call(args)), function(){});
            $this.data(pluginName, plugin);
            $this.addClass(pluginName);
            $this.bind("destroyed." + pluginName, function() {
              $this.removeData(pluginName);
              $this.removeClass(pluginName);
              $this.unbind(pluginName);
              return plugin.destructor();
            });
            return plugin;
          }
        });
      };
    };

    return jQueryPlugIn;

  })();

  jqueryQrctl = (function(_super) {
    var Socket;

    __extends(jqueryQrctl, _super);

    Socket = 0;

    jqueryQrctl.defaultOptions = {
      position: 'bottom',
      width: 50,
      height: 50,
      color: "#3a3",
      background: "#fff",
      surl: 'https://jquery-qrctl.herokuapp.com',
      debug: false
    };

    function jqueryQrctl(element, options) {
      var ext;
      this.element = element;
      jqueryQrctl.__super__.constructor.call(this, this.element, options);
      ext = this;
      $.getScript(this.options.surl + "socket.io/socket.io.js", function(data, textStatus, jqxhr) {
        Socket = io.connect(options.surl);
        Socket.emit('join', 'site');
        Socket.on('join ok', function(siteID) {
          ext.element.qrcode({
            "render": "div",
            "width": ext.options.width,
            "height": ext.options.height,
            "color": ext.options.color,
            "background": ext.options.background,
            "text": "https://jquery-qrctl.herokuapp.com/c/" + encodeURIComponent(siteID)
          });
        });
        Socket.on('move', function(event) {
          ext.element.trigger('move', event);
        });
        Socket.on('btnDown', function(event) {
          ext.element.trigger('btnDown', event);
        });
        Socket.on('swipeleft', function() {
          ext.element.trigger('swipeleft');
        });
        Socket.on('swiperight', function() {
          ext.element.trigger('swiperight');
        });
        Socket.on('swipeup', function() {
          ext.element.trigger('swipeup');
        });
        Socket.on('swipedown', function() {
          ext.element.trigger('swipedown');
        });
      });
    }

    jqueryQrctl.prototype.initialize = function(options) {
      this.options = options;
      jqueryQrctl.__super__.initialize.call(this, this.options);
    };

    return jqueryQrctl;

  })(jQueryPlugIn);

  jqueryQrctl.installAsjQueryPlugIn();

}).call(this);
