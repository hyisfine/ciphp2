<?php
defined('BASEPATH') or exit('No direct script access allowed');

class  Articles extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    // 即网页初始页面
    function index(){

        $this->load->view("articles.html");
    }

    

}
