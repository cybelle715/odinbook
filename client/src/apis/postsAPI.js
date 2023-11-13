import axios from "axios";
const SERVER = process.env.REACT_APP_SERVER;

axios.defaults.withCredentials = true;

export const post = (data) => {
  return axios.post(`${SERVER}/posts/post`, data, { headers: { "Content-Type": 'multipart/form-data' }});
}

export const getPosts = (fromDate = null) => {
  return axios.get(`${SERVER}/posts/get_posts_all`, { params: { fromDate }});
}

export const getPostsUser = (id, fromDate = null) => {
  return axios.get(`${SERVER}/posts/get_posts_user`, { params: { id, fromDate }});
}

export const getComments = (id, limit = 20, skip = 0) => {
  return axios.get(`${SERVER}/posts/get_comments`, { params: { id, limit, skip } });
}

export const addComment = (id, comment) => {
  return axios.post(`${SERVER}/posts/add_comment`, { id, comment });
}

export const addLike = (id) => {
  return axios.post(`${SERVER}/posts/like`, { id });
}

export const getCommentsCount = (id) => {
  return axios.get(`${SERVER}/posts/get_comments_count`, { params: { id }});
}