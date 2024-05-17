import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FridgeCard from "./FridgeCard";
import FridgeDetail from "./FridgeDetail";
import FridgeAdd from "./FridgeAdd";
import { getCreateFormFridgeInstance, createFridgeInstance } from "../../Api";
import { PlusCircleFill } from "react-bootstrap-icons";

Modal.setAppElement("#root"); // Set the app element for accessibility

function Fridge({ items }) {
  const [createElements, setCreateElements] = useState({
    ingredient_list: [],
    category_list: [],
  });
  const [formData, setFormData] = useState({
    ingredient: "",
    buy_date: "",
    exp_date: "",
    status: "",
  });
  const [selectedItem, setSelectedItem] = useState(null); // For viewing details
  const [selectedAdd, setSelectedAdd] = useState(false);

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
  
  const handleEdit = (updatedItem) => {
    items.map((item) =>
      item._id === updatedItem._id ? updatedItem : item
    )
    setSelectedItem(null);
  }

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
          status: "",
        });
        setSelectedAdd(false);
      })
      .catch((error) => {
        console.error("Error creating fridge instance:", error);
      });
  };

  const handleViewDetail = (item) => {
    setSelectedItem(item);
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
      <PlusCircleFill size= {35} color="blue" onClick={handleAdd} style={{ cursor: "pointer" }} />

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
            onEdit={handleEdit}
            onClose={closeModal}
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
