<?php

namespace app\controllers;

use Yii;
use app\models\ApiToken;
class ApiController extends \yii\web\Controller
{
    public $enableCsrfValidation = false;
    public function actionIndex()
    {
        // 拆分url 拆分出service和action
        $uri = $_SERVER['REQUEST_URI'];
//         ApiToken::checkToken();
        $tmp = explode('?', $uri);
        $tmp = explode('/', $tmp[0]);
        if (!isset($tmp[2]) || !isset($tmp[3])) {
            exit('invalid api path!');
        }
        $api = trim($tmp[2]);
        $action = trim($tmp[3]);

        // 根据service拼接文件路径
        $file = Yii::$app->basePath . '/api/' . ucwords($api) . '.php';
        if (!file_exists($file)) {
            exit($file . " is not exists ");
        }

        // 引入api类，调用具体方法
        require_once $file;
        $class = ucwords($api) . '_api';
        if (!in_array($action, get_class_methods($class))) {
            exit('the method "' . $action . '" is not exists!');
        }
        $api = new $class;
        return $api->$action();
    }
}
