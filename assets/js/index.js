$(function() {
    getUserInfo();

    // 给退出按钮添加点击事件
    $('#btnLogout').on('click', function() {
        layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token');
            location.href = '/bigthing/login.html';

            layer.close(index);
        });
    })


})

var layer = layui.layer;

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',

        success: function(res) {
            // console.log(localStorage.getItem('token' || ''));
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取信息失败!')
            }
            renderAvatar(res.data);
        },

        /* complete: function(res) {
            // console.log('执行了回调函数');
            // console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token');
                // 强制返回登录页面
                location.href = '/bigthing/login.html';
            }
        } */
    })
};

function renderAvatar(user) {
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 设置头像 
    if (user.user_pic !== null) {
        // 渲染自定义头像
        $('.layui-nav-img').sttr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}