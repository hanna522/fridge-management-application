import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FridgeDetail from "./FridgeDetail";
import { deleteFridgeInstance } from "../../Api";
import { Trash } from "react-bootstrap-icons";

function FridgeCard({ item, onItemUpdate, onItemDelete}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
  };

  return (
    <>
      <li onClick={() => setIsDetailOpen(true)} style={{ cursor: "pointer" }}>
        <p>
          <b>{item.ingredient.name}</b>
        </p>
        <p>{item.status}</p>
        <p>{new Date(item.buy_date).toLocaleDateString()}</p>
        <p>{new Date(item.exp_date).toLocaleDateString()}</p>
      </li>
      <Trash
        size={15}
        color="gray"
        onClick={handleDeleteClick}
        style={{ cursor: "pointer" }}
      />

      <Modal
        isOpen={isDetailOpen}
        onRequestClose={() => setIsDetailOpen(false)}
        contentLabel="Ingredient Details"
        className="Modal"
        overlayClassName="Overlay"
      >
        <FridgeDetail
          item={item}
          onClose={() => setIsDetailOpen(false)}
          onItemUpdate={onItemUpdate}
        />
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
        <button onClick={handleDeleteConfirm}>Yes, delete</button>
        <button onClick={closeDeleteModal}>No, cancel</button>
      </Modal>
    </>
  );
}

export default FridgeCard;
