/*global $, jQuery, alert*/

$(document).ready(function() {
  $('.edit-event-element').css('display', 'none');
  $('#show-add-event').addClass('current-mode');

  for(var i = 0; i < 24; i++) {
    if(i < 10) {
      i = ("0" + i).slice(-2);
    }

    $('.select-hour').append('<option value="' + i + '">' + i + '</option>');
  }

  for(var i = 0; i < 60; i++) {
    if(i < 10) {
      i = ("0" + i).slice(-2);
    }

    $('.select-minute').append('<option value="' + i + '">' + i + '</option>');
    $('.select-second').append('<option value="' + i + '">' + i + '</option>');
  }
});

$(function () {
  $('#add-event').click(addData);

  $('#edit-current').click(function(event) {
    getRowValues(0);
    event.stopPropagation();
  });

  $('#edit-previous').click(function(event) {
    getRowValues(-1);
    event.stopPropagation();
  });

  $('#edit-next').click(function(event) {
    getRowValues(1);
    event.stopPropagation();
  });

  $('#edit-event').click(pushEdits);

  $('#show-add-event').click(function() {
    $('.new-event-element').css('display', 'inline-block');
    $('.edit-event-element').css('display', 'none');
    $('#show-edit-event').removeClass('current-mode');
    $('#show-add-event').addClass('current-mode');

    clearFields();
  });

  $('#show-edit-event').click(function() {
    $('.edit-event-element').css('display', 'inline-block');
    $('.new-event-element').css('display', 'none');
    $('#show-edit-event').addClass('current-mode');
    $('#show-add-event').removeClass('current-mode');

    clearFields();
  });
});

function checkRequired(element) {
  if (element.val() == "") {
    return "#c9c9c9";
  }

  if (Number.isInteger(parseInt(element.val()))) {
    return "green";
  }

  return "red";
}

function checkOptional(element) {
  if (element.val() == "") {
    return "#c9c9c9";
  }

  return "green";
}

function checkOptionalNum(element) {
  if (element.val() == "") {
    return "#c9c9c9";
  }

  return Number.isInteger(parseInt(element.val())) ? "green" : "red";
}

function getFields() {
    var startYear = Number.isInteger(parseInt($('input[name=start-year]').val())) ? $('input[name=start-year]').val() : "";
    var startMonth = $('input[name=start-month]').val();
    var startDay = $('input[name=start-day]').val();

    var startTime = "";

    if ($('select[name=start-hour]').val() &&
        $('select[name=start-minute]').val() &&
        $('select[name=start-second]').val()) {

        startTime = $('select[name=start-hour]').val() + ':' +
                    $('select[name=start-minute]').val() + ':' +
                    $('select[name=start-second]').val();
        }

    var endYear = $('input[name=end-year]').val();
    var endMonth = $('input[name=end-month]').val();
    var endDay = $('input[name=end-day]').val();

    var endTime = "";

    if ($('select[name=end-hour]').val() &&
        $('select[name=end-minute]').val() &&
        $('select[name=end-second]').val()) {

        endTime = $('select[name=end-hour]').val() + ':' +
                  $('select[name=end-minute]').val() + ':' +
                  $('select[name=end-second]').val();
        }


    var displayDate = $('input[name=display-date]').val();

    var headline = $('input[name=headline]').val();
    var text = $('input[name=text]').val();
    var display = $('input[name=display-date]').val();
    var link = $('input[name=media-link]').val();
    var credit = $('input[name=media-credit]').val();
    var caption = $('input[name=media-caption]').val();
    var thumb = $('input[name=media-thumbnail]').val();
    var type = $('input[name=type]').val();
    var group = $('input[name=group]').val();
    var background = $('input[name=backgrounf]').val();

    return [startYear,
            startMonth,
            startDay,
            startTime,
            endYear,
            endMonth,
            endDay,
            endTime,
            displayDate,
            headline,
            text,
            link,
            credit,
            caption,
            thumb,
            type,
            group,
            background];
}

function addData() {
    this.disabled = true;

    google.script.run
        .withSuccessHandler(
          function(msg, element) {
            $('#submit-bar').val("New row added");
            element.disabled = false;
            clearFields();
          })
        .withFailureHandler(
          function(msg, element) {
            showError(msg, $('#submit-bar'));
            element.disabled = false;
          })
        .withUserObject(this)
        .appendData(getFields());
}

function getRowValues(offset) {
  google.script.run
    .withSuccessHandler(function(data) {
      //currently opens a new tab on click, why?
      $("input[name=start-year]").val(data[0]);
      $("input[name=start-month]").val(data[1]);
      $("input[name=start-day]").val(data[2]);
      $("select[name=start-hour]").val(data[3].substring(0, 2));
      $("select[name=start-minute]").val(data[3].substring(3, 5));
      $("select[name=start-second]").val(data[3].substring(6, 8));

      $("input[name=end-year]").val(data[4]);
      $("input[name=end-month]").val(data[5]);
      $("input[name=end-day]").val(data[6]);
      $("select[name=end-hour]").val(data[7].substring(0, 2));
      $("select[name=end-minute]").val(data[7].substring(3, 5));
      $("select[name=end-second]").val(data[7].substring(6, 8));

      $("input[name=display-date]").val(data[8]);
      $("input[name=headline]").val(data[9]);
      $("input[name=text]").val(data[10]);
      $("input[name=media]").val(data[11]);
      $("input[name=media-credit]").val(data[12]);
      $("input[name=media-caption]").val(data[13]);
      $("input[name=media-thumb]").val(data[14]);
      $("input[name=type]").val(data[15]);
      $("input[name=group]").val(data[16]);
      $("input[name=background]").val(data[17]);
    })
    .withFailureHandler(
      function(msg, element) {
        showError(msg, $('#submit-bar'));
    })
    .getRowValues(offset);
}

function pushEdits() {
    this.disabled = true;

    google.script.run
        .withSuccessHandler(
          function(msg, element) {
            $('#submit-bar').val("New row added");
            element.disabled = false;
            clearFields();
          })
        .withFailureHandler(
          function(msg, element) {
            showError(msg, $('#submit-bar'));
            element.disabled = false;
          })
        .withUserObject(this)
        .editData(getFields());

}

function clearFields() {
  $('form').find('input:text').val('');
  $('form').find('input:text').css('border-bottom', 'solid 2px #c9c9c9');
}

function showError(msg, element) {
  var div = $('<div id="error" class="error">' + msg + '</div>');
  $(element).after(div);
}
