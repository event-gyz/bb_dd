define(function(require, exports, module) {


    /*
     * 百度地图对象
     */
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
    }
    var keyPoint=GetRequest();
    var PlaceMap = {
        markerArr: [], //点对象的集合。
        IMG_BASEURL: 'http://links.eventown.com.cn/images/icon/',
        mapDatalist: GLOBAL.place_geo_data,
        index:10,
        urlPoint:keyPoint.location,
        //获取百度地图
        getBaiduMap: function() {
            return new BMap.Map("map", { enableMapClick: false })
        },
        initMap: function() {
            this.map = this.getBaiduMap()
            var mapDatalist = this.mapDatalist
            var point = new BMap.Point(mapDatalist[0].lng, mapDatalist[0].lat) // 创建点坐标  
            this.map.centerAndZoom(point, 15)

            this.map.addControl(new BMap.NavigationControl())
            this.map.addControl(new BMap.ScaleControl())
            this.map.addControl(new BMap.OverviewMapControl())
            this.map.enableScrollWheelZoom() //启动鼠标滚轮缩放地图
                // this.map.clearOverlays()
            this.createTag()
            this.randerMarker()
                // this.removeLogo()
        },
        createTag:function(){
            if(this.urlPoint=='' || this.urlPoint=='undefined' || this.urlPoint==null) return false;
            var arr=this.urlPoint.split(',');
            var pint= new BMap.Point(arr[1],arr[0])
            var mykey = new BMap.Marker(pint);  // 创建标注
            this.map.addOverlay(mykey);               // 将标注添加到地图中
            mykey.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        },
        randerMarker: function() {
            var mapDatalist = this.mapDatalist
            var points = []
            var len = this.mapDatalist.length

            for (var i = 0; i < len; i++) {
                var point = new BMap.Point(mapDatalist[i].lng, mapDatalist[i].lat, { icon: myIcon })

                var myIcon = new BMap.Icon(this.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56))
                var themarker = new BMap.Marker(point, { icon: myIcon })



                themarker.addEventListener("onmouseover", (function(themarker, i) {
                    return function() {
                        PlaceMap.showTips(themarker, i)
                    }
                })(themarker, i))

                themarker.addEventListener("onmouseout", (function(themarker, i) {
                    return function() {
                        PlaceMap.hideTips(themarker, i)
                    }
                })(themarker, i))

                points.push(point)


                PlaceMap.markerArr.push(themarker)

                this.map.addOverlay(themarker); // 将标注添加到地图中
            }


            this.map.setViewport(points);
        },

        showTips: function(themarker, i) {

            var myIcon = new BMap.Icon(PlaceMap.IMG_BASEURL + "orange_" + (i + 1) + ".png", new BMap.Size(56, 56));
            var myIconblue = new BMap.Icon(PlaceMap.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56));

            themarker.setIcon(myIcon);

            var tipsPos = PlaceMap.map.pointToPixel(themarker.getPosition());

            // var LayerWidth = $(".tips").outerWidth();

            $('.tips' + (i + 1)).on('mouseenter', function() {
                $(this).show()
                themarker.setIcon(myIcon);
            })

            $('.tips' + (i + 1)).on('mouseleave', function() {
                $(this).hide()
                themarker.setIcon(myIconblue);

            })
            var jmain = $('#Jmain').outerWidth();
            console.log(tipsPos);
            $('.tips' + (i + 1)).show().css({ "top": tipsPos.y + 5, "left": tipsPos.x + 10 + jmain })


        },

        hideTips: function(themarker, i) {

            var myIcon = new BMap.Icon(PlaceMap.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56));
            themarker.setIcon(myIcon);
            $('.tips' + (i + 1)).hide()

        },
        onover: function(i) {
            var myIcon;
            var myIcon = (function(){
                return myIcon || (myIcon=new BMap.Icon(PlaceMap.IMG_BASEURL + "orange_" + (i + 1) + ".png", new BMap.Size(56, 56)))
            })()
           
            PlaceMap.markerArr[i].setIcon(myIcon);




        },
        onout: function(i) {
            var myIcon = new BMap.Icon(PlaceMap.IMG_BASEURL + "blue_" + (i + 1) + ".png", new BMap.Size(56, 56));
            PlaceMap.markerArr[i].setIcon(myIcon);
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



    //触发浏览器dom事件
    var fireEvent = function(element, event) {

        if (document.createEventObject) {

            // IE浏览器支持fireEvent方法

            var evt = document.createEventObject();

            return element.fireEvent('on' + event, evt)

        } else {

            // 其他标准浏览器使用dispatchEvent方法

            var evt = document.createEvent('HTMLEvents');

            // initEvent接受3个参数：

            // 事件类型，是否冒泡，是否阻止浏览器的默认行为

            evt.initEvent(event, true, true);

            return !element.dispatchEvent(evt);

        }

    };




    module.exports = PlaceMap



})
