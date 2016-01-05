var gray = "#c9c9c9",
    darkgray = '#969696',
    green = "#00C853",
    red = "#F44336";

var currentRowID;

  $(document).ready(function() {
    getAllRows();
    getRowData(0);
    currentRowID = "row-0";
    $("#row-0").addClass('selected');

    // refresh row list automatically
    setInterval(function() {
      getAllRows();
      // kind of works but not really
      $('.edit-select-list').find('#' + currentRowID).addClass('selected');
    }, 3000);

    for(var i = 0; i < 24; i++) {
      if (i < 10) {
        i = ("0" + i).slice(-2);
      }

      $('.select-hour').append('<option value="' + i + '">' + i + '</option>');
    }

    for(var i = 0; i < 60; i++) {
      if (i < 10) {
        i = ("0" + i).slice(-2);
      }

      $('.select-minute').append('<option value="' + i + '">' + i + '</option>');
      $('.select-second').append('<option value="' + i + '">' + i + '</option>');
    }

    $(".required").change(function() {
      $(this).css("color", checkRequired($(this)));
      $(this).css("border-bottom-color", checkRequired($(this)));
    });

    $(".optional").change(function() {
      $(this).css("color", checkOptional($(this)));
      $(this).css("border-bottom-color", checkOptional($(this)));
    });

    $(".optional-num").change(function() {
      $(this).css("color", checkOptionalNum($(this)));
      $(this).css("border-bottom-color", checkOptionalNum($(this)));
    });

    $('#add-event').click(function() {
      addData();
      getAllRows();
    });

    $('#edit-event').click(pushEdits);
    $('input').change(pushEdits);
    $('select').change(pushEdits);

  });

  $(document).on('click', '.edit-select-row', function() {
    clearFields();
    getRowData(parseInt($(this).attr('id').substring(4)));
    $('.edit-select-list').children('.edit-select-row').each(function(i) {
      $(this).removeClass('selected');
    })
    currentRowID = $(this).attr('id');
    $(this).addClass('selected');
  });

  $(document).on('click', '#add-row', function() {
    startNewRow();
  });

  function checkRequired(element) {
    if (element.val() == "") {
      return gray;
    }

    if (Number.isInteger(parseInt(element.val()))) {
      return green;
    }

    return red;
  }

  function checkOptional(element) {
    if (element.val() == "") {
      return gray;
    }

    return green;
  }

  function checkOptionalNum(element) {
    if (element.val() == "") {
      return gray;
    }

    return Number.isInteger(parseInt(element.val())) ? green : red;
  }

  function resetInputColors() {
    $('form').find('.required').css('color', '#000');
    $('form').find('.optional').css('color', '#000');
    $('form').find('.optional-num').css('color', '#000');
  }

  function getFields() {
      var startYear = Number.isInteger(parseInt($('input[name=start-year]').val())) ? $('input[name=start-year]').val() : "",
          startMonth = $('input[name=start-month]').val(),
          startDay = $('input[name=start-day]').val();

      var startTime = "";

      if ($('select[name=start-hour]').val() &&
          $('select[name=start-minute]').val() &&
          $('select[name=start-second]').val()) {

          startTime = $('select[name=start-hour]').val() + ':' +
                      $('select[name=start-minute]').val() + ':' +
                      $('select[name=start-second]').val();
          }

      var endYear = $('input[name=end-year]').val(),
          endMonth = $('input[name=end-month]').val(),
          endDay = $('input[name=end-day]').val();

      var endTime = "";

      if ($('select[name=end-hour]').val() &&
          $('select[name=end-minute]').val() &&
          $('select[name=end-second]').val()) {

          endTime = $('select[name=end-hour]').val() + ':' +
                    $('select[name=end-minute]').val() + ':' +
                    $('select[name=end-second]').val();
          }


      var displayDate = $('input[name=display-date]').val(),
          headline = $('input[name=headline]').val(),
          text = $('input[name=text]').val(),
          display = $('input[name=display-date]').val(),
          media = $('input[name=media]').val(),
          credit = $('input[name=media-credit]').val(),
          caption = $('input[name=media-caption]').val(),
          thumb = $('input[name=media-thumb]').val(),
          type = $('input[name=type]').val(),
          group = $('input[name=group]').val(),
          background = $('input[name=backgrounf]').val();

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
              media,
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
              console.error(msg);
              element.disabled = false;
            })
          .withUserObject(this)
          .appendData(getFields());
  }

  function getRowData(row) {
    actualRow = row + 2
    // console.log('getting row ' + actualRow);

    google.script.run
      .withSuccessHandler(function(data) {
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
          console.error(msg);
        })
      .getRowData(actualRow);
  }

  function pushEdits() {
      google.script.run
          .withSuccessHandler(
            function(msg, element) {

            })
          .withFailureHandler(
            function(msg, element) {
              console.error(msg);
            })
          .withUserObject(this)
          .editData(getFields());
  }

  function clearFields() {
    resetInputColors();
    $('form').find('input:text').val('');
    $('form').find('input:text').css('border-bottom', 'solid 2px ' + gray);

    $('.select-hour').val('');
    $('.select-minute').val('');
    $('.select-second').val('');
  }

  function showError(msg, element) {
    var div = $('<div id="error" class="error">' + msg + '</div>');
    $(element).after(div);
  }

  function removeOldRows() {
    $('li').remove('.edit-select-row');
    $('li').remove('#add-row');
  }

  function getAllRows() {
    google.script.run
      .withSuccessHandler(
        function(rows) {
          removeOldRows();

          for (var i = 0; i < rows.length; i++) {
            if (rows[i] === "") {
              rows[i] = "&nbsp;";
            }
            $('.edit-select-list').append('<li class="edit-select-row" id="row-' + i + '">' + rows[i] + '</li>');
          }

          $('.edit-select-list').append('<li id="add-row">+ Add Row</li>');
        })
      .withFailureHandler(
        function(msg, element) {
          console.error(msg);
        })
      .withUserObject(this)
      .getAllRows();
  }

  function startNewRow() {
    google.script.run
      .withSuccessHandler(
        function(msg, element) {
          clearFields();
        })
      .withFailureHandler(
        function(msg, element) {
          console.error(msg);
        })
      .withUserObject(this)
      .startNewRow();
  }
