import { Box, Button, Checkbox, Grid, Group, Stack, TextInput, Title } from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { NextPage } from 'next/types';
import { CSSProperties, useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

import { http } from '../utils/utils';

const formatUserStatus = (userstatus: UserStatus): CSSProperties | undefined => {
	if (userstatus == 'Admission Pending') {
		// Ready For Review
		return {
			fontWeight: 'bold',
			color: 'blue',
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
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
	const [records, setRecords] = useState<Application[]>([]);
	const [initialRecords, setInitialRecords] = useState<Application[]>([]);
	const [query, setQuery] = useState('');
	const [debouncedQuery] = useDebouncedValue(query, 200);
	const [fetching, setFetching] = useState(false);
	const [readyForReview, setReadyForReviewOnly] = useState(false);
	const [updating, setUpdating] = useState<boolean>(false);
	const mobile = useMediaQuery('screen and (max-width: 700px)');

	useEffect(() => {
		const filteredRecords = initialRecords.filter((user: Application) => {
			if (readyForReview && user.status != 'Admission Pending') {
				return false;
			}
			if (
				debouncedQuery !== '' &&
				!`${user.firstName} ${user.lastName} ${user.email} ${user.status}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
			) {
				return false;
			}
			return true;
		});

		const sortedRecords = sortBy(filteredRecords, sortStatus.columnAccessor);

		setRecords(sortStatus.direction === 'desc' ? sortedRecords.reverse() : sortedRecords);
	}, [debouncedQuery, readyForReview, initialRecords, sortStatus]);

	const updatePretty = async (id: string, status: UserStatus, entry: Application) => {
		notifications.show({
			id,
			loading: true,
			title: 'Update processing',
			message: `Updating ${id}'s status to ${status}`,
			autoClose: false
		});
		setUpdating(true);

		try {
			const responseStatus = (await http.post(`/api/users/${id}`, { status })).status;

			if (responseStatus == 200) {
				notifications.update({
					id,
					color: 'teal',
					title: 'Update successful',
					message: 'Data was saved',
					icon: <IconCheck size="1rem" />,
					autoClose: 5000
				});
				entry.status = status;
			} else {
				console.log(responseStatus);
			}
		} catch (err) {
			notifications.update({
				id,
				color: 'red',
				title: 'Update failed :(',
				message: 'Try again later',
				icon: <IconX size="1rem" />,
				autoClose: 5000
			});
			console.log(err);
		} finally {
			modals.close('applicant-information-modal');
			setUpdating(false);
		}
	};

	useEffect(() => {
		setFetching(true);
		http.get('/api/users').then((res) => {
			setInitialRecords(res.data);
			setRecords(res.data);
			setFetching(false);
		});
	}, []);

	return (
		<div style={{ paddingLeft: mobile ? '0px' : 'min(200px, 15vw)', margin: '10px' }}>
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
						{ accessor: 'name', width: '40%', sortable: true, render: ({ firstName, lastName }) => `${firstName} ${lastName}` },
						{ accessor: 'email', width: '20%', sortable: true },
						{
							accessor: 'userstatus',
							width: '20%',
							sortable: true,
							cellsStyle: ({ status }) => formatUserStatus(status),
							render: ({ status }) => status
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
											{user.firstName} {user.lastName}
										</Grid.Col>
										<Grid.Col span={4}>Email</Grid.Col>
										<Grid.Col span={8}>{user.email}</Grid.Col>
										<Grid.Col span={4}>Level of Study</Grid.Col>
										<Grid.Col span={8}>{user.levelOfStudy}</Grid.Col>
									</Grid>
									<Group position="center">
										<Button
											disabled={updating}
											color="green"
											sx={{ width: '100%', maxWidth: 100 }}
											onClick={() => updatePretty(`${user._id}`, 'Confirmation Pending', user)}>
											Admit
										</Button>
										<Button
											disabled={updating}
											color="red"
											sx={{ width: '100%', maxWidth: 100 }}
											onClick={() => updatePretty(`${user._id}`, 'Denied', user)}>
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

