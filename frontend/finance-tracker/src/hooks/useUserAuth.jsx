import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

export const useUserAuth = () => {
    const { updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If there is a token, fetch user info. This allows the app to
        // populate context on reload or when only token exists.
        const token = localStorage.getItem('token');
        if (!token) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if (isMounted && response?.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                if (isMounted) {
                    clearUser();
                    navigate('/');
                }
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [updateUser, clearUser, navigate]);
};
