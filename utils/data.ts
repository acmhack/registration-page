import axios from 'axios'

export async function getApplications() : Promise<DBEntry[]> {
    return (await axios.get('/api/users', {
        responseType: "json",
    })).data
}

export async function getUser() : Promise<DBEntry> {
	const id = 0
	return (await axios.get(`/api/users/${id}`, { //incredibly jank
		responseType: "json",
	})).data
}

export async function updateStatus(id: string, newUserStatus: UserStatus) {
	const user : DBEntry = (await axios.get(`/api/users/${id}`, {
			responseType: "json",
		})).data;
	user.userstatus = newUserStatus;
	const response = await axios.post(`/api/users/${id}` , user);
    return response.status;
}

