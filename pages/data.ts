import axios from 'axios'

const endpoint = 'https://nfn8sjemsh.execute-api.us-east-2.amazonaws.com/development/';

export type UserStatus = 'In Progress' | 'Ready for Review' | 'Admitted' | 'Denied'

export type User = {
    id: number
    admin: boolean
    userstatus: UserStatus
    firstname: String
    lastname: String
    email: String
    age: number
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

export function getApplications() {
    return axios.get('/api/users', {
        responseType: "json",
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        console.log(err);
    })
}

export async function updateStatus(id: string, userStatus: UserStatus) {
	console.log("We're here")
	const resp = await axios.get(endpoint + `items${id}`, {
			responseType: "json",
		});
	const currentData : User = resp.data;
	currentData.userstatus = userStatus;
	axios.put(endpoint + `items` , currentData)
}

