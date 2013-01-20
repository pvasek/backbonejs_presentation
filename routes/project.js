
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
    data = _.without(data, function(i) { return i.id === id });
    data.push(req.body);
};

exports.post = function(req, res){
    data.push(req.body);
};

exports.delete = function(req, res) {
    data = _.without(data, function(i) { return i.id === id });
};