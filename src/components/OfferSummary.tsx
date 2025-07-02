import React from 'react';
import { ArrowLeft, Zap, Calendar, Euro, TrendingUp, CheckCircle, AlertCircle, FileText, Printer, Users, Building2 } from 'lucide-react';

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
  onBack: () => void;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({ offer, power, clientType, displayMode, onBack }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-8">
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

        {/* En-tête de l'offre */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-12 h-12 mr-3" />
              <h1 className="text-4xl font-bold">SunLib</h1>
            </div>
            <h2 className="text-2xl font-semibold text-center">Résumé de votre offre solaire</h2>
            <div className="flex items-center justify-center mt-2">
              {clientType === 'particulier' ? (
                <Users className="w-5 h-5 mr-2" />
              ) : (
                <Building2 className="w-5 h-5 mr-2" />
              )}
              <p className="text-green-100">
                Abonnement {clientType} sur {offer.duration} ans
              </p>
            </div>
          </div>

          {/* Informations principales */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Détails de l'installation */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Zap className="w-5 h-5 text-green-600 mr-2" />
                  Détails de l'installation
                </h3>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Puissance installée</span>
                    <span className="font-semibold text-green-800">{power} kWc</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Type de client</span>
                    <span className="font-semibold text-green-800 capitalize">{clientType}</span>
                  </div>
                </div>
              </div>

              {/* Conditions financières */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Euro className="w-5 h-5 text-green-600 mr-2" />
                  Conditions financières
                </h3>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Durée du contrat</span>
                    <span className="font-semibold text-green-800">{offer.duration} ans</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Mensualité {displayMode}</span>
                    <span className="font-semibold text-green-800">{displayPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Revenus minimum requis</span>
                    <span className="font-semibold text-green-800">{offer.minRevenue.toLocaleString()} € / an</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Valeurs résiduelles - Tableau */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Évolution des valeurs résiduelles
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="bg-green-600 text-white px-4 py-3 text-left rounded-tl-lg">Année</th>
                        <th className="bg-green-600 text-white px-4 py-3 text-right rounded-tr-lg">Valeur résiduelle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offer.residualValues.map((residual, index) => (
                        <tr key={residual.year} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                          <td className="px-4 py-3 border-b border-green-200 font-medium text-gray-700">
                            Année {residual.year}
                          </td>
                          <td className="px-4 py-3 border-b border-green-200 text-right font-semibold text-green-800">
                            {residual.value.toLocaleString()} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800 text-center">
                    <strong>Valeur en année {lastResidualValue?.year} :</strong> {lastResidualValue?.value.toLocaleString()} €
                  </p>
                </div>
              </div>
            </div>

            {/* Avantages de l'offre */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">
                Avantages de votre abonnement SunLib
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {getClientAdvantages().map((advantage, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">{advantage.title}</p>
                      <p className="text-sm text-green-700">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processus de mise en place */}
            <div className="mt-8 bg-white border-2 border-green-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-6 text-center flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                Et concrètement, comment ça se passe ?
              </h3>
              
              <div className="space-y-4">
                {getCommonProcess().map((process, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {process.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800 mb-1">{process.title}</h4>
                      <p className="text-sm text-green-700">{process.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Important :</strong> En cas de refus de la mairie, le contrat est annulé et le dépôt de garantie restitué
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Document généré par l'outil d'aide à la vente SunLib</p>
          <p className="mt-1">Pour plus d'informations, contactez votre conseiller SunLib</p>
        </div>
      </div>
    </div>
  );
};

export default OfferSummary;
