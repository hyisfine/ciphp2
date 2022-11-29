// jquery 入口
$(function() {
    // 全局资源
	{
		window.global = {};// 全局变量
        window.global.type = {};// 存放tips的所有类型
        
        // 时间处理函数 给定时间戳变为 2019年11月12日 15:30:50形式
        window.global.getTime=function (time) { 
            var d=new Date();
            d.setTime( time* 1000);
            var timestr = "";
            timestr += d.getFullYear() + "年";
            timestr += d.getMonth() + "月";
            timestr += d.getDate() + "日&nbsp;";
            timestr += d.getHours() + ":";
            timestr += d.getMinutes() + ":";
            timestr += d.getSeconds();
            return timestr;
         }
    };
    
	//   ajax请求数据
	(function() {
		// 获取tips类型
		var tipstype = getJSON({
			url: "/api/get/getAllTipsType",
			headers: {
				token: $.cookie("u_token")
			},
			async: false
		});
		// 数据返回结果
		tipstype.then(res => {
			if (res.status) {
				// 存放类型内容
				var ulhtml = `<li><a data-sjslink="all" class="select">all</a></li>`; //拼接类型 li填充
				res.data.forEach(element => {
                    ulhtml +=`<li><a data-sjslink=` + element.type_id + `>`+element.type_name+`</a></li>`;
                    window.global.type[element.type_id]=element.type_name;
                });
                // 填充ul type-bar
                $(".type-bar").append(ulhtml);
			}
        });
        
        // 获取tips
        var tips=getJSON({
          url:"/api/get/getAllTips",
          headers:{
              token:$.cookie("u_token")
          },
          async:false
        });
        // tips数据处理
        tips.then(res=>{
            res.data.forEach(e=>{  //循环填充拼接
               var tipshtml=
                `
                  <div data-sjsel=`+e.type_id+` class="cars addcars" >
                  <span>`+window.global.type[e.type_id]+'&nbsp;&nbsp;'+window.global.getTime(e.adddate)+`</span>
                <h1>`+e.title+`</h1>
                <div><span></span>`+e.content+`</div>
              </div>`;
                //拼接一次填充 一次
                $(".sjs-default").append(tipshtml);

            })
            document.querySelector("#sortable").sortablejs({
                margin: 50 //   间距
            });
        })

    })();
    
    // 元素标签绑定事件
    (function () {
        // type-bar li点击事件
        $(".type-bar").on("click",'li a',function () {
            $(".select").removeClass("select");
            $(this).addClass("select");
         });
      })();
});