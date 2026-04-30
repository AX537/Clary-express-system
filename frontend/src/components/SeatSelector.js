import React, { useState, useEffect } from "react";
import { busAPI } from '../services/api';

function SeatSelector({ selectedSeats, setSelectedSeats, selectedBus }) {
  const totalSeats = selectedBus?.totalSeats || selectedBus?.total_seats || 40;
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real seat availability from backend
  useEffect(() => {
    const fetchSeats = async () => {
      if (!selectedBus?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await busAPI.getBusSeats(selectedBus.id);
        const seats = response.data?.data?.seats || [];

        // Mark reserved seats as booked
        const reserved = seats
          .filter(s => s.status === 'reserved')
          .map(s => s.seatNumber || s.seat_number);

        setBookedSeats(reserved);
      } catch (error) {
        console.error('Error fetching seats:', error);
        setBookedSeats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [selectedBus?.id]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Select Your Seats</h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading seat availability...</div>
        </div>
      ) : (
        <div className="grid grid-cols-8 gap-2 mb-4">
          {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => {
            const isBooked   = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <div
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                  isBooked
                    ? 'bg-red-500 text-white cursor-not-allowed'
                    : isSelected
                    ? 'bg-green-500 text-white cursor-pointer'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 hover:bg-blue-200 cursor-pointer'
                }`}
              >
                {seat}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Selected: <span className="font-semibold text-gray-900">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <span className="text-gray-500">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
            <span className="text-gray-500">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
            <span className="text-gray-500">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelector;
