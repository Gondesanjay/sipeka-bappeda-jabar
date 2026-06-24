import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Landmark, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@instansi.go.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simulate brief loading for premium feel
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Email atau kata sandi tidak valid.');
        setIsLoggingIn(false);
      } else {
        setFadeIn(true);
      }
    }, 400);
  };

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 relative overflow-hidden
        ${fadeIn ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        transition-opacity duration-700 ease-in-out`}
    >
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E3A8A]/[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1E3A8A]/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.08)] border border-slate-100 p-8 relative z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] flex items-center justify-center mb-4 shadow-lg shadow-[#1E3A8A]/20">
            <Landmark className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SIPEKA</h1>
          <p className="text-sm text-slate-500 mt-1">Dashboard Pembangunan Daerah</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]
                transition-all duration-200"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800
                  placeholder:text-slate-400 pr-11
                  focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]
                  transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            ref={buttonRef}
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-[#1E3A8A] hover:bg-[#1B367F] text-white rounded-xl text-sm font-semibold
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-lg shadow-[#1E3A8A]/20"
          >
            {isLoggingIn ? 'Memverifikasi...' : 'Masuk'}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <a
              href="#"
              className="text-sm text-[#1E3A8A] hover:text-[#1B367F] font-medium transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Lupa password?
            </a>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm">
        <Shield className="w-4 h-4" />
        <span className="font-medium tracking-wide">BAPPEDA PROVINSI</span>
      </div>
    </div>
  );
};
