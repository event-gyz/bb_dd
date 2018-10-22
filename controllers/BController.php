<?php
/**
 * Created by PhpStorm.
 * User: chunyang
 * Date: 16/7/3
 * Time: 下午4:40
 */

namespace app\controllers;

use Yii;
use yii\web\Controller;

class BController extends Controller {
    public $company_id;
    public $user_id;

    public function __construct($id, $module, $config = []) {
        parent::__construct($id, $module, $config = []);
        if (Yii::$app->user->isGuest) {
            header('Location: /site/login');
            exit;
        }

        $this->__init();

    }

    // 初始化一些参数
    private function __init() {

        // 菜单高亮使用
        $menu_id = Yii::$app->request->get('menu_id');
        if (!empty($menu_id)) {
            $_SESSION['menu_id'] = $menu_id;
        }
    }

    public function beforeAction($action) {
        parent::beforeAction($action);
        $permission = \app\core\Permission::checkAccess();

        if (!$permission) {
            throw new \yii\web\HttpException(403, "您没有该功能权限");
        }
        return true;
    }

}
