
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
    for (var i = 0; i < inputData.length; i++) {
        var newId = _.max(_.map(data, function(item) { return item.id; }));
        var item = inputData[i];
        item.id = newId + 1;
        data.push(item);
    }
    if (inputData.length === 1 ) {
        return res.json(inputData[0]);
    } else {
        res.json(inputData);
    }
};

exports.delete = function(req, res) {
    data = _.without(data, function(i) { return i.id === id });
};