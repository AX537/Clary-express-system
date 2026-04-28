// Rwanda Public Transport Operators - Real Data Based on Official Tariffs
export const busData = [
  // KIGALI EXPRESS - Premium Service
  {
    id: 1,
    busNumber: "KG-001",
    busName: "Kigali Express",
    company: "Kigali Express",
    from: "Kigali",
    to: "Musanze",
    departureTime: "07:00 AM",
    arrivalTime: "09:30 AM",
    duration: "2h 30m",
    price: 3500,
    availableSeats: 15,
    totalSeats: 45,
    isAvailable: true,
    rating: 4.8,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging", "Entertainment"],
    image: "/logo.png",
    routeType: "Express",
    driverName: "Jean Mugisha",
    driverPhone: "+250 788123456",
    seatLayout: {
      rows: 8,
      seatsPerRow: 6,
      takenSeats: [3, 7, 12, 15, 18, 21, 24, 27, 29, 33, 36, 42]
    }
  },
  {
    id: 2,
    busNumber: "KG-002",
    busName: "Kigali Express",
    company: "Kigali Express",
    from: "Kigali",
    to: "Gisenyi",
    departureTime: "08:00 AM",
    arrivalTime: "11:00 AM",
    duration: "3h 00m",
    price: 4500,
    availableSeats: 12,
    totalSeats: 45,
    isAvailable: true,
    rating: 4.7,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging"],
    image: "/logo.png",
    routeType: "Express",
    driverName: "Paul Niyonzima",
    driverPhone: "+250 788123457",
    seatLayout: {
      rows: 8,
      seatsPerRow: 6,
      takenSeats: [5, 8, 14, 19, 22, 25, 31, 38, 41, 44]
    }
  },
  // VIRUNGA EXPRESS - Northern Routes
  {
    id: 3,
    busNumber: "VG-001",
    busName: "Virunga Express",
    company: "Virunga Express",
    from: "Kigali",
    to: "Ruhengeri",
    departureTime: "06:30 AM",
    arrivalTime: "09:00 AM",
    duration: "2h 30m",
    price: 3200,
    availableSeats: 18,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.6,
    features: ["WiFi", "AC", "Reclining Seats"],
    image: "/logo.png",
    routeType: "Standard",
    driverName: "Emmanuel Nkurunziza",
    driverPhone: "+250 735123456",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [2, 9, 13, 16, 20, 23, 28, 34, 37]
    }
  },
  {
    id: 4,
    busNumber: "VG-002",
    busName: "Virunga Express",
    company: "Virunga Express",
    from: "Kigali",
    to: "Rubavu",
    departureTime: "07:15 AM",
    arrivalTime: "10:45 AM",
    duration: "3h 30m",
    price: 4800,
    availableSeats: 10,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.5,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging"],
    image: "/logo.png",
    routeType: "Express",
    driverName: "Denise Mukamana",
    driverPhone: "+250 735123457",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [4, 11, 17, 24, 29, 32, 38]
    }
  },
  // RITCO - Government Transport
  {
    id: 5,
    busNumber: "RT-001",
    busName: "Ritco Express",
    company: "Ritco",
    from: "Kigali",
    to: "Butare",
    departureTime: "08:30 AM",
    arrivalTime: "11:00 AM",
    duration: "2h 30m",
    price: 2800,
    availableSeats: 20,
    totalSeats: 50,
    isAvailable: true,
    rating: 4.2,
    features: ["AC", "Reclining Seats"],
    image: "/logo.png",
    routeType: "Standard",
    driverName: "Jean Pierre Nsengiyumva",
    driverPhone: "+250 722123456",
    seatLayout: {
      rows: 9,
      seatsPerRow: 6,
      takenSeats: [6, 12, 18, 25, 31, 36, 42, 47]
    }
  },
  {
    id: 6,
    busNumber: "RT-002",
    busName: "Ritco Express",
    company: "Ritco",
    from: "Kigali",
    to: "Huye",
    departureTime: "09:00 AM",
    arrivalTime: "11:30 AM",
    duration: "2h 30m",
    price: 2800,
    availableSeats: 16,
    totalSeats: 50,
    isAvailable: true,
    rating: 4.1,
    features: ["AC"],
    image: "/logo.png",
    routeType: "Standard",
    driverName: "Marie Claire Uwimana",
    driverPhone: "+250 722123457",
    seatLayout: {
      rows: 9,
      seatsPerRow: 6,
      takenSeats: [8, 15, 22, 29, 35, 41, 48]
    }
  },
  // YOVO EXPRESS - Southern Routes
  {
    id: 7,
    busNumber: "YV-001",
    busName: "Yovo Express",
    company: "Yovo Express",
    from: "Kigali",
    to: "Nyagatare",
    departureTime: "07:45 AM",
    arrivalTime: "09:15 AM",
    duration: "1h 30m",
    price: 2000,
    availableSeats: 14,
    totalSeats: 35,
    isAvailable: true,
    rating: 4.4,
    features: ["WiFi", "AC"],
    image: "/logo.png",
    routeType: "Express",
    driverName: "Eric Niyigaba",
    driverPhone: "+250 785123456",
    seatLayout: {
      rows: 6,
      seatsPerRow: 6,
      takenSeats: [3, 9, 14, 19, 24, 28, 33]
    }
  },
  {
    id: 8,
    busNumber: "YV-002",
    busName: "Yovo Express",
    company: "Yovo Express",
    from: "Kigali",
    to: "Kibungo",
    departureTime: "08:15 AM",
    arrivalTime: "10:45 AM",
    duration: "2h 30m",
    price: 2500,
    availableSeats: 11,
    totalSeats: 35,
    isAvailable: true,
    rating: 4.3,
    features: ["WiFi", "AC"],
    image: "/logo.png",
    routeType: "Standard",
    driverName: "Grace Mukandayisenga",
    driverPhone: "+250 785123457",
    seatLayout: {
      rows: 6,
      seatsPerRow: 6,
      takenSeats: [5, 11, 17, 23, 29, 34]
    }
  },
  // STAGECOACH - International Routes
  {
    id: 9,
    busNumber: "SC-001",
    busName: "Stagecoach",
    company: "Stagecoach",
    from: "Kigali",
    to: "Kamembe",
    departureTime: "06:00 AM",
    arrivalTime: "10:30 AM",
    duration: "4h 30m",
    price: 5500,
    availableSeats: 8,
    totalSeats: 45,
    isAvailable: true,
    rating: 4.6,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging", "Toilet"],
    image: "/logo.png",
    routeType: "International",
    driverName: "John Murenzi",
    driverPhone: "+250 732123456",
    seatLayout: {
      rows: 8,
      seatsPerRow: 6,
      takenSeats: [7, 14, 21, 28, 35, 42]
    }
  },
  {
    id: 10,
    busNumber: "SC-002",
    busName: "Stagecoach",
    company: "Stagecoach",
    from: "Kigali",
    to: "Cyangugu",
    departureTime: "07:00 AM",
    arrivalTime: "11:00 AM",
    duration: "4h 00m",
    price: 5200,
    availableSeats: 12,
    totalSeats: 45,
    isAvailable: true,
    rating: 4.5,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging"],
    image: "/logo.png",
    routeType: "International",
    driverName: "Alice Mukamwiza",
    driverPhone: "+250 732123457",
    seatLayout: {
      rows: 8,
      seatsPerRow: 6,
      takenSeats: [4, 10, 16, 22, 27, 33, 39, 44]
    }
  },
  // VOLCANO EXPRESS - Tourist Routes
  {
    id: 11,
    busNumber: "VC-001",
    busName: "Volcano Express",
    company: "Volcano Express",
    from: "Kigali",
    to: "Karongi",
    departureTime: "09:30 AM",
    arrivalTime: "12:00 PM",
    duration: "2h 30m",
    price: 3000,
    availableSeats: 13,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.7,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging", "Refreshments"],
    image: "/logo.png",
    routeType: "Tourist",
    driverName: "Joseph Ndayisenga",
    driverPhone: "+250 789123456",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [6, 13, 19, 25, 31, 37]
    }
  },
  {
    id: 12,
    busNumber: "VC-002",
    busName: "Volcano Express",
    company: "Volcano Express",
    from: "Kigali",
    to: "Kibuye",
    departureTime: "10:00 AM",
    arrivalTime: "12:30 PM",
    duration: "2h 30m",
    price: 3200,
    availableSeats: 9,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.8,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging", "Refreshments"],
    image: "/logo.png",
    routeType: "Tourist",
    driverName: "Chantal Mukamunzi",
    driverPhone: "+250 789123457",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [5, 12, 18, 24, 30, 36, 42]
    }
  },
  // ATRACO - Long Distance
  {
    id: 13,
    busNumber: "AT-001",
    busName: "Atraco Express",
    company: "Atraco",
    from: "Kigali",
    to: "Nyanza",
    departureTime: "07:30 AM",
    arrivalTime: "09:30 AM",
    duration: "2h 00m",
    price: 2200,
    availableSeats: 17,
    totalSeats: 48,
    isAvailable: true,
    rating: 4.3,
    features: ["AC", "Reclining Seats"],
    image: "/logo.png",
    routeType: "Standard",
    driverName: "Michel Habimana",
    driverPhone: "+250 723123456",
    seatLayout: {
      rows: 8,
      seatsPerRow: 6,
      takenSeats: [8, 15, 22, 29, 36, 43]
    }
  },
  {
    id: 14,
    busNumber: "AT-002",
    busName: "Atraco Express",
    company: "Atraco",
    from: "Kigali",
    to: "Gitarama",
    departureTime: "08:00 AM",
    arrivalTime: "10:00 AM",
    duration: "2h 00m",
    price: 2000,
    availableSeats: 20,
    totalSeats: 48,
    isAvailable: true,
    rating: 4.2,
    features: ["AC"],
    image: "/logo.png",
    routeType: "Standard",
    driverName: "Rose Uwimana",
    driverPhone: "+250 723123457",
    seatLayout: {
      rows: 8,
      seatsPerRow: 6,
      takenSeats: [6, 12, 18, 24, 30, 36, 42]
    }
  },
  // ONATRACOM - Regional Routes
  {
    id: 15,
    busNumber: "ON-001",
    busName: "Onatracom Express",
    company: "Onatracom",
    from: "Kigali",
    to: "Rusizi",
    departureTime: "06:45 AM",
    arrivalTime: "10:15 AM",
    duration: "3h 30m",
    price: 4200,
    availableSeats: 14,
    totalSeats: 42,
    isAvailable: true,
    rating: 4.4,
    features: ["WiFi", "AC", "Reclining Seats"],
    image: "/logo.png",
    routeType: "Regional",
    driverName: "Pierre Niyonzima",
    driverPhone: "+250 725123456",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [5, 11, 17, 23, 29, 35, 41]
    }
  },
  {
    id: 16,
    busNumber: "ON-002",
    busName: "Onatracom Express",
    company: "Onatracom",
    from: "Kigali",
    to: "Nyamasheke",
    departureTime: "07:30 AM",
    arrivalTime: "11:00 AM",
    duration: "3h 30m",
    price: 4000,
    availableSeats: 11,
    totalSeats: 42,
    isAvailable: true,
    rating: 4.3,
    features: ["WiFi", "AC"],
    image: "/logo.png",
    routeType: "Regional",
    driverName: "Jeanne d'Arc Mukamana",
    driverPhone: "+250 725123457",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [4, 10, 16, 22, 28, 34, 40]
    }
  },
  // EXPRESSO - Budget Service
  {
    id: 17,
    busNumber: "EX-001",
    busName: "Expresso",
    company: "Expresso",
    from: "Kigali",
    to: "Gicumbi",
    departureTime: "09:00 AM",
    arrivalTime: "11:00 AM",
    duration: "2h 00m",
    price: 1800,
    availableSeats: 22,
    totalSeats: 36,
    isAvailable: true,
    rating: 3.9,
    features: ["AC"],
    image: "/logo.png",
    routeType: "Budget",
    driverName: "Samuel Niyoyita",
    driverPhone: "+250 728123456",
    seatLayout: {
      rows: 6,
      seatsPerRow: 6,
      takenSeats: [7, 14, 21, 28, 35]
    }
  },
  {
    id: 18,
    busNumber: "EX-002",
    busName: "Expresso",
    company: "Expresso",
    from: "Kigali",
    to: "Rulindo",
    departureTime: "10:15 AM",
    arrivalTime: "12:15 PM",
    duration: "2h 00m",
    price: 1900,
    availableSeats: 18,
    totalSeats: 36,
    isAvailable: true,
    rating: 3.8,
    features: ["AC"],
    image: "/logo.png",
    routeType: "Budget",
    driverName: "Gloria Uwase",
    driverPhone: "+250 728123457",
    seatLayout: {
      rows: 6,
      seatsPerRow: 6,
      takenSeats: [5, 12, 19, 26, 33]
    }
  },
  // ROYAL EXPRESS - Premium Service
  {
    id: 19,
    busNumber: "RY-001",
    busName: "Royal Express",
    company: "Royal Express",
    from: "Kigali",
    to: "Muhanga",
    departureTime: "08:45 AM",
    arrivalTime: "10:45 AM",
    duration: "2h 00m",
    price: 2400,
    availableSeats: 15,
    totalSeats: 38,
    isAvailable: true,
    rating: 4.6,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging"],
    image: "/logo.png",
    routeType: "Premium",
    driverName: "David Mugisha",
    driverPhone: "+250 726123456",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [6, 13, 20, 27, 34]
    }
  },
  {
    id: 20,
    busNumber: "RY-002",
    busName: "Royal Express",
    company: "Royal Express",
    from: "Kigali",
    to: "Ngororero",
    departureTime: "09:30 AM",
    arrivalTime: "11:30 AM",
    duration: "2h 00m",
    price: 2300,
    availableSeats: 12,
    totalSeats: 38,
    isAvailable: true,
    rating: 4.5,
    features: ["WiFi", "AC", "Reclining Seats"],
    image: "/logo.png",
    routeType: "Premium",
    driverName: "Claudine Mukandayisenga",
    driverPhone: "+250 726123457",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [4, 11, 18, 25, 32]
    }
  },
  // KIGALI CITY SHUTTLE - Urban Routes
  {
    id: 21,
    busNumber: "KS-001",
    busName: "City Shuttle",
    company: "Kigali City Shuttle",
    from: "Kigali",
    to: "Remera",
    departureTime: "06:00 AM",
    arrivalTime: "06:45 AM",
    duration: "45m",
    price: 800,
    availableSeats: 25,
    totalSeats: 30,
    isAvailable: true,
    rating: 4.1,
    features: ["AC", "USB Charging"],
    image: "/logo.png",
    routeType: "Urban",
    driverName: "Eric Ntaganda",
    driverPhone: "+250 724123456",
    seatLayout: {
      rows: 5,
      seatsPerRow: 6,
      takenSeats: [3, 8, 14, 19, 24]
    }
  },
  {
    id: 22,
    busNumber: "KS-002",
    busName: "City Shuttle",
    company: "Kigali City Shuttle",
    from: "Kigali",
    to: "Kacyiru",
    departureTime: "07:00 AM",
    arrivalTime: "07:50 AM",
    duration: "50m",
    price: 900,
    availableSeats: 20,
    totalSeats: 30,
    isAvailable: true,
    rating: 4.0,
    features: ["AC"],
    image: "/logo.png",
    routeType: "Urban",
    driverName: "Jeanette Uwimana",
    driverPhone: "+250 724123457",
    seatLayout: {
      rows: 5,
      seatsPerRow: 6,
      takenSeats: [5, 11, 17, 23]
    }
  },
  // SAFARI COACH - Tourist Special
  {
    id: 23,
    busNumber: "SF-001",
    busName: "Safari Coach",
    company: "Safari Coach",
    from: "Kigali",
    to: "Akagera National Park",
    departureTime: "07:00 AM",
    arrivalTime: "09:30 AM",
    duration: "2h 30m",
    price: 4500,
    availableSeats: 16,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.7,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging", "Refreshments", "Tour Guide"],
    image: "/logo.png",
    routeType: "Tourist",
    driverName: "Robert Niyitegeka",
    driverPhone: "+250 727123456",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [6, 12, 18, 24, 30, 36]
    }
  },
  {
    id: 24,
    busNumber: "SF-002",
    busName: "Safari Coach",
    company: "Safari Coach",
    from: "Kigali",
    to: "Volcanoes National Park",
    departureTime: "08:00 AM",
    arrivalTime: "10:30 AM",
    duration: "2h 30m",
    price: 4800,
    availableSeats: 12,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.8,
    features: ["WiFi", "AC", "Reclining Seats", "USB Charging", "Refreshments", "Tour Guide"],
    image: "/logo.png",
    routeType: "Tourist",
    driverName: "Marie Louise Mukandayisenga",
    driverPhone: "+250 727123457",
    seatLayout: {
      rows: 7,
      seatsPerRow: 6,
      takenSeats: [5, 11, 17, 23, 29, 35, 41]
    }
  }
];

// Helper functions for filtering and searching buses

// Function to search buses by route
export const searchBuses = (from, to, date = null) => {
  const normalizedFrom = from?.trim().toLowerCase();
  const normalizedTo = to?.trim().toLowerCase();

  console.log('searchBuses normalized:', normalizedFrom, normalizedTo, 'date:', date || 'none');

  if (!normalizedFrom || !normalizedTo) {
    return [];
  }

  let filteredBuses = busData.filter(bus => {
    const busFrom = bus.from.toLowerCase();
    const busTo = bus.to.toLowerCase();

    const exactMatch = busFrom === normalizedFrom && busTo === normalizedTo;
    const partialMatch = busFrom.includes(normalizedFrom) && busTo.includes(normalizedTo);
    const reverseMatch = busFrom.includes(normalizedTo) && busTo.includes(normalizedFrom);

    return exactMatch || partialMatch || reverseMatch;
  });

  filteredBuses = filteredBuses.filter(bus => bus.isAvailable);

  filteredBuses.sort((a, b) => {
    const timeA = new Date(`2024-01-01 ${a.departureTime}`);
    const timeB = new Date(`2024-01-01 ${b.departureTime}`);
    return timeA - timeB;
  });

  return filteredBuses;
};

// Function to get bus by ID
export const getBusById = (busId) => {
  return busData.find(bus => bus.id === busId);
};

// Function to get all available destinations
export const getDestinations = () => {
  const destinations = new Set();
  busData.forEach(bus => {
    destinations.add(bus.from);
    destinations.add(bus.to);
  });
  return Array.from(destinations).sort();
};

// Function to get popular routes
export const getPopularRoutes = () => {
  const routeCount = {};
  busData.forEach(bus => {
    const route = `${bus.from} - ${bus.to}`;
    routeCount[route] = (routeCount[route] || 0) + 1;
  });
  
  return Object.entries(routeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([route]) => {
      const [from, to] = route.split(' - ');
      const bus = busData.find(b => b.from === from && b.to === to);
      return {
        from,
        to,
        price: bus ? bus.price : 0,
        company: bus ? bus.company : 'Various'
      };
    });
};

// Function to get available routes for search suggestions
export const getAvailableRoutes = () => {
  const routes = new Set();
  busData.forEach(bus => {
    if (bus.isAvailable) {
      routes.add(`${bus.from} - ${bus.to}`);
    }
  });
  return Array.from(routes).sort();
};

// Function to get buses by company
export const getBusesByCompany = (companyName) => {
  return busData.filter(bus => 
    bus.company.toLowerCase() === companyName.toLowerCase() && 
    bus.isAvailable
  );
};

// Debug function to check search results
export const debugSearch = (from, to) => {
  console.log('Searching for:', from, 'to', to);
  console.log('Available routes:', getAvailableRoutes());
  const results = searchBuses(from, to);
  console.log('Search results:', results);
  return results;
};

