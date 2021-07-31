$(function() {
    // 定义一个查询参数对象,将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页
        pagesize: 2, //每页显示几条数据 默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }

    const layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    initTable();
    initCate();
    // 获取问猴子那个列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());


        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!');
                }
                // 调用引擎模板渲染分类可选项
                const htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染下拉菜单区
                form.render();
            }
        })
    }



    // 筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();

        // 获取表单中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件,重新渲染表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示多少条
            curr: q.pagenum, //默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 发生切换时 出发jump回调
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr;
                // 根据最新的q获取对应的数据列表
                q.pagesize = obj.limit;
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });

    }

    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
            // 获取当前文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!');
                    // 当数据删除完全后,需要判断当前页是否有剩余数据
                    // 如果没有数据,则页码减一
                    // 如果有,就直接调用重新渲染数据
                    if (len === 1) { //删除完毕后,页面没有列表
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })




})