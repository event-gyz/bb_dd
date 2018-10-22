<?php

namespace app\libraries;

class MyUtil {

    // 递归创建多级文件夹
    public static function create_folders($dir) {
        return is_dir($dir) or (self::create_folders(dirname($dir)) and mkdir($dir, 0777));
    }

    // 写入文件完成标识
    public static function write_file_complete_flag($file_path) {

        $dir_name = dirname($file_path);
        if (!is_dir($dir_name)) {
            self::create_folders($dir_name);
        }

        file_put_contents("{$file_path}.json", json_encode(['is_write_complete' => true]));
    }

    // 读取文件完成标识
    public static function read_file_complete_flag($file_path) {

        $json_file_path = "{$file_path}.json";

        if (!is_file($json_file_path)) {
            return false;
        }

        $file_content = file_get_contents($json_file_path);
        if (empty($file_content)) {
            return false;
        }

        $complete_flag = json_decode($file_content, true);
        if (empty($complete_flag)) {
            return false;
        }

        if (!isset($complete_flag['is_write_complete'])) {
            return false;
        }

        if ($complete_flag['is_write_complete'] !== true) {
            return false;
        }

        // 删除.json文件
        unlink($json_file_path);

        return true;
    }

    /**
     * 根据密码和盐生成密码
     *
     * @param $password
     * @param $salt
     *
     * @return string
     */
    public static function generate_admin_password($password, $salt) {
        $toBeEncrypt = $salt . md5($password);
        return md5($toBeEncrypt);
    }

    /**
     * 检查用户提交的密码是否正确
     *
     * @param $userPostPassword
     * @param $dbPassword
     * @param $salt
     *
     * @return bool
     */
    public static function check_admin_password($userPostPassword, $dbPassword, $salt) {
        $encryptUserPostPassword = self::generate_admin_password($userPostPassword, $salt);
        return $dbPassword === $encryptUserPostPassword;
    }

    /**
     * 生成指定长度的随机字符串
     *
     * @param $length
     *
     * @return string
     */
    public static function random_str($length = 4) {
        $output = '';
        for ($a = 0; $a < $length; $a++) {
            $output .= chr(mt_rand(35, 126));
        }
        return $output;
    }

    public static function make_invitation_code(){
        $code="ABCDEFGHIGKLMNOPQRSTUVWXYZ";
        $rand=$code[rand(0,25)].strtoupper(dechex(date('m'))).date('d').substr(time(),-5).substr(microtime(),2,5).sprintf('%02d',rand(0,99));
        // ord（）函数获取首字母的 的 ASCII值
        for($a = md5( $rand, true ),$s = '0123456789ABCDEFGHIJKLMNOPQRSTUV', $d = '', $f = 0; $f < 8; $g = ord( $a[ $f ] ), $d .= $s[ ( $g ^ ord( $a[ $f + 8 ] ) ) - $g & 0x1F ],$f++){

        }
        return $d;
    }


}

