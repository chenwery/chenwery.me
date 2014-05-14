exports.test = function (req, res) {
    var con = require('../models/connection');
    con.exec('SELECT 1 + 1 + 3 AS solution', function (result) {
        res.send(result);
    });
};