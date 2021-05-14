const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String
		name: String
		owner: String
		regions: [String]
	}
	type Region {
		_id: String
		name: String
		capital: String
		leader: String
        flag: String
		landmarks: [String]
        regions: [String]
		parent: String
		map: String
		ancestry: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
		getRegionById(_id: String): Region
		getRegionsByParent(parentId: String): [Region]
		getNamesFromAncestry(ancestry: [String]): [String]
		getLandmarksOfSubregions(_ids: [String]): [String]
	}
	extend type Mutation {
		addRegion(region: RegionInput!, regionId: String!, index: Int!): String
		addMap(map: MapInput!): String
		deleteRegion(regionId: String!, parentId: String!, index: Int!): [Region]		
		deleteMap(_id: String!): Boolean
		renameMap(map: MapInput!, _id: String!): String
		updateMapField(_id: String!, field: String!, value: String!): String
		updateRegionField(regionId: String!, field: String!, value: String!): Region
		reorderRegions(_id: String!, direction: Int!): [Region]
		sortRegions(_id: String!, direction: Int!, state: String!, field: String!): [Region]
		addLandmark(newLandmark: String!, regionId: String!, index: Int!): Boolean
		deleteLandmark(landmark: String!, regionId: String!): Int
	}
	input MapInput {
		name: String
		owner: String
	}
	input RegionInput {
		_id: String
		name: String
        capital: String
        leader: String
        flag: String
        landmarks: [String]
		regions: [String]
		parent: String
		map: String
		ancestry: [String]
	}
`;

module.exports = { typeDefs: typeDefs }
