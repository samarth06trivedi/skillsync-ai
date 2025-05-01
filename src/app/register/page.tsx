'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/auth'); // Redirect to login page
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              backgroundColor: '#2c2c2c',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 12,
              width: '100%',
            }}
          />
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              backgroundColor: '#2c2c2c',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 12,
              width: '100%',
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              backgroundColor: '#2c2c2c',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 12,
              width: '100%',
            }}
          />
          {error && <p style={{ color: '#ff4d4f', marginBottom: 10 }}>{error}</p>}
          <button type="submit" style={{
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: 8,
            width: '100%',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Register
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, marginTop: 15 }}>
          Already have an account?{' '}
          <a href="/auth" style={{ color: '#1e90ff', textDecoration: 'underline' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
