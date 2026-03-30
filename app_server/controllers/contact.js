var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./data/contact.json','utf8'));

/* GET travel view */
const contact = (req, res) => {
	res.render('contact', { title: 'Travlr Getaways', ...info, currentPage: 'contact'});
};

module.exports = {
	contact
};