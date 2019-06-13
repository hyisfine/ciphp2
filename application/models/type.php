<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Type extends CI_Model
{
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    // 返回所有课程type  
    function getAllArticleType()
    {
        $sql = "select * from type where index_=1";
        $query = $this->db->query($sql);
        return [$query->result(), $query->num_rows()];
    }
    // 返回所有小贴士type  
    function getAllTipsType()
    {
        $sql = "select * from type where index_=2";
        $query = $this->db->query($sql);
        return [$query->result(), $query->num_rows()];
    }

    // 返回一个type
    function getOneType($type_id)
    {
        $sql = "select * from type where type_id={$type_id} and index_=1 ";
        $query = $this->db->query("$sql");
        return $query->row();
    }

    // 添加type 并返回
    function addType($name)
    {
        $sql1 = "insert into type(type_name,index_) VALUES('{$name}',1)";
        $sql2 = "select * from type where type_name='{$name}' and index_=1";
        if ($this->db->query($sql1)) {
            return $this->db->query($sql2)->row();
        };
        return $this->db->query($sql1);
    }
}
