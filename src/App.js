import React, { useState } from "react";
import "./App.css"; // Ensure you include responsive styles in this file
import axios from "axios";

function App() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setError("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setInputValue(value);
      setError("");
    }
  };

  const handleSearch = async () => {
    if (!selectedVehicle || !inputValue) {
      setError("Vui lòng chọn loại phương tiện và nhập biển số hợp lệ.");
      return;
    }

    const vehicleTypeMap = {
      "Ô tô": 1,
      "Xe máy": 2,
      "Xe đạp điện": 3,
    };

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.get(
        `https://api.phatnguoi.vn/web/tra-cuu/bienso/phuongtien`,
        {
          params: {
            bienso: inputValue.toUpperCase(),
            phuongtien: vehicleTypeMap[selectedVehicle],
          },
        }
      );

      // Extract only the paragraph content from the response
      const regex = /<p>(.*?)<\/p>/;
      const match = response.data.match(regex);
      const cleanResult = match ? match[1] : "Không tìm thấy dữ liệu.";

      setResult(cleanResult.replace("BIENSO", inputValue));
    } catch (error) {
      setError("Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <h2>Tra Cứu Phạt Nguội</h2>
      </div>
      <div className="vehicle-buttons">
        {["Ô tô", "Xe máy", "Xe máy điện"].map((vehicle) => (
          <button
            key={vehicle}
            className={selectedVehicle === vehicle ? "active" : ""}
            onClick={() => handleVehicleClick(vehicle)}
          >
            {vehicle}
          </button>
        ))}
      </div>

      <div className="input-container" style={{ display: "flex" }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Nhập biển số"
        />
      </div>

      <div className="search-button">
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Đang tra cứu..." : "Tra cứu"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading-message">Vui lòng chờ...</div>}

      {result && (
        <div className="result">
          <p>{result}</p>
        </div>
      )}
      <div
        style={{ display: "inline-grid", fontStyle: "italic", marginTop: 40 }}
      >
        <span style={{ marginBottom: 5 }}>
          Đây là website phục vụ cho cá nhân, gia đình và bạn bè, không thương
          mại!
        </span>
        <span>Toàn Diệp: 0972914410</span>
      </div>
    </div>
  );
}

export default App;
