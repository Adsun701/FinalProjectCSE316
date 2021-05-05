import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;

export const UPDATE = gql`
	mutation Update($_id: String!, $email: String!, $password: String!, $name: String!) {
		update(_id: $_id, email: $email, password: $password, name: $name) {
			_id
			email
			password
			name
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!) {
	  	addRegion(region: $region)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($regionId: String!, $_id: String!) {
		deleteRegion(regionId: $regionId, _id: $_id) {
			_id
			name
			capital
			leader
			flag
			landmarks
			regions
			parent
			map
			ancestry
		}
	}
`;

export const UPDATE_REGION_FIELD = gql`
	mutation UpdateRegionField($regionId: String!, $field: String!, $value: String!) {
		updateRegionField(regionId: $regionId, field: $field, value: $value) {
			_id
			name
			capital
			leader
			flag
			landmarks
			regions
			parent
			map
			ancestry
		}
	}
`;

export const REORDER_REGIONS = gql`
	mutation ReorderRegions($_id: String!, $regionId: String!, $direction: Int!) {
		reorderRegions(_id: $_id, regionId: $regionId, direction: $direction) {
			_id
			name
			capital
			leader
			flag
			landmarks
			regions
			parent
			map
			ancestry
		}
	}
`;

export const SORT_REGIONS = gql`
	mutation SortRegions($_id: String!, $direction: Int!, $state: String!, $field: String!) {
		sortRegions(_id: $_id, direction: $direction, state: $state, field: $field) {
			_id
			name
			capital
			leader
			flag
			landmarks
			regions
			parent
			map
			ancestry
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) 
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const RENAME_MAP = gql`
	mutation RenameMap($map: MapInput!, $_id: String!) {
		renameMap(map: $map, _id: $_id)
	}
`;
