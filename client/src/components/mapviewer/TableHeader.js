import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoStyle = props.canUndo ? ' undo-redo table-header-button ' : 'undo-redo table-header-button-disabled disabled';
    const redoStyle = props.canRedo ? ' undo-redo table-header-button ' : 'undo-redo table-header-button-disabled disabled';
    const clickDisabled = () => { };

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton onClick={() => {
                    props.sortRegions(props.currentParentId, props.nameAsc ? 1 : -1, "name");
                    props.toggleNameAsc(!props.nameAsc);
                }
                } className='table-header-section' wType="texted" >Name</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={() => {
                    props.sortRegions(props.currentParentId, props.capitalAsc ? 1 : -1, "capital");
                    props.toggleCapitalAsc(!props.capitalAsc);
                }
                } className='table-header-section' wType="texted">Capital</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={() => {
                    props.sortRegions(props.currentParentId, props.leaderAsc ? 1 : -1, "leader");
                    props.toggleLeaderAsc(!props.leaderAsc);
                }
                } className='table-header-section' wType="texted" >Leader</WButton>
            </WCol>
            <WCol size="2">
                <WButton onClick={() => {
                    props.sortRegions(props.currentParentId, props.flagAsc ? 1 : -1, "flag");
                    props.toggleFlagAsc(!props.flagAsc);
                }
                } className='table-header-section' wType="texted" >Flag</WButton>
            </WCol>
            <WCol size="3">
            <WButton onClick={() => {
                    props.sortRegions(props.currentParentId, props.landmarksAsc ? 1 : -1, "landmarks");
                    props.toggleLandmarksAsc(!props.landmarksAsc);
                }
                } className='table-header-section' wType="texted" >Landmarks</WButton>
            </WCol>
        </WRow>
    );
};

export default TableHeader;