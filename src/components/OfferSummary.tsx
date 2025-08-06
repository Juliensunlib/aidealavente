import React from 'react';
import { ArrowLeft, Zap, MapPin, Euro, TrendingUp, CheckCircle, Users, Building2, FileText, Calendar, Battery, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-2 print:p-0 print:bg-white print:text-sm print:min-h-screen">
      <div className="max-w-4xl mx-auto print:max-w-none print:mx-0">
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
        <div className="bg-white rounded-lg shadow-xl print:shadow-none print:rounded-none print:text-sm print:h-screen print:flex print:flex-col">
          {/* En-tête du résumé */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg print:rounded-none print:p-3 print:flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-8 h-8 mr-3 print:w-6 print:h-6 print:mr-3" />
                <div>
                  <h1 className="text-2xl font-bold print:text-xl">Résumé d'offre SunLib</h1>
                  <p className="text-green-100 print:text-sm">Abonnement solaire sur {offer.duration} ans</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold print:text-2xl">{formatCurrency(displayPrice)}</p>
                <p className="text-green-100 print:text-sm">par mois {displayMode}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 print:p-4 print:space-y-3 print:flex-1 print:overflow-hidden">
            {/* 1. Détails de l'installation */}
            <div className="bg-gray-50 p-3 rounded-lg print:p-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center print:text-base print:mb-2">
                <Zap className="w-5 h-5 mr-2 text-green-600 print:w-4 print:h-4 print:mr-2" />
                Détails de l'installation
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm print:gap-3 print:text-sm">
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
                  <p className="font-semibold flex items-center print:text-sm">
                    {virtualBattery ? '90%' : '60%'}
                    {virtualBattery && <Battery className="w-3 h-3 ml-1 text-green-600 print:w-3 print:h-3" />}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Conditions financières */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 print:p-3">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center print:text-base print:mb-2">
                <Euro className="w-5 h-5 mr-2 print:w-4 print:h-4 print:mr-2" />
                Conditions financières
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm print:gap-3 print:text-sm">
                <div>
                  <p className="text-green-700">Abonnement mensuel {displayMode}</p>
                  <p className="text-xl font-bold text-green-800 print:text-lg">{formatCurrency(displayPrice)}</p>
                </div>
                <div>
                  <p className="text-green-700">Durée du contrat</p>
                  <p className="text-xl font-bold text-green-800 print:text-lg">{offer.duration} ans</p>
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
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 print:p-3">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center print:text-base print:mb-2">
                  <TrendingUp className="w-5 h-5 mr-2 print:w-4 print:h-4 print:mr-2" />
                  Étude économique - Économies brutes par durée
                </h3>
                
                {/* Avertissement */}
                <div className="bg-yellow-100 border border-yellow-300 p-2 rounded mb-3 print:p-2 print:mb-2">
                  <p className="text-xs text-yellow-800 font-medium print:text-sm">
                    💰 Économies calculées BRUTES (avant déduction de l'abonnement SunLib)
                  </p>
                </div>

                {/* Tableau des économies par durée */}
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="grid grid-cols-6 gap-1 text-xs font-medium text-blue-800 bg-blue-100 p-2 print:p-2 print:text-sm">
                    <div className="text-center">Durée</div>
                    <div className="text-center">10 ans</div>
                    <div className="text-center">15 ans</div>
                    <div className="text-center">20 ans</div>
                    <div className="text-center">25 ans</div>
                    <div className="text-center">30 ans</div>
                  </div>
                  <div className="grid grid-cols-6 gap-1 text-xs p-2 print:p-2 print:text-sm">
                    <div className="text-blue-700 font-medium">Économies brutes</div>
                    {[10, 15, 20, 25, 30].map(duration => {
                      const analysis = economicData.economicAnalysis.find(a => a.duration === duration);
                      return (
                        <div key={duration} className="text-center font-semibold text-blue-800">
                          {analysis ? (
                            <span className="text-green-600">
                              {formatCurrency(analysis.totalSavings)}
                            </span>
                          ) : 'N/A'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Avantages de l'abonnement SunLib */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 print:p-3">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center print:text-base print:mb-2">
                <CheckCircle className="w-5 h-5 mr-2 print:w-4 print:h-4 print:mr-2" />
                Avantages de l'abonnement SunLib
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm print:gap-2 print:text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 print:w-3 print:h-3 print:mr-2" />
                  <span>Installation et mise en service incluses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 print:w-3 print:h-3 print:mr-2" />
                  <span>Maintenance et assurance pendant toute la durée</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 print:w-3 print:h-3 print:mr-2" />
                  <span>Monitoring et suivi de production</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 print:w-3 print:h-3 print:mr-2" />
                  <span>Garantie de performance sur {offer.duration} ans</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 print:w-3 print:h-3 print:mr-2" />
                  <span>Option de rachat à tout moment</span>
                </div>
                {virtualBattery && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 print:w-3 print:h-3 print:mr-2" />
                    <span>Batterie virtuelle incluse (90% d'autoconsommation)</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Processus et prochaines étapes */}
            <div className="bg-gray-50 p-3 rounded-lg print:p-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center print:text-base print:mb-2">
                <Calendar className="w-5 h-5 mr-2 text-green-600 print:w-4 print:h-4 print:mr-2" />
                Processus et prochaines étapes
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm print:gap-2 print:text-sm">
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">1</span>
                  <span>Étude technique et administrative (2-4 semaines)</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">2</span>
                  <span>Validation du dossier et signature du contrat</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">3</span>
                  <span>Installation par nos équipes certifiées (1-2 jours)</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">4</span>
                  <span>Mise en service et début de la production</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-3 rounded-b-lg print:rounded-none text-center print:p-2 print:flex-shrink-0">
            <p className="text-sm text-gray-600 print:text-sm">
              Cette offre est valable 30 jours. Pour plus d'informations, contactez votre conseiller SunLib.
            </p>
          </div>
        </div>

        {/* Boutons d'action - masqués à l'impression */}
        <div className="print:hidden mt-4 text-center space-y-3">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                const subject = encodeURIComponent(`Résumé d'offre SunLib - Abonnement ${offer.duration} ans`);
                const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint le résumé de votre offre SunLib :\n\n- Puissance : ${power} kWc\n- Abonnement mensuel : ${formatCurrency(displayPrice)} ${displayMode}\n- Durée : ${offer.duration} ans\n\nCordialement,\nÉquipe SunLib`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Envoyer par mail
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FileText className="w-5 h-5 mr-2" />
              Imprimer le résumé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSummary;