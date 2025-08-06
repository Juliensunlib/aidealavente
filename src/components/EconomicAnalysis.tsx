import React from 'react';
import { TrendingUp, Euro, Zap, Battery } from 'lucide-react';
import { EconomicData } from '../types';

interface EconomicAnalysisProps {
  economicData: EconomicData;
  selectedDuration: number;
  displayMode: 'HT' | 'TTC';
  virtualBattery: boolean;
}

const EconomicAnalysis: React.FC<EconomicAnalysisProps> = ({ 
  economicData, 
  selectedDuration, 
  displayMode,
  virtualBattery 
}) => {
  const analysisForDuration = economicData.economicAnalysis.find(
    analysis => analysis.duration === selectedDuration
  );

  if (!analysisForDuration) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border-t border-green-200 bg-green-50 p-4 rounded-b-xl">
      <h5 className="font-semibold text-green-800 mb-3 text-center flex items-center justify-center">
        <TrendingUp className="w-4 h-4 mr-2" />
        Analyse économique sur {selectedDuration} ans
      </h5>
      
      <div className="space-y-3">
        <div className="bg-white p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Production totale</p>
              <p className="font-semibold text-green-800">
                {Math.round(analysisForDuration.totalProduction).toLocaleString()} kWh
              </p>
            </div>
            <div>
              <p className="text-gray-600">Autoconsommation</p>
              <p className="font-semibold text-green-800 flex items-center">
                {Math.round(analysisForDuration.totalSelfConsumption).toLocaleString()} kWh
                {virtualBattery && <Battery className="w-3 h-3 ml-1 text-green-600" />}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Vente surplus</p>
              <p className="font-semibold text-green-800">
                {Math.round(analysisForDuration.totalProduction - analysisForDuration.totalSelfConsumption).toLocaleString()} kWh
              </p>
            </div>
            <div>
              <p className="text-gray-600">Taux autoconso.</p>
              <p className="font-semibold text-green-800">
                {economicData.selfConsumptionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border-2 border-green-300">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Économies nettes sur {selectedDuration} ans</p>
            <p className={`text-2xl font-bold ${analysisForDuration.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(analysisForDuration.totalSavings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (après déduction abonnement SunLib)
            </p>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <p className="text-gray-600">Économies brutes</p>
              <p className="font-semibold text-green-700">
                {formatCurrency((analysisForDuration as any).totalGrossSavings || (analysisForDuration.totalElectricitySavings + analysisForDuration.totalSales))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Coût abonnement</p>
              <p className="font-semibold text-red-600">
                -{formatCurrency((analysisForDuration as any).totalSubscriptionCost || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicAnalysis;