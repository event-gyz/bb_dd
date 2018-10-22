<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use yii\captcha\Captcha;

?>

<div class="row">
    <div class="col-md-3 col-md-offset-4 col-sm-6 col-sm-offset-3">
        <div class="panel panel-default">

            <div class="panel-body" style="margin-bottom: 20px;">
                <?php $form = ActiveForm::begin([
                    /*'id' => 'login-form',
                    'options' => ['class' => 'form-horizontal'],
                    'fieldConfig' => [
                        'template' => "{label}\n<div class=\"col-lg-3\">{input}</div>\n<div class=\"col-lg-8\">{error}</div>",
                        'labelOptions' => ['class' => 'col-lg-1 control-label'],
                    ],*/
                ]); ?>

                <div class="form-group">
                    <div class="col-md-12">
                        <?= $form->field($model, 'username')->textInput(['autofocus' => true])->label('用户名') ?>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-12">
                    <?= $form->field($model, 'password')->passwordInput()->label(Yii::t('app', 'Password')) ?>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-12">
                        <?= $form->field($model, 'verifyCode')->widget(Captcha::className(), [
                            'template' => '<div class="row"><div class="col-lg-6">{input}</div><div class="col-lg-3">{image}</div></div>',
                        ]) ?>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-12">
                    <?= $form->field($model, 'rememberMe')->label(Yii::t('app', 'RememberMe'))->checkbox() ?>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-6" style="margin-bottom:15px">
                        <?= Html::submitButton(Yii::t('app', 'Login'), ['class' => 'btn btn-primary btn-block', 'name' => 'login-button']) ?>
                    </div>
                </div>

                <?php ActiveForm::end(); ?>
            </div>
        </div>
    </div>
</div>
