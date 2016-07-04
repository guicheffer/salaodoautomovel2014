/**
 * SalaoDoAutomovel jQuery plugin v1.0
 * http://folha.com
 * Copyright 2014, Folha de S.Paulo
 * Author: João Guilherme C. Prado
 * <!--Library: jQuery 1.7.2-->
 * 
 * Salão do Automóvel 2014 - Folha (js)
 *
 * Date: Tue Aug 22 2014 10:31:27 GMT-0300
 */

var folha = {} ;

/*
 *Verifica se o navegador possui console
 */
if( typeof console == "undefined" ) {
    window.console = { log: $.noop } ;
}

folha.salao = {

    device_platform: 'Android',
    page_active: '.ui-page-active',
    main_page: '.main-page',
    default_time_loading_trigger: 100,

    screens: {

        model_news: '.news',
        model_exhibitors: '.exhibitors',

        check_page: function( page ){
            var that = this ;

            return $( 'body' ).hasClass( folha.salao.gui.get_only_string_class( page ) ) ;
        },

        init: function(){
            var that = this ;

            //exhibitors
            if( that.check_page( that.model_exhibitors ) ){
                that.exhibitors.init() ;
            }
        },

        //exhibitors module
        exhibitors: {

            content_exhibitors: '.content-exhibitors',
            exhibitor_detail: '.exhibitor-detail',

            write_exhibitor: function( item, i ){
                var that = this, code = '' ;

                code =  '<a href="#" data-id="' + item[ 'slug' ] + '" class="item item-exhibitor ui-link item-' + item[ 'slug' ] + ( ( ( i % 3 ) == 0 ) ? ' first-inline' : '' ) + ( ( i == 0  || i == 1 || i == 2 ) ? ' first-top' : '' ) + '">' ;
                code +=     '<img src="' + item[ 'logo' ] + '" alt="' + item[ 'name' ] + '">' + item[ 'name' ] ;
                code += '</a>' ;

                return code ;
            },

            hide_details: function(){
                var that = this, content = $( that.content_exhibitors ), exhibitor_detail = $( that.exhibitor_detail ), rotate_exhibitor = $( exhibitor_detail.find( '#rotate .m-scooch' ) ) ;

                exhibitor_detail.hide() ;
                if( ! content.is( ':animated' ) ){
                    content.fadeIn() ;
                }
            },

            get_info_exhibitor: function( id, callback ){
                var that = this, exhibitor_detail = $( that.exhibitor_detail ), rotate_exhibitor = $( exhibitor_detail.find( '#rotate .m-scooch' ) ) ;

                $.ajax( {
                    url: folha.salao.gui.path_templates + 'json/exhibitors.json',
                    success: function( data ) {
                        items = ( data.items ) ? data.items : '';

                        $.each( items, function( i, item ){
                            if( item.slug == id ){
                                callback( item ) ;
                                return false ;
                            }
                        } ) ;
                    }
                } );
            },

            show_details: function( id ){
                var that = this, content = $( that.content_exhibitors ),
                exhibitor_detail = $( that.exhibitor_detail ),
                rotate_exhibitor = $( exhibitor_detail.find( '#rotate .m-scooch' ) ), imgs = bullets = '' ;

                content.hide() ;
                if( ! exhibitor_detail.is( ':animated' ) ){
                    exhibitor_detail.fadeIn() ;
                }

                /*details*/

                //rotate

                that.get_info_exhibitor( id, function( info ){

                    //load imgs on rotate
                    if( typeof info.imgs != 'undefined' ){
                        $.each( info.imgs, function( i, item ){
                            imgs += '<div class="m-item ' + ( ( i == 0 ) ? ' m-active ' : '' ) + ' ">' ;
                                imgs += '<img src="' + item.local + '" alt="' + item.caption + '">' ;
                            imgs += '</div>' ;

                            bullets += '<a href="#" data-m-slide="' + ( i + 1 ) + '" class=" ' + ( ( i == 0 ) ? ' m-active ' : '' ) + ' ">' + ( i + 1 ) + '</a>' ;
                        } ) ;
                    }else{
                        imgs += '<div class="m-item m-active">' ;
                            imgs += '<img src="img/no_photo.gif" alt="Sem foto">' ;
                        imgs += '</div>' ;

                        bullets += '<a href="#" data-m-slide="1" class="m-active">1</a>' ;
                    }

                    //write imgs & bullets
                    $( '.m-scooch-inner' ).html( imgs ) ;
                    $( '.m-scooch-controls' ).html( bullets ) ;

                    //refresh rotate
                    rotate_exhibitor.scooch( 'refresh' ) ;
                    rotate_exhibitor.scooch( 'move', 0 );

                } ) ;

                /*/details*/

                $( folha.salao.gui.a_hide_menu ).on( folha.salao.gui.click_touch_event_start, function(){
                    $( folha.salao.gui.a_hide_menu ).trigger( 'action_back' ) ;
                } ) ;
            },

            config: function(){
                var that = this, content = $( that.content_exhibitors ), code = '',
                exhibitor_detail = $( that.exhibitor_detail ),
                rotate_exhibitor = $( exhibitor_detail.find( '#rotate .m-scooch' ) ), code = '' ;

                //set title
                folha.salao.gui.set_title_page( 'Expositores' ) ;

                //set rotate height mobile
                if( typeof orientation != 'undefined' ) {
                    if( orientation != 'portrait' ) {
                        $( exhibitor_detail.find( '.rotate .m-scooch-inner' ) ).css( 'height', ( $( window ).height() - 40 ) ) ;
                        $( exhibitor_detail.find( '.rotate .m-scooch-inner' ) ).css( 'margin-bottom', ( '10px' ) ) ;
                    }else{
                        $( exhibitor_detail.find( '.rotate .m-scooch-inner' ) ).css( 'height', 'auto' ) ;
                    }
                    $( window ).on( 'orientationchange', function( e ){
                        if( e.orientation != 'portrait' ) {
                            $( exhibitor_detail.find( '.rotate .m-scooch-inner' ) ).css( 'height', ( $( window ).height() - 40 ) ) ;
                            $( exhibitor_detail.find( '.rotate .m-scooch-inner' ) ).css( 'margin-bottom', ( '10px' ) ) ;
                        }else{
                            $( exhibitor_detail.find( '.rotate .m-scooch-inner' ) ).css( 'height', 'auto' ) ;
                        }
                    } ) ;
                }

                //content (main)
                if( content.length ){
                    $.ajax( {
                        url: folha.salao.gui.path_templates + 'json/exhibitors.json',
                        success: function( data ) {
                            items = ( data.items ) ? data.items : '' ;

                            if ( items.length ) {

                                //set content text
                                for( i = 0; i < items.length; i++ ){
                                    code += that.write_exhibitor( items[ i ], i ) ;
                                }

                                //write content text
                                content.html( code ) ;

                                //initialize rotate
                                rotate_exhibitor.scooch() ;

                                //click to see details
                                $( '.item-exhibitor' ).on( folha.salao.gui.click_touch_event_click, function(){
                                    that.show_details( $( this ).data( 'id' ) ) ;
                                } ) ;

                                //menu top (action back)
                                $( folha.salao.gui.a_hide_menu ).on( 'action_back', function(){
                                    that.hide_details() ;
                                } ) ;
                                
                            }
                        }
                    } );
                }

            },

            init: function(){
                var that = this ;

                that.config() ;
            }

        }
    },

    gui: {

        a_show_menu: 'a.show-menu',
        a_hide_menu: 'a.hide-menu',
        view_menu: '.view-menu',
        element_title_page: '.set-title-page',
        view_menu_toggle: '.view-menu-toggle',
        click_touch_event_start: ( ( document.ontouchstart !== null ) ? 'click' : 'touchstart' ),
        click_touch_event_end: ( ( document.ontouchend !== null ) ? 'click' : 'touchend' ),
        click_touch_event_click: ( ( document.ontouchstart !== null ) ? 'click' : 'tap' ),
        path_templates: '/includes/',
        extension_templates: '.html',
        container_main: '.container-main',
        templates: [
            [ 'menu' , 'menu' ],
            [ 'header' , 'header' ],
            [ 'overlay' , 'overlay_loading' ]
        ],

        //get only string class
        get_only_string_class: function( string ){
            return string.replace( '.', '' ) ;
        },

        //set title page
        set_title_page: function( title ){
            var that = this, set_title = $( that.element_title_page ) ;

            set_title.html( title ) ;
        },

        //mount template in tag
        mount_template_in_tag: function( tag, name_file ){
            var that = this, path_templates = that.path_templates, extension_templates = that.extension_templates ;

            tag.load( path_templates + name_file + extension_templates ).trigger( 'created-n-show' ) ;
        },

        //set includes on tags
        set_includes: function() {
            var that = this, tags = $( 'div[ data-include ]' ), templates = that.templates ;

            that.after_includes() ;

            //mount tags
            if( tags.length ){
                tags.each( function() {
                    for( var i = templates.length - 1 ; i >= 0 ; i-- ){
                        if( $( this ).attr( 'data-include' ) == templates[ i ][ 0 ] ){
                            that.mount_template_in_tag( $( this ), templates[ i ][ 1 ] ) ;
                        }
                    }
                } );
            }
        },

        //after includes on tags
        after_includes: function(){
            var that = this ;

            $( '.tag-show-menu' ).on( 'created-n-show', function(){
                setTimeout( function(){
                
                folha.salao.screens.init() ;
                    that.set_menu_view() ;
                    folha.salao.screens.init() ;
                }, folha.salao.default_time_loading_trigger ) ;
            } ) ;

        },

        //hide menu view
        hide_menu_view: function(){
            var that = this ;

            //hide
            if( $( folha.salao.main_page ).hasClass( that.get_only_string_class( that.view_menu ) ) ){
                $( folha.salao.main_page ).removeClass( that.get_only_string_class( that.view_menu ) ) ;
            }
            if( ! $( that.view_menu_toggle ).hasClass( 'hidden' ) ){
                $( that.view_menu_toggle ).addClass( 'hidden' ) ;
            }
        },

        //run set menu view
        show_menu_view: function( a_show_menu, a_hide_menu ){
            var that = this ;

            //show
            if( ! $( folha.salao.main_page ).hasClass( that.get_only_string_class( that.view_menu ) ) ){
                $( folha.salao.main_page ).addClass( that.get_only_string_class( that.view_menu ) ) ;
            }
            if( $( that.view_menu_toggle ).hasClass( 'hidden' ) ){
                $( that.view_menu_toggle ).removeClass( 'hidden' ) ;
            }

            //trigger
            a_hide_menu.unbind( that.click_touch_event_start ) ;
            a_hide_menu.on( that.click_touch_event_start, function(){
                if( $( folha.salao.main_page ).hasClass( that.get_only_string_class( that.view_menu ) ) ){
                    that.hide_menu_view() ;
                }else{
                    $( this ).trigger( 'action_back' ) ;
                }
            }) ;

            //general (container)
            $( that.container_main ).on( that.click_touch_event_start, function(){
                that.hide_menu_view() ;
                $( this ).unbind() ;
            }) ;

        },

        //set menu event click
        set_menu_view: function(){
            var that = this, a_show_menu = $( that.a_show_menu ), a_hide_menu = $( that.a_hide_menu ) ;

            //set menu view
            if( a_show_menu.length && a_hide_menu.length ){
                a_show_menu.on( that.click_touch_event_start, function(){
                    that.show_menu_view( a_show_menu, a_hide_menu ) ;
                }) ;
            }

            //slide if it already is set view menu
            if( $( folha.salao.main_page ).hasClass( that.get_only_string_class( that.view_menu ) ) ){
                that.show_menu_view( a_show_menu, a_hide_menu ) ;
            }

            //body - items view menu toggle
            if( $( 'body' ).hasClass( 'news' ) ){
                $( '.view-menu-toggle li.news > a .item-selected' ).addClass( 'shown' ) ;
            }else if( $( 'body' ).hasClass( 'exhibitors' ) ){
                $( '.view-menu-toggle li.exhibitors > a .item-selected' ).addClass( 'shown' ) ;
            }else if( $( 'body' ).hasClass( 'informations' ) ){
                $( '.view-menu-toggle li.informations > a .item-selected' ).addClass( 'shown' ) ;
            }else if( $( 'body' ).hasClass( 'schedule' ) ){
                $( '.view-menu-toggle li.schedule > a .item-selected' ).addClass( 'shown' ) ;
            }

            $( '.view-menu-toggle li.exhibitors > a' ).on( folha.salao.gui.click_touch_event_end, function( e ){
                if( location.pathname == $( this ).attr( 'href' ) ){
                    switch( $( this ).attr( 'href') ){
                        case '/exhibitors.html' :
                            folha.salao.screens.exhibitors.hide_details() ;
                            folha.salao.gui.hide_menu_view() ;
                        break ;

                        default:
                        break ;
                    }

                    e.preventDefault() ;
                    return false ;
                }else{
                    return true ;
                }
            } ) ;

        }

    },


    //is mobile or not
    is_mobile: function(){
        return ( Modernizr.touch ) ;
    },

    //set css ratchet on platform
    set_platform_ratchet: function( platform ){
        var that = this, an_pf = platform.toLowerCase() ;

        //add class to body
        $( 'body' ).addClass( an_pf ) ;

        //switch platform ratchet
        switch( an_pf ){
            case 'android':
            //Android
            $( '.set-ratchet' ).after( '<link rel="stylesheet" type="text/css" href="static/ratchet/css/ratchet-theme-android.css">' ) ;
            break;

            case 'ios':
            //iOS
            $( '.set-ratchet' ).after( '<link rel="stylesheet" type="text/css" href="static/ratchet/css/ratchet-theme-ios.css">' ) ;
            break;

            default:
            break;
        }

        //setTimeout( function() { $( 'body > .overlay' ).hide() }, 500 ) ;

        StatusBar.overlaysWebView( false ) ;
        StatusBar.backgroundColorByHexString( '#1A1A1B' ) ;
    },

    //set loading screen viewing
    loading_screen: function(){
        var that = this, overlay = $( 'body > .overlay' ), window_width = $( window ).width(), window_height = $( window ).height(), loading_tag = $( overlay.find( '.loading' ) ) ;

        overlay.css( 'width' , window_width ) ;
        overlay.css( 'height' , window_height ) ;

        loading_tag.css( 'top', ( ( window_height / 2 ) - 15 ) ) ;
        overlay.show() ;
    },

    //set kinda views
    links: function(){
        var that = this ;

        //rest
        $( 'a' ).on( folha.salao.gui.click_touch_event_start, function( e ) {
            if( $( this ).attr( 'href' ) != '#' ){
                //console.log( $( this ).attr( 'href' ) ) ;

                //location.replace( $( this ).attr( 'href' ) ) ;

                /*$.mobile.changePage( $( this ).attr( 'href' ), { transition: "slideup", changeHash: false } );

                $.mobile.navigate( $( this ).attr( 'href' ) );*/

                //$.mobile.pageContainer.pagecontainer( $( this ).attr( 'href' ), "target", {transition: "flow", changeHash: false, reload: true})

                //$( ":mobile-pagecontainer" ).pagecontainer( "load", $( this ).attr( 'href' ), { role: "page" } );

                //e.preventDefault();

                //return false ;

            }else{ return false ; }
        } ) ;

        //all go-back
        /*if( history.length > 2 ){
            $( '.go-back' ).click( function(){
                history.back() ;
            }) ;
        }*/
    },

    //init
    init: function() {
        var that = this, platform = ( ( typeof that.platform != 'undefined' ) ? that.platform : 'Desktop' ) ;

        //page_active ui-jquery mobile
        $( that.page_active ).addClass( that.gui.get_only_string_class( that.main_page ) ) ;

        //test console
        console.log( 'Console: Salão do Automóvel 2014 (Folha) | Device: ' + that.platform ) ; /*if platform exists*/

        //init()
        that.gui.set_includes() ;

        //after includes:
        setTimeout( function(){
            that.links() ;
        }, that.default_time_loading_trigger ) ;
    }

} ;

$( document ).on( "pageshow", function() {
    //init
    folha.salao.init() ;

    //modernizr - platform ( css )
    if( folha.salao.is_mobile() ) {
        //device ready
        document.addEventListener( "deviceready", function(){ folha.salao.set_platform_ratchet( 'android' ) ; }, false );

        //pause
        document.addEventListener( "pause", function(){ folha.salao.hide_menu_view() ; }, false);
    }

}) ;