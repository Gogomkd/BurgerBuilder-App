import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-myburger-7c6f5.firebaseio.com/'
})

export default instance;