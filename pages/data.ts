import axios from 'axios'

const endpoint = 'https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/';

export type UserStatus = 'Profile Pending' | 'Admission Pending' | 'Confirmation Pending' | 'Denied' | 'Confirmed' | 'Checked In'

export type User = {
    id: String
    admin: boolean
    userstatus: UserStatus
    firstname: String
    lastname: String
    email: String
    age: String
    country: String
    phone: String
    school: String
    levelofstudy: String
    gradmonth: String
    gradyear: String
    shirtsize: String
    diet: String
    experience: String
    resume: String //base64, we could make a type and maybe we should
    links: String
    lft: boolean
    prehacks: boolean
    mlhcodeofconduct: boolean
    mlhlogistics: boolean
    mlhcommunication: boolean
}

/*
export function getApplications() {
    return axios.get('/api/users', {
        responseType: "json",
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        console.log(err);
    })
}
*/

export async function getApplications() {
    return (await axios.get('/api/users', {
        responseType: "json",
    })).data
}

export async function updateStatus(id: string, newUserStatus: UserStatus) {
	console.log("We're here")
	const user : User = (await axios.get(`/api/users/${id}`, {
			responseType: "json",
		})).data;
	user.userstatus = newUserStatus;
	const response = await axios.post(`/api/users/${id}` , user);
    return response.status;
}

