import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Title, Text, Box, Center, Stack, Button, Modal, Group, Grid, Table, ScrollArea, UnstyledButton, TextInput, AppShell, Navbar } from '@mantine/core';
import { closeAllModals, openModal, modals } from '@mantine/modals';
import { keys } from '@mantine/utils';
import { NextPage } from 'next/types';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import axios from 'axios';

import { User, UserStatus, getApplicationsAsync } from './data';

const endpoint = 'https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/'

// debugging
// const applications = getApplicationsAsync()
// applications.then(data => {
// 		console.log(data);
// }, console.error)

const updateStatus = async (id: string, userStatus: UserStatus) => {
	console.log("We're here")
	const resp = await axios.get(endpoint + `items${id}`, {
			responseType: "json",
		});
	const currentData : User = resp.data;
	currentData.userstatus = userStatus;
	axios.put(endpoint + `items` , currentData)
}

// TODO: query only upon access to the page
const getAllApplications = async () => {
	try {
		const res = await fetch(endpoint + `items`);
		const data = await res.json();
		console.log(data)
	}
	catch (err) {
		console.log(err)
	}
};

interface RowData {
	name: string;
	email: string;
	company: string;
  }
  
  interface TableSortProps {
	data: RowData[];
  }

  const testData1: RowData = { name: "blob", email: "email", company: "company"}
  const testData2: RowData = { name: "python", email: "anEmail", company: "goooge"}
  const testArray: TableSortProps = { data: [testData1, testData2] }
  
  interface ThProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
  }
  
  function Th({ children, reversed, sorted, onSort }: ThProps) {
	return (
	  <th>
		<UnstyledButton onClick={onSort}>
		  <Group position="apart">
			<Text weight={500} size="sm">
			  {children}
			</Text>
		  </Group>
		</UnstyledButton>
	  </th>
	);
  }
  
  function filterData(data: RowData[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
	  keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
	);
  }
  
  function sortData(
	data: RowData[],
	payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
  ) {
	const { sortBy } = payload;
  
	if (!sortBy) {
	  return filterData(data, payload.search);
	}
  
	return filterData(
	  [...data].sort((a, b) => {
		if (payload.reversed) {
		  return b[sortBy].localeCompare(a[sortBy]);
		}
  
		return a[sortBy].localeCompare(b[sortBy]);
	  }),
	  payload.search
	);
  }
  
function TableSort({ data }: TableSortProps) {
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState(data);
	const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);
  
	const setSorting = (field: keyof RowData) => {
	  const reversed = field === sortBy ? !reverseSortDirection : false;
	  setReverseSortDirection(reversed);
	  setSortBy(field);
	  setSortedData(sortData(data, { sortBy: field, reversed, search }));
	};
  
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  const { value } = event.currentTarget;
	  setSearch(value);
	  setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
	};
  
	const rows = sortedData.map((row) => (
	  <tr key={row.name}>
		<td>{row.name}</td>
		<td>{row.email}</td>
		<td>{row.company}</td>
	  </tr>
	));
  
	//scuffed beyond compare
	return (
		<AppShell
			navbar={<Navbar width={{ base: 300}} height={400} p="xs">
				<TextInput
		  placeholder="Search by any field"
		  mb="md"
		  value={search}
		  onChange={handleSearchChange}
		/>
		</Navbar>}
		>
			<ScrollArea>
		<Table
		  horizontalSpacing="md"
		  verticalSpacing="xs"
		  sx={{ tableLayout: 'fixed', minWidth: 700 }}
		>
		  <thead>
			<tr>
			  <Th
				sorted={sortBy === 'name'}
				reversed={reverseSortDirection}
				onSort={() => setSorting('name')}
			  >
				Name
			  </Th>
			  <Th
				sorted={sortBy === 'email'}
				reversed={reverseSortDirection}
				onSort={() => setSorting('email')}
			  >
				Email
			  </Th>
			  <Th
				sorted={sortBy === 'company'}
				reversed={reverseSortDirection}
				onSort={() => setSorting('company')}
			  >
				Company
			  </Th>
			</tr>
		  </thead>
		  <tbody>
			{rows.length > 0 ? (
			  rows
			) : (
			  <tr>
				<td colSpan={Object.keys(data[0]).length}>
				  <Text weight={500} align="center">
					Nothing found
				  </Text>
				</td>
			  </tr>
			)}
		  </tbody>
		</Table>
	  </ScrollArea>
		</AppShell>
	  
	);
  }

const Admin: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);
	
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
	const [records, setRecords] = useState<User[]>([])

	useEffect(() => {
		const data = sortBy(records, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
	}, [sortStatus]);

	useEffect(() => { //jank one time run
		getApplicationsAsync().then(setRecords);
	}, []);

	return (
		<div>
			<Title>Admin Panel</Title>

			<DataTable
				withBorder
				withColumnBorders
				columns={[
					{ accessor: 'name', width: '40%', sortable: true, render: ({ firstname, lastname }) => `${firstname} ${lastname}`,},
					{ accessor: 'email', width: '20%', sortable: true },
					{ accessor: 'userstatus', width: '20%', sortable: true },
				]}
				records={records}
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				onRowClick={(user, rowIndex) => {
					openModal({
						title: 'Applicant Information',
						styles: {
							modal: { maxWidth: 400 },
						},
						children: (
							<Stack>
								<Text size="sm">
									You clicked on row[{rowIndex}], referring to applicant <em>{user.firstname}</em>.
								</Text>
								<Grid gutter="xs">
									<Grid.Col span={3}>Name</Grid.Col>
									<Grid.Col span={9}>{user.firstname}</Grid.Col>
									<Grid.Col span={3}>Name2</Grid.Col>
									<Grid.Col span={9}>{user.lastname}</Grid.Col>
								</Grid>
									<Group position="center">
										<Button color="green" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updateStatus(`${user.id}`, 'Admitted')}>
											Admit
										</Button>
										<Button color="red" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updateStatus( `${user.id}`, 'Denied')}>
											Reject
										</Button>
									</Group>
							</Stack>
						),
					});
				}}
			/>		
			{ TableSort(testArray) }
			
		</div>
	);
};

export default Admin;

