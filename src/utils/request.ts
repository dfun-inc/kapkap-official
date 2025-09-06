import axios from 'axios';
import { toast } from 'react-toastify';

const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export async function request(params:any) {
  return apiAxios({
    ...params,
    headers: {
      ...params.headers
    }
  })
  .catch(function(err:any) {
    console.log(err);
    toast.error("Something went wrong!");
    if(err.response && err.response.data && err.response.data.code == '401') {
      console.log('Sorry! Your session has expired. Please login again');
    }
  });
}