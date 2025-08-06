export interface EconomicData {
  address: string;
  latitude: number;
  longitude: number;
  monthlyBill: number;
  electricityPrice: number;
  annualProduction: number;
  selfConsumptionRate: number;
  sellPrice: number;
  economicAnalysis: {
    duration: number;
    totalSavings: number;
    totalGrossSavings?: number;
    totalSubscriptionCost?: number;
    totalProduction: number;
    totalSelfConsumption: number;
    totalSales: number;
    totalElectricitySavings: number;
  }[];
}

export interface PVGISResponse {
  outputs: {
    totals: {
      fixed: {
        'E_y': number; // Annual PV energy production [kWh/year]
      };
    };
  };
}

export interface GeoportailResponse {
  features: Array<{
    properties: {
      label: string;
      score: number;
    };
    geometry: {
      coordinates: [number, number];
    };
  }>;
}