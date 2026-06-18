import api from "../lib/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default function Responses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get(`/responses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setResponses(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch responses error:", err);
        setLoading(false);
      });
  }, [id, token, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading responses...</p>;
  }

  if (responses.length === 0) {
    return <p className="text-center mt-10">No responses yet.</p>;
  }

  // ✅ BUILD COLUMNS SAFELY FROM ALL RESPONSES
  const columns = Array.from(
    new Set(
      responses.flatMap((r) =>
        r?.data ? Object.keys(r.data) : []
      )
    )
  );

  if (columns.length === 0) {
    return (
      <p className="text-center mt-10 text-red-600">
        Responses exist but contain no data.
        <br />
        (Old empty submissions detected)
      </p>
    );
  }

  // CSV DOWNLOAD
  const downloadCSV = () => {
    const csv = [
      columns.join(","),
      ...responses.map((r) =>
        columns
          .map((c) => `"${r.data?.[c] ?? ""}"`)
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "responses.csv";
    a.click();
  };

  // PDF DOWNLOAD
  const downloadPDF = () => {
  const doc = new jsPDF("landscape");

  doc.text("Form Responses", 14, 12);

  autoTable(doc, {
    head: [columns],
    body: responses.map((r) =>
      columns.map((c) => r.data?.[c] ?? "")
    ),
    startY: 20,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 101, 216] }, // blue header
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  doc.save("responses.pdf");
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Responses</h1>

        <div className="space-x-2">
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>

          <button
            onClick={downloadPDF}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border px-4 py-2 text-left whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {responses.map((r, i) => (
              <tr key={i} className="odd:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="border px-4 py-2 whitespace-nowrap"
                  >
                    {r.data?.[col] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
