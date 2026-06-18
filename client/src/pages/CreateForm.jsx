import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createForm = async () => {
    if (!title) {
      alert("Form title is required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/forms", {
        title,
        fields: [],
        prompt // optional, stored if you want
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
        }
      );

      // redirect to preview/editor
      navigate(`/preview/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create New Form
        </h2>

        <input
          type="text"
          placeholder="Form Title"
          className="w-full mb-4 px-4 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe your form (AI prompt – optional)"
          className="w-full mb-4 px-4 py-2 rounded h-32"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={createForm}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {loading ? "Creating..." : "Create Form"}
        </button>
      </div>
    </div>
  );
}
