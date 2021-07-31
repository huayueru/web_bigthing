$(function() {
    const layer = layui.layer;
    const form = layui.form;

    initArtCateList();
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取列表失败' + res.message);
                }
                // 使用模板引擎
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }

        })
    }

    var indexAdd = null;
    // 给添加按钮添加点击事件
    $('#srtAdd').on('click', function() {
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    })

    // 通过代理的形式绑定提交事件
    $('body').on('submit', '.formAdd', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message);
                }
                layer.msg('新增文章分类成功!');
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })


    var indexEdit = null;
    // 通过代理的形式 为btn-edit绑定点击事件
    $('tbody').on('click', '.btn-edit', function(e) {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '300px'],
            content: $('#dialog-edit').html(),
        });

        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('form-Edit', res.data);
            }


        })

    })

    // 通过代理的形式 为修改分类表单绑定submit事件
    $('body').on('submit', '.form-Edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新分类成功!');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })



    // 绑定删除按钮
    $('tbody').on('click', '#btn-del', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!');
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })

        })
    })

})