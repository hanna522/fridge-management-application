import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { PlusCircleFill, SortDown } from "react-bootstrap-icons";
import CategorySlider from "../fridges/CategorySlider";
import {
  getIngredientCreateForm,
  updateIngredient,
  deleteIngredient,
} from "../../Api";
import IngredientAdd from "./IngredientAdd";
import IngredientCard from "./IngredientCard";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Ingredient({
  ingredients,
  categories,
  onIngredientAdd,
  onIngredientDelete,
  onIngredientUpdate,
}) {
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

  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const sortedAndFilteredItems = ingredients
    .filter((item) => {
      if (!filterValue) return true;
      const category = item.category && item.category.name;
      return (
        typeof category === "string" &&
        category.toLowerCase().includes(filterValue.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = getNestedValue(a, sortField) || "";
      const bValue = getNestedValue(b, sortField) || "";

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  useEffect(() => {
    getIngredientCreateForm()
      .then((res) => {
        console.log("Create Ingredient Form Data", res.data);
      })
      .catch((error) => {
        console.error("Error fetching creating form data:", error);
      });
  }, []);

  return (
    <>
      <div className="fridge-top">
        <h1>My Ingredients</h1>
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
                  setSortField("rec_exp_date");
                  setSortOrder("asc");
                  setIsSortMenuOpen(false);
                }}
              >
                Expiration Date: Close
              </button>
              <button
                onClick={() => {
                  setSortField("name");
                  setSortOrder("asc");
                  setIsSortMenuOpen(false);
                }}
              >
                Name: A-Z
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
        {sortedAndFilteredItems.map((item) => (
          <IngredientCard
            key={item._id}
            item={item}
            onItemUpdate={onIngredientUpdate}
            onItemDelete={onIngredientDelete}
          />
        ))}
      </ul>
      <PlusCircleFill
        onClick={handleAdd}
        className="btn-add-circle"
        style={{ cursor: "pointer" }}
      />

      <Modal
        isOpen={selectedAdd}
        onRequestClose={closeModal}
        contentLabel="Add Ingredient"
        className="Modal modal-add-shop"
        overlayClassName="Overlay"
      >
        <div className="modal-heading">
          <h2>Add Ingredient</h2>
          <button type="button" className="close-btn" onClick={closeModal}>
            x
          </button>
        </div>

        {selectedAdd && (
          <IngredientAdd
            onIngredientAdd={onIngredientAdd}
            closeForm={closeModal}
          />
        )}
      </Modal>
    </>
  );
}

export default Ingredient;
