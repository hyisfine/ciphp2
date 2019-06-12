<?php
defined('BASEPATH') or exit('No direct script access allowed');

// user表操作

class User extends CI_Model{
    function __construct()
    {
        $this->load->database();
        $this->load->library('session');
    }

    //api身份验证 
    function verifyPiv($token){
        $ptoken= $this->session->userdata('token');
        if ($token==$ptoken) {
            return true;
        }
        
        $sql="select * from user where u_token='{$token}'";
        $query=$this->db->query($sql);
        if (!$query->num_rows()) {

           return false;
        }
        return true;
        }

    // 获取当前用户名
    function getNowUserID($token,$piv){
        $sql="select 'u_id' from user where u_token='{$token}' and u_piv='{$piv}'";
        $query=$this->db->query($sql);
        return $query->row();
    }
}