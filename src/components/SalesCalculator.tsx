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
    const sellPrice = 0.40; // 40 cts/kWh (tarif de rachat EDF OA)
    
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
      
      // Coût total de l'abonnement sur la durée
      // On utilise les résultats calculés pour récupérer le montant mensuel
      const durations = [10, 15, 20, 25];
      let monthlyCost = 0;
      if (durations.includes(duration)) {
        const powerValue = parseFloat(power);
        const priceValue = parseFloat(installationPrice);
        if (powerValue && priceValue) {
          const rate = getVariableRates(duration, powerValue);
          const monthlyPaymentHT = calculateMonthlyPayment(priceValue, rate, duration * 12);
          monthlyCost = displayMode === 'HT' ? monthlyPaymentHT : monthlyPaymentHT * 1.20;
        }
      }
      const totalSubscriptionCost = monthlyCost * 12 * duration;
      
      // Économies nettes (après déduction de l'abonnement)
      const totalSavings = totalGrossSavings;
      
      return {
        duration,
        totalSavings,
        totalProduction,
        totalSelfConsumption,
        totalSales,
        totalElectricitySavings
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