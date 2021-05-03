import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			name
			owner
			regions
		}
	}
`;

export const GET_DB_REGION = gql`
    query GetDBRegion($_id: String) {
		getRegionById(_id: $_id) {
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
