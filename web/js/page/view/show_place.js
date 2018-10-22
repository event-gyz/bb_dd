define(function(require, exports) {
    require('Handlebars');
    require('/js/vendor/jquery-spinner/jquery.spinner.js')
    require('/js/laydate/laydate.js')

   var shopCartManage = require('/js/moudle/rfp_cart_manage.js')

   shopCartManage.init('#shopCartBox')

    var roomData;

    Handlebars.registerHelper('formatBreakfast', function(val, options) {
        if (val == 1) {
            return '单早'
        }
        if (val == 2) {
            return '双早'
        }
        return '无早'
    });

    Handlebars.registerHelper('computed',function(v1,v2){

        return v1 - v2

    })


    Handlebars.registerHelper("saveIndex", function(index) {
        this._index = index;
        return this._index;
    });


    function changePrice(el, value) {
        var rootIndex = el.attr('data-root-index');
        var roomIndex = el.attr('data-index');

        var price_list = roomData.room_list[rootIndex].room_info[roomIndex].price_list;
        roomData.room_list[rootIndex].room_info[roomIndex].number=value;
        var countArr = []
        for (var k in price_list) {
            countArr.push(price_list[k].RoomCount)
        }
        countArr.push(value);
        countArr.sort(function(a, b) {
            return a > b
        });
        var index = countArr.lastIndexOf(value) - 1;
        var c_price = price_list[index].Price

        var PrePayDiscount = price_list[index].PrePayDiscount
        el.parents('.room_info_item').find('.price').text(c_price-PrePayDiscount)

        if (PrePayDiscount == 0) {
            el.parents('.room_info_item').find('.minus').html('').hide()
        } else {
            el.parents('.room_info_item').find('.minus').show().html('<i class="minus-icon">立减</i>' + PrePayDiscount + '元/间')
        }

    }

    function listenSpiner() {
        $('.spinner-input').on('update', function(e, el, val) {
            changePrice(el, val)
        })
    }


    function getData(url, cb) {
        function randerDom(data) {
            var source = $("#room-template").html();
            var template = Handlebars.compile(source);
            $('#rooms').html(template(data));
            roomData = data;
            cb && cb.call(this, arguments)
            bingEvt()
        }
        $.getJSON(url, function(res) {
            if (res.errorno == 0 && res.data.room_list.length > 0) {

                randerDom(res.data)
            }else{
                $('#rooms').html('很抱歉，暂无房间数据<br/><br/>')
            }
        })
    }

    //加载抛物线模块
    var Parabola = require('//links.eventown.com.cn/js/moudle/parabola.js');

    var getOneInstace = (function() {
        var result;
        return function(fn) {
            return result || (result = fn.apply(this, arguments))
        }
    })()

    var csstransforms = (function() {
        var style = document.body.style || document.documentElement.style
        var transEndEventNames = {
            transform: 'transform',
            WebkitTransform: 'webkitTransform',
            MozTransform: 'mozTransform',
            OTransform: 'oTransform oTransform'
        }
        for (var name in transEndEventNames) {
            if (typeof style[name] === 'string') {
                return transEndEventNames[name]
            }
        }
        return false

    })()


    var getCssRule=(function(){

                if (csstransforms) {
                   return function(o,x,y){
                    var cssRule = {
                        "top": parseInt(o.elOriginalTop),
                        "left": parseInt(o.elOriginalLeft)
                    }
                    cssRule[csstransforms] = 'translate(' + parseInt(x) + 'px,' + parseInt(y) + 'px)';
                    return cssRule
                }

                } else {
                    return function(o,x,y){

                    return {
                        "top": parseInt(o.elOriginalTop + y),
                        "left": parseInt(o.elOriginalLeft + x)
                    }
                }
                }

            })()


    // 创建抛物线
    function createParabola(el) {


        var rollObj = getOneInstace(function() {
            var $div = $('<div id="rollobj">');
            $div.css({
                "position": "fixed",
                "background-color": "#c00",
                "width": "50px",
                "height": "50px",
                "border-radius": "50%",
                "z-index": 9999,
                "overflow": 'hidden'
            }).appendTo($('body'))

            return $div

        })
        animationEnd = false;
        rollObj.html(el.find('.pic-box img').clone()).show();
        var bool = Parabola.init({
            el: el.find('.pic-box'),
            targetEl: animatTarget,
            curvature: 0.00100,
            duration: 500,
            callback: function() {
                rollObj.fadeOut();
                rollObj.css({
                    'transform': 'translate(0,0)',
                    "top": 'auto',
                    "left": 'auto',

                });
             $('<span class="num_add">+1</num>').appendTo($('.floatBtn')).animate({
                top:-50,
                opacity:0
             },function(){
                $(this).remove()
             })
                animationEnd = true;
                bool = null
            },
            stepCallback: function(x, y) {
                 rollObj.css(getCssRule(bool,x,y))
            }
        });
        bool.start();
    }

    //view页面加入购物车效果
    var animatTarget = $('.elevator-cart')

    var ShopCartControl = {
        addEvt: function(e) {

            if(shopCartManage.data.length>=10){
                layer.msg('亲，购物车最多可添加10件商品哦')
                return
            }
            var el = e.target;
            $(el).toggleClass('disabled');

        var rootIndex =  $(el).attr('data-root-index');
        var roomIndex =  $(el).attr('data-index');
        
        var roomItem=roomData.room_list[rootIndex].room_info[roomIndex];
            roomItem.checkin=roomData.checkin;
            roomItem.checkout=roomData.checkout;
            roomItem.number=$(el).parents('.room_info_item').find('.spinner-input').val();
            roomItem.price=$(el).parents('.room_info_item').find('.price').text();
            roomItem.place_id=roomData.place_id;
            roomItem.place_name=roomData.place_name;
            roomItem.house_type=roomData.room_list[rootIndex].house_type;

        var parent = $(el).closest('.room_list_item'); //按钮最外层div
            createParabola(parent);

        //   var roomItem= {
        //     'room_id':'5092311',
        //     'place_id':'place_id',
        //     'place_name':'place_name',
        //     'house_type':'house_type',
        //     'bed_type':'bed_type',
        //     'breakfast':'breakfast',
        //     'number':'number',
        //     'price':'price',
        //     'checkin':'checkin',
        //     'checkout' :'checkout',
        //     'pic_url' :"pic_url",
        //      'price_list':'price_list'
        // }


        shopCartManage.addRoom(roomItem);



        }

    }



    function bingEvt() {

        $(document).on('click', '.pic-box', function() {
            $('#' + $(this).attr('data-target')).toggle()
        })
        $(document).on('click', '.btn-hide', function() {
            $(this).parent().slideUp('fast')
        })
        $('.spinner-input').spinner({ min: 1 })
        listenSpiner();

        $(document).on('click', '.add_to_rpc_cart_btn', ShopCartControl.addEvt)


    }


    exports.init = function(url, cb) {
        getData(url, cb)
    }

})
