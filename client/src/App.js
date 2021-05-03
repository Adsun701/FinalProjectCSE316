import React 			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import MapScreen 		from './components/mapscreen/MapScreen';
import MapViewer 		from './components/mapviewer/MapViewer';
import RegionViewer from './components/regionviewer/RegionViewer';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
 
const App = () => {
	let user = null;
    let tps = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) {
			user = getCurrentUser;
		}
    }

	return(
		<BrowserRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				<Route 
					path="/welcome" 
					name="welcome" 
					render={() => 
						<Homescreen fetchUser={refetch} user={user}/>
					} 
				/>
				<Route/>
			</Switch>
			<Switch>
				<Route 
					path="/maps" 
					name="maps" 
					render={() => 
						<MapScreen fetchUser={refetch} user={user}/>
					} 
				/>
				<Route/>
			</Switch>
			<Switch>
				<Route 
					path="/map/:_id" 
					name="map/:_id" 
					render={() => 
						<MapViewer fetchUser={refetch} user={user} tps={tps}/>
					} 
				/>
				<Route/>
			</Switch>
			<Switch>
				<Route 
					path="/view/:_id" 
					name="view/:_id" 
					render={() => 
						<RegionViewer fetchUser={refetch} user={user} tps={tps}/>
					} 
				/>
				<Route/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;