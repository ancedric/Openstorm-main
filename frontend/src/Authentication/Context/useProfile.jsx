import axios from 'axios'
import { baseURL } from '../../axiosConfig'
import useAuth from "./useAuth";

const useProfile = () => {
  const { profile } = useAuth()

  return { getProfile }
}

export default useProfile