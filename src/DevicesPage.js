import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Tab styling

const DevicesPage = () => {
  const { clientId } = useParams();
  const [devices, setDevices] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [clientName, setClientName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async (clientId) => {
      try {
        const clientResponse = await axios.get(`/api/client/${clientId}`, {
          headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
        });

        setClientName(clientResponse.data?.name || 'Unknown Client');

        const devicesResponse = await axios.get(`/api/client/${clientId}/device`, {
          headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
        });
        const appliancesResponse = await axios.get(`/api/client/${clientId}/appliance`, {
          headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
        });

        // Sort devices: "Troubled" at the top, "Parked" at the bottom
        const sortedDevices = sortDevices(devicesResponse.data || []);
        setDevices(sortedDevices);

        setAppliances(appliancesResponse.data || []);
      } catch (error) {
        console.error('Error fetching client data', error);
      }
    };

    fetchClientData(clientId);
  }, [clientId]);

  const sortDevices = (devices) => {
    const troubled = devices.filter((device) => device.current_health_status?.status === 'TROUBLED');
    const normal = devices.filter((device) => device.current_health_status?.status === 'NORMAL');
    const warned = devices.filter((device) => device.current_health_status?.status === 'WARNED');
    const parked = devices.filter((device) => device.current_health_status?.status === 'PARKED');

    // Concatenate arrays to maintain the desired order: troubled, normal, warned, parked
    return [...troubled, ...normal, ...warned, ...parked];
  };

  const handleDeviceClick = (deviceUrl) => {
    window.open(deviceUrl, '_blank');
  };

  const handleThumbnailClick = (screenshotUrl) => {
    window.open(screenshotUrl, '_blank');
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back to Clients</button>
      <h1 className="title">Devices and Appliances for {clientName}</h1>

      {/* Tab navigation for devices and appliances */}
      <Tabs>
        <TabList>
          <Tab>Devices</Tab>
          <Tab>Appliances</Tab>
        </TabList>

        {/* Devices Tab */}
        <TabPanel>
          {devices.length > 0 ? (
            <div className="card-grid">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`card ${device.current_health_status?.status?.toLowerCase() || 'unknown'}`}
                >
                  <h2>{device.name || 'Unknown Device'}</h2>
                  <p>Type: {device.type || 'N/A'}</p>
                  <p>IP Address: {device.ip_address || 'N/A'}</p>
                  <p>OS: {device.os?.os_name || 'N/A'}</p>
                  <p>Health: {device.current_health_status?.status || 'N/A'}</p>
                  <p>Latest Local RP: {device.latest_local_rp || 'N/A'}</p>

                  {/* Thumbnail and external link */}
                  {device.latest_autoverify_details?.screenshot_thumbnail_url && (
                    <div className="thumbnail-container">
                      <img
                        src={device.latest_autoverify_details.screenshot_thumbnail_url}
                        alt="Device Screenshot Thumbnail"
                        className="thumbnail"
                        onClick={() => handleThumbnailClick(device.latest_autoverify_details.screenshot_url)}
                      />
                      <p>Click to view full screenshot</p>
                    </div>
                  )}

                  {/* Device details icon */}
                  <FaExternalLinkAlt
                    className="details-icon"
                    onClick={() => handleDeviceClick(device.device_details_page_url)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No devices found.</p>
          )}
        </TabPanel>

        {/* Appliances Tab */}
        <TabPanel>
          {appliances.length > 0 ? (
            <div className="card-grid">
              {appliances.map((appliance) => (
                <div key={appliance.id} className="card appliance">
                  <h2>{appliance.alias || 'Unknown Appliance'} ({appliance.product || 'Unknown Product'})</h2>
                  <p>IP Address: {appliance.ip_address || 'N/A'}</p>
                  <p>Service Type: {appliance.service_type || 'N/A'}</p>
                  <p>Health: {appliance.health_status || 'N/A'} ({appliance.health_status_reason || 'N/A'})</p>
                  <p>Model: {appliance.model?.name || 'N/A'}</p>
                  <p>Software Version: {appliance.software_version?.version || 'N/A'}</p>
                  <p>Tunnel Status: {appliance.tunnel_status || 'N/A'}</p>
                  <p>Last Tunnel Up: {appliance.last_tunnel_up || 'N/A'}</p>
                  <p>Storage: {Math.round(appliance.storage_details?.used_size / 1024 / 1024) || 0} MB used of {Math.round(appliance.storage_details?.drive_size / 1024 / 1024) || 0} MB</p>

                  {/* Associated devices for each appliance */}
                  <h3>Associated Devices</h3>
                  {appliance.devices.length > 0 ? (
                    <div className="card-grid">
                      {appliance.devices.map((device) => (
                        <div key={device.id} className="card device">
                          <h4>{device.name}</h4>
                          <p>Type: {device.type}</p>
                          <p>IP Address: {device.ip_address}</p>
                          <p>OS: {device.os}</p>
                          <p>Local Usage: {Math.round(device.local_usage / 1024 / 1024)} MB</p>
                          <p>Latest Local RP: {device.latest_local_rp || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No devices associated with this appliance.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No appliances found.</p>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DevicesPage;
