<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "bbdd_users".
 *
 * @property integer $id
 * @property string $user_name
 * @property string $avatar
 * @property string $level
 * @property integer $is_b
 * @property integer $parent_id
 * @property integer $status
 * @property string $mobile
 * @property string $invitation_code
 * @property string $openid
 * @property string $create_time
 * @property string $update_time
 */
class Users extends \yii\db\ActiveRecord
{

    const constant = '';
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bbdd_users';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['level'], 'string'],
            [['is_b', 'mobile'], 'required'],
            [['is_b', 'parent_id', 'status'], 'integer'],
            [['create_time', 'update_time'], 'safe'],
            [['user_name'], 'string', 'max' => 100],
            [['avatar'], 'string', 'max' => 500],
            [['mobile', 'invitation_code'], 'string', 'max' => 20],
            [['openid'], 'string', 'max' => 50],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_name' => '昵称',
            'avatar' => '头像url',
            'level' => '会员等级',
            'is_b' => '是否有店铺',
            'parent_id' => '上级ID',
            'status' => '状态',
            'mobile' => 'Mobile',
            'invitation_code' => '邀请码',
            'openid' => '微信openid',
            'create_time' => '注册时间',
            'update_time' => '更新时间',
        ];
    }

    public function getHigherLevel($userid){
        return $this->higherLevel($userid);
    }
    public function higherLevel($userid){
        global $userInfos ;
        global $i;
        $i++;
        if(empty($userid)){
            return $userInfos;
        }
        $userInfo = Users::find()->where(['id'=>$userid])->asArray()->one();
        $userInfos[$i]= $userInfo;
        if (!empty($userInfo['parent_id'])){
            $this->getHigherLevel($userInfo['parent_id']);
        }
        return $userInfos;
    }

}
