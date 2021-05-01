const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: true
		},
		leader: {
			type: String,
			required: true
		},
		flag: {
			type: String,
			required: true
		},
        landmarks: [String],
        regions: [String],
		parent: {
			type: String,
			required: true
		},
		map: {
			type: String,
			required: true
		},
		ancestry: [String]
	},
    { timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;
