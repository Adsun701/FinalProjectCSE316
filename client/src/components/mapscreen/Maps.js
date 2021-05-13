import React 				from 'react';
import MapList             	from './maplist/MapList';
import world 				from '../homescreen/world.jpg';

import { WCol, WRow, WLayout, WLHeader, WLMain, WButton } from 'wt-frontend';

const Maps = (props) => {


	return (
		<WLayout wLayout="header">
			<WLHeader className="map-list-header">
				Your Maps
			</WLHeader>
            <WLMain className="map-list-main">
				<WRow>
					<WCol size='6'>
               			<MapList maps={props.maps} setShowDelete={props.setShowDelete} setShowRename={props.setShowRename}></MapList>
					</WCol>
					<WCol size='6'>
							{
								<div className="image-container">
									<div class="globe">
										<img src={world} alt="The planet Earth, seen from space." width="456" height="456"></img>
									</div>
								</div>
							}
						<WButton className="create-map-button modal-button" onClick={() => {props.setShowMap();}} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
							Create New Map
						</WButton>
					</WCol>
				</WRow>
            </WLMain>
		</WLayout>
	);
}

export default Maps;
