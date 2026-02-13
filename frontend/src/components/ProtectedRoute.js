import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // If user data was passed from AuthCallback, skip check
    if (location.state?.user) {
      setChecked(true);
      return;
    }

    const verify = async () => {
      if (!loading) {
        if (!user) {
          navigate('/', { replace: true });
        } else if (requireAdmin && user.role !== 'admin') {
          navigate('/', { replace: true });
        } else {
          setChecked(true);
        }
      }
    };

    verify();
  }, [user, loading, requireAdmin, navigate, location.state]);

  if (loading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return children;
}
