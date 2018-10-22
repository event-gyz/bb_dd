<?php

/* @var $this yii\web\View */
/* @var $name string */
/* @var $message string */
/* @var $exception Exception */

use yii\helpers\Html;

$this->title = 404;
?>
<div class="middle-box text-center animated fadeInDown">
        <h1 style="font-size:170px;" class="fm-n fw-1"><?= Html::encode($this->title) ?></h1>
        <h3 class="font-bold"> <?= nl2br(Html::encode($message)) ?></h3>

        <div class="error-desc">
            抱歉，页面好像去火星了~!
        </div>
    </div>