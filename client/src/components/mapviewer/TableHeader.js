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
                    props.sortRegions(props.nameAsc ? 1 : -1);
                    props.toggleNameAsc(!props.nameAsc);
                }
                } className='table-header-section' wType="texted" >Name</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={() => {
                    props.sortRegions(props.dateAsc ? 1 : -1);
                    props.toggleDateAsc(!props.dateAsc);
                }
                } className='table-header-section' wType="texted">Capital</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={() => {
                    props.sortRegions(props.statusAsc ? 1 : -1);
                    props.toggleStatusAsc(!props.statusAsc);
                }
                } className='table-header-section' wType="texted" >Leader</WButton>
            </WCol>
            <WCol size="2">
                <WButton onClick={() => {
                    props.sortRegions(props.assignedToAsc ? 1 : -1);
                    props.toggleAssignedToAsc(!props.assignedToAsc);
                }
                } className='table-header-section' wType="texted" >Flag</WButton>
            </WCol>
            <WCol size="3">
            <WButton onClick={() => {
                    props.sortRegions(props.assignedToAsc ? 1 : -1);
                    props.toggleAssignedToAsc(!props.assignedToAsc);
                }
                } className='table-header-section' wType="texted" >Landmarks</WButton>
            </WCol>
        </WRow>
    );
};

export default TableHeader;