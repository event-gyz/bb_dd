/**
 *
 * @title --场地搜索页
 * @authors yaojia
 * @date 2016-3-8 19:35:08
 *
 */

define(function(require,exports) {

  require('/js/page/place_seach/category_area.js');
  var PlaceMap= require('/js/page/place_seach/showmap.js');
   require('layer');
   layer.config({
    path:'http://links.eventown.com.cn/vendor/layer/'
   })

  require('cookie');

   //var Parabola = require('http://links.eventown.com.cn/js/moudle/parabola.js');


   /*
   *响应式地图
   */


var $main= $('#Jmain');

   function setMapAreaSize(){

        var winH=$(window).height();

        var winW = $(window).width();
        var mainW = $('.main-sidebar').outerWidth();
        var jmain = $('#Jmain').outerWidth();

        $topBarH=$('.main-header').height(),



   $main.height(winH-$topBarH);

    var w=winW-mainW-jmain;
    var h=winH-$topBarH;

    $('.sidebar22,#map').css({
        width:w-50,
        height:h
    })
   }

   setMapAreaSize()
   //加载地图
   PlaceMap.initMap()


   $(window).on('resize.map',setMapAreaSize)


   /*
   *绑定鼠标滑入list li
   */


   $('.place_list_box').on('mouseover','.place_list',function(){
        $(this).css({
            background:'#f8f8f8'
        })
        var i=$(this).index();
         PlaceMap.onover(i)

   })

   $('.place_list_box').on('mouseout','.place_list',function(){
    $(this).css({
            background:'#fff'
        })
        var i=$(this).index();
         PlaceMap.onout(i)

   })

    var cookieName="place_list_store";

    function addFav(dom) {
        $.ajax({
            type: "post",
            url: "/user/favourite",
            data: {
                'uc_id': GLO.uid,
                'place_id': dom.closest('.place_list').attr('data-placeid')
            }
        })
    }

    var animationEnd = true;

/*监听询单车的删除事件*/
// $(document).on('rm',function(e,id){
//    $('div[data-placeid='+id+']').find('.place_btn').removeClass('checked');
// });


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


//        var bool = Parabola.init({
//            el: el.find('.place_img'),
//            targetEl: '.enquiry-box',
//            curvature: 0.00012,
//            duration: 600,
//            callback: function() {
//                rollObj.fadeOut();
//                rollObj.css({
//                    'transform': 'translate(0,0)',
//                    "top": 'auto',
//                    "left": 'auto',
//
//                });
//                // cartListController.add(placeId, placeName);
//                animationEnd = true;
//            },
//            stepCallback: function(x, y) {
//                if (Modernizr.csstransforms) {
//                    cssRule = {
//                        'transform': 'translate(' + x + 'px,' + y + 'px)',
//                        "top": parseInt(this.elOriginalTop),
//                        "left": parseInt(this.elOriginalLeft),
//                    }
//                } else {
//                    cssRule = {
//                        "top": parseInt(this.elOriginalTop + y),
//                        "left": parseInt(this.elOriginalLeft + x)
//                    }
//                }
//
//                rollObj.css(cssRule)
//
//            }
//        });
//        bool.start();
//        return bool
    }


})

