// src/context/ErrorContext.js
import React, { createContext, useState, useContext } from 'react';

const ErrorContext = createContext();

export const useErrorContext = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <ErrorContext.Provider value={{ error, handleError }}>
      {children}
      {error && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      )}
    </ErrorContext.Provider>
  );
};
