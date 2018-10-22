<?php

namespace app\commands;

use yii;
use yii\base\Exception;
use yii\console\Controller;
use app\models\Order;
use app\models\EbookingInventory;
use yii\log\FileTarget;

class OrderController extends Controller
{
    public $time;
    public $log;
    public function actionCancle()
    {
        $t                  = microtime(true);
        $this->time         = time()-1800;
        $this->log          = new FileTarget();
        $this->log->logFile = Yii::$app->getRuntimePath() . '/logs/'.date('Y-m-d').'-cancleOrder.log';
        
        //获取要取消的订单
        $sql = 'SELECT order_id,is_over FROM '.Order::tableName().' WHERE is_pay=0 AND order_status=2 AND order_type!=3 AND update_time!=0 AND update_time<='.$this->time;
        $order = Yii::$app->db->createCommand($sql)->queryAll();
        if (empty($order)) {
            $this->log->messages[] = ['无处理记录', 2, 'cancleOrder', $t];
            $this->log->export();
            exit;
        } else {
            $this->log->messages[] = ['开始处理....', 2, 'cancleOrder', $t];
            $this->log->export();
        }
        
        //取消操作每天订单记录
        foreach ($order as $key=>$value) {
            $t                   = microtime(true);
            $numbers             = json_decode($value['is_over'], 1);
            $this->log->messages = '';
            
            if(empty($numbers)) {
               continue;
            }
            
            $transaction = Yii::$app->db->beginTransaction();       //开启事务
            try {
                //退库存
                foreach ($numbers as $k=>$v) {
                    if ($v['number'] > 0) {
                        $sql = 'UPDATE '.EbookingInventory::tableName().' SET surplus=surplus+'.$v['number'].' WHERE id='.$v['id'].' AND daytime='.$v['daytime'];
                        $affectedRows = Yii::$app->db->createCommand($sql)->execute();
                        if($affectedRows != 1) {
                            throw new Exception('更新剩余库存错误订单ID:'.$value['order_id'].'-库存ID:'.$v['id']);
                        }
                    }
                    if ($v['overNumber'] > 0) {
                        $sql = 'UPDATE '.EbookingInventory::tableName().' SET overbooking=overbooking+'.$v['overNumber'].' WHERE id='.$v['id'].' AND daytime='.$v['daytime'];
                        $affectedRows = Yii::$app->db->createCommand($sql)->execute();
                        if($affectedRows != 1) {
                            throw new Exception('更新超卖库存错误ID:'.$value['order_id'].'-库存ID:'.$v['id']);
                        }
                    }
                }
                //更新状态
                $sql = 'UPDATE '. Order::tableName() .' SET order_status=4,order_type=3,update_time='.time().' WHERE order_id= '.$value['order_id'].' AND is_pay=0 AND order_type!=3 AND order_status=2';
                $affectedRows = Yii::$app->db->createCommand($sql)->execute();
                if($affectedRows != 1) {
                    throw new Exception('更新订单状态失败'.$value['order_id']);
                }
                
                $this->log->messages[] = ['订单处理成功,订单ID:'.$value['order_id'], 2, 'cancleOrder', $t];
                $transaction->commit();                                 //提交事务
            } catch (Exception $e) {
                //写入日志
                $this->log->messages[] = [$e->getMessage(), 2, 'cancleOrder', $t];
                $transaction->rollBack();                               //回滚事务
            }
            $this->log->export();                                       //记录日志
        }
        $t                     = microtime(true);
        $this->log->messages   = '';
        $this->log->messages[] = ['结束处理', 2, 'cancleOrder', $t];
        $this->log->export();
        //结束
    }
}