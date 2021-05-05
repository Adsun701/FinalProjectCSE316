import React, { useState } from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import { GET_DB_REGION } 				from '../../cache/queries';

const TableEntry = (props) => {

    let newRegion = null;
    const {data} = useQuery(GET_DB_REGION, { variables: {_id: props.regionId} });
	if(data) newRegion = data.getRegionById;

    const region = newRegion ? newRegion : {};
    const _id = region ? region._id : '';
    const name = region ? region.name : '';
    const capital = region ? region.capital : '';
    const leader = region ? region.leader : '';
    const flag = region ? region.flag : '';
    const landmarks = region ? region.landmarks : [];
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const [editingFlag, toggleFlagEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'N/A';
        const prevName = name;
        props.editRegion(_id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        //console.log(e);
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'N/A';
        const prevCapital = capital;
        props.editRegion(_id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'N/A';
        const prevLeader = leader;
        props.editRegion(_id, 'leader', newLeader, prevLeader);
    };

    const handleFlagEdit = (e) => {
        toggleFlagEdit(false);
        const newFlag = e.target.value ? e.target.value : 'N/A';
        const prevFlag = flag;
        props.editRegion(_id, 'flag', newFlag, prevFlag);
    };

    return (
        <WRow className='table-entry'>
            <WCol size="3">
                {
                    editingName || name === ''
                        ? <input
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            onClick={() => toggleNameEdit(!editingName)}
                            onDoubleClick={() => {props.goToRegion(_id)}}
                        >{name}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingCapital ? <input
                        className='table-input' onBlur={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleCapitalEdit(!editingCapital)}
                        >{capital}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader ? <input
                        className='table-input' onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleLeaderEdit(!editingLeader)}
                        >{leader}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingFlag ? <input
                        className='table-input' onBlur={handleFlagEdit}
                        autoFocus={true} defaultValue={flag} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleFlagEdit(!editingFlag)}
                        >{flag}
                        </div>
                }
            </WCol>
            <WCol size="3">
                {
                    <div className="table-text"
                        onClick={() => props.regionViewer(_id) }
                    >{region.landmarks && region.landmarks.length > 0 ? region.landmarks[0] : "No Landmarks"}
                    </div>
                }
            </WCol>
        </WRow>
    );
};

export default TableEntry;
