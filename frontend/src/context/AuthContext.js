import React, {
	createContext,
	useState,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			fetchCurrentUser();
		} else {
			setLoading(false);
		}
	}, [token]);

	const fetchInProgress = useRef(false);

	const fetchCurrentUser = async () => {
		if (fetchInProgress.current) return;
		fetchInProgress.current = true;
		try {
			const response = await authAPI.getCurrentUser();
			setUser(response.data);
		} catch (error) {
			console.error("Error fetching user:", error);
			localStorage.removeItem("token");
			setToken(null);
		} finally {
			setLoading(false);
			fetchInProgress.current = false;
		}
	};

	const login = async (email, password) => {
		try {
			const response = await authAPI.login({ email, password });
			const { token: newToken, user: userData } = response.data;
			localStorage.setItem("token", newToken);
			setToken(newToken);
			setUser(userData);
			return response.data;
		} catch (error) {
			throw error;
		}
	};

	const register = async (name, email, password) => {
		try {
			const response = await authAPI.register({ name, email, password });
			// Don't auto-login, require email verification first
			return response.data;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};

	const updateProfile = async (profileData) => {
		try {
			const response = await authAPI.updateProfile(profileData);
			setUser(response.data.user);
			return response.data;
		} catch (error) {
			throw error;
		}
	};

	const authValue = useMemo(
		() => ({
			user,
			token,
			loading,
			login,
			register,
			logout,
			updateProfile,
			isAuthenticated: !!token,
		}),
		[user, token, loading],
	);

	return (
		<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
	);
};
