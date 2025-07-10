// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const LoginPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const url = isLogin
//       ? 'http://localhost:8084/api/auth/login'
//       : 'http://localhost:8084/api/auth/register';


//     try {
//       console.log({username,password});
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.text();
//       console.log(data)
//       if (response.ok) {
//         if (isLogin) {
//           navigate('/location'); // after successful login
//         } else {
//           alert('Registered successfully! Please log in.');
//           setIsLogin(true);
//         }
//       } else {
//         alert(data || 'Request failed');
//       }
//     } catch (err) {
//       alert('Server error');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
//       <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
//         <div className="mb-3">
//           <label htmlFor="username" className="form-label">Username</label>
//           <input
//             type="text"
//             className="form-control"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="password" className="form-label">Password</label>
//           <input
//             type="password"
//             className="form-control"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary w-100 mb-2">
//           {isLogin ? 'Sign In' : 'Sign Up'}
//         </button>
//         <div className="text-center">
//           <button
//             type="button"
//             className="btn btn-link"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = ({ onLogin }) => { // Accept onLogin prop
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? 'http://localhost:8084/api/auth/login'
      : 'http://localhost:8084/api/auth/register';


    try {
      console.log({username,password});
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text();
      console.log(data)
      if (response.ok) {
        if (isLogin) {
          onLogin(username); // Call onLogin with the username
          navigate('/location'); // after successful login
        } else {
          alert('Registered successfully! Please log in.');
          setIsLogin(true);
        }
      } else {
        alert(data || 'Request failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-2">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        <div className="text-center">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default LoginPage;