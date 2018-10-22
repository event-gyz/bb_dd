
Vue.validator('numberic', function(val) {
    return /^[-+]?[0-9]+$/.test(val)
})
Vue.validator('email', function(val) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
})
Vue.validator('mobile', function(val) {
    return /^1[3|4|5|8][0-9]\d{8}$/.test(val)
})

var provice = [],
    city = [],
    VM;

function getCity(id, callback) {
    //获取城市
    $.get('/sendrfp/get-area', {
        areaId: id || 0
    }, function(res) {
        console.log(typeof res)
        callback(res)
    })

}

function createVM(data) {

    data.place_is_open = false;
    data.room_is_open = false;
    data.food_is_open = false;
    data.provice = []; //省
    data.city = [];
    data.province_id = 1;
    data.city_id = 1;
    data.concat = {

        selected: 1, //默认0 其它1
        'default': {
            mobile: '13718134511',
            name: 'yaojia'
        },
        'other': {
            mobile: '',
            name: ''
        }
    }

    console.info(data);

    VM = new Vue({
        el: '#rfp_form',
        data: data,
        methods: {
            addFood: function() {

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
            rmFood: function(index) {

                if (VM.food_info.data.length <= 1) {
                    return
                }


                VM.food_info.data.splice(index, 1)

            },

            addRoom: function() {
                if (VM.room_info.data.length >= 5) {
                    return
                }
                VM.room_info.data.push({
                    'startTime': 0,
                    'endTime': 0,
                    'night': 0,
                    'type': 1,
                    'room': 0
                })
            },


            rmRoom: function(index) {
                if (this.room_info.data.length <= 1) {
                    return
                }
                this.room_info.data.splice(index, 1)
            },
            saveRfp: function() {

                var postData = VM.$data;
                delete postData.city;
                delete postData.provice;


                console.log(VM.$validation1);


                $.post('/sendrfp/create-rfp', {
                    data: VM.$data
                }, function(res) {

                    if(res.status==1){
                      window.location.href="/sendrfp/select?id="+res.data
                    }else{

                      
                    }

                })



            },
            toggle_place: function() {

                this.place_is_open = !this.place_is_open
            },
            toggle_room: function() {

                this.room_is_open = !this.room_is_open
            },
            toggle_food: function() {

                this.food_is_open = !this.food_is_open
            },
            //计算住几晚
            room_long: function(index) {

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


            }

        },

        watch: {
            'province_id': function(val, oldVal) {

                getCity(val, function(data) {
                    VM.city = data;
                    VM.city_id = data[0].areaid
                })
            },

            'room_info.data': function(val, oldVal) {

                console.log('new: %s, old: %s', val, oldVal);


            }



        }

    })




}


$.get('/sendrfp/getrfp', function(res) {

    console.log(typeof res)

    // res= $.parseJSON(res);

    if (res.status == 1) {
        createVM(res.data);

        //获取省
        $.get('/sendrfp/get-area', {
            areaId: 0
        }, function(res) {
            VM.provice = res
        })
        //获取市

        getCity(1, function(data) {
            VM.city = data
        })

    }


})