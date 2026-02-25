import React from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-purple-50 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Welcome Back</h1>
            <p className="text-zinc-500 font-medium">Log in to manage your business website.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Input label="Email Address" type="email" placeholder="you@example.com" required />
            <Input label="Password" type="password" placeholder="••••••••" required />
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-600 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500" />
                Remember me
              </label>
              <button type="button" className="text-purple-600 font-bold hover:underline">Forgot password?</button>
            </div>

            <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100">
              Sign In
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-zinc-500 text-sm">
              Don't have an account?{' '}
              <Link to="/builder" className="text-purple-600 font-bold hover:underline">Start building for free</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
