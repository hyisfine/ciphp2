<?php
defined("BASEPATH") or exit('No direct script access allowed');

class Article extends CI_Controller{
    function __construct()
    {
        parent::__construct();
    }

    function index(){
        $this->load->view("article.html");
    }
}