import React, { useEffect, useState } from "react";
import { getUpdateFormFridgeInstance, updateFridgeInstance } from "../../Api";
import Modal from "react-modal";
import { deleteFridgeInstance } from "../../Api";

function FridgeDetail({ item, onClose, onItemUpdate, onItemDelete }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation modal
  const [isEditing, setIsEditing] = useState(false);
  const [updateElements, setUpdateElements] = useState({
    ingredient_list: [],
    selected_ingredient: "",
    ingredientinstance: "",
  });
  const [formData, setFormData] = useState({
    ingredient: item.ingredient._id,
    buy_date: item.buy_date.split("T")[0],
    exp_date: item.exp_date.split("T")[0],
    status: item.status,
  });

  useEffect(() => {
    getUpdateFormFridgeInstance(item._id)
      .then((res) => {
        setUpdateElements(res.data);
        console.log("Update Fridge Instance");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [item._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    updateFridgeInstance(item._id, formData)
      .then((res) => {
        console.log("Fridge instance updated:", res.data);
        onItemUpdate(res.data.ingredientInstance);
        setIsEditing(false);
        onClose();
      })
      .catch((error) => {
        console.error("Error updating fridge instance:", error);
      });
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const onDeleteConfirm = (item) => {
    deleteFridgeInstance(item._id)
      .then((res) => {
        console.log("Fridge instance deleted:", res.data);
        onItemDelete(item._id);
      })
      .catch((error) => {
        console.error("Error deleting fridge instance:", error);
      });
  };

  const handleDeleteConfirm = () => {
    onDeleteConfirm(item);
    setIsDeleteModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className="modal-heading">
        <h2>Ingredient Details</h2>
        <button
          type="button"
          className="close-btn"
          onClick={() => onClose(false)}
        >
          x
        </button>
      </div>

      {isEditing ? (
        <div>
          <div className="form-group">
            <label htmlFor="ingredient">Ingredient:</label>
            <select
              className="form-control"
              name="ingredient"
              required
              value={formData.ingredient}
              onChange={handleChange}
            >
              {updateElements.ingredient_list.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              className="form-control"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Fresh">Fresh</option>
              <option value="Alive">Alive</option>
              <option value="Dying">Dying</option>
              <option value="Dead">Dead</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="buy_date">Buy Date:</label>
            <input
              type="date"
              name="buy_date"
              required
              value={formData.buy_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="exp_date">Expiration Date:</label>
            <input
              type="date"
              name="exp_date"
              required
              value={formData.exp_date}
              onChange={handleChange}
            />
          </div>

          <button className="confirm-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <p>Ingredient: {item.ingredient.name}</p>
          <p>Status: {item.status}</p>
          <p>Buy Date: {new Date(item.buy_date).toLocaleDateString()}</p>
          <p>Expiration Date: {new Date(item.exp_date).toLocaleDateString()}</p>
          <div className="button-container">
            <button
              className="confirm-btn"
              style={{ backgroundColor: "white", color: "black" }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="confirm-btn"
              style={{ backgroundColor: "red" }}
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </div>
      )}
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
            onClick={handleDeleteConfirm}
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
    </>
  );
}

export default FridgeDetail;
