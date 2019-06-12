//  jquery入口
$(function() {
	
	// 全局资源
	(function() {
		// 存放type
		window.typeobj = [];
		// 存放搜索的文章数量
		window.count = 0;
		// 存放文章类别
		window.type_id = null;
		window.type_name = "";
		// 存放搜索内容
		window.content = null;
		// 存放分页模板渲染flag  0:重新渲染 1：不渲染
		window.pageflag = 0;
		// 存放当前页面index
		window.pageindex = 1;
	})();

	// 封装获取文章函数
	function articlePages(page = 0, pagesize = 5, type_id = null) {
		if (page == 0) {
			var reg1 = new RegExp(/pages=\d+/);
			var pages = window.location.href.match(reg1);
			if (pages != null) {
				page = pages[0].split("=")[1].match(/^\d+$/)[0];
			} else {
				page = 1;
			}
		}

		var reg2 = new RegExp(/type=\w+/);
		var typeid = window.location.href.match(reg2);

		if (typeid != null) {
			window.typeobj.forEach(e => {
				if (e.type_name == typeid[0].split("=")[1]) {
					window.type_name = typeid[0].split("=")[1];
					type_id = e.type_id;
					window.type_id = e.type_id;
					return false;
				}
			});
		}

		// 获取种类
		var type = getJSON({
			url: "/api/get/articlepages",
			data: {
				page: page,
				pagesize: pagesize,
				type_id: type_id
			},
			dataType: "json",
			headers: {
				token: $.cookie("u_token")
			}
		});

		type.then(function(res) {
			if (res.status) {
				// 获取文章数
				window.count = res.count;

				// 格式化时间
				var d = new Date();
				// var title_nav = "<div class='title-nav'>";

				for (let index = 0; index < res.data.length; index++) {
					// title_nav +=
					// 	`<div class="title-nav-item"><a href="/article?ar_id=` +
					// 	res.data[index].ar_id +
					// 	`">` +
					// 	res.data[index].title +
					// 	`</a></div>`;

					d.setTime(res.data[index].adddate * 1000);
					var time = "";
					time += d.getFullYear() + "年";
					time += d.getMonth() + "月";
					time += d.getDate() + "日&nbsp;&nbsp;&nbsp;";
					time += d.getHours() + ":";
					time += d.getMinutes() + ":";
					time += d.getSeconds();
					res.data[index].adddate = time;
					// 重新装填type_id对应的name
					window.typeobj.forEach(e => {
						if (e.type_id == res.data[index].type_id) {
							res.data[index].type_id = e.type_name;
							return false;
						}
					});
				}

				// 渲染title-nav
				// title_nav += "</div>";
				// $(".title-nav").remove();
				// $(".main").append(title_nav);

				// jsrender渲染模板
				var temp = "#temp";

				var html = $.templates(temp).render(res.data);
				// 清空 content容器内容
				$(".main-content").empty();
				$(window).scrollTop(0);
				$(".main-content").append(html);

				// 重新渲染分页组件
				if (window.pageflag == 0) {
					window.pageflag = 1;
					layui.use("laypage", function() {
						var laypage = layui.laypage;
						laypage.render({
							elem: "demo7",
							count: window.count,
							layout: ["count", "prev", "page", "next", "refresh", "skip"],
							limit: 5,
							curr: page,
							hash: "&pages",
							jump: function(obj, first) {
								var color = [
									"#009688",
									"#5FB878",
									"#1E9FFF",
									"#FFB800",
									"#FF5722",
									"#01AAED"
								];
								$(".main-ul li").each(function(index, e) {
									if ($(this).text() == window.type_name) {
										$(".select").removeClass("select");
										$(this).addClass("select");
									}
									$(this).css(
										"background",
										color[Math.floor(Math.random() * 6)]
									);
								});
								if (first) {
									$(".main").css("visibility", "visible");
									$(".layui-box")
										.children()
										.each(function() {
											$(this).css(
												"background",
												"rgba(255,255,255,0.0) !important"
											);
										});
								}
								if (!first) {
									articlePages(obj.curr, obj.limit, window.type_id);
									window.pageindex = obj.curr;
								}
							}
						});
					});
				}
			}
		});
		// 回调函数数据交互
	}

	//	封装搜索文章函数
	function searchArticle(page = 1, pagesize = 5, content = null) {
		var reg1 = new RegExp(/pages=\d+/);
		var pages = window.location.href.match(reg1);

		if (pages != null) {
			page = pages[0].split("=")[1].match(/^\d+$/)[0];
		}
		var search = window.location.search.split("content=");

		if (search.length != 1) {
			content = decodeURI(search[1]);
			window.content = content;
			$(".main-input").val(content);
		}

		$.get({
			url: "api/get/searcharticles",
			data: {
				page: page,
				pagesize: pagesize,
				content: content
			},
			dataType: "json",
			headers: {
				token: $.cookie("u_token")
			},
			success: function(res) {

				if (res.status) {
					// 获取文章数
					window.count = res.count;

					// var title_nav = `<div class="title-nav">`;

					// 格式化时间
					var d = new Date();
					for (let index = 0; index < res.data.length; index++) {
						// title_nav +=
						// 	`<div class="title-nav-item"><a href="">` +
						// 	res.data[index].title +
						// 	`</a></div>`;

						d.setTime(res.data[index].adddate * 1000);
						var time = "";
						time += d.getFullYear() + "年";
						time += d.getMonth() + "月";
						time += d.getDate() + "日&nbsp;&nbsp;&nbsp;";
						time += d.getHours() + ":";
						time += d.getMinutes() + ":";
						time += d.getSeconds();
						res.data[index].adddate = time;

						// 重新装填type_id对应的name
						window.typeobj.forEach(e => {
							if (e.type_id == res.data[index].type_id) {
								res.data[index].type_id = e.type_name;
								return false;
							}
						});
					}

					// title_nav += `</div>`;

					// $(".title-nav").remove();
					// $(".main").append(title_nav);

					// jsrender渲染模板
					var temp = "#temp";
					var html = $.templates(temp).render(res.data);
					$(".main-content").empty();
					if (res.count == undefined) {
						$(".main-content").append(
							`<img src="./static/img/portrait/404-error.png">`
						);
					}
					$(window).scrollTop(0);
					$(".main-content").append(html);
					//  判断是否展示页面连接div
					$(".temp-jump")
						.filter(function() {
							//  筛选达到最大height的元素
							return (
								$(this)
									.prev()
									.height() ==
								parseInt(
									$(this)
										.prev()
										.css("max-height")
								)
							);
						})
						.each(function() {
							// 显示跳转div
							$(this).css("visibility", "visible");
						});

					// 重新渲染分页组件
					if (window.pageflag == 0) {
						window.pageflag = 1;
						layui.use("laypage", function() {
							var laypage = layui.laypage;
							laypage.render({
								elem: "demo7",
								count: window.count,
								layout: ["count", "prev", "page", "next", "refresh", "skip"],
								limit: 5,
								curr: page,
								hash:  "&pages",
								jump: function(obj, first) {
									if (first) {
										$(".main").css("visibility", "visible");
									}
									if (!first) {
										var color = [
											"#009688",
											"#5FB878",
											"#1E9FFF",
											"#FFB800",
											"#FF5722",
											"#01AAED"
										];
										$(".main-ul li").each(function(index, e) {
											$(this).css(
												"background",
												color[Math.floor(Math.random() * 6)]
											);
										});
										window.pageindex = obj.curr;
										searchArticle(obj.curr, obj.limit, window.content);
										$(window).scrollTop(0);
									}
								}
							});
						});
					}
				}
			}
		});
	}

	// jquery操作DOM
	(function() {
		// 加载类别
		var alltype = getJSON({
			url: "/api/get/getAllType",
			headers: {
				token: $.cookie("u_token")
			},
			dataType: "json",
			async: false
		});
		alltype.then(res => {
			window.typeobj = res.data;
			var html = "";
			// var typenav = `<div class="type-nav"><div class="type-nav-item bgcolor" value="">全部</div>`;
			res.data.forEach(element => {
				html += "<li>" + element.type_name + "</li>";
				// typenav +=
				// 	`<div class="type-nav-item ">` + element.type_name + `</div>`;
			});
			// typenav += `</div>`;
			// $(".main").append(typenav);
			$(".main-ul").append(html);
			var color = [
				"#009688",
				"#5FB878",
				"#1E9FFF",
				"#FFB800",
				"#FF5722",
				"#01AAED"
			];
			$(".main-ul li").each(function(index, e) {
				$(this).css("background", color[Math.floor(Math.random() * 6)]);
			});
			// 首次加载文章
			if (location.search.includes("content")) {
				searchArticle();
			} else {
				articlePages();
			}
		});

		// 选择文章类别绑定事件
		$(".main-ul").on("click", "li", function(param) {
			$(".select").removeClass("select");
			$(this).addClass("select");
			window.pageflag = 0;
			if ($(this).index() == 0) {
				location.href = "articles";
			} else {
				location.href = "articles?type=" + $(this).text();
			}
		});
		// input绑定keydown事件
		$(".main-input").keydown(function(e) {
			if (e.keyCode == 13) {
				if (this.value.trim() == "") {
					this.value = null;
				} else if (window.content != this.value.trim()) {
					location.href = "?content=" + this.value.trim();
				}
			}
		});

		// 搜索键绑定事件
		$(".layui-icon-search").on("click", () => {
			var val = $(".main-input")
				.val()
				.trim();
			if (val == "") {
				$(".main-input").val(null);
			} else if (window.content != val) {
				location.href = "?content=" + val;
			}
		});

		// // type-nav绑定事件
		// $(".type-nav-item").on("click", function() {
		// 	$(".bgcolor").removeClass("bgcolor");
		// 	$(this).addClass("bgcolor");

		// 	if (
		// 		window.type_id != $(this).index() ||
		// 		window.content != null ||
		// 		window.pageindex != 1
		// 	) {
		// 		window.type_id = $(this).index() == 0 ? null : $(this).index();
		// 		window.content = null;
		// 		window.pageindex = 1;
		// 		window.pageflag = 0;
		// 		articlePages(1, 5, $(this).index());
		// 		$(window).scrollTop(0);
		// 	}
		// });

		// 处理dom样式
		(function() {
		})();
	})();

	// 处理layui
	(function() {
		// 处理分页
		layui.use("laypage", function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: "demo7",
				count: window.count,
				layout: ["count", "prev", "page", "next", "refresh", "skip"],
				limit: 5,
				curr: 1,
				hash: "",
				jump: function(obj, first) {
					if (!first) {
						obj.hash = "pages";
						articlePages(obj.curr, obj.pages, window.type_id);
						$(window).scrollTop(0);
						window.pageindex = obj.curr;
					}
				}
			});
		});
	})();
});
