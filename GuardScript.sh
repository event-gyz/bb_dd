#!/bin/bash
# 监视  脚本
# 目的 保持进程稳定性
# 主流程 1、<判断进程是否存在>(N)开启.(Y)<看进程是否僵死>||<运行时间超过一定时限>(Y)kill掉并重启(N)不处理
# 服务器变量 需要修改变量phpBin phpCli logfile
# 运行命令 sh GuardScript.sh 脚本名

phpBin="/usr/local/php/bin/php"
cmdDir="/www/Web/"
phpCli="index.php"
logfile="/www/ebooking/temp/"
selfName=$0
scriptName=$1
psinfo=`ps aux | grep "$scriptName" | grep -v "grep" | grep -v "$selfName" | wc -l`
if [ $psinfo -gt 0 ];then
    #已运行
    echo run "$scriptName"
    #判断脚本状态是否僵死
    pstatus=`ps aux | grep "$scriptName" | grep -v "grep" | grep -v "$selfName" | awk '{print $8}'`
    echo "$scriptName" status:"$pstatus"
    if [[ $pstatus == Z* ]];then
        echo kill "$scriptName" and reload "$scriptName"
        #杀死脚本 并重启
        ps aux | grep "$scriptName"  | grep -v grep | grep -v "$selfName" | awk '{print $2}'| xargs kill -9 &&
        cd $cmdDir
        ($phpBin $phpCli $scriptName >> $logfile$scriptName".log") &
    fi
else
    #未运行 启动脚本
    echo no run "$scriptName"
    cd $cmdDir
    ($phpBin $phpCli $scriptName >> $logfile$scriptName".log") &
fi
exit
