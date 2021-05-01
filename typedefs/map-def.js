const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		owner: String!
		regions: [String]
	}
	type Region {
		_id: String!
		name: String!
		capital: String!
		leader: String!
        flag: String!
		landmarks: [String]
        regions: [String]
		parent: String
		map: String
		ancestry: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addRegion(region: RegionInput!, parent: String!): String
		addMap(map: MapInput!): String
		deleteRegion(_id: String!): [Region]		
		deleteMap(_id: String!): Boolean
		renameMap(map: MapInput!, _id: String!): String
		updateMapField(_id: String!, field: String!, value: String!): String
		updateRegionField(_id: String!, field: String!, value: String!, flag: Int!): [Region]
		reorderRegions(_id: String!, direction: Int!): [Region]
		sortRegions(_id: String!, direction: Int!, state: String!, field: String!): [Region]
	}
	input MapInput {
		name: String
		owner: String
	}
	input RegionInput {
		name: String
        capital: String
        leader: String
        flag: String
        landmarks: [String]
		regions: [String]
		parent: String
		map: String
	}
`;

module.exports = { typeDefs: typeDefs }
