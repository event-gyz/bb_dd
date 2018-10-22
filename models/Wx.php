<?php
namespace app\models;

header("Content-type: text/html; charset=utf-8");


class Wx
{
    //构造函数，获取Access Token
    public function __construct()
    {

    }

    function wxpay($url, $obj, $cert = false)
    {
        $obj['nonce_str'] = $this->create_noncestr();
        $stringA = $this->formatQueryParaMap($obj, false);
        $stringSignTemp = $stringA . "&key=" . '8gay3i7el1owp1glu8tn27kzdzd04op2';
        $sign = strtoupper(md5($stringSignTemp));
        $obj['sign'] = $sign;
        file_put_contents('./php.log', json_encode($obj). "\r\n", FILE_APPEND);
        $postXml = $this->arrayToXml($obj);
        $responseXml = $this->http_request($url, $postXml, $cert);
        return $responseXml;
    }

    function wxpaysign($obj)
    {
        $obj['timeStamp'] = strval(time());
        $obj['nonceStr'] = $this->create_noncestr();
        $obj['signType'] = "MD5";
        $stringA = $this->formatQueryParaMap($obj, false);
        $stringSignTemp = $stringA . "&key=" . '8gay3i7el1owp1glu8tn27kzdzd04op2';
        $obj['paySign'] = strtoupper(md5($stringSignTemp));
        return $obj;
    }

    function create_noncestr($length = 32)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ( $i = 0; $i < $length; $i++ )  {
            $str.= substr($chars, mt_rand(0, strlen($chars)-1), 1);
        }
        return $str;
    }

    function formatQueryParaMap($paraMap, $urlencode)
    {
        $buff = "";
        ksort($paraMap);
        foreach ($paraMap as $k => $v){
            if (null != $v && "null" != $v && "sign" != $k) {
                if($urlencode){
                    $v = urlencode($v);
                }
                $buff .= $k . "=" . $v . "&";
            }
        }
        $reqPar;
        if (strlen($buff) > 0) {
            $reqPar = substr($buff, 0, strlen($buff)-1);
        }
        return $reqPar;
    }

    //数组转XML
    function arrayToXml($arr)
    {
        $xml = "<xml>";
        foreach ($arr as $key=>$val)
        {
            if (is_numeric($val)){
                $xml.="<".$key.">".$val."</".$key.">";
            }else{
                $xml.="<".$key."><![CDATA[".$val."]]></".$key.">";
            }
        }
        $xml.="</xml>";
        return $xml;
    }

    //将XML转为array
    function xmlToArray($xml)
    {
        //禁止引用外部xml实体
        libxml_disable_entity_loader(true);
        $values = json_decode(json_encode(simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
        return $values;
    }

    //带证书的post请求
    function http_request($url, $fields = null, $cert = true)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,false);
        if ($cert){
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {	//Windows
                curl_setopt($ch, CURLOPT_SSLCERT, dirname(__FILE__).'cert'.DIRECTORY_SEPARATOR.'apiclient_cert.pem');
                curl_setopt($ch, CURLOPT_SSLKEY, dirname(__FILE__).'cert'.DIRECTORY_SEPARATOR.'apiclient_key.pem');
                curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__).'cert'.DIRECTORY_SEPARATOR.'rootca.pem');
            }else{                        //LINUX
                curl_setopt($ch, CURLOPT_SSLCERT, 'cert'.DIRECTORY_SEPARATOR.'apiclient_cert.pem');
                curl_setopt($ch, CURLOPT_SSLKEY, 'cert'.DIRECTORY_SEPARATOR.'apiclient_key.pem');
                curl_setopt($ch, CURLOPT_CAINFO, 'cert'.DIRECTORY_SEPARATOR.'rootca.pem');
            }
        }
        if (!empty($fields)){
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        }
        $data = curl_exec($ch);
        if(!$data){echo "CURL ErrorCode: ".curl_errno($ch);}
        curl_close($ch);
        return $data;
    }
}

?>