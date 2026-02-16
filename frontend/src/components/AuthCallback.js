import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    // Use ref to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          toast.error('Error de autenticación');
          navigate('/');
          return;
        }

        // Exchange session_id for user data
        const response = await apiClient.post('/auth/session', {
          session_id: sessionId
        });

         // Store token in sessionStorage for fallback
        if (response.data.session_token) {
          sessionStorage.setItem('session_token', response.data.session_token);
        }
        
        updateUser(response.data);
        toast.success(`¡Bienvenido, ${response.data.name}!`);
        
        // Clear the hash and redirect
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/');
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Error al iniciar sesión');
        navigate('/');
      }
    };

    processSession();
  }, [navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Iniciando sesión...</p>
      </div>
    </div>
  );
}
