<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Type extends CI_Model{
    function __construct()
    {
        $this->load->database();
    }

    // 返回所有课程type  
    function getAllType(){
        $sql="select * from type";
        $query=$this->db->query("$sql");
        return [$query->result(),$query->num_rows()];
    }

    // 返回一个type
    function getOneType($type_id){
        $sql="select * from type where type_id={$type_id}";
        $query=$this->db->query("$sql");
        return $query->row();
    }

    // 添加type 并返回
    function addType($name){
        $sql1="insert into type(type_name) VALUES('{$name}')";
        $sql2="select * from type where type_name='{$name}'";
        if($this->db->query($sql1)){
            return $this->db->query($sql2)->row();
        };
        return $this->db->query($sql1);
    }
}


