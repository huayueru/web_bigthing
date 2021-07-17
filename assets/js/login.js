$(function() {
    // 点击"去注册账号"连接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录 
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中获取form对象
    var form = layui.form;

    // 获取layui中的layer对象
    var layer = layui.layer;
    // 通过 form.verify()自定义函数校验规则
    form.verify({
        // 自定义一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        // 校验两次密码一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行比较
            // 如果失败,则return失败提示
            var pwd = $('.reg-box [name = password]').val();
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    });

    // http://api-breakingnews-web.itheima.net

    // 监听注册表单提交事件
    $('#form-reg').on('submit', function(e) {
        // 阻止默认的提交行为
        e.preventDefault();
        var data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() };
        $.post('/api/reguser', data, function(reg) {
            if (reg.status !== 0) {
                return layer.msg(reg.message);
                // console.log(reg.message);

            }
            layer.msg('注册成功!请登录');
            // console.log('注册成功!');
            // 模拟点击行为
            $('#link_login').click();

        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止默认表单的提交
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                    // return console.log("登录失败");
                }
                layer.msg('登录成功!');
                // console.log("登录成功");
                // console.log(res.token);
                // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQ5MzksInVzZXJuYW1lIjoiaHVheXVlcnUiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTYyNjUyNDU1NSwiZXhwIjoxNjI2NTYwNTU1fQ.NA8pBB9FwkJeX_MfTarRwQY5iIISVmEzzBY79EWnV0g
                // 将登录成功时得到的token字符串,保存到localtorage中
                localStorage.setItem('token', res.token);
                // 跳到后台主页
                location.href = '/bigthing/index.html'
            }
        })
    })




})