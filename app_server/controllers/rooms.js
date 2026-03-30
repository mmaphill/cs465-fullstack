var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./data/rooms.json','utf8'));

/* GET travel view */
const rooms = (req, res) => {
	res.render('rooms', { title: 'Travlr Getaways', ...info, currentPage: 'rooms'});
};

module.exports = {
	rooms
};