import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, FileText, Download, CreditCard, Bell } from 'lucide-react';
import { jsPDF } from 'jspdf';

function StudentOverview({ data }: { data: any }) {
  const currentApp = data.applications[0];
  const paid = data.payments.length > 0;
  
  const steps = ['Brouillon', 'Soumis', 'En attente', 'Validé'];
  const currentStepIndex = currentApp ? (steps.indexOf(currentApp.status) >= 0 ? steps.indexOf(currentApp.status) : 0) : -1;
  const progressPercent = currentApp ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <>
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Statut du Dossier</p>
            <p className="text-blue-600 text-lg font-bold">{currentApp ? currentApp.status : 'Aucun dossier'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Paiement Frais</p>
            {paid ? (
               <p className="text-slate-900 text-lg font-bold underline">Reçu #{data.payments[0].receipt_number}</p>
            ) : (
               <p className="text-slate-900 text-lg font-bold">Non payé</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Dossier</p>
            <p className="text-slate-900 text-lg font-bold">{currentApp ? 'Complet' : 'À compléter'}</p>
          </div>
        </div>
      </div>

      {/* Main Progress and Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 mt-8">
        {/* Left: Progress Stepper */}
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h3 className="text-xl font-bold text-slate-900">Progression de l'inscription</h3>
            <span className="px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{Math.round(progressPercent)}% Complété</span>
          </div>
          
          <div className="flex-1 space-y-10">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-bold text-slate-900">Création de compte & Profil</p>
                <p className="text-sm text-slate-400">Validé</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${currentStepIndex >= 1 ? 'bg-emerald-500 text-white' : (currentStepIndex === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400')}`}>
                 {currentStepIndex >= 1 ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm">2</span>}
              </div>
              <div className="flex-1 pt-1">
                <p className={`font-bold ${currentStepIndex >= 1 ? 'text-slate-900' : (currentStepIndex === 0 ? 'text-blue-600' : 'text-slate-400')}`}>Soumission des pièces justificatives</p>
                <p className={`text-sm ${currentStepIndex >= 1 ? 'text-slate-400' : 'text-slate-300'}`}>{currentStepIndex >= 1 ? "Documents reçus et en cours d'examen" : "En attente"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${currentStepIndex >= 3 ? 'bg-emerald-500 text-white' : (currentStepIndex === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400')}`}>
                 {currentStepIndex >= 3 ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm">3</span>}
              </div>
              <div className="flex-1 pt-1">
                <p className={`font-bold ${currentStepIndex >= 3 ? 'text-slate-900' : (currentStepIndex === 2 ? 'text-blue-600' : 'text-slate-400')}`}>Validation Pédagogique</p>
                <p className={`text-sm ${currentStepIndex >= 3 ? 'text-slate-400' : 'text-slate-300'}`}>{currentStepIndex === 2 ? "En cours de traitement par le secrétariat" : "En attente"}</p>
              </div>
            </div>
          </div>
          {!currentApp && (
             <a href="/student/dossier" className="mt-8 text-center block w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors shrink-0">
               Compléter mon dossier maintenant
             </a>
          )}
        </div>

        {/* Right: Activity & Docs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl flex-1 flex flex-col">
            <h4 className="text-lg font-bold mb-4">Notifications Récentes</h4>
            <div className="space-y-4">
              {data.notifications.length === 0 && <p className="text-slate-400 text-sm">Aucune notification</p>}
              {data.notifications.map((n: any) => (
                <div key={n.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Alerte</span>
                    <span className="text-xs text-slate-500">{new Date(n.created_at.replace(' ', 'T')).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-sm text-slate-200">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          {currentApp && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Détails du Cursus</h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-400">Filière</span>
                  <span className="font-bold">{currentApp.field_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-400">Niveau</span>
                  <span className="font-bold">{currentApp.level_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-400">Année Académique</span>
                  <span className="font-bold">{currentApp.academic_year}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ApplicationForm({ applications }: { applications: any[] }) {
  const [refs, setRefs] = useState<any>({ fields: [], levels: [], academicYears: [] });
  const [loading, setLoading] = useState(false);
  const existing = applications?.[0];
  
  useEffect(() => {
    fetch('/api/referentials').then(r => r.json()).then(setRefs);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/student/application', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (res.ok) {
        alert('Dossier soumis avec succès !');
        window.location.reload();
      } else {
        const errData = await res.json();
        alert('Erreur: ' + errData.error);
      }
    } catch(err: any) {
      alert('Erreur réseau: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col max-w-4xl">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h3 className="text-xl font-bold text-slate-900">Formulaire d'inscription</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal */}
        <section>
          <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Informations Personnelles</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input name="first_name" defaultValue={existing?.first_name || ''} placeholder="Prénom" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input name="last_name" defaultValue={existing?.last_name || ''} placeholder="Nom" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <select name="gender" defaultValue={existing?.gender || ''} className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"><option value="M">Masculin</option><option value="F">Féminin</option></select>
            <input type="date" name="dob" defaultValue={existing?.dob || ''} required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input name="nationality" defaultValue={existing?.nationality || ''} placeholder="Nationalité" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input name="address" defaultValue={existing?.address || ''} placeholder="Adresse" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input name="phone" defaultValue={existing?.phone || ''} placeholder="Téléphone" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input type="email" name="email" defaultValue={existing?.email || ''} placeholder="Email" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
          </div>
        </section>
        
        {/* Academic */}
        <section>
          <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Parcours Académique</h4>
          <div className="grid grid-cols-2 gap-4">
            <input name="last_diploma" defaultValue={existing?.last_diploma || ''} placeholder="Dernier diplôme (ex: Baccalauréat)" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input name="previous_school" defaultValue={existing?.previous_school || ''} placeholder="Établissement précédent" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input name="graduation_year" defaultValue={existing?.graduation_year || ''} placeholder="Année d'obtention" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
            <input type="number" step="0.01" name="average_grade" defaultValue={existing?.average_grade || ''} placeholder="Moyenne obtenue" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
          </div>
        </section>

        {/* Choices */}
        <section>
          <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Choix d'études</h4>
          <div className="grid grid-cols-3 gap-4">
            <select name="field_id" defaultValue={existing?.field_id || ''} required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
              <option value="">Sélectionner une filière</option>
              {refs.fields.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <select name="level_id" defaultValue={existing?.level_id || ''} required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
              <option value="">Sélectionner un niveau</option>
              {refs.levels.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <input name="academic_year" defaultValue={existing?.academic_year || ''} placeholder="Année d'étude (ex: 2024-2025)" required className="border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" />
          </div>
        </section>

        {/* Documents */}
        <section>
          <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Documents requis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><label className="block text-slate-600 font-bold mb-1 ml-1">Photo d'identité</label><input type="file" name="photo" accept="image/*" required={!existing} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-slate-500" /></div>
            <div><label className="block text-slate-600 font-bold mb-1 ml-1">Acte de naissance</label><input type="file" name="birth_certificate" accept=".pdf,image/*" required={!existing} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-slate-500" /></div>
            <div><label className="block text-slate-600 font-bold mb-1 ml-1">Diplôme</label><input type="file" name="diploma" accept=".pdf,image/*" required={!existing} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-slate-500" /></div>
            <div><label className="block text-slate-600 font-bold mb-1 ml-1">Relevé de notes</label><input type="file" name="transcript" accept=".pdf,image/*" required={!existing} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-slate-500" /></div>
            <div><label className="block text-slate-600 font-bold mb-1 ml-1">Pièce d'identité</label><input type="file" name="id_card" accept=".pdf,image/*" required={!existing} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-slate-500" /></div>
          </div>
        </section>

        <button disabled={loading} type="submit" className="bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-50">
          {loading ? 'Envoi en cours...' : 'Soumettre le dossier'}
        </button>
      </form>
    </div>
  );
}

function PaymentSimulation({ applications, payments }: { applications: any[], payments: any[] }) {
  const currentApp = applications[0];
  const paid = payments.length > 0;

  const handlePayment = async () => {
    try {
      const res = await fetch('/api/student/payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ application_id: currentApp.id, amount: 150000 })
      });
      if(res.ok) {
        alert('Paiement simulé avec succès !');
        window.location.reload();
      }
    } catch(err) {}
  };

  const generatePDF = (payment: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text('EduPortail', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('Reçu de Paiement', 150, 25);
    
    // Body
    doc.setTextColor(51, 65, 85); // Slate 700
    
    doc.setFontSize(10);
    doc.text('INFORMATIONS DU REÇU', 20, 60);
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(20, 62, 190, 62);
    
    doc.setFontSize(12);
    doc.text(`N° de reçu :`, 20, 75);
    doc.setFont("helvetica", "bold");
    doc.text(payment.receipt_number, 80, 75);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Date :`, 20, 85);
    doc.setFont("helvetica", "bold");
    doc.text(new Date(payment.payment_date.replace(' ', 'T')).toLocaleString('fr-FR'), 80, 85);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Candidat :`, 20, 95);
    doc.setFont("helvetica", "bold");
    doc.text(`${currentApp.first_name} ${currentApp.last_name}`, 80, 95);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Filière :`, 20, 105);
    doc.setFont("helvetica", "bold");
    doc.text(`${currentApp.field_name} - ${currentApp.level_name}`, 80, 105);
    
    // Amount box
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.roundedRect(20, 120, 170, 30, 3, 3, 'FD');
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Montant payé :`, 30, 138);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Blue 600
    doc.text(`${payment.amount.toLocaleString()} FCFA`, 120, 138);
    
    // Footer
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Ce reçu est généré électroniquement et sert de preuve de paiement.', 20, 280);
    
    doc.save(`Recu_EduPortail_${payment.receipt_number}.pdf`);
  };

  if(!currentApp) return <div className="text-slate-500 text-center mt-12">Veuillez d'abord soumettre un dossier.</div>;
  if(paid) return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="font-bold text-2xl text-slate-900 mb-2">Paiement effectué</h3>
      <p className="text-slate-500 mb-8">Vos frais d'inscription ont été réglés.</p>
      {payments.map((p: any) => (
        <button key={p.id} onClick={() => generatePDF(p)} className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 transition-colors">
          <Download className="w-5 h-5" /> Télécharger le reçu {p.receipt_number}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col max-w-2xl mx-auto text-center">
      <h3 className="font-bold text-2xl text-slate-900 mb-4">Paiement des frais d'inscription</h3>
      <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-2">Montant à payer</p>
        <p className="text-4xl font-black">150 000 FCFA</p>
      </div>
      <button onClick={handlePayment} className="bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
        Simuler le paiement
      </button>
    </div>
  );
}

function NotificationsPage({ notifications }: { notifications: any[] }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-2xl text-slate-900 mb-6">Toutes vos notifications</h3>
      <div className="space-y-4">
        {notifications.length === 0 && <p className="text-slate-400">Aucune notification.</p>}
        {notifications.map((n: any) => (
          <div key={n.id} className={`p-4 rounded-2xl border ${n.is_read ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                {n.is_read ? 'Lue' : 'Nouvelle'}
              </span>
              <span className="text-xs opacity-60 font-medium">
                {new Date(n.created_at.replace(' ', 'T')).toLocaleString('fr-FR')}
              </span>
            </div>
            <p className="font-medium">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/student/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div className="p-8">Chargement...</div>;

  return (
    <Routes>
      <Route path="/" element={<StudentOverview data={data} />} />
      <Route path="/dossier" element={<ApplicationForm applications={data.applications} />} />
      <Route path="/paiement" element={<PaymentSimulation applications={data.applications} payments={data.payments} />} />
      <Route path="/notifications" element={<NotificationsPage notifications={data.notifications} />} />
    </Routes>
  );
}
