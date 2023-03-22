import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button, Checkbox, Grid, Group, Stack, TextInput, Title } from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
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

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'name', direction: 'asc' });
	const [records, setRecords] = useState<DBEntry[]>([]);
	const [initialRecords, setInitialRecords] = useState<DBEntry[]>([]);
	const [query, setQuery] = useState('');
	const [debouncedQuery] = useDebouncedValue(query, 200);
	const [fetching, setFetching] = useState(false);
	const [readyForReview, setReadyForReviewOnly] = useState(false);
	const [updating, setUpdating] = useState<boolean>(false);
	const mobile = useMediaQuery("screen and (max-width: 600px)");

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
		notifications.show({
			id,
			loading: true,
			title: 'Update processing',
			message: `Updating ${id}'s status to ${userstatus}`,
			autoClose: false
		});
		setUpdating(true);

		try {
			const responseStatus = await updateStatus(id, userstatus);

			if (responseStatus == 200) {
				notifications.update({
					id,
					color: 'teal',
					title: 'Update successful',
					message: 'Data was saved',
					icon: <IconCheck size="1rem" />,
					autoClose: 5000
				});
				entry.userstatus = userstatus;
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
		getApplications().then((records) => {
			setInitialRecords(records);
			setRecords(records);
			setFetching(false);
		});
	}, []);

	return (
		<div style={{paddingLeft: (mobile ? "100px" : "15vw")}}>
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
											disabled={updating}
											color="green"
											sx={{ width: '100%', maxWidth: 100 }}
											onClick={() => updatePretty(`${user.id}`, 'Confirmation Pending', user)}>
											Admit
										</Button>
										<Button
											disabled={updating}
											color="red"
											sx={{ width: '100%', maxWidth: 100 }}
											onClick={() => updatePretty(`${user.id}`, 'Denied', user)}>
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

