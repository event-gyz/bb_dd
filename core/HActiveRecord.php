<?php
namespace app\core;

use Yii;
use yii\db\ActiveRecord;

class HActiveRecord extends ActiveRecord{
    public static $clients = array();
    /**
     * 超时重试的次数
     */
    const REQUEST_TIMES = 5;

    /**
     * 超时时间,5秒
     */
    const REQUEST_TIME_OUT = 5000;
    
    
    public static function getRpcClient($service, $url_type = 'user_rpc',$toPower=false){

        $rpc_client = isset(self::$clients [$service]) ? self::$clients [$service] : false;
        if (!$rpc_client) {
            $links_pic = Yii::$app->params['link'][$url_type];

            $links_pic = rtrim($links_pic, '/');
            $links_pic .= $toPower ? '/Rpc?':'/rpc?';
            $param = array('svc' => $service, 'app_name' => 'new_eventown', 'token' => '63942ca4cbf603ee1d57500c69f72f24');
            $links_pic .= http_build_query($param);
            $rpc_client = new \Yar_Client ($links_pic);
            $rpc_client->SetOpt(YAR_OPT_CONNECT_TIMEOUT, self::REQUEST_TIME_OUT);
            self::$clients [$service] = $rpc_client;
        }

        return $rpc_client;
    }

    public static function insertSomeData($db, $table, $data) {
        $connection = \Yii::$app->$db;
        $connection->createCommand()->insert($table, $data)->execute();
    }

    public static function batchInsertSomeData($db, $table, $field, $data) {
        $connection = \Yii::$app->$db;
        $connection->createCommand()->batchInsert($table, $field, $data)->execute();
    }

    public static function updateSomeData($db, $table, $where, $data) {
        $connection = \Yii::$app->$db;
        return $connection->createCommand()->update($table, $data, $where)->execute();
    }

    public static function deleteSomeData($db, $table, $param) {
        $connection = \Yii::$app->$db;
        return $connection->createCommand()->delete($table, $param)->execute();
    }
}