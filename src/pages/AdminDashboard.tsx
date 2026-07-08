import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileCheck, FileX, CreditCard, Search } from 'lucide-react';
import { jsPDF } from 'jspdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

function AdminOverview({ stats }: { stats: any }) {
  if (!stats) return <div className="text-slate-500 text-center mt-12">Chargement...</div>;

  return (
    <div className="space-y-8 flex-1">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Étudiants</p>
            <h3 className="text-slate-900 text-2xl font-black">{stats.students}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Dossiers Validés</p>
            <h3 className="text-slate-900 text-2xl font-black">{stats.appStats.find((s:any)=>s.status==='Validé')?.count || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FileX className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">En Attente</p>
            <h3 className="text-slate-900 text-2xl font-black">{stats.appStats.find((s:any)=>s.status==='En attente')?.count || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Paiements (FCFA)</p>
            <h3 className="text-slate-900 text-2xl font-black">{(stats.totalPayments).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h4 className="text-lg font-bold text-slate-900 mb-6 shrink-0">Répartition par Filière</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.charts.fieldsDist} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {stats.charts.fieldsDist.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h4 className="text-lg font-bold text-slate-900 mb-6 shrink-0">Inscriptions par mois</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.registrationsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationManagement() {
  const [apps, setApps] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchApps = () => {
    fetch('/api/admin/applications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(setApps);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/applications/${id}/status`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    fetchApps();
  };

  const generatePDFList = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Liste des Candidatures', 14, 20);
    doc.setFontSize(10);
    
    let y = 30;
    apps.forEach((app, i) => {
      doc.text(`${i+1}. ${app.first_name} ${app.last_name} - ${app.field_name} (${app.status})`, 14, y);
      y += 10;
    });
    doc.save('Candidatures.pdf');
  };

  const filteredApps = apps.filter(a => 
    a.first_name.toLowerCase().includes(search.toLowerCase()) ||
    a.last_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h3 className="text-xl font-bold text-slate-900">Gestion des Candidatures</h3>
        <button onClick={generatePDFList} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition-colors">
          Exporter en PDF
        </button>
      </div>

      <div className="relative mb-8 shrink-0">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Rechercher un candidat..." 
          className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full md:w-1/3 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 uppercase tracking-wider text-xs">
              <th className="pb-4 font-bold">Candidat</th>
              <th className="pb-4 font-bold">Filière</th>
              <th className="pb-4 font-bold">Date</th>
              <th className="pb-4 font-bold">Statut</th>
              <th className="pb-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredApps.map(app => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 pr-4">
                  <div className="font-bold text-slate-900">{app.first_name} {app.last_name}</div>
                  <div className="text-slate-400 text-xs">{app.email}</div>
                </td>
                <td className="py-4 pr-4">
                  <span className="font-bold text-slate-700">{app.field_name}</span> 
                  <span className="text-slate-400 text-xs ml-1">({app.level_name})</span>
                </td>
                <td className="py-4 pr-4 text-slate-500 font-medium">{new Date(app.created_at.replace(' ', 'T')).toLocaleDateString('fr-FR')}</td>
                <td className="py-4 pr-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Validé' ? 'bg-emerald-100 text-emerald-700' :
                    app.status === 'Refusé' ? 'bg-red-100 text-red-700' :
                    app.status === 'En attente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <select 
                    value={app.status} 
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="border border-slate-200 rounded-lg text-sm p-2 bg-white cursor-pointer font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Soumis">Soumis</option>
                    <option value="En attente">En attente</option>
                    <option value="Validé">Validé</option>
                    <option value="Refusé">Refusé</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(setStats);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<AdminOverview stats={stats} />} />
      <Route path="/applications" element={<ApplicationManagement />} />
      {/* Other routes can be added quickly following the same pattern */}
      <Route path="*" element={<div className="p-8 text-gray-500 text-center">Module en cours de développement</div>} />
    </Routes>
  );
}
