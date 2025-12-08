import React, { useState } from 'react';
import { UserPlus, Edit } from 'lucide-react';

const ClientsManagement = ({ api, isRTL, clients: initialClients }) => {
  const [clients, setClients] = useState(initialClients || []);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
      const res = await api('/users?role=client&limit=100');
      setClients(res.users || []);
    } catch (error) {
      console.error('Fetch clients error:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  return (
    <div className="clients-management">
      <div className="management-header">
        <h3>{isRTL ? 'ניהול לקוחות' : 'Client Management'}</h3>
        <button className="btn btn-primary" onClick={handleAdd}>
          <UserPlus size={18} aria-hidden="true" />
          <span className="btn-text">{isRTL ? 'לקוח חדש' : 'New Client'}</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="table-container desktop-only">
        <table className="data-table" aria-label={isRTL ? 'טבלת לקוחות' : 'Clients table'}>
          <thead>
            <tr>
              <th scope="col">{isRTL ? 'שם' : 'Name'}</th>
              <th scope="col">{isRTL ? 'חברה' : 'Company'}</th>
              <th scope="col">{isRTL ? 'חבילה' : 'Package'}</th>
              <th scope="col">{isRTL ? 'לידים החודש' : 'Leads This Month'}</th>
              <th scope="col">{isRTL ? 'סטטוס' : 'Status'}</th>
              <th scope="col">{isRTL ? 'פעולות' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.company_name || '-'}</td>
                <td>{client.package_type}</td>
                <td>{client.leads_received_this_month} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}</td>
                <td>
                  <span className={`status-badge ${client.is_active ? 'active' : 'inactive'}`}>
                    {client.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(client)}
                      aria-label={isRTL ? `ערוך ${client.name}` : `Edit ${client.name}`}
                    >
                      <Edit size={16} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards mobile-only" role="list" aria-label={isRTL ? 'רשימת לקוחות' : 'Clients list'}>
        {clients.map(client => (
          <article key={client.id} className="client-card" role="listitem">
            <div className="client-card-header">
              <div className="client-avatar" aria-hidden="true">{client.name?.charAt(0) || 'C'}</div>
              <div className="client-info">
                <h4>{client.name}</h4>
                <span className="client-company">{client.company_name || '-'}</span>
              </div>
              <span className={`status-badge ${client.is_active ? 'active' : 'inactive'}`}>
                {client.is_active ? (isRTL ? 'פעיל' : 'Active') : (isRTL ? 'לא פעיל' : 'Inactive')}
              </span>
            </div>
            <div className="client-card-body">
              <div className="client-stat">
                <span className="stat-label">{isRTL ? 'חבילה' : 'Package'}</span>
                <span className="stat-value">{client.package_type}</span>
              </div>
              <div className="client-stat">
                <span className="stat-label">{isRTL ? 'לידים החודש' : 'Leads'}</span>
                <span className="stat-value">{client.leads_received_this_month} / {client.monthly_lead_limit === -1 ? '∞' : client.monthly_lead_limit}</span>
              </div>
            </div>
            <div className="client-card-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(client)}>
                <Edit size={14} aria-hidden="true" />
                {isRTL ? 'עריכה' : 'Edit'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ClientsManagement;
