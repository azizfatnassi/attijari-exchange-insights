import { z } from 'zod';

const API_BASE_URL = 'http://127.0.0.1:8081';

// Schemas for input validation
const ArimaxInputSchema = z.object({
  PIB: z.number(),
  Unemployment_Rate: z.number(),
  Balance_Commerciale: z.number(),
  TMM: z.number(),
  Inflation_Rate: z.number(),
});
export type ArimaxInput = z.infer<typeof ArimaxInputSchema>;

const ProphetInputSchema = z.object({
  scenario_name: z.string(),
  PIB: z.number(),
  Balance_Commerciale: z.number(),
  TMM: z.number(),
  Unemployment_Rate: z.number(),
  Inflation_Rate: z.number(),
});

const LstmInputSchema = z.object({
  scenario: z.array(
    z.object({
      PIB: z.number(),
      TMM: z.number(),
      Inflation_Rate: z.number(),
      Balance_Commerciale: z.number(),
    })
  ),
});

// Schemas for output validation
const ArimaxResponseSchema = z.object({
  uses: z.array(z.string()),
  forecast: z.array(z.number()),
});

const ProphetResponseSchema = z.object({
  scenario: z.string(),
  date: z.string(),
  point_forecast: z.number(),
  lower_bound: z.number(),
  upper_bound: z.number(),
});



export const CorrelationRowSchema = z.object({
  indicator: z.string(),
  Price: z.number().nullable(),
  PIB: z.number().nullable(),
  "Balance Commerciale": z.number().nullable(),
  TMM: z.number().nullable(),
  "Unemployment Rate": z.number().nullable(),
  "Inflation Rate": z.number().nullable(),
});

export const CorrelationMatrixSchema = z.array(CorrelationRowSchema);

const RawCorrelationApiResponseSchema = z.object({
  correlation_matrix: z.record(z.string(), z.record(z.string(), z.number())),
});


export const SensitivityInputSchema = z.object({
  horizon: z.number().int().positive(),
  shock: z.number(),
  PIB: z.number(),
  Balance_Commerciale: z.number(),
  TMM: z.number(),
  Unemployment_Rate: z.number(),
  Inflation_Rate: z.number(),
});
export type SensitivityInput = z.infer<typeof SensitivityInputSchema>;

export const SensitivityResponseSchema = z.object({
  horizon: z.number(),
  shock: z.number(),
  sensitivity: z.record(z.string(), z.array(z.number())),
});
export type SensitivityResponse = z.infer<typeof SensitivityResponseSchema>;

// Frontend-friendly schema
export const TransformedSensitivityDataSchema = z.object({
  indicator: z.string(),
  data: z.array(z.object({
    horizon: z.number(),
    value: z.number(),
  })),
});
export type TransformedSensitivityData = z.infer<typeof TransformedSensitivityDataSchema>;


export const IndicatorsHistorySchema = z.array(
  z.object({
    date: z.string(),
    tndeur: z.number().nullable(),
    tmm: z.number().nullable(),
    pib: z.number().nullable(),
    inflation: z.number().nullable(),
    balance: z.number().nullable(),
    chomage: z.number().nullable(),
  })
);
export type IndicatorsHistory = z.infer<typeof IndicatorsHistorySchema>;

// Raw schema from API for historical data
const RawIndicatorsHistoryApiResponseSchema = z.object({
  dates: z.array(z.string()),
  "Unnamed: 0": z.array(z.any()).optional(),
  Price: z.array(z.number().nullable()).optional(),
  PIB: z.array(z.number().nullable()).optional(),
  "Balance Commerciale": z.array(z.number().nullable()).optional(),
  TMM: z.array(z.number().nullable()).optional(),
  "Unemployment Rate": z.array(z.number().nullable()).optional(),
  "Inflation Rate": z.array(z.number().nullable()).optional(),
});

// Schemas for Model Comparison
export const CompareInputSchema = z.object({
  horizon: z.number().int().positive(),
  PIB: z.number(),
  Balance_Commerciale: z.number(),
  TMM: z.number(),
  Unemployment_Rate: z.number(),
  Inflation_Rate: z.number(),
});
export type CompareInput = z.infer<typeof CompareInputSchema>;

const LstmResponseSchema = z.object({
  uses: z.array(z.string()),
  ignored: z.array(z.string()).optional(),
  forecast: z.array(z.number()),
});

const VolatilityMetricSchema = z.object({
  rolling_std: z.array(z.number()),
  rolling_cv: z.array(z.number()),
});

export const VolatilityResponseSchema = z.object({
  window: z.number(),
  dates: z.array(z.string()),
  volatility: z.record(z.string(), VolatilityMetricSchema),
});

export type VolatilityResponse = z.infer<typeof VolatilityResponseSchema>;

const ModelsResponseSchema = z.object({
  ARIMAX: ArimaxResponseSchema,
  Prophet: ProphetResponseSchema,
  LSTM: LstmResponseSchema,
});

const CompareProphetResponseSchema = z.object({
  uses: z.array(z.string()),
  point_forecast: z.array(z.number()),
  lower: z.array(z.number()),
  upper: z.array(z.number()),
});

const CompareModelsResponseSchema = z.object({
  ARIMAX: ArimaxResponseSchema,
  Prophet: CompareProphetResponseSchema,
  LSTM: LstmResponseSchema,
});

const CompareResponseSchema = z.object({
  horizon: z.number(),
  models: CompareModelsResponseSchema,
});

// Transformed, frontend-friendly schema
const ForecastPointSchema = z.object({
  date: z.string(),
  value: z.number(),
  lower: z.number().optional(),
  upper: z.number().optional(),
});

export const TransformedModelComparisonSchema = z.object({
  uses: z.array(z.string()),
  ignored: z.array(z.string()).optional(),
  forecast: z.array(ForecastPointSchema),
});

export const ModelsComparisonSchema = z.object({
  ARIMAX: TransformedModelComparisonSchema,
  Prophet: TransformedModelComparisonSchema,
  LSTM: TransformedModelComparisonSchema,
});
export type ModelsComparison = z.infer<typeof ModelsComparisonSchema>;


// Mock Data for Model Comparison
const mockComparisonData: ModelsComparison = {
  ARIMAX: {
    uses: ["PIB", "Balance Commerciale", "TMM", "Unemployment Rate"],
    forecast: [
      { date: "2024-08-01", value: 0.305 },
      { date: "2024-08-02", value: 0.306 },
      { date: "2024-08-03", value: 0.307 },
    ],
  },
  Prophet: {
    uses: ["PIB", "Balance Commerciale", "TMM", "Unemployment Rate", "Inflation Rate"],
    forecast: [
      { date: "2024-08-01", value: 0.308, lower: 0.300, upper: 0.316 },
      { date: "2024-08-02", value: 0.309, lower: 0.301, upper: 0.317 },
      { date: "2024-08-03", value: 0.310, lower: 0.302, upper: 0.318 },
    ],
  },
  LSTM: {
    uses: ["PIB", "Balance Commerciale", "TMM", "Inflation Rate", "Price (auto-filled)"],
    ignored: ["Unemployment Rate"],
    forecast: [
      { date: "2024-08-01", value: 0.306 },
      { date: "2024-08-02", value: 0.307 },
      { date: "2024-08-03", value: 0.308 },
    ],
  },
};

const mockVolatilityData: VolatilityResponse = {
  window: 12,
  dates: ["2012-01-02", "2012-01-09", "2012-01-16"],
  volatility: {
    "Inflation Rate": {
      rolling_std: [0.1, 0.12, 0.11],
      rolling_cv: [0.05, 0.06, 0.055],
    },
    TMM: {
      rolling_std: [0.5, 0.55, 0.52],
      rolling_cv: [0.1, 0.11, 0.105],
    },
    Price: {
      rolling_std: [10, 12, 11],
      rolling_cv: [0.02, 0.024, 0.022],
    },
  },
};


export async function getIndicatorsVolatility(window = 12): Promise<VolatilityResponse> {
  const response = await fetch(`${API_BASE_URL}/api/indicators/volatility?window=${window}`);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch indicator volatility: ${response.status} ${text}`);
  }
  const data = await response.json();
  return VolatilityResponseSchema.parse(data);
}

// API function for model comparison
export async function getModelsComparison(input: CompareInput): Promise<ModelsComparison> {
  const response = await fetch(`${API_BASE_URL}/api/predict/compare1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  const rawData = await response.json();
  const validatedData = CompareResponseSchema.parse(rawData);

  const today = new Date();
  const generateDates = (horizon: number) => {
    return Array.from({ length: horizon }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    });
  };

  const dates = generateDates(validatedData.horizon);

  const transformedData: ModelsComparison = {
    ARIMAX: {
      uses: validatedData.models.ARIMAX.uses,
      forecast: validatedData.models.ARIMAX.forecast.map((value, i) => ({
        date: dates[i],
        value,
      })),
    },
    Prophet: {
      uses: validatedData.models.Prophet.uses,
      forecast: validatedData.models.Prophet.point_forecast.map((value, i) => ({
        date: dates[i],
        value,
        lower: validatedData.models.Prophet.lower[i],
        upper: validatedData.models.Prophet.upper[i],
      })),
    },
    LSTM: {
      uses: validatedData.models.LSTM.uses,
      ignored: validatedData.models.LSTM.ignored,
      forecast: validatedData.models.LSTM.forecast.map((value, i) => ({
        date: dates[i],
        value,
      })),
    },
  };

  return transformedData;
}


// Type definitions
export const FeatureImportanceSchema = z.object({
  indicator: z.string(),
  importance: z.number(),
});
export const FeatureImportanceResponseSchema = z.array(FeatureImportanceSchema);
export type FeatureImportanceResponse = z.infer<typeof FeatureImportanceResponseSchema>;

// Schemas for Indicator Statistics
export const IndicatorStatsSchema = z.object({
  mean: z.number(),
  std: z.number(),
  min: z.number(),
  max: z.number(),
  median: z.number(),
  skew: z.number(),
  kurtosis: z.number(),
});
export const IndicatorsStatsResponseSchema = z.object({
  stats: z.record(z.string(), IndicatorStatsSchema)
});
export type IndicatorsStatsResponse = z.infer<typeof IndicatorsStatsResponseSchema>;


export type CorrelationMatrix = z.infer<typeof CorrelationMatrixSchema>;

export const predictArimax = async (data: ArimaxInput): Promise<ArimaxResponse> => {
  const validatedData = ArimaxInputSchema.parse(data);
  const response = await fetch(`${API_BASE_URL}/predict/arimax`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ARIMAX prediction');
  }

  const result = await response.json();

  // Transform the backend response to match the frontend schema
  const transformedResult = {
    uses: ["PIB", "Unemployment_Rate", "Balance_Commerciale", "TMM"],
    forecast: result.next_10_predictions || [],
  };

  return ArimaxResponseSchema.parse(transformedResult);
};

export const simulateProphet = async (data: ProphetInput): Promise<ProphetResponse> => {
  const validatedData = ProphetInputSchema.parse(data);
  const response = await fetch(`${API_BASE_URL}/simulate/prophet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Failed to fetch Prophet simulation:', errorBody);
    throw new Error(`Failed to fetch Prophet simulation: ${errorBody}`);
  }

  const result = await response.json();
  return ProphetResponseSchema.parse(result);
};

export const getCorrelationMatrix = async (): Promise<CorrelationMatrix> => {
  const response = await fetch(`${API_BASE_URL}/api/indicators/correlation`);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch correlation matrix: ${response.status} ${text}`);
  }
  const data = await response.json();
  const rawData = RawCorrelationApiResponseSchema.parse(data);

  const matrix = rawData.correlation_matrix;
  const transformedData = Object.keys(matrix).map((indicatorName) => ({
    indicator: indicatorName,
    ...matrix[indicatorName],
  }));

  return CorrelationMatrixSchema.parse(transformedData);
};



export const getIndicatorsStats = async (): Promise<IndicatorsStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/indicators/stats`);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch indicators stats: ${response.status} ${text}`);
  }
  const data = await response.json();
  return IndicatorsStatsResponseSchema.parse(data);
};





const LstmSimulationResponseSchema = z.any();

export const simulateLstm = async (data: LstmInput): Promise<any> => {
  const validatedData = LstmInputSchema.parse(data);
  const response = await fetch(`${API_BASE_URL}/simulate/LSTM`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LSTM simulation');
  }

  const result = await response.json();
  return LstmSimulationResponseSchema.parse(result);
};

export const getIndicatorsHistory = async (): Promise<IndicatorsHistory> => {
  const response = await fetch(`${API_BASE_URL}/api/indicators/history?months=2`);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch indicators history: ${response.status} ${text}`);
  }
  const data = await response.json();
  const rawData = RawIndicatorsHistoryApiResponseSchema.parse(data);

  // Transform data from columnar to row-based
  const transformedData = rawData.dates.map((d, i) => ({
    date: d,
    tndeur: rawData.Price?.[i] ?? 0,
    pib: rawData.PIB?.[i] ?? 0,
    balance: rawData["Balance Commerciale"]?.[i] ?? 0,
    tmm: rawData.TMM?.[i] ?? 0,
    chomage: rawData["Unemployment Rate"]?.[i] ?? 0,
    inflation: rawData["Inflation Rate"]?.[i] ?? 0,
  }));

  return IndicatorsHistorySchema.parse(transformedData);
};





const PriceHistorySchema = z.object({
  dates: z.array(z.string()),
  price: z.array(z.number()),
});
export type PriceHistory = z.infer<typeof PriceHistorySchema>;

export const getLastTwoMonthsPrice = async (): Promise<PriceHistory> => {
  const response = await fetch(`${API_BASE_URL}/api/price/last-2-months`);
  if (!response.ok) {
    throw new Error("Failed to fetch last two months price");
  }
  const data = await response.json();
  return PriceHistorySchema.parse(data);
};


