const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: false
		},
		leader: {
			type: String,
			required: false
		},
		flag: {
			type: String,
			required: false
		},
        landmarks: [String],
        regions: [this],
	},
    { timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;
