$(function() {
    // * 加载分类列表
    initCate();
    const layer = layui.layer;
    var form = layui.form;
    //定义加载文章的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    // console.log(res);
                    return layer.msg('初始化文章分类失败!')
                }
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                $('select').html(htmlStr)

                // 调用form.render()函数
                form.render();
            }

        })
    }

    // *富文本
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // *更换封面
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        // 监听coverFile 的change事件
    $('#coverFile').on('change', function(e) {
        var file = e.target.files;
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据文件创建对应的url的地址
        var newImgURL = URL.createObjectURL(file[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    $('#btnSave2').on('click', function() {
            art_state = '草稿';
        })
        // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 给予form表单创建一个formData对象
        var fd = new FormData($(this)[0]);
        // 将发布状态添加到fd中
        fd.append('state', art_state);

        // 将封面裁剪过后的图片输出为一个文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function(blob) {
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发起Ajax数据请求
                publishArticle(fd);
                location.href = '/bigthing/article/art-list.html'
            });


    });


    // 定义发表文章方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意:如果向服务器提交的是formData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 发布文章成功后跳转到文章列表页面
                // location.href = '/bigthing/article/art-list.html'

            }
        })
    }
});