import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { Title, Table, ScrollArea, UnstyledButton, Group, Text, TextInput } from '@mantine/core';
import { keys } from '@mantine/utils';
import { NextPage } from 'next/types';
import { useEffect } from 'react';

const endpoint = 'https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/'

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

  const testData: RowData = { name: "blob", email: "email", company: "company"}
  const testArray: TableSortProps = { data: [testData] }
  
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
  
	return (
	  <ScrollArea>
		<TextInput
		  placeholder="Search by any field"
		  mb="md"
		  value={search}
		  onChange={handleSearchChange}
		/>
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
	);
  }

const Admin: NextPage = () => {
	const { user, isLoading } = useUser();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
		}
	}, [user, isLoading]);

	return (
		<div>
			<Title>Admin Panel</Title>
			{ TableSort(testArray) }
		</div>
	);
};

export default Admin;

