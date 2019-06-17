$(function (param) { 

    // 提交数据
    $(".btn-default").on("click",function (e) { 
        console.log(2);
        if($(".user").val()=="" || $(".pass").val()==""){
        }
        
        
        $.ajax({
            type: "post",
            url: "/login/checkForm",
            data: {
                user:$(".user").val(),
                pass:$(".pass").val()
            },
            dataType: "dataType",
            success: function (response) {
            }
        });
     })

 });