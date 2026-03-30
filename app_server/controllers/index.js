/* GET homepage */
var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./data/index.json','utf8'));

const index = (req, res) => {
	res.render('index', { title: 'Travlr Getaways', ...info, currentPage: 'index'});
};

module.exports = {
	index
};