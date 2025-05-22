import './AdminResourceManagement.css';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminAddResource() {

  const [formData, setFormData] = useState({ 
    type: '', 
    total: '', 
    available: '' 
  });
  const [showAddModal, setShowAddModal] = useState(true); // Modal shown by default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitAdd = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError("");
        setSuccess("");
    try {
      const response = await fetch('http://localhost:5000/auth/add-resource', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add resource");
      }

      toast.success("Resource added successfully!");
        setTimeout(() => {
            navigate("/admin/resources");
        }, 2000);

    } catch (error) {
      console.error("Add error:", error.message);
      alert("Error adding resource: " + error.message);
    }
  };


  // if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
        <>
        {showAddModal && (
        <div className="u-modal-overlay">
          <div className="u-modal">
            <div className='u-head'>
            <h2>Add New Resource</h2>
            <button onClick={() => setShowAddModal(false)} className="wrong">
                <X size={25} />
            </button>
            </div>

            <form onSubmit={handleSubmitAdd}>
              <div className="u-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Total:</label>
                <input
                  name="total" 
                  value={formData.total}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="u-form-group">
                <label>Available:</label>
                <input
                  name="available" 
                  value={formData.available}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="u-modal-btns">
                <button type="submit" className="u-s-btn" >Save</button>
                <button type="button" className="u-c-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
        )}
     </>
     );
 };



