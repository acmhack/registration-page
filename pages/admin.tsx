import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Title, Text, Box, Center, Stack, Button } from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import { keys } from '@mantine/utils';
import { NextPage } from 'next/types';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import axios from 'axios';

import companies from './emails.json';
import people from './people.json';

const endpoint = 'https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/'

//const applicationData = 
// axios
// 	.get(endpoint + `items`, {
// 		responseType: "json",
// 	})
// 	.then( (response) => console.log(response) );

const Admin: NextPage = () => {
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
					console.log("this is working")
					openModal({
						title: 'Applicant Information',
						styles: {
							modal: { maxWidth: 200 },
						},
						children: (
							<Stack>
								<Text size="sm">
									You clicked on row[{rowIndex}], referring to applicant <em>{people.firstname}</em>.
								</Text>
								<Center>
									<Button sx={{ width: '100%', maxWidth: 100}} onClick={() => closeAllModals()}>
										OK
									</Button>
								</Center>
							</Stack>
						),
					});
				}}
			/>
		</div>
	);
};

export default Admin;
