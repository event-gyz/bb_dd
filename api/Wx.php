<?php


class wx_api
{

    public function response($response = [])
    {
        header("Content-type: application/json;charset=utf-8");
        echo json_encode($response,JSON_UNESCAPED_UNICODE );
        exit;
    }
    public $_return = ['errorno' => 0, 'msg' => ''];
    public function getOpenid()
    {
        $code = Yii::$app->request->get('code');
        $appid = "wx3b6f0bfc1a3f213c"; //小程序appid
        $secret = "e6496e468e6c16236e0f8acef7e907e6"; //小程序secret
        $array = $this->getWxSession($appid,$secret,$code);
        if(!isset($array['openid'])){
            $this->_return['errorno'] = $array['errcode'];
            $this->_return['msg']     = '请求失败';
            $this->_return['data']    = $array['errmsg'];
        }else{
            $this->_return['errorno'] = 0;
            $this->_return['msg']     = '请求成功';
            $this->_return['data']    = $array['openid'];
        }
        $this->response($this->_return);
    }
    public function getWxSession($appid,$secret,$code,$grant_type = 'authorization_code'){
        $req_url =
            'https://api.weixin.qq.com/sns/jscode2session?appid='.$appid
            .'&secret='.$secret.'&js_code=' .$code
            .'&grant_type='.$grant_type;
        $json_data = file_get_contents($req_url);
        $arrData = json_decode($json_data,true);
        return $arrData;
    }

}