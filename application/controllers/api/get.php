<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Get extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->library("web_result");
        $this->load->model("user");
        $this->load->model("article");
        $this->load->model("type");
        $this->load->helper("cookie");
        $this->load->library('session');
        // 身份验证
        $token = $this->input->get_request_header("token");
        if (empty($token)) {
            $this->web_result->response(false, "无权限访问！");
        }
        if (!$this->user->verifyPiv($token)) {
            $this->web_result->response(true, "无效token！",[$token,$_SESSION]);
        }
    }

    // 获取当前登录用户名字
    function getNowUserID(){
        $token=get_cookie("u_token");
        $piv=get_cookie("u_piv");
        $this->web_result->response(true, "获取成功",$this->user->getNowUserID($token,$piv));
    }

    // 获取所有type
    function getAllType()
    {
        $result= $this->type->getAllType();
        $this->web_result->response(true, "获取成功！",$result[0],$result[1] );
    }

    // 获取某个type
    function getOneType(){
        $type_id=$_GET["type_id"];
        $result= $this->type->getOneType($type_id);
        $this->web_result->response(true, "获取成功！",$result );
    }
    
    // 获取分页文章数据
    function articlePages()
    {
        $this->load->model("article");
        // 获取分页数据
        $page=isset($_GET["page"])?$_GET["page"]:1;
        $pagesize=isset($_GET["pagesize"])?$_GET["pagesize"]:5;
        $type_id=isset($_GET["type_id"])?$_GET["type_id"]:null;
        $result=$this->article->articlePages($page,$pagesize,$type_id);
        $this->web_result->response(true, "获取成功！",$result[0],$result[1] );
        
    }
    
    // 获取搜索内容的文章
    function  searchArticles(){

        // 获取分页数据
        $page=isset($_GET["page"])?$_GET["page"]:1;
        $pagesize=isset($_GET["pagesize"])?$_GET["pagesize"]:5;
        $content=isset($_GET["content"])?$_GET["content"]:"";
        $result=$this->article->searchArticles($page,$pagesize,$content);
        $this->web_result->response(true, "获取成功！",$result[0],$result[1] );
        
    }

    // 获取单个文章 
    function getOneArticle(){
        $ar_id=$_GET["ar_id"];
        $result=$this->article->getOneArticle($ar_id);
        $this->web_result->response(true, "获取成功！", $result );
    }

    // 获取上下文 
    function getContext(){
        $ar_id=$_GET['ar_id'];
        $result=$this->article->getContext($ar_id);
        $this->web_result->response(true, "获取成功！", $result );
    }


}
