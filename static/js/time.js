$(function() {
	// 全局变量
	{
		window.global = {}; //全局资源对象
		window.global.alltype = []; //类型数组 [0] :文章类型 [1]：tip类型
		window.global.count = 0; //article tips总数
	}

	// 函数封装
	{
		// 依靠时间搜索article和tips集合的递归函数 月初时间戳 月末时间戳
		var getallbytime = function(now, next) {
      
			var alltext = getJSON({
				url: "/api/get/getall",
				headers: { token: $.cookie("u_token") },
				data: {
					timeup: now/1000,
					timefloor: next/1000
				}
			});
			alltext.then(res => {
				if (res.data.length != 0) {
          window.global.count-=res.data.length;
          
					var data = {};
					data["time"] = now;
					data["data"] = res.data;
					var html = $("#text").render(data);
          $(".main").append(html);

          // 判断数据查询完
          if (window.global.count==0) {
            return;
          }
					getallbytime( getPrevMonthTime(now),now);
				} else {
					getallbytime(getPrevMonthTime(now),now);
				}
			});
		};

		// jsrender 数据转换函数
		$.views.converters({
      //时间戳转化为年月
			getYM: function(time) {
				var d = new Date(time ); 
				var year = d.getFullYear();
				var month = d.getMonth()+1;
				return year + "年" + month + "月";
      },
      // 时间戳转化为2000-1-1 12:12:12
      getTime:function(adddate){
        var d=new Date(adddate*1000);
        var time = "";
        time += d.getFullYear() + "-";
        time += d.getMonth()+1 + "-";
        time += d.getDate() + "&nbsp;&nbsp;&nbsp;";
        time += d.getHours() + ":";
        time += d.getMinutes() + ":";
        time += d.getSeconds();
				return time;
      }
    });
    // jsrender 数据处理函数
		$.views.helpers({
      // 判断为随笔还是文档  返回相应字符串和相应类型
			artOrTip: function(type_id) {
        if (window.global.alltype[0][""+type_id]!=undefined) {
          return ["文档",window.global.alltype[0][""+type_id]];
        }else{
          return ["随笔",window.global.alltype[1][""+type_id]];
        }
      },
		});

		//  将返回给定时间戳 一个月前的时间戳
		var getPrevMonthTime = function(time) {
			var d = new Date(time);
			var year = d.getFullYear(); //数据库只储存到秒数，需要将毫秒数转为秒数
      var month = d.getMonth();
      
			if (month == 1) {
        month = 12;
				year -= 1;
			} else  if(month==0){
        month = 11;
        year-=1;
			}else{
        month-=1;
      }
			d = new Date(year, month);
			return d.getTime();
		};
	}

	// ajax数据交互
	(function(param) {
		// 获取所有类别数据
		var alltype = getJSON({
			url: "/api/get/getalltype",
			headers: { token: $.cookie("u_token") },
			async: false
		});
		alltype.then(res => {
      console.log(res);
      
			var index = 0;
			res.data.forEach(element => {
				window.global.alltype[index] = {};
				element.forEach(e => {
					window.global.alltype[index][e.type_id] = e.type_name;
				});
				index += 1;
      });
		});

		// 获取总数
		var allcount = getJSON({
			url: "/api/get/getallcount",
			headers: { token: $.cookie("u_token") },
			async: false
		});
		allcount.then(res => {
      window.global.count = res.data;
		});

		// 获取所有article tips
		var d = new Date();
		var year = d.getFullYear();
    var month = d.getMonth()+1;
    
		var nowYM = (new Date(year, month).getTime()) ;
		if (month == 12) {
      month = 1;
			year += 1;
		} else {
      month += 1;
		}
    var prevYM = (new Date(year, month).getTime()) ;
    getallbytime(nowYM, prevYM);
    

	})();

	// 绑定事件
	(function(param) {
		// 折叠事件
		$(".main").on("click", ".time-box .time-note", function() {
			$(this)
				.siblings(".time-items")
				.toggle("fold");
			var link = $(this).children()[0].src;
			if (link.search("before") == -1) {
				$(this).children()[0].src = "./static/img/icon/fold-before.png";
				$(this)
					.siblings(".nowBox-time")
					.css("color", "#3c3c3c");
			} else {
				$(this).children()[0].src = "./static/img/icon/fold-after.png";
				$(this)
					.siblings(".nowBox-time")
					.css("color", "#409eff");
			}
    });
    
    // 点击标题
    $(".main").on("click", ".time-box .time-items .items-box .items-content h4",function (param) {
      var val=$(this).prev().html().split(",");
      if(val[0]=="文档"){
        window.open("/article?num="+val[1]);
      }else{
        var tip=getJSON({
          url:"/api/get/getOneTip",
          headers:{token:$.cookie("u_token")},
          data:{t_id:val[1]},
          async:false
        });
        tip.then(res=>{
          var html="<div class='showtip'>"+res.data.content+"</div>";
          $(this).after(html);
        })
      }
     } );

	})();
});
