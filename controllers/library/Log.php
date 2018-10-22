<?php

namespace app\library;

use Yii;
use app\models\ActionLog;

/**
 * ActionLogController implements the CRUD actions for ActionLog model.
 */
class Log
{
    const NOCHECK = 'pre_data';
    private static  $staticParams = ['business_id', 'company_id', 'pre_data', 'cur_data', 'user_id', 'user_real_name'];
    /**
     * 日志插入方法
     * @auth  paradise
     * @param $business_id      业务id(必填)
     * @param $message          日志信息(必填)
     * @param $company_id       公司id(必填)
     * @param $user_id          操作人id(必填)
     * @param $user_real_name   操作人名称
     * @param $pre_data         操作前内容
     * @param $cur_data         操作后内容
     */
    public function log($business_id, $message, $company_id, $user_id, $user_real_name = '', $pre_data = '', $cur_data = ''){
        $params = [];

        $params['business_id']      = trim($business_id);
        $params['message']          = trim($message);
        $params['user_id']          = trim($user_id);
        $params['user_real_name']   = trim($user_real_name);
        $params['company_id']       = trim($company_id);
        $params['pre_data']         = trim($pre_data);
        $params['cur_data']         = trim($cur_data);
        $params['log_time']         = time();

        $model = new ActionLog();
        $model->insertLog($params);
    }
}
