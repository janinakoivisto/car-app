import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import { Box } from "@mui/material";


function CarApp() {
    const [carData, setCarData] = useState([]);
    const [showAddCarForm, setShowAddCarForm] = useState(false);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [price, setPrice] = useState("");
    const [editData, setEditData] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);

  
    useEffect(() => {
      fetch("https://carrestapi.herokuapp.com/cars")
        .then((res) => res.json())
        .then((data) => setCarData(data._embedded.cars))
        .catch((error) => console.log(error));
    }, []);
  
  
    const columnDefs = [
        { headerName: "Brand", field: "brand", 
        cellRenderer: (params) => params.data.brand ? params.data.brand : ""
      },
      { headerName: "Model", field: "model",
        cellRenderer: (params) => params.data.model ? params.data.model : ""
      },
      { headerName: "Year", field: "year",
        cellRenderer: (params) => params.data.year ? params.data.year : ""
      },
      { headerName: "Price", field: "price",
        cellRenderer: (params) => params.data.price ? params.data.price : ""
      },
        {
          headerName: "Delete",
          cellRendererFramework: (params) => (
            <button
              onClick={() => handleDelete(params.data._links.self.href)}
              className="btn-delete"
            >
              Delete
            </button>
          ),
        },
        {
            headerName: "Edit",
            cellRenderer: (params) => (
                <button
                onClick={() => handleEdit(params.data)}
                className="btn-edit"
              >
                Edit
              </button>

            ),
        },
      ];

      const handleDelete = (carUrl) => {
        fetch(carUrl, { method: "DELETE" })
          .then(() => {
            setCarData((prevData) =>
              prevData.filter((car) => car._links.self.href !== carUrl)
            );
          })
          .catch((error) => console.log(error));
      };

      const handleEdit = (row) => {
        setEditData(row);
        setShowEditForm(true);
      };
      

      const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const handleEditSubmit = (event) => {
        event.preventDefault();
        const updatedData = carData.map((car) =>
          car._links.self.href === editData._links.self.href ? editData : car
        );
        setCarData(updatedData);
        setShowEditForm(false);
      };
    


    const gridOptions = {
        domLayout: 'autoHeight',
      };

      const gridStyle = {
        height: "600",
        margin: "0 auto",
        flex: 1,
      };

      const handleAdd = (e) => {
        e.preventDefault();
        const newCar = {
          brand: brand,
          model: model,
          year: year,
          price: price,
        };
        setCarData([...carData, newCar]);
        setShowAddCarForm(false);
        setBrand("");
        setModel("");
        setYear("");
        setPrice("");
      };

      
return (
  <div className="ag-theme-alpine-dark" style={gridStyle}>
    <div style={gridStyle}>
      <h2>List of Cars</h2>
    </div>
    <div className="car-list-container">
    <AgGridReact
      columnDefs={columnDefs}
      rowData={carData}
      gridOptions={gridOptions}
    ></AgGridReact>
    </div>
    <div>
      <button onClick={() => setShowAddCarForm(true)}>Add A Car</button>
    </div>
    {showAddCarForm && (
      <div>
        <form onSubmit={handleAdd}>
          <div>
            <label htmlFor="brand">Brand:</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="model">Model:</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button type="submit">Add Car</button>
        </form>
        <button onClick={() => setShowAddCarForm(false)}>Cancel</button>
      </div>
      
    )}
    <Box>
    {showEditForm && (
  <div className="edit-form">
    <h2>Edit Car</h2>
    <form onSubmit={handleEditSubmit}>
      <label>
        Brand:
        <input
          type="text"
          name="brand"
          value={editData.brand}
          onChange={handleEditInputChange}
        />
      </label>
      <label>
        Model:
        <input
          type="text"
          name="model"
          value={editData.model}
          onChange={handleEditInputChange}
        />
      </label>
      <label>
        Year:
        <input
          type="number"
          name="year"
          value={editData.year}
          onChange={handleEditInputChange}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={editData.price}
          onChange={handleEditInputChange}
        />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={() => setShowEditForm(false)}>
        Cancel
      </button>
    </form>
  </div>
)}

    </Box>
  </div>
);

    }
    

export default CarApp;