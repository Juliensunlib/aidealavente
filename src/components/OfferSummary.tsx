import React from 'react';
import { ArrowLeft, Zap, MapPin, Euro, TrendingUp, CheckCircle, Users, Building2, FileText, Calendar, Battery } from 'lucide-react';
import { EconomicData } from '../types';

interface CalculationResult {
  duration: number;
  monthlyPayment: number;
  monthlyPaymentTTC: number;
  minRevenue: number;
  solvability: 'excellent' | 'good' | 'acceptable' | 'difficult';
  residualValues: { year: number; value: number; valueTTC: number }[];
  economicAnalysis?: {
    duration: number;
    totalSavings: number;
    totalProduction: number;
    totalSelfConsumption: number;
    totalSales: number;
    totalElectricitySavings: number;
  };
}

interface OfferSummaryProps {
  offer: CalculationResult;
  economicData: EconomicData | null;
  power: number;
  clientType: 'particulier' | 'entreprise';
  displayMode: 'HT' | 'TTC';
  virtualBattery: boolean;
  onBack: () => void;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({
  offer,
  economicData,
  power,
  clientType,
  displayMode,
  virtualBattery,
  onBack
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  const displayPrice = displayMode === 'HT' ? offer.monthlyPayment : offer.monthlyPaymentTTC;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-2 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header - masqué à l'impression */}
        <div className="print:hidden mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux résultats
          </button>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow-xl print:shadow-none print:rounded-none">
          {/* En-tête du résumé */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg print:rounded-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Résumé d'offre SunLib</h1>
                  <p className="text-green-100">Abonnement solaire sur {offer.duration} ans</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{formatCurrency(displayPrice)}</p>
                <p className="text-green-100">par mois {displayMode}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* 1. Détails de l'installation */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-600" />
                Détails de l'installation
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Puissance installée</p>
                  <p className="font-semibold">{power} kWc</p>
                </div>
                <div>
                  <p className="text-gray-600">Production annuelle estimée</p>
                  <p className="font-semibold">
                    {economicData ? Math.round(economicData.annualProduction).toLocaleString() : 'N/A'} kWh/an
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Localisation</p>
                  <p className="font-semibold text-xs">{economicData?.address || 'Non spécifiée'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Taux d'autoconsommation</p>
                  <p className="font-semibold flex items-center">
                    {virtualBattery ? '90%' : '60%'}
                    {virtualBattery && <Battery className="w-3 h-3 ml-1 text-green-600" />}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Conditions financières */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <Euro className="w-5 h-5 mr-2" />
                Conditions financières
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-green-700">Abonnement mensuel {displayMode}</p>
                  <p className="text-xl font-bold text-green-800">{formatCurrency(displayPrice)}</p>
                </div>
                <div>
                  <p className="text-green-700">Durée du contrat</p>
                  <p className="text-xl font-bold text-green-800">{offer.duration} ans</p>
                </div>
                {clientType === 'particulier' && (
                  <div className="col-span-2">
                    <p className="text-green-700">Revenus minimum requis</p>
                    <p className="font-bold text-green-800">{formatCurrency(offer.minRevenue)} / an</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Étude économique */}
            {economicData && offer.economicAnalysis && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Étude économique sur {offer.duration} ans
                </h3>
                
                {/* Avertissement */}
                <div className="bg-yellow-100 border border-yellow-300 p-2 rounded mb-3">
                  <p className="text-xs text-yellow-800 font-medium">
                    ⚠️ Économies calculées BRUTES (avant déduction de l'abonnement SunLib)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-700">Production totale</p>
                    <p className="font-semibold text-blue-800">
                      {Math.round(offer.economicAnalysis.totalProduction).toLocaleString()} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Autoconsommation</p>
                    <p className="font-semibold text-blue-800">
                      {Math.round(offer.economicAnalysis.totalSelfConsumption).toLocaleString()} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Économies électricité</p>
                    <p className="font-semibold text-blue-800">
                      {formatCurrency(offer.economicAnalysis.totalElectricitySavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Revenus vente surplus</p>
                    <p className="font-semibold text-blue-800">
                      {formatCurrency(offer.economicAnalysis.totalSales)}
                    </p>
                  </div>
                  <div className="col-span-2 bg-blue-100 p-2 rounded">
                    <p className="text-blue-700 text-center">Économies totales brutes</p>
                    <p className="text-xl font-bold text-blue-800 text-center">
                      {formatCurrency(offer.economicAnalysis.totalSavings)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Avantages de l'abonnement SunLib */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Avantages de l'abonnement SunLib
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Installation et mise en service incluses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Maintenance et assurance pendant toute la durée</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Monitoring et suivi de production</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Garantie de performance sur {offer.duration} ans</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span>Option de rachat à tout moment</span>
                </div>
                {virtualBattery && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>Batterie virtuelle incluse (90% d'autoconsommation)</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Processus et prochaines étapes */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Processus et prochaines étapes
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">1</span>
                  <span>Étude technique et administrative (2-4 semaines)</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">2</span>
                  <span>Validation du dossier et signature du contrat</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">3</span>
                  <span>Installation par nos équipes certifiées (1-2 jours)</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">4</span>
                  <span>Mise en service et début de la production</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-3 rounded-b-lg print:rounded-none text-center">
            <p className="text-sm text-gray-600">
              Cette offre est valable 30 jours. Pour plus d'informations, contactez votre conseiller SunLib.
            </p>
          </div>
        </div>

        {/* Bouton d'impression - masqué à l'impression */}
        <div className="print:hidden mt-4 text-center">
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <FileText className="w-5 h-5 mr-2" />
            Imprimer le résumé
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferSummary;