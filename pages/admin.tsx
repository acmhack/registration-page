import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Title, Text, Box, Center, Stack, Button, Modal, Group, Grid } from '@mantine/core';
import { closeAllModals, openModal, modals } from '@mantine/modals';
import { keys } from '@mantine/utils';
import { NextPage } from 'next/types';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import axios from 'axios';

import companies from './emails.json';
import people from './people.json';
import { update } from 'lodash';

const endpoint = 'https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/'

//const applicationData = 
// axios
// 	.get(endpoint + `items`, {
// 		responseType: "json",
// 	})
// 	.then( (response) => console.log(response) );

const updateStatus = (id: string, status: string) => {
	//axios.post()
}

const Admin: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);
	
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
	const [records, setRecords] = useState(sortBy(people, 'name'))

	useEffect(() => {
		const data = sortBy(people, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
	}, [sortStatus]);

	return (
		<div>
			<Title>Admin Panel</Title>

			<DataTable
				withBorder
				withColumnBorders
				columns={[
					{ accessor: 'name', width: '40%', sortable: true, render: ({ firstname, lastname }) => `${firstname} ${lastname}`,},
					{ accessor: 'email', width: '20%', sortable: true },
				]}
				records={records}
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				onRowClick={(people, rowIndex) => {
					console.log("this is working");
					openModal({
						title: 'Applicant Information',
						styles: {
							modal: { maxWidth: 400 },
						},
						children: (
							<Stack>
								<Text size="sm">
									You clicked on row[{rowIndex}], referring to applicant <em>{people.firstname}</em>.
								</Text>
								<Grid gutter="xs">
									<Grid.Col span={3}>Name</Grid.Col>
									<Grid.Col span={9}>{people.firstname}</Grid.Col>
									<Grid.Col span={3}>Name2</Grid.Col>
									<Grid.Col span={9}>{people.lastname}</Grid.Col>
								</Grid>
									<Group position="center">
										<Button color="green" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updateStatus(`${people.firstname}`, 'yeah')}> {/* jank lmao */}
											Accept
										</Button>
										<Button color="red" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updateStatus( `${people.firstname}`, 'nah')}>
											Reject
										</Button>
									</Group>
							</Stack>
						),
					});
				}}
			/>
		</div>
	);
};

export default Admin;

