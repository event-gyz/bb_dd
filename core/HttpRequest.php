<?php
namespace app\core;
use Yii;

class HttpRequest
{
    protected $_request_time_out = 30;//超时时间(秒)
    protected $_throw_exception = true;//是否抛出异常
    protected $_get_response_header = false;//是否获取返回的header信息
    protected $_get_reposnse_no_body = false;//是否不获取返回的信息主体(一般在只获取header信息的情况下才设置为true)
    function __construct(){
        
    }
    
    function __set($property_name, $value){
        $this->$property_name = $value;
    }
    
    
    /**
     * @author yichen
     * @param  sting   $url    请求的地址
     * @param  sting   $method 请求方式
     * @param  array   $data   发送的请求数据(method为post时生效)
     * @param  array   $header 生成请求的头部信息
     * @throws  SystemError    系统级错误
     * @return string
     */
    public function send($url,$method,$data = array(),$header = array()){
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_NOBODY,$this->_get_reposnse_no_body);
        if('post'===$method){
            curl_setopt($ch,CURLOPT_POST,1);
            if(!empty($data) && is_array($data)) curl_setopt($ch,CURLOPT_POSTFIELDS,http_build_query($data));
        }else{
            curl_setopt($ch,CURLOPT_POST,0);
        }
        curl_setopt($ch,CURLOPT_HEADER,$this->_get_response_header);
        if(!empty($header) && is_array($header)) curl_setopt($ch,CURLOPT_HTTPHEADER,$this->makeHeader($header));
        curl_setopt($ch,CURLOPT_TIMEOUT,$this->_request_time_out);
        $response = curl_exec($ch);
        $curl_errno = curl_errno($ch);
        curl_close($ch);


        return $response;
    }

    public function makeHeader($header_array){
        $real_header = array();
        if (!empty($header_array)) {
            foreach ($header_array as $k => $v) {
                $real_header[] = $k . ':' . $v;
            }
        }
        return $real_header;
    }


}