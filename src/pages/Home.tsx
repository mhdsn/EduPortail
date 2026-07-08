import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">EduPortail</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-slate-500 hover:text-slate-900 font-bold px-4 py-2 transition-colors">
              Se connecter
            </Link>
            <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
          Votre avenir <br/> commence <span className="text-blue-600">ici.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Digitalisez votre parcours académique. Effectuez votre préinscription en ligne, suivez votre dossier et gérez votre scolarité depuis une plateforme unique.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1">
            Démarrer mon inscription <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="py-4">
              <div className="text-5xl font-black text-slate-900 mb-2">+5000</div>
              <div className="text-slate-400 font-bold tracking-widest uppercase text-sm">Étudiants Inscrits</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-black text-slate-900 mb-2">15</div>
              <div className="text-slate-400 font-bold tracking-widest uppercase text-sm">Filières d'Excellence</div>
            </div>
            <div className="py-4">
              <div className="text-5xl font-black text-slate-900 mb-2">98%</div>
              <div className="text-slate-400 font-bold tracking-widest uppercase text-sm">Taux d'Insertion</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">Pourquoi s'inscrire en ligne ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Gain de Temps</h3>
            <p className="text-slate-500 leading-relaxed">Plus besoin de vous déplacer. Soumettez vos documents et complétez votre dossier en quelques minutes depuis chez vous.</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Processus Sécurisé</h3>
            <p className="text-slate-500 leading-relaxed">Vos données personnelles et documents sont chiffrés et stockés en toute sécurité. Paiement en ligne certifié.</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Suivi en Temps Réel</h3>
            <p className="text-slate-500 leading-relaxed">Suivez l'avancement de votre dossier étape par étape. Soyez notifié instantanément à chaque validation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
