import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Trash } from "react-bootstrap-icons";

function FridgeCard({ item, onViewDetail}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete confirmation modal

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const onDeleteConfirm = (item) => {
    axios
      .delete(`http://localhost:5050/api/fridgeinstance/${item._id}/delete`)
      .then((res) => {
        console.log("Fridge instance deleted:", res.data);
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
      <li onClick={() => onViewDetail(item)} style={{ cursor: "pointer" }}>
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
