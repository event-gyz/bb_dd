<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "bbdd_withdrawals".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $total_amount
 * @property integer $status
 * @property string $note
 * @property string $create_time
 * @property string $update_time
 */
class Withdrawals extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'bbdd_withdrawals';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'status'], 'integer'],
            [['total_amount', 'status', 'note'], 'required'],
            [['total_amount'], 'number'],
            [['create_time', 'update_time'], 'safe'],
            [['note'], 'string', 'max' => 2000],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'total_amount' => 'Total Amount',
            'status' => 'Status',
            'note' => 'Note',
            'create_time' => '创建时间',
            'update_time' => 'Update Time',
        ];
    }
}
