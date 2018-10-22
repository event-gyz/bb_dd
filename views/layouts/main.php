<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
use app\core\Permission;
use yii\helpers\Url;


AppAsset::register($this);

function isActive($from = '') {
    $controllerId = strtolower(Yii::$app->controller->id);
    $actionId     = strtolower(Yii::$app->controller->action->id);
    $path         = Yii::$app->request->getPathInfo();

    if ($controllerId === $from) {
        return 'active';
    }

    if ($path === $from) {
        return 'active';
    }

    return '';
}

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
    <script src="/plugins/daterangepicker/moment.min.js"></script>
    <script src="/js/jquery.js"></script>
    <script src="/js/layer/layer.min.js"></script>
    <script src="/js/layer/extend/layer.ext.js"></script>
    <link href="/css/font-awesome.min.css" rel="stylesheet">
    <link href="/css/bootstrap.css" rel="stylesheet">
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
<style>
    .fixed {
        position: fixed;
        top: 0;
        z-index: 1000;
        width: 100%;
        -position: absolute;
        -top: expression(eval(document.documentElement.scrollTop))
    }
</style>
<div class="wrap">
    <div class="wrapper">

        <header class="main-header fixed">
            <!-- Logo -->
            <a href="/" class="logo">
                <!-- mini logo for sidebar mini 50x50 pixels -->
                <span class="logo-mini"><b>EB</b></span>
                <!-- logo for regular state and mobile devices -->
                <span class="logo-lg"><?= Yii::t('app', 'System name') ?></span>
            </a>

            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top">
                <!-- Sidebar toggle button-->
                <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                    <span class="sr-only">Toggle navigation</span>
                </a>
                <!-- Navbar Right Menu -->
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <li class="dropdown user user-menu">
                            <a href="/user/view?id=<?= Yii::$app->session['__id'] ?>" class="dropdown-toggle">
                                <span class="hidden-xs fa  fa-user">
                                    &nbsp;&nbsp;<?= \Yii::$app->user->isGuest ? '' : \Yii::$app->user->identity->username ?>
                                </span>
                            </a>

                            <ul class="dropdown-menu">

                            </ul>
                        </li>


                        <li>
                            <a href="/site/logout"><?= \Yii::t('app', 'Logout') ?></a>
                        </li>
                    </ul>
                </div>

            </nav>
        </header>
        <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar" style="margin-top: 20px;">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar">
                <?php
                echo \yii\widgets\Menu::widget([
                    'options'         => ['class' => 'sidebar-menu'],
                    'submenuTemplate' => '<ul class="treeview-menu">{items}</ul>',
                    'items'           => [
                        // 酒店资源
                        [
                            'label'    => Yii::t('app', '酒店资源'),
                            'url'      => [Url::to('/resource/index?menu_id=1-1')],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-fw fa-binoculars"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('resource'),
                        ],
                        // 订单管理
                        [
                            'label'    => Yii::t('app', '订单管理'),
                            'url'      => [Url::to('/ebooking-order/index?menu_id=2-1')],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-bars"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('ebooking-order'),
                            'items'    => [

                                [
                                    'label'    => '订单列表',
                                    'url'      => [Url::to('/ebooking-order/index?menu_id=2-1')],
                                    'options'  => ['class' => 'treeview', 'menu_id' => '2-1'],
                                    'template' => '<a href="{url}"><i class="fa fa-book"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('ebooking-order/index'),
                                ],

                                [
                                    'label'    => Yii::t('app', '新建订单'),
                                    'url'      => [Url::to(['/ebooking-order/create?menu_id=2-2'])],
                                    'options'  => ['class' => 'treeview', 'menu_id' => '2-2'],
                                    'template' => '<a href="{url}"><i class="fa fa-plus"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('ebooking-order/create'),
                                ],
                            ],

                        ],
                        // 渠道管理
                        [
                            'label'    => Yii::t('app', '渠道管理'),
                            'url'      => [Url::to('/ebooking-source/index?menu_id=3-1')],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-flag"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('ebooking-source'),
                            'items'    => [

                                [
                                    'label'    => '渠道列表',
                                    'url'      => [Url::to('/ebooking-source/index?menu_id=3-1')],
                                    'options'  => ['class' => 'treeview', 'menu_id' => '3-1'],
                                    'template' => '<a href="{url}"><i class="fa fa-book"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('ebooking-source/index'),
                                ],

                                [
                                    'label'    => Yii::t('app', '新增渠道'),
                                    'url'      => [Url::to(['/ebooking-source/create?menu_id=3-2'])],
                                    'options'  => ['class' => 'treeview', 'menu_id' => '3-2'],
                                    'template' => '<a href="{url}"><i class="fa fa-plus"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('ebooking-source/create'),
                                ],
                            ],

                        ],

                        // 账户管理
                        [
                            'label'    => Yii::t('app', '账户管理'),
                            'url'      => [Url::to(['/user/update', 'id' => Yii::$app->session['__id'], 'menu_id' => '4-1'])],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-cog"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('user/update'),
                        ],
                        //财务对账
//                        [
//                            'label'    => Yii::t('app', '财务对账'),
//                            'url'      => [Url::to(['/finance'])],
//                            'options'  => ['class' => 'treeview'],
//                            'template' => '<a href="{url}"><i class="fa fa-cog"></i>&nbsp;&nbsp;<span>{label}</span></a>',
//                            'active'   => isActive('/finance'),
//                        ],

                        // 供应商账户管理
                        [
                            'label'    => Yii::t('app', '供应商管理'),
                            'url'      => [Url::to('/supplier-account/index?menu_id=5-1')],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-user"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('supplier-account'),
                            'items'    => [

                                [
                                    'label'    => '供应商列表',
                                    'url'      => [Url::to('/supplier-account/index?menu_id=5-1')],
                                    'options'  => ['class' => 'treeview', 'menu_id' => '5-1'],
                                    'template' => '<a href="{url}"><i class="fa fa-book"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('supplier-account/index'),
                                ],

                                [
                                    'label'    => Yii::t('app', '新建供应商'),
                                    'url'      => [Url::to(['/supplier-account/create?menu_id=5-2'])],
                                    'options'  => ['class' => 'treeview', 'menu_id' => '5-2'],
                                    'template' => '<a href="{url}"><i class="fa fa-plus"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('supplier-account/create'),
                                ],
                            ],

                        ],

                        [
                            'label'    => Yii::t('app', '合同管理'),
                            'url'      => [Url::to('/supplier-submit-order/index?menu_id=6-1')],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-fw fa-th-list"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('supplier-submit-order/index'),
                        ],
                        [
                            'label' => Yii::t('app', '会唐支付'),
                            'url'      => [Url::to('/evepay')],
                            'options'  => ['class' => 'treeview'],
                            'template' => '<a href="{url}"><i class="fa fa-jpy"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                            'active'   => isActive('evepay'),
                            'items'    => [

                                [
                                    'label'    => Yii::t('app', '钱包管理'),
                                    'url'      => [Url::to('/wallet/wallet')],
                                    'options'  => ['class' => 'treeview'],
                                    'template' => '<a href="{url}"><i class="fa fa-fw fa-th-list"></i>&nbsp;&nbsp;<span>{label}</span></a>',
                                    'active'   => isActive('wallet'),
                                ],

//                                [
//                                    'label'    => Yii::t('app', '支付流水'),
//                                    'url'      => [Url::to('/支付流水/index?menu_id=7-2')],
//                                    'options'  => ['class' => 'treeview', 'menu_id' => '7-1'],
//                                    'template' => '<a href="{url}"><i class="fa fa-fw fa-th-list"></i>&nbsp;&nbsp;<span>{label}</span></a>',
//                                    'active'   => isActive('evepay'),
//                                ],

                            ],
                        ]

                    ],
                ]);
                ?>

            </section>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->

        <div class="content-wrapper" style="margin-top: 50px;">
            <section class="content-header none">
                <?= Breadcrumbs::widget([
                    'homeLink' => false,
                    'links'    => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
                ]) ?>
            </section>
            <section class="content">
                <?= $content ?>
            </section>

        </div>
        <footer class="main-footer">
            <div class="pull-right hidden-xs">
                Powered By <b><a href="http://www.eventown.com/" rel="external">Eventown.com</a></b>
            </div>
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
        </footer>
    </div>
</div>
<?php $this->registerJsFile("/plugins/jQuery/jquery.cookie.js", ['depends' => \app\assets\AppAsset::className()]) ?>

<script>

    // 实现进入子页面时左侧菜单也能高亮起来
    var menu_id     = "<?= !empty($_SESSION['menu_id']) ? $_SESSION['menu_id'] : ""?>";
    var menu_id_str = "[menu_id='" + menu_id + "']";
    $(menu_id_str).addClass('active');

    // 菜单高亮,让他爹也亮起来
    $('.treeview.active').parent().addClass('menu-open');
    $('.treeview.active').parent().parent().addClass('active');

</script>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
