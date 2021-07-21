$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    // console.log('no');
                    return layer.msg('提交信息失败:' + res.message)
                }
                layer.msg('密码修改成功!');
                // console.log('ok');
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })


    // 监听重置事件
    $('#btnReset').on('click', function(e) {

        $('#btnReset')[0].reset();


    })


    var form = layui.form;

    form.verify({
        samePwd: function(value) { //value：表单的值、item：表单的DOM对象
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一致';
            }
        },

        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '确认密码必须与新密码一致'
            }
        },



        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

    })
})