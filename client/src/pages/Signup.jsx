import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password
      });

      alert("✅ Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError("User already exists or invalid data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-200 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={signup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-white text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
