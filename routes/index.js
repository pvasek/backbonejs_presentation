var fs = require('fs')
    , hbs = require('hbs');

/*
 * GET home page.
 */

exports.index = function(req, res){
    var pagesDir = req.app.get('pages directory');

    // reload handlebars partials
    fs.readdirSync(pagesDir).forEach(function(file) {
        var pageName = file.replace('.html', '');
        hbs.registerPartial(pageName, fs.readFileSync(pagesDir + file, 'utf8'));
    });

  res.render('index', { title: 'Backbone.js - Presentation' });
};