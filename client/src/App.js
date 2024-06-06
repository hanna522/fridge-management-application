import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  fetchFridgeInstances,
  fetchCategories,
  fetchShoppingList,
  login,
  register,
  logout,
  getUserInfo,
} from "./Api";
import Home from "./components/homes/Home";
import ShoppingList from "./components/shoppinglists/ShoppingList";
import Fridge from "./components/fridges/Fridge";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Analysis from "./components/analysis/Analysis";

function App() {
  const [items, setItems] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [categories, setCategories] = useState({ category_list: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({ email: "", userName: "" });
  const [loading, setLoading] = useState(true); // 로딩 상태 변수 추가

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.token) {
      setUser(storedUser);
      setIsLoggedIn(true); // 로그인 상태 설정
      fetchAllData();
    } else {
      setLoading(false); // 로딩 완료 설정
    }
  }, []);

  useEffect(() => {
    console.log("Updated Shopping Lists: ", shoppingLists);
  }, [shoppingLists]);

  const fetchAllData = async () => {
    try {
      setLoading(true); // 데이터 로딩 시작
      await Promise.all([
        fetchUserData(),
        fetchData(),
        fetchShoppingListData(),
        fetchCategory(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // 모든 데이터 로딩 완료
    }
  };

  const fetchUserData = () => {
    return getUserInfo()
      .then((response) => {
        console.log("User name response:", response);
        setUserInfo(response);
      })
      .catch((error) => {
        console.error("Error fetching user name:", error);
      });
  };

  const fetchData = () => {
    return fetchFridgeInstances()
      .then((res) => {
        setItems(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const fetchShoppingListData = () => {
    return fetchShoppingList()
      .then((res) => {
        console.log(res.data.data);
        setShoppingLists(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error);
      });
  };

  const fetchCategory = () => {
    return fetchCategories()
      .then((res) => {
        setCategories(res.data);
        console.log("Get Category Data");
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  };

  const handleItemUpdate = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const handleItemDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const handleItemAdd = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleShoppingListUpdate = (updatedList) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list._id === updatedList._id ? updatedList : list
      )
    );
  };

  const handleShoppingListDelete = (id) => {
    console.log("Still Trying...");
    setShoppingLists((prevLists) =>
      prevLists.filter((list) => list._id !== id)
    );
  };

  const handleShoppingListAdd = (newList) => {
    setShoppingLists((prevLists) => [...prevLists, newList]);
  };

  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userData)); // 사용자 정보를 로컬 스토리지에 저장
      fetchAllData();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (email, password, groupName) => {
    try {
      await register(email, password, groupName);
      await handleLogin(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserInfo({ email: "", userName: "" });
    setIsLoggedIn(false);
    setItems([]);
    setShoppingLists([]);
    setCategories({ category_list: [] });
    localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 제거
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar
        userInfo={userInfo}
        isLoggedIn={isLoggedIn}
        handleRegister={handleRegister}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home items={items || []} categories={categories} />}
          />
          <Route
            path="/home"
            element={
              <Home
                userInfo={userInfo}
                items={items || []}
                shoppingLists={shoppingLists || []}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
                onItemAdd={handleItemAdd}
                onShoppingListUpdate={handleShoppingListUpdate}
                onShoppingListAdd={handleShoppingListAdd}
                onShoppingListDelete={handleShoppingListDelete}
                handleRegister={handleRegister}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
              />
            }
          />
          <Route
            path="/fridge"
            element={
              <Fridge
                items={items}
                categories={categories}
                onItemUpdate={handleItemUpdate}
                onItemDelete={handleItemDelete}
                onItemAdd={handleItemAdd}
              />
            }
          />
          <Route
            path="/shoppinglist"
            element={
              <ShoppingList
                shoppingLists={shoppingLists || []}
                allItems={items}
                categories={categories}
                onShoppingListUpdate={handleShoppingListUpdate}
                onShoppingListAdd={handleShoppingListAdd}
                onShoppingListDelete={handleShoppingListDelete}
              />
            }
          />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
