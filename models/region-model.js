const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
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
        regions: [String],
		parentRegion: {
			type: String,
			required: true
		}
	},
    { timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;
