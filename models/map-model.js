const { model, Schema, ObjectId } = require('mongoose');
const Region = require('./region-model').schema;

const mapSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		regions: [Region],
	},
	{ timestamps: true }
);

const User = model('Map', mapSchema);
module.exports = Map;
