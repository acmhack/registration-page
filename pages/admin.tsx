import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button, Checkbox, Grid, Group, Stack, TextInput, Title } from '@mantine/core';
import { useDebouncedValue, useForceUpdate } from '@mantine/hooks';
import { closeAllModals, modals } from '@mantine/modals';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { NextPage } from 'next/types';
import { CSSProperties, useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

import { getApplications, updateStatus } from '../utils/data';

const formatUserStatus = (userstatus: UserStatus): CSSProperties | undefined => {
	if (userstatus == 'Admission Pending') {
		// Ready For Review
		return {
			fontWeight: 'bold',
			color: 'blue',
			background: '##FF332222'
		};
	} else if (userstatus == 'Profile Pending') {
		// In Progress
		return {
			fontWeight: 'bold',
			color: 'purple',
			background: '##FF332222'
		};
	} else if (userstatus == 'Confirmation Pending') {
		// Admitted
		return {
			fontWeight: 'bold',
			color: 'green',
			background: '##FF332222'
		};
	} else if (userstatus == 'Denied') {
		return {
			fontWeight: 'bold',
			color: 'red',
			background: '##FF332222'
		};
	} else if (userstatus == 'Confirmed') {
		return {
			fontWeight: 'bold',
			color: 'gold',
			background: '##FF332222'
		};
	} else if (userstatus == 'Checked In') {
		return {
			fontWeight: 'bold',
			color: 'purple',
			background: '##FF332222'
		};
	} else {
		return undefined;
	}
};

const Admin: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);

	const forceUpdate = useForceUpdate();
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
	const [records, setRecords] = useState<DBEntry[]>([]);
	const [initialRecords, setInitialRecords] = useState<DBEntry[]>([]);
	const [query, setQuery] = useState('');
	const [debouncedQuery] = useDebouncedValue(query, 200);
	const [fetching, setFetching] = useState(false);
	const [readyForReview, setReadyForReviewOnly] = useState(false);

	useEffect(() => {
		const filteredRecords = initialRecords.filter((user: DBEntry) => {
			if (readyForReview && user.userstatus != 'Admission Pending') {
				return false;
			}
			if (
				debouncedQuery !== '' &&
				!`${user.firstname} ${user.lastname} ${user.email} ${user.userstatus}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
			) {
				return false;
			}
			return true;
		});

		const sortedRecords = sortBy(filteredRecords, sortStatus.columnAccessor);

		setRecords(sortStatus.direction === 'desc' ? sortedRecords.reverse() : sortedRecords);
	}, [debouncedQuery, readyForReview, initialRecords, sortStatus]);

	const updatePretty = async (id: string, userstatus: UserStatus, entry: DBEntry) => {
		closeAllModals();
		notifications.show({
			id: id,
			loading: true,
			title: 'Update processing',
			message: `Updating ${id}'s status to ${userstatus}`,
			autoClose: false
		});
		const requestStatus = await updateStatus(id, userstatus);
		if (requestStatus == 200) {
			notifications.update({
				id: id,
				color: 'teal',
				title: 'Update successful',
				message: 'Data was saved',
				icon: <IconCheck size="1rem" />,
				autoClose: 2000
			});
			//faux local update
			entry.userstatus = userstatus;
			forceUpdate();
		} else {
			notifications.update({
				id: id,
				color: 'red',
				title: 'Update failed :(',
				message: 'Try again later',
				icon: <IconX size="1rem" />,
				autoClose: 2000
			});
		}
	};

	useEffect(() => {
		setFetching(true);
		getApplications().then((records) => {
			setInitialRecords(records);
			setRecords(records);
		}); //TODO: Update table when setRecords
		setFetching(false);
	}, []);

	return (
		<div>
			<Title>Admin Panel</Title>
			<Grid align="center" gutter="xs" my="md">
				<Grid.Col xs={8} sm={9}>
					<TextInput sx={{ flexBasis: '60%' }} placeholder="Search applicants..." value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
				</Grid.Col>
				<Grid.Col xs={4} sm={3}>
					<Checkbox label="Ready For Review Only" checked={readyForReview} onChange={(e) => setReadyForReviewOnly(e.currentTarget.checked)} />
				</Grid.Col>
			</Grid>
			<Box sx={{ height: 500 }}>
				<DataTable
					withBorder
					withColumnBorders
					columns={[
						{ accessor: 'name', width: '40%', sortable: true, render: ({ firstname, lastname }) => `${firstname} ${lastname}` },
						{ accessor: 'email', width: '20%', sortable: true },
						{
							accessor: 'userstatus',
							width: '20%',
							sortable: true,
							cellsStyle: ({ userstatus }) => formatUserStatus(userstatus),
							render: ({ userstatus }) => userstatus
						}
					]}
					records={records}
					fetching={fetching}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					onRowClick={(user) => {
						modals.open({
							modalId: 'applicant-information-modal',
							title: 'Applicant Information',
							styles: {
								root: { maxWidth: 500 }
							},
							children: (
								<Stack>
									<Grid gutter="xs">
										<Grid.Col span={4}>Name</Grid.Col>
										<Grid.Col span={8}>
											{user.firstname} {user.lastname}
										</Grid.Col>
										<Grid.Col span={4}>Email</Grid.Col>
										<Grid.Col span={8}>{user.email}</Grid.Col>
										<Grid.Col span={4}>Level of Study</Grid.Col>
										<Grid.Col span={8}>{user.levelofstudy}</Grid.Col>
										<Grid.Col span={4}>Experience</Grid.Col>
										<Grid.Col span={8}>{user.experience}</Grid.Col>
									</Grid>
									<Group position="center">
										<Button
											color="green"
											sx={{ width: '100%', maxWidth: 100 }}
											onClick={() => {
												updatePretty(`${user.id}`, 'Confirmation Pending', user);
											}}>
											Admit
										</Button>
										<Button color="red" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updatePretty(`${user.id}`, 'Denied', user)}>
											Reject
										</Button>
									</Group>
									<Group position="center">
										<Button
											color="green"
											sx={{ width: '100%', maxWidth: 100 }}
											onClick={() => {
												console.log('admitted');
												updateStatus(`${user.id}`, 'Confirmation Pending')
													.then((status) => {
														if (status === 200) {
															setInitialRecords(
																initialRecords.map((record) =>
																	record.id === user.id ? { ...record, userstatus: 'Confirmation Pending' } : record
																)
															);
															modals.close('applicant-information-modal');
														}
													})
													.catch((err) => {
														console.log(err);
														modals.close('applicant-information-modal');
													});
											}}>
											Admit
										</Button>
										<Button color="red" sx={{ width: '100%', maxWidth: 100 }} onClick={() => updateStatus(`${user.id}`, 'Denied')}>
											Reject
										</Button>
									</Group>
								</Stack>
							)
						});
					}}
					noRecordsText="No records"
				/>
			</Box>
		</div>
	);
};

export default Admin;

