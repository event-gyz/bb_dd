
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

var VM,rfp_id=getQueryString('id');


function showPlaceListByPlaceId(data){

var data=$.parseJSON(data)

  var arr=[];
  $.each(data,function(k,v){
        arr.push(v.id)
    })

  console.log(arr)

    $.post('/sendrfp/get-place',{data:arr},function(res){

        if(res.status==1){

            new Vue({
                el:'#place_list_arr',
                data:{
                    place_list_arr:res.data
                }
            })
        
        }

    })


}



//从queryString中判断是否需要商家cookie，如果有显示商家列表，无清空cookie
var place_cookie=getQueryString('place');
var place_list_store = $.cookie('place_list_store_for_business');

//console.log( place_cookie=='no' , place_list_store=='' , typeof(place_list_store) == 'undefined' );

if(place_cookie=='no' || place_list_store=='' || typeof(place_list_store) == 'undefined' ){
    
    $.cookie('place_list_store_for_business',null,{ expires:-1,path:'/' });

    $('#place_list_arr').html('<li>没有选择商家</li>')

}else{
    showPlaceListByPlaceId(place_list_store)
}



function createVM(data){

    var c_data={
        show_phone:true,
        is_set_time:false,
        place_list_arr:[]
            }

    if(typeof data.show_phone =='undefined'){
            $.extend(data,c_data);
    }


     VM = new Vue({
        el: '#VM',
        data: data,
        methods:{
            send:function(){
                var _this=this;
                var postData={};
                    postData.data={
                    show_phone:_this.show_phone,
                    dead_line_time:_this.dead_line_time,
                    id:rfp_id
                }
                $.post('/sendrfp/release',postData,function(res){

                    if(res.status<0){
                        alert(res.msg)
                    }else{
                        $.cookie('place_list_store_for_business',null,{ expires:-1,path:'/' });
                        //$.removeCookie('place_list_store_for_business')
                        window.location.href="/rfp/view?id="+res.data.id

                    }


                })
            }
        }
    })
}

$.get('/sendrfp/getrfp',{id:rfp_id}, function(res) {

    console.log(typeof res)


    if (res.status == 1) {
        createVM(res.data);

    }else if(res.status==-1){
            $.removeCookie('place_list_store_for_business')
            window.location.href="/rfp/view?id="+rfp_id
    }

    else if(res.status==-2){
           alert('没有该询单');
           window.location.href="/"
    }



})