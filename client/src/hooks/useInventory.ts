import { useState, useEffect } from 'react';
import { getInventory } from '../lib/api';

export interface Inventory {
  totalCapacity: number;
  reserved: number;
  available: number;
}

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory | null>(null);

  useEffect(() => {
    let alive = true;
    const fetch = () => getInventory().then((d: Inventory) => alive && setInventory(d)).catch(() => {});
    fetch();
    const id = setInterval(fetch, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return inventory;
}
