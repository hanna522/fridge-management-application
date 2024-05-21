import axios from "axios";

const API_BASE_URL = "http://localhost:5050";

export const fetchFridgeInstances = () => {
  return axios.get(`${API_BASE_URL}/api/fridgeinstance`);
};

export const getCreateFormFridgeInstance = () => {
  return axios.get(`${API_BASE_URL}/api/fridgeinstance/create`);
};

export const createFridgeInstance = (formData) => {
  return axios.post(`${API_BASE_URL}/api/fridgeinstance/create`, formData);
};

export const getUpdateFormFridgeInstance = (id) => {
  return axios.get(`${API_BASE_URL}/api/fridgeinstance/${id}/update`);
}

export const updateFridgeInstance = (id, formData) => {
  return axios.put(`${API_BASE_URL}/api/fridgeinstance/${id}/update`, formData);
};

export const deleteFridgeInstance = (id) => {
  return axios.delete(`${API_BASE_URL}/api/fridgeinstance/${id}/delete`);
};

export const fetchCategories = () => {
  return axios.get(`${API_BASE_URL}/api/category`);
}

export const fetchShoppingList = () => {
  return axios.get(`${API_BASE_URL}/api/shoppinglist`);
};

export const getCreateFormShoppingList = () => {
  return axios.get(`${API_BASE_URL}/api/shoppinglist/create`);
};

export const createShoppingList = (formData) => {
  return axios.post(`${API_BASE_URL}/api/shoppinglist/create`, formData);
};

export const deleteShoppingList = (id) => {
  return axios.delete(`${API_BASE_URL}/api/shoppinglist/${id}`);
};
