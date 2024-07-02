import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  getCreateFormFridgeInstance,
  deleteShoppingList,
} from "../../Api";
import { DashCircleFill, Trash } from "react-bootstrap-icons";
import ShoppingListAdd from "./ShoppingListAdd";
import LoggedOut from "../LoggedOut";

function ShoppingList({
  userInfo,
  shoppingLists,
  allItems,
  categories,
  onShoppingListUpdate,
  onShoppingListDelete,
  onShoppingListAdd,
  handleLogin,
  handleRegister,
}) {
  const [ingredientOptions, setIngredientOptions] = useState({
    ingredient_list: [],
  });
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem("checkedItems");
    return saved ? JSON.parse(saved) : {};
  });
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const favorite = localStorage.getItem("favoriteItems");
    return favorite ? JSON.parse(favorite) : {};
  });

  const [selectedAdd, setSelectedAdd] = useState(false);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState("");

  useEffect(() => {
    getCreateFormFridgeInstance()
      .then((res) => {
        setIngredientOptions(res.data);
        console.log("Fetch Shopping List Creating Form");
      })
      .catch((error) => {
        console.error("Error fetching shopping list create form:", error);
      });
  }, []);

  const handleOpenModal = () => {
    setSelectedAdd(true);
  };

  const handleCloseModal = () => {
    setSelectedAdd(false);
  };

  const handleOpenFavoriteModal = () => {
    setIsFavoriteModalOpen(true);
  };

  const handleCloseFavoriteModal = () => {
    setIsFavoriteModalOpen(false);
  };

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

  const deleteShoppingListData = async (id) => {
    console.log("Trying to delete shoppinglist");
    await deleteShoppingList(id)
      .then((res) => {
        console.log("Shopping List deleted:", res.data);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        onShoppingListDelete(id);
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

  const handleFavoriteSelect = (e) => {
    setSelectedFavorite(e.target.value);
  };

  const addFavoriteItem = () => {
    if (selectedFavorite) {
      const favoriteIngredient = ingredientOptions.ingredient_list.find(
        (ingredient) => ingredient._id === selectedFavorite
      );
      if (favoriteIngredient) {
        const newFavoriteItems = {
          ...favoriteItems,
          [favoriteIngredient._id]: favoriteIngredient,
        };
        setFavoriteItems(newFavoriteItems);
        localStorage.setItem("favoriteItems", JSON.stringify(newFavoriteItems));
        console.log("Favorite item added:", favoriteIngredient);
        handleCloseFavoriteModal();
      }
    }
  };

  const deleteFavoriteItem = (ingredientId) => {
    const newFavoriteItems = { ...favoriteItems };
    delete newFavoriteItems[ingredientId];
    setFavoriteItems(newFavoriteItems);
    localStorage.setItem("favoriteItems", JSON.stringify(newFavoriteItems));
    console.log("Favorite item deleted:", ingredientId);
  };

  const isNecessary = (ingredient) => {
    return favoriteItems[ingredient._id] ? "R" : "";
  };

  if (!userInfo.userName)
    return (
      <LoggedOut handleLogin={handleLogin} handleRegister={handleRegister} />
    );

  return (
    <div>
      <div className="fridge-top">
        <h1>Shopping List</h1>
        <div className="top">
          <p>Favorite</p>
        </div>
        <ul className="favorite-item-list">
          {Object.keys(favoriteItems).map((key) => (
            <li key={key} className="favorite-item">
              <span>{favoriteItems[key].name}</span>
              <DashCircleFill
                size={15}
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() => deleteFavoriteItem(key)}
              />
            </li>
          ))}
          <button className="shop-add-btn" onClick={handleOpenFavoriteModal}>
            + Add Favorite
          </button>
        </ul>

        <p>{shoppingLists.length} items</p>

        {shoppingLists && shoppingLists.length > 0 ? (
          <ul className="shop-list">
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
                  <span>{list.ingredient.name}</span>
                  <span className="home-shop-r">
                    {isNecessary(list.ingredient)}
                  </span>
                </label>
                <Trash
                  size={12}
                  className="trash-btn"
                  onClick={() => handleDeleteClick(list)}
                  style={{ cursor: "pointer" }}
                />
              </li>
            ))}
            <button className="shop-add-btn" onClick={handleOpenModal}>
              + Add Items
            </button>
          </ul>
        ) : (
          <div>
            <div className="empty-content">There is no ingredient</div>
            <button className="shop-add-btn" onClick={handleOpenModal}>
              + Add Items
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={selectedAdd}
        onRequestClose={handleCloseModal}
        contentLabel="Add Shopping List Item"
        className="Modal modal-add-shop"
        overlayClassName="Overlay"
      >
        <ShoppingListAdd
          ingredientOptions={ingredientOptions}
          onShoppingListAdd={onShoppingListAdd}
          handleCloseModal={handleCloseModal}
        />
      </Modal>

      <Modal
        isOpen={isFavoriteModalOpen}
        onRequestClose={handleCloseFavoriteModal}
        contentLabel="Add Favorite Item"
        className="Modal modal-add-shop"
        overlayClassName="Overlay"
      >
        <div className="modal-heading">
          <h2>Add Favorite Item</h2>
          <button
            type="button"
            className="close-btn"
            onClick={handleCloseFavoriteModal}
          >
            x
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addFavoriteItem();
          }}
        >
          <label>
            Ingredient:
            <select
              name="ingredient"
              value={selectedFavorite}
              onChange={handleFavoriteSelect}
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
          <button type="submit" className="confirm-btn">
            Add
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="Modal modal-add-shop"
        overlayClassName="Overlay"
      >
        <h2 style={{ paddingTop: "20px" }}>Delete Confirmation</h2>
        <p>Are you sure you want to delete this item?</p>
        <div className="button-container">
          <button
            className="confirm-btn"
            style={{ backgroundColor: "red" }}
            onClick={onDeleteConfirm}
          >
            Yes, delete
          </button>
          <button
            className="confirm-btn"
            style={{ backgroundColor: "darkgray" }}
            onClick={closeDeleteModal}
          >
            No, cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ShoppingList;
