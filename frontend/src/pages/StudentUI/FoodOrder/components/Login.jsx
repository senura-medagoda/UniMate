import React from 'react';
import { useAppContext } from '../components/context/context.jsx';

const Login = () => {
  const { setshowUserLogin } = useAppContext();

  // Optional: Close form when the "Close" button is clicked
  const closeLogin = () => setshowUserLogin(false);
  

  return (
    <div>
      <button onClick={closeLogin} className="absolute top-5 right-5">Close</button>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full sm:w-[350px] text-center border border-zinc-300 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-zinc-900 text-3xl mt-10 font-medium">Login</h1>
        <p className="text-zinc-500 text-sm mt-2 pb-6">
          Please sign in to continue
        </p>

        <div className="flex items-center w-full mt-4 bg-white border border-zinc-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-zinc-600 placeholder-zinc-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-zinc-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-zinc-600 placeholder-zinc-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity">
          Login
        </button>

        <p className="text-zinc-500 text-sm mt-3 mb-11">
          Don't have an account?{' '}
          <button type="button" className="text-indigo-500">
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
