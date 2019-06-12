<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Unimportance extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->model("user");
    }

    function createUser(){
        $this->load->library('session');
        $token = $this->input->get_request_header("token");
        $this->session->set_userdata('token', $token);
        $this->load->library("web_result");
        $this->web_result->response(true,"创建成功");
    }
}