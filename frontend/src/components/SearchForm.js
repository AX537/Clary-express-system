import { useState } from "react";

function SearchForm({ onSearch }) {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    date: "",
    passengers: 1
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <input name="origin" placeholder="Origin" onChange={handleChange} />
      <input name="destination" placeholder="Destination" onChange={handleChange} />
      <input type="date" name="date" onChange={handleChange} />
      <input
        type="number"
        name="passengers"
        min="1"
        value={form.passengers}
        onChange={handleChange}
      />

      <button type="submit">Search Buses</button>
    </form>
  );
}

export default SearchForm;