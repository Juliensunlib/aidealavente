import React from 'react';
import { ArrowLeft, Zap, Calendar, Euro, TrendingUp, CheckCircle, AlertCircle, FileText, Printer, Users, Building2, Battery } from 'lucide-react';

interface OfferSummaryProps {
  offer: {
    duration: number;
    monthlyPayment: number;
    monthlyPaymentTTC: number;
    minRevenue: number;
    solvability: 'excellent' | 'good' | 'acceptable' | 'difficult';
    residualValues: { year: number; value: number }[];
  };
  power: number;
  clientType: 'particulier' | 'entreprise';
  displayMode: 'HT' | 'TTC';
  virtualBattery: boolean;
  onBack: () => void;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({ offer, power, clientType, displayMode, virtualBattery, onBack }) => {
  const getSolvabilityColor = (solvability: string) => {
    switch (solvability) {
      case 'excellent': return 'text-green-600 bg-green-100 border-green-200';
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'acceptable': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'difficult': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSolvabilityIcon = (solvability: string) => {
    switch (solvability) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />;
      case 'good': return <CheckCircle className="w-5 h-5" />;
      case 'acceptable': return <AlertCircle className="w-5 h-5" />;
      case 'difficult': return <AlertCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getSolvabilityText = (solvability: string) => {
    switch (solvability) {
      case 'excellent': return 'Excellente solvabilité';
      case 'good': return 'Bonne solvabilité';
      case 'acceptable': return 'Solvabilité acceptable';
      case 'difficult': return 'Solvabilité difficile';
      default: return '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const displayPrice = displayMode === 'HT' ? offer.monthlyPayment : offer.monthlyPaymentTTC;
  const lastResidualValue = offer.residualValues[offer.residualValues.length - 1];

  // Masquer la solvabilité pour tous les clients
  const shouldShowSolvability = false;

  // Avantages selon le type de client (basés sur les PDFs)
  const getClientAdvantages = () => {
    if (clientType === 'particulier') {
      return [
        {
          title: "Pas d'apport initial",
          description: "Zéro investissement initial : votre épargne reste intacte"
        },
        {
          title: "Pas d'emprunt",
          description: "Préserve la capacité d'endettement et évite des démarches longues et complexes de demande de crédit"
        },
        {
          title: "Économies immédiates",
          description: "Économies immédiates dès la première année • Factures d'électricité réduites"
        },
        {
          title: "Tranquillité d'esprit totale",
          description: "En cas de panne, SunLib s'occupe de tout • Garantie de bon fonctionnement incluse"
        },
        {
          title: "Offre de service complète",
          description: "Service client dédié SunLib situé en France • Monitoring 24h/24h • Possibilité d'évolution"
        },
        {
          title: "Flexibilité",
          description: "Choix de la durée d'abonnement de 10 à 25 ans, possibilité d'acquérir l'installation au bout de la 2ème année"
        }
      ];
    } else {
      return [
        {
          title: "Pas d'apport initial",
          description: "Aucun investissement • Préserve la trésorerie et évite l'immobilisation de capital (pas de CAPEX)"
        },
        {
          title: "Pas d'emprunt",
          description: "Préserve la capacité d'endettement • Pas d'engagement hors bilan pour les TPE/PME"
        },
        {
          title: "Économies immédiates",
          description: "Économies dès la première année • Factures d'électricité réduites nettes des frais d'abonnement"
        },
        {
          title: "Tranquillité d'esprit totale",
          description: "Garantie de bon fonctionnement • Monitoring 24h/24 et 7j/7 du système"
        },
        {
          title: "Offre de service complète",
          description: "APP SunLib pour le suivi • Service client dédié en France"
        },
        {
          title: "Avantages professionnels",
          description: "Possibilité d'acquérir l'installation au bout de la 5ème année • Protection contre les fluctuations du prix de l'électricité"
        }
      ];
    }
  };

  // Processus commun (basé sur le PDF "A mettre partout")
  const getCommonProcess = () => {
    return [
      {
        step: "1",
        title: "Étude personnalisée et Devis d'abonnement",
        description: "L'installateur vous recommande une solution technique et un abonnement en fonction de vos besoins. SunLib procède à la vérification de votre dossier"
      },
      {
        step: "2",
        title: "Signature du contrat SunLib",
        description: "Vous signez un contrat avec SunLib et choisissez le jour du prélèvement mensuel"
      },
      {
        step: "3",
        title: "Accord de la mairie",
        description: "L'installateur obtient l'approbation de la mairie pour les travaux*"
      },
      {
        step: "4",
        title: "Pose des panneaux",
        description: "Les panneaux solaires sont installés sur votre toit par l'Installateur"
      },
      {
        step: "5",
        title: "Prélèvement du dépôt de garantie",
        description: "Le dépôt de garantie de 2 mois d'abonnement est prélevé"
      },
      {
        step: "6",
        title: "Démarrage de l'abonnement",
        description: "Vous remplissez un formulaire via QR Code ou par email pour l'autorisation de prélèvement automatique"
      },
      {
        step: "7",
        title: "Optimisation de l'installation",
        description: "Vous utilisez l'application SunLib pour optimiser votre consommation pour encore + d'économies !"
      }
    ];
  };

  return (
    <>
      {/* Styles CSS pour l'impression */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              margin: 0;
              padding: 0;
              font-size: 10px;
            }
            
            .print-page-1 {
              page-break-after: always;
            }
            
            .print-page-2 {
              page-break-before: always;
            }
            
            .print-no-break {
              page-break-inside: avoid;
            }
            
            .print-compact {
              margin: 0 !important;
              padding: 5px !important;
            }
            
            .print-compact-header {
              padding: 8px !important;
            }
            
            .print-compact-section {
              margin-bottom: 8px !important;
              padding: 5px !important;
            }
            
            .print-small-text {
              font-size: 9px !important;
            }
            
            .print-grid {
              display: flex !important;
              flex-direction: row !important;
              gap: 10px !important;
            }
            
            .print-grid > div {
              flex: 1 !important;
            }
            
            .print-advantages-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 4px !important;
            }
            
            .print-advantages-item {
              font-size: 8px !important;
              margin-bottom: 4px !important;
            }
            
            .print-process-steps {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 4px !important;
            }
            
            .print-process-item {
              font-size: 8px !important;
              margin-bottom: 4px !important;
            }
            
            .print-table-container {
              display: flex !important;
              gap: 10px !important;
            }
            
            .print-table-container > div {
              flex: 1 !important;
            }
            
            .print-hide {
              display: none !important;
            }
            
            .print-page-1-content {
              padding: 10px !important;
              margin-bottom: 0 !important;
            }
            
            .print-page-2-content {
              padding: 20px !important;
              margin-top: 0 !important;
            }
            
            .print-advantages-compact {
              margin-top: 8px !important;
              margin-bottom: 8px !important;
              padding: 8px !important;
            }
            
            .print-process-compact {
              margin-top: 8px !important;
              margin-bottom: 0 !important;
              padding: 8px !important;
            }
            
            .print-header-compact h1 {
              font-size: 24px !important;
            }
            
            .print-header-compact h2 {
              font-size: 16px !important;
            }
            
            .print-section-title {
              font-size: 14px !important;
              margin-bottom: 5px !important;
            }
            
            .print-step-circle {
              width: 18px !important;
              height: 18px !important;
              font-size: 10px !important;
              margin-right: 8px !important;
            }
            
            .print-advantage-icon {
              width: 12px !important;
              height: 12px !important;
              margin-right: 6px !important;
            }
            
            .print-warning-box {
              margin-top: 8px !important;
              padding: 6px !important;
              font-size: 8px !important;
            }
          }
        `
      }} />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none">
          {/* Header avec bouton retour */}
          <div className="flex items-center justify-between mb-8 print-hide">
            <button
              onClick={onBack}
              className="flex items-center text-green-700 hover:text-green-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux résultats
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
          </div>

          {/* PAGE 1 - Contenu principal */}
          <div className="print-page-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 print:rounded-none print:shadow-none print:mb-0 print-page-1-content">
              {/* En-tête de l'offre */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 print-compact-header print:bg-green-600 print-header-compact">
                <div className="flex items-center justify-center mb-4 print:mb-2">
                  <Zap className="w-12 h-12 mr-3 print:w-8 print:h-8 print:mr-2" />
                  <h1 className="text-4xl font-bold">SunLib</h1>
                </div>
                <h2 className="text-2xl font-semibold text-center">Résumé de votre offre solaire</h2>
                <div className="flex items-center justify-center mt-2 print:mt-1">
                  {clientType === 'particulier' ? (
                    <Users className="w-5 h-5 mr-2 print:w-4 print:h-4" />
                  ) : (
                    <Building2 className="w-5 h-5 mr-2 print:w-4 print:h-4" />
                  )}
                  <p className="text-green-100 print:text-sm">
                    Abonnement {clientType} sur {offer.duration} ans
                  </p>
                </div>
              </div>

              {/* Informations principales */}
              <div className="p-8 print-compact">
                <div className="grid md:grid-cols-2 gap-8 mb-8 print-grid print:mb-4">
                  {/* Détails de l'installation */}
                  <div className="space-y-6 print:space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center print-section-title">
                      <Zap className="w-5 h-5 text-green-600 mr-2 print:w-4 print:h-4" />
                      Détails de l'installation
                    </h3>
                    
                    <div className="bg-green-50 p-4 rounded-lg print:p-2">
                      <div className="flex justify-between items-center mb-2 print:mb-1">
                        <span className="text-gray-700 print:text-xs">Puissance installée</span>
                        <span className="font-semibold text-green-800 print:text-xs">{power} kWc</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 print:mb-1">
                        <span className="text-gray-700 print:text-xs">Type de client</span>
                        <span className="font-semibold text-green-800 capitalize print:text-xs">{clientType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 print:text-xs flex items-center">
                          <Battery className="w-4 h-4 mr-1 print:w-3 print:h-3" />
                          Batterie virtuelle
                        </span>
                        <span className={`font-semibold print:text-xs ${virtualBattery ? 'text-green-800' : 'text-gray-500'}`}>
                          {virtualBattery ? 'Incluse' : 'Non incluse'}
                        </span>
                      </div>
                    </div>

                    {/* Information supplémentaire sur la batterie virtuelle si incluse */}
                    {virtualBattery && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 print:p-2 print:bg-blue-50">
                        <div className="flex items-start">
                          <Battery className="w-4 h-4 text-blue-600 mr-2 mt-0.5 print:w-3 print:h-3" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 print:text-xs">
                              Batterie virtuelle SunLib
                            </p>
                            <p className="text-xs text-blue-700 print:text-xs">
                              Stockage intelligent de votre surplus d'énergie
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conditions financières */}
                  <div className="space-y-6 print:space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center print-section-title">
                      <Euro className="w-5 h-5 text-green-600 mr-2 print:w-4 print:h-4" />
                      Conditions financières
                    </h3>
                    
                    <div className="bg-green-50 p-4 rounded-lg print:p-2">
                      <div className="flex justify-between items-center mb-2 print:mb-1">
                        <span className="text-gray-700 print:text-xs">Durée du contrat</span>
                        <span className="font-semibold text-green-800 print:text-xs">{offer.duration} ans</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 print:mb-1">
                        <span className="text-gray-700 print:text-xs">Mensualité {displayMode}</span>
                        <span className="font-semibold text-green-800 print:text-xs">{displayPrice.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 print:text-xs">
                          {clientType === 'entreprise' ? 'Solvabilité :' : 'Revenus minimum requis'}
                        </span>
                        <span className="font-semibold text-green-800 print:text-xs text-sm">
                          {clientType === 'entreprise' 
                            ? 'Validation sous réserve étude SunLib'
                            : `${offer.minRevenue.toLocaleString()} € / an`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avantages de l'offre */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg print-advantages-compact">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 text-center print-section-title print:mb-2">
                    Avantages de votre abonnement SunLib
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 print-advantages-grid">
                    {getClientAdvantages().map((advantage, index) => (
                      <div key={index} className="flex items-start print-advantages-item">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0 print-advantage-icon" />
                        <div>
                          <p className="font-medium text-green-800 print:text-xs print:font-semibold">{advantage.title}</p>
                          <p className="text-sm text-green-700 print:text-xs">{advantage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processus de mise en place */}
                <div className="mt-8 bg-white border-2 border-green-200 p-6 rounded-lg print-process-compact">
                  <h3 className="text-xl font-semibold text-green-800 mb-6 text-center flex items-center justify-center print-section-title print:mb-3">
                    <Calendar className="w-5 h-5 mr-2 print:w-4 print:h-4" />
                    Et concrètement, comment ça se passe ?
                  </h3>
                  
                  <div className="space-y-4 print-process-steps print:space-y-1">
                    {getCommonProcess().map((process, index) => (
                      <div key={index} className="flex items-start print-process-item">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 print-step-circle">
                          {process.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-green-800 mb-1 print:text-xs print:font-semibold print:mb-0">{process.title}</h4>
                          <p className="text-sm text-green-700 print:text-xs">{process.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg print-warning-box">
                    <p className="text-sm text-yellow-800 text-center print:text-xs">
                      <strong>Important :</strong> En cas de refus de la mairie, le contrat est annulé et le dépôt de garantie restitué
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2 - Valeurs résiduelles */}
          <div className="print-page-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 print:rounded-none print:shadow-none print:mb-0 print-page-2-content">
              {/* En-tête page 2 */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 print-compact-header print:bg-green-600">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-12 h-12 mr-3" />
                  <h1 className="text-4xl font-bold">SunLib</h1>
                </div>
                <h2 className="text-2xl font-semibold text-center">Évolution des valeurs résiduelles</h2>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <p className="text-green-100">
                    Valeurs calculées en {displayMode}
                  </p>
                </div>
              </div>

              {/* Valeurs résiduelles */}
              <div className="p-8 print-compact">
                <div className="bg-gray-50 p-6 rounded-lg print:bg-white print:p-3 print:border print:border-gray-300">
                  <div className="grid md:grid-cols-2 gap-6 print-table-container print:gap-3">
                    {/* Première colonne */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="bg-green-600 text-white px-4 py-3 text-left rounded-tl-lg">Année</th>
                            <th className="bg-green-600 text-white px-4 py-3 text-right rounded-tr-lg">Valeur résiduelle ({displayMode})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offer.residualValues.slice(0, Math.ceil(offer.residualValues.length / 2)).map((residual, index) => (
                            <tr key={residual.year} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50 print:bg-gray-100'}>
                              <td className="px-4 py-3 border-b border-green-200 font-medium text-gray-700 print:px-2 print:py-1 print-small-text">
                                Année {residual.year}
                              </td>
                              <td className="px-4 py-3 border-b border-green-200 text-right font-semibold text-green-800 print:px-2 print:py-1 print-small-text">
                                {residual.value.toLocaleString()} €
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Deuxième colonne */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="bg-green-600 text-white px-4 py-3 text-left rounded-tl-lg">Année</th>
                            <th className="bg-green-600 text-white px-4 py-3 text-right rounded-tr-lg">Valeur résiduelle ({displayMode})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offer.residualValues.slice(Math.ceil(offer.residualValues.length / 2)).map((residual, index) => (
                            <tr key={residual.year} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50 print:bg-gray-100'}>
                              <td className="px-4 py-3 border-b border-green-200 font-medium text-gray-700 print:px-2 print:py-1 print-small-text">
                                Année {residual.year}
                              </td>
                              <td className="px-4 py-3 border-b border-green-200 text-right font-semibold text-green-800 print:px-2 print:py-1 print-small-text">
                                {residual.value.toLocaleString()} €
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-100 rounded-lg print:mt-2 print:p-2 print:bg-gray-100">
                    <p className="text-sm text-green-800 text-center print-small-text print:text-gray-800">
                      <strong>Valeurs résiduelles calculées en {displayMode}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm print-hide">
            <p>Document généré par l'outil d'aide à la vente SunLib</p>
            <p className="mt-1">Pour plus d'informations, contactez votre conseiller SunLib</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferSummary;
