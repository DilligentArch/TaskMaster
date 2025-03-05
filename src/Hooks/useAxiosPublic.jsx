import axios from "axios";


const axiosPublic = axios.create({
    baseURL : 'https://task-master-server-side-theta.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;