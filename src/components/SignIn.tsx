import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

export const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const authResponse = signIn({ email: email, password: password });
    authResponse.then((response) => {
      if (response.error) {
        setError(response.error.message);
      } else {
        navigate("/");
      }
    });
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-gray-400">
        <div>
          <label htmlFor="email" className="block mb-2 font-medium"> User </label>
          <input
            type="email"
            id="email"
            required
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-gray/10 bg-transparent p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-medium"> Password </label>
          <input
            type="password"
            id="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-gray/10 bg-transparent p-2 rounded"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Sign In
          </button>
        </div>
      </form>
      <div className="text-center text-gray-400 m-5">
        New to Share It? <Link to="/signup" className="underline text-blue-500">Create an account</Link>
      </div>
      {error && <p className="text-red-500"> Error sign in: { error } </p>}
    </div>
  );
};