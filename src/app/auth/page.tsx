'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/upload');
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
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            fontWeight: 'bold',
            marginBottom: 10
          }}>
            Sign in
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14 }}>
          Don&#39;t have an account?{' '}
          <a href="/register" style={{ color: '#1e90ff', textDecoration: 'underline' }}>
            Register here
          </a>
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#333' }} />

        <button
          onClick={() => signIn('google', { callbackUrl: '/upload' })}
          style={{
            backgroundColor: '#fff',
            color: '#000',
            padding: '12px',
            borderRadius: 8,
            width: '100%',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <img src="/google.svg" alt="Google" width={20} height={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
