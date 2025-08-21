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
              <div className="space-y-3 text-sm print:text-sm">
                <div>
                  <div className="flex items-start mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                    <div>
                      <span className="font-semibold text-green-800">Pas d'apport initial</span>
                      <p className="text-gray-600 text-xs mt-1">Zéro investissement initial : votre épargne reste intacte</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                    <div>
                      <span className="font-semibold text-green-800">Pas d'emprunt</span>
                      <p className="text-gray-600 text-xs mt-1">Préserve la capacité d'endettement et évite des démarches longues et complexes de demande de crédit</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                    <div>
                      <span className="font-semibold text-green-800">Économies immédiates</span>
                      <p className="text-gray-600 text-xs mt-1">Économies immédiates dès la première année • Factures d'électricité réduites</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                    <div>
                      <span className="font-semibold text-green-800">Tranquillité d'esprit totale</span>
                      <p className="text-gray-600 text-xs mt-1">En cas de panne, SunLib s'occupe de tout • Garantie de bon fonctionnement incluse</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                    <div>
                      <span className="font-semibold text-green-800">Offre de service complète</span>
                      <p className="text-gray-600 text-xs mt-1">Service client dédié SunLib situé en France • Monitoring 24h/24h • Possibilité d'évolution</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                    <div>
                      <span className="font-semibold text-green-800">Flexibilité</span>
                      <p className="text-gray-600 text-xs mt-1">Choix de la durée d'abonnement de 10 à 25 ans, possibilité d'acquérir l'installation au bout de la 2ème année</p>
                    </div>
                  </div>
                </div>
                {virtualBattery && (
                  <div>
                    <div className="flex items-start mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 print:w-3 print:h-3 print:mr-2" />
                      <div>
                        <span className="font-semibold text-green-800">Batterie virtuelle incluse</span>
                        <p className="text-gray-600 text-xs mt-1">90% d'autoconsommation vs 60% sans batterie virtuelle</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Comment ça se passe ? */}
            <div className="bg-gray-50 p-3 rounded-lg print:p-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center print:text-base print:mb-2">
                <Calendar className="w-5 h-5 mr-2 text-green-600 print:w-4 print:h-4 print:mr-2" />
                Comment ça se passe ?
              </h3>
              <div className="space-y-3 text-sm print:text-sm">
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">1</span>
                  <div>
                    <span className="font-semibold">Signature du Devis d'abonnement</span>
                    <p className="text-gray-600 text-xs mt-1">Vous signez le devis d'abonnement personnalisé selon vos besoins</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">2</span>
                  <div>
                    <span className="font-semibold">Validation du projet par les équipes SunLib</span>
                    <p className="text-gray-600 text-xs mt-1">Les équipes SunLib procèdent aux vérifications nécessaires et valident votre projet</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">3</span>
                  <div>
                    <span className="font-semibold">Réception et signature du contrat d'abonnement SunLib</span>
                    <p className="text-gray-600 text-xs mt-1">Vous recevez et signez le contrat d'abonnement SunLib</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">4</span>
                  <div>
                    <span className="font-semibold">Signature du mandat SEPA et prélèvement de la caution</span>
                    <p className="text-gray-600 text-xs mt-1">Vous signez le mandat SEPA et vous êtes prélevé de 2 mois de caution</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">5</span>
                  <div>
                    <span className="font-semibold">Accord de la mairie</span>
                    <p className="text-gray-600 text-xs mt-1">Obtention de l'approbation de la mairie pour les travaux</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0 print:w-4 print:h-4 print:mr-2 print:text-xs">6</span>
                  <div>
                    <span className="font-semibold">Pose des panneaux et mise en service de l'installation</span>
                    <p className="text-gray-600 text-xs mt-1">Installation des panneaux solaires et mise en service. Démarrage de l'abonnement</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium">
                  ⚠️ Important : En cas de refus de la mairie, le contrat est annulé et le dépôt de garantie restitué
                </p>
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
                
                // Construction du contenu détaillé de l'email
                const economicAnalysisText = economicData && offer.economicAnalysis 
                  ? `\n\nÉTUDE ÉCONOMIQUE :\n- Production annuelle estimée : ${Math.round(economicData.annualProduction).toLocaleString()} kWh/an\n- Taux d'autoconsommation : ${virtualBattery ? '90%' : '60%'}${virtualBattery ? ' (avec batterie virtuelle)' : ''}\n- Économies brutes sur ${offer.duration} ans : ${formatCurrency(offer.economicAnalysis.totalSavings)}\n  • Économies électricité : ${formatCurrency(offer.economicAnalysis.totalElectricitySavings)}\n  • Revenus vente surplus : ${formatCurrency(offer.economicAnalysis.totalSales)}`
                  : '';
                
                const body = `Bonjour,

Veuillez trouver ci-dessous le résumé de votre offre SunLib :

DÉTAILS DE L'INSTALLATION :
- Puissance installée : ${power} kWc
- Abonnement mensuel : ${formatCurrency(displayPrice)} ${displayMode}
- Durée du contrat : ${offer.duration} ans
- Localisation : ${economicData?.address || 'Non spécifiée'}${economicAnalysisText}

AVANTAGES DE VOTRE ABONNEMENT SUNLIB :

✅ Pas d'apport initial
Zéro investissement initial : votre épargne reste intacte

✅ Pas d'emprunt
Préserve la capacité d'endettement et évite des démarches longues et complexes de demande de crédit

✅ Économies immédiates
Économies immédiates dès la première année • Factures d'électricité réduites

✅ Tranquillité d'esprit totale
En cas de panne, SunLib s'occupe de tout • Garantie de bon fonctionnement incluse

✅ Offre de service complète
Service client dédié SunLib situé en France • Monitoring 24h/24h • Possibilité d'évolution

✅ Flexibilité
Choix de la durée d'abonnement de 10 à 25 ans, possibilité d'acquérir l'installation au bout de la 2ème année

COMMENT ÇA SE PASSE ?

1️⃣ Signature du Devis d'abonnement
Vous signez le devis d'abonnement personnalisé selon vos besoins

2️⃣ Validation du projet par les équipes SunLib
Les équipes SunLib procèdent aux vérifications nécessaires et valident votre projet

3️⃣ Réception et signature du contrat d'abonnement SunLib
Vous recevez et signez le contrat d'abonnement SunLib

4️⃣ Signature du mandat SEPA et prélèvement de la caution
Vous signez le mandat SEPA et vous êtes prélevé de 2 mois de caution

5️⃣ Accord de la mairie
Obtention de l'approbation de la mairie pour les travaux

6️⃣ Pose des panneaux et mise en service de l'installation
Installation des panneaux solaires et mise en service. Démarrage de l'abonnement

⚠️ Important : En cas de refus de la mairie, le contrat est annulé et le dépôt de garantie restitué

Cette offre est valable 30 jours.

Cordialement,
Équipe SunLib`;
                
                // Créer un lien mailto avec gestion d'erreur
                try {
                  const mailtoLink = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
                  
                  // Vérifier la longueur de l'URL (limite ~2000 caractères pour la compatibilité)
                  if (mailtoLink.length > 2000) {
                    // Version simplifiée si trop long
                    const simpleBody = `Bonjour,

Résumé de votre offre SunLib :

- Puissance : ${power} kWc
- Abonnement : ${formatCurrency(displayPrice)} ${displayMode}/mois
- Durée : ${offer.duration} ans
- Localisation : ${economicData?.address || 'Non spécifiée'}${economicAnalysisText}

Pour plus de détails, consultez le résumé complet.

Cordialement,
Équipe SunLib`;
                    
                    window.open(`mailto:?subject=${subject}&body=${encodeURIComponent(simpleBody)}`, '_self');
                  } else {
                    window.open(mailtoLink, '_self');
                  }
                } catch (error) {
                  console.error('Erreur lors de l\'ouverture de l\'email:', error);
                  alert('Impossible d\'ouvrir le client email. Veuillez copier les informations manuellement.');
                }
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