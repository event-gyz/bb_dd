<!-- Your Page Content Here -->
<h3>直营酒店管理 /
    <?= Yii::$app->controller->id == 'hotel' ? '酒店信息' : '' ?>
    <?= Yii::$app->controller->id == 'manage' ? '房态管理' : '' ?>
    <?= Yii::$app->controller->id == 'seller' ? '销售信息' : '' ?>
    <?= Yii::$app->controller->id == 'log' ? '操作日志' : '' ?>


    <a href="javascript:history.go(-1);" class="btn btn-default">返回</a>
</h3>

<div class="part3" style="margin-bottom:20px;">
    <h4 class="hotel_title col-xs-8">
        <span style="font-size:20px;">
            <?= $hotels ? $hotels[0]->hotel_name : '' ?>
            &nbsp;&nbsp;
            <?php if($hotels){?>
            <span class="hotel_lxfs">[<?= $hotels[0]->hotel_id; ?>]</span>
            <?php }?>
        </span>

    </h4>
    <span class="hotel_title col-xs-4" style="padding-top:10px;line-height: 40px;height:40px;"><?= $hotels ? '联系人：'.$hotels[0]->service_manager : '' ?>
        &nbsp;&nbsp;<?= $hotels ? '电话：'.$hotels[0]->service_phone : '' ?>
    </span>
</div>

<div class="nav-tabs-custom">
    <ul class="nav nav-tabs">

        <li class="<?= Yii::$app->controller->id == 'hotel' ? 'active' : '' ?>">
            <a href="/hotel/view?hotel_id=<?= $hotelId ?>">酒店信息</a></li>
        <li class="<?= Yii::$app->controller->id == 'manage' ? 'active' : '' ?>">
            <a href="/manage/room-list?hotel_id=<?= $hotelId ?>">房态管理</a></li>
        <li class="<?= Yii::$app->controller->id == 'seller' ? 'active' : '' ?>">
            <a href="/seller/view?hotel_id=<?= $hotelId ?>">销售信息</a></li>
        <li class="<?= Yii::$app->controller->id == 'log' ? 'active' : '' ?>">
            <a href="/log/index?hotel_id=<?= $hotelId ?>">操作日志</a>
        </li>
    </ul>
</div>