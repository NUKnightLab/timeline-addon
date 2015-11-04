$(function() {
  $('#init').on('click', function() {
//        initSheet() must be wrapped in an anonymous function or else it just goes off at the start
    initSheet();
  });
});

function initSheet() {
    this.disabled = true;

    google.script.run
      .withSuccessHandler(
        function(msg, element) {
          element.disabled = false;
        })
      .withFailureHandler(
        function(msg, element) {
          showError(msg, $('#init'));
          element.disabled = false;
        })
      .withUserObject(this)
      .initSheet();
}
