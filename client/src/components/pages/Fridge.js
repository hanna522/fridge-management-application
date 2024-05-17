import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import FridgeCard from "./FridgeCard";
import FridgeDetail from "./FridgeDetail";
import FridgeAdd from "./FridgeAdd";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Fridge() {
  const [items, setItems] = useState([]);
  const [selections, setSelections] = useState({
    ingredient_list: [],
    category_list: [],
  });
  const [formData, setFormData] = useState({
    ingredient: "",
    buy_date: "",
    exp_date: "",
    status: "",
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // For viewing details
  const [selectedAdd, setSelectedAdd] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/fridgeinstance/create")
      .then((res) => {
        setSelections(res.data);
        console.log("Create Fridge Instance");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get("http://localhost:5050/api/fridgeinstance")
      .then((res) => {
        setItems(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
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
    if (editingItemId) {
      axios
        .put(
          `http://localhost:5050/api/fridgeinstance/${editingItemId}`,
          formData
        )
        .then((res) => {
          console.log("Fridge instance updated:", res.data);
          // 필요한 경우 상태 초기화
          setFormData({
            ingredient: "",
            buy_date: "",
            exp_date: "",
            status: "",
          });
          setEditingItemId(null);
          // 필요한 경우 새로 추가된 항목을 상태에 반영
          setItems((prevItems) =>
            prevItems.map((item) =>
              item._id === res.data.ingredientInstance._id
                ? res.data.ingredientInstance
                : item
            )
          );
          setSelectedAdd(false);
        })
        .catch((error) => {
          console.error("Error updating fridge instance:", error);
        });
    } else {
      axios
        .post("http://localhost:5050/api/fridgeinstance/create", formData)
        .then((res) => {
          console.log("Fridge instance created:", res.data);
          // 필요한 경우 상태 초기화
          setFormData({
            ingredient: "",
            buy_date: "",
            exp_date: "",
            status: "",
          });
          // 필요한 경우 새로 추가된 항목을 상태에 반영
          setItems((prevItems) => [...prevItems, res.data.ingredientInstance]);
          setSelectedAdd(false);
        })
        .catch((error) => {
          console.error("Error creating fridge instance:", error);
        });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ingredient: item.ingredient._id,
      buy_date: item.buy_date.split("T")[0], // assuming the date is in ISO format
      exp_date: item.exp_date.split("T")[0],
      status: item.status,
    });
    setEditingItemId(item._id);
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
  };

  const handleSave = (formData) => {
    axios
      .put(`http://localhost:5050/api/fridgeinstance/${formData._id}`, formData)
      .then((res) => {
        console.log("Fridge instance updated:", res.data);
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === res.data.ingredientInstance._id
              ? res.data.ingredientInstance
              : item
          )
        );
        setSelectedItem(null);
      })
      .catch((error) => {
        console.error("Error updating fridge instance:", error);
      });
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedAdd(false);
  };

  const handleAdd = () => {
    setSelectedAdd(true);
  };

  return (
    <>
      <h1>Your Fridge</h1>
      <ul>
        {items.map((item, index) => (
          <FridgeCard key={index} item={item} onViewDetail={handleViewDetail} />
        ))}
      </ul>
      <h2 onClick={handleAdd} style={{ cursor: "pointer" }}>
        +
      </h2>

      <Modal
        isOpen={!!selectedItem}
        onRequestClose={closeModal}
        contentLabel="Ingredient Details"
        className="Modal"
        overlayClassName="Overlay"
      >
        {selectedItem && (
          <FridgeDetail
            item={selectedItem}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </Modal>

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
            selections={selections}
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
