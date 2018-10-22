<?php

namespace app\models;

use Yii;
use yii\base\Model;

/**
 * This is the model class for table "ebooking_user".
 *
 * @property integer $user_id
 * @property integer $group_id
 * @property string $username
 * @property string $password
 * @property string $phone
 * @property integer $createtime
 */
class Login extends Model
{
    public $username;
    public $password;
    public $rememberMe = true;
    public $verifyCode;

    private $_user = false;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['username', 'required'],
            ['password', 'required'],
            ['rememberMe', 'boolean'],
            ['password', 'validatePassword'],
            ['verifyCode', 'captcha'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'user_id' => '用户id',
            'group_id' => '分组id 1=超管 2=一般用户',
            'username' => '用户名',
            'password' => '密码',
            'phone' => '用户手机号',
            'createtime' => '创建时间',

            'verifyCode' => '验证码',
        ];
    }

    /**
     * Validates the password.
     * This method serves as the inline validation for password.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePassword($attribute, $params)
    {
        if (!$this->hasErrors()) {
            $user = $this->getUser();

            if (!$user || !$user->validatePassword($this->password)) {
                $this->addError($attribute, '用户名或密码错误.');
            }
        }
    }

    /**
     * Finds user by [[username]]
     *
     * @return Admin|null
     */
    public function getUser()
    {
        if ($this->_user === false) {
            $this->_user = Admin::findByUsername($this->username);
        }

        return $this->_user;
    }

    public function login()
    {
        if ($this->validate()) {
            ini_set( 'gc_maxlifetime', $this->rememberMe ? 3600*24*30 : 0 );
            return Yii::$app->user->login($this->getUser(), $this->rememberMe ? 3600*24*30 : 0);
        }
        return false;
    }
}
