const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		description: String!
		regions: [Region]
	}
	type Region {
		_id: String!
		description: String!
		capital: String!
		leader: String!
        flag: String!
		landmarks: [String]
        regions: [Region]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addRegion(region: RegionInput!, _id: String!, index: Int!): String
		addMap(map: MapInput!): String
		deleteRegion(_id: String!): [Region]		
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		updateRegionField(_id: String!, field: String!, value: String!, flag: Int!): [Region]
		reorderRegions(_id: String!, direction: Int!): [Region]
		sortRegions(_id: String!, direction: Int!, state: String!, field: String!): [Region]
	}
	input MapInput {
		_id: String
		name: String
		description: String
		regions: [RegionInput]
	}
	input RegionInput {
		_id: String
		name: String
		description: String
        capital: String
        leader: String
        flag: String
        landmarks: [String]
		regions: [RegionInput]
	}
`;

module.exports = { typeDefs: typeDefs }
