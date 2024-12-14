// src/App.jsx
import { Provider } from 'react-redux';
import store from './store';
import { RouterProvider } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Ensure AppRoutes is correctly exported
import { ErrorProvider } from './context/ErrorContext';

const App = () => {
  return (
    <Provider store={store}>
      <ErrorProvider>
        <div className="flex flex-col min-h-screen">
          <RouterProvider router={AppRoutes} /> {/* This should use RouterProvider correctly */}
        </div>
      </ErrorProvider>
    </Provider>
  );
};

export default App;
