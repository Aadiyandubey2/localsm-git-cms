import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicApp from './PublicApp';
import AdminApp from './admin/AdminApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </Router>
  );
}

export default App;
