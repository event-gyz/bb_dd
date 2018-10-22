<?php

namespace app\core;

use Yii;
use app\core\HActiveRecord;

class Sendmsg extends HActiveRecord
{
        
    const SMS_SERVICE = "Sms_service";
    const MAIL_SERVICE = "Mail_service";

    /*
     * 发送邮件
     */
    public static function sendEmail($number='',$title='',$content=''){
        $client = static::getRpcClient(self::MAIL_SERVICE,'messageRpc');
        $mail_receiver = $number;
        $mail_title = $title;
        $mail_body = "<html>$content</html>";
        $result = $client->send($mail_receiver,$mail_title,$mail_body);
        return $result;
    }
    /*
     * 发送手机信息
     */
    public static function sendPhoneMsg($number='',$content='',$template_id=1){
        $receiver = array($number);//短信接受者
        $contents = array($content);//短信分段内容
        //$template_id = 1;//模板id//$client->SetOpt(YAR_OPT_PACKAGER, "json");
        $client = static::getRpcClient(self::SMS_SERVICE,'messageRpc');
        $result = $client->send($template_id,$contents,$receiver);
        return $result;
    }
    
    /*
     * $type 1:手机   2:邮箱
     */
    public function sendMsg($number='',$content='',$type="",$title=""){
        if($type == 1){
            return $this->sendPhoneMsg($number,$content);
        }
        if($type == 2){
            return $this->sendEmail($number,$title,$content);
        }
        return false;
    }
    
    
    /**
     * 发送验证码是验证手机号
     * @param   string  $phone  手机号
     * @param   string  $model  模块名
     */
    public static function checkSendCode($phone,$model='rfp_'){
        $pattern = Yii::$app->params['phonePattern'];
        $model = $model.$phone;
        if( !preg_match($pattern, $phone) ) {
            return array( 'status'=>-1,'msg'=>'手机号有误' );
        }
        $codeInSession = Yii::$app->session[$model];
        $interval = -1;
        if( !empty( $codeInSession ) ){
            $interval = time() - $codeInSession['sendTime'];
        }
        
        if( $interval != -1 && $interval < 90 ){
            return array( 'status'=>-5,'msg'=>'发送次数过多，请稍候再试' );
        }
        return true;
    }
    
    public static function verifyCode($phone,$model,$code){
        $code = (int)$code;
        $model = "rfp_".$phone;
        $pattern = Yii::$app->params['phonePattern'];
        $codeInSession = Yii::$app->session[$model];
        $interval = -1;
        if( !empty( $codeInSession ) ){
            $interval = time() - $codeInSession['sendTime'];
        }
        $res = array( 'status'=>-9,'msg'=>'验证异常' );
        if( !preg_match($pattern, $phone) ) {
            $res = array( 'status'=>-1,'msg'=>'手机号有误' );
        }else if(!$code){
            $res = array( 'status'=>-2,'msg'=>'请填写验证码' );
        }else if( $code < 100000 || $code > 999999){
            $res = array( 'status'=>-3,'msg'=>'验证码有误' );
        }else if( $interval > 1200 ){
            $res = array( 'status'=>-5,'msg'=>'验证码已失效' );
        }else if( $codeInSession['code'] != $code ){
            $res = array( 'status'=>-7,'msg'=>'验证码错误' );
        }else if( $codeInSession['code'] == $code ){
            return true;
        }
        return $res;
    }
}
