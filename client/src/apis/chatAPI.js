import axios from 'axios';
const SERVER = process.env.REACT_APP_SERVER;

axios.defaults.withCredentials = true;

export const getMessages = (id, limit = 20) => {
  return axios.get(`${SERVER}/messages/get_messages`, { params: { id, limit }});
}

export const getUnreadMessagesCount = (id) => {
  return axios.get(`${SERVER}/messages/get_unread_messages_count`, { params: { id } });
}

export const addMessage = (id, message) => {
  return axios.post(`${SERVER}/messages/add_message`, { id, message });
}

export const getChatId = (users) => {
  return axios.get(`${SERVER}/messages/get_chat_id`, { params: { users } });
}