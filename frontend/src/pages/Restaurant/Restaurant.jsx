import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Gallery from "../../components/Gallery/Gallery";
import Reviews from "../../components/Reviews/Reviews";
import PopularDishes from "../../components/PopularDishes/PopularDishes";
import Menu from "../../components/Menu/Menu";
import Navbar from "../../components/Navbar/Navbar";
import "./Restaurant.css";

const Restaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  // Initialize date to today; you can modify as needed.
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("1");

  // Helper to generate 30-minute time slots from an hours string (e.g. "11 AM - 11 PM")
  const generateTimeSlots = (hoursString) => {
    if (hoursString === "Closed") {
      return ["Restaurant is Closed"];
    }
    try {
      const [openTime, closeTime] = hoursString.split(" - ");
      const parseTime = (timeStr) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (minutes === undefined) minutes = 0;
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      const openMinutes = parseTime(openTime);
      const closeMinutes = parseTime(closeTime);
      const convertMinutesTo12Hour = (totalMinutes) => {
        const hrs24 = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const period = hrs24 >= 12 ? "PM" : "AM";
        const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
        return `${hrs12}:${mins.toString().padStart(2, "0")} ${period}`;
      };
      const slots = [];
      for (let t = openMinutes; t < closeMinutes; t += 30) {
        slots.push(convertMinutesTo12Hour(t));
      }
      return slots;
    } catch (error) {
      console.error("Error generating time slots:", error);
      return [];
    }
  };

  // Fetch restaurant details from the DB
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setRestaurant(null); // reset while loading
        const response = await axios.get(`http://127.0.0.1:5173/restaurants/${id}`);
        if (response.data) {
          setRestaurant(response.data);
        } else {
          console.error("No restaurant data received");
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        if (error.response?.status === 404) {
          alert("Restaurant not found");
          navigate("/book-table");
        } else {
          alert("Error loading restaurant details");
        }
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id, navigate]);

  // Compute available time slots based on the selected date.
  // This calculation is done every time either the restaurant data or date changes.
  const availableTimes = React.useMemo(() => {
    if (!restaurant || !restaurant.hours) return [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const selectedDate = new Date(date);
    const dayOfWeek = days[selectedDate.getDay()];
    // Use hours for the selected day, or fall back to the first available set
    const hoursForDay =
      restaurant.hours[dayOfWeek] || Object.values(restaurant.hours)[0];
    return generateTimeSlots(hoursForDay);
  }, [restaurant, date]);

  // When available times change and a valid time exists, set the default time if none is selected.
  useEffect(() => {
    if (availableTimes.length > 0 && availableTimes[0] !== "Restaurant is Closed") {
      if (!time) {
        setTime(availableTimes[0]);
      }
    } else {
      setTime("");
    }
  }, [availableTimes, time]);

  const handleReserveClick = () => {
    navigate("/reservation-confirmation", {
      state: {
        restaurantName: restaurant?.name || "Restaurant",
        date,
        time,
        people,
      },
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Show a loading state if the restaurant data hasn't loaded yet
  if (!restaurant) {
    return (
      <div className="restaurant-page">
        <Navbar role="customer" />
        <div className="loading">Loading restaurant details...</div>
      </div>
    );
  }

  return (
    <div className="restaurant-page">
      <Navbar role="customer" />
      <div className="main-image">
        <img
          src={
            restaurant.imageUrl ||
            "https://resizer.otstatic.com/v2/photos/wide-huge/3/48791525.jpg"
          }
          alt={restaurant.name}
        />
      </div>
      <h1 className="restaurant-title">{restaurant.name}</h1>

      <div className="content-container">
        <div className="main-content">
          <nav className="restaurant-nav">
            <a href="#overview">Overview</a>
            <a href="#reviews">Reviews</a>
            <a href="#gallery">Gallery</a>
            <a href="#popular-dishes">Popular Dishes</a>
            <a href="#menu">Menu</a>
          </nav>
          <div className="content">
            <section id="overview" className="restaurant-section">
              <h2>Overview</h2>
              <p>{restaurant.description || "Overview content goes here..."}</p>
            </section>
            <section id="reviews" className="restaurant-section">
              <Reviews />
            </section>
            <section id="gallery" className="restaurant-section">
              <Gallery />
            </section>
            <section id="popular-dishes" className="restaurant-section">
              <PopularDishes />
            </section>
            <section id="menu" className="restaurant-section">
              <Menu />
            </section>
          </div>
        </div>
        <div className="reservation-form">
          <h3>Make a reservation</h3>
          <div className="form-row">
            <div className="form-group">
              <label>No. of people</label>
              <input
                type="number"
                min="1"
                max="10"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group time-container">
              <label>Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {availableTimes.length === 0 ||
                (availableTimes.length === 1 &&
                  availableTimes[0] === "Restaurant is Closed") ? (
                  <option value="">Restaurant is Closed</option>
                ) : (
                  availableTimes.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group button-container">
              <button
                className="reserve-button"
                type="button"
                onClick={handleReserveClick}
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
