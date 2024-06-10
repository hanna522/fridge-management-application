import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { deleteIngredient } from "../../Api";
import { Trash } from "react-bootstrap-icons";

function IngredientCard({ item, onItemUpdate, onItemDelete }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const onDeleteConfirm = (item) => {
    deleteIngredient(item._id)
      .then((res) => {
        console.log("Ingredient deleted:", res.data);
        onItemDelete(item._id);
      })
      .catch((error) => {
        console.error("Error deleting Ingredient:", error);
      });
  };

  const handleDeleteConfirm = () => {
    onDeleteConfirm(item);
    setIsDetailOpen(false);
  };

  const getImoji = (cate) => {
    if (cate === "Meat") {
      return "🍖";
    } else if (cate === "Fruit") {
      return "🍎";
    } else if (cate === "Vegetable") {
      return "🥬";
    } else if (cate === "Grain") {
      return "🌾";
    } else {
      return "🥫";
    }
  };

  return (
    <>
      <li className="fridge-card" style={{ cursor: "pointer" }}>
        <div className={"status"}>
          <div
            className="fridge-card-detail"
            onClick={() => setIsDetailOpen(true)}
          >
            <div className="heading">
              <p>{getImoji(item.category.name)}</p>
              <p>
                <b>{item.name}</b>
              </p>
            </div>
            <p className="content">{item.rec_exp_date} days</p>
          </div>
          <Trash
            size={15}
            className="trash-btn"
            onClick={handleDeleteConfirm}
            style={{ cursor: "pointer" }}
          />
        </div>
      </li>

      <Modal
        isOpen={isDetailOpen}
        onRequestClose={() => setIsDetailOpen(false)}
        contentLabel="Ingredient Details"
        className="Modal modal-add-shop"
        overlayClassName="Overlay"
      >
        Will be developed
      </Modal>
    </>
  );
}

export default IngredientCard;
