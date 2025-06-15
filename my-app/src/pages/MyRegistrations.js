import React, { useEffect, useState } from 'react';
import { eventAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../Styles/MyRegistrations.css';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await eventAPI.getMyRegistrations();
      setRegistrations(response.data.registrations || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your registrations.');
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setCancelingId(registrationId);
    try {
      await eventAPI.cancelRegistration(registrationId);
      await fetchRegistrations();
    } catch (err) {
      setError('Failed to cancel registration.');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="my-registrations-bg">
      <Navbar />
      <div style={{ maxWidth: 900, margin: '2.5rem auto 0 auto', padding: '0 1rem' }}>
        <h2 className="my-registrations-title">My Event Registrations</h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <div className="my-registrations-empty-icon">⏳</div>
          </div>
        ) : error ? (
          <div className="my-registrations-empty">
            <span className="my-registrations-empty-icon">❌</span>
            {error}
          </div>
        ) : registrations.length === 0 ? (
          <div className="my-registrations-empty">
            <span className="my-registrations-empty-icon">📭</span>
            You have not registered for any events yet.
          </div>
        ) : (
          <div className="my-registrations-grid">
            {registrations.map((reg) => (
              <div className="my-registration-card" key={reg._id}>
                <img
                  className="my-registration-image"
                  src={reg.eventId?.image || '/default-event.jpg'}
                  alt={reg.eventId?.name}
                />
                <div className="my-registration-content">
                  <div>
                    <div className="my-registration-name">{reg.eventId?.name}</div>
                    <div className="my-registration-desc">{reg.eventId?.description}</div>
                    <div className="my-registration-info">
                      <strong>Date:</strong> {reg.eventId?.date ? new Date(reg.eventId.date).toLocaleDateString() : ''}<br />
                      <strong>Location:</strong> {reg.eventId?.location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: '0.7rem' }}>
                    <span className="my-registration-badge">Registered</span>
                    <button
                      className="cancel-btn"
                      style={{ padding: '0.35rem 1.1rem', borderRadius: 8, border: 'none', background: '#e57373', color: '#fff', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                      onClick={() => handleCancel(reg._id)}
                      disabled={cancelingId === reg._id}
                    >
                      {cancelingId === reg._id ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations; 