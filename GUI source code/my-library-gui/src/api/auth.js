import api from "./axiosConfig";

export const login = async (email, password) => {
    return api.post("/auth/login", { email, password });
};

export const signup = async (email, display_name, password) => {
    return api.post("/auth/signup", { email, display_name, password });
};

export const renameUser = async ({ email, newDisplayName }) => {
    return api.post("/auth/rename", { email, new_display_name: newDisplayName });
};

export const deleteUser = async ({ email }) => {
    return api.post("/auth/delete", { email });
};
