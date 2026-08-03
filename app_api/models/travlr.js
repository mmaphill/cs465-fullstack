const mongoose = require('mongoose');

// Define the trip schema
const tripSchema = new mongoose.Schema({
	code: { 
		type: String, 
		required: [true, 'Trip code is required'],
		trim: true,
		minlength: [2, 'Code must be at least 2 characters'],
		maxlength: [12, 'Code cannot exceed 12 characters'],
		uppercase: true
	},
	name: { 
		type: String, 
		required: [true, 'Trip name is required'],
		trim: true,
		minlength: [5, 'Name must be at least 5 characters'],
		maxlength: [100, 'Name cannont exceed 100 characters']
	},
	length: { 
		type: String, 
		required: [true, 'Trip length is required']
	},
	start: { 
		type: Date, 
		required: [true , 'Start date is required'],
		validate: {
			validator: (date) => date > new Date(),
			message: 'Start date must be in the future'
		}
	},
	resort: { 
		type: String, 
		required: [true, 'Resort name is required'],
		trim: true
	},
	perPerson: { 
		type: Number, 
		required: [true, 'Price per person is required'],
		min: [0, 'Price cannot be negative'],
		max: [10000, 'Price seems high']
	},
	image: { 
		type: String, 
		required: [true, 'Image URL is required'],
		validate: {
			validator: (url) => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url),
			message: 'Image must be a valid URL to jpg, jpeg, png, or gif'
		}
	},
	description: { 
		type: String, 
		required: [true, 'Description is required'],
		minlength: [10, 'Description must be at least 10 characters'],
		maxlength: [1000, 'Description cannot exceed 1000 characters']
	}
}, {
	timestamps: true
});

// Create indexes for frequently queried fields
tripSchema.index({ code: 1}, { unique: true });
tripSchema.index({ name: 1});
tripSchema.index({ resort: 1});
tripSchema.index({ start: 1});
tripSchema.index({ perPerson: 1});
tripSchema.index({ resort: 1, start: 1, perPerson: 1}); // Compund index for filtering

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;