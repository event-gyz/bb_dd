<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
use yii\helpers\Url;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
</head>
<style type="text/css">
    .jqstooltip {
        position: absolute;
        left: 0px;
        top: 0px;
        visibility: hidden;
        background: rgb(0, 0, 0) transparent;
        background-color: rgba(0, 0, 0, 0.6);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
        color: white;
        font: 10px arial, san serif;
        text-align: left;
        white-space: nowrap;
        padding: 5px;
        border: 1px solid white;
        z-index: 10000;
    }

    .jqsfield {
        color: white;
        font: 10px arial, san serif;
        text-align: left;
    }
</style>
<body class="skin-blue sidebar-mini">
<?php $this->beginBody() ?>

<div class="wrap">
    <div class="wrapper">

        <header class="main-header">

            <!-- Logo -->
            <a href="/" target="_blank" class="logo">
                <!-- mini logo for sidebar mini 50x50 pixels -->
                <!--<span class="logo-mini"><b>A</b>LT</span>-->
                <!-- logo for regular state and mobile devices -->
                <span class="logo-lg"><b>直营酒店管理系统</b></span>
            </a>

            <!-- Header Navbar: style can be found in header.less -->
            <!--            <nav class="navbar navbar-static-top">


                            <div class="navbar-custom-menu">
                                <ul class="nav navbar-nav">


                                    <li class="dropdown user user-menu">
                                        <a href="/site/login" class="dropdown-toggle">
                                            <span class="hidden-xs">登录</span>
                                        </a>

                                    </li>
                                    <li class="dropdown user user-menu">
                                        <a href="/register/index" class="dropdown-toggle">
                                            <span class="hidden-xs">注册</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </nav>-->
        </header>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <?= $content ?>
        </div>

    </div>
</div>

<footer class="footer">
    <div class="container">
        <p class="pull-left">&copy; eventown.com <?= date('Y') ?></p>
        <p class="pull-left" style="padding-left:40px;">
            <span>会唐网</span>
            <span>国际协会会员</span>
        </p>
        <p class="pull-left" style="padding-left:40px;">
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502031239"
               style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
                <img style="float:left;" src="//links.eventown.com/images/footer/bei_an.png">
            </a>
        </p>
        <p class="pull-left">
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502031239"
               style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
                京公网安备 11010502031239号
            </a>
        </p>

        <p class="pull-right">Powered By <a href="http://www.eventown.com/" rel="external">Eventown.com</a></p>
    </div>
</footer>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
