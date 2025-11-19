/**
 * RouteSearchPanel Component
 * Panel tìm kiếm điểm đầu/cuối và chọn phương tiện (giống Google Maps)
 */

import React, { useState, useEffect, useRef } from "react";
import { useHereSearch } from "../hooks/useHereSearch";
import { TRANSPORT_MODES } from "../utils/routeConstants";
import "./RouteSearchPanel.css";

// Convert TRANSPORT_MODES object to array for UI
const TRANSPORT_MODES_ARRAY = Object.values(TRANSPORT_MODES).map((mode) => ({
  id: mode.id,
  icon: mode.icon,
  label: mode.label,
  disabled: !mode.enabled,
}));

const RouteSearchPanel = ({
  apiKey,
  onRouteCalculate,
  userLocation,
  routeStart,
  routeEnd,
  loading,
}) => {
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [activeInput, setActiveInput] = useState(null); // 'start' | 'end'
  const [selectedMode, setSelectedMode] = useState("car");
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { suggestions, autocomplete, lookup, clearSuggestions } =
    useHereSearch(apiKey);

  // Debug suggestions
  useEffect(() => {
    console.log("🎯 Suggestions updated:", suggestions);
  }, [suggestions]);

  // Auto-fill vị trí hiện tại
  useEffect(() => {
    if (userLocation && !startQuery) {
      setStartQuery("Vị trí của bạn");
      setStartPoint({
        lat: userLocation.lat,
        lng: userLocation.lng,
        name: "Vị trí của bạn",
      });
    }
  }, [userLocation, startQuery]);

  // Handle input change
  const handleInputChange = (type, value) => {
    console.log("⌨️ Input change:", type, value);

    if (type === "start") {
      setStartQuery(value);
      setStartPoint(null);
    } else {
      setEndQuery(value);
      setEndPoint(null);
    }

    if (value.length >= 2) {
      console.log("🔍 Calling autocomplete with:", value);
      autocomplete(value, userLocation || { lat: 16.0544, lng: 108.2022 });
    } else {
      clearSuggestions();
    }
  };

  // Handle suggestion select
  const handleSelectSuggestion = async (suggestion) => {
    console.log("📍 Suggestion selected:", suggestion);

    let position = suggestion.position;

    // Nếu không có position, gọi lookup API
    if (!position && suggestion.locationId) {
      console.log("🔎 No position, looking up...", suggestion.locationId);
      const lookupResult = await lookup(suggestion.locationId);

      if (lookupResult) {
        position = { lat: lookupResult.lat, lng: lookupResult.lng };
        console.log("✅ Lookup successful:", position);
      } else {
        console.error("❌ Lookup failed for:", suggestion.locationId);
        alert("Không thể lấy tọa độ cho địa điểm này");
        return;
      }
    }

    if (!position) {
      console.error("❌ No position available:", suggestion);
      alert("Không thể lấy tọa độ cho địa điểm này");
      return;
    }

    const point = {
      lat: position.lat,
      lng: position.lng,
      name: suggestion.title,
      address: suggestion.address,
    };

    console.log("✅ Point created:", point, "for", activeInput);

    if (activeInput === "start") {
      setStartQuery(suggestion.title);
      setStartPoint(point);
      console.log("🟢 Start point set");
      endInputRef.current?.focus();
    } else {
      setEndQuery(suggestion.title);
      setEndPoint(point);
      console.log("🔴 End point set");
    }

    clearSuggestions();
    setActiveInput(null);
  };

  // Handle use current location
  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setStartQuery("Vị trí của bạn");
      setStartPoint({
        lat: userLocation.lat,
        lng: userLocation.lng,
        name: "Vị trí của bạn",
      });
      clearSuggestions();
    }
  };

  // Handle swap points
  const handleSwap = () => {
    const tempQuery = startQuery;
    const tempPoint = startPoint;

    setStartQuery(endQuery);
    setStartPoint(endPoint);

    setEndQuery(tempQuery);
    setEndPoint(tempPoint);
  };

  // Handle calculate route
  const handleCalculateRoute = () => {
    console.log("🚀 Calculate route clicked:", {
      startPoint,
      endPoint,
      selectedMode,
    });

    if (!startPoint || !endPoint) {
      console.error("❌ Missing points:", { startPoint, endPoint });
      alert("Vui lòng nhập điểm đầu và điểm cuối");
      return;
    }

    console.log("✅ Calling onRouteCalculate...");
    onRouteCalculate(startPoint, endPoint, selectedMode);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !startInputRef.current?.contains(event.target) &&
        !endInputRef.current?.contains(event.target)
      ) {
        clearSuggestions();
        setActiveInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

  return (
    <div className="route-search-panel">
      {/* Transport Mode Selector */}
      <div className="transport-modes">
        {TRANSPORT_MODES_ARRAY.map((mode) => (
          <button
            key={mode.id}
            className={`transport-mode ${
              selectedMode === mode.id ? "active" : ""
            } ${mode.disabled ? "disabled" : ""}`}
            onClick={() => !mode.disabled && setSelectedMode(mode.id)}
            disabled={mode.disabled}
            title={mode.disabled ? "Sắp ra mắt" : mode.label}
          >
            <div className="mode-icon">{mode.icon}</div>
            <div className="mode-label">{mode.label}</div>
          </button>
        ))}
      </div>

      {/* Search Inputs */}
      <div className="search-inputs">
        {/* Start Point */}
        <div className="input-group">
          <div className="input-icon start-icon">⭕</div>
          <input
            ref={startInputRef}
            type="text"
            className="search-input"
            placeholder="Điểm xuất phát"
            value={startQuery}
            onChange={(e) => handleInputChange("start", e.target.value)}
            onFocus={() => setActiveInput("start")}
          />
          {startQuery && (
            <button
              className="clear-btn"
              onClick={() => {
                setStartQuery("");
                setStartPoint(null);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Swap Button */}
        <button className="swap-btn" onClick={handleSwap} title="Đổi điểm">
          ⇅
        </button>

        {/* End Point */}
        <div className="input-group">
          <div className="input-icon end-icon">📍</div>
          <input
            ref={endInputRef}
            type="text"
            className="search-input"
            placeholder="Điểm đến"
            value={endQuery}
            onChange={(e) => handleInputChange("end", e.target.value)}
            onFocus={() => setActiveInput("end")}
          />
          {endQuery && (
            <button
              className="clear-btn"
              onClick={() => {
                setEndQuery("");
                setEndPoint(null);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Add Destination Button */}
        <button className="add-destination-btn" disabled>
          <span>+</span> Thêm điểm đến
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {console.log("🎨 Render check:", {
        suggestionsLength: suggestions.length,
        activeInput,
        shouldShow: suggestions.length > 0 && activeInput,
      })}
      {suggestions.length > 0 && activeInput && (
        <div className="suggestions-dropdown" ref={suggestionsRef}>
          {activeInput === "start" && userLocation && (
            <div
              className="suggestion-item current-location"
              onClick={handleUseCurrentLocation}
            >
              <div className="suggestion-icon">📍</div>
              <div className="suggestion-content">
                <div className="suggestion-title">Vị trí của bạn</div>
                <div className="suggestion-address">
                  Sử dụng vị trí hiện tại
                </div>
              </div>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="suggestion-icon">📍</div>
              <div className="suggestion-content">
                <div className="suggestion-title">{suggestion.title}</div>
                {suggestion.address && (
                  <div className="suggestion-address">{suggestion.address}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calculate Route Button */}
      <button
        className="calculate-route-btn"
        onClick={handleCalculateRoute}
        disabled={!startPoint || !endPoint || loading}
      >
        {loading ? (
          <>
            <span className="spinner">⏳</span> Đang tính toán...
          </>
        ) : (
          <>🚗 Tìm đường tránh ngập</>
        )}
      </button>
    </div>
  );
};

export default RouteSearchPanel;
