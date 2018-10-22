<link rel="stylesheet" href="/css/common.css">
<style>
    ul,li{
        margin:0;
        padding:0;
    }
    ul li {
        list-style:none;
        border-top: 3px solid transparent;
    }
    .nav-tabs > li.active {
        border-top-color: #3c8dbc;
    }
    #up li{
        float:left;
        height:300px;
        position: relative;
        margin-right:10px;
    }
    #up li img{
        width:200px;

    }
    #up li  span{
        position: absolute;
        top: 0;
        left:5px;
    }
    .ff-error-tip{
        color:red;
    }
    td {
        padding: 15px 10px;
    }
    th{
        font-size: 14px;
        text-align: right;
    }
    .uploader-button{
        margin:15px 0;
    }
    .basic-pop {
        position: fixed;
        z-index: 99999;
        width: 360px;
        left: 50%;
        margin-left: -180px;
        margin-top: -100px;
        top: 50%;
        background: #fff;
        border: 1px solid #ccc;
        padding: 15px;
    }
    .basic-pop h2{
        text-align: center;
        font-size: 175%;
    }
    .content {
        position: relative;
    }
    .seach{
        position: absolute;
        top: 5%;
        left: 25%;
        background: #fff;
        border: 1px solid #696;
        padding: 30px 10px;
        text-align: center;
        /* width: 200px; */
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        -webkit-box-shadow: #666 0px 0px 10px;
        -moz-box-shadow: #666 0px 0px 10px;
        box-shadow: #666 0px 0px 10px;
    }
    .hotel_close{
        position: absolute;
        top: 1px;
        right: 10px;

    }
    [v-cloak] {
        display: none;
    }
   
</style>
<ul id="myTab" class="nav nav-tabs">
    <li>
        <a href="/resource/basic?place_id=<?= !empty($_GET['hotel_id'])?$_GET['hotel_id']:$_GET['place_id']?>"" >
            基本信息
        </a>
    </li>
<!--    <li><a href="/resource/hotel_facilities?place_id=--><?//= !empty($_GET['hotel_id'])?$_GET['hotel_id']:$_GET['place_id']?><!--" >设施及周边</a></li>-->
<!--    <li><a href="/resource/upload?place_id=--><?//= !empty($_GET['hotel_id'])?$_GET['hotel_id']:$_GET['place_id']?><!--" >图片上传</a></li>-->
    <li class="<?= Yii::$app->controller->id == 'manage' ? 'active' : '' ?>"><a href="/manage/room-list?hotel_id=<?= !empty($_GET['hotel_id'])?$_GET['hotel_id']:$_GET['place_id']?>" >产品规格</a></li>
    <li class="<?= Yii::$app->controller->id == 'seller' ? 'active' : '' ?>"><a href="/seller/view?hotel_id=<?= !empty($_GET['hotel_id'])?$_GET['hotel_id']:$_GET['place_id']?>" >销售信息</a></li>
</ul>