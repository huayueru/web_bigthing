$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1到6之间'
            }
        }
    })





    initUserInfo();


    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败!')
                }
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 监听重置按钮
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })


    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('表单提交失败!');
                }
                layer.msg('表单提交成功!')
                window.parent.getUserInfo();
            }
        })
    })



})