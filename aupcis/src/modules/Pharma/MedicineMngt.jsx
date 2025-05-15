import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import "../Pharma/MedicineMngt.css";
import Modal from "../../components/Modal";

const MedicineMngt = () => {
  const [batchNo, setBatchNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [search, setSearch] = useState("");
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    manufacturer: "",
    dosageForm: "",
    strength: "",
    price: "",
    unit: "",
    description: "",
  });
  const [stockData, setStockData] = useState({
    batchNo: "",
    quantity: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter(
        (med) =>
          med.genericName.toLowerCase().includes(search.toLowerCase()) ||
          med.brand.toLowerCase().includes(search.toLowerCase()) ||
          med.manufacturer.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        "https://aup-patientfirst-server.onrender.com/api/pharma/medicines"
      );
      const medicinesWithQuantities = await Promise.all(
        response.data.medicines.map(async (medicine) => {
          const batchResponse = await axios.get(
            "https://aup-patientfirst-server.onrender.com/api/pharma/getStock"
          );
          const medicineBatches = batchResponse.data.filter(
            (stock) => stock.medication._id === medicine._id
          );
          const totalQuantityLeft = medicineBatches.reduce(
            (sum, batch) => sum + batch.quantity,
            0
          );
          return { ...medicine, totalQuantityLeft };
        })
      );
      setMedicines(medicinesWithQuantities);
      setFilteredMedicines(medicinesWithQuantities);
    } catch (error) {
      console.error("Error fetching medicines", error);
    }
  };

  const fetchBatches = async (medicineId) => {
    try {
      const response = await axios.get(
        "https://aup-patientfirst-server.onrender.com/api/pharma/getStock"
      );
      const medicineBatches = response.data.filter(
        (stock) => stock.medication._id === medicineId
      );
      setBatches(medicineBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const openMedicineModal = async (medicine) => {
    setSelectedMedicine(medicine);
    await fetchBatches(medicine._id);
    setShowMedicineModal(true);
  };

  const closeMedicineModal = () => {
    setSelectedMedicine(null);
    setBatches([]);
    setShowMedicineModal(false);
  };

  const openAddStockModal = (medicine) => {
    console.log("Opening Add Stock Modal for Medicine:", medicine);
    if (!medicine || !medicine._id) {
      alert("Error: Medicine ID is missing!");
      return;
    }
    setSelectedMedicine(medicine);
    setStockData({ batchNo: "", quantity: "", expiryDate: "" });
    setShowAddStockModal(true);
  };

  const closeAddStockModal = () => {
    setSelectedMedicine(null);
    setStockData({ batchNo: "", quantity: "", expiryDate: "" });
    setShowAddStockModal(false);
  };

  const handleAddStock = async (e) => {
    e.preventDefault(); // Prevent form submission reload

    // Debugging log
    console.log("Stock Data:", stockData);

    if (!selectedMedicine || !selectedMedicine._id) {
      alert("Please select a valid medicine.");
      return;
    }

    if (!stockData.quantity || !stockData.expiryDate) {
      alert("Quantity and expiry date are required.");
      return;
    }

    const formattedDate = new Date(stockData.expiryDate)
      .toISOString()
      .split("T")[0];

    const stockPayload = {
      medicineId: selectedMedicine._id,
      batchNo: stockData.batchNo.trim(),
      quantity: parseInt(stockData.quantity, 10),
      expiryDate: formattedDate,
    };

    console.log("Sending Stock Data:", stockPayload);

    try {
      const response = await axios.post(
        "https://aup-patientfirst-server.onrender.com/api/pharma/add-stock",
        stockPayload
      );

      
      alert("Stock added successfully!"); // Notification for successful stock addition
      setStockData({ batchNo: "", quantity: "", expiryDate: "" });
      closeAddStockModal();
    } catch (error) {
      console.error(
        "Error adding stock:",
        error.response?.data || error.message
      );
      alert("Failed to add stock. Check console for details.");
    }
    fetchMedicines();
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      // Ensure all required fields are populated
      if (
        !formData.genericName ||
        !formData.brand ||
        !formData.manufacturer ||
        !formData.price
      ) {
        console.log("Form Data:", formData);
        console.error("Error: Missing required fields for adding medicine");
        return;
      }

      // API call to add a new medicine
      await axios.post(
        "https://aup-patientfirst-server.onrender.com/api/pharma/add-medicines",
        formData
      );

      fetchMedicines(); // Refresh the medicine list
      closeAddMedicineModal(); // Close the modal
      alert("New medicine added successfully!"); // Notification for successful medicine addition
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    try {
      // Ensure all required fields are populated
      if (
        !formData._id ||
        !formData.name ||
        !formData.brand ||
        !formData.manufacturer ||
        !formData.price
      ) {
        console.error("Error: Missing required fields for updating medicine");
        return;
      }

      // API call to update an existing medicine
      await axios.put(
        `https://aup-patientfirst-server.onrender.com/api/pharma/update-medicine/${formData._id}`,
        formData
      );

      fetchMedicines(); // Refresh the medicine list
      closeAddMedicineModal(); // Close the modal
      alert("Medicine updated successfully!"); // Notification for successful medicine update
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  const openAddMedicineModal = (medicine = null) => {
    setFormData(
      medicine || {
        name: "",
        brand: "",
        manufacturer: "",
        dosageForm: "",
        strength: "",
        price: "",
        unit: "",
        description: "",
      }
    );
    setShowAddMedicineModal(true);
  };

  const closeAddMedicineModal = () => {
    setShowAddMedicineModal(false);
    setFormData({
      name: "",
      brand: "",
      manufacturer: "",
      dosageForm: "",
      strength: "",
      price: "",
      unit: "",
      description: "",
    });
  };

  const pharmasidebarLinks = [
    { label: "Pharmacy Dashboard", path: "/pharma-dashboard" },
    { label: "Medicine List", path: "/medicine-list" },
    { label: "Pharmacy Transaction", path: "/pharma-transaction" },
    { label: "Prescriptions", path: "/prescription-page" },
    { label: "Analytics and Reports", path: "/pharma-analytics" },
  ];

  return (
    <div>
      <Sidebar
        links={pharmasidebarLinks}
        pageContent={
          <div className="container mt-4">
            <h2 className="mb-4">Medicine List</h2>
            <div className="mb-3 d-flex justify-content-between">
              <input
                type="text"
                className="form-control w-75"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => openAddMedicineModal()} // Ensure this function is correctly referenced
              >
                Add Medicine
              </button>
            </div>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Generic Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Total Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr
                    key={medicine._id}
                    onClick={() => openMedicineModal(medicine)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{medicine.genericName}</td>
                    <td>{medicine.brand}</td>
                    <td>₱{medicine.price}</td>
                    <td>{medicine.totalQuantityLeft}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddStockModal(medicine);
                        }}
                      >
                        Add Stock
                      </button>
                      <button
                        className="btn btn-warning btn-sm ms-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddMedicineModal(medicine);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Medicine Details Modal */}
            {showMedicineModal && selectedMedicine && (
              <Modal
                show={showMedicineModal}
                onClose={closeMedicineModal}
                body={
                  <>
                    <h4>{selectedMedicine.genericName} Details</h4>
                    <p>
                      <strong>Total Quantity:</strong>{" "}
                      {selectedMedicine.totalQuantityLeft}
                    </p>
                    <h5>Available Batches</h5>
                    <table className="table table-bordered table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>Batch</th>
                          <th>Quantity</th>
                          <th>Expiration Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batches.length > 0 ? (
                          batches.map((batch, index) => (
                            <tr key={index}>
                              <td>{batch.batchNo || `Batch ${index + 1}`}</td>
                              <td>{batch.quantity}</td>
                              <td>
                                {new Date(
                                  batch.expiryDate
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">
                              No batches available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-secondary mt-3"
                      onClick={closeMedicineModal}
                    >
                      Close
                    </button>
                  </>
                }
              ></Modal>
            )}

            {/* Add/Edit Medicine Modal */}
            {showAddMedicineModal && (
              <Modal
                show={showAddMedicineModal}
                onClose={closeAddMedicineModal}
                body={
                  <>
                    <h4>
                      {formData._id ? "Edit Medicine" : "Add New Medicine"}
                    </h4>
                    <form
                      onSubmit={
                        formData._id ? handleUpdateMedicine : handleAddMedicine
                      }
                    >
                      {[
                        "genericName",
                        "brand",
                        "manufacturer",
                        "dosageForm",
                        "strength",
                        "price",
                        "unit",
                        "description",
                      ].map((field) => (
                        <div className="form-group" key={field}>
                          <label>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          {field === "dosageForm" ? (
                            <select
                              className="form-control"
                              value={formData.dosageForm}
                              onChange={e => setFormData({ ...formData, dosageForm: e.target.value })}
                              required
                            >
                              <option value="">Select Dosage Form</option>
                              <option value="Tablet">Tablet</option>
                              <option value="Capsule">Capsule</option>
                              <option value="Syrup">Syrup</option>
                              {/* <option value="Suspension">Suspension</option>
                              <option value="Injection">Injection</option>
                              <option value="Ointment">Ointment</option>
                              <option value="Cream">Cream</option>
                              <option value="Drops">Drops</option>
                              <option value="Suppository">Suppository</option> */}
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <input
                              type={field === "price" ? "number" : "text"}
                              className="form-control"
                              value={formData[field]}
                              onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                              required
                            />
                          )}
                        </div>
                      ))}
                      <button type="submit" className="btn btn-primary">
                        {formData._id ? "Update Medicine" : "Add Medicine"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={closeAddMedicineModal}
                      >
                        Cancel
                      </button>
                    </form>
                  </>
                }
              ></Modal>
            )}

            {/* Add Stock Modal */}
            {showAddStockModal && selectedMedicine && (
              <Modal
                show={showAddStockModal}
                onClose={closeAddStockModal}
                body={
                  <>
                    <h4>Add Stock for {selectedMedicine.name}</h4>
                    <form onSubmit={handleAddStock}>
                      <div className="form-group">
                        <label>Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          value={stockData.quantity}
                          onChange={(e) =>
                            setStockData((prev) => ({
                              ...prev,
                              quantity: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Expiration Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={stockData.expiryDate}
                          onChange={(e) =>
                            setStockData((prev) => ({
                              ...prev,
                              expiryDate: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Add Stock
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={closeAddStockModal}
                      >
                        Cancel
                      </button>
                    </form>
                  </>
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default MedicineMngt;
