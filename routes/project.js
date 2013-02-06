
/*
 * GET users listing.
 */

var _ = require("underscore");

var data = [
    {id: 1, name: "project1"},
    {id: 2, name: "project2"},
    {id: 3, name: "project3"},
    {id: 4, name: "project4"},
    {id: 5, name: "project5"}
];


exports.get = function(req, res, id) {
    var item = _.find(data, function(i) {
        return i.id === id;
    });
    if (!item) {
        res.status(404).send('Not found');
        return;
    }
    res.json(item);
};

exports.getList = function(req, res) {
    res.json(data);
};

exports.put = function(req, res, id) {
    data = _.filter(data, function(i) { return i.id != id; });
    req.body.id = id;
    data.push(req.body);
    res.json({id: id});
};

exports.post = function(req, res){
    var inputData = _.isArray(req.body) ? req.body : [req.body];
    var results = [];
    for (var i = 0; i < inputData.length; i++) {
        var newId = _.max(_.map(data, function(item) { return item.id; }));
        var item = _.extend({id: newId + 1}, inputData[i]);
        results.push(item);
        data.push(item);
    }
    if (results.length === 1 ) {
        res.json(results[0]);
    } else {
        res.json(results);
    }
};

exports.delete = function(req, res, id) {
    data = _.filter(data, function(i) { return i.id !== id });
    res.json(null);
};