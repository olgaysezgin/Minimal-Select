/*
 *	Minimal Select
 *	Requires jQuery library (http://www.jquery.com) and jQuery Class plug-in
 *	Olgay Sezgin (olgay at hipo dot biz, @olgaysezgin) - September 10, 2013
 */


$.namespace("MinimalSelect.UiSelect");

MinimalSelect.UiSelect = $.Class.extend({

    SELECTOR : '',
    option_values : [],
    option_texts : [],
    selected_option : -1,

    select_id : '',
    select_template : '',
    placeholder_text : '',
    list_top : 42,
    lit_max_height: 156,

    init : function (options) {

        $.extend(this, options);

        this.get_options();
        this.prepare_uiselect();
        $('body').click(this.click_body.bind(this));

    },

    hide_select : function () {

        $(this.SELECTOR).hide();

    },

    click_body : function (event) {

        if ( !$(event.target).parents(this.select_id).is('.m-select') ) {
            if ( $(this.select_id).is('.active') ) {
                this.toggle_list();
            }

            $(this.select_id).find('.m-placeholder').removeClass('focused');
        }

    },

    get_options : function () {

        this.option_texts = [];
        this.option_values = [];

        $(this.SELECTOR).find('option').each(function (i, e) {
            
            var attr = $(e).attr('selected');
            if ( typeof attr !== 'undefined' && attr !== false ) {
                this.selected_option = i;
            }

            this.option_values.push($(e).val());
            this.option_texts.push($(e).text());
            
        }.bind(this));

    },

    get_placeholder : function () {

        this.placeholder_text = $(this.SELECTOR).attr('placeholder');

    },

    create_uiselect_id : function () {

        this.select_id = '#mselect-' + this.SELECTOR.replace('#', '');

    },

    prepare_template : function () {

        this.get_placeholder();
        this.create_uiselect_id();
        this.select_template = '<div id="' + this.select_id.replace('#', '') + '" class="m-select"><b></b><a href="javascript:void(0);" class="m-placeholder" title="' + this.placeholder_text + '">' + this.placeholder_text + '</a><ul class="m-list" style="max-height: ' + this.lit_max_height +';top:' + (this.list_top + 30) + '; opacity:0"></ul></div>';

    },

    prepare_uiselect : function () {

        this.prepare_template();
        $(this.SELECTOR).after(this.select_template);
        this.set_select_width();
        this.hide_select();
        this.prepare_list();
        $(this.select_id).find('.m-placeholder').click(this.toggle_list.bind(this));
        $(this.select_id).find('.m-placeholder').focus(this.focused_ui_select.bind(this));
        $(this.select_id).find('.m-placeholder').blur(this.focus_out_ui_select.bind(this));
        $(this.select_id).find('a').click(this.select_option.bind(this));

    },

    prepare_list : function () {

        for (var i = 0; i <= this.option_texts.length -1; i++) {

            var item = '<li><a href="javascript:void(0);" tabindex="-1" data-value="' + this.option_values[i] + '">' + this.option_texts[i] + '</a></li>';
            $(this.select_id).find('ul.m-list').append(item);

            if ( i == 0 ) {
                $(this.select_id).find('ul.m-list li a').addClass('selected');
            }
            
        };

    },

    focused_ui_select : function () {

        $(this.select_id).removeClass('active');
        this.toggle_list();

    },

    focus_out_ui_select : function () {

        this.toggle_list();
        $(this.select_id).find('.m-placeholder').removeClass('focused');

    },

    toggle_list : function () {

        var list = $(this.select_id).find('ul.m-list');

        if ( $(this.select_id).is('.active') ) {
            
            list.stop().animate({
                opacity: 0,
                top: (this.list_top + 30)
            }, 150, function(){
                list.hide();
                $(this.select_id).removeClass('active');
            }.bind(this));

        } else {
            
            $(this.select_id).find('.m-placeholder').addClass('focused');

            list.stop().show().animate({
                opacity: 1,
                top: this.list_top
            }, 150, function(){
                $(this.select_id).addClass('active');
            }.bind(this));

        }

    },

    select_option : function (event) {

        var clicked_item_text = $(event.target).text();
        var clicked_item_value = $(event.target).attr('data-value');
        $(event.target).parents('.m-select').prev('select').find('option[value="' + clicked_item_value + '"]').attr('selected', true);
        this.change_placeholder(clicked_item_text);
        this.toggle_list();

    },

    change_placeholder : function (value) {

        $(this.select_id).find('.m-placeholder').text(value);

    },

    set_select_width : function () {

        var select_width = $(this.SELECTOR).width() + 40;
        $(this.select_id).width(select_width);
        $(this.select_id).find('.m-placeholder').width((select_width - 50));
        $(this.select_id).find('ul.m-list').width(select_width);

    },

});