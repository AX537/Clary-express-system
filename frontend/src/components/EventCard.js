import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        width: "200px",
        borderRadius: "10px",
        textAlign: "center"
      }}
    >
      <img
        src={event.image}
        alt={event.title}
        style={{ width: "100%", borderRadius: "10px" }}
      />

      <h3>{event.title}</h3>
      <p>{event.price}</p>

      <button onClick={handleBooking}>
        Book Now
      </button>
    </div>
  );
}

export default EventCard;