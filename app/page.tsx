'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
        const errorData = await response.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    console.log(user, 'hello')
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return null;
};

export default Home;
