import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const VaultsPage = () => {
  const [vaults, setVaults] = useState([]); // Store the list of vaults
  const [selectedVault, setSelectedVault] = useState(null); // Store selected vault details
  const [devices, setDevices] = useState([]); // Store devices for the selected vault

  useEffect(() => {
    fetchVaults();
  }, []);

  // Fetch all vaults without devices using display_devices=false
  const fetchVaults = async () => {
    try {
      const response = await axios.get('/api/vault?display_devices=false', {
        headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
      });
      setVaults(response.data); // Set the vaults data from the response
    } catch (error) {
      console.error('Error fetching vaults', error);
    }
  };

  // Fetch devices for the selected vault using the vault id
  const fetchVaultDevices = async (vaultId) => {
    try {
      const response = await axios.get(`/api/vault/${vaultId}`, {
        headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
      });
      setSelectedVault(vaultId); // Mark the selected vault
      setDevices(response.data.devices); // Set the devices of the selected vault
    } catch (error) {
      console.error('Error fetching vault devices', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Vaults</h1>

      {/* Card Grid for Vaults */}
      <div className="card-grid">
        {vaults.map((vault) => (
          <div key={vault.id} className={`card vault`} onClick={() => fetchVaultDevices(vault.id)}>
            <h2>{vault.name} ({vault.type})</h2>
            <p>IP Address: {vault.ip_address}</p>
            <p>Health: {vault.health_status} ({vault.health_status_reason})</p>
            <p>Model: {vault.model.name}</p>
            <p>Software Version: {vault.software_version.version}</p>
            <p>Tunnel Status: {vault.tunnel_status}</p>
            <p>Last Tunnel Up: {vault.last_tunnel_up}</p>
            <p>Storage: {Math.round(vault.storage_details.used_size / 1024 / 1024)} MB used of {Math.round(vault.storage_details.drive_size / 1024 / 1024)} MB</p>
          </div>
        ))}
      </div>

      {/* Show devices for the selected vault */}
      {selectedVault && (
        <>
          <h2 className="section-title">Devices for Vault {selectedVault}</h2>
          <div className="card-grid">
            {devices.map((device) => (
              <div key={device.id} className="card device">
                <h2>{device.name}</h2>
                <p>Type: {device.type}</p>
                <p>Client: {device.client.name}</p>
                <p>IP Address: {device.ip_address}</p>
                <p>OS: {device.os}</p>
                <p>Local Usage: {Math.round(device.local_usage / 1024 / 1024)} MB</p>
                <p>Vault Usage: {Math.round(device.vault_usage / 1024 / 1024)} MB</p>
                <p>Bytes Replicated: {Math.round(device.bytes_replicated / 1024)} KB</p>
                <p>Latest Vault RP: {device.latest_vault_rp}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VaultsPage;
