/**
 * 
 * @title --场地搜索页
 * @authors yaojia
 * @date 2016-3-8 19:35:08
 * 
 */

define(function(require,exports) {


   require('/js/page/seach/category_area.js');
   require('layer');
   layer.config({
    path:'//links.eventown.com.cn/vendor/layer/'
   })

   require('cookie');

   var Parabola = require('//links.eventown.com.cn/js/moudle/parabola.js');


    var cookieName="place_list_store";



    //加入询单列表

    var $shopCart = $('#shopCart'),$shopCartUL= $shopCart.find('ul'),$placeCount=$('#placeCount');

    var place_list_arr =(function(){

     if($.type($.cookie(cookieName))==='undefined'){
        return []
     }
        var localArr=$.parseJSON($.cookie(cookieName)) ||[];

            if(localArr){
                //setDom
               var listHtml=''

                $.each(localArr,function(k,v){

                    $('div[data-placeid='+v.id+']').find('label.place_btn').addClass('checked ');

                     listHtml+='<li index="' + v.id + '" id="place-' + v.id + '">' + v.name + '<i id="'+v.id+'" class="rmlist icon iconfont">&#xe648;</i></li>'

                })

                $shopCartUL.html(listHtml);
                $placeCount.text(localArr.length)

            }
                return localArr
            

    })();




   

    //检查是否已选择

    function isPlaceSelected(placeid) {
        var is = false;
    
            $.each(place_list_arr,function(k,v){
                if(v.id==placeid){
                    is=true;
                    return is
                }
            })


        return is



    }

    var animationEnd = true;

    $('.place_list').delegate('label.place_btn', 'click', function(event) {
        event.preventDefault();
        var parent = $(this).closest('.place_list');
        var placeId = parent.attr('data-placeid');
        var placeName = parent.attr('placename');
        if (isPlaceSelected(placeId)) {
            $(this).removeClass('checked');
            cartListController.rm(placeId)

        } else {

                   if(!event.isTrigger){
                  if(place_list_arr.length>=5){
                  layer.msg('最多选择5家',{offset:60,shift:6});
                    return 
                }
        
        }


            if (animationEnd) {

                $(this).addClass('checked');

               create(parent, placeId, placeName);

            }



        }



    })



    var getOneInstace = (function() {
        var result;
        return function(fn) {
            return result || (result = fn.apply(this, arguments))
        }

    })()




    function create(el, placeId, placeName) {

   var rollObj = getOneInstace(function() {
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
            curvature: 0.00022,
            duration: 450,
            callback: function() {
                rollObj.fadeOut();
                rollObj.css({
                    'transform': 'translate(0,0)',
                    "top": 'auto',
                    "left": 'auto',

                });
                cartListController.add(placeId, placeName);
                animationEnd = true;
            },
            stepCallback: function(x, y) {
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
    var cartListController = (function() {

        var checkIdInPlacelist=function(id,callback){


                if(place_list_arr.length>0){
                    $.each(place_list_arr, function(k, v) {
                        if (v.id == id) {
                         return callback(true)
                        }
                       })
                    callback(false)
                }else{
                    callback(false)
                }
                       
        }


        var setCount = function(arr) {
            $('#placeCount').text(place_list_arr.length);

                var str = JSON.stringify(place_list_arr);
                $.cookie(cookieName, str, {
                    path: "/",
                    expires: 7 
                });

            }

        return {
            add: function(id, name) {

            
                checkIdInPlacelist(id,function(Is){
                    if(!Is){
                $('<li index="' + id + '" id="place-' + id + '">' + name + '<i id="'+id+'" class="rmlist icon iconfont">&#xe648;</i></li>').appendTo($shopCart.find('ul'));
                place_list_arr.push({
                    'id': id,
                    'name': name
                })
                setCount(place_list_arr);
                    }

                })

               
            },
            rm: function(id) {
                $('#place-' + id).remove()

                    if(place_list_arr.length>0){
                        $.each(place_list_arr, function(k, v) {
                            if ($.type(v)!=='undefined' && v.id == id) {
                                place_list_arr.splice(k, 1);
                            }

                        })
                    }

                  setCount(place_list_arr)

            },

            getResult: function(callback) {
                var placeIdArr = $.cookie(cookieName);
                // $shopCart.find('li').each(function(k, v) {
                //     placeIdArr.push($(v).attr('index'))
                // });
                callback(placeIdArr);
            }
           
        }


    })()

    //立即询单
    $shopCart.find('.place_btn').on('click', function() {

        cartListController.getResult(function(arr) {
           
        })
    })

    $shopCart.delegate('.rmlist','click',function(){
        var placeid=$(this).attr('id');
            //
            if($('#add-btn-'+placeid).size()>0 && $('#add-btn-'+placeid).hasClass('checked') ){

               $('#add-btn-'+placeid).trigger('click')

            }else{
                 cartListController.rm(placeid);
            }
    })


})

