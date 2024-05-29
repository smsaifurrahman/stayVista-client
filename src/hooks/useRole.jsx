
import { useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import {
    useQuery
  } from '@tanstack/react-query'
  
const useRole = () => {
    const {user,loading} = useAuth();

    const axiosSecure = useAxiosSecure();
    // fetch user info using logged in email
    const {data: role, isLoading} = useQuery({
        queryKey: ['role'],
        enabled: !loading && !!user?.email, // if loading is false and user.email returns true then only query will be executed
        queryFn: async ()=> {
            const {data} = await axiosSecure(`/user/${user?.email}`)
    
            return data.role
        },
    })



    return [role, isLoading]
};

export default useRole;