(function(){
	var handlerEmbed = function (captchaObj) {

		var popEl = $(".verifyPop");
		if(popEl.size()==0){
			$(document.body).append("<div class='verifyPop' style='position: absolute;right:0px;display: none;top: 50%;left: -105px;margin: auto;width: 200px;height: 200px;'></div>");
			popEl = $(".verifyPop");
		}


		//<div class='verifyPop' style='position: absolute;top: 10px;display: none;top: 50%;left: 38%;'></div>
		popEl.click(function(){$(this).hide()});

		if (captchaObj) {
			captchaObj.refresh();
		}
		popEl.show();

		if(window._verify_time == undefined || window._verify_time == 0) {
			// 将验证码加到id为captcha的元素里
			captchaObj.appendTo(popEl);
			captchaObj.onReady(function () {
				popEl.first().on("click",function(e){
					e.stopPropagation();
				});
			});

			window._verify_time = (window._verify_time || 0) + 1;
		}

		captchaObj.onSuccess(function() {
			var validate = captchaObj.getValidate();
			var el = $(".vertifyBtn");
			if(!el.hasClass("disabled")){
				el.addClass("disabled");
				var s = 60;
				el.html(s+"s后重发");
				var t = setInterval(function(){
					if(--s==0){
						clearInterval(t);
						el.css("background-color", "#5d9cec");
						el.css("color", "white");
						el.removeClass("disabled");
						el.html("获取验证码");
					}else{
						el.css("background-color", "#f1f1f1");
						el.css("color", "#999");
						el.html(s+"s后重发");
					}
				},1000);

				$.ajax({
					url: '/thinknode/post/common/sendVerifyCode',// 进行二次验证
					type: "post",
					dataType: "json",
					data: {
						data: {
							// 二次验证所需的三个值
							geetest_challenge: validate.geetest_challenge,
							geetest_validate: validate.geetest_validate,
							geetest_seccode: validate.geetest_seccode,
							mobile: $("input[name=mobile]").val()
						}

					},
				});
			}
		});
		captchaObj.onError(function(a,b,c) {
			console.info('验证出错!')
		});
		captchaObj.onFail(function(a,b,c) {
			console.info('验证失败!');
		});
	};

	function verifyDoInit(mobile) {

		$.ajax({
			url: '/thinknode/post/common/getVerificationCode',
			type: "post",
			data: {
				data: {
					mobile: mobile,
				}
			},
			dataType: "json",
			success: function (data) {
				// 使用initGeetest接口
				// 参数1：配置参数
				// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
				initGeetest({
					gt: data.gt,
					challenge: data.challenge,
					offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
					new_captcha: data.new_captcha,
					width : "300px",
					product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
				}, handlerEmbed);
			}
		});
	}

	$(document).on('click','.vertifyBtn',
		function() {
			var el = $(this);
			if(el.hasClass("disabled")){
				return;
			}
			var mobileEl = $("input[name='mobile']");
			var mobile = mobileEl.val();

			if(!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))){
				alert("请输入正确的手机号");
				return;
			}

			verifyDoInit(mobile);
		});
})(this);
