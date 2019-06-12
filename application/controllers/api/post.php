<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Post extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->library("web_result");
        $this->load->model("user");
        // 身份验证
        $token = $this->input->get_request_header("token");
        if (empty($token)) {
            $this->web_result->response(false, "无权限访问！");
        }
        if (!$this->user->verifyPiv($token)) {
            $this->web_result->response(false, "无效token！");
        }
    }

    // 图片上传返回上服务器地址
    function uploadImg(){
        
        $upload_path='./static/img/'.date("Ymd",time());
        if(!file_exists($upload_path)){
            mkdir($upload_path);
        }

        $config['upload_path']      = $upload_path;
        $config['allowed_types']    = 'gif|jpg|png';
        $config['max_size']     = 2048;
        $config["file_name"]=time();

        $this->load->library('upload', $config);
        $path=config_item('base_url').explode('.',$upload_path,2)[1]."/";

        if ( ! $this->upload->do_upload('img'))
        {
            $error = array('error' => $this->upload->display_errors());

           $this->web_result->response(false,$error);
        }
        else
        {
            $data = $this->upload->data();

            $this->web_result->response(true,"上传成功！",$path.$data["file_name"]);
        }

    }

    // 图片删除
    function deleteImg(){
        $src=".".explode("com",$_POST["src"],2)[1];
        
        if(file_exists($src)){
            if (unlink($src)) {
                # code...
                echo "ok";
            }else{
                echo "no";
            }
        }
    }

    // 添加type
    function addType(){
        $this->load->model("type");
        $newtype=$_GET["newtype"];
        // echo $newtype;
        $result=$this->type->addType($newtype);
        $this->web_result->response(true,"添加成功！",$result);
    }

    // 添加文章
    function submitArticle(){
        $this->load->model("article");
        $u_id=$_POST["u_id"];
        $adddate=$_POST["adddate"];
        $content=$_POST["content"];
        $title=$_POST["title"];
        $type_id=$_POST["type_id"];
        $txt_show=$_POST["txt_show"];

        $result= $this->article->submitArticle($type_id,$u_id,$title,$txt_show,$content,$adddate);
        $this->web_result->response(true,"添加成功！",$result);

    }
}