/**
 * Created by Administrator on 2016/12/2.
 */

$(function () {
    var pageindex = 1,pagesize = 5;
   function setPosts(data){
       $.getJSON('http://127.0.0.1:8888/posts/getpage',data, function (data) {
           var html = template('posts-page',{result:data});
           $('#posts').html(html);
       })
   }
   var data = {pageindex:1,pagesize:5};
    setPosts(data);

    $('.main .previous a').on('click', function () {
        if(pageindex <= 1){
            layer.msg('已经是第一页了');
            return false;
        }
        pageindex--;
        setPosts({pageindex:pageindex,pagesize:pagesize});
    })
    $('.main .next a').on('click', function () {
        $.getJSON('http://127.0.0.1:8888/posts/count',{pagesize:pagesize}, function (data) {
            if(data.pagecount > pageindex){
                pageindex++;
                setPosts({pageindex:pageindex,pagesize:pagesize});
            }else{
                layer.msg('已经是一页了'+data.pagecount);
            }
            return false;
        })
    })
})