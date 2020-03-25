import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import { useSelector } from 'react-redux';

// Component imports

import OrganizationEmployeesTable from './OrganizationEmployeesTable';
import OrganizationTeams from './OrganizationTeams';
import CreateTeam from './CreateTeam';

const OrganizationHome = () => {
	const titleArr = ['Employees', 'Teams'];
	// Button states
	const [empButton, setEmpButton] = useState(true);
	const [createTeamsBtn, setCreateTeamsBtn] = useState(false);
	const [teamsBtn, setTeamsBtn] = useState(false);
	// Query states
	const [filter, setFilter] = useState('');
	const [limit, setLimit] = useState(20);
	const [page, setPage] = useState(1);
	// Counts
	const [empCount, setEmpCount] = useState(null);
	const [checked, setChecked] = useState(false);
	// employees state
	const [title, setTitle] = useState(titleArr[0]);
	const [employees, setEmployees] = useState([]);
	const [teamMemberArray, setTeamMemberArray] = useState([]);
	// Teams state
	const [teams, setTeams] = useState([]);

	const history = useHistory();

	let teamCount = teams.length;

	// Grab Employees for a user's organization and set to state
	useEffect(() => {
		axiosWithAuth()
			.get(
				`/employees/organizations?search=${filter}&limit=${limit}&page=${page}`,
			)
			.then(res => {
				setEmployees(res.data.employees);
				setEmpCount(res.data.count);
			});
	}, [filter, limit, page]);

	// Ordering employees array alphabetically
	employees.sort((a, b) => a.first_name.localeCompare(b.first_name));

	// Function to add a team member to array in create team component
	const addTeamMember = param => {
		setChecked(!checked);
		if (checked) {
			employees.map(person => {
				person.team_role = 'member';
				if (param === person.id) {
					if (teamMemberArray.indexOf(person) === -1) {
						teamMemberArray.push(person);
					}
				}
				return teamMemberArray;
			});
		}
	};

	const handleAddUserClick = () => {
		history.push('/add-user');
	};

	// Dynamically rendering component based on which filter button is selected
	let table;
	if (empButton) {
		table = (
			<OrganizationEmployeesTable
				empButton={empButton}
				employees={employees}
				setLimit={setLimit}
				setPage={setPage}
				limit={limit}
				page={page}
			/>
		);
	} else if (createTeamsBtn) {
		table = (
			<CreateTeam
				setTeamMemberArray={setTeamMemberArray}
				teamMemberArray={teamMemberArray}
				employees={employees}
				addTeamMember={addTeamMember}
				teams={teams}
			/>
		);
	} else if (teamsBtn) {
		table = <OrganizationTeams teams={teams} setTeams={setTeams} />;
	}

	return (
		<div className="teams-dashboard">
			<div className="header">
				<h1>Organization</h1>
				<div className="add-team-container">
					<button
						onClick={() => {
							setCreateTeamsBtn(true);
							setEmpButton(false);
						}}>
						{!createTeamsBtn ? 'Create a team' : 'Save'}
					</button>
				</div>
				<h2>
					{title}{' '}
					{empButton
						? `(${empCount})`
						: `(${teamCount})` && createTeamsBtn
						? `(${empCount})`
						: `(${teamCount})`}
				</h2>
			</div>
			<div className="employee-filter-container">
				<h3>Filter:</h3>
				<button
					onClick={() => {
						setEmpButton(true);
						setTitle(titleArr[0]);
						setCreateTeamsBtn(false);
						setTeamsBtn(false);
					}}
					className="btn-filter">
					Employees
				</button>
				<button
					className="btn-filter"
					style={
						createTeamsBtn
							? { display: 'block' }
							: { display: 'none' }
					}>
					Role
				</button>
				<button
					onClick={() => {
						setEmpButton(false);
						setCreateTeamsBtn(false);
						setTeamsBtn(true);
						setTitle(titleArr[1]);
					}}
					className="btn-filter">
					Teams
				</button>
				<button className="btn-filter" style={{ opacity: 0 }}>
					Hidden
				</button>
				<div className="employee-search-container">
					<input
						value={filter}
						onChange={event => setFilter(event.target.value)}
						type="text"
						id="search"
						name="search"
						placeholder="Search"
					/>
				</div>
			</div>
			<div className="select-add-members">
				<h3
					style={
						teamsBtn
							? { visibility: 'hidden' }
							: { display: 'block' }
					}
					className="select-all">
					Select All
				</h3>
				<h3
					style={
						teamsBtn
							? { visibility: 'hidden' }
							: { display: 'block' }
					}
					onClick={handleAddUserClick}>
					+ Add more members
				</h3>
			</div>
			{table}
		</div>
	);
};

export default OrganizationHome;