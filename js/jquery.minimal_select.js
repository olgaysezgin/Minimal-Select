/*
 *  Minimal Select
 *  Requires jQuery library (http://www.jquery.com)
 *  Olgay Sezgin (olgay at hipo dot biz, @olgaysezgin) - September 10, 2013
 */

(function ( $ ) {
 
    $.fn.minimal_select = function(options) {

        var settings = $.extend({
            list_top: 40,
            lit_max_height: 156,
            select_width: 0,
            arrow_padding: 50,
            placeholder_text: ""
        }, options );

        function get_object_list (elem) {

            var select_options = '';
            var option_text, option_val;

            $(elem).find('option').each(function (i, opt) {

                option_text = $(opt).text();
                option_val = $(opt).val();

                var item;

                if ( $(opt).is('[selected="selected"]') ) {
                    item = '<li><a href="javascript:void(0);" class="selected" tabindex="-1" data-value="' + option_val + '">' + option_text + '</a></li>';
                    get_placeholder_text(elem, true);
                } else {
                    item = '<li><a href="javascript:void(0);" tabindex="-1" data-value="' + option_val + '">' + option_text + '</a></li>';
                }

                select_options = select_options + item;

            });

            return select_options;

        };

        //  get placeholder text on first value
        function get_placeholder_text (elem, is_selected) {

            if ( is_selected ) {
                settings.placeholder_text = $(elem).find('option[selected="selected"]').text();
            } else {
                console.log($(elem).attr('placeholder').length);
                settings.placeholder_text = $(elem).attr('placeholder');
            }

        };

        function prepare_template (elem) {

            var object_list = get_object_list(elem);
            var ui_select_id = 'ui_select_' + $(elem).attr('id');

            if ( settings.placeholder_text == "" ) {
                get_placeholder_text(elem, false);
            }

            if ( settings.select_width == 0 ) {
                settings.select_width = $(elem).width();
            }

            select_template = '<div id="' + ui_select_id + '" class="m-select" style="width: ' + settings.select_width + 'px"><b><i></i></b><a href="javascript:void(0);" class="m-placeholder" title="' + settings.placeholder_text + '" style="width: ' + (settings.select_width - settings.arrow_padding) + 'px">' + settings.placeholder_text + '</a><ul class="m-list" style="width: ' + settings.select_width + 'px; max-height: ' + settings.lit_max_height +'px; top:' + (settings.list_top + 30) + 'px; opacity:0">' + object_list + '</ul></div>';

            return select_template;

        };

        this.each(function (i, elem) {

            $(elem).after(prepare_template(elem));
            $(elem).hide();

        });

        function show_hide_opt_list (ui_select_id) {

            var list = $(ui_select_id).find('.m-list');

            if ( $(ui_select_id).is('.active') ) {

                list.stop().animate({
                    opacity: 0,
                    top: (settings.list_top + 30)
                }, 200, function () {
                    $(ui_select_id).removeClass('active');
                    $(this).hide();
                });

            } else {

                list.stop().show().animate({
                    opacity: 1,
                    top: settings.list_top
                }, 200, function () {
                    $(ui_select_id).addClass('active');
                });

            }

        };

        function get_ui_select_id (event) {

            return '#' + $(event.target).parents('.m-select').attr('id');

        };

        function update_placeholder (ui_select_id, text) {

            $(ui_select_id).find('.m-placeholder').attr('title', text).text(text);

        };

        function update_select_val (ui_select_id, val) {

            var select_id = '#' + $(ui_select_id).prev('select').attr('id');
            $(select_id).find('option[value="' + val + '"]').attr('selected', true);

        };

        $('.m-list a').click(function (event) {

            var ui_select_id = get_ui_select_id(event);
            var selected_opt_val = $(event.target).data('value');
            var selected_opt_text = $(event.target).text();
            var selected_index = $(event.target).parent('li').index();

            update_placeholder(ui_select_id, selected_opt_text);
            update_select_val(ui_select_id, selected_opt_val);
            focus_opt(ui_select_id, selected_index);
            show_hide_opt_list(ui_select_id);
            $(ui_select_id).addClass('selected');
            $(ui_select_id).find('.m-placeholder').focus();
            return false;

        });

        $('.m-placeholder').focus(function (event) {

            var ui_select_id = get_ui_select_id(event);
            $(event.target).parent('.m-select').addClass('focused');
            show_hide_opt_list(ui_select_id);

        });

        $('.m-placeholder').blur(function (event) {

            var ui_select_id = get_ui_select_id(event);
            if ( $(ui_select_id).find('.m-list').is('.hovered') ) {
                return false;
            }

            if ( $(ui_select_id).is('.active') ) {
                $(event.target).parent('.m-select').removeClass('focused');
                show_hide_opt_list(ui_select_id);
            }

        });

        $('.m-placeholder').click(function (event) {

            $(event.target).focus();

        });

        function focus_opt (ui_select_id, selected_index) {

            $(ui_select_id).find('a.selected').removeClass('selected');
            $(ui_select_id).find('li').eq(selected_index).find('a').addClass('selected');

        };

        function focus_up_option (ui_select_id) {

            var selected_index = $(ui_select_id).find('a.selected').parent('li').index();
            if ( selected_index != 0 ) {
                selected_index--;
                focus_opt(ui_select_id, selected_index);
            }

        };

        function focus_down_option (ui_select_id) {

            var selected_index = $(ui_select_id).find('a.selected').parent('li').index();
            if ( selected_index != ($(ui_select_id).find('li').length - 1) ) {
                selected_index++;
                focus_opt(ui_select_id, selected_index);
            }

        };

        $('.m-list').hover(function () {
            $(this).addClass('hovered');
        }, function () {
            $(this).removeClass('hovered');
        });

        $('body').keydown(function (event) {

            if ( $('.m-select').is('.active') ) {

                var ui_select_id = '#' + $('.m-select.active').attr('id');

                if (event.keyCode == 38) {
                    focus_up_option(ui_select_id);
                    return false;
                } else if (event.keyCode == 40) {
                    focus_down_option(ui_select_id);
                    return false;
                } else if (event.keyCode == 13 || event.keyCode == 32) {
                    $('.m-select.active').find('a.selected').click();
                } else if (event.keyCode == 27) {
                    $('.m-select.active').find('a.m-placeholder').click();
                }

            } else if ($('.m-placeholder:focus').length > 0 && event.keyCode == 32 || $('.m-placeholder:focus').length > 0 && event.keyCode == 38 || $('.m-placeholder:focus').length > 0 && event.keyCode == 40) {
                var ui_select_id = '#' + $('.m-placeholder:focus').parent('div').attr('id');
                show_hide_opt_list(ui_select_id);
            }

        });
        
    };

}( jQuery ));