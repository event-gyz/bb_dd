<?php

use app\models\Admin;
use app\models\Users;
use yii\base\Exception;
use yii\helpers\ArrayHelper;
use app\libraries\MyUtil;
class test_api {
    
    private $list = [];
    private $msg  = '成功';

    public $_return = ['errorno' => 0, 'msg' => ''];

    public function response($response = [])
    {
        header("Content-type: application/json;charset=utf-8");
        echo json_encode($response,JSON_UNESCAPED_UNICODE );
        exit;
    }



    public function test(){
        //获取邀请码
//        $invitation_code = MyUtil::make_invitation_code();

        //获取上级 key从1开始 key=1 是用户本身
//        $usermodel = new Users();
//        $higherLevelUser = $usermodel->getHigherLevel($userId);

        try{
            $a = ! empty(Yii::$app->request->get('a')) ? Yii::$app->request->get('a') : '';
            if( $a<1 ){
                throw new \Exception('a只能是正整数');
            }
            $modle = new \app\models\test();
            $this->response([ 'errorno'=>0,'data'=>array_values($modle->test($a)) ]);
        }catch(\Exception $e){
            $this->response([ 'errorno'=>$e->getCode() ?: -99 ,'msg'=>$e->getMessage() ]);
        }
    }


}