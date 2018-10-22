<?php

namespace app\models;

use Yii;
use yii\base\Exception;

class ApiToken
{
//     public static $key  = 'com.ebooking.www';
    
    //--------Md5("com.ebooking.www"+(参数名+参数值)+(参数名+参数值)+...+"www.gnikoobe.moc")
    
    public static function getParams($params = [], $key) {
        $md5 = '';
        ksort($params);
        foreach($params as $k=>$v){
            if(strstr($k, 'token'))
                continue;
            if(is_array($v)) {
                $md5 .= '' . $k . self::getParams($v, $key);
            } else {
                $md5 .= '' . $k . $v;
            }
        }
        return $md5;
    }
    
    public static function getToken($params = [], $key){
        $md5   = $key;
        $md5   .= self::getParams($params, $key);
        $md5   .= strrev($key);
        $token = strtoupper(md5($md5));
        return $token;
    }
    
    //token验证
    public static function checkToken()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $params = $_GET;
        } else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $params = $_POST;
        } else {
            $params = [];
        }
        if (isset($params['action'])) unset($params['action']);
        if (isset($params['service'])) unset($params['service']);
        try {
            if (! isset($params['fromPlatform']) || empty($params['fromPlatform']) || ! array_key_exists($params['fromPlatform'], Yii::$app->params['platform'])) {
                throw new Exception('平台来源');
            }
            $token  = self::getToken($params, Yii::$app->params['platform'][$params['fromPlatform']]);
            if(! isset($params['token']) || empty($params['token']) || $token != $params['token']){
                throw new Exception('Token');
            }
        } catch (Exception $e) {
            $ret = array(
                'msg' => $e->getMessage().'参数错误',
                'errorno' => -1,
                'data' => [],
            );
            echo json_encode($ret);
            exit;
        }
   }
}
