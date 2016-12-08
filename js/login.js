/**
 * Created by Administrator on 2016/11/30.
 */

/* 插件设置 */
jQuery(function ($) {
    $.supersized({
        // Functionality
        slide_interval: 3000,		// Length between transitions
        transition: 1, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed: 700,		// Speed of transition
        // Components
        slide_links: 'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
        slides: [			// Slideshow Images
            {image: 'images/1.jpg'},
            {image: 'images/2.jpg'},
            {image: 'images/3.jpg'}
        ]
    });
});
//登录请求
window.onload = function () {
    $('#btn').on('click', function () {
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:8888/account/login',
            data: $('form').serialize(),
            success: function (data) {
                if (data.code === 1) {
                    layer.msg(data.msg);
                    window.location.href = 'backstage.html';
                } else {
                    layer.msg('用户名或密码错误');
                    return false;
                }
            },
            error: function () {
                layer.msg('服务器错误');
                window.location.href = 'http://127.0.0.1:8888/www/web/404.html';
            }
        })
    })
}