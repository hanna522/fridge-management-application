import axios from "axios";

const API_BASE_URL = "http://localhost:5050";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Axios request interceptor to add JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the user object from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // If the user object exists and has a token, add it to the request headers
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // Return the modified config
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const register = (email, password, groupName) => {
  return axiosInstance
    .post("/api/register", { email, password, groupName })
    .then((response) => {
      console.log(response.data.message);
    });
};

export const login = (email, password) => {
  return axiosInstance
    .post("/api/login", { email, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      console.log(response.data.message);
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUserInfo = (id) => {
  return axiosInstance.get(`/api/user/${id}/`)
    .then((response) => {
      return response.data;
    })
}

// Fridge Instance services
export const fetchFridgeInstances = () => {
  return axiosInstance.get("/api/fridgeinstance");
};

export const getCreateFormFridgeInstance = () => {
  return axiosInstance.get("/api/fridgeinstance/create");
};

export const createFridgeInstance = (formData) => {
  return axiosInstance.post("/api/fridgeinstance/create", formData);
};

export const getUpdateFormFridgeInstance = (id) => {
  return axiosInstance.get(`/api/fridgeinstance/${id}/update`);
};

export const updateFridgeInstance = (id, formData) => {
  return axiosInstance.put(`/api/fridgeinstance/${id}/update`, formData);
};

export const deleteFridgeInstance = (id) => {
  return axiosInstance.delete(`/api/fridgeinstance/${id}/delete`);
};

// Category services
export const fetchCategories = () => {
  return axiosInstance.get("/api/category");
};

// Shopping List services
export const fetchShoppingList = () => {
  return axiosInstance.get("/api/shoppinglist");
};

export const getCreateFormShoppingList = () => {
  return axiosInstance.get("/api/shoppinglist/create");
};

export const createShoppingList = (formData) => {
  return axiosInstance.post("/api/shoppinglist/create", formData);
};

export const deleteShoppingList = (id) => {
  return axiosInstance.delete(`/api/shoppinglist/${id}`);
};

// Ingredient services
export const getIngredientCreateForm = () => {
  return axiosInstance.get("/api/ingredient/create");
}

export const createIngredient = (formData) => {
  return axiosInstance.post("/api/ingredient/create", formData);
}

export const fetchIngredients = () => {
  return axiosInstance.get("/api/ingredient");
}

export const getIngredientUpdateForm = (id) => {
  return axiosInstance.get(`/api/ingredient/${id}/update`);
}

export const updateIngredient = (id, formData) => {
  return axiosInstance.put(`/api/ingredient/${id}/update`, formData);
}

export const deleteIngredient = (id) => {
  return axiosInstance.delete(`/api/ingredient/${id}`);
}