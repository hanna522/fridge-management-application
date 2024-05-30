import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import FridgeDetail from "../fridges/FridgeDetail";
import FridgeAdd from "../fridges/FridgeAdd";
import { Cursor } from "react-bootstrap-icons";

Modal.setAppElement("#root");

function FridgeSummary({
  allItems,
  allCategories,
  onItemUpdate,
  onItemAdd, onItemDelete,
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const filterCategory = (cate) =>
    allItems.filter((item) => {
      const category = getNestedValue(item, "ingredient.category.name");
      return (
        typeof category === "string" &&
        category.toLowerCase().includes(cate.name.toLowerCase())
      );
    });

  const filterStatus = (status) => {
    return allItems.filter((item) => item.status === status);
  };

  const getCategoryLength = (filtered) => {
    const totalItems = allItems.length;
    const filteredItems = filterCategory(filtered).length;
    return (filteredItems / totalItems) * 100;
  };

  const getStatusLength = (s) => {
    const totalItems = allItems.length;
    const filteredItems = filterStatus(s).length;
    return (filteredItems / totalItems) * 100;
  };

  const statusOrder = ["Fresh", "Alive", "Dying", "Dead"];

  const sortedItems = [...allItems].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );
  const handleAdd = () => {
    setSelectedAdd(true);
  };

  const closeModal = () => {
    setSelectedAdd(false);
  };
  return (
    <div className="home-fridge-container">
      <div className="home-heading">
        <Link to="/api/fridge">
          <h2>My Fridge</h2>
        </Link>
        <button className="btn btn-add" onClick={handleAdd}>
          + Add
        </button>
        <Modal
          isOpen={!!selectedAdd}
          onRequestClose={closeModal}
          contentLabel="Add Ingredient"
          className="Modal"
          overlayClassName="Overlay"
        >
          {selectedAdd && (
            <FridgeAdd onItemAdd={onItemAdd} onClose={closeModal} />
          )}
        </Modal>
      </div>

      <div className="fridge-graph">
        {allCategories.category_list.map((category) => (
          <div
            key={category.name}
            className={"category-" + category.name}
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
            className={"status-" + s}
            style={{ width: `${getStatusLength(s)}%` }}
          >
            <span>{s}</span>
          </div>
        ))}
      </div>

      <p>{allItems.length} items</p>

      <ul className="home-fridge-card-container">
        {sortedItems.map((item, index) => (
          <div>
            <li
              key={index}
              className="home-fridge-card"
              onClick={() => setIsDetailOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <p>{item.ingredient.name}</p>
              <p className={"status-" + item.status}> </p>
            </li>
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
          </div>
        ))}
      </ul>
    </div>
  );
}

export default FridgeSummary;
