import React from 'react';
import { TrendingUp, Euro, Zap, Battery, Calendar, Gift } from 'lucide-react';
import { EconomicData } from '../types';

interface EconomicAnalysisProps {
  economicData: EconomicData;
  selectedDuration: number;
  displayMode: 'HT' | 'TTC';
  virtualBattery: boolean;
  monthlySubscription: number;
  subscriptionDuration: number;
}

const EconomicAnalysis: React.FC<EconomicAnalysisProps> = ({ 
  economicData, 
  selectedDuration, 
  displayMode,
  virtualBattery,
  monthlySubscription,
  subscriptionDuration
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

  // Calculs des économies nettes
  const totalSubscriptionCost = monthlySubscription * 12 * subscriptionDuration;
  const grossSavingsDuringSubscription = analysisForDuration.annualGrossSavings * subscriptionDuration;
  const netSavingsDuringSubscription = grossSavingsDuringSubscription - totalSubscriptionCost;
  
  // Économies après la fin de l'abonnement (années gratuites)
  const freeYears = selectedDuration - subscriptionDuration;
  const savingsAfterSubscription = freeYears > 0 ? analysisForDuration.annualGrossSavings * freeYears : 0;
  
  // Total des économies nettes
  const totalNetSavings = netSavingsDuringSubscription + savingsAfterSubscription;
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

        {/* Économies brutes */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-300">
          <div className="text-center">
            <p className="text-sm text-blue-600 mb-1">Économies brutes sur {selectedDuration} ans</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(analysisForDuration.totalSavings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (avant déduction abonnement SunLib)
            </p>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <p className="text-gray-600">Économies électricité</p>
              <p className="font-semibold text-blue-700">
                {formatCurrency(analysisForDuration.totalElectricitySavings)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Revenus vente surplus</p>
              <p className="font-semibold text-blue-700">
                {formatCurrency(analysisForDuration.totalSales)}
              </p>
            </div>
          </div>
        </div>

        {/* Analyse détaillée des économies nettes */}
        <div className="space-y-2">
          {/* Période d'abonnement */}
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-300">
            <div className="flex items-center justify-between mb-2">
              <h6 className="font-semibold text-orange-800 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Années 1-{subscriptionDuration} (avec abonnement)
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-gray-600">Économies brutes</p>
                <p className="font-semibold text-green-700">
                  {formatCurrency(grossSavingsDuringSubscription)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Coût abonnement</p>
                <p className="font-semibold text-red-700">
                  -{formatCurrency(totalSubscriptionCost)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Économies nettes</p>
                <p className="font-semibold text-orange-700">
                  {formatCurrency(netSavingsDuringSubscription)}
                </p>
              </div>
            </div>
          </div>

          {/* Période post-abonnement */}
          {freeYears > 0 && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-300">
              <div className="flex items-center justify-between mb-2">
                <h6 className="font-semibold text-green-800 flex items-center">
                  <Gift className="w-4 h-4 mr-1" />
                  Années {subscriptionDuration + 1}-{selectedDuration} (GRATUITES !)
                </h6>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Économies supplémentaires</p>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(savingsAfterSubscription)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Installation gratuite pendant {freeYears} ans
                </p>
              </div>
            </div>
          )}

          {/* Total des économies nettes */}
          <div className="bg-green-100 p-3 rounded-lg border-2 border-green-400">
            <div className="text-center">
              <p className="text-sm text-green-700 mb-1">TOTAL ÉCONOMIES NETTES sur {selectedDuration} ans</p>
              <p className="text-2xl font-bold text-green-800">
                {formatCurrency(totalNetSavings)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Gain réel après déduction de l'abonnement SunLib
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicAnalysis;