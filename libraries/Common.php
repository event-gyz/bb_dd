<?php
namespace app\libraries;
use Yii;
class Common{
    
    const SMS_SERVICE  = "Sms_service";
    const MAIL_SERVICE = "Mail_service";
    /**
     * @param        $business_id 业务唯一ID 例如场地ID  必传参数
     * @param        $business_type 业务类型            必传参数
     * @param        $user_id 用户ID                   必传参数
     * @param string $message 日志信息
     * @param array $pre_data  数据变更前               二维数组
     * @param array $cur_data  数据变更后               非必填 若是新增数据,将数据Json之后存在这个字段  二维数组
     * @throws SystemError
     * @return mixed
     */
    public static function logdata($params) {
        // 必要参数不可为空
        if (empty($params['business_id']) ) {
            $params['business_id'] = 0;
            throw new \Exception('business_id为空');
        }
        if (empty($params['business_type']) ) {
            throw new \Exception('business_type为空');
        }
        // 必要参数不可为空
        if ( empty($params['user_id'])) {
            throw new \Exception('user_id为空');
        }
        $data = array(
            'business_id' => $params['business_id'],
            'business_type' => $params['business_type'],
            'user_id' => $params['user_id'],
        );
        if (!empty($params['message'])) {
            $data['message'] = $params['message'];
        }

        if (!empty($params['pre_data'])) {
            $data['pre_data'] = json_encode($params['pre_data'], JSON_UNESCAPED_UNICODE);
        }

        if (!empty($params['cur_data'])) {
            $data['cur_data'] = json_encode($params['cur_data'],JSON_UNESCAPED_UNICODE);
        }

        $connection = Yii::$app->db; //连接

        return $connection->createCommand()->insert('action_log',$data)->execute();
    }
    

    public static function getRPC($service = "") {
        $service = $service ? $service : self::SMS_SERVICE;
        return YII::$app->params['link']['messageRpc'] . "?svc=" . $service;
    }

    /**
     * 
     * @param String $number    收件邮箱
     * @param String $title     邮件标题
     * @param String $content   邮件内容
     * @return mixed
     */
    public static function sendEmail($number = '', $title = '', $content = '') {
        if( !preg_match( Yii::$app->params['emailPattern'],$number ) ){
            return [ 'errorno'=>-1,'msg'=>'邮箱格式有误' ];
        }
        $client = new \Yar_Client(self::getRPC(self::MAIL_SERVICE));
        $client->SetOpt(YAR_OPT_CONNECT_TIMEOUT, 1000);
        $mail_receiver = $number;
        $mail_title    = $title;
        $mail_body     = "<html>$content</html>";
        try{
            $result        = $client->send($mail_receiver, $mail_title, $mail_body);
        }catch(\Exception $e){
            return [ 'errorno'=>-3,'msg'=>$e->getMessage() ];
        }
        
        return [ 'errorno'=>$result,'msg'=>'' ];
    }

    /**
     * 
     * @param String $number        手机号
     * @param String $content       短信内容
     * @param int    $template_id   短信模板
     * @return mixed
     */
    public static function sendPhoneMsg($number = '', $content = '', $template_id = 1) {
        if( !preg_match( Yii::$app->params['phonePattern'],$number ) ){
            return [ 'errorno'=>-1,'msg'=>'手机号码格式有误' ];
        }
        $client = new \Yar_Client(self::getRPC());
        $client->SetOpt(YAR_OPT_CONNECT_TIMEOUT, 1000);
        $receiver = array($number);//短信接受者
        $contents = array($content);//短信分段内容
        try{
            $result   = $client->send($template_id, $contents, $receiver);
        }catch(\Exception $e){
            return [ 'errorno'=>-3,'msg'=>$e->getMessage() ];
        }
        
        return [ 'errorno'=>$result,'msg'=>'' ];
    }
    
    /**
     * 订单编号
     * @param string $prefix   编号前缀,必须参数,支持的参数是keys里面
     * @return boolean|string  
     */
    public static function getUniqueID($prefix='F'){
        
        $keys = [
            'F'=>'tmc_flight_orders',
            'H'=>'tmc_hotel_orders',
            'T'=>'tmc_train_orders',
        ];
        if( !isset($keys[$prefix]) ){
            return false;
        }
        $tableName = $keys[$prefix];
        $maxId = (new \yii\db\Query)->from($tableName)->max('id');
        $maxId = $maxId ? $maxId+1 : 1;
        return $prefix.date("Ymd").str_pad($maxId,6,"0",STR_PAD_LEFT);
    }
    /**
     * xml转化成数组
     * @param string $xml
     * @return []
     */
    public static function xmlToArray($xml){
        libxml_disable_entity_loader(true);
        $xmlstring = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA);
        $val = json_decode(json_encode($xmlstring),true);
        return $val;
    }
    
    /**
     * 
     * @param [latitude,longitude]  或者字符串 $origin
     * @param [latitude,longitude]  或者字符串 $endPoint
     * @param int $unit             1:米 2:公里
     * @param int $decimal          精度 保留小数位数
     * @return type
     */
    public static function getDistance($origin,$endPoint,$unit=2, $decimal=2){
        is_array($origin) ?: $origin = explode(',', $origin);
        is_array($endPoint) ?: $endPoint = explode(',', $endPoint);
        list($latitude1,$longitude1) = $origin;
        list($latitude2,$longitude2) = $endPoint;
        $EARTH_RADIUS = 6370.996; // 地球半径系数
        $PI = 3.1415926;

        $radLat1 = $latitude1 * $PI / 180.0;
        $radLat2 = $latitude2 * $PI / 180.0;

        $radLng1 = $longitude1 * $PI / 180.0;
        $radLng2 = $longitude2 * $PI /180.0;

        $a = $radLat1 - $radLat2;
        $b = $radLng1 - $radLng2;

        $distance = 2 * asin(sqrt(pow(sin($a/2),2) + cos($radLat1) * cos($radLat2) * pow(sin($b/2),2)));
        $distance = $distance * $EARTH_RADIUS * 1000;

        if($unit==2){
            $distance = $distance / 1000;
        }

        return round($distance, $decimal);
    }
    
    public static function  getIP(){
        return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] :"101.200.213.50";
    }
    
    /**
     * 把信息打印到文件里面，方便调试
     * @param string|array $data
     */
    public static function ht_dump($data){
        $str = is_array($data) ? json_encode($data,JSON_UNESCAPED_UNICODE) : $data;
        $dataStr = date('Y-m-d H:i:s') . '    数据：'. $str . PHP_EOL;
        $dir = Yii::$app->basePath . '/log/';
        if( !is_dir($dir) ){
            mkdir($dir);
        }
        $path = Yii::$app->basePath . '/log/'. date('Y-m-d') . '-request-log.log';
        error_log($dataStr, 3, $path);
    }
    
    public static function getBearer(){
        $authHeader = Yii::$app->request->getHeaders()->get('Authorization');
        $matches = '';
        if ($authHeader !== null && preg_match('/^Bearer\s+(.*?)$/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
    
    public static function getUserInfo(){
        $bearer = self::getBearer();
        if( $bearer ){
            return (array)\Firebase\JWT\JWT::decode($bearer, Yii::$app->params['salt'],['HS256']);
        }
        return false;
    }
    
    public static function filterArray($data,$columns=[]){
        
        foreach($data as $key=>$value){
            if( !in_array($key,$columns) ){
                unset($data[$key]);
            }
        }
        return $data;
    }
    
}