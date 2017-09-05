$(function () {
    //轮播图
    slide();
    //tab栏
    tab();
    //侧边栏
    sidebar();
    //连载动画
    lianzai();
    //专题
    zhuanti();
    //点击返回按钮返回
    back();
    // allSlide();
})


//轮播图
function slide() {
    $.ajax({
        url: "http://127.0.0.1:9091/api/getlunbo",
        dataType: "json",
        success: function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += '<div class="swiper-slide">' +
                    '<a href="' + data[i].url + '"><img src="' + data[i].img + '" alt=""></a>' +
                    '<div><p>' + data[i].title + '</p></div>' +
                    '</div>'
            }
            $('.swiper-wrapper').append(html);
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                slidesPerView: 1,
                loop: true, //循环 无缝轮播
                autoplay: 2000, //轮播图自动播放
                autoplayDisableOnInteraction: false, //当滑动之后是否要禁用自动轮播
                simulateTouch: true
            });
        }
    });
}

//tab栏
function tab() {
    // 拿数据
    function getData(index) {
        $.ajax({
            url: "http://127.0.0.1:9091/api/gethometab/" + index,
            success: function (data) {
                $('#tab .tab-content ul').html(template('temp-tab-content', data));
            }
        });
    }
    //默认第一页
    getData(1);
    //点击
    $('#tab .tab-top ul').on('tap', 'a', function () {
        var index = $(this).parent().index() + 1;
        $(this).parent().siblings().find('a').removeClass('active');
        $(this).addClass('active');
        getData(index);
    });
}

//sidebar侧边栏

function sidebar() {
    var windowWidth;
    var windowHeight;
    $(window).on('resize', function () {
        windowWidth = $('#layout').width() * 0.7;
        windowHeight = $(window).height();
    }).trigger('resize');
    $('.dropDown').tap(function () {
        $('#sidebar').css({
            'width': windowWidth + 'px',
            'left': -windowWidth + 'px'
        })
        $('#sidebar').show().animate({
            transform: 'translate(' + windowWidth + 'px)'
        }, 300);
        $('#layout').css('height', windowHeight);
        $('#layout .mast').show().animate({
            transform: 'translate(' + windowWidth + 'px)'
        }, 300);
        $('#sidebar').css('height', '100%');
        $('#wrap').animate({
            transform: 'translate(' + windowWidth + 'px)'
        }, 300)
    })
    $('.mast').tap(function () {
        mainBack();
        $('#layout').css('height', 'auto');
        $('#layout .mast').hide().animate({
            transform: 'translate(' + 0 + 'px)'
        }, 300);
        $('#wrap').animate({
            transform: 'translate(' + 0 + 'px)'
        }, 300)
    })
}

//  连载动漫
function lianzai() {
    //点击进去
    $('.dongman').tap(function () {
        getDongManDate("http://127.0.0.1:9091/api/getlianzai");
    })
}
//  专题列表
function zhuanti() {
    //点击进入
    $('.zhuanti').tap(function () {
        getDongManDate('http://127.0.0.1:9091/api/gettopics');
    })
}

//获取连载动漫数据和专题列表数据
function getDongManDate(url) {
    $.ajax({
        url: url,
        success: function (data) {
            var datas = {
                list: data
            }
            $('#content').html(template('temp-content', datas));
            $('#content').show().animate({
                transform: 'translateX(0px)'
            }, 300, function () {
                $('#layout .mast').hide().css({
                    transform: 'translate(' + 0 + 'px)'
                });
                $('#wrap').css({
                    transform: 'translate(' + 0 + 'px)'
                })
            })
            mainBack();
            $('#layout').css({
                'height': 'auto',
                'overflow': 'visible'
            });

        }
    });
}
//主页面返回函数
function mainBack() {
    $('#sidebar').animate({
        transform: 'translate(' + 0 + 'px)'
    }, 300, function () {
        $('#sidebar').css({
            'width': 0 + 'px',
            'height': 0 + 'px',
            'left': 0 + 'px'
        })
        $('#sidebar').hide();
    });
}
// 连载动漫和专题列表的返回
function back() {
    $('#content').on('tap', '.back', (function () {
        $('#content').animate({
            transform: 'translateX(100%)'
        }, 300, function () {
            $('#content').hide();
        })
        $('#layout').css({
            'overflow': 'hidden'
        });
    }))
}

// 整屏滑动 没成功；；，；，，。；@~！@~@~

function allSlide() {
    var startY = 0,
        moveY = 0,
        distanceY = 0,
        currentY = 0;
    var maxSwiper = 80;
    var minSwiper = $('#layout').height() - $('#wrap').height() - 80;
    var maxPosition = 0;
    var minPosition = $('#layout').height() - $('#wrap').height();
    $('#wrap').on('touchstart', function (event) {
        startY = event.touches[0].clientY;
    })
    $('#wrap').on('touchmove', function (event) {
        moveY = event.touches[0].clientY;
        distanceY = moveY - startY;
        // console.log(distanceY);
        if ((distanceY + currentY) < maxSwiper && (distanceY + currentY) > minSwiper) {
            $('#wrap').css({
                'transform': 'translateY(' + (distanceY + currentY) + 'px)',
                'transition': 'none'
            });
        }
    })
    $('#wrap').on('touchend', function () {
        currentY += distanceY;
        if (currentY > maxPosition) {
            $('#wrap').css({
                'transform': 'translateY(' + maxPosition + 'px)',
                'transition': 'all 0.2s'
            })
            currentY = maxPosition;
        } else if (currentY < minPosition) {
            $('#wrap').css({
                'transform': 'translateY(' + minPosition + 'px)',
                'transition': 'all 0.2s'
            })
            currentY = minPosition;
        }
    })
}