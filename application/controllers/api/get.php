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

    // 获取所有articletype
    function getAllArticleType()
    {
        $result= $this->type->getAllArticleType();
        $this->web_result->response(true, "获取成功！",$result[0],$result[1] );
    }
    
    // 获取所有tipstype
    function getAllTipsType()
    {
        $result= $this->type->getAllTipsType();
        $this->web_result->response(true, "获取成功！",$result[0],$result[1] );
    }

    // 获取所有type
    function getAllType(){
        $result= $this->type->getAllType();
        $this->web_result->response(true, "获取成功！", $result[0],$result[1]);

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
        
    // 获取所有tips数据
    function getAllTips()
    {
        $this->load->model("tips");
        // 获取分页数据
        $result=$this->tips->getAllTips();
        $this->web_result->response(true, "获取成功！",$result[0],$result[1] );
        
    }

    function getOneTip(){
        $t_id=$_GET["t_id"];
        $this->load->model("tips");
        $result=$this->tips->getOneTip($t_id);
        $this->web_result->response(true, "获取成功！",$result );
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

    function getAll(){
        $this->load->database();
        $timeup=$_GET["timeup"];
        $timefloor=$_GET["timefloor"];
        $sql = "SELECT ar_id,type_id,title,adddate FROM article where adddate>={$timeup} and adddate<{$timefloor}  UNION  SELECT t_id,type_id,title,adddate FROM tips where adddate>={$timeup} and adddate<{$timefloor} order by adddate desc";
        $query = $this->db->query($sql);
        $this->web_result->response(true, "获取成功！", $query->result());
    }

    function getAllCount(){
        $this->load->database();
        $sql = "SELECT ar_id id,type_id,title,adddate FROM article  UNION  SELECT t_id id,type_id,title,adddate FROM tips order by adddate desc";
        $query = $this->db->query($sql);
        $this->web_result->response(true, "获取成功！", $query->num_rows());
    }
}
