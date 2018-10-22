<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'basic',
    'language'=>'zh-CN',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'modules'   => [
        'brfp' => [
            'class'=>'app\modules\brfp\Module'
        ],
        'yrfp' => [
            'class'=>'app\modules\yrfp\Module'
        ],

        'search-place' => [
            'class'=>'app\modules\searchPlace\Module'
        ],
        'bayer' => [
            'class'=>'app\modules\bayer\Module'
        ],
        'straight-hotel' => [
            'class' => 'app\modules\straightHotel\Module',
        ],

        'hotel-resources' => [
            'class' => 'app\modules\hotelResources\Module',
        ],
        'account' => [
            'class' => 'app\modules\account\Module',
        ],
    ],
    'components' => [
        'assetManager' => [
            'bundles' => [
                'yii\bootstrap\BootstrapPluginAsset' => [
                    'js'=>[]
                ],
            ],
        ],
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'W_MkvMzf8tdR0RPP-I8d5zOpDfT-OfM5',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
                'text/json' => 'yii\web\JsonParser',
            ],
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\Admin',
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'formatter' => [
            'datetimeFormat' => 'Y-m-d H:i:s',
            'dateFormat' => 'yyyy-MM-dd',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'i18n' => [
            'translations' => [
                'app*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@app/messages',
                    'sourceLanguage' => 'en',
                    'fileMap' => [
                        'app' => 'yii.php',
                        'app/error' => 'error.php',
                    ],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        'db_admin' => require(__DIR__ . '/db_admin.php'),
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                'api/<service>/<action>' => 'api/index',
            ],
        ],
        'authManager' => [
            'class' => 'app\components\PhpManager',
            'defaultRoles'=>['guest']
        ],

    ],
    'params' => $params,
    //'defaultRoute'=>'/bayer/brfp/index'
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => ['*'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['*']
    ];
}

return $config;
