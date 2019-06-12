<?php
defined('BASEPATH') or exit('No direct script access allowed');

class First extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->library("web_result");
    }

    function index(){
        $this->load->view("first.html");
    }
}