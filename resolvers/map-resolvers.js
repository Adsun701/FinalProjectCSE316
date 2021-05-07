const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Region = require('../models/region-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
		/** 
		 	@param 	 {object} args - a map id
			@returns {object} a map on success and an empty object on failure
		**/
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},
		/** 
		 	@param 	 {object} args - a region id
			@returns {object} a region on success and an empty object on failure
		**/
		getRegionById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const region = await Region.findOne({_id: objectId});
			if(region) return region;
			else return ({});
		},
		/** 
		 	@param 	 {object} args - a parent id
			@returns {array} an array of regions on success and an empty array on failure
		**/
		getRegionsByParent: async (_, args) => {
			const { parentId } = args;
			const objectId = new ObjectId(parentId);
			const map = await Map.findOne({_id: objectId});
			let regions = [];
			for (let i = 0; i < map.regions.length; i++) {
				let region = await Region.findOne({_id: map.regions[i]});
				regions.push(region);
			}
			return regions;
		}
	},
	Mutation: {
		/** 
		 	@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { map } = args;
			// new object id.
			const objectId = new ObjectId();
			const { name, owner, regions } = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: regions
			});
			// save new map into a collection.
			const updated = newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		/** 
		 	@param 	 {object} args - a map objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if (deleted) {
				// delete all regions that have the matching map id.
				await Region.deleteMany(region => (region !== null && region.map !== _id));
				return true;
			}
			else return false;
		},
		/** 
		 	@param 	 {object} args - a map input object, and the _id of the map.
			@returns {boolean} true on successful update, false on failure
		**/
		renameMap: async (_, args) => {
			const { map, _id } = args;
			const objectId = new ObjectId(_id);
			const newName = map["name"];
			// update map with new name.
			const updated = await Map.updateOne({_id: objectId}, {name: newName});
			if(updated) return newName;
			else return "unable to rename map.";
		},
		/** 
		 	@param 	 {object} args - a region object.
			@returns {string} the objectID of the region or an error message
		**/
		addRegion: async(_, args) => {
			const { region, regionId, index} = args;
			let _id = null;
			if (regionId !== '') _id = regionId;
			else _id = new ObjectId();
			// new object id for region.
			// set parent of region.
			const parent = region.parent;

			// construct new region.
			const newRegion = new Region({
				_id: _id,
				name: region.name,
				capital: region.capital,
				leader: region.leader,
				flag: region.flag,
				landmarks: region.landmarks,
				regions: region.regions,
				parent: region.parent,
				map: region.map,
				ancestry: region.ancestry
			});

			let updated = null;

			// look in maps.
			const mapFound = await Map.findOne({_id: parent});
			if(mapFound) {
				let listRegions = mapFound.regions;
				if (index === -1) listRegions.push(_id);
				else listRegions.splice(index, 0, _id);
				updated = await Map.updateOne({_id: parent}, { regions: listRegions });
			}
			else {
				// look in regions.
				const regionFound = await Region.findOne({_id: parent});
				if (regionFound) {
					let listRegions = regionFound.regions;
					if (index === -1) listRegions.push(_id);
					else listRegions.splice(index, 0, _id);
					updated = await Region.updateOne({_id: parent}, { regions: listRegions });
				}
				else {
					return ('Map or region not found');
				}
			}
			
			if(updated) {
				newRegion.save();
				return (newRegion._id);
			}
			else return ('Could not add region');
		},
		/** 
		 	@param 	 {object} args - a region objectID and its map objectID
			@returns {array} the updated region array on success or the initial 
							 array on failure
		**/
		deleteRegion: async (_, args) => {
			const  { regionId, parentId, index } = args;
			// look in maps.
			const mapFound = await Map.findOne({_id: parentId});
			if(mapFound) {
				let listRegions = mapFound.regions;
				listRegions = listRegions.filter(region => region.toString() !== regionId);
				updated = await Map.updateOne({_id: parentId}, { regions: listRegions });

				// delete our region from regions.
				await Region.deleteOne({_id: regionId});
				return listRegions;
			}
			else {
				// look in regions.
				const regionFound = await Region.findOne({_id: parentId});
				if (regionFound) {
					let listRegions = regionFound.regions;
					listRegions = listRegions.filter(region => region.toString() !== regionId);
					updated = await Region.updateOne({_id: parentId}, { regions: listRegions });

					// delete our region from regions.
					await Region.deleteOne({_id: regionId});
					return listRegions;
				}
				else {
					return [];
				}
			}
		},
		/** 
			@param	 {object} args - a region objectID, field, and
									 update value.
			@returns {object} the updated region on success, or the initial region on failure
		**/
		updateRegionField: async (_, args) => {
			const { regionId, field } = args;
			let { value } = args
			const found = await Region.findOne({_id: regionId});
			let region = found;
			region[field] = value;
			let updated = null;
			if (field === "name")
				updated = await Region.updateOne({_id: regionId}, {name: value});
			else if (field === "capital")
				updated = await Region.updateOne({_id: regionId}, {capital: value});
			else if (field === "leader")
				updated = await Region.updateOne({_id: regionId}, {leader: value});
			else
				updated = await Region.updateOne({_id: regionId}, {flag: value});
			if(updated) return (region);
			else return (found);
		},
		/**
			@param 	 {object} args - contains map id, region to swap, and swap direction
			@returns {array} the reordered region array on success, or initial ordering on failure
		**/
		reorderRegions: async (_, args) => {
			const { _id, regionId, direction } = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let listRegions = found.regions;
			const index = listRegions.findIndex(region => region._id.toString() === regionId);
			// move selected region visually down the list
			if(direction === 1 && index < listRegions.length - 1) {
				let next = listRegions[index + 1];
				let current = listRegions[index]
				listRegions[index + 1] = current;
				listRegions[index] = next;
			}
			// move selected region visually up the list
			else if(direction === -1 && index > 0) {
				let prev = listRegions[index - 1];
				let current = listRegions[index]
				listRegions[index - 1] = current;
				listRegions[index] = prev;
			}
			const updated = await Map.updateOne({_id: mapId}, { regions: listRegions })
			if(updated) return (listRegions);
			// return old ordering if reorder was unsuccessful
			listRegions = found.regions;
			return (found.regions);
		},

		/**
		  	@param {object} args - contains parent id, sort direction (1 is ascending, -1 is descending), state (stringified regions)
                and field (a String name, capital, leader or flag)
		  	@returns {array} the sorted region array (by description) on success, or initial ordering on failure
		**/
		sortRegions: async (_, args) => {
			const { _id, direction, state, field} = args;
			const parentId = new ObjectId(_id);
			let listRegions = null;
			let arr = await Region.find({parent: parentId});

			// sort regions by field.
            if (field === "name") {
                if (direction > 0) {
					arr.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else if (direction < 0) {
					arr.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else {
					arr = JSON.parse(state);
					listRegions = arr.map((region => region._id));
				}
            }
            else if (field === "capital") {
                if (direction > 0) {
					arr.sort((a, b) => (a.capital.toLowerCase() < b.capital.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else if (direction < 0) {
					arr.sort((a, b) => (a.capital.toLowerCase() > b.capital.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else {
					arr = JSON.parse(state);
					listRegions = arr.map((region => region._id));
				}
            }
            else if (field === "leader") {
                if (direction > 0) {
					arr.sort((a, b) => (a.leader.toLowerCase() < b.leader.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else if (direction < 0) {
					arr.sort((a, b) => (a.leader.toLowerCase() > b.leader.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else {
					arr = JSON.parse(state);
					listRegions = arr.map((region => region._id));
				}
            }
            else if (field === "flag") {
                if (direction > 0) {
					arr.sort((a, b) => (a.flag.toLowerCase() < b.flag.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else if (direction < 0) {
					arr.sort((a, b) => (a.flag.toLowerCase() > b.flag.toLowerCase()) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else {
					arr = JSON.parse(state);
					listRegions = arr.map((region => region._id));
				}
            }
			else if (field === "landmarks") {
                if (direction > 0) {
					arr.sort((a, b) => ((a.landmarks.length > 0 ? a.landmarks[0].toLowerCase() : "No Landmarks") <
						(b.landmarks.length > 0 ? b.landmarks[0].toLowerCase() : "No Landmarks")) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else if (direction < 0) {
					arr.sort((a, b) => ((a.landmarks.length > 0 ? a.landmarks[0].toLowerCase() : "No Landmarks") >
						(b.landmarks.length > 0 ? b.landmarks[0].toLowerCase() : "No Landmarks")) ? 1 : -1);
					listRegions = arr.map((region => region._id));
				}
                else {
					arr = JSON.parse(state);
					listRegions = arr.map((region => region._id));
				}
            }
			const mapUpdated = await Map.updateOne({_id: parentId}, { regions: listRegions });
			const regionUpdated = await Region.updateOne({_id: parentId}, { regions: listRegions });
			if(mapUpdated || regionUpdated) return (arr);
			// return old ordering if reorder was unsuccessful
			arr = JSON.parse(state);
			return (arr);
		}
	}
}
