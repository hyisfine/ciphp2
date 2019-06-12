$(function() {
	// 全局资源
	(function() {
		// 种类
		window.type = {};
		// 文章展示部分
		window.showtext = ``;
	})();

	// 操作summernote
	(function() {
		document.emojiSource = "/static/dist/tam-emoji/img";
		$("#summernote").summernote({
			lang: "zh-CN",
			width: 1100,
			minHeight: 650,

			toolbar: [
				["style", ["style"]],
				["insert", ["emoji"]],
				["undo", ["undo"]],
				["redo", ["redo"]],
				[
					"font",
					[
						"bold",
						"underline",
						"clear",
						"strikethrough",
						"superscript",
						"subscript"
					]
				],
				["fontsize", ["fontsize"]],
				["fontname", ["fontname"]],
				["para", ["ul", "ol", "paragraph"]],
				["color", ["color"]],
				["table", ["table"]],
				["insert", ["link", "picture", "video"]],
				["view", ["fullscreen", "codeview", "help"]],
				["height", ["height"]]
			],
			placeholder:
				"1.shift+enter在当前样式中换行。2.当前样式中使用列表后使用enter键在当前样式中换行。3.当前样式中使用列表后shift+enter",
			// 重写图片上传
			callbacks: {
				onImageUpload: function(files) {
					sendImg(files);
				},
				onEnter: function(e) {
					holdScrollTop();
				},
				onChange: function(e) {
					getTextShow(e);
				}
			}
		});

		// 保持窗口向下滚动
		var lastheight1 = $(".note-editable")[0].clientHeight;
		function holdScrollTop() {
			var nowheight1 = $(".note-editable")[0].clientHeight;
			var wintop = $(window).scrollTop();
			$(window).scrollTop(wintop + nowheight1 - lastheight1);
			lastheight1 = nowheight1;
		}

		// 获取text_show内容
		var lastheight2 = $(".note-editable")[0].clientHeight;
		function getTextShow(e) {
			var height = 0;
			var text = "";
			$(".note-editable")
				.children()
				.each(function(index, item) {
					if (height < 450) {
						height += $(this).outerHeight(true);
						text += item.outerHTML;
					} else {
						return false;
					}
				});
			window.showtext = text;
		}

		// 图片发送
		function sendImg(files) {
			var file = files[0];
			var fd = new FormData();
			fd.append("img", file);
			// console.log(file);

			$.ajax({
				type: "post",
				url: "/api/post/uploadimg",
				data: fd,
				headers: {
					token: $.cookie("u_token")
				},
				dataType: "json",
				cache: false,
				processData: false,
				contentType: false,
				success: function(response) {
					// console.log(response);

					var image = document.createElement("img");
					image.src = response.data;
					$("#summernote").summernote("insertNode", image);
				}
			});
		}
		//   图片删除
		(function() {
			var config = { attributes: true, childList: true, subtree: true };
			// 创建观察者
			var observer = new MutationObserver(items => {
				// 监听删除元素是否为img
				if (items[0].removedNodes.length != 0) {
					if (items[0].removedNodes[0].tagName == "IMG") {
						// console.log(items[0].removedNodes[0].src);
						$.ajax({
							type: "post",
							url: "/api/post/deleteimg",
							headers: {
								token: $.cookie("u_token")
							},
							data: { src: items[0].removedNodes[0].src },
							success: function(res) {
								// console.log(res);
							}
						});
					}
				}
			});
			//  配置观察对象及属性-
			var target = document.querySelector(".note-editable");
			observer.observe(target, config);
		})();

		$(".note-editable").bind("paste",function (param) {
			console.log(11);
			
			$(".note-editable").append("<p style='height:20px'></p>");
		  })
	})();

	// 提交按钮
	(function(param) {
		$("#btn").on("click", () => {
			// 显示提交框
			$(".main-popup").css("visibility", "visible");
			//  获取类别
			$.get({
				url: "/api/get/getAllType",
				headers: {
					token: $.cookie("u_token")
				},
				dataType: "json",
				async: false,
				success: function(res) {
					if (res.status) {
						window.type = res.data;
						// 渲染select标签
						var selecthtml = `<option value="">选择类别</option>`;
						// 渲染type-nav标签
						for (let index = 0; index < res.data.length; index++) {
							selecthtml +=
								"<option value=" +
								res.data[index].type_id +
								" >#" +
								res.data[index].type_name +
								"</option>";
						}

						$(".select-nav").empty();
						$(".select-nav").append(selecthtml);
					}
				}
			});
		});
	})();

	// 提交
	(function(param) {
		// 取消提交
		$(".submit-no").on("click", () => {
			$(".main-popup").css("visibility", "hidden");
		});
		// 确认提交
		$(".submit-yes").on("click", async () => {
			// 判断标题
			var title = $(".title")
				.val()
				.trim();
			if (title == "") {
				alert("标题为空！");
				return;
			}
			// 判断类型
			var type_id = $(".select-nav option:selected").val();
			if (type_id == "") {
				alert("没有选择类别！");
				return;
			}
			// 判断文章内容
			var text = $("#summernote").summernote("code");
			if ($("#summernote").summernote("isEmpty")) {
				alert("文章内容为空！");
				return;
			}

			// 获取当前用户
			var user = await getJSON({
				url: "/api/get/getNowUserID",
				headers: {
					token: $.cookie("u_token")
				}
			});

			// 提交代码
			var addtime = Math.floor(new Date().getTime() / 1000);
			var article = await getJSON({
				url: "/api/post/submitArticle",
				data: {
					u_id: 1,
					adddate: addtime,
					content: text,
					title: title,
					type_id: type_id,
					txt_show: window.showtext
				},
				headers: {
					token: $.cookie("u_token")
				},
				type: "post"
			});

			if (article.status) {
				alert("添加成功！");

				location.href = "/article?ar_id=" + article.data.ar_id;
			}
		});
	})();

	//   添加type
	(function(param) {
		$(".add-select img").on("click", () => {
			$(".add-box").css("visibility", "visible");
		});
		$(".add-no").on("click", () => {
			$(".add-box").css("visibility", "hidden");
		});
		$(".add-yes").on("click", () => {
			var newtype = $(".box-input input")
				.val()
				.trim(0)
				.toLowerCase();
			// console.log(type)
			if (newtype == "") {
				alert("类别为空！");
				return;
			}
			// 判断是否重复
			if (
				window.type.some(element => {
					if (element.type_name == newtype) {
						return true;
					}
				})
			) {
				// console.log(1);
				alert("该类别已经存在！");
				return;
			}

			// 添加标签
			var addtype = getJSON({
				url: "/api/post/addtype",
				data: { newtype: newtype },
				headers: { token: $.cookie("u_token") }
			});
			addtype.then(result => {
				if (result.status) {
					var html =
						`<option selected value=` +
						result.data.type_id +
						`>` +
						result.data.type_name +
						`</option>`;
					$(".select-nav").append(html);
					$(".add-box").css("visibility", "hidden");
				}
			});
		});
	})();
});
