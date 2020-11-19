// Generated by CoffeeScript 1.10.0

/*
 *
 */

(function() {
  var action_links, default_printer, download_file, drawing_json, drawings, filter_drawings, fix_search_results, flash_message, getFirstKey, get_default_printer, get_file_meta, get_misplaced_files, get_more_menu, get_printers_menu, get_summary, get_today, handle_action_clicks, handle_results_clicks, is_summary, more_btn_background, more_btn_color, plot_PRF, plot_menu, previous_button, printers_json, refresh_delay, search_strings, selected_el, set_default_printer, show_more_menu, sorted_printers, update_list;

  refresh_delay = 10000;

  drawing_json = void 0;

  drawings = {};

  search_strings = [];

  sorted_printers = [];

  default_printer = 'ISLaserBsize';

  selected_el = void 0;

  previous_button = false;

  action_links = {};

  show_more_menu = false;

  printers_json = void 0;

  is_summary = 'True';

  more_btn_background = '#FFF';

  more_btn_color = 'rgb(85, 85, 255)';


  /**************************************************************************************************
   *                            Click on more info button
  *************************************************************************************************
   */


  /**************************************************************************************************
   *                            Update list of drawings
  *************************************************************************************************
   */

  update_list = function() {
    var ajaxCallsRemaining;
    $('#list_queue').empty();
    drawings = {};
    $('#notes').hide();
    $('#misplaced_files').hide();
    $('#info').html('');
    if (is_summary) {
      more_btn_background = '#eee';
      more_btn_color = '#ccc';
    } else {
      more_btn_background = '#fff';
      more_btn_color = 'rgb(85, 85, 255)';
    }
    $('#More_btn').css({
      'background-color': more_btn_background,
      'color': more_btn_color
    });
    $('#search').val($('#search').val().toUpperCase());
    search_strings = $('#search').val().split(' ');
    ajaxCallsRemaining = search_strings.length;
    if ($.trim(search_strings[0]) === '') {
      $('#search').val('Search for stuff');
      return;
    }
    $.each(search_strings, function(search_index) {
      drawing_json = $.ajax({
        dataType: 'json',
        url: '/api/search/' + search_strings[search_index]
      }).done(function(drawing_json) {
        var count, key, sorted, yogi;
        if (drawing_json.results === 'no files found') {
          $('#flash').html('no files found');
          flash_message();
          $('#search').select();
          return;
        }
        if (is_summary) {
          drawings[search_strings[search_index]] = filter_drawings(search_strings[search_index], drawing_json);
        } else {
          drawings[search_strings[search_index]] = drawing_json;
        }
        drawing_json = drawings[search_strings[search_index]];
        previous_button = false;
        sorted = [];
        for (key in drawing_json) {
          sorted[sorted.length] = key;
        }
        sorted.sort();
        yogi = '<br><br> If you don\'t know where you\'re going...<br> ...you might not get there...<br> - <a href="http://en.wikipedia.org/wiki/Yogi_Berra" target="_blank"> Yogi Berra </a>';
        $.each(sorted, function(index) {
          if (drawing_json[sorted[index]] !== 'stats') {
            $('#list_queue').append('<li class="list-group-item pdf" id="' + sorted[index] + '">' + sorted[index] + '</li>');
          }
        });
        $('#list').scrollTop(0);
        count = Object.keys(drawing_json).length;
        $('#list_drawings').empty();
        if (count > 1000) {
          $('#returned_count').html('More than 1000 items -- please narrow your search. ');
          $('#flash').html('Search returned too many results...' + yogi);
          $('#returned_count').addClass('alert alert-warning');
          $('#returned_count').removeClass('alert alert-info');
          flash_message();
        } else {
          $('#returned_count').html(count + ' items returned');
          $('#returned_count').addClass('alert alert-info');
          $('#returned_count').removeClass('alert alert-warning');
        }
        $('#returned_count').delay(300).fadeIn('normal', function() {
          $(this).delay(2000).fadeOut();
        });
        $('#submit').focus();
        --ajaxCallsRemaining;
        if (ajaxCallsRemaining <= 0) {
          selected_el = $('ul#list_queue li:first');
          $('ul#list_queue li:first').trigger('click');
        }
      });
    });
  };


  /**************************************************************************************************
   *                            Remove spaces from returned search keys
  *************************************************************************************************
   */

  fix_search_results = function(drawing_json) {
    var fixed_key, key;
    for (key in drawing_json) {
      if (key.indexOf(' ')) {
        fixed_key = key.replace(/\ /g, '_');
        drawing_json[fixed_key] = drawing_json[key];
        delete drawing_json[key];
      }
    }
    return drawing_json;
  };


  /**************************************************************************************************
   *                            Filter drawings - print only
  *************************************************************************************************
   */

  filter_drawings = function(search_item, drawings) {
    var ret_drawings;
    ret_drawings = {};
    $.each(drawings, function(drawing) {
      var print_drawings;
      print_drawings = [];
      $.each(drawings[drawing], function(item) {
        if (drawings[drawing][item].indexOf('pdf_out') > -1 || drawings[drawing][item].indexOf('mb-archive') > -1) {
          return print_drawings.push(drawings[drawing][item]);
        }
      });
      if (print_drawings.length > 0) {
        return ret_drawings[drawing] = print_drawings;
      }
    });
    return ret_drawings;
  };


  /**************************************************************************************************
   *                            Flash message on web page
  *************************************************************************************************
   */

  flash_message = function() {
    $(function() {
      $('#flash').delay(300).fadeIn('normal', function() {
        $(this).delay(3500).fadeOut();
      });
    });
  };


  /**************************************************************************************************
   *                            Click on search result
  *************************************************************************************************
   */

  getFirstKey = function(data) {
    var elem;
    for (elem in data) {
      return elem;
    }
  };

  handle_results_clicks = function($el) {
    var action_btns, drawing_name, items, key, sString, s_buttons, s_disabled, val;
    $('.active').removeClass('active');
    $('#info').html('');
    $('#notes').hide();
    $('#menu_more').empty();
    if (previous_button !== $(this).attr('id')) {
      $('#menu_more').hide();
      show_more_menu = false;
    }
    items = '';
    val = void 0;
    action_btns = {};
    drawing_name = $el.id;
    if ($('#' + drawing_name).length === 0) {
      return;
    }
    if (previous_button && $('#' + previous_button)[0]) {
      $('#' + previous_button)[0].innerHTML = previous_button;
    }
    previous_button = drawing_name;
    $('#list_drawings').empty();
    sString = void 0;
    $.each(search_strings, function(index) {
      if (typeof drawings[search_strings[index]] !== 'undefined') {
        sString = search_strings[index].toUpperCase();
        drawing_name = drawing_name.toUpperCase();
        if (search_strings.length > 1) {
          if (drawing_name.indexOf(sString) !== -1) {
            val = drawings[sString][drawing_name];
          } else {

          }
        } else {
          val = drawings[sString][drawing_name];
        }
      }
    });
    action_btns.More = 'disabled';
    action_btns.PDF = 'disabled';
    action_btns.Print = 'disabled';
    console.log("user = " + user)
    if (user == "admin") action_btns.Delete = 'enabled';
    action_links = {};
    $.each(val, function(item) {
      var data_id, drawing_link, info_button, mb_drawings_button, more_info_link, pdf_modified, s, s_type;
      s = val[item];
      drawing_link = val[item];
      more_info_link = '';
      data_id = drawing_name;
      action_links.data_id = data_id
      action_links.real = drawing_link
      if (drawing_link.indexOf('/imported/') > -1) {
        info_button = '<a id="more_info" data-id="' + data_id + '">Linked data</a>';
        more_info_link = '&nbsp;&nbsp;' + info_button;
        action_btns.More = 'enabled';
        action_links['More info'] = data_id;
        $('#menu_more').append('<li class="list-group-item">' + more_info_link + '</li>');
      } else if (drawing_link.indexOf('mb-archive') > -1) {
        mb_drawings_button = '<a id="mb_drawing_list" data-id="' + data_id + '">MB Drawing List</a>';
        more_info_link = '&nbsp;&nbsp;' + mb_drawings_button;
        action_btns.More = 'enabled';
        action_links['MB Drawing List'] = data_id;
        $('#menu_more').append('<li class="list-group-item">' + more_info_link + '</li>');
      }
      if (drawing_link.toUpperCase().lastIndexOf('.PRF') > 0) {
        action_links.PRF = drawing_link;
        action_btns.Print = 'enabled';
      } else if (drawing_link.toUpperCase().lastIndexOf('.PDF') > 0) {
        action_links.PDF = drawing_link;
        action_links.PRF = drawing_link;
        pdf_modified = get_file_meta(drawing_link);
        $('#list_drawings').append('<li class="list-group-item"><a href="' + drawing_link + '" title="  ' + drawing_link + '  " target="_blank">' + s.substring(s.lastIndexOf('/') + 1) + '  </a>' + more_info_link + '</li>');
        action_btns.PDF = 'enabled';
        action_btns.Print = 'enabled';
      } else {
        s_type = drawing_link.substring(drawing_link.lastIndexOf('.') + 1);
        action_links[s_type] = drawing_link;
        $('#list_drawings').append('<li class="list-group-item"><a href="' + drawing_link + '" title="  ' + drawing_link + '  " target="_blank">' + s.substring(s.lastIndexOf('/') + 1) + '  </a>' + more_info_link + '</li>');
        $('#menu_more').append('<li class="list-group-item"><a href="#" class="download_file" data-id="' + drawing_link + '" title="   ' + drawing_link + '   " >' + s.substring(s.lastIndexOf('/') + 1) + '  </a>' + more_info_link + '</li>');
        action_btns.More = 'enabled';
      }
    });
    if ($('#' + drawing_name)[0]) {
      $('#' + drawing_name)[0].className = 'list-group-item pdf active';
    }
    s_buttons = '';
    for (key in action_btns) {
      s_disabled = '';
      if (action_btns[key] === 'disabled') {
        s_disabled = ' disabled="disabled" class="btn_actions btn_disabled"';
      } else {
        s_disabled = ' class="btn_actions"';
      }
      s_buttons += '<button type="button" id="' + key + '_btn" ' + s_disabled + ' data-id="' + drawing_name + '"> ' + key + ' </button>';
    }
    if ($('#' + drawing_name)[0]) {
      $('#' + drawing_name)[0].innerHTML = drawing_name + s_buttons;
    }
    if (action_btns.Print === 'disabled') {
      $('#Print_btn').addClass('print_btn_disabled');
    } else {
      $('#Print_btn').addClass('print_btn');
    }
    $('#btn_pdf').attr('disabled', 'disabled');
    $('#More_btn').html($('#More_btn').html());
  };


  /**************************************************************************************************
   *                            Click on action buttons
  *************************************************************************************************
   */

  handle_action_clicks = function($el) {
    $('#menu_more').hide();
    switch ($el.id) {
      case 'Delete_btn':
        console.log('delete button clicked')
        console.log(action_links.data_id)
        console.log(action_links.real)
        $.ajax({
          url: '/file_del/' + action_links.data_id
        }).done(function(data) {
          if (data == "ok") {
            $('#flash').html(action_links.data_id + " is removed.");            
          } else {
            $('#flash').html("file deletion is failed.");
          }
          flash_message();
          
        }).fail(function(data) {
          $('#flash').html("file deletion is failed.");
          flash_message();
        });
        break;
      case 'Print_btn':
        if (default_printer === 'no cookie') {
          $('#flash').html('No Printer Selected!<br><br>To print, click <strong>Printers</strong> above and select a printer.');
          flash_message();
          return;
        }
        $.ajax({
          url: '/print/' + default_printer + action_links.PRF.substring(action_links.PRF.indexOf('/', 2))
        }).done(function(data) {
          $('#flash').html(action_links.PRF.substring(action_links.PRF.lastIndexOf('/') + 1, action_links.PRF.lastIndexOf('.')) + ' printed on ' + printers_json.responseJSON[default_printer] + '<br>(click Printers menu to change)');
          $('#returned_count').addClass('alert alert-info');
          flash_message();
        }).fail(function(data) {
          $('#flash').html(JSON.parse(data.responseText)['action'] + '<br><br>Report missing file to Engineering or I.S.');
          flash_message();
        });
        break;
      case 'PDF_btn':
        window.open(action_links.PDF, '_blank', '');
        $('#flash').html(action_links.PDF.substring(action_links.PDF.lastIndexOf('/') + 1) + ' downloaded');
        $('#returned_count').addClass('alert alert-info');
        $('#notes').hide();
        flash_message();
        break;
      case 'More_btn':
        if (show_more_menu) {
          $('#menu_more').hide();
          $('#More_btn').css({
            'background-color': more_btn_background,
            'color': more_btn_color
          });
          show_more_menu = false;
        } else {
          show_more_menu = true;
          get_more_menu();
          $('#More_btn').css({
            'background-color': '#f00',
            'color': '#fff',
            'background': 'red'
          });
        }
    }
  };

  download_file = function(drawing_link) {
    var file_return;
    file_return = $.ajax({
      dataType: 'json',
      url: drawing_link
    }).always(function(data) {
      var downloaded_file, first_pos, missing_file, second_pos;
      if (typeof file_return.responseJSON !== 'undefined') {
        first_pos = drawing_link.indexOf('/', 1) + 1;
        second_pos = drawing_link.lastIndexOf('/');
        missing_file = ' / ' + drawing_link.substring(first_pos, second_pos) + ' / ' + drawing_link.substring(drawing_link.lastIndexOf('/') + 1);
        $('#flash').html(file_return.responseJSON.results + '<br>[ ' + missing_file + ' ]');
        $('#returned_count').addClass('alert alert-info');
        flash_message();
      } else {
        window.open(drawing_link, '_blank');
        downloaded_file = drawing_link.substring(drawing_link.lastIndexOf('/') + 1);
        $('#flash').html('File downloaded.<br>[' + downloaded_file + ']');
        $('#returned_count').addClass('alert');
        flash_message();
      }
      return true;
    });
    return true;
  };

  get_file_meta = function(drawing_link) {
    var file_meta, file_name, file_url;
    file_url = drawing_link.substring(1, drawing_link.lastIndexOf('/'));
    file_name = drawing_link.substring(drawing_link.lastIndexOf('/') + 1);
    file_meta = $.ajax({
      url: '/api/get_file_meta/' + file_url.substring(file_url.lastIndexOf('/') + 1) + '/' + file_name,
      dataType: 'json'
    }).done(function(file_meta) {
      var btn, date1, date2, diffDays, timeDiff;
      btn = $('#PDF_btn');
      btn.attr('title', '  * Last Edited  ' + new Date(file_meta.modified).toLocaleFormat('%m/%d/%y, %I:%M%p').toLowerCase() + '  ');
      date1 = new Date(file_meta.modified);
      date2 = new Date(get_today());
      timeDiff = Math.abs(date2.getTime() - date1.getTime());
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays <= 7) {
        btn[0].innerHTML = btn[0].innerHTML + '<div style="display: inline; float: right; color: #d00;"> ***</div>';
      } else if (diffDays <= 30) {
        btn[0].innerHTML = btn[0].innerHTML + ' <div style="display: inline; float: right; color: #0d0;"> **</div>';
      } else if (diffDays <= 60) {
        btn[0].innerHTML = btn[0].innerHTML + ' <div style="display: inline; float: right; color: #00f;"> *</div>';
      }
    });
  };

  get_today = function() {
    var dd, mm, today, yyyy;
    today = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return mm + '/' + dd + '/' + yyyy;
  };


  /**************************************************************************************************
   *                            Plot PRF files
  *************************************************************************************************
   */

  plot_PRF = function(prf_file) {
    drawings[prf_file.substring(prf_file.lastIndexOf('/'), prf_file.lastIndexOf('.'))] = $.ajax({
      dataType: 'json',
      url: '/plot_prf' + prf_file
    }).done(function(drawing_json) {
      $('#drawing_message').html('Plot sent... ' + prf_file);
      $('#drawing_message').css('display', 'normal');
      $('#drawing_message').delay(500).fadeIn('normal', function() {
        $(this).delay(5500).fadeOut();
      });
    });
  };


  /**************************************************************************************************
   *                            Generate Plot menu
  *************************************************************************************************
   */

  plot_menu = function(sType, drawing_link) {
    var sHtml, sImplemented;
    sImplemented = '';
    if (sType === 'PDF') {
      sImplemented = ' [not implemented yet]';
    } else {
      sImplemented = '';
    }
    sHtml = '<div class="dropdown">' + '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1"' + 'data-toggle="dropdown" aria-expanded="true">' + 'Plot ' + sType + sImplemented + ' ' + '<span class="caret"></span>' + '</button>' + '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">';
    $.each(sorted_printers, function(index) {
      var key;
      key = sorted_printers[index];
      sHtml += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" onClick=\'plot_' + sType + '("/' + key + drawing_link + '"); return false;\' >' + printers_json.responseJSON[key] + '</a></li>';
    });
    sHtml += '</ul></div>';
    return sHtml;
  };

  get_printers_menu = function() {
    $('#printers_menu').empty();
    $('#printers_menu').append('<li class="dropdown-header">&nbsp;&nbsp;&nbsp;&nbsp;select a default printer</li>');
    $.each(sorted_printers, function(index) {
      var key, s_default;
      key = sorted_printers[index];
      s_default = '';
      if (key === default_printer) {
        s_default = ' => ';
      }
      $('#printers_menu').append('<li id="' + key + '"><a href="#">' + s_default + printers_json.responseJSON[key] + '</a></li>');
    });
  };

  get_default_printer = function() {
    var get_printer;
    get_printer = $.ajax({
      dataType: 'text',
      url: '/api/get_printer/'
    }).done(function() {
      var s_default_printer;
      s_default_printer = get_printer.responseText;
      if (s_default_printer === 'no cookie') {
        default_printer = 'no cookie';
      } else {
        default_printer = s_default_printer;
      }
      get_printers_menu();
    });
  };

  set_default_printer = function(default_printer) {
    var set_printer;
    set_printer = $.ajax({
      dataType: 'text',
      url: '/api/set_printer/' + default_printer
    }).done(function() {
      var s_default_printer;
      s_default_printer = set_printer.responseText;
      default_printer = s_default_printer;
      get_printers_menu();
    });
  };

  get_summary = function() {
    var summary;
    console.log(' begin get_summary');
    return summary = $.ajax({
      dataType: 'text',
      url: '/api/is_summary/'
    }).done(function() {
      console.log('> is_summary: ', summary.responseText);
      is_summary = summary.responseText;
      return summary.responseText;
    });
  };

  get_more_menu = function() {
    var p_left, p_top;
    selected_el = $('.active')[0];
    $('#menu_more').css('display', 'block');
    p_top = $('#More_btn').parent()[0].offsetTop + 171 - $('#list').scrollTop();
    p_left = $('#More_btn').position().left + 154;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      p_left = p_left - 221;
    }
    if (/iPhone/i.test(navigator.userAgent)) {
      p_top = p_top + 51;
      p_left = p_left - 9;
    }
    $('#menu_more').offset({
      top: p_top,
      left: p_left
    });
    $('#menu_more').css({
      'display': 'block'
    });
  };

  get_misplaced_files = function() {
    var misplaced_files_json;
    misplaced_files_json = $.ajax({
      datatype: 'json',
      url: '/api/get_misplaced_files'
    }).done(function() {
      var misplaced_files, sOutput, sorted_folders;
      misplaced_files = JSON.parse(misplaced_files_json.responseText);
      sOutput = '';
      console.log('misplaced folders: ', Object.keys(misplaced_files).sort());
      sorted_folders = Object.keys(misplaced_files).sort();
      console.log('sorted_folders: ', sorted_folders);
      $.each(sorted_folders, function(folder_index) {
        var folder;
        folder = sorted_folders[folder_index];
        console.log('index: ', folder_index, folder);
        $('#list_misplaced_files').append('<h3>' + folder + '</h3>');
        $('#list_misplaced_files').append('<p> [allowed: ' + misplaced_files[folder].allowed + ']</p><ul>');
        $.each(misplaced_files[folder].misplaced_files, function(file) {
          return $('#list_misplaced_files').append('<li>' + misplaced_files[folder].misplaced_files[file] + '</li>');
        });
        return $('#list_misplaced_files').append('</ul><hr>');
      });
    });
  };

  $(document).on('click', '#more_info', function() {
    var more_info_json;
    more_info_json = $.ajax({
      dataType: 'json',
      url: '/api/get_mb_notes/' + $(this).attr('data-id')
    }).done(function() {
      var key, note, oMoreInfo, sInfo;
      oMoreInfo = JSON.parse(more_info_json.responseText);
      key = Object.keys(oMoreInfo)[0];
      sInfo = '<h4><span class="label label-default">Job: </span></h4>' + key + '<br>';
      sInfo += '<h4><span class="label label-default">Description: </span></h4>';
      if (oMoreInfo[key].description) {
        sInfo += oMoreInfo[key].description;
      }
      sInfo += '<br>';
      sInfo += '<div><h4><span class="label label-default">Notes: </span></h4><ul>';
      for (note in oMoreInfo[key].notes) {
        if (oMoreInfo[key].notes[note]) {
          sInfo += '<li class="list-group-item">' + oMoreInfo[key].notes[note] + '</li>';
        }
      }
      sInfo += '</ul>';
      $('#info').html(sInfo);
      $('#notes').show();
    });
  });


  /**************************************************************************************************
   *                            Click on mb drawing list button
  *************************************************************************************************
   */

  $(document).on('click', '#mb_drawing_list', function() {
    var mb_drawings_json;
    mb_drawings_json = $.ajax({
      dataType: 'json',
      url: '/api/get_mb_drawings/' + $(this).attr('data-id')
    }).done(function() {
      var key, oMbDrawings, sHTML, sorted_drawings;
      oMbDrawings = JSON.parse(mb_drawings_json.responseText);
      key = Object.keys(oMbDrawings)[0];
      if (typeof key === 'undefined') {
        $('#flash').html(' Masterbill data not available -- from Accuterm generate Masterbill');
        $('#returned_count').addClass('alert alert-info');
        flash_message();
        return false;
      }
      sorted_drawings = Object.keys(oMbDrawings[key]).sort();
      sHTML = '<h3><span class="label label-info">Master bill of materials drawing list: </span></h3>[ beta test - report inaccuracies ]<br><br><ul>';
      $.each(sorted_drawings, function(index) {
        sHTML += '<li class="list-group-item" onClick="window.open(\'/q/' + sorted_drawings[index] + '\', \'_blank\')"' + ' title="' + sorted_drawings[index] + '">' + oMbDrawings[key][sorted_drawings[index]] + '<img src="static/img/link_icon.gif" class="link_icon"></li>';
      });
      sHTML += '</ul>';
      $('#info').html(sHTML);
      $('#notes').show();
    });
  });


  /**************************************************************************************************
   *                            Click on media list button
  *************************************************************************************************
   */

  $(document).on('click', '#media_list', function() {
    var media_json;
    media_json = $.ajax({
      dataType: 'json',
      url: '/api/get_media/' + $(this).attr('data-id')
    }).done(function() {
      var key, oMedia, sHTML, sorted_media;
      oMedia = JSON.parse(media_json.responseText);
      key = Object.keys(oMedia)[0];
      if (typeof key === 'undefined') {
        $('#flash').html(' Media data not available');
        $('#returned_count').addClass('alert alert-info');
        flash_message();
        return false;
      }
      sorted_media = Object.keys(oMedia[key]).sort();
      sHTML = '<h3><span class="label label-info">Media list: </span></h3>[ beta test - report inaccuracies ]<br><br><ul>';
      $.each(sorted_media, function(index) {
        sHTML += '<li class="list-group-item media_list_folder" title="' + oMedia[key][sorted_media[index]] + '" data-id="' + encodeURIComponent(oMedia[key][sorted_media[index]]) + '">' + oMedia[key][sorted_media[index]].substring(oMedia[key][sorted_media[index]].indexOf(key)) + '<img src="static/img/link_icon.gif" class="link_icon"></li>';
      });
      sHTML += '</ul>';
      $('#info').html(sHTML);
      $('#notes').show();
    });
  });


  /**************************************************************************************************
   *                            Click on media list folder 
  *************************************************************************************************
   */

  $(document).on('click', '.media_list_folder', function() {
    var data_id, media_json;
    data_id = $(this).attr('data-id');
    media_json = $.ajax({
      dataType: 'json',
      url: '/api/get_media_folder/' + $(this).attr('data-id')
    }).done(function() {
      var key, oMedia, sHTML, sorted_media;
      oMedia = JSON.parse(media_json.responseText);
      key = Object.keys(oMedia)[0];
      if (typeof key === 'undefined') {
        $('#flash').html(' Media data not available');
        $('#returned_count').addClass('alert alert-info');
        flash_message();
        return false;
      }
      sorted_media = Object.keys(oMedia[key]).sort();
      sHTML = '';
      $.each(sorted_media, function(index) {
        return sHTML += '<a class="gallery" href="/api/get_image/' + data_id + '/' + oMedia[key][sorted_media[index]] + '"  data-featherlight-gallery="/api/get_image/' + data_id + '/' + oMedia[key][sorted_media[index]] + '"><img src="/api/get_image/' + data_id + '/' + oMedia[key][sorted_media[index]] + '"></a>&nbsp;';
      });
      $('#media').html(sHTML);
      $('a.gallery').featherlightGallery({
        gallery: {
          next: 'next »',
          previous: '« previous'
        }
      });
      $('a.gallery')[0].click();
      return console.log($('a.gallery'));
    });
  });


  /**************************************************************************************************
   *                            Click on More menu button
  *************************************************************************************************
   */


  /**************************************************************************************************
   *                            Press key
  *************************************************************************************************
   */

  $(document).keydown(function(e) {
    var next_el;
    next_el = void 0;
    $('#menu_more').hide();
    switch (e.keyCode) {
      case 191:
      case 69:
        if ($('#search').is(':focus')) {
          $('#search').val($('#search').val() + 'e');
          return false;
        } else {
          $('#search').focus();
          $('#search').select();
          return false;
        }
        break;
      case 13:
        update_list();
        break;
      case 40:
      case 74:
        if ($('#search').is(':focus')) {
          $('#search').val($('#search').val() + 'j');
          return false;
        } else {
          selected_el = $('.active')[0];
          if (selected_el.nextSibling) {
            next_el = $(selected_el.nextSibling);
            next_el.trigger('click');
            if (next_el[0].offsetTop < $('#list').scrollTop()) {

            } else {
              $('#list').scrollTop(0);
              $('#list').scrollTop(next_el.position().top - $('#list').height() + 45);
            }
          }
        }
        return false;
      case 38:
      case 75:
        selected_el = $('.active')[0];
        if (selected_el.previousSibling) {
          next_el = $(selected_el.previousSibling);
          next_el.trigger('click');
          if (next_el[0].offsetTop < $('#list').scrollTop()) {
            $('#list').scrollTop(0);
            $('#list').scrollTop(next_el.position().top);
          } else {

          }
        }
        break;
      case 80:
        selected_el = $('.active')[0];
        $('#' + $('.btn_actions')[2].id).trigger('click');
        break;
      case 68:
        selected_el = $('.active')[0];
        $('#' + $('.btn_actions')[1].id).trigger('click');
        break;
      case 77:
        if (show_more_menu) {
          $('#menu_more').hide();
          $('#More_btn').css({
            'background-color': more_btn_background,
            'color': more_btn_color
          });
          show_more_menu = false;
        } else {
          show_more_menu = true;
          $('#More_btn').css({
            'background-color': '#f00',
            'color': '#fff',
            'background': 'red'
          });
          get_more_menu();
        }
    }
  });


  /**************************************************************************************************
   *                            Document ready
  *************************************************************************************************
   */

  $(document).ready(function() {
    var locationPath, q;
    locationPath = window.location.pathname.split('/');
    q = locationPath[2];
    if (typeof(user) != "undefined" && user !== null) {
      console.log("yes");
      if (user == "admin") {
          $("#btn_admin").css("display", "none")
      } else {
          $("#btn_admin").css("display", "inline")
      }
      console.log("user = " + user);
    } else {
      $("#btn_admin").css("display", "inline")
        console.log("no");
    }
    if (q !== void 0) {
      $('#search').attr('value', q);
      update_list();
      $('#search').focus(function() {
        $('#search').select();
      });
      $('#search').focus;
    } else {

    }
    $('.gallery').featherlightGallery();
    $('#fsearch').on('submit', function(event) {
      event.preventDefault();
      update_list();
    });
    $('#search').on('click', function(event) {
      $('#search').val('');
      return false;
    });
    $('body').on('click', '.btn_actions', function(event) {
      handle_action_clicks($(this)[0]);
      event.stopPropagation();
    });
    $('body').on('click', '#Search', function(event) {
      $('#Search').val('');
      $('#search').focus();
      $('#search').focus(function() {
        $('#search').select();
      });
      event.stopPropagation();
    });
    $('body').on('click', '.pdf', function() {
      handle_results_clicks($(this)[0]);
    });
    $('body').on('click', '#printers_menu li', function(e) {
      default_printer = e.currentTarget.id;
      set_default_printer(default_printer);
      get_printers_menu();
      $('#flash').html(' Default printer changed to ' + printers_json.responseJSON[default_printer]);
      $('#returned_count').addClass('alert alert-info');
      flash_message();
    });
    $('body').on('click', '#reports_menu li', function(e) {
      console.log('misplaced_files_menu:', e);
      get_misplaced_files();
      $('#list_queue').empty();
      $('#misplaced_files').css({
        'display': 'block'
      });
      return e;
    });
    $('body').on('click', '.download_file', function(event) {
      var data_id;
      data_id = this.attributes['data-id'].value;
      download_file(this.attributes['data-id'].value);
    });
    $('#list').on('scroll', function() {
      $('#menu_more').hide();
      $('#More_btn').css({
        'background-color': more_btn_background,
        'color': more_btn_color
      });
      show_more_menu = false;
    });
    $(document).on('click', function(event) {
      $('#menu_more').hide();
      $('#More_btn').css({
        'background-color': more_btn_background,
        'color': more_btn_color
      });
      show_more_menu = false;
    });
    $('#btn_summary').on('click', function() {
      if (is_summary) {
        $('#btn_summary').val('Showing all files');
        $('#btn_summary').prop('title', "  Click to show Drawings only  ");
        more_btn_background = '#eee';
        more_btn_color = '#ccc';
        is_summary = false;
        return update_list();
      } else {
        $('#btn_summary').val('Showing drawings only');
        $('#btn_summary').prop('title', "  Click to show All files  ");
        more_btn_background = '#fff';
        more_btn_color = 'rgb(85, 85, 255)';
        is_summary = true;
        return update_list();
      }
    });

    $('#btn_rescan').on('click', function() {
      $.ajax({
        url: '/api/rescan'
      }).done(function(data) {
        console.log("ajax ok")
      }).fail(function(data) {
        console.log("ajax failed")
      });
    });

    $('#btn_admin').on('click', function() {
      window.location.href = "/login";
    });

    /**************************************************************************************************
     *                            Search text box has focus
    *************************************************************************************************
     */
    $(document).on('focus', '#search', function() {
      $(this).attr('value', '');
    });

    /**************************************************************************************************
     *                            Search text box changed
    *************************************************************************************************
     */
    $(document).on('blur', '#search', function() {
      $(this).attr('value', 'search for drawings...');
    });

    /**************************************************************************************************
     *                            Click on Search button
    *************************************************************************************************
     */
    $(document).on('click', '#submit', function() {
      update_list();
    });

    /************************************************************************************************* */
    get_default_printer();
    printers_json = $.ajax({
      dataType: 'json',
      url: '/api/get_printers/'
    }).done(function(printers_json) {
      var key;
      for (key in printers_json) {
        sorted_printers[sorted_printers.length] = key;
      }
      sorted_printers.sort();
      $.each(sorted_printers, function(index) {});
      get_printers_menu();
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map
