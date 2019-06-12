<?php
class Captcha extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
        // 引入自定义类库
        $this->load->library("my_captcha");
        // Your own constructor code
    }

    // 显示验证码
    function get_captcha()
    {
        $this->my_captcha->show();
    }

    // 重新显示验证码
    function get_captcha_agin()
    {
        $this->my_captcha->showAgin();
    }

    // 判断是否正确
    function judgeCaptcha(){
        return $this->my_captcha->judge();
    }
}
