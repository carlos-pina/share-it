import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const authResponse = signIn({ user: email, password: password });
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
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 font-medium"> User </label>
          <input
            type="email"
            id="email"
            required
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-medium"> Password </label>
          <input
            type="password"
            id="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">
            Sign In
        </button>
        {error && <p className="text-red-500"> Error sign in: { error } </p>}
      </form>
    </div>
  );
};