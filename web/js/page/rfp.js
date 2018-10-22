/*
*询单页面

*/

define(function(require, exports, module) {
    require('');
    require('/js/messages_zh.min.js');
    var cookieName = "place_list_store";
    layer.config({
        path: 'http://links.eventown.com.cn/vendor/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    require('Handlebars');
    require('cookie');
    Handlebars.registerHelper("compare", function(v1, v2, options) {
        if (v1 == v2) {
            //满足添加继续执行
            return options.fn(this);
        } else {
            //不满足条件执行{{else}}部分
            return options.inverse(this);
        }
    });


    //注册一个翻译用的Helper，1翻译成一个start，2翻译成2个
    Handlebars.registerHelper("transformat", function(value) {
        var star = '<i class="icon iconfont">&#xe630;</i>',
            result = '';
        var num = parseInt(value);
        for (var i = 0; i < num; i++) {
            result += star
        }
        return result
    });



    //读取cookie 请求接口 渲染dom

    var getPlaceIdFromCookie = function() {

        var localplaceArr, idArr;
        if ($.cookie(cookieName) === 'undefined' || $.type($.cookie(cookieName)) !== 'string') {
            return []
        }

        localplaceArr = $.parseJSON($.cookie(cookieName))
            //只取cookie里的ID
        idArr = $.map(localplaceArr, function(n) {
            return n.id;
        })


        return idArr

    }
    var $container = $('.bus_list'); //容器

    var randerPlaceList = function() {

        if (getPlaceIdFromCookie().length <= 0) {

            return $container.html('您未添加意向商家')

        }

        $.post('/place/batch_get_place_info', { 'place_ids': getPlaceIdFromCookie() }, function(res) {
            res = $.parseJSON(res);
            // console.log(res.data);
            var source = $('#template-place-list').html();
            var template = Handlebars.compile(source);
            var resdata = [{ 'place_name': 'ssss' }, { 'place_name': 'ddddd' }, { 'place_name': 'fffff' }];
            var result = template(res.data);
            $container.html(result)
        })

    }



    //点击添加商家

    $('#add_bus').on('click', function() {

        var searchWin = layer.open({
            type: 2,
            title: '选择商家',
            shadeClose: true,
            shade: 0.8,
            // offset: 'rc',
            maxmin: true,
            area: ['980px', '600px'],
            shift: 2,
            content: '/place/min_search', //iframe的url
            success: function(layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // console.log(body.html()) //得到iframe页的body内容
            },
            btn: ['选好了', '取消'],
            yes: function(index, layero) { //或者使用btn1
                //按钮【按钮一】的回调
                $container.html('更新中...')
                randerPlaceList();
                layer.close(index); //如果设定了yes回调，需进行手工关闭       
            },

            no: function(index, layero) {
                layer.close(index); //如果设定了yes回调，需进行手工关闭

            }
        });
    })

    randerPlaceList();

    // $('.eq_panel-body').delegate('.bus_list li', 'mouseenter', function() {
    //     $(this).siblings().removeClass('active')
    //     $(this).addClass('active')
    // })




    $('#sendCode').on('click', send_code)

    function send_code() {
        var phoneMobile = $('#phoneMobile').val();
        if (phoneMobile == '') {
            layer.msg('手机号请勿为空');
            return;
        }
        var mobileRule = /^(1[3-9])\d{9}$/;
        if (!mobileRule.test(phoneMobile)) {
            layer.msg('请输入有效的手机号码！');
            return false;
        }
        time2End($('#sendCode'))

        $.get(
            codeurl, {
                'phone': $('#phoneMobile').val()
            },
            function(data) {
                var str = JSON.parse(data);
                if (str.errorno) {
                    layer.msg(str.message);
                } else {
                    layer.msg('发送成功');

                    time2End($('#sendCode'))


                }
            }
        );
    }

    //hepler

    function time2End($sendBtn) {
        $sendBtn.text(120 + '秒后重新发送');
        $sendBtn.attr('disabled', 'disabled');
        var i = 120;
        var timer = setInterval(function() {
            i--;
            $sendBtn.text(i + '秒后重新发送');
            if (i <= 0) {
                clearInterval(timer);
                $sendBtn.attr('disabled', false).text('重发验证码')
            }
        }, 1000)
    }


    //检测是否选择场地
    $('#saveRfp').on('click', saveRfp)

    function saveRfp() {
        
            if (getPlaceIdFromCookie().length <= 0) {
                //询问框
                var cf = layer.confirm('没有选择商家,是否发送？', {
                    btn: ['发送', '不发送'] //按钮
                }, function() {
                    $('#commentForm').submit();
                     layer.close(cf)
                }, function() {

                });

            } else {
                $('#commentForm').submit();
            }
    }



    // 折叠收起面板

    $.fn.accordion = function() {
        $(this).each(function(k, elment) {
            var trigger = $(elment).find('.accordion-title');
            trigger.on('click', function() {
                $(this).toggleClass('active');
                $(this).parent().find('.accordion-content').slideToggle().toggleClass('active');
            })
        })
    }


    $(document).ready(function() {
        $('[data-role="accordion"]').accordion();

    })
    function setname(){
        var company_name = $('.select_company').find("option:selected").text();
        $('input[name=company_name]').val(company_name);
    }

    setname();

    $('.select_company').change(function() {
        setname();
    });
});
