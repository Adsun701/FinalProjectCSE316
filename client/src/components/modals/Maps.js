import React, { useState } 	from 'react';
import { useMutation }    	from '@apollo/client';
import  MapList             from './maplist/MapList';
import world from '../homescreen/world.jpg';

import { WLayout, WLHeader, WLMain, WLSide, WButton } from 'wt-frontend';

const Maps = (props) => {


	return (
		<WLayout wLayout="header-rside" className="map-list">
			<WLHeader className="map-list-header">
				Your Maps
			</WLHeader>
            <WLMain className="map-list-main">
                <MapList maps={props.maps}></MapList>
            </WLMain>
            <WLSide className="map-list-side">
                {
					<div className="image-container">
						<div class="globe">
							<img src={world} alt="The planet Earth, seen from space." width="248" height="248"></img>
						</div>
					</div>
				}
                <WButton className="modal-button" onClick={() => {}} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Create New Map
                </WButton>
            </WLSide>
		</WLayout>
	);
}

export default Maps;
