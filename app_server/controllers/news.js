var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./data/news.json','utf8'));

/* GET travel view */
const news = (req, res) => {
	res.render('news', { title: 'Travlr Getaways', ...info, currentPage: 'news'});
};

module.exports = {
	news
};