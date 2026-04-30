import React, { createContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      home: 'Home', login: 'Login', booking: 'Booking',
      notifications: 'Notifications', about: 'About Us',
      help: 'Help', profile: 'Profile', logout: 'Logout'
    },
    home: {
      title: 'Welcome to Clary Express Ticketing System',
      subtitle: 'Your trusted travel partner in the country',
      fromPlaceholder: 'From (e.g. Kigali)',
      toPlaceholder: 'To (e.g. Musanze)',
      datePlaceholder: 'Departure Date',
      searchButton: 'Search Trips',
      noTrips: 'No trips found',
      availableBuses: 'Available Buses',
      availableBusesDescription: 'Browse our available buses for your journey',
      quickActions: 'Quick Routes',
      popularRoutes: 'Popular Routes',
      popularRoutesDescription: 'Most booked routes across the country'
    },
    footer: {
      about: 'About Us', help: 'Help', privacy: 'Privacy Policy',
      terms: 'Terms of Service', contact: 'Contact', rights: 'All rights reserved'
    }
  },
  rw: {
    nav: {
      home: 'Ahabanza', login: 'Injira', booking: 'Ibyo ushaka',
      notifications: 'Amakuru', about: 'Ibyacu',
      help: 'Ubufasha', profile: 'Profaile', logout: 'Sohoka'
    },
    home: {
      title: 'Murakaza neza kuri Clary Express Ticketing System',
      subtitle: 'Umugenzwe wanyu wihariye mu igihugu',
      fromPlaceholder: 'Uvuye (urugero: Kigali)',
      toPlaceholder: 'Ujya (urugero: Musanze)',
      datePlaceholder: 'Itariki yo kuva',
      searchButton: 'Shakisha ingendo',
      noTrips: 'Nta nzego zibonetse',
      availableBuses: 'Inyunguti zihariye',
      availableBusesDescription: 'Pembera inyunguti zihariye kuri urugendo',
      quickActions: 'Inzira Zikunzwe',
      popularRoutes: 'Inzira Zikunzwe',
      popularRoutesDescription: 'Inzira nyinshi zakorewe mu gihugu'
    },
    footer: {
      about: 'Ibyacu', help: 'Ubufasha', privacy: 'Politiki yibanga',
      terms: 'Amabwirizanya', contact: 'Twandikire', rights: 'Uburenganzira bwose burarinzwe'
    }
  },
  fr: {
    nav: {
      home: 'Accueil', login: 'Connexion', booking: 'Réservation',
      notifications: 'Notifications', about: 'À propos',
      help: 'Aide', profile: 'Profil', logout: 'Déconnexion'
    },
    home: {
      title: 'Bienvenue chez Clary Express Ticketing System',
      subtitle: 'Votre partenaire de confiance dans le pays',
      fromPlaceholder: 'De (ex: Kigali)',
      toPlaceholder: 'À (ex: Musanze)',
      datePlaceholder: 'Date de départ',
      searchButton: 'Rechercher les voyages',
      noTrips: 'Aucun voyage trouvé',
      availableBuses: 'Bus Disponibles',
      availableBusesDescription: 'Parcourez nos bus disponibles pour votre voyage',
      quickActions: 'Itinéraires Rapides',
      popularRoutes: 'Itinéraires Populaires',
      popularRoutesDescription: 'Les itinéraires les plus réservés dans le pays'
    },
    footer: {
      about: 'À propos', help: 'Aide', privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation", contact: 'Contact', rights: 'Tous droits réservés'
    }
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => { localStorage.setItem('language', language); }, [language]);

  const changeLanguage = (lang) => setLanguage(lang);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) { value = value?.[k]; }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
