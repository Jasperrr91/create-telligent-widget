(function ($, global) {
  var api = {
    register: function (context) {
      console.log(context.someValue);
    }
  };

  if (!$.NAMESPACE) { $.NAMESPACE = {}; }
  if (!$.NAMESPACE.widgets) { $.NAMESPACE.widgets = {}; }
  $.NAMESPACE.widgets.WIDGET_NAME = api;

})(jQuery, window);