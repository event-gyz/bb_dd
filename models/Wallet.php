<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "bbdd_wallet".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $balance
 * @property string $bank_name
 * @property string $bank_card_no
 * @property string $bank_cart_name
 * @property string $password
 * @property string $create_time
 * @property string $update_time
 */
class Wallet extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bbdd_wallet';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id'], 'integer'],
            [['balance'], 'required'],
            [['balance'], 'number'],
            [['create_time', 'update_time'], 'safe'],
            [['bank_name'], 'string', 'max' => 200],
            [['bank_card_no'], 'string', 'max' => 50],
            [['bank_cart_name', 'password'], 'string', 'max' => 100],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => '用户ID',
            'balance' => '余额',
            'bank_name' => '开户行名称',
            'bank_card_no' => '银行卡号',
            'bank_cart_name' => '银行卡名字',
            'password' => '提现密码',
            'create_time' => 'Create Time',
            'update_time' => 'Update Time',
        ];
    }
}
