<?php

namespace app\controllers;

use app\models\Login;
use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\EbookingUser;
use app\models\ContactForm;
use app\models\RfpRequestForProposal;
use app\models\Order;
use yii\captcha\CaptchaAction;

class SiteController extends Controller
{
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['get'],
                ],
            ],
        ];
    }

    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
                'minLength' => 4,
                'maxLength' => 4,
                'height' => 47,
                'width' => 80
            ],
        ];
    }

    public function actionIndex()
    {

        if (\Yii::$app->user->isGuest) {
            return $this->redirect('/site/login');
        } else {
            return $this->redirect('/resource');
        }

    }
    public static function randColor(){
        $colors = array();
        for($i = 0;$i<6;$i++){
            $colors[] = dechex(rand(0,15));
        }
        return implode('',$colors);
    }
    
    public function actionLogin()
    {
        if (!\Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new Login();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goHome();
        }

        //替换布局文件
        $this->layout = 'empty';

        return $this->render('login', [
            'model' => $model,
        ]);
    }

    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->redirect('/site/login');
    }
}
