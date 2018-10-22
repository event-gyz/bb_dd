/**
 * 
 * @title --场地搜索页
 * @authors yaojia
 * @date 2016-3-8 19:35:08
 * 
 */

define(function (require, exports) {
    require('/js/page/category_area.js');
    require('layer');
    layer.config({
        path: '//links.eventown.com.cn/vendor/layer/'
    })

    require('cookie');

    var Parabola = require('//links.eventown.com.cn/js/moudle/parabola.js');

    //var cookieName = "yrfp_place";
    //加入询单列表
    var $shopCart = $('#shopCart'), $shopCartUL = $shopCart.find('ul'), $placeCount = $('#placeCount');
    var place_list_arr = (function () {
        if ($.type($.cookie(cookieName)) === 'undefined') {
            return []
        }
         var localArr;
        if($.cookie(cookieName)){
               localArr =$.parseJSON($.cookie(cookieName));
        }else{
            localArr=[]
        }


        if (localArr) {
            //setDom
            var listHtml = ''

            $.each(localArr, function (k, v) {

                $('div[data-placeid=' + v.id + ']').find('label.place_btn').addClass('checked ');

                listHtml += '<li index="' + v.id + '" id="place-' + v.id + '">' + v.name + '<i id="' + v.id + '" class="rmlist fa fa-times"></i></li>'

            })

            $shopCartUL.html(listHtml);
            $placeCount.text(localArr.length)

        }
        return localArr


    })();



    (function(){
        var wH=$(window).height();
        var nH=$('.main-header').height();
        var fH=$('.footer').height();
        $('.box').height(wH-nH-fH).css('overflow','hidden');
        $('#mapElment').height(wH-nH-fH);
        $('.select-business').height(wH-nH-fH).css({'overflow-y':'auto','overflow-x':'hidden'})
        
        $(window).resize(function(){
            var sH=$(window).height();
            $('.box').height(sH-nH-fH).css('overflow','hidden');
            $('#mapElment').height(sH-nH-fH);
            $('.select-business').height(sH-nH-fH).css({'overflow-y':'auto','overflow-x':'hidden'})
        })
    })()


     var MapObj={
        dataList:GLOBAL.place_geo_data,
        markerArr:[],
        IMG_BASEURL: 'http://links.eventown.com.cn/images/icon/',
        createmap:function(id){
            return new BMap.Map(id); 
        },
        showMap:function(id){
            this.map=this.createmap(id);
            // this.dataList=dataList;
            var point = new BMap.Point(this.dataList[0].lng, this.dataList[0].lat);  // 创建点坐标  
            this.map.centerAndZoom(point, 15);
            this.map.addControl(new BMap.NavigationControl());
            this.map.enableScrollWheelZoom(true);
            this.addIcon();
        },
        addIcon:function(){
            var pointsArr=[];
            for(var i=0; i<this.dataList.length; i++){
                var pt = new BMap.Point(this.dataList[i].lng, this.dataList[i].lat);
                var myIcon = new BMap.Icon(this.IMG_BASEURL+ "blue_" + (i + 1) + ".png", new BMap.Size(56,56));
                var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
                pointsArr.push(pt);

                var _this=this;
                marker.addEventListener('mouseover',(function(marker,i){
                    // i表示哪个icon
                    return function() {
                        MapObj.showTips(marker,i);
                    }
                })(marker,i))

                marker.addEventListener('mouseout',(function(marker,i){
                    return function() {
                        MapObj.hideTips(marker,i)
                    }
                })(marker,i))
                this.markerArr.push(marker);
                this.map.addOverlay(marker);  
            }
            this.map.setViewport(pointsArr);
        },
        showTips:function(marker,i){
            var myIcon = new BMap.Icon(MapObj.IMG_BASEURL + "orange_" + (i + 1) + ".png", new BMap.Size(56, 56));
            var myIconblue = new BMap.Icon(MapObj.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56));
            marker.setIcon(myIcon); //设置icoon的图片


            var tipsPos = this.map.pointToPixel(marker.getPosition());

            // var LayerWidth = $(".tips").outerWidth();

            $('.tips' + (i + 1)).on('mouseenter', function() {
                $(this).show()
                marker.setIcon(myIcon);
            })

            $('.tips' + (i + 1)).on('mouseleave', function() {
                $(this).hide()
                marker.setIcon(myIconblue);

            })

            $('.tips' + (i + 1)).show().css({ "top": tipsPos.y + 5, "left": tipsPos.x - 5 })

        },
        hideTips:function(marker,i){
            var myIcon = new BMap.Icon(this.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56));
            marker.setIcon(myIcon);
            $('.tips' + (i + 1)).hide()
        },
        onover: function(i) {
            var _this=this;
            var myIcon;
            var myIcon = (function(){
                return myIcon || (myIcon=new BMap.Icon(_this.IMG_BASEURL + "orange_" + (i + 1) + ".png", new BMap.Size(56, 56)))
            })()
           
            this.markerArr[i].setIcon(myIcon);
        },
        onout: function(i) {
            var myIcon = new BMap.Icon(this.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56));
            this.markerArr[i].setIcon(myIcon);
        },
        removeLogo: function() {
            window.setTimeout(function() {
                if ($('.anchorBL').size() > 0) {
                    $('.anchorBL').hide()
                } else {
                    arguments.callee()
                }
            }, 100)
        }
    }

    MapObj.showMap('mapElment');

    $('.place_list').on('mouseover',function(){
        $(this).css('backgroundColor','#f8f8f8');
        var index=$(this).index();
        MapObj.onover(index)
    }).on('mouseout',function(){
        $(this).css('backgroundColor','#fff');
        var index=$(this).index();
        MapObj.onout(index)
    })
    



    //检查是否已选择

    function isPlaceSelected(placeid) {
        var is = false;
        $.each(place_list_arr, function (k, v) {
            if (v.id == placeid) {
                is = true;
                return is
            }
        })
        return is
    }

    var animationEnd = true;
    var selectedArr=[];
    $('label.place_btn').each(function(){
        if($(this).hasClass('checked')){
            selectedArr.push('true');    
        }
    })

    if($('label.place_btn').length == selectedArr.length){
        $('#mycheckbox').addClass('checked');
    }

    $('#mycheckbox').click(function(){
        if($(this).hasClass('checked')){
                // 全选按钮选中时
            $(this).removeClass('checked');
            $('label.place_btn').each(function(){
                if($(this).hasClass('checked')){
                    $(this).trigger('click')
                }
            })
        }else{
            // 全选按钮未选中时
            $(this).addClass("checked");
            $('label.place_btn').each(function(n,el){
                if(!$(el).hasClass('checked')){
                    animationEnd=true;
                    $(el).trigger('click');
                }                
            })
        }
    })


    // $('.place_list').delegate('label.place_btn', 'click.all', function (event) {
    //      event.preventDefault();
    //     var parent = $(this).closest('.place_list');
    //     var placeId = parent.attr('data-placeid');
    //     var placeName = parent.attr('placename');
    //     if (isPlaceSelected(placeId)) {
    //         $(this).removeClass('checked');
    //         cartListController.rm(placeId)

    //     } else {

    //         $(this).addClass('checked');

    //         create(parent, placeId, placeName);
    //     }
    // })

    $('.place_list').delegate('label.place_btn', 'click', function (event) {
        event.preventDefault();
        if( $(this).hasClass('isSelected') ){
            return false;
        }
        var parent = $(this).closest('.place_list');
        var placeId = parent.attr('data-placeid');
        var placeName = parent.attr('placename');
        if (isPlaceSelected(placeId)) {
            $(this).removeClass('checked');
            cartListController.rm(placeId)

        } else {

            /*if (!event.isTrigger) {
                if (place_list_arr.length >= 5) {
                    layer.msg('最多选择5家', {offset: 60, shift: 6});
                    return
                }

            }*/


            if (animationEnd) {

                $(this).addClass('checked');

                create(parent, placeId, placeName);

            }



        }



    })



    var getOneInstace = (function () {
        var result;
        return function (fn) {
            return result || (result = fn.apply(this, arguments))
        }

    })()




    function create(el, placeId, placeName) {

        var rollObj = getOneInstace(function () {
            var $div = $('<div id="rollobj">');

            $div.css({
                "position": "fixed",
                "background-color": "#c00",
                "width": "50px",
                "height": "50px",
                "border-radius": "50%",
                "z-index": 9999
            }).appendTo($('body'))

            return $div

        })


        animationEnd = false;

        rollObj.html(el.find('.place_img').html()).show();


        var bool = Parabola.init({
            el: el.find('.place_img'),
            targetEl: '#shopCart',
            curvature: 0.00012,
            duration: 450,
            callback: function () {
                rollObj.fadeOut();
                rollObj.css({
                    'transform': 'translate(0,0)',
                    "top": 'auto',
                    "left": 'auto',
                });
                cartListController.add(placeId, placeName);
                animationEnd = true;
            },
            stepCallback: function (x, y) {
                if (Modernizr.csstransforms) {
                    cssRule = {
                        'transform': 'translate(' + x + 'px,' + y + 'px)',
                        "top": parseInt(this.elOriginalTop),
                        "left": parseInt(this.elOriginalLeft),
                    }
                } else {
                    cssRule = {
                        "top": parseInt(this.elOriginalTop + y),
                        "left": parseInt(this.elOriginalLeft + x)
                    }
                }

                rollObj.css(cssRule)

            }
        });
        bool.start();
        return bool
    }

    //场地选择列表
    var cartListController = (function () {

        var checkIdInPlacelist = function (id, callback) {


            if (place_list_arr.length > 0) {
                $.each(place_list_arr, function (k, v) {
                    if (v.id == id) {
                        return callback(true)
                    }
                })
                callback(false)
            } else {
                callback(false)
            }

        }


        var setCount = function (arr) {
            $('#placeCount').text(place_list_arr.length);

            var str = JSON.stringify(place_list_arr);
            $.cookie(cookieName, str, {
                path: "/",
                expires: 7
            });

        }

        return {
            add: function (id, name) {
                checkIdInPlacelist(id, function (Is) {
                    if (!Is) {
                        $('<li index="' + id + '" id="place-' + id + '">' + name + '<i id="' + id + '" class="fa rmlist fa-times"></i></li>').appendTo($shopCart.find('ul'));
                        place_list_arr.push({
                            'id': id,
                            'name': name,
                            'type': GLOBAL.type
                        })
                        setCount(place_list_arr);
                    }
                })
            },
            rm: function (id) {
                $('#place-' + id).remove()

                if (place_list_arr.length > 0) {
                    $.each(place_list_arr, function (k, v) {
                        if ($.type(v) !== 'undefined' && v.id == id) {
                            place_list_arr.splice(k, 1);
                        }

                    })
                }

                setCount(place_list_arr)

            },
            getResult: function (callback) {
                var placeIdArr = $.cookie(cookieName);
                // $shopCart.find('li').each(function(k, v) {
                //     placeIdArr.push($(v).attr('index'))
                // });
                callback(placeIdArr);
            }

        }


    })()

    //立即询单
    $shopCart.find('.place_btn').on('click', function () {

        cartListController.getResult(function (arr) {

        })
    })

    $shopCart.delegate('.rmlist', 'click', function () {
        var placeid = $(this).attr('id');
        //
        if ($('#add-btn-' + placeid).size() > 0 && $('#add-btn-' + placeid).hasClass('checked')) {

            $('#add-btn-' + placeid).trigger('click')

        } else {
            cartListController.rm(placeid);
        }
    })




})

