import axios from "axios";
const SERVER = process.env.REACT_APP_SERVER;

axios.defaults.withCredentials = true;

export const login = (data) => {
  return axios.post(`${SERVER}/auth/login`, data);
}

export const logout = () => {
  return axios.post(`${SERVER}/auth/logout`);
}

export const signup = (formData) => {
  return axios.post(`${SERVER}/auth/signup`, { ...formData });
}

export const checkLogin = () => {
  return axios.get(`${SERVER}/auth/logged_in`);
}

export const getNonFriends = (start, end) => {
  return axios.get(`${SERVER}/users/get_non_friends`, { start, end });
}

export const getPendingFriends = () => {
  return axios.get(`${SERVER}/users/get_pending_friends`);
}

export const getFriends = () => {
  return axios.get(`${SERVER}/users/get_friends`);
}

export const getFriendsUser = (id) => {
  return axios.get(`${SERVER}/users/get_friends_user?id=${id}`)
}

export const checkFriend = (id) => {
  return axios.get(`${SERVER}/users/check_friend`, { params: { id } });
}

export const addFriend = (id) => {
  return axios.post(`${SERVER}/users/add_friend`, { id });
}

export const removeFriend = (id) => {
  return axios.post(`${SERVER}/users/remove_friend`, { id });
}

export const getUser = (id) => {
  return axios.get(`${SERVER}/users/get_user?id=${id}`);
}

export const searchUsers = (search) => {
  return axios.get(`${SERVER}/users/search_users`, { params: { search } });
}

export const changeName = (first_name, last_name) => {
  return axios.post(`${SERVER}/users/change_name`, { first_name, last_name });
}

export const logOut = () => {
  return axios.post(`${SERVER}/auth/logout`);
}

export const uploadProfileFile = (file) => {
  return axios.post(`${SERVER}/users/upload_profile_file`, file, { headers: { "Content-Type": 'multipart/form-data' }});
}