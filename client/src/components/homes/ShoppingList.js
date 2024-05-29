import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  fetchShoppingList,
  getCreateFormFridgeInstance,
  createShoppingList,
  deleteShoppingList,
} from "../../Api";
import { CheckCircle, Trash } from "react-bootstrap-icons";

const ShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState({
    ingredient_list: [],
  });
  const [shoppingListCreateForm, setShoppingListCreateForm] = useState({
    ingredient: "",
    possess: "no",
  });
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem("checkedItems");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
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
  };

  // for creating a shopping list
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

  // for deleting a shopping list
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const onDeleteConfirm = () => {
    deleteShoppingListData(itemToDelete._id);
  };

  const deleteShoppingListData = (id) => {
    deleteShoppingList(id)
      .then((res) => {
        console.log("Shopping List deleted:", res.data);
        setShoppingLists(shoppingLists.filter((list) => list._id !== id));
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        // 로컬 스토리지에서 삭제된 항목 제거
        const newCheckedItems = { ...checkedItems };
        delete newCheckedItems[id];
        setCheckedItems(newCheckedItems);
        localStorage.setItem("checkedItems", JSON.stringify(newCheckedItems));
      })
      .catch((error) => {
        console.error("Error deleting shopping list:", error);
      });
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      localStorage.setItem("checkedItems", JSON.stringify(newState));
      return newState;
    });
  };

  const deleteCheckedItems = () => {
    Object.keys(checkedItems).forEach((key) => {
      if (checkedItems[key]) {
        deleteShoppingListData(key);
      }
    });
  };

  return (
    <div className="home-shop-container">
      <div className="home-heading">
        <h2>Shopping List</h2>
        <button className="btn btn-add" onClick={handleOpenModal}>
          + Add
        </button>
      </div>
      <ul className="home-shop-list">
        {shoppingLists.map((list, index) => (
          <li key={index}>
            <input
              type="checkbox"
              id={`custom-checkbox-${index}`}
              className="custom-checkbox"
              checked={!!checkedItems[list._id]}
              onChange={() => handleCheckboxChange(list._id)}
            />
            <label
              htmlFor={`custom-checkbox-${index}`}
              style={{
                textDecoration: checkedItems[list._id]
                  ? "line-through"
                  : "none",
              }}
            >
              {list.ingredient.name}
            </label>
            <Trash
              size={12}
              className="trash-btn"
              onClick={() => handleDeleteClick(list)}
              style={{ cursor: "pointer" }}
            />
          </li>
        ))}
      </ul>
      <button className="btn btn-clear" onClick={deleteCheckedItems}>
        Clear
      </button>

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

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Delete Confirmation</h2>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={onDeleteConfirm}>Yes, delete</button>
        <button onClick={closeDeleteModal}>No, cancel</button>
      </Modal>
    </div>
  );
};

export default ShoppingList;
