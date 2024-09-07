import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { FaExternalLinkAlt, FaCogs } from 'react-icons/fa'; // Import icons

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/client', {
        headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients', error);
    }
  };

  const handleClientClick = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  // Open client in Axcient
  const openClientInAxcient = (clientId) => {
    const url = `https://my.axcient.net/home/client/${clientId}`;
    window.open(url, '_blank');
  };

  // Helper function to calculate device counts by category
  const calculateDeviceCounts = (devicesCounters) => {
    if (!devicesCounters) return { appliance: 0, d2c: 0, cloudArchive: 0, total: 0 };

    const appliance = devicesCounters.appliance_based
      ? devicesCounters.appliance_based.reduce((sum, device) => sum + device.count, 0)
      : 0;
    const d2c = devicesCounters.d2c
      ? devicesCounters.d2c.reduce((sum, device) => sum + device.count, 0)
      : 0;
    const cloudArchive = devicesCounters.cloud_archive
      ? devicesCounters.cloud_archive.reduce((sum, device) => sum + device.count, 0)
      : 0;

    const total = appliance + d2c + cloudArchive;

    return { appliance, d2c, cloudArchive, total };
  };

  // Group clients by health status and get counts
  const groupClientsByHealth = (clients) => {
    const troubled = clients.filter(client => client.health_status === 'TROUBLED');
    const warned = clients.filter(client => client.health_status === 'WARNED');
    const healthy = clients.filter(client => client.health_status === 'NORMAL');
    return { troubled, warned, healthy };
  };

  const { troubled, warned, healthy } = groupClientsByHealth(clients);

  return (
    <div className="container">
      <h1 className="title">Clients</h1>

      {/* Display client status counts horizontally with color-coded numbers */}
      <div className="client-status-counts">
        <div className="count-item">
          <p>Total Clients:</p>
          <span>{clients.length}</span>
        </div>
        <div className="count-item">
          <p>Troubled:</p>
          <span className="troubled">{troubled.length}</span>
        </div>
        <div className="count-item">
          <p>Warned:</p>
          <span className="warned">{warned.length}</span>
        </div>
        <div className="count-item">
          <p>Healthy:</p>
          <span className="healthy">{healthy.length}</span>
        </div>
      </div>

      {/* Troubled Clients */}
      {troubled.length > 0 && (
        <>
          <h2 className="section-title">Troubled Clients</h2>
          <div className="card-grid">
            {troubled.map((client) => {
              const { appliance, d2c, cloudArchive, total } = calculateDeviceCounts(client.devices_counters);
              return (
                <div key={client.id} className="card troubled">
                  <h2>{client.name}</h2>
                  <p>Health: {client.health_status}</p>
                  <p>Total Devices: {total}</p>
                  <p>Appliance: {appliance}</p>
                  <p>D2C: {d2c}</p>
                  <p>Cloud Archive: {cloudArchive}</p>

                  {/* Icon to open client in Axcient */}
                  <FaExternalLinkAlt
                    className="details-icon"
                    title="Open in Axcient"
                    onClick={() => openClientInAxcient(client.id)}
                  />

                  {/* Button to open the devices page */}
                  <button className="view-devices-button" onClick={() => handleClientClick(client.id)}>
                    <FaCogs /> View Devices
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Warned Clients */}
      {warned.length > 0 && (
        <>
          <h2 className="section-title">Warned Clients</h2>
          <div className="card-grid">
            {warned.map((client) => {
              const { appliance, d2c, cloudArchive, total } = calculateDeviceCounts(client.devices_counters);
              return (
                <div key={client.id} className="card warned">
                  <h2>{client.name}</h2>
                  <p>Health: {client.health_status}</p>
                  <p>Total Devices: {total}</p>
                  <p>Appliance: {appliance}</p>
                  <p>D2C: {d2c}</p>
                  <p>Cloud Archive: {cloudArchive}</p>

                  {/* Icon to open client in Axcient */}
                  <FaExternalLinkAlt
                    className="details-icon"
                    title="Open in Axcient"
                    onClick={() => openClientInAxcient(client.id)}
                  />

                  {/* Button to open the devices page */}
                  <button className="view-devices-button" onClick={() => handleClientClick(client.id)}>
                    <FaCogs /> View Devices
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Healthy Clients */}
      {healthy.length > 0 && (
        <>
          <h2 className="section-title">Healthy Clients</h2>
          <div className="card-grid">
            {healthy.map((client) => {
              const { appliance, d2c, cloudArchive, total } = calculateDeviceCounts(client.devices_counters);
              return (
                <div key={client.id} className="card healthy">
                  <h2>{client.name}</h2>
                  <p>Health: {client.health_status}</p>
                  <p>Total Devices: {total}</p>
                  <p>Appliance: {appliance}</p>
                  <p>D2C: {d2c}</p>
                  <p>Cloud Archive: {cloudArchive}</p>

                  {/* Icon to open client in Axcient */}
                  <FaExternalLinkAlt
                    className="details-icon"
                    title="Open in Axcient"
                    onClick={() => openClientInAxcient(client.id)}
                  />

                  {/* Button to open the devices page */}
                  <button className="view-devices-button" onClick={() => handleClientClick(client.id)}>
                    <FaCogs /> View Devices
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientList;
