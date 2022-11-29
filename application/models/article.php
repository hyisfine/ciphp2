<?php
defined("BASEPATH") or exit('No direct script access allowed');

// article表操作

class Article extends CI_Model
{
    // 初始化
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    // 获取所有文章
    function getAllArticles()
    {
        $sql = "select * from article";
        $query = $this->db->query($sql);
        return $query->result();
    }

    // 分页获取文章
    function articlePages($page = 1, $pagesize = 5, $type_id = null)
    {
        $page = empty($page) ? 1 : $page;
        $pagesize = empty($pagesize) ? 5 : $pagesize;
        $start = ($page - 1) * $pagesize;
        if (empty($type_id)) {
            $sql = "select * from article order by adddate desc limit {$start},{$pagesize}";
            $num = "select * from article";
        } else {
            $sql = "select * from article where type_id={$type_id}  order by adddate desc limit {$start},{$pagesize}";
            $num = "select * from article where type_id={$type_id}";
        }
        return [ $this->db->query($sql)->result(),$this->db->query($num)->num_rows()];
    }
    
    // 搜索获取文章
    function searchArticles($page = 1, $pagesize = 5, $content)
    {
        $page = empty($page) ? 1 : $page;
        $pagesize = empty($pagesize) ? 5 : $pagesize;
        $start = ($page - 1) * $pagesize;
        $sql = "select * from article where title like '%{$content}%'  union select * from article where content like '%{$content}%' order by adddate desc  limit {$start},{$pagesize}";
        $num = "select * from article where title like '%{$content}%' union select * from article where content like '%{$content}%'";
        $query = $this->db->query($sql);
        return [ $query->result(),$this->db->query($num)->num_rows()];
    }

    // 获取单个文章
    function getOneArticle($ar_id){
        $sql = "select * from article where ar_id={$ar_id}";
        $query = $this->db->query($sql);
        return $query->row();
    }

    // 获取文章上下文
    function getContext($ar_id){
        $sql2="select * from article where ar_id = (select max(ar_id) from article where ar_id < {$ar_id})"; 
        $sql1="select * from article where ar_id = (select min(ar_id) from article where ar_id > {$ar_id})";
        // 上文
        $query1=$this->db->query($sql1);
        // 下文
        $query2=$this->db->query($sql2);
        return [$query1->row(),$query2->row()];
    }

    // 添加文章
    function submitArticle($type_id,$u_id,$title,$txt_show,$content,$adddate){
        $sql1="INSERT INTO article (type_id, u_id, title, txt_show, content, adddate) VALUES ({$type_id},{$u_id},'{$title}','{$txt_show}','{$content}',{$adddate})";
        if ($this->db->query($sql1)) {
            $sql2="select * from article where adddate={$adddate}";
            $result=$this->db->query($sql2);
            return $result->row();
        }else{
            return false;
        };
    }

}
