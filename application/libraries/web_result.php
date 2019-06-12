<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Web_result
{
    // 页面跳转
    function jump($msg, $url)
    {
        echo "<h1 style='position:relative;top:30px;left:30px'>{$msg}</h1>";
        header("refresh:2;url={$url}");
        die();
    }

    // 返回格式
    function response($status, $msg,  $data = array(),$count=null)
    {
        $result = array(
            'status' => $status,
            '$msg' => $msg,
        );

        if (!$status) {
            echo json_encode($result);
            die();
        }

        if(!empty($count)){
            $result["count"]=$count;
        }
        $result["data"] = $data;

        echo json_encode($result,JSON_UNESCAPED_SLASHES);
        die();
    }
}


