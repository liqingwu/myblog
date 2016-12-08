/**
 * Created by Administrator on 2016/12/3.
 */
//获取url中指定的参数值
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);

//封装点赞函数
function getSupport(id) {
    $.getJSON('http://127.0.0.1:8888/support/' + id, function (data) {
        if(data.code === 1){
            $('.media .support span').html(data.data);
        }
    })
}
//封装差评函数
function getOppose(id) {
    $.getJSON('http://127.0.0.1:8888/oppose/' + id, function (data) {
        if(data.code === 1){
            $('.media .oppose span').html(data.data);
        }
    })
}
$(function () {
    //var arr = location.href.split('/');
    //var id = +arr[arr.length-1];
    //$('input[type="hidden"]').val(id);
    var id = $.getUrlParam('id');
    //渲染页面的内容
    $.getJSON('http://127.0.0.1:8888/admin/posts/' + id, function (data) {
        console.log(data);
        if (data.code === 1) {
            var str = '<h2 class="post_title">$title</h2>' +
                ' <h3 class="post_subtitle">$subtitle</h3>' +
                '<p class="post_meta">$meta</p>';
            str = str.replace('$subtitle', data.data.excerpt).replace('$title', data.data.title).replace('$meta', data.data.created)
            $('header .site-heading').html(str);
            $('.main .postsbox').html(data.data.content);
        }
    })

    //获取用户的评论列表
    function loadCommemts(){
        $.getJSON('http://127.0.0.1:8888/comments/' + id, function (data) {
            if(data&&data.length>0){
                var html = template('comments', {result: data});
                $('.media').html(html);
            }else{
                //无评论
                $(".media").text("赶紧发送评论，暂时无评论");
            }
        })
    }
    loadCommemts();

    //发表评论
    $('.btn-block').on('click', function () {
        $.post('http://127.0.0.1:8888/comments/create',$('form').serialize(), function (data) {
            if(data.code === 1){
                layer.msg('发表成功');
                loadCommemts();
            }else if(data.code === -1){
                layer.msg('您已经发表过评论了');
            }else{
                layer.msg('发表出错');
            }
            return false;
        })
    })
})