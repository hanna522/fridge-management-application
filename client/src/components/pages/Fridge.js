import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FridgeCard from "./FridgeCard";
import FridgeAdd from "./FridgeAdd";
import {
  getCreateFormFridgeInstance,
  createFridgeInstance,
  fetchCategories,
} from "../../Api";
import { Cursor, PlusCircleFill, SortDown } from "react-bootstrap-icons";
import CategorySlider from "./CategorySlider";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Fridge({ items, onItemUpdate, onItemDelete, onItemAdd}) {
  const [createElements, setCreateElements] = useState({
    ingredient_list: [],
  });
  const [formData, setFormData] = useState({
    ingredient: "",
    buy_date: "",
    exp_date: "",
    status: "Unknown",
  });
  const [categories, setCategories] = useState({ category_list: [] });
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [sortField, setSortField] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterValue, setFilterValue] = useState("");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  useEffect(() => {
    getCreateFormFridgeInstance()
      .then((res) => {
        setCreateElements(res.data);
        console.log("Create Fridge Instance");
      })
      .catch((error) => {
        console.error("Error fetching creating form data:", error);
      });

    fetchCategories()
      .then((res) => {
        setCategories(res.data);
        console.log("Get Category Data");
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createFridgeInstance(formData)
      .then((res) => {
        console.log("Fridge instance created:", res.data);
        // reset FormData
        setFormData({
          ingredient: "",
          buy_date: "",
          exp_date: "",
          status: "Unknown",
        });
        setSelectedAdd(false);
        onItemAdd(res.data.ingredientInstance);
      })
      .catch((error) => {
        console.error("Error creating fridge instance:", error);
      });
  };

  const handleAdd = () => {
    setSelectedAdd(true);
  };

  const closeModal = () => {
    setSelectedAdd(false);
  };

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
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  console.log("sorted items: ", sortedAndFilteredItems);

  return (
    <>
      <h1>Your Fridge</h1>

      <div className="fridge-top">
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
        size={45}
        onClick={handleAdd}
        className="add-btn"
        style={{ cursor: "pointer" }}
      />

      <Modal
        isOpen={!!selectedAdd}
        onRequestClose={closeModal}
        contentLabel="Add Ingredient"
        className="Modal"
        overlayClassName="Overlay"
      >
        {selectedAdd && (
          <FridgeAdd
            formData={formData}
            selections={createElements}
            onHandleSubmit={handleSubmit}
            onHandleChange={handleChange}
            onClose={closeModal}
          />
        )}
      </Modal>
    </>
  );
}

export default Fridge;
