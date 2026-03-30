var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./data/meals.json','utf8'));

/* GET travel view */
const meals = (req, res) => {
	res.render('meals', { title: 'Travlr Getaways', ...info, currentPage: 'meals'});
};

module.exports = {
	meals
};