import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Title, Text, Box, Center, Stack, Button, Modal, Group, Grid } from '@mantine/core';
import { closeAllModals, openModal, modals } from '@mantine/modals';
import { keys } from '@mantine/utils';
import { NextPage } from 'next/types';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import axios from 'axios';

import { User, getApplications, updateStatus } from './data';

const Admin: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);
	
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
	const [records, setRecords] = useState<User[]>([])
	const [fetching, setFetching] = useState(false)

	useEffect(() => {
		const data = sortBy(records, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
	}, [sortStatus]);

	useEffect(() => { //jank one time run
		setFetching(true)
		getApplications().then(setRecords);
		setFetching(false)
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
				fetching={fetching}
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
		</div>
	);
};

export default Admin;

