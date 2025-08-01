import { PVGISResponse } from '../types';

export const getPVGISData = async (
  latitude: number, 
  longitude: number, 
  peakPower: number
): Promise<number> => {
  const url = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${latitude}&lon=${longitude}&peakpower=${peakPower}&loss=14&mountingplace=building&angle=35&aspect=0&outputformat=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données PVGIS');
    }
    
    const data: PVGISResponse = await response.json();
    return data.outputs.totals.fixed.E_y;
  } catch (error) {
    console.error('Erreur API PVGIS:', error);
    throw error;
  }
};