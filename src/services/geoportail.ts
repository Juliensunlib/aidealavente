import { GeoportailResponse } from '../types';

export const searchAddress = async (address: string): Promise<GeoportailResponse> => {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=5`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche d\'adresse');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur API Géoportail:', error);
    throw error;
  }
};