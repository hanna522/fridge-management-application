import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FridgeCard from "./FridgeCard";
import FridgeAdd from "./FridgeAdd";
import { getCreateFormFridgeInstance, createFridgeInstance } from "../../Api";
import { PlusCircleFill } from "react-bootstrap-icons";

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
  const [selectedAdd, setSelectedAdd] = useState(false);

  const [sortField, setSortField] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    getCreateFormFridgeInstance()
      .then((res) => {
        setCreateElements(res.data);
        console.log("Create Fridge Instance");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
    .sort((a, b) => {
      const aValue = getNestedValue(a, sortField);
      const bValue = getNestedValue(b, sortField);
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <>
      <h1>Your Fridge</h1>
      <div>
        <label>
          Sort By:
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="ingredient.name">Ingredient Name</option>
            <option value="buy_date">Buy Date</option>
            <option value="exp_date">Expiration Date</option>
          </select>
        </label>
        <label>
          Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Category:
          <button onClick={() => setFilterValue("")}>All</button>
          <button onClick={() => setFilterValue("Meat")}>Meat</button>
          <button onClick={() => setFilterValue("Vegetable")}>Vegetable</button>
          <button onClick={() => setFilterValue("Fruit")}>Fruit</button>
        </label>
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
        size={35}
        color="blue"
        onClick={handleAdd}
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
