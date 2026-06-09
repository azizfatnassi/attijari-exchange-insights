import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, BarChart3, Cpu, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  predictArimax,
  simulateProphet,
  ArimaxPrediction,
  ProphetSimulation,
  ArimaxInput,
  ProphetInput,
  simulateLstm,
  LstmSimulation,
  LstmInput,
  getIndicatorsHistory,
  IndicatorsHistory,
  getArimaPrediction,
  getLstmPrediction,
  getProphetPrediction,
  getIndicatorsHistory, // Keep this for now, might be used elsewhere
  getLastTwoMonthsPrice, // Import the new function
} from "@/services/api";
import type {
  ArimaPrediction,
  ProphetPrediction,
  LstmPrediction,
  IndicatorsHistory,
  PriceHistory, // Import the new type
} from "@/services/api";
import { useForm, Controller } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts";

interface PredictionResult {
  model: string;
  prediction: number;
  predictions?: number[];
  confidence?: { lower: number; upper: number };
  confidences?: { lower: number[]; upper: number[] };
  dates?: string[];
  timestamp: Date;
}

interface FormData {
  tmm: string;
  pib: string;
  inflation: string;
  balance: string;
  chomage: string;
}

const defaultValues: FormData = {
  tmm: "8.0",
  pib: "3.0",
  inflation: "9.0",
  balance: "-13.0",
  chomage: "15.3",
};

function SimulatorForm({
  modelId,
  modelName,
  modelColor,
  onPredict,
}: {
  modelId: string;
  modelName: string;
  modelColor: string;
  onPredict: (result: PredictionResult) => void;
}) {
  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();
  const [historicalData, setHistoricalData] = useState<{ date: string; actual: number }[]>([]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const history = await getLastTwoMonthsPrice();
        const formattedData = history.dates.map((date, index) => ({
          date: new Date(date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
          }),
          actual: history.price[index],
        }));
        setHistoricalData(formattedData);
      } catch (error) {
        console.error("Failed to fetch price history:", error);
        // Handle error appropriately
      }
    };

    fetchPriceHistory();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      let predictionResult: PredictionResult;

      const commonPayload = {
        PIB: parseFloat(formData.pib),
        Balance_Commerciale: parseFloat(formData.balance),
        TMM: parseFloat(formData.tmm),
      };

      if (modelId === "arima") {
        const arimaxInput: ArimaxInput = {
          ...commonPayload,
          Unemployment_Rate: parseFloat(formData.chomage),
          Inflation_Rate: parseFloat(formData.inflation),
        };
        const response = await predictArimax(arimaxInput);
        const firstPrediction = response.forecast[0];

        predictionResult = {
          model: modelName,
          prediction: Math.round(firstPrediction * 10000) / 10000,
          predictions: response.forecast.slice(0, 3),
          timestamp: new Date(),
        };
      } else if (modelId === "prophet") {
        const prophetInput: ProphetInput = {
          ...commonPayload,
          scenario_name: `Simulation ${modelName}`,
          Inflation_Rate: parseFloat(formData.inflation),
          Unemployment_Rate: parseFloat(formData.chomage),
        };
        const response = await simulateProphet(prophetInput);

        predictionResult = {
          model: modelName,
          prediction: Math.round(response.point_forecast * 10000) / 10000,
          confidence: {
            lower: Math.round(response.lower_bound * 10000) / 10000,
            upper: Math.round(response.upper_bound * 10000) / 10000,
          },
          dates: [response.date],
          timestamp: new Date(),
        };
      } else {
        const lstmInput: LstmInput = {
          scenario: [
            {
              PIB: parseFloat(formData.pib),
              Balance_Commerciale: parseFloat(formData.balance),
              TMM: parseFloat(formData.tmm),
              Inflation_Rate: parseFloat(formData.inflation),
            },
          ],
        };
        const response = await simulateLstm(lstmInput);
        const firstPrediction = response.simulated_prices[0];

        predictionResult = {
          model: modelName,
          prediction: Math.round(firstPrediction * 10000) / 10000,
          predictions: response.simulated_prices,
          timestamp: new Date(),
        };
      }

      setResult(predictionResult);
      onPredict(predictionResult);

      toast({
        title: "Prédiction effectuée",
        description: `Le modèle ${modelName} prédit un taux de ${predictionResult.prediction.toFixed(
          4
        )} TND/EUR`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description:
          "Impossible de contacter le serveur de prédiction. Vérifiez que le serveur est bien lancé.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = (() => {
    const baseData = historicalData.map(d => ({ date: d.date, actual: d.actual }));

    if (!result) {
      return baseData;
    }

    const lastHistoricalDate = historicalData.length > 0 
      ? new Date(historicalData[historicalData.length - 1].date.split('/').reverse().join('-')) 
      : new Date();

    if (result.model === "Prophet" && result.dates && result.prediction) {
      const predictionStartDate = new Date(lastHistoricalDate);
      predictionStartDate.setDate(predictionStartDate.getDate() + 1);

      const forecastData = result.dates.map((date, i) => ({
        date: new Date(predictionStartDate).toLocaleDateString("fr-FR", {
          month: "short",
          day: "numeric",
        }),
        prediction: result.prediction,
        lower: result.confidence?.lower,
        upper: result.confidence?.upper,
      }));
      return [...baseData, ...forecastData];
    }

    if (result.model === "ARIMA" && result.predictions) {
      const predictionStartDate = new Date(lastHistoricalDate);
      predictionStartDate.setDate(predictionStartDate.getDate() + 1);

      const forecastData = result.predictions.map((p, i) => {
        const futureDate = new Date(predictionStartDate);
        futureDate.setDate(predictionStartDate.getDate() + i);
        return {
          date: futureDate.toLocaleDateString("fr-FR", { month: 'short', day: 'numeric' }),
          prediction: p,
        };
      });
      return [...baseData, ...forecastData];
    }

    // For LSTM or other models
    if (result.predictions && result.dates) {
        const predictionStartDate = new Date(lastHistoricalDate);
        predictionStartDate.setDate(predictionStartDate.getDate() + 1);

        const forecastData = result.dates.map((date, i) => ({
            date: new Date(predictionStartDate).toLocaleDateString("fr-FR", { month: 'short', day: 'numeric' }),
            prediction: result.predictions ? result.predictions[i] : undefined,
            lower: result.confidences ? result.confidences.lower[i] : undefined,
            upper: result.confidences ? result.confidences.upper[i] : undefined,
        }));
        return [...baseData, ...forecastData];
    }

    // Fallback for single prediction point
    const predictionStartDate = new Date(lastHistoricalDate);
    predictionStartDate.setDate(predictionStartDate.getDate() + 1);

    return [
      ...baseData,
      {
        date: predictionStartDate.toLocaleDateString("fr-FR", { month: 'short', day: 'numeric' }),
        prediction: result.prediction,
        lower: result.confidence?.lower,
        upper: result.confidence?.upper,
      },
    ];
  })();

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor={`${modelId}-tmm`}>TMM (%)</Label>
            <Input
              id={`${modelId}-tmm`}
              type="number"
              step="0.1"
              value={formData.tmm}
              onChange={(e) => handleChange("tmm", e.target.value)}
              placeholder="8.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${modelId}-pib`}>PIB (%)</Label>
            <Input
              id={`${modelId}-pib`}
              type="number"
              step="0.1"
              value={formData.pib}
              onChange={(e) => handleChange("pib", e.target.value)}
              placeholder="3.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${modelId}-inflation`}>Inflation (%)</Label>
            <Input
              id={`${modelId}-inflation`}
              type="number"
              step="0.1"
              value={formData.inflation}
              onChange={(e) => handleChange("inflation", e.target.value)}
              placeholder="9.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${modelId}-balance`}>Balance (Mds)</Label>
            <Input
              id={`${modelId}-balance`}
              type="number"
              step="0.1"
              value={formData.balance}
              onChange={(e) => handleChange("balance", e.target.value)}
              placeholder="-13.0"
            />
          </div>
          {modelId !== "lstm" && (
            <div className="space-y-2">
              <Label htmlFor={`${modelId}-chomage`}>Chômage (%)</Label>
              <Input
                id={`${modelId}-chomage`}
                type="number"
                step="0.1"
                value={formData.chomage}
                onChange={(e) => handleChange("chomage", e.target.value)}
                placeholder="15.3"
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" style={{ backgroundColor: modelColor }}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            <>
              Lancer la prédiction
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Historique et prédiction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["dataMin - 0.005", "dataMax + 0.005"]}
                  allowDataOverflow
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Historique"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--muted-foreground))" }}
                />
                {result && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      name="Prédiction"
                      stroke={modelColor}
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: modelColor, r: 6 }}
                    />
                    {result.confidence && (
                      <>
                        <Line
                          type="monotone"
                          dataKey="lower"
                          name="Borne inférieure"
                          stroke={modelColor}
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="upper"
                          name="Borne supérieure"
                          stroke={modelColor}
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          dot={false}
                        />
                      </>
                    )}
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Result Card */}
          <Card className="border-2" style={{ borderColor: modelColor }}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">Prédiction {modelName}</div>
                  <div className="text-4xl font-bold" style={{ color: modelColor }}>
                    {typeof result.prediction === 'number' ? result.prediction.toFixed(4) : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">TND/EUR</div>
                </div>
                {result.confidence && (
                  <div className="text-center sm:text-right">
                    <div className="text-sm text-muted-foreground">Intervalle de confiance</div>
                    <div className="text-lg font-medium text-foreground">
                      [{result.confidence.lower.toFixed(4)} - {result.confidence.upper.toFixed(4)}]
                    </div>
                    <Badge variant="secondary">95%</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const simulators = [
  {
    id: "arima",
    name: "ARIMA",
    icon: TrendingUp,
    color: "#f97316",
  },
  {
    id: "prophet",
    name: "Prophet",
    icon: BarChart3,
    color: "#f97316",
  },
  {
    id: "lstm",
    name: "LSTM",
    icon: Cpu,
    color: "#f97316",
  },
];

export default function Simulateurs() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [activeTab, setActiveTab] = useState("arima");

  const handlePredict = (result: PredictionResult) => {
    setPredictions((prev) => {
      const filtered = prev.filter((p) => p.model !== result.model);
      return [...filtered, result];
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Calculator className="h-4 w-4" />
              Outils interactifs
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Simulateurs de <span className="text-gradient-attijari">Prédiction</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Entrez vos valeurs d'indicateurs économiques et obtenez une prédiction 
              du taux de change TND/EUR grâce à nos modèles d'IA.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-b border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Indicateurs</div>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div>
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Modèles IA</div>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div>
              <div className="text-2xl font-bold text-primary">Temps réel</div>
              <div className="text-sm text-muted-foreground">Prédictions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulators */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="arima" className="space-y-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              {simulators.map((sim) => (
                <TabsTrigger key={sim.id} value={sim.id} className="gap-2">
                  <sim.icon className="h-4 w-4" />
                  {sim.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {simulators.map((sim) => (
              <TabsContent key={sim.id} value={sim.id}>
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${sim.color}20`, color: sim.color }}
                      >
                        <sim.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Simulateur {sim.name}</CardTitle>
                        <CardDescription>
                          Entrez les valeurs des indicateurs économiques pour obtenir une prédiction
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SimulatorForm
                      modelId={sim.id}
                      modelName={sim.name}
                      modelColor={sim.color}
                      onPredict={handlePredict}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Recent Predictions Summary */}
          {predictions.length > 0 && (
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <CardTitle>Résumé des prédictions</CardTitle>
                <CardDescription>Dernières prédictions effectuées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {predictions.map((pred, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-muted/30 p-4 text-center"
                    >
                      <div className="text-sm font-medium text-muted-foreground">{pred.model}</div>
                      <div className="mt-1 text-2xl font-bold text-primary">
                        {pred.prediction.toFixed(4)}
                      </div>
                      <div className="text-xs text-muted-foreground">TND/EUR</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Instructions */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              Comment utiliser les simulateurs
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="font-semibold text-foreground">Choisissez un modèle</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sélectionnez ARIMA, Prophet ou LSTM selon vos besoins
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="font-semibold text-foreground">Entrez les indicateurs</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Renseignez les valeurs des 5 indicateurs économiques
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="font-semibold text-foreground">Obtenez la prédiction</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Visualisez le taux prédit avec son intervalle de confiance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
