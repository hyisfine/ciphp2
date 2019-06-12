<?php
defined('BASEPATH') or exit('No direct script access allowed');

class My_captcha
{
    private $CI; //存放超级对象
    public $img; //存放验证码图片
    public $fontPath = "e:/ciphp/static/fonts/texb.ttf"; //字体文件
    public $width = 100; //图片宽度
    public $height = 40; //图片长度
    public $charLen = 4; //验证码长度
    public $typeNum = 1; //验证码类型
    public $bgbcolor = "fff"; //背景颜色
    public $showNoisePix  = true; //生成杂点
    public $noisePixNum  = 80; //生成杂点数量
    public $showNoiseLine = true; //生成线条
    public $noiseLineNum = 2; //生成线条
    public $captcha = ""; //存放验证码

    // 验证码构造函数
    public function __construct()
    {
        $this->CI = &get_instance();
        $this->CI->load->library("session");
    }

    // 返回验证码类型数组
    function verifyArry($typeNum)
    {
        switch ($typeNum) {
            case 1:
                $arr = array_merge(range(0, 9), range('A', 'Z'), range('a', 'z'));
                shuffle($arr);
                return $arr; //数字字母
                break;
            case 2:
                $arr = array_merge(range(0, 9));
                shuffle($arr);
                return $arr; //数字
                break;
            case 3:
                $arr = array_merge(range('A', 'Z'), range('a', 'z'));
                shuffle($arr);
                return $arr; //字母
                break;
            default:
                $arr = array_merge(range(0, 9), range('A', 'Z'), range('a', 'z'));
                shuffle($arr);
                return $arr; //数字字母
                break;
        }
    }

    // 返回单个验证码
    function verifyCodeOne()
    {
        $arr = $this->verifyArry($this->typeNum);
        shuffle($arr);
        shuffle($arr);
        $index = array_rand($arr, 1);
        return $arr[$index];
    }

    // 获取随机颜色
    function getColor()
    {
        return imagecolorallocate(
            $this->img,
            mt_rand(0, 255),
            mt_rand(0, 200),
            mt_rand(100, 255)
        );
    }

    // 绘制像素点
    function setNoisePix()
    {
        for ($i = 0; $i < $this->noisePixNum; $i++) {
            imagesetpixel($this->img, mt_rand(0, $this->width), mt_rand(0, $this->height), $this->getColor());
        }
    }

    // 绘制线条
    function setNoiseLine()
    {
        for ($i = 0; $i < $this->noiseLineNum; $i++) {
            imageline($this->img, mt_rand(0, $this->width), mt_rand(0, $this->height), mt_rand(0, $this->width),  mt_rand(0, $this->height), $this->getColor());
        }
    }


    /**
     * 
     * 显示验证码
     * 
     */
    function show()
    {
        // 存放画布
        $this->img = imagecreatetruecolor($this->width, $this->height);
        // 填充矩形
        imagefilledrectangle($this->img, 0, 0, $this->width, $this->height, $this->getColor());
        // 添加验证码
        $x = $this->width / ($this->charLen + 1); //验证码起始位
        $size = $this->height /2; //验证码大小
        $y = ($this->height - $size) / 2;
        $areaWitdh = ($this->width - $x) / $this->charLen; //单个验证码所在区域
        for ($i = 0; $i < $this->charLen; $i++) {
            $txt = $this->verifyCodeOne();
            // 在画布里添加验证码
            imagettftext($this->img, $size, mt_rand(-45, 45), $x / 2 + $areaWitdh * $i, $y + $size, $this->getColor(), $this->fontPath, $txt);
            // 将验证码 存入captcha变量
            $this->captcha .= strtolower($txt);
        }
        // 是否添加线条
        if ($this->showNoiseLine) {
            $this->setNoiseLine();
        }
        // 是否添加像素点
        if ($this->showNoisePix) {
            $this->setNoisePix();
        }

        // 销毁之前的验证码
        if ($this->CI->session->userdata('captcha')!=null) {
            $this->CI->session->unset_userdata('captcha');
        }
        // 存放入session中
        $this->CI->session->set_userdata('captcha', $this->captcha);
        ob_clean();
        header("Content-type: image/png");
        imagepng($this->img);
        imagedestroy($this->img);
    }


    // 判断是否错误
    function judge($captcha = null)
    {
        return ($this->CI->session->userdata('captcha') && $captcha) ? ($this->CI->session->userdata('auth_code') === $captcha) : false;
    }

    // // 从新显示验证码 
    function showAgin()
    {
        // 销毁之前的验证码
        if ($this->CI->session->userdata('captcha')!=null) {
            $this->CI->session->unset_userdata('captcha');
        }
        $this->captcha = "";
        $this->show();
    }

    // 设置验证码的配置
    function alterCaptcha($config = array())
    {
        foreach ($config as $key => $item) {
            if ($key != "CI" and $key != "img" and $key != "captcha") {
                $this->$key = $item;
            }
        }
    }
}
