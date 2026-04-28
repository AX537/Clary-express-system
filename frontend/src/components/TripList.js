import { useNavigate } from "react-router-dom";

function TripList({ trips }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      {trips.map((trip) => (
        <div
          key={trip.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{trip.bus}</h3>
          <p>Time: {trip.time}</p>
          <p>Price: {trip.price}</p>

          <button onClick={() => navigate("/booking")}>
            Select Seat
          </button>
        </div>
      ))}
    </div>
  );
}

export default TripList;