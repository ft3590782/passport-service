import axios from 'axios'


let axiosWrap = axios.create({
  baseURL: 'http://localhost:3000',
})


export default axiosWrap
