/*搜索下拉菜单，index  search min_search 三页通用 */
define(function(require, exports) {

var $searchInput=$('.searchInput'),
    search_url=(function(){
        if( 'undefined' == typeof currentUrl ){
            var url = '/search-place/psearch'
        }else{
            var url = currentUrl
        }
        return url
      })(),
      search_number=$('#search_number').attr('data-value') || '',
      city_name=$.trim($('.toCity').find('span').text());

$('<div id="downmenu"><ul></ul></div>').appendTo($('.searchBox'));
$('<div id="downmenu"><ul></ul></div>').appendTo($('.search_l'));


 var timer = null;
function searchApi(key_word){
clearTimeout(timer);
timer = setTimeout(function(){

   city_name=$.trim($('.toCity').find('span').text());

   $.get('/search-place/psearch/place-fuzzy-retrieval',{city_name:city_name,key_words:key_word},function(res){
      res=$.parseJSON(res)
                if(res.errno==0 && res.data.length>0 ){
                                $('#downmenu').show();
                                 createDom(res)


                }else{
             $('#downmenu').hide()
               }
        })
},300)


 }
 function createDom(res){

        var html='';
        var city_id=$('#assign1').val() || param.city_id;

        $.each(res.data,function(k,v){
         html+='<li location="' +v.location.lat+','+v.location.lng+  '" ><a href="'+search_url+'?city_id='+city_id+'&key_words='+v.key_words+'&location='+v.location.lat+',' +v.location.lng  + search_number +'">'+v.key_words+'  </a> <span>'+v.district+'</span></li>'

        })

        $('#downmenu ul').html(html)


 }

$(document).on('mouseenter','#downmenu li',function(){

        var text=$.trim($(this).find('a').text());
        $(this).css({
                background:'#ddd'
        })

        $searchInput.val(text).addClass('haskeyword')
        if(typeof GLOBAL!=='undefined'){
            GLOBAL.location=$(this).attr('location')
        }


})

$(document).on('mouseleave','#downmenu li',function(){
        var text=$.trim($(this).find('a').text());
        $(this).css({
                background:''
        })
        $searchInput.val(text)
})
  $searchInput.on('keyup',function () {
        var key_word=$.trim($(this).val());
        $(this).removeClass('haskeyword');
                if(typeof GLOBAL!=='undefined'){
                  GLOBAL.location='';
                }
         if(key_word!==''){
               searchApi(key_word)
         }else{
        $('#downmenu').hide()
        }
  })

   $searchInput.on('focus',function () {
        var key_word=$.trim($(this).val());
         if(key_word!=='' && !$(this).hasClass('haskeyword')){
          searchApi(key_word)
         }

  })

$(document)
    .on('click.search', function(){
        $('#downmenu').hide();
    })
    .on('click.search', '#downmenu,.searchInput', function(event){
        event.stopPropagation();
    })


})