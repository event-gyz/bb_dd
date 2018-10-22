<?php

// comment out the following two lines when deployed to production
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');
//define('YII_ENABLE_ERROR_HANDLER', false);
define('FCPATH', dirname(__FILE__).DIRECTORY_SEPARATOR);

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

$config = require(__DIR__ . '/../config/web.php');
($yii = new yii\web\Application($config));
//require(__DIR__ . '/../config/tparams.php');
$yii->run();

