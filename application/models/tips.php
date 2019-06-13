<?php
class Tips extends CI_Model{
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }
    // 分页获取文章
    function getAllTips()
    {
        // $page = empty($page) ? 1 : $page;
        // $pagesize = empty($pagesize) ? 12 : $pagesize;
        // $start = ($page - 1) * $pagesize;
        // if (empty($type_id)) {
        //     $sql = "select * from tips order by adddate desc limit {$start},{$pagesize}";
        //     $num = "select * from tips";
        // } else {
            $sql = "select * from tips  order by adddate desc";
        // }
        return [ $this->db->query($sql)->result(), $this->db->query($sql)->num_rows()];
    }
}