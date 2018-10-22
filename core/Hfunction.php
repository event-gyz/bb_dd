<?php

namespace app\core;

use Yii;


class Hfunction
{
    /**
     * 转换询单状态
     */   
    public static function switchStatus($status) {
        switch ($status) {
            case 'new':
                return Yii::t('app', 'Draft');
            case 'ing':
                return Yii::t('app', 'Requesting');
            case 'close':
                return Yii::t('app', 'Close');
            case 'overtime':
                return Yii::t('app', 'Overtime');
            case 'createorder':
                return Yii::t('app', 'Createorder');
            default :
                return '';
        }
    }
    
    /**
     * 转换需求项
     */   
    public static function switchDemands($content) {
        $key = explode(',', $content);
        $values = [];
        foreach( $key as $value ){
            $values[] = Yii::$app->params['demands_type'][$value];
        }
        return implode(',', $values);
    }

}
