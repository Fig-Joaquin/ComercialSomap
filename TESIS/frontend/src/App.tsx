import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSide from './pages/SignInSide';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Pedidos from './pages/Pedidos';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInSide />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Route>
        </Route>

        <Route path="/" element={<SignInSide />} />
      </Routes>
    </Router>
  );
}

export default App;