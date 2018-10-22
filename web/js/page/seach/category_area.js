define(function(require, exports) {

    require('/js/tipso.js');

    require('http://links.eventown.com.cn/vendor/nprogress/nprogress.js');
    
    require('/js/moudle/search_autocomplete.js');


    $.fn.customInput = function() {
        return $(this).each(function() {
            if ($(this).is('[type=checkbox],[type=radio]')) {
                var input = $(this);
                var label = $('label[for=' + input.attr('id') + ']');
                input.add(label).wrapAll('<div class="custom-' + input.attr('type') + '"></div>');
                label.hover(
                    function() {
                        $(this).addClass('hover');
                    },
                    function() {
                        $(this).removeClass('hover');
                    }
                );
                input.bind('updateState', function() {
                        input.is(':checked') ? label.addClass('checked') : label.removeClass('checked checkedHover checkedFocus');
                    })
                    .trigger('updateState')
                    .click(function() {
                        $('input[name=' + $(this).attr('name') + ']').trigger('updateState');
                    })
                    .focus(function() {
                        label.addClass('focus');
                        if (input.is(':checked')) {
                            $(this).addClass('checkedFocus');
                        }
                    })
                    .blur(function() {
                        label.removeClass('focus checkedFocus');
                    });
            }
        });
    };


    $(document).ready(function() {



        $(".cityNav span").each(function(i) {
            $(this).on('click', function() {
                $(".cityNav span").removeClass('active')
                $(this).addClass('active')
                $('.cityLayer').find('.cityName').css('display', 'none')
                $('.cityLayer').find('.cityName').eq(i).fadeIn()
            });
        });
        $(".hotel_add li").each(function(i) {
            $(this).attr("num", i)
            var num = i;
            $(this).on('click', function() {
                $(this).siblings().removeClass('active')
                $(this).toggleClass('active');
                if (0 != num) {
                    if ($(this).hasClass('active')) {
                        $('.filter_body').css('display', 'block')
                        $('.filter_body').children('div').css('display', 'none')
                        $('.filter_body').children('div').eq(i).css('display', 'block')
                    } else {
                        $('.filter_body').css('display', 'none')
                        $('.filter_body').children('div').css('display', 'none')
                    }
                } else {
                    $(this).toggleClass('active', true);
                    $('.filter_body').css('display', 'none')
                }
            });
        });


        $(".metro_Line_head li").each(function(i) {
            $(this).on('click', function() {
                $(".metro_Line_head li").removeClass('active')
                $(this).addClass('active')
                $('.metro_Line_box').find('div.metro_Line').css('display', 'none')
                $('.filter_body').find('div.metro_Line').eq(i).fadeIn()
            });
        });


        //选择城市
        $('.toCity').on('click', function(event) {
            //取消事件冒泡  
            event.stopPropagation();
            //按钮的toggle,如果div是可见的,点击按钮切换为隐藏的;如果是隐藏的,切换为可见的。  
            $('.cityLayer').toggle();
            return false;
        });


        //点击空白处隐藏弹出层，下面为滑动消失效果和淡出消失效果。
        $(document).on('click', function(event) {
            var _con = $('.cityLayer'); // 设置目标区域
            if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
                $('.cityLayer').hide(); //淡出消失
            }
        });

        $(".cityName li").on('click', function() {
            $(".toCity span").html($(this).html())
            $(".cityLayer").hide()
        })
        $('.place li a').on('click', function() {
            $('.place li a').parents('li').removeClass('on')
            $(this).parents('li').addClass('on')
            var that = $(this)
            that.siblings("i").on('click', function() {
                that.parents('li').removeClass('on')
            })
        });
        $('.filter_area input').customInput();

        var onoff = true;

        $(".filter_more").on('click', function() {
            $("#search_hide").toggle();
            var flag = $(this).attr('flag');
            if (flag == 'open') {
                $(this).attr('flag', 'colse');
                $("#filter_more_link").html('展开筛选<i class="icon iconfont">&#xe62f;</i>');
            } else {
                $(this).attr('flag', 'open');
                $("#filter_more_link").html('收起筛选<i class="icon iconfont">&#xe62e;</i>')
            }

        })
        $(".filter_hotel .more").click(function() {
            var flag = $(this).data('flag');
            if (flag == 'open') {
                $(this).data('flag', 'colse');
                $(this).html('<i class="icon iconfont">&#xe606;</i>')
            } else {
                $(this).data('flag', 'open');
                $(this).html('<i class="icon iconfont">&#xe607;</i>')
            }
            $(this).siblings('ul').toggleClass('height_auto');
        })

        $('.tip').tipso()


        //公司位置
        basicSingle.on("select2:close", function (e) {

            var value = $(this).val().split('-');
            var obj = {};
            obj['location'] = value[0];
            obj['subcompany'] = value[1];
            obj['city_id'] = value[2];
            console.log(obj);
            go(obj);
            //go({ subcompany: $('#subcompany').val() });
        });

        $('.options').on('click', function() {
            var param = $(this).data('param');
            var value = $(this).data('value');
            var obj = {};
            obj[param] = value;
            go(obj);
        });
        $('.search-btn').on('click', function() {
            var key_words = $('.searchInput').val();
            go({ key_words: key_words });
        });
        $('.searchInput').on('keydown', function(e) {
            if (e.keyCode == 13) {
                $('.search-btn').trigger('click');
            }
        })
        $('.cityName').on('click', 'li', function() {
            param = {};
            go({ city_id: $(this).data('city_id') });
        });
        $('#option_revoke').on('click', function() {
            param = {};
            go({ city_id: param.city_id });
        });
        $('.place_tab02,.place_tab03,.place_tab04,.place_tab05,.place_tab06').on('click', 'li', function() {
            go({ position: $(this).data('position') });
        });



        var getJumpUrl = (function() {
            var url = ''
            if (typeof GLOBAL.page_name != 'undefined' && GLOBAL.page_name == 'min_search') {
                return url = '/tuanfang/search/index?'
            } else {
                return url = '/tuanfang/search/index?'
            }
        })()

        function go(data) {
            NProgress.start();
            param = $.extend(param, data,{'id':GLOBAL.id,'type':GLOBAL.type});
            
            var paramArr = new Array();
            $.each(param, function(k, v) {
                paramArr.push(k + '=' + v);
            });
            location.href = getJumpUrl + paramArr.join("&");
            NProgress.set(0.99)

        }


    })


})
