import { GeoportailResponse } from '../types';

export const searchAddress = async (address: string): Promise<GeoportailResponse> => {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=5`;
  
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
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API Géoportail:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Impossible de contacter le service d\'adresse. Vérifiez votre connexion internet.');
    }
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error('Délai d\'attente dépassé. Le service d\'adresse ne répond pas.');
    }
    throw error;
  }
};