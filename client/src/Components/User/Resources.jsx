import { useEffect, useState } from 'react';
import {  X, AlertCircle } from 'lucide-react';
import './Resources.css';

const Resources = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleDropup = () => {
    if (!isOpen) {
      fetchResources();
    }
    setIsOpen(!isOpen);
  };

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/auth/resources');
      const data = await response.json();
      
      if (data.success) {
        setResources(Array.isArray(data.resources) ? data.resources : [data.resources]);
      } else {
        setError(data.message || 'Failed to fetch resources');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchResources();
  },[])


  return (
    <div className="resource-button-container">
      <button className="user-resource-button" onClick={toggleDropup}>
        Resources
      </button>

      {isOpen && (
        <div className="resource-dropup">
          <div className="resource-dropup-header">
            <h3>Hospital Resources</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close resources panel"
            >
              <X size={16}/>
            </button>
          </div>

          {loading && (
            <div className="resource-loading">Loading resources...</div>
          )}

          {error && (
            <div className="resource-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {resources.length > 0 && !loading && (
            <div className="resource-content">
              {resources.map((resource, index) => {
                return (
                  <div className="resource-item" key={resource.type && index}>
                    <div className="resource-header">
                      <div className="resource-label">
                        {/* <Activity size={16} /> */}
                        <span>{(resource.type)}</span>
                      </div>
                      <span className="resource-count">
                        {resource.available} / {resource.total} available
                      </span>
                    </div>
                  </div>
                );
              })}
              
            </div>
          )}

          {resources.length === 0 && !loading && !error && (
            <div className="resource-empty">No resource data available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Resources;