import { useState, useEffect } from 'react';

interface FortuneLimit {
  type: string;
  dailyLimit: number;
  used: number;
  extraRights: number;
  totalAvailable: number;
  remaining: number;
}

interface UseFortuneLimitsReturn {
  limits: FortuneLimit[];
  loading: boolean;
  error: string | null;
  checkLimit: (type: string) => FortuneLimit | null;
  hasRemainingRights: (type: string) => boolean;
  refreshLimits: () => void;
}

export const useFortuneLimits = (): UseFortuneLimitsReturn => {
  const [limits, setLimits] = useState<FortuneLimit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLimits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        // Return default limits when user is not logged in
        setLimits([
          { type: 'HAND', dailyLimit: 3, used: 0, extraRights: 0, totalAvailable: 3, remaining: 3 },
          { type: 'FACE', dailyLimit: 3, used: 0, extraRights: 0, totalAvailable: 3, remaining: 3 },
          { type: 'COFFEE', dailyLimit: 3, used: 0, extraRights: 0, totalAvailable: 3, remaining: 3 },
          { type: 'TAROT', dailyLimit: 3, used: 0, extraRights: 0, totalAvailable: 3, remaining: 3 },
          { type: 'AI_CHAT', dailyLimit: 5, used: 0, extraRights: 0, totalAvailable: 5, remaining: 5 }
        ]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fortune-limits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Fal hakları getirilemedi');
      }

      const data = await response.json();
      setLimits(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const checkLimit = (type: string): FortuneLimit | null => {
    return limits.find(limit => limit.type === type.toUpperCase()) || null;
  };

  const hasRemainingRights = (type: string): boolean => {
    const limit = checkLimit(type);
    return limit ? limit.remaining > 0 : false;
  };

  const refreshLimits = () => {
    fetchLimits();
  };

  return {
    limits,
    loading,
    error,
    checkLimit,
    hasRemainingRights,
    refreshLimits
  };
};
