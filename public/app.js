(function($) {

  function search(query) {
    $.get('/search?q=' + query)
      .done(draw);
  }

  var list = $('.list');

  function draw(data) {
    list.empty();
    if (data.length) {
      list.append(data.map(function(item) {
        return '<li>' + item.highlight.content + '</li>';
      }).join(''));
    }
  }

  $('[js-text]').on('keyup', function() {
    search($(this).val());
  });

  $('[js-name-1]').on('keyup', function() {

  })

  $('[js-name-2]').on('keyup', function() {

  });

  $('[js-datepicker-1]').datepicker();
  $('[js-datepicker-2]').datepicker();

}(jQuery));