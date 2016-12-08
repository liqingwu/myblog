/**
 * Created by Administrator on 2016/11/30.
 */

//添加获取参数的jQuery方法
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);


//添加帖子设置
var ue = UE.getEditor('myEditor', {
    //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
    toolbars: [['Source', 'Undo', 'Redo', 'Bold', 'test']],
    //focus时自动清空初始化时的内容
    autoClearinitialContent: true,
    //关闭字数统计
    wordCount: false,
    //关闭elementPath
    elementPathEnabled: false,
    //默认的编辑区域高度
    initialFrameHeight: 300
    //更多其他参数，请参考ueditor.config.js中的配置项
})

$(function () {
    //渲染所有帖子列表函数封装
    var loadPosts = function () {
        $.getJSON('http://127.0.0.1:8888/admin/posts', function (data) {
            //判断权限
            if (data && data.code === -1) {
                location.href = "/account/login";
                return;
            }
            $('.container-fluid.detail ul .row:gt(0)').remove();
            var html = template('paper_table', {results: data});
            $('.container-fluid.detail ul').append(html);
        })
    }
    //渲染所有帖子列表
    loadPosts();
    //帖子搜索操作
    $('#basic-addon2').on('click', function () {
        var $data = $(this).siblings('input').val();
        $.getJSON('http://127.0.0.1:8888/admin/posts/search', {wd: $data}, function (data) {
            if (data && data.code === -1) {
                location.href = "/account/login";
                return;
            }
            if (data.code !== 0) {
                $('.container-fluid.detail ul .row:gt(0)').remove();
                var html = template('paper_table', {results: data});
                $('.container-fluid.detail ul').append(html);
            }
        })
    })

    //删除帖子操作
    $('.detail').on('click', '.btn-danger', function () {
        var id = $(this).parent('div').attr('data-id');
        //提示是否删除
        layer.msg('你确定要删除吗？', {
            time: 0, btn: ['确定', '取消'], yes: function (index) {
                layer.close(index);
                $.getJSON('http://127.0.0.1:8888/admin/posts/delete/' + id, function (data) {
                    //判断权限
                    if (data && data.code === -1) {
                        location.href = 'login.html';
                        return;
                    }
                    if (data && data.code === 1) {
                        layer.msg('删除成功');
                        loadPosts();
                    } else {
                        layer.msg('删除失败');
                    }
                })
            }
        })
    })

    //添加或修改帖子的标识
    var flag = -1;
    $('button[data-target="#exampleModal"]').on('click', function () {
        flag = 1;
        $('#exampleModalLabel').text('添加帖子');
        ue.setContent('请输入帖子内容');
    })

    //编辑帖子按钮操作
    $('.container-fluid.detail').on('click', '.btn-primary', function () {
        flag = 2;
        $('#exampleModalLabel').text('编辑帖子');
        $('#exampleModal').modal('show');
        //发送请求，根据id获取帖子内容
        var id = $(this).parent('div').attr('data-id');
        $.getJSON('http://127.0.0.1:8888/admin/posts/' + id, function (data) {
            $('#title').val(data.data.title);
            $('#id').val(data.data.id);
            //设置ueditor内容
            ue.setContent(data.data.content);
        })
    })

    //保存帖子操作
    $('#exampleModal .modal-footer .btn-primary').on('click', function () {
        //ue.getContent('myEditor');   //获取ueditor的内容
        var data = $('#exampleModal form').serialize();
        data = data.replace('editorValue', 'content');
        if (flag === 1) {  //添加帖子
            savePage(data, 'create');
        } else if (flag === 2) {
            savePage(data, 'update');
        }

    })

    //返回登录操作
    $('#logout').on('click', function () {
        location.href = 'login.html';
    })

    //保存帖子函数封装
    function savePage(data, url) {
        $.post('http://127.0.0.1:8888/admin/posts/' + url, data, function (data) {
            //判断权限
            if (data && data.code === -1) {
                location.href = "login.html";
                return;
            }
            if (data && data.code === 1) {
                layer.msg('保存成功');
                $('#exampleModal').modal('hide');
                loadPosts();
            } else {
                layer.msg('保存失败');
            }
        })
    }

})

