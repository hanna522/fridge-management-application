import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import {
  fetchShoppingList,
  getCreateFormFridgeInstance,
  createShoppingList,
  deleteShoppingList,
  updateFridgeInstance,
} from "../../Api";
import { CheckCircle, Trash, PencilSquare } from "react-bootstrap-icons";

function ShoppingList({
  allItems,
  categories,
  onItemUpdate,
  onItemDelete,
  onShoppingListAdd,
  onShoppingListDelete,
}) {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState({
    ingredient_list: [],
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchShoppingListData();
    getCreateFormFridgeInstance()
      .then((res) => {
        setIngredientOptions(res.data);
      })
      .catch((error) => {
        console.error("Error fetching shopping list create form:", error);
      });
  }, []);

  const fetchShoppingListData = () => {
    fetchShoppingList()
      .then((res) => {
        setShoppingLists(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error);
      });
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateFridgeInstance(selectedItem._id, selectedItem)
      .then((res) => {
        onItemUpdate(res.data);
        handleCloseEditModal();
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  };

  const handleDeleteClick = (id) => {
    deleteShoppingList(id)
      .then((res) => {
        onShoppingListDelete(id);
      })
      .catch((error) => {
        console.error("Error deleting shopping list item:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  return (
    <div className="fridge-container">
      <div className="fridge-heading">
        <Link to="/shoppinglist">
          <h2>Shopping List</h2>
        </Link>
      </div>

      <div className="shopping-list-items">
        <h3>Shopping List</h3>
        {shoppingLists && shoppingLists.length > 0 ? (
          <ul className="fridge-list">
            {shoppingLists.map((list) => (
              <li key={list._id} className="fridge-item">
                <span>{list.ingredient.name}</span>
                <div className="fridge-item-actions">
                  <PencilSquare
                    size={18}
                    className="edit-btn"
                    onClick={() => handleOpenEditModal(list)}
                  />
                  <Trash
                    size={18}
                    className="trash-btn"
                    onClick={() => handleDeleteClick(list._id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-content">There are no shopping list items.</div>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={handleCloseEditModal}
        contentLabel="Edit Item"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-heading">
          <h2>Edit Item</h2>
          <button
            type="button"
            className="close-btn"
            onClick={handleCloseEditModal}
          >
            x
          </button>
        </div>

        {selectedItem && (
          <form onSubmit={handleUpdate}>
            <label>
              Ingredient:
              <select
                name="ingredient"
                value={selectedItem.ingredient._id}
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
            <label>
              Necessary:
              <input
                type="checkbox"
                name="necessary"
                checked={selectedItem.necessary}
                onChange={(e) =>
                  setSelectedItem((prevItem) => ({
                    ...prevItem,
                    necessary: e.target.checked,
                  }))
                }
              />
            </label>
            <button type="submit" className="confirm-btn">
              Update
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ShoppingList;
