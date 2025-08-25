import React, { useState } from 'react';
import { Calculator, Zap, CheckCircle, AlertCircle, TrendingUp, ArrowLeft, FileText, Users, Building2, ChevronUp, ChevronDown, Battery, MapPin, Loader } from 'lucide-react';
import OfferSummary from './OfferSummary';
import AddressSearch from './AddressSearch';
import MapView from './MapView';
import EconomicAnalysis from './EconomicAnalysis';
import { EconomicData } from '../types';
import { getPVGISData } from '../services/pvgis';

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

const SalesCalculator: React.FC = () => {
  const [power, setPower] = useState<string>('');
  const [installationPrice, setInstallationPrice] = useState<string>('');
  const [clientType, setClientType] = useState<'particulier' | 'entreprise'>('particulier');
  const [displayMode, setDisplayMode] = useState<'HT' | 'TTC'>('TTC');
  const [virtualBattery, setVirtualBattery] = useState<boolean>(false);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showOfferSummary, setShowOfferSummary] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  
  // Nouveaux états pour l'étude économique
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [electricityPrice, setElectricityPrice] = useState<string>('0.25');
  const [annualProduction, setAnnualProduction] = useState<number | null>(null);
  const [isLoadingPVGIS, setIsLoadingPVGIS] = useState(false);
  const [economicData, setEconomicData] = useState<EconomicData | null>(null);

  // Données de prix maximum par puissance (jusqu'à 36 kWc)
  const maxPricesHT = [
    5200, 5500, 6290, 6750, 7542, 8333, 9250, 10083, 10833, 11417, 12000, 12500, 13083, 13667, 14167,
    14635, 15170, 15700, 16230, 16765, 17300, 17833, 18380, 18900, 19450, 20000, 20700, 21390, 22080,
    22770, 23460, 24150, 24840, 25530, 26220, 26910, 27600, 28290, 28980, 29670, 30360, 31050, 31740,
    32430, 33120, 33810, 34500, 35190, 35880, 36570, 37260, 37950, 38640, 39330, 40020, 40710, 41400,
    42090, 42780, 43470, 44160, 44850, 45540, 46230, 46920, 47610, 48300, 48990, 49680
  ];

  // Pourcentages pour les valeurs résiduelles
  const residualPercentages = {
    25: [106.0, 105.0, 104.0, 103.0, 102.0, 101.0, 99.0, 96.0, 95.0, 94.0, 93.0, 92.0, 91.0, 90.0, 87.0, 80.0, 71.0, 64.0, 55.0, 46.0, 36.0, 24.0, 12.8],
    20: [106.0, 105.0, 104.0, 103.0, 102.0, 100.0, 96.0, 93.0, 90.0, 86.0, 80.0, 75.0, 66.0, 59.0, 47.4, 37.8, 24.0, 12.9],
    15: [97.5, 95.0, 93.0, 91.0, 89.0, 86.0, 81.0, 75.0, 69.0, 61.0, 51.0, 37.0, 13.8],
    10: [94.0, 91.0, 87.0, 81.0, 71.0, 60.0, 42.0, 15.5]
  };

  // Taux variables uniquement
  const getVariableRates = (duration: number, powerValue: number) => {
    const variableRates = {
      25: [8.50, 8.50, 8.50, 9.10, 9.20, 9.30, 9.34, 9.39, 9.50, 9.60, 9.71, 9.80, 9.85, 9.89, 10.00, 10.10, 10.22, 10.30, 10.35, 10.40, 10.48, 10.60, 10.70, 10.80, 10.90, 11.00],
      20: [8.75, 8.75, 8.75, 9.35, 9.45, 9.55, 9.59, 9.64, 9.75, 9.85, 9.96, 10.05, 10.10, 10.14, 10.25, 10.35, 10.47, 10.55, 10.60, 10.65, 10.73, 10.85, 10.95, 11.05, 11.15, 11.25],
      15: [9.10, 9.10, 9.10, 9.70, 9.80, 9.90, 9.94, 9.99, 10.10, 10.20, 10.31, 10.40, 10.45, 10.49, 10.60, 10.70, 10.82, 10.90, 10.95, 11.00, 11.08, 11.20, 11.30, 11.40, 11.50, 11.60],
      10: [10.00, 10.00, 10.00, 10.60, 10.70, 10.80, 10.84, 10.89, 11.00, 11.10, 11.21, 11.30, 11.35, 11.39, 11.50, 11.60, 11.72, 11.80, 11.85, 11.90, 11.98, 12.10, 12.20, 12.30, 12.40, 12.50],
    };

    let index = Math.floor((powerValue - 2) / 0.5);
    
    // Pour les puissances > 36 kWc, utiliser les paramètres du 36 kWc (dernier index)
    if (powerValue > 36) {
      index = 25; // Index correspondant à 36 kWc
    } else {
      index = Math.max(0, Math.min(index, 25));
    }
    
    const rateArray = variableRates[duration as keyof typeof variableRates];
    const rate = index < rateArray.length ? rateArray[index] : rateArray[rateArray.length - 1];
    
    return rate / 100;
  };

  const calculateMonthlyPayment = (capital: number, rate: number, months: number) => {
    const monthlyRate = rate / 12;
    const payment = capital * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(payment * 100) / 100;
  };

  const calculateMinRevenue = (monthlyPayment: number): number => {
    // L'abonnement ne doit pas dépasser 4% des revenus annuels
    // Donc revenus annuels minimum = (mensualité * 12) / 0.04
    const annualPayment = monthlyPayment * 12;
    const minAnnualRevenue = annualPayment / 0.04;
    return Math.round(minAnnualRevenue);
  };

  const getSolvability = (monthlyPayment: number): 'excellent' | 'good' | 'acceptable' | 'difficult' => {
    if (monthlyPayment <= 150) return 'excellent';
    if (monthlyPayment <= 250) return 'good';
    if (monthlyPayment <= 400) return 'acceptable';
    return 'difficult';
  };

  const calculateResidualValues = (initialPrice: number, duration: number) => {
    const percentages = residualPercentages[duration as keyof typeof residualPercentages];
    return percentages.map((percentage, index) => {
      const valueHT = Math.round((initialPrice * percentage / 100) * 100) / 100;
      const valueTTC = Math.round((valueHT * 1.20) * 100) / 100;
      return {
        year: index + 2,
        value: valueHT,
        valueTTC: valueTTC
      };
    });
  };

  const handleAddressSelect = async (selectedAddress: string, lat: number, lng: number) => {
    setAddress(selectedAddress);
    setLatitude(lat);
    setLongitude(lng);
    
    // Calculer automatiquement le productible si on a la puissance
    const powerValue = parseFloat(power);
    if (power && !isNaN(powerValue) && powerValue >= 2) {
      await calculatePVGISProduction(lat, lng, powerValue);
    }
  };

  const calculatePVGISProduction = async (lat: number, lng: number, powerValue: number) => {
    setIsLoadingPVGIS(true);
    try {
      const production = await getPVGISData(lat, lng, powerValue);
      setAnnualProduction(production);
    } catch (error) {
      console.error('Erreur PVGIS:', error);
      setError('Impossible de récupérer les données de production solaire');
    } finally {
      setIsLoadingPVGIS(false);
    }
  };

  const calculateEconomicAnalysis = (powerValue: number, production: number, monthlyBillValue: number, electricityPriceValue: number) => {
    const selfConsumptionRate = virtualBattery ? 0.9 : 0.6;
    const sellPrice = 0.04; // 4 cts/kWh (tarif de rachat EDF OA)
    
    const durations = [10, 15, 20, 25, 30];
    const economicAnalysis = durations.map((duration, index) => {
      const totalProduction = production * duration;
      const totalSelfConsumption = totalProduction * selfConsumptionRate;
      const totalSurplus = totalProduction - totalSelfConsumption;
      
      // Économies sur l'électricité (ce qu'on n'achète plus)
      const totalElectricitySavings = totalSelfConsumption * electricityPriceValue;
      
      // Revenus de la vente du surplus
      const totalSales = totalSurplus * sellPrice;
      
      // Économies brutes
      const totalGrossSavings = totalElectricitySavings + totalSales;
      
      // Économies brutes = total sur la durée d'analyse
      const totalSavings = totalGrossSavings;
      
      return {
        duration,
        totalSavings,
        totalProduction,
        totalSelfConsumption,
        totalSales,
        totalElectricitySavings,
        // Nouvelles données pour l'analyse nette
        annualGrossSavings: totalGrossSavings / duration,
        totalGrossSavings
      };
    });

    const economicDataObj: EconomicData = {
      address,
      latitude: latitude!,
      longitude: longitude!,
      monthlyBill: monthlyBillValue,
      electricityPrice: electricityPriceValue,
      annualProduction: production,
      selfConsumptionRate,
      sellPrice,
      economicAnalysis
    };

    setEconomicData(economicDataObj);
    return economicAnalysis;
  };
  const handleCalculate = () => {
    setError('');
    const powerValue = parseFloat(power);
    const priceValue = parseFloat(installationPrice);
    const monthlyBillValue = parseFloat(monthlyBill);
    const electricityPriceValue = parseFloat(electricityPrice);

    if (!power || power.trim() === '' || !priceValue || isNaN(powerValue) || powerValue < 2) {
      setError('Veuillez saisir une puissance valide (≥ 2 kWc) et un prix d\'installation.');
      return;
    }

    // Vérifications pour l'étude économique
    if (!address || !latitude || !longitude) {
      setError('Veuillez sélectionner une adresse pour l\'étude économique.');
      return;
    }

    if (!annualProduction) {
      setError('Données de production solaire non disponibles. Veuillez réessayer.');
      return;
    }

    if (!monthlyBillValue || !electricityPriceValue) {
      setError('Veuillez saisir la facture mensuelle et le prix de l\'électricité.');
      return;
    }
    // Vérification du plafond de prix SEULEMENT pour les puissances ≤ 36 kWc
    if (powerValue <= 36) {
      const index = Math.round((powerValue - 2) / 0.5);
      const maxPrice = maxPricesHT[Math.min(index, maxPricesHT.length - 1)];

      if (priceValue > maxPrice) {
        setError(`Prix HT dépasse le plafond autorisé (${maxPrice.toLocaleString()} €). Hors tarif Sunlib.`);
        return;
      }
    }
    // Pour les puissances > 36 kWc, pas de limitation de prix

    // Calculer l'analyse économique
    const economicAnalysisData = calculateEconomicAnalysis(
      powerValue,
      annualProduction,
      monthlyBillValue,
      electricityPriceValue
    );

    const durations = [10, 15, 20, 25];
    const calculationResults: CalculationResult[] = durations.map(duration => {
      const rate = getVariableRates(duration, powerValue);
      const monthlyPaymentHT = calculateMonthlyPayment(priceValue, rate, duration * 12);
      const monthlyPaymentTTC = monthlyPaymentHT * 1.20;
      const monthlyPayment = displayMode === 'HT' ? monthlyPaymentHT : monthlyPaymentTTC;
      const minRevenue = calculateMinRevenue(monthlyPayment);
      const solvability = getSolvability(monthlyPayment);
      const residualValues = calculateResidualValues(priceValue, duration);
      
      // Trouver l'analyse économique correspondante
      const economicAnalysis = economicAnalysisData.find(analysis => analysis.duration === duration);
      
      return {
        duration,
        monthlyPayment: monthlyPaymentHT,
        monthlyPaymentTTC,
        minRevenue,
        solvability,
        residualValues,
        economicAnalysis
      };
    });

    setResults(calculationResults);
    setShowResults(true);
    setIsFormCollapsed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      {showOfferSummary && selectedOffer ? (
        <OfferSummary
          offer={selectedOffer}
          economicData={economicData}
          power={parseFloat(power)}
          clientType={clientType}
          displayMode={displayMode}
          virtualBattery={virtualBattery}
          onBack={() => setShowOfferSummary(false)}
        />
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-12 h-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Outil d'aide à la vente SunLib</h1>
            </div>
            <p className="text-xl text-gray-600">Calculateur d'abonnement solaire avec étude économique</p>
          </div>

          {/* Formulaire principal */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div 
              className="bg-green-600 text-white p-4 cursor-pointer flex items-center justify-between"
              onClick={() => setIsFormCollapsed(!isFormCollapsed)}
            >
              <div className="flex items-center">
                <Calculator className="w-6 h-6 mr-3" />
                <h2 className="text-xl font-semibold">Paramètres du projet</h2>
              </div>
              {isFormCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </div>
            
            {!isFormCollapsed && (
              <div className="p-6 space-y-6">
                {/* Type de client et mode d'affichage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de client
                    </label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setClientType('particulier')}
                        className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                          clientType === 'particulier'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Particulier
                      </button>
                      <button
                        onClick={() => setClientType('entreprise')}
                        className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                          clientType === 'entreprise'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <Building2 className="w-5 h-5 mr-2" />
                        Entreprise
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Mode d'affichage
                    </label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setDisplayMode('HT')}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          displayMode === 'HT'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        HT
                      </button>
                      <button
                        onClick={() => setDisplayMode('TTC')}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          displayMode === 'TTC'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        TTC
                      </button>
                    </div>
                  </div>
                </div>

                {/* Batterie virtuelle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={virtualBattery}
                      onChange={(e) => setVirtualBattery(e.target.checked)}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="flex items-center">
                      <Battery className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Inclure la batterie virtuelle (90% d'autoconsommation vs 60%)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Paramètres techniques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puissance de l'installation (kWc)
                    </label>
                    <input
                      type="number"
                      value={power}
                      onChange={(e) => {
                        const newPower = e.target.value;
                        setPower(newPower);
                        
                        // Recalculer le productible si on a une adresse
                        const powerValue = parseFloat(newPower);
                        if (latitude && longitude && !isNaN(powerValue) && powerValue >= 2) {
                          calculatePVGISProduction(latitude, longitude, powerValue);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 6"
                      min="2"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix d'installation HT (€)
                    </label>
                    <input
                      type="number"
                      value={installationPrice}
                      onChange={(e) => setInstallationPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 12000"
                    />
                  </div>
                </div>

                {/* Localisation */}
                <div className="space-y-4">
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    selectedAddress={address}
                    onError={setError}
                  />
                  
                  {latitude && longitude && (
                    <MapView
                      latitude={latitude}
                      longitude={longitude}
                      address={address}
                      onLocationChange={async (lat, lng) => {
                        setLatitude(lat);
                        setLongitude(lng);
                        
                        // Recalculer le productible avec la nouvelle position
                        const powerValue = parseFloat(power);
                        if (powerValue && !isNaN(powerValue) && powerValue >= 2) {
                          await calculatePVGISProduction(lat, lng, powerValue);
                        }
                      }}
                    />
                  )}
                </div>

                {/* Données économiques */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Données pour l'étude économique
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Facture mensuelle d'électricité (€)
                      </label>
                      <input
                        type="number"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Prix de l'électricité (€/kWh)
                      </label>
                      <input
                        type="number"
                        value={electricityPrice}
                        onChange={(e) => setElectricityPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 0.25"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Production annuelle estimée
                      </label>
                      <div className="flex items-center">
                        {isLoadingPVGIS ? (
                          <div className="flex items-center text-blue-600">
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            <span className="text-sm">Calcul en cours...</span>
                          </div>
                        ) : annualProduction ? (
                          <span className="text-lg font-semibold text-blue-800">
                            {Math.round(annualProduction).toLocaleString()} kWh/an
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Sélectionnez une adresse et une puissance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton de calcul */}
                <div className="text-center">
                  <button
                    onClick={handleCalculate}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center mx-auto"
                  >
                    <Calculator className="w-6 h-6 mr-2" />
                    Calculer les abonnements
                  </button>
                </div>

                {/* Affichage des erreurs */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Résultats */}
          {showResults && results.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Résultats des calculs</h2>
                <p className="text-gray-600">Abonnements SunLib disponibles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((result) => {
                  const displayPrice = displayMode === 'HT' ? result.monthlyPayment : result.monthlyPaymentTTC;
                  const solvabilityColors = {
                    excellent: 'border-green-500 bg-green-50',
                    good: 'border-blue-500 bg-blue-50',
                    acceptable: 'border-yellow-500 bg-yellow-50',
                    difficult: 'border-red-500 bg-red-50'
                  };
                  const solvabilityLabels = {
                    excellent: 'Excellent',
                    good: 'Bon',
                    acceptable: 'Acceptable',
                    difficult: 'Difficile'
                  };

                  return (
                    <div key={result.duration} className={`bg-white rounded-xl shadow-lg border-2 ${solvabilityColors[result.solvability]} overflow-hidden`}>
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800">{result.duration} ans</h3>
                          <p className="text-3xl font-bold text-green-600 mt-2">
                            {Math.round(displayPrice).toLocaleString()} €
                          </p>
                          <p className="text-sm text-gray-600">par mois {displayMode}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          {clientType === 'particulier' && (
                            <div>
                              <p className="text-gray-600">Revenus minimum requis</p>
                              <p className="font-semibold">{result.minRevenue.toLocaleString()} € / an</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-600">Solvabilité</p>
                            <p className="font-semibold">{solvabilityLabels[result.solvability]}</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <button
                            onClick={() => {
                              setSelectedDuration(result.duration);
                            }}
                            className={`w-full px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                              selectedDuration === result.duration
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 hover:border-green-300'
                            }`}
                          >
                            {selectedDuration === result.duration ? 'Analyse affichée' : 'Voir analyse économique'}
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedOffer(result);
                              setShowOfferSummary(true);
                            }}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Résumé d'offre
                          </button>
                        </div>
                      </div>

                      {/* Analyse économique */}
                      {selectedDuration === result.duration && economicData && (
                        <EconomicAnalysis
                          economicData={economicData}
                          selectedDuration={result.duration}
                          displayMode={displayMode}
                          virtualBattery={virtualBattery}
                          monthlySubscription={displayMode === 'HT' ? result.monthlyPayment : result.monthlyPaymentTTC}
                          subscriptionDuration={result.duration}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SalesCalculator;