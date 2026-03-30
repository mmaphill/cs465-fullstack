var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./data/about.json','utf8'));

/* GET travel view */
const about = (req, res) => {
	res.render('about', { title: 'Travlr Getaways', ...info, currentPage: 'about'});
};

module.exports = {
	about
};