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

  // Avantages selon le type de client
  const getClientAdvantages = () => {
    if (clientType === 'particulier') {
      return [
        {
          title: "Installation clé en main",
          description: "Prise en charge complète de votre projet"
        },
        {
          title: "Maintenance incluse",
          description: "Suivi et entretien pendant toute la durée"
        },
        {
          title: "Taux variable avantageux",
          description: "Profitez de conditions financières optimales"
        },
        {
          title: "Valeur résiduelle garantie",
          description: "Récupérez la valeur de votre installation"
        },
        {
          title: "Économies d'énergie",
          description: "Réduisez vos factures d'électricité"
        },
        {
          title: "Transition écologique",
          description: "Contribuez à la protection de l'environnement"
        }
      ];
    } else {
      return [
        {
          title: "Solution professionnelle",
          description: "Adaptée aux besoins des entreprises"
        },
        {
          title: "Optimisation fiscale",
          description: "Déductibilité des charges d'exploitation"
        },
        {
          title: "Performance garantie",
          description: "Monitoring et maintenance professionnels"
        },
        {
          title: "Image RSE",
          description: "Renforcez votre engagement environnemental"
        },
        {
          title: "Maîtrise des coûts",
          description: "Prévisibilité budgétaire sur la durée"
        },
        {
          title: "Accompagnement expert",
          description: "Support technique et commercial dédié"
        }
      ];
    }
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

            {/* Valeurs résiduelles */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Évolution des valeurs résiduelles
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {offer.residualValues.map((residual) => (
                    <div key={residual.year} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Année {residual.year}</p>
                        <p className="font-semibold text-green-800">{residual.value.toLocaleString()} €</p>
                      </div>
                    </div>
                  ))}
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
