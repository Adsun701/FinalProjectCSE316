import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useApolloClient, useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
	SortItemsByDesc_Transaction,
	SortItemsByDate_Transaction,
	SortItemsByStatus_Transaction,
	SortItemsByAssignedTo_Transaction,
	jsTPS} 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';


const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [listSelected, toggleListSelected] = useState(false);
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [descAsc, toggleDescAsc] 			= useState(true);
	const [dateAsc, toggleDateAsc] 			= useState(true);
	const [statusAsc, toggleStatusAsc] 		= useState(true);
	const [assignedToAsc, toggleAssignedToAsc] = useState(true);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [SortItemsByDesc]			= useMutation(mutations.SORT_ITEMS_BY_DESC);
	const [SortItemsByDate]			= useMutation(mutations.SORT_ITEMS_BY_DATE);
	const [SortItemsByStatus]		= useMutation(mutations.SORT_ITEMS_BY_STATUS);
	const [SortItemsByAssignedTo]	= useMutation(mutations.SORT_ITEMS_BY_ASSIGNED_TO);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);

	const client = useApolloClient();


	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { todolists = data.getAllTodos; }

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	const tpsReset = async () => {
		const retVal = await props.tps.reset();
		return retVal;
	}

	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const lastID = items.length >= 1 ? items[items.length - 1].id + 1 : 0;
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'Not Assigned',
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const sortItemsByDesc = async (dir) => {
		let listID = activeList._id;
		let state = JSON.stringify(activeList.items);
		let transaction = new SortItemsByDesc_Transaction(listID, dir, state, SortItemsByDesc);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortItemsByDate = async (dir) => {
		let listID = activeList._id;
		let state = JSON.stringify(activeList.items);
		let transaction = new SortItemsByDate_Transaction(listID, dir, state, SortItemsByDate);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortItemsByStatus = async (dir) => {
		let listID = activeList._id;
		let state = JSON.stringify(activeList.items);
		let transaction = new SortItemsByStatus_Transaction(listID, dir, state, SortItemsByStatus);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortItemsByAssignedTo = async (dir) => {
		let listID = activeList._id;
		let state = JSON.stringify(activeList.items);
		let transaction = new SortItemsByAssignedTo_Transaction(listID, dir, state, SortItemsByAssignedTo);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const createNewList = async () => {
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		setActiveList(list);
		tpsReset();
	};

	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
		tpsReset();
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = (id) => {
		const selectedTodo = todolists.find(todo => todo.id === id || todo._id === id);
		const newLists = todolists.filter(todo => todo.id != id && todo._id != id);
		client.writeQuery({
			query: GET_DB_TODOS,
			data: {
				getAllTodos: [selectedTodo, ...newLists],
			}
		});
		setActiveList(selectedTodo);
		toggleListSelected(true);
		tpsReset();
	};

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete);
	}

	const handleKeyDown = (event) => {
		if (event.ctrlKey && event.keyCode == 90 && props.tps.hasTransactionToUndo()) tpsUndo();
		else if (event.ctrlKey && event.keyCode == 89 && props.tps.hasTransactionToRedo()) tpsRedo();
	}

	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
							tpsReset={tpsReset}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList.id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								updateListField={updateListField} listSelected={listSelected}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary" onKeyDown={handleKeyDown}>
								<MainContents
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									sortItemsByDesc={sortItemsByDesc} descAsc={descAsc} toggleDescAsc={toggleDescAsc}
									sortItemsByDate={sortItemsByDate} dateAsc={dateAsc} toggleDateAsc={toggleDateAsc}
									sortItemsByStatus={sortItemsByStatus} statusAsc={statusAsc} toggleStatusAsc={toggleStatusAsc}
									sortItemsByAssignedTo={sortItemsByAssignedTo} assignedToAsc={assignedToAsc} toggleAssignedToAsc={toggleAssignedToAsc}
									setShowDelete={setShowDelete}
									activeList={activeList} setActiveList={setActiveList}
									tpsReset={tpsReset}
									undo={tpsUndo} redo={tpsRedo}
									canUndo={props.tps.hasTransactionToUndo()}
									canRedo={props.tps.hasTransactionToRedo()}
									toggleListSelected={toggleListSelected}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} toggleListSelected={toggleListSelected} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} toggleListSelected={toggleListSelected}/>)
			}

		</WLayout>
	);
};

export default Homescreen;
