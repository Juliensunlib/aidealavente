import { GeoportailResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchAddress = async (address: string): Promise<GeoportailResponse> => {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=5`;
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });
      
      if (!response.ok) {
        // Retry only for 5xx server errors
        if (response.status >= 500 && response.status < 600 && attempt < maxRetries) {
          console.warn(`Tentative ${attempt}/${maxRetries} échouée (${response.status}). Nouvelle tentative dans ${retryDelay}ms...`);
          await sleep(retryDelay);
          continue;
        }
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erreur API Géoportail (tentative ${attempt}/${maxRetries}):`, error);
      
      // If it's the last attempt or not a retryable error, throw
      if (attempt === maxRetries || 
          (error instanceof TypeError && error.message.includes('fetch')) ||
          (error instanceof DOMException && error.name === 'TimeoutError')) {
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Impossible de contacter le service d\'adresse. Vérifiez votre connexion internet.');
        }
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          throw new Error('Délai d\'attente dépassé. Le service d\'adresse ne répond pas.');
        }
        throw error;
      }
      
      // Wait before retrying
      console.warn(`Nouvelle tentative dans ${retryDelay}ms...`);
      await sleep(retryDelay);
    }
  }
  
  // This should never be reached, but TypeScript requires it
  throw new Error('Toutes les tentatives ont échoué');
};