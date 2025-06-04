import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { supabase } from '../lib/supabase';

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
    } else {
      setOpen(true);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = () => {
    window.open('https://ckdp.vercel.app/auth/signup', '_blank');
  };

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  return (
    <>
      <Button variant="contained" color={user ? 'secondary' : 'primary'} onClick={handleAuth}>
        {user ? 'Sign Out' : 'Sign In'}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Sign In</DialogTitle>
        <form onSubmit={handleEmailAuth}>
          <DialogContent>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleSignUp}>Need an account? Sign Up</Button>
            <Button type="submit" variant="contained">
              Sign In
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
