import React from 'react';

const SeatVisualization = ({ bus, size = 'small' }) => {
  const { seatLayout } = bus;
  if (!seatLayout) return null;

  const { rows, seatsPerRow, takenSeats } = seatLayout;
  const totalSeats = rows * seatsPerRow;
  
  // Determine size classes
  const sizeClasses = {
    small: {
      seat: 'w-3 h-3 text-xs',
      container: 'gap-1',
      row: 'gap-1'
    },
    medium: {
      seat: 'w-4 h-4 text-xs',
      container: 'gap-1.5',
      row: 'gap-1.5'
    },
    large: {
      seat: 'w-5 h-5 text-sm',
      container: 'gap-2',
      row: 'gap-2'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.small;

  const renderSeat = (seatNumber) => {
    const isTaken = takenSeats.includes(seatNumber);
    const seatClass = `
      ${currentSize.seat} 
      rounded-full flex items-center justify-center font-medium transition-all duration-200
      ${isTaken 
        ? 'bg-red-500 text-white cursor-not-allowed' 
        : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
      }
    `;

    return (
      <div
        key={seatNumber}
        className={seatClass}
        title={isTaken ? `Seat ${seatNumber} - Taken` : `Seat ${seatNumber} - Available`}
      >
        {seatNumber}
      </div>
    );
  };

  // Limit display for small cards
  const displayRows = size === 'small' ? Math.min(3, rows) : rows;
  const displaySeatsPerRow = size === 'small' ? Math.min(6, seatsPerRow) : seatsPerRow;

  return (
    <div className="seat-visualization">
      <div className={`flex flex-col ${currentSize.container}`}>
        {Array.from({ length: displayRows }, (_, rowIndex) => {
          const rowSeats = [];
          for (let seat = 1; seat <= displaySeatsPerRow; seat++) {
            const seatNumber = rowIndex * seatsPerRow + seat;
            if (seatNumber <= totalSeats) {
              rowSeats.push(seatNumber);
            }
          }

          return (
            <div key={rowIndex} className={`flex items-center justify-center ${currentSize.row}`}>
              {rowSeats.map(seatNumber => renderSeat(seatNumber))}
            </div>
          );
        })}
        
        {size === 'small' && rows > 3 && (
          <div className="text-center text-xs text-gray-500 mt-1">
            +{rows - 3} more rows
          </div>
        )}
      </div>

      {/* Legend */}
      <div className={`flex items-center justify-center gap-4 mt-2 text-xs ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Taken</span>
        </div>
      </div>
    </div>
  );
};

export default SeatVisualization;
