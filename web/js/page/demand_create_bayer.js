function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var ID = GetRequest('id').id;
var MEETID = GetRequest('id').meeting_id;
var provice = [],
    city = [],
    uploader = null,
    VM;

Vue.validator('numberic', function (val) {
    return /^[-+]?[0-9]+$/.test(val)
})
Vue.validator('email', function (val) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
})
Vue.validator('mobile', function (val) {
    return /^1[3|4|5|8][0-9]\d{8}$/.test(val)
})
Vue.validator('test', {
    message: '测试一下错误信息',
    check: function (val) {
        //alert(VM.place_is_open);
        return false;
    }
})

function getCity(id, callback) {
    //获取城市
    $.get('/sendrfp/get-area', {
        areaId: id || 0
    }, function (res) {
        //console.log(typeof res)
        callback(res)
    })
}

$('#start0').change(function () {
    alert(1111);
});

function getLayDate(index) {
    var start = {
        elem: '#start' + index,
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16 23:59:59', //最大日期
        istime: true,
        istoday: false,
        choose: function(datas){
            var endTime = $('#end' + index);
            if (datas > endTime.val()) {
                endTime.val('');
            }

            VM.meet_info.data[index].startTime = datas;
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
        }
    };

    var end = {
        elem: '#end' + index,
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: false,
        choose: function(datas){
            var startTime = $('#start' + index);
            if (datas < startTime.val()) {
                startTime.val('');
            }

            VM.meet_info.data[index].endTime = datas;
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };

    laydate(start);
    laydate(end);
}

function createVM(data) {

    // data.place_is_open = true;
    // data.room_is_open = false;
    // data.food_is_open = false;
    // data.service_is_open = true;
    // data.opType_is_open = true;
    // data.media_is_open = false;
    // data.meetDigital_is_open = true;
    // data.file_is_open = true;

    // //服务商选型控制

    // data.car_is_open = false;
    // data.member_is_open = false;


    data.provice = []; //省
    data.city = [];

    VM = new Vue({
        el: '#rfp_form',
        data: data,
        ready: function () {
            if (this.place_is_open == true) {
                getLayDate(0)
            }
        },
        methods: {
            addFood: function () {

                if (VM.food_info.data.length >= 5) {
                    return
                }

                VM.food_info.data.push({
                    'meal': 0,
                    'people': 0,
                    'select1': 1,
                    'select2': 1
                })

            },
            rmFood: function (index) {

                if (VM.food_info.data.length <= 1) {
                    return
                }


                VM.food_info.data.splice(index, 1)

            },

            addRoom: function () {
                if (VM.room_info.data.length >= 5) {
                    return
                }
                VM.room_info.data.push({
                    'startTime': '',
                    'endTime': '',
                    'night': 0,
                    'type': 1,
                    'room': 0
                })



            },


            rmRoom: function (index) {
                //alert(index);
                if (this.room_info.data.length <= 1) {
                    return
                }
                this.room_info.data.pop()
            },
            saveRfp: function () {
                var postData = VM.$data;
                delete postData.city;
                delete postData.provice;
                if (ID == undefined) {
                    var url = "save-demand"
                } else {
                    var url = "update-demand"
                }
                $.post('/bayer/rfp/' + url, {
                    data: VM.$data
                }, function (res) {
                    if (res.status == 1) {
                        alert('操作成功');
                        window.location.href = "/bayer/brfp/index";
                    } else {
                        alert(res.msg);
                    }
                })
            },
            sendRfp: function () {
                var postData = VM.$data;
                delete postData.city;
                delete postData.provice;

                $.post('/bayer/rfp/send-rfp', {
                    data: VM.$data
                }, function (res) {
                    if (res.status == 1) {
                        alert('操作成功');
                        window.location.href = "/bayer/brfp/index";
                    } else {
                        alert(res.msg);
                    }
                })
            },
            toggle_place: function () {
                this.place_is_open = !this.place_is_open

                if (this.place_is_open == true && uploader == null) {
                    setTimeout('getLayDate(0)', 1000)

                }
            },
            toggle_room: function () {

                this.room_is_open = !this.room_is_open
            },
            toggle_food: function () {

                this.food_is_open = !this.food_is_open
            },
            toggle_service: function () {

                this.service_is_open = !this.service_is_open

                if (this.service_is_open == true && uploader == null) {
                    setTimeout('createUplader()', 1000)

                }
            },
            //添加分会场
            addPlace: function (index) {

                VM.meet_info.data.push({
                    "startTime": '',
                    "endTime": '',
                    "meetForm": 0,
                    "meetEqui": {
                        0: {
                            'label': '投影仪',
                            'name': '95',
                            'num': '0'
                        },
                        1: {
                            'label': '有线麦克',
                            'name': '96',
                            'num': '0'
                        },
                        2: {
                            'label': '无线麦克',
                            'name': '97',
                            'num': '0'
                        },
                        3: {
                            'label': '黑板/白板',
                            'name': '98',
                            'num': '0'
                        },
                        4: {
                            'label': '音箱',
                            'name': '99',
                            'num': '0'
                        },
                        5: {
                            'label': '讲台',
                            'name': '100',
                            'num': '0'
                        },
                        6: {
                            'label': '引导牌',
                            'name': '101',
                            'num': '0'
                        },
                        7: {
                            'label': '桌卡',
                            'name': '102',
                            'num': '0'
                        },
                        8: {
                            'label': '签到台',
                            'name': '103',
                            'num': '0'
                        },
                        9: {
                            'label': '多方电话系统',
                            'name': '104',
                            'num': '0'
                        }
                    }
                });
                //alert(index);

                setTimeout('getLayDate(' + (index + 1) + ')', 2000);
            },
            removePlace: function (index) {
                VM.meet_info.data.splice(index, 1)
            },
            checkDateFomate:function (index) {

                console.log(index)

            },
            //计算住几晚
            room_long: function (index) {

                //转换输入的时间
                function parse(time) {
                    if (time) {
                        var tmpTime = new Date(time);
                        return new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate());
                    }
                    return null;
                }

                var s = this.room_info.data[index].startTime;
                var e = this.room_info.data[index].endTime;


                if (s && e) {

                    var long = parseInt(parse(e) - parse(s)) / 1000 / 60 / 60 / 24;

                    if (long <= 0) {

                        console.error('入住时间格式不正确')

                    }

                    this.room_info.data[index].night = long;

                }


            },
            addCar: function () {

                VM.service_info.data.carType.push(
                    {
                        "select": 1,
                        "num": 0,
                        "require": ''
                    })
            },
            removeCar: function (index) {
                VM.service_info.data.carType.splice(index, 1)
            },
            addPeople: function () {

                VM.service_info.data.member.push(
                    {
                        "select": 1,
                        "sex": 1,
                        "num": 0,
                        "require": ''
                    })
            },
            removePeople: function (index) {
                VM.service_info.data.member.splice(index, 1)
            },

            addopType: function () {

                VM.service_info.data.opType.push(
                    {
                        "select": 1,
                        "num": 0,
                        "require": ''
                    })
            },
            removeopType: function (index) {
                VM.service_info.data.opType.splice(index, 1)
            },
            download: function (val) {
                window.location.href = "/brfp/demands/download?url=" + val;
            }

        },

        watch: {
            'province_id': function (val, oldVal) {

                getCity(val, function (data) {
                    VM.city = data;
                    VM.city_id = data[0].areaid
                })
            },

            'room_info.data': function (val, oldVal) {

                console.log('new: %s, old: %s', val, oldVal);


            },
            'meet_info.data':function (val, oldVal) {

                console.log('new: %s, old: %s', val, oldVal);

            }


        }

    })
}

$.get('/bayer/rfp/getdemand', {id: ID, meeting_id: MEETID}, function (res) {
    if (res.status == 1) {
        createVM(res.data);

        //获取省
        $.get('/sendrfp/get-area', {
            areaId: 0
        }, function (res) {
            VM.provice = res
        })
        //获取市
        getCity(VM.province_id, function (data) {
            VM.city = data
        })
    }
})

//****上传附件****/
/*function createUplader() {

    uploader = WebUploader.create({
        // 文件接收服务端。
        server: '/brfp/demands/upload',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',
        resize: false,
        auto: true,
        size: 1024 * 1024 * 1024,
        accept: {
            title: 'Applications',
            extensions: 'doc,docx,pdf',
            mimeTypes: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf'
        },
        formData: {
            name: 'service_file',
            _csrf: $('#_csrf').val()
        }
    });

    uploader.on('fileQueued', function (file) {
        $('#thelist').html('').append('<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>');
    });
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
    });
    uploader.on('uploadSuccess', function (file, res) {
        if (res.status == 1) {
            $('#' + file.id).find('p.state').text('上传成功');
            VM.service_info.file = res.url
        }

    });

    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });

    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
    });
}*/

