define(function(require, exports) {
    require('layer');
    layer.config({
        path: 'http://links.eventown.com.cn/vendor/layer/'
    })
    require('/js/tipso.js');

    window.isRoom=true;
    window.isPlace=false;


    // 会场详情tips
    $('.tip').each(function() {
        var $con = $(this).siblings('div.pro_tips_layer').html();
        $(this).tipso({
            useTitle: false,
            width: 320,
            content: $con,
            delay: 0
        });
    })


    //IE10+ blur            
    if (typeof document.msHidden != "undefined") {
        [].slice.call(document.querySelectorAll(".cover img")).forEach(function(img) {
            img.classList.add("hidden");

            var myImage = new Image(),
                src = img.src;
            img.insertAdjacentHTML("afterend", '<svg class="blur" width="100%" height="394">\
            <image xlink:href="' + src + '" src="' + src + '" width="100%" height="394" y="0" x="0" filter="url(#blur)" />\
        </svg>');
        });
    }

    //跟随导航
    var onOff = true;
    var len = $('#pro_table_hotel tr').length
    var trShow = $('#pro_table_hotel tr:gt(3)')
    var proIndex = {
        Init: function() {
            proIndex.bind.moreHotel();
            proIndex.bind.mapInfoTab();
            proIndex.bind.albumLayer();
            proIndex.bind.selectPhoto()
            proIndex.bind.tabPhoto()
        }
    };
    proIndex.bind = {
        moreHotel: function() { //控制会场详情显示隐藏
            if (len > 4) {
                trShow.addClass('hide')
            }
            $(".pro_table_more a").click(function() {
                trShow.toggleClass('hide');
                // _top = setTop()
                if (onOff) {
                    $(this).html('收起更多会场 <i class="icon iconfont">&#xe62e;</i>')
                    onOff = false
                } else {
                    $(this).html('展开更多会场 <i class="icon iconfont">&#xe62f;</i>')
                    onOff = true
                }
            })
        },
        RightNav: function() {
            _top = setTop()
            $(window).scroll(function() {
                var top = $(window).scrollTop();
                if ($(this).scrollTop() > $('#f1').offset().top - 70) {
                    $(".pro_subNav").addClass('fixed');
                } else {
                    $(".pro_subNav").removeClass('fixed')
                }
                for (i = 0; i < _top.length; i++) {
                    top > _top[i] && $('.pro_subNav').find('li').eq(i).addClass('active').siblings().removeClass('active');
                }
            });
        },
        clickNav: function() {
            $(".pro_subNav a").click(function() {
                var $this = $(this);
                var o = {
                    "Btn1": "#f1",
                    "Btn2": "#f2",
                    "Btn3": "#f3",
                    "Btn4": "#f4",
                    "Btn5": "#f5",
                    // "Btn6": "#f6"
                }
                var id = eval('o.' + $this.attr("class"));
                proIndex.func.Scroll($(id));
            });
        },
        mapInfoTab: function() {
            $(".pro_map_title span").each(function(i) {
                $(this).click(function() {
                    $(".pro_map_title span").removeClass('active')
                    $(this).addClass('active')
                    $('.pro_map_con>div').css('display', 'none')
                    $('.pro_map_con>div').eq(i).css('display', 'block')
                });
            });
        },
        albumLayer: function() {
            $(".pro_b_r li").click(function() {
                layer.open({
                    title: false,
                    type: 1,
                    closeBtn: 0,
                    area: ['900px', 'auto'],
                    shift: 2,
                    scrollbar: false,
                    shadeClose: true, //开启遮罩关闭
                    content: $('.photo_main')
                });
            });
        },
        tabPhoto: function() {
            $(".photo_tit li").each(function(i) {
                $(this).find('a').click(function() {
                    $(".photo_tit li").removeClass('active')
                    $(this).parent().addClass('active')
                    $('.photo_con').css('display', 'none')
                    $('.photo_body').find('div.photo_con').eq(i).fadeIn()
                });
            })
        },
        selectPhoto: function() {
            $(".photo_con").each(function() {
                $(this).find('.photo-l li').each(function(i) {
                    $(this).click(function() {
                        $(this).siblings().removeClass('active')
                        $(this).addClass('active')
                        $(this).parents('.photo-l').siblings('.photo-r').find('li').css('display', 'none')
                        $(this).parents('.photo-l').siblings('.photo-r').find('li').eq(i).fadeIn()
                    });
                });
            })
        }
    };


    $(document).ready(function() {
        proIndex.Init();
        // 关注
        function addFav(dom) {
            $.ajax({
                type: "post",
                url: "/user/favourite",
                data: {
                    'uc_id': GLO.uid,
                    'place_id': $('#palce_name').attr('data-placeid')
                }
            })
        }

        $(".place_score").bind("click", function() {
            if (GLO.uid === 'null' || typeof GLO.uid === 'undefined') {
                layer.msg('请先登录!');
                return;
            }

            if ($(this).hasClass('success')) {
                layer.msg('取消关注成功')

            } else {
                layer.msg('关注成功')

            }

            $(this).toggleClass('success');
            addFav($(this))

        })

    });


    //加载百度地图中心点

    var start = new BMap.Point(CURRENT_PLACE.split(',')[1], CURRENT_PLACE.split(',')[0]);
    var map = new BMap.Map("placeMap");
    map.centerAndZoom(start, 11);
    map.enableScrollWheelZoom(true);
    // console.log('start', start);

    var marker = new BMap.Marker(start); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画


    var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];

    function draw(end) {
        map.clearOverlays();
        var driving = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true
            },
            policy: routePolicy[1]
        });
        driving.search(start, end);
    }
    $('.pro_map_con dl').on('click', function() {;
        var dataend = $(this).attr('data-location').split(',');
        var endPoint = new BMap.Point(dataend[1], dataend[0])
        draw(endPoint)

    })


    //显示全景地图。

    function showpanoramaMap() {

        layer.open({
            type: 1,
            title: $('#palce_name').text() + '全景地图',
            skin: 'layui-layer-rim', //加上边框
            area: ['1160px', '625px'], //宽高
            content: '<div id="innerPanoramaMap" style="width:100%;height:570px"> <span style="padding:20px;display:block">全景地图加载中...</span></div>',
            success: function(layero, index) {
                if (panorama) {
                    return
                }
                var panorama = new BMap.Panorama('innerPanoramaMap');
                var point = new BMap.Point(CURRENT_PLACE.split(',')[1], CURRENT_PLACE.split(',')[0])

                panorama.setPosition(point);
                var labelPosition = point
                var labelOptions = {
                    position: labelPosition,
                    altitude: 5
                }; //设置标注点的经纬度位置和高度
                var label = new BMap.PanoramaLabel($('#palce_name').text(), labelOptions);
                panorama.addOverlay(label); //在全景地图里添加该标注
                panorama.setPanoramaPOIType(BMAP_PANORAMA_POI_INDOOR_SCENE); //室内景点

            }
        });
    }

    $('#panoramaMap').on('click', showpanoramaMap)



    /*****新增包房业务代码*****/
function GetRequest(id) { 
        var url = location.search; //获取url中"?"符后的字串 
        var theRequest = new Object(); 
        if (url.indexOf("?") != -1) { 
          var str = url.substr(1); 
          strs = str.split("&"); 
          for(var i = 0; i < strs.length; i ++) { 
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
          } 
        } 
        return  theRequest[id] ? theRequest[id] : null 
      } 



    function showTab() {
        $('#viewTabs').find('li').on('click', function() {
            $(this).siblings().removeClass('on');
            $(this).addClass('on')
            $('.price_container').hide();
            $('#' + $(this).attr('name')).show();
        })
    }

showTab()


    $('li[name="rooms"]').trigger('click')

    var roomData;
    var show_room = require('/js/page/view/show_room.js')
    //请求房间数据渲染模板添加到dom
    show_room.init('/tuanfang/search/get-list?place_id='+GLO.place_id)
    //显示购物车
    $('.elevator-cart,#shopCartBox').on('mouseenter',function(){
        $('#shopCartBox').css({
            opacity:1,
            transform: 'scale(1)'
        })
    })

     $('.elevator-cart,#shopCartBox').on('mouseleave',function(){
        $('#shopCartBox').css({
            opacity:0,
            transform: 'scale(0.1)'
        })
    })

 

    /*****新增包房业务代码*****/

})


$(function() {
    'use strict';

    $.fn.toTop = function(opt) {

        //variables
        var elem = this;
        var win = $(window);
        var doc = $('html, body');

        //Extended Options
        var options = $.extend({
            autohide: true,
            offset: 420,
            speed: 500,
        }, opt);

        elem.css({
            'cursor': 'pointer'
        });

        if (options.autohide) {
            elem.css('display', 'none');
        }

        if (options.position) {
            elem.css(
                'display', 'block'
            );
        }

        elem.click(function() {
            doc.animate({ scrollTop: 0 }, options.speed);
        });

        win.scroll(function() {
            var scrolling = win.scrollTop();

            if (options.autohide) {
                if (scrolling > options.offset) {
                    elem.fadeIn(options.speed);
                } else elem.fadeOut(options.speed);
            }

        });

    };

}(jQuery));
$('.elevator-top').toTop();
