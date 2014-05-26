(function (global, $$) {
    var q = document.getElementById('q'),
        rst = document.getElementById('result'),
        //target = document.getElementById('target'),
        info = document.getElementById('info');
    q.focus();
    q.addEventListener('keydown', function (e) {
        var str;
        if (e.keyCode === 13) {
            str = this.value.trim();
            if (str) {
                $$.ajax({
                    url: '/translate',
                    type: 'post',
                    data: {q: str},
                    responseType: 'json',
                    success: function (res) {
                        var result = '';
                        if(!res) {
                            rst.innerHTML = '系统出错';
                            info.innerHTML = '';
                        }
                        if(res.error_code) {
                            rst.innerHTML = '无法翻译你输入的内容 ERROR_CODE: ' + res.error_code;
                            info.innerHTML = '';
                        }
                        if(res.trans_result || res.trans_result.length) {
                            rst.innerHTML = res.trans_result[0].dst;
                            info.innerHTML = '从<i>' +
                                res.from + '</i>到<i>' +
                                res.to + '</i>';
                        }
                    },
                    error: function (res) {},
                    before: function () {},
                    after: function () {}
                });
            }
            e.preventDefault();
            return false;
        }
    });
})(window, window.jPure);