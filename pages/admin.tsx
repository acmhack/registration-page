import { useUser } from '@auth0/nextjs-auth0/client';
import { CSSProperties, useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Title, Box, Stack, Button, Group, Grid, Checkbox, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { NextPage } from 'next/types';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';

import { User, UserStatus, getApplications, updateStatus } from './data';

const formatUserStatus = (userstatus : UserStatus) : CSSProperties | undefined => {
		if (userstatus == "Admission Pending") { // Ready For Review
			return {
				fontWeight: 'bold',
				color: 'blue',
				background: '##FF332222',
			}
		}
		else if (userstatus == "Profile Pending") { // In Progress
			return {
				fontWeight: 'bold',
				color: 'purple',
				background: '##FF332222',
			}
		}
		else if (userstatus == "Confirmation Pending") { // Admitted
			return {
				fontWeight: 'bold',
				color: 'green',
				background: '##FF332222',
			}
		}
		else if (userstatus == "Denied") {
			return {
				fontWeight: 'bold',
				color: 'red',
				background: '##FF332222',
			}
		} else if (userstatus == "Confirmed") {
			return {
				fontWeight: 'bold',
				color: 'gold',
				background: '##FF332222',
			}
		} else if (userstatus == "Checked In") {
			return {
				fontWeight: 'bold',
				color: 'purple',
				background: '##FF332222',
			}
		} else {
			return undefined
		}
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
	const [initialRecords, setInitialRecords] = useState<User[]>([])
	const [query, setQuery] = useState('')
	const [debouncedQuery] = useDebouncedValue(query, 200);
	const [fetching, setFetching] = useState(false)
	const [readyForReview, setReadyForReviewOnly] = useState(false)

	useEffect(() => {
		setRecords(
			initialRecords.filter((user : User) => {
				if (readyForReview && user.userstatus != "Admission Pending") {
					return false;
				}
				if (
					debouncedQuery !== '' &&
					!`${user.firstname} ${user.lastname} ${user.email} ${user.userstatus}`
					.toLowerCase()
					.includes(debouncedQuery.trim().toLowerCase())
				) {
					return false
				}
				return true;
			})
		);
	}, [debouncedQuery, readyForReview])

	useEffect(() => {
		const data = sortBy(records, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
	}, [sortStatus]);

	useEffect(() => {
		setFetching(true)
		getApplications().then(setInitialRecords); //TODO: Update table when setRecords
		getApplications().then(setRecords) //setRecords(initialRecords)
		setFetching(false)
	}, []);

	return (
		<div>
			<Title>Admin Panel</Title>
			<Grid align="center" gutter="xs" my="md">
				<Grid.Col xs={8} sm={9}>
				<TextInput
					sx={{ flexBasis: '60%' }}
					placeholder="Search applicants..."
					value={query}
					onChange={(e) => setQuery(e.currentTarget.value)}
          		/>
				</Grid.Col>
				<Grid.Col xs={4} sm={3}>
					<Checkbox
					  label="Ready For Review Only"
					  checked={readyForReview}
					  onChange={(e) => setReadyForReviewOnly(e.currentTarget.checked)}
					/>
				</Grid.Col>
			</Grid>
			<Box sx={{ height: 500}}>
				<DataTable
					withBorder
					withColumnBorders
					columns={[
						{ accessor: 'name', width: '40%', sortable: true, render: ({ firstname, lastname }) => `${firstname} ${lastname}`,},
						{ accessor: 'email', width: '20%', sortable: true },
						{ accessor: 'userstatus', width: '20%', sortable: true,
							cellsStyle: ({ userstatus }) => formatUserStatus(userstatus),
							render: ({ userstatus }) => userstatus
						},
					]}
					records={records}
					fetching={fetching}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					onRowClick={(user, rowIndex) => {
						openModal({
							title: 'Applicant Information',
							styles: {
								modal: { maxWidth: 500 },
							},
							children: (
								<Stack>
									<Grid gutter="xs">
										<Grid.Col span={4}>Name</Grid.Col>
										<Grid.Col span={8}>{user.firstname} {user.lastname}</Grid.Col>
										<Grid.Col span={4}>Email</Grid.Col>
										<Grid.Col span={8}>{user.email}</Grid.Col>
										<Grid.Col span={4}>Level of Study</Grid.Col>
										<Grid.Col span={8}>{user.levelofstudy}</Grid.Col>
										<Grid.Col span={4}>Experience</Grid.Col>
										<Grid.Col span={8}>{user.experience}</Grid.Col>
									</Grid>
										<Group position="center">
											<Button color="green" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updateStatus(`${user.id}`, 'Confirmation Pending')}>
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
					noRecordsText="No records"
				/>
			</Box>
		</div>
	);	
};

export default Admin;

