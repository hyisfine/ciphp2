// jquery入口
$(function () { 
    // 请求访问
    (function () {
        // 获取文章内容
            var article=getJSON({url:"/api/get/getOneArticle",data:{ar_id:document.URL.split("=")[1]},headers:{token:$.cookie("u_token")}});
            article.then( function (res) {
                if(res.status){
                    $(".header-title").append(res.data.title);
                    var d=new Date();
                    d.setTime(res.data.adddate * 1000);
                    var time = "";
                    time += d.getFullYear() + "年";
                    time += d.getMonth() + "月";
                    time += d.getDate() + "日&nbsp;&nbsp;&nbsp;";
                    time += d.getHours() + ":";
                    time += d.getMinutes() + ":";
                    time += d.getSeconds();
                    $(".tag-time").append(time);
                    $(".main-article").append(res.data.content);
                    $(".main").css("visibility","visible"); 
                    var type= getJSON({url:"/api/get/getonetype",data:{type_id:res.data.type_id},headers:{token:$.cookie("u_token")}});
                       type.then(function (res) {
                        $(".tag-type").append(`<img src="./static/img/icon/tag.png" style="display:inline-block ;width:25px" alt="">`+res.data.type_name)
                         });
                }
            });
               
        
        // 获取上下文
        var context=getJSON({url:"/api/get/getcontext",data:{ar_id:document.URL.split("=")[1]},headers:{token:$.cookie("u_token")}});
        context.then(function (res) {
            if(res.data[0]!=null){
                $(".prev-page>a").append(res.data[0].title);
                $(".prev-page>a").attr("href","/article?ar_id="+res.data[0].ar_id);
            }else{
                $(".prev-page>a").append("到头了");
            }

            if(res.data[1]!=null){
                $(".next-page>a").append(res.data[1].title);
                $(".next-page>a").attr("href","/article?ar_id="+res.data[1].ar_id);
            }else{
                $(".next-page>a").append("到尾了");
            }
          })
    })();

    // 事件绑定
    (function () { 
     })();
});