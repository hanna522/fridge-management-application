import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardImage } from "react-bootstrap-icons";
import {
  fetchShoppingList,
  getCreateFormShoppingList,
  createShoppingList,
  getCreateFormFridgeInstance,
} from "../../Api";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Home({ items, categories }) {
  const [homeData, setHomeData] = useState({});
  const [shoppingLists, setShoppingLists] = useState([]);
  const [shoppingListCreateForm, setShoppingListCreateForm] = useState({
    ingredient: "",
    possess: "no",
  });
  const [ingredientOptions, setIngredientOptions] = useState({
    ingredient_list: [],
  });
  const [selectedAdd, setSelectedAdd] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/home")
      .then((res) => {
        setHomeData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    fetchShoppingListData();

    getCreateFormFridgeInstance()
      .then((res) => {
        setIngredientOptions(res.data);
        console.log("Fetch Shopping List Creating Form");
      })
      .catch((error) => {
        console.error("Error fetching shopping list create form:", error);
      });
  }, []);

  const fetchShoppingListData = () => {
        fetchShoppingList()
      .then((res) => {
        setShoppingLists(res.data.shopping_list);
        console.log("Fetch Shopping List");
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error);
      });
  }
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const filterCategory = (cate) =>
    items.filter((item) => {
      const category = getNestedValue(item, "ingredient.category.name");
      return (
        typeof category === "string" &&
        category.toLowerCase().includes(cate.name.toLowerCase())
      );
    });

  const filterStatus = (status) => {
    return items.filter((item) => item.status === status);
  };

  const getCategoryLength = (filtered) => {
    const totalItems = items.length;
    const filteredItems = filterCategory(filtered).length;
    return (filteredItems / totalItems) * 100;
  };

  const getStatusLength = (s) => {
    const totalItems = items.length;
    const filteredItems = filterStatus(s).length;
    return (filteredItems / totalItems) * 100;
  };

  const statusOrder = ["Fresh", "Alive", "Dying", "Dead"];

  const sortedItems = [...items].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const handleOpenModal = () => {
    setSelectedAdd(true);
  };

  const handleCloseModal = () => {
    setSelectedAdd(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShoppingListCreateForm({ ...shoppingListCreateForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createShoppingList(shoppingListCreateForm)
      .then((res) => {
        console.log("Shopping List created", res.data);
        setShoppingLists([...shoppingLists, res.data]);
        setShoppingListCreateForm({ ingredient: "", possess: "no" });
        fetchShoppingListData();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error creating shopping list item:", error);
      });
  };

  return (
    <>
      <div className="home-message-container">
        <h1>{homeData.message || "Loading..."}</h1>
        <button>
          <CardImage /> upload receipt
        </button>
      </div>

      <div className="home-meal-container">
        <h2 className="home-heading">Today Menu</h2>
        <p>Galbijjim</p>
      </div>

      <div className="home-shop-container">
        <h2 className="home-heading">Shopping List</h2>
        <button onClick={handleOpenModal}>Add Item</button>
        <ul>
          {shoppingLists.map((list, index) => (
            <li key={index}>
              {list.ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="home-fridge-container">
        <h2 className="home-heading">My Fridge</h2>

        <div className="fridge-graph">
          {categories.category_list.map((category) => (
            <div
              key={category.name}
              className={"fridge-graph-bar"}
              style={{ width: `${getCategoryLength(category)}%` }}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>

        <div className="fridge-graph">
          {statusOrder.map((s) => (
            <div
              key={s}
              className="fridge-graph-bar"
              style={{ width: `${getStatusLength(s)}%` }}
            >
              <span>{s}</span>
            </div>
          ))}
        </div>

        <p>{items.length} items</p>

        <ul className="home-fridge-card-container">
          {sortedItems.map((item, index) => (
            <li key={index} className="home-fridge-card">
              <p>{item.ingredient.name}</p>
              <p className={"status-" + item.status}> </p>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={selectedAdd}
        onRequestClose={handleCloseModal}
        contentLabel="Add Shopping List Item"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Add Shopping List Item</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Ingredient:
            <select
              name="ingredient"
              value={shoppingListCreateForm.ingredient}
              onChange={handleChange}
              required
            >
              <option value="">Select an ingredient</option>
              {ingredientOptions.ingredient_list.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Add Item</button>
          <button type="button" onClick={handleCloseModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </>
  );
}

export default Home;
