import React, { useState, useEffect } from 'react';
import { useJwt } from '../providers/JwtProvider';
import Loading from '../components/Loading';
import { useNavigate, Link } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';

interface AuthProps {
  isRegistering: boolean;
}

interface ValidationErrors {
  email: string;
  password: string;
}

const Auth: React.FC<AuthProps> = ({ isRegistering }) => {
  const { register, login } = useJwt();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({ email: '', password: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && password.length <= 32;
  };

  useEffect(() => {
    if (!isRegistering && !isSubmitted) return;

    const emailError = email 
      ? validateEmail(email) ? '' : 'Please enter a valid email address'
      : '';
    const passwordError = password
      ? validatePassword(password) ? '' : 'Password must be between 8 and 32 characters'
      : '';

    setValidationErrors({ email: emailError, password: passwordError });
  }, [email, password, isRegistering, isSubmitted]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    
    const emailError = validateEmail(email) ? '' : 'Please enter a valid email address';
    const passwordError = validatePassword(password) ? '' : 'Password must be between 8 and 32 characters';
    
    setValidationErrors({ email: emailError, password: passwordError });
    
    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      isRegistering ? await register(email, password) : await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setError(null)
    setEmail('');
    setPassword('');
    setValidationErrors({ email: '', password: '' });
    setIsSubmitted(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900"> 
      <form onSubmit={handleSubmit} className="flex flex-col bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center text-orange-400">{isRegistering ? 'Register' : 'Login'}</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <FormField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={validationErrors.email}
          showError={isRegistering || isSubmitted}
        />

        <FormField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={validationErrors.password}
          showError={isRegistering || isSubmitted}
        />

        <Button 
          type="submit" 
          disabled={(isRegistering || isSubmitted) && (!!validationErrors.email || !!validationErrors.password)}
          fullWidth
        >
          {isRegistering ? 'Register' : 'Login'}
        </Button>
        <p className="mt-4 text-center text-gray-300">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <Link
            to={isRegistering ? "/auth/login" : "/auth/register"} 
            className="text-orange-400 ml-1" 
            onClick={handleToggle} 
          >
            {isRegistering ? 'Login' : 'Register'}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Auth;