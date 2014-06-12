define(function (require, exports, modules) {
    'use strict';
    var $ = require('$');
    
    $('pre').addClass('prettyprint').each(function (i, pre) {
        var code = pre.firstChild.innerHTML;
        pre.innerHTML = prettyPrintOne(code);
    });
});