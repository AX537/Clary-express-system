import React, { useState, useEffect } from "react";
import { bookingAPI } from '../services/api';

function SeatSelector({ selectedSeats, setSelectedSeats, selectedBus }) {
  const totalSeats = 40;
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch booked seats for selected bus
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!selectedBus?.id) return;
      
      try {
        setLoading(true);
        const response = await bookingAPI.getBookings();
        console.log('Bookings API response:', response);
        
        // Handle different possible response structures
        let bookings = [];
        if (response.data?.data) {
          bookings = response.data.data;
        } else if (response.data) {
          bookings = Array.isArray(response.data) ? response.data : [];
        }
        
        console.log('Bookings array:', bookings);
        
        // Get seat numbers for this specific bus that are confirmed
        const seats = bookings
          .filter(booking => {
            const busIdMatch = booking.bus_id === selectedBus.id || booking.busId === selectedBus.id;
            const statusMatch = booking.status === 'confirmed' || booking.status === 'booked';
            return busIdMatch && statusMatch;
          })
          .map(booking => booking.seat_number || booking.seatNumber);
        
        console.log('Booked seats for bus', selectedBus.id, ':', seats);
        
        // If no bookings from API, use mock data for testing
        if (seats.length === 0 && selectedBus?.id) {
          const mockBookedSeats = getMockBookedSeats(selectedBus.id);
          console.log('Using mock booked seats:', mockBookedSeats);
          setBookedSeats(mockBookedSeats);
        } else {
          setBookedSeats(seats);
        }
      } catch (error) {
        console.error('Error fetching booked seats:', error);
        // Use mock data as fallback
        if (selectedBus?.id) {
          const mockBookedSeats = getMockBookedSeats(selectedBus.id);
          setBookedSeats(mockBookedSeats);
        } else {
          setBookedSeats([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [selectedBus]);

  // Mock data for testing seat availability
  const getMockBookedSeats = (busId) => {
    const mockData = {
      1: [3, 7, 12, 15, 18, 21, 24, 27, 29], // VX-001
      2: [1, 5, 8, 11, 14, 17, 19, 22, 25, 28, 30], // VX-002
      3: [2, 6, 9, 13, 16, 20, 23, 26, 29], // VX-003
      4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // VX-004 (sold out)
      5: [4, 8, 12, 16, 20, 24, 28, 32, 35], // RT-001
      6: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39], // KB-001
      7: [5, 10, 15, 20, 25, 30], // VX-005
      8: [1, 6, 11, 16, 21, 26, 28, 29, 30], // VX-006
      9: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], // RT-002 (sold out)
      10: [1, 8], // VX-007
      11: [2, 8, 14, 20, 26], // VX-008
      12: [5, 11, 17, 23, 29], // VX-009
      13: [3, 9, 15, 21, 27], // VX-010
      14: [1, 7, 13, 19, 25], // VX-011
      15: [4, 10, 16, 22, 28], // VX-012
      16: [6, 12, 18, 24, 30], // VX-013
      17: [2, 8, 14, 20, 26], // VX-014
      18: [1, 7, 13, 19, 25], // VX-015
      19: [3, 9, 15, 21], // VX-016
      20: [5, 11, 17, 23], // VX-017
      21: [2, 8, 14, 20, 26, 32], // ST-001
      22: [4, 10, 16, 22, 28, 34], // ST-002
      23: [1, 7, 13, 19, 25, 31], // YK-001
      24: [3, 9, 15, 21, 27], // YK-002
    };
    return mockData[busId] || [];
  };

  const toggleSeat = (seatNumber) => {
    // Don't allow selecting already booked seats
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    let updatedSeats;

    if (selectedSeats.includes(seatNumber)) {
      updatedSeats = selectedSeats.filter((s) => s !== seatNumber);
    } else {
      updatedSeats = [...selectedSeats, seatNumber];
    }

    setSelectedSeats(updatedSeats);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Select Your Seats</h3>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 dark:text-gray-400">Loading seat availability...</div>
        </div>
      ) : (
        <div className="grid grid-cols-8 gap-2 mb-3">
          {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);
            
            return (
              <div
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                  isBooked
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : isSelected
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                }`}
              >
                {seat}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected: <span className="font-semibold text-gray-900 dark:text-white">
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded mr-1"></div>
            <span className="text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
            <span className="text-gray-600 dark:text-gray-400">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
            <span className="text-gray-600 dark:text-gray-400">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelector;