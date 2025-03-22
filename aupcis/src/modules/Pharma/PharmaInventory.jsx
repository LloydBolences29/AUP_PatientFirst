import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Sidebar from "../../components/Sidebar";

const PharmaInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [medications, setMedications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    batchNo: "",
    quantity: "",
    expiryDate: "",
    status: "Active",
  });

  useEffect(() => {
    fetchInventory();
    fetchMedications();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pharma/getStock");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pharma/medicines");
      setMedications(response.data.medicines);
    } catch (error) {
      console.error("Error fetching medications", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setFormData({ name: "", batchNo: "", quantity: "", expiryDate: "", status: "Active" });
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", batchNo: "", quantity: "", expiryDate: "", status: "Active" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStock = async (e) => {
    e.preventDefault();

    try {
      // Find medication by name
      const medication = medications.find(
        (med) => med.name.toLowerCase() === formData.name.toLowerCase()
      );

      if (!medication) {
        alert("Medication not found! Please enter a valid medication name.");
        return;
      }

      // Add stock to inventory
      await axios.post("http://localhost:3000/api/pharma/add-stock", {
        batchNo: formData.batchNo,
        medicationId: medication._id,
        quantity: formData.quantity,
        expiryDate: formData.expiryDate,
      });

      // Update totalQuantityLeft in medications
      await axios.put(
        `http://localhost:3000/api/pharma/medicine/${medication._id}`,
        {
          totalQuantityLeft: medication.totalQuantityLeft + parseInt(formData.quantity),
        }
      );

      fetchInventory();
      closeModal();
    } catch (error) {
      console.error("Error adding stock", error);
    }
  };

  const pharmasidebarLinks = [
    { label: "Pharmacy Dashboard", path: "/pharma-dashboard" },
    { label: "Medicine List", path: "/medicine-list" },
    { label: "Stock Management", path: "/medicine-inventory" },
    { label: "Transaction History", path: "/pharma-transaction-history" },
    { label: "Analytics and Reports", path: "/pharma-analytics" },
  ];

  return (
    <div>
      <Sidebar
        props={pharmasidebarLinks}
        pageContent={
          <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Stock Management</h2>
              <button className="btn btn-primary" onClick={openModal}>
                Add New Stock
              </button>
            </div>
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Batch No</th>
                  <th>Medication</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((stock) => (
                  <tr key={stock._id}>
                    <td>{stock.batchNo}</td>
                    <td>{stock.medication.name}</td>
                    <td>{stock.medication.brand}</td>
                    <td>{stock.quantity}</td>
                    <td>{new Date(stock.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={openModal}>
                        Add Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showModal && (
              <Modal
                show={showModal}
                title={<h2 className="modal-title">Add New Stock</h2>}
                body={
                  <form onSubmit={handleAddStock} className="p-3">
                    <div className="form-group mb-3">
                      <label className="form-label">Medication Name:</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Batch No:</label>
                      <input
                        type="text"
                        name="batchNo"
                        className="form-control"
                        value={formData.batchNo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Quantity:</label>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Expiry Date:</label>
                      <input
                        type="date"
                        name="expiryDate"
                        className="form-control"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">Status:</label>
                      <select
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-success me-2">
                        Add Stock
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                      </button>
                    </div>
                  </form>
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default PharmaInventory;
