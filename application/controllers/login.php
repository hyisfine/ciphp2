<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Login extends CI_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->library('web_result');
		$this->load->library('session');
		$this->load->helper('cookie');
	}

	// 展示登录页面-
	function index()
	{
		$this->load->view("login.html");
	}

	// 加载验证页面
	function checkForm()
	{
		$user = $this->db->escape($_GET["user"]);
		$password = $_GET["password"];
		$captcha = strtolower($_GET["captcha"]);

		// 表单判断
		
		if (empty($user)) {
			$this->web_result->jump("请输入用户名！", "index");
		}
		if (empty($password)) {
			$this->web_result->jump("请输入密码！", "index");
		}
		$password = md5($password);

		if (empty($captcha)) {
			$this->web_result->jump("请输入验证码！", "index");
		}
		if (!ctype_alnum($captcha)) {
			$this->web_result->jump("请输入正确的验证码！", "index");
		}

		if ($captcha != $this->session->userdata("captcha")) {
			$this->web_result->jump("验证码错误！ ", "index");
		}

		// 查询数据库进行身份判定
		$sql = "select * from user where u_name={$user}";
		$query = $this->db->query($sql);
		if (!$query->num_rows()) {
			$this->web_result->jump("用户名错误！", "index");
		}
		$row = $query->row();
		if ($row->u_pass != $password) {
			$this->web_result->jump("密码错误！", "index");
		}

		// 使用身份标识码和token来记录登录状态
		$u_piv = md5(mt_rand());//身份代码
		$u_token = md5(uniqid(rand(), TRUE));//身份识别
		$u_timeout = time() + 60 * 60 * 24 * 7;//过期时间

		if (!empty(get_cookie("u_piv"))) {
			delete_cookie("u_piv");
		}

		if (!empty(get_cookie("u_token"))) {
			delete_cookie("u_token");
		}

		// 存入cookie
		set_cookie("u_piv", $u_piv, 60 * 60 * 24 * 7);
		set_cookie("u_token", $u_token, 60 * 60 * 24 * 7);

		// 更新数据库
		$sql = "update user set u_piv='{$u_piv}',u_token='{$u_token}',u_timeout={$u_timeout} where u_name={$user} and u_pass='{$password}'";

		if (!$this->db->query("$sql")) {
			$this->web_result->jump("出现未知错误！请重新登录！", "index");
		}

		$this->web_result->jump("登录成功！  ", "http://www.citest.com/");
	}
}
