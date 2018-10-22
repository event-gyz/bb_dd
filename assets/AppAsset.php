<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/bootstrap.css',
        'css/AdminLTE.min.css',
        'css/app.css',
        'css/site.css',
        'css/_all-skins.min.css',
        'css/jquery-jvectormap-1.2.2.css',
		'plugins/datepicker/datepicker3.css',
		'plugins/daterangepicker/daterangepicker.css',
        'plugins/morris/morris.css'
    ];
    public $js = [
        'js/bootstrap.min.js',
        'js/style.js',
        'plugins/chartjs/Chart.min.js',
        'plugins/morris/morris.min.js',
        'plugins/fastclick/fastclick.js',
		'plugins/datepicker/bootstrap-datepicker.js',
		'plugins/daterangepicker/daterangepicker.js',
		'plugins/jQuery/jquery.cookie.js',
        'js/app.min.js',
    ];
    //he
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
