/**
 * Created by Zhang on 17/7/17.
 */
var css = "#global-alert{position: fixed;left: 50%;top: 50%;background: #fff;padding:20px 30px;font-size: 16px;z-index:99999;display:inlin-block;display:none;}#global-alert-mask{display: none;position: fixed;left: 0;top: 0;z-index: 10000;width: 100%;height: 100%;background: #000;opacity: 0.8;}"
$('head').append('<style type="text/css">'+css+'</style>');
var util = {
    //正则表达式
    regexp: {
        "tel": /^(\({0,1}\d{3,4})\){0,1}(-){0,1}(\d{7,8})$/,
        "mail": /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
        "mobile": /^1[0-9]{10}$/,
        "number": /^[0-9]*$/,
        "float": /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
        "url": /http:\/\/([\w-]+\.)+[\w-]+(\/[\\w\- .\/?%&=]*)?/,
        "time": /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/,
        "idCard": /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    },
    //去除字符串所以空格
    "trim": function(str){
        var reg = /\s/g;
        str = str.replace(reg,'');
        return str;
    }
};
/**
 * 自定义alert
 */
util.alert = function(text){
    if($('#global-alert').length){
        $('#global-alert').html(text);
    }else{
        var content = "<div id='global-alert'>"+text+"</div>";
        $('body').append(content);
    }
    if(!$('#global-alert-mask').length){
        $('body').append('<div id="global-alert-mask"></div>');
    }
    var WW = $(window).width();
    var WH = $(window).height();
    var PW = $('#global-alert').width();
    var PH = $('#global-alert').height();
    $('#global-alert-mask').show();
    $('#global-alert').css({left:(WW-PW)/2,top:(WH-PH)/2}).show();
    setTimeout(function(){$('#global-alert-mask').hide();$('#global-alert').hide();},1000);
};
util._tips_err = function(text){
    $(this).addClass('valid-error-field');
    if($(this).closest('p').next('.ff-error-tip').length){
        $(this).closest('p').next('.ff-error-tip').text(text);
    }else{
        $(this).closest('p').after('<p class="ff-error-tip">'+text+'</p>');
    }
};
util._tips_success = function(){
    $(this).removeClass('valid-error-field');
    $(this).closest('td').find('p.ff-error-tip').remove();
};

util.validator = function(el){
    var type = $(el).attr('data-validator');
    var val = util.trim($(el).val());
    switch(type)
    {
    case 'notEmpty':
        if(val.length>0){
            util._tips_success.call(el);
            return true;
        }else{
            util._tips_err.call(el,'内容不能为空');
            return false;
        }
        break;
    case 'tel':
        if(util.regexp.tel.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'电话号码错误！');
            }else{
                util._tips_err.call(el,'电话号码不能为空！');
            }
            return false;
        }
        break;
    case 'mail':
        if(util.regexp.mail.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'邮箱地址错误！');
            }else{
                util._tips_err.call(el,'邮箱地址不能为空！');
            }
            return false;
        }
        break;
    case 'number':
        if(val && util.regexp.number.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'内容必须是数字！');
            }else{
                util._tips_err.call(el,'内容不能为空！');
            }
            return false;
        }
        break;
    case 'float':
        if(util.regexp.float.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'内容必须是数字！');
            }else{
                util._tips_err.call(el,'内容不能为空！');
            }
            return false;
        }
        break;
    case 'mobile':
        if(util.regexp.mobile.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'手机号码错误！');
            }else{
                util._tips_err.call(el,'手机号码不能为空！');
            }
            return false;
        }
        break;
    case 'url':
        if(util.regexp.url.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'网址链接错误！');
            }else{
                util._tips_err.call(el,'网址链接不能为空！');
            }
            return false;
        }
        break;
    case 'time':
        if(util.regexp.time.test(val)){
            util._tips_success.call(el);
            return true;
        }else{
            if(val.length){
                util._tips_err.call(el,'日期格式错误！');
            }else{
                util._tips_err.call(el,'日期不能为空！');
            }
            return false;
        }
        break;
    case '-1':
        if(val != -1){
            util._tips_success.call(el);
            return true;
        }else{
            util._tips_err.call(el,'请选择内容！');
            return false;
        }
        break;
    }

};
util.upload = function(obj){
    if(obj.buttonEle && obj.action){
        //$(obj.buttonEle).mousemove(function(){});//清楚鼠标跟随
        new AjaxUpload(obj.buttonEle, {
            action: obj.action,
            name: obj.name,
            onSubmit: function (file, ext) {//file 本地文件名称，ext 为文件后缀名等信息
                isEnd = false;
                var flag = false;
                var fileExt = ext[0];
                var fileTypeExt = obj.fileExt.length? obj.fileExt : ['*'];
                for(var i=0;i<fileTypeExt.length;i++){
                    if(fileTypeExt[i] === fileExt || fileTypeExt[i] === '*'){
                        flag  = true;
                        break;
                    }
                }
                if(!flag){
                    util.alert({content:'文件类型错误！'});
                    return false;
                }
                if(obj.uploadIng && typeof(obj.uploadIng) === 'function'){
                    obj.uploadIng.call(this);
                }
            },
            onComplete: function (file, response) {//file 本地文件名称，response 服务器端传回的信息
                isEnd = true;
                if(obj.success && typeof(obj.success) === 'function'){
                    obj.success.call(this,response,upEle);
                }
            }
        });
    }else{
        util.alert({content:'请设置buttonEle和上传路径'});
        return;
    }

    var upEle = null;
    var isEnd = true;
    obj.buttonEle.click(function(){
        if(isEnd){upEle = $(this);}
        var buttonW = $(this).width();
        var left = $(this).offset().left;
        var top = $(this).offset().top;
        $(':file').css({left:left,top:top,margin:'1px 0 0 0',width:buttonW}).show();
        $(":file").click();
    });
    obj.buttonEle.mouseover(function(){
        if(isEnd){upEle = $(this);}
        var buttonW = $(this).width();
        var left = $(this).offset().left;
        var top = $(this).offset().top;
        $(':file').css({left:left,top:top,margin:'1px 0 0 0',width:buttonW}).show();
    });
};


