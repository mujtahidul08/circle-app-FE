
import { apiURL } from "@/utils/baseurl"
import axios from "axios";
export const getAllUser = (token:string) => {
    fetch(apiURL + 'users',{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`,
        }
      })
      .then((data)=>{
        console.log(data)
        if(data.status === 200)
        {return data.json()}
        else{
          throw new Error(data.statusText)
        }
      })
      .then((result)=>{
        console.log(result)
      })
      .catch((err)=>{
        console.error(err)
      })
    }

export async function forgotPassword(email: string) {
  const response = await axios.post(`${apiURL}api/users/forgot`, { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string) {
  const response = await axios.put(`${apiURL}api/users/reset?token=${token}`, {
    newPassword,
  });
  return response.data;
}