import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const { signUp } = useAuth();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const authResponse = signUp({ user: email, password: password });
    authResponse.then((response) => {
      if (response.error) {
        setError(response.error.message);
      } else {
        // Check if the user got created
        if (response.data && 
          response.data.user && 
          response.data.user.identities && 
          response.data.user.identities?.length > 0) {
            // Success
            setIsSignUp(true);
            setError("");
        } else {
          setError("Failed to sign up.");
        }
      }
    });
  };

  return (
    <div className="mt-6">
      { isSignUp ? (
        <div className="text-center text-3xl font-bold text-blue-500">
          Please review your email to confirm your signup. Enjoy the app!
        </div>
      ) : (
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Sign Up
          </button>
          {error && <p className="text-red-500"> Error sign up: { error } </p>}
        </form>
      )}
    </div>
  );
};