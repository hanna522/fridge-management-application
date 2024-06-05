import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FridgeCard from "./FridgeCard";
import FridgeAdd from "./FridgeAdd";
import { Cursor, PlusCircleFill, SortDown } from "react-bootstrap-icons";
import CategorySlider from "./CategorySlider";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Fridge({ items, categories, onItemUpdate, onItemDelete, onItemAdd }) {
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [sortField, setSortField] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterValue, setFilterValue] = useState("");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const handleAdd = () => {
    setSelectedAdd(true);
  };

  const closeModal = () => {
    setSelectedAdd(false);
  };

  const statusOrder = ["Fresh", "Alive", "Dying", "Dead"];

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const sortedAndFilteredItems = items
    .filter((item) => {
      if (!filterValue) return true;
      const category = getNestedValue(item, "ingredient.category.name");
      return (
        typeof category === "string" &&
        category.toLowerCase().includes(filterValue.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);

      if (sortField === "status") {
        const aIndex = statusOrder.indexOf(aValue);
        const bIndex = statusOrder.indexOf(bValue);
        return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  console.log("sorted items: ", sortedAndFilteredItems);

  return (
    <>
      <div className="fridge-top">
        <h1>My Fridge</h1>
        <div className="top">
          <p>Category</p>
          <div
            className="sort-toggle"
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            <SortDown className="icon" size={13} color="gray" />
            <p>Sort</p>
          </div>
          {isSortMenuOpen && (
            <div className="sort-menu">
              <button
                onClick={() => {
                  setSortField("exp_date");
                  setSortOrder("asc");
                  setIsSortMenuOpen(false);
                }}
              >
                Expiration Date: Close
              </button>
              <button
                onClick={() => {
                  setSortField("status");
                  setSortOrder("asc");
                  setIsSortMenuOpen(false);
                }}
              >
                Status: Fresh
              </button>
              <button
                onClick={() => {
                  setSortField("ingredient.name");
                  setSortOrder("asc");
                  setIsSortMenuOpen(false);
                }}
              >
                Name: A-Z
              </button>
              <button
                onClick={() => {
                  setSortField("buy_date");
                  setSortOrder("asc");
                  setIsSortMenuOpen(false);
                }}
              >
                Buy Date: Recent
              </button>
            </div>
          )}
        </div>

        <CategorySlider
          categories={categories}
          setFilterValue={setFilterValue}
        />

        <p>{sortedAndFilteredItems.length} items</p>
      </div>

      <ul className="fridge-card-container">
        {sortedAndFilteredItems.map((item, index) => (
          <FridgeCard
            key={index}
            item={item}
            onItemUpdate={onItemUpdate}
            onItemDelete={onItemDelete}
          />
        ))}
      </ul>
      <PlusCircleFill
        onClick={handleAdd}
        className="btn-add-circle"
        style={{ cursor: "pointer" }}
      />

      <Modal
        isOpen={!!selectedAdd}
        onRequestClose={closeModal}
        contentLabel="Add Ingredient"
        className="Modal modal-add-shop"
        overlayClassName="Overlay"
      >
        {selectedAdd && (
          <FridgeAdd onItemAdd={onItemAdd} onClose={closeModal} />
        )}
      </Modal>
    </>
  );
}

export default Fridge;
