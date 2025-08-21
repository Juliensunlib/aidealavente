import { PVGISResponse } from '../types';

export const getPVGISData = async (
  latitude: number, 
  longitude: number, 
  peakPower: number
): Promise<number> => {
  // Validate input parameters
  if (!latitude || !longitude || !peakPower) {
    throw new Error('Paramètres manquants pour le calcul PVGIS');
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude invalide (doit être entre -90 et 90)');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude invalide (doit être entre -180 et 180)');
  }
  
  if (peakPower < 0.1 || peakPower > 1000) {
    throw new Error('Puissance invalide (doit être entre 0.1 et 1000 kWc)');
  }

  // Détection de l'environnement
  const isDevelopment = import.meta.env.DEV;
  
  let url: string;
  if (isDevelopment) {
    // En développement, utiliser le proxy Vite
    url = `/api/pvgis/PVcalc?lat=${latitude}&lon=${longitude}&peakpower=${peakPower}&loss=14&mountingplace=building&angle=35&aspect=0&outputformat=json`;
  } else {
    // En production, utiliser un proxy CORS public
    const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${latitude}&lon=${longitude}&peakpower=${peakPower}&loss=14&mountingplace=building&angle=35&aspect=0&outputformat=json`;
    url = `https://api.allorigins.win/get?url=${encodeURIComponent(pvgisUrl)}`;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API PVGIS: ${response.status} - ${response.statusText}`);
    }
    
    let data: PVGISResponse;
    if (isDevelopment) {
      data = await response.json();
    } else {
      // En production, extraire les données du proxy CORS
      const proxyResponse = await response.json();
      if (!proxyResponse.contents) {
        throw new Error('Réponse du proxy CORS invalide');
      }
      data = JSON.parse(proxyResponse.contents);
    }
    
    if (!data.outputs || !data.outputs.totals || !data.outputs.totals.fixed) {
      throw new Error('Données PVGIS incomplètes ou format invalide');
    }
    
    return data.outputs.totals.fixed.E_y;
  } catch (error) {
    console.error('Erreur API PVGIS:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Impossible de contacter le service PVGIS. Vérifiez votre connexion internet.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erreur inconnue lors du calcul du productible');
  }
};