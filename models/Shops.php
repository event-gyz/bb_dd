<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "bbdd_shops".
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $status
 * @property string $license_url
 * @property string $real_name
 * @property string $id_card_nu
 * @property string $id_card_url
 * @property string $create_time
 * @property string $update_time
 */
class Shops extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bbdd_shops';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'status'], 'integer'],
            [['license_url'], 'required'],
            [['create_time', 'update_time'], 'safe'],
            [['license_url', 'id_card_url'], 'string', 'max' => 200],
            [['real_name'], 'string', 'max' => 100],
            [['id_card_nu'], 'string', 'max' => 20],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => '关联的用户ID',
            'status' => '状态，默认1 可用 ',
            'license_url' => 'License Url',
            'real_name' => '法人姓名',
            'id_card_nu' => '身份证号',
            'id_card_url' => '身份证图片',
            'create_time' => '创建时间',
            'update_time' => '更新时间',
        ];
    }
}
