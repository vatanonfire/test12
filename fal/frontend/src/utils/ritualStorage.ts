import { Ritual } from '@/data/rituals';

export interface PurchasedRitual {
  id: string;
  ritualId: string;
  ritual: Ritual;
  purchaseDate: string;
  userId: string;
}

const STORAGE_KEY = 'purchasedRituals';

export const getPurchasedRituals = (userId: string): PurchasedRitual[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const allPurchased: PurchasedRitual[] = JSON.parse(stored);
    return allPurchased.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error getting purchased rituals:', error);
    return [];
  }
};

export const addPurchasedRitual = (userId: string, ritual: Ritual): PurchasedRitual => {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available');
  }
  
  try {
    const existing = getPurchasedRituals(userId);
    const newPurchase: PurchasedRitual = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ritualId: ritual.id,
      ritual,
      purchaseDate: new Date().toISOString(),
      userId
    };
    
    const updated = [...existing, newPurchase];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newPurchase;
  } catch (error) {
    console.error('Error adding purchased ritual:', error);
    throw error;
  }
};

export const isRitualPurchased = (userId: string, ritualId: string): boolean => {
  const purchased = getPurchasedRituals(userId);
  return purchased.some(item => item.ritualId === ritualId);
};

export const removePurchasedRitual = (userId: string, ritualId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allPurchased: PurchasedRitual[] = JSON.parse(stored);
    const filtered = allPurchased.filter(item => 
      !(item.userId === userId && item.ritualId === ritualId)
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing purchased ritual:', error);
  }
};

export const clearAllPurchasedRituals = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allPurchased: PurchasedRitual[] = JSON.parse(stored);
    const filtered = allPurchased.filter(item => item.userId !== userId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error clearing purchased rituals:', error);
  }
};


