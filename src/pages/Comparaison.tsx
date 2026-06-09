import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GitCompare, TrendingUp, BarChart3, Cpu, Loader2, ArrowRight, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getModelsComparison,
  ModelsComparison,
  getLastTwoMonthsPrice, // Changed from getIndicatorsHistory
  PriceHistory, // Using the correct type for price history
} from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { CompareInput } from "@/services/api";


const defaultValues: CompareInput = {
  horizon: 3,
  PIB: 3.0,
  Balance_Commerciale: -13.0,
  TMM: 8.0,
  Unemployment_Rate: 15.0,
  Inflation_Rate: 9.0,
};


export default function Comparaison() {
  const [formData, setFormData] = useState<CompareInput>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ModelsComparison | null>(null);
  const [priceHistory, setPriceHistory] = useState<{ date: string; value: number }[]>([]); // State for price history
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch last two months of price data
        const historyData: PriceHistory = await getLastTwoMonthsPrice();
        // Transform the data for the chart
        const transformedHistory = historyData.dates.map((date, index) => ({
          date,
          value: historyData.price[index],
        }));
        setPriceHistory(transformedHistory);
      } catch (error) {
        console.error("Failed to fetch price history", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des prix.",
          variant: "destructive",
        });
      }
    };
    fetchHistory();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setComparisonData(null);

    try {
      const data = await getModelsComparison(formData);
      setComparisonData(data);

      toast({
        title: "Comparaison effectuée",
        description: "Les 3 modèles ont généré leurs prédictions",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur de prédiction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = (() => {
    if (!priceHistory.length) return [];

    const historicalChartData = priceHistory.map(point => ({
      date: new Date(point.date).toLocaleDateString("fr-FR", { month: 'short', day: 'numeric' }),
      Historique: point.value,
    }));

    if (!comparisonData) return historicalChartData;

    const lastHistoricalPoint = priceHistory[priceHistory.length - 1];
    const lastHistoricalDate = new Date(lastHistoricalPoint.date);

    let arimaxPrice = lastHistoricalPoint.value;
    let prophetPrice = lastHistoricalPoint.value;
    let lstmPrice = lastHistoricalPoint.value;

    const forecastChartData = comparisonData.ARIMAX.forecast.map((_, i) => {
      const predictionDate = new Date(lastHistoricalDate);
      predictionDate.setDate(predictionDate.getDate() + (i + 1) * 7);

      const baseProphetPrice = prophetPrice;

      arimaxPrice = comparisonData.ARIMAX.forecast[i].value;
      prophetPrice = comparisonData.Prophet.forecast[i].value;
      lstmPrice = comparisonData.LSTM.forecast[i].value;

      const prophetLowerPrice = comparisonData.Prophet.forecast[i].lower ?? prophetPrice;
      const prophetUpperPrice = comparisonData.Prophet.forecast[i].upper ?? prophetPrice;

      return {
        date: predictionDate.toLocaleDateString("fr-FR", { month: 'short', day: 'numeric' }),
        ARIMAX: arimaxPrice,
        Prophet: prophetPrice,
        "Prophet (intervalle)": [prophetLowerPrice, prophetUpperPrice],
        LSTM: lstmPrice,
      };
    });

    const lastHistDataPoint = historicalChartData[historicalChartData.length - 1];
    if (lastHistDataPoint) {
      lastHistDataPoint.ARIMAX = lastHistoricalPoint.value;
      lastHistDataPoint.Prophet = lastHistoricalPoint.value;
      lastHistDataPoint.LSTM = lastHistoricalPoint.value;
      lastHistDataPoint["Prophet (intervalle)"] = [lastHistoricalPoint.value, lastHistoricalPoint.value];
    }

    return [...historicalChartData, ...forecastChartData];
  })();

  const latestPredictions = comparisonData
    ? [
        {
          model: "ARIMAX",
          prediction: comparisonData.ARIMAX.forecast[0]?.value ?? 0,
          color: "hsl(var(--chart-1))",
          icon: TrendingUp,
        },
        {
          model: "Prophet",
          prediction: comparisonData.Prophet.forecast[0]?.value ?? 0,
          color: "hsl(var(--chart-2))",
          icon: BarChart3,
        },
        {
          model: "LSTM",
          prediction: comparisonData.LSTM.forecast[0]?.value ?? 0,
          color: "hsl(var(--chart-3))",
          icon: Cpu,
        },
      ]
    : [];

  const bestModel = latestPredictions.length > 0
    ? latestPredictions.reduce((best, current) =>
        current.prediction > best.prediction ? current : best
      )
    : null;

  const avgPrediction = latestPredictions.length > 0
    ? latestPredictions.reduce((sum, p) => sum + p.prediction, 0) / latestPredictions.length
    : 0;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <GitCompare className="h-4 w-4" />
              Analyse comparative
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Comparaison des <span className="text-gradient-attijari">Modèles</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comparez simultanément les prédictions de nos trois modèles IA 
              et visualisez les écarts entre chaque approche.
            </p>
          </div>
        </div>
      </section>

      {/* Input Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl border-border/50">
            <CardHeader>
              <CardTitle>Paramètres de simulation</CardTitle>
              <CardDescription>
                Entrez les valeurs des indicateurs économiques pour comparer les prédictions des 3 modèles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="horizon">Horizon (jours)</Label>
                    <Input
                      id="horizon"
                      type="number"
                      step="1"
                      min="1"
                      value={formData.horizon}
                      onChange={(e) => setFormData({ ...formData, horizon: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pib">PIB (%)</Label>
                    <Input
                      id="pib"
                      type="number"
                      step="0.1"
                      value={formData.PIB}
                      onChange={(e) => setFormData({ ...formData, PIB: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tmm">TMM (%)</Label>
                    <Input
                      id="tmm"
                      type="number"
                      step="0.1"
                      value={formData.TMM}
                      onChange={(e) => setFormData({ ...formData, TMM: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inflation">Inflation (%)</Label>
                    <Input
                      id="inflation"
                      type="number"
                      step="0.1"
                      value={formData.Inflation_Rate}
                      onChange={(e) => setFormData({ ...formData, Inflation_Rate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Balance Commerciale (Mds)</Label>
                    <Input
                      id="balance"
                      type="number"
                      step="0.1"
                      value={formData.Balance_Commerciale}
                      onChange={(e) => setFormData({ ...formData, Balance_Commerciale: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chomage">Taux de chômage (%)</Label>
                    <Input
                      id="chomage"
                      type="number"
                      step="0.1"
                      value={formData.Unemployment_Rate}
                      onChange={(e) => setFormData({ ...formData, Unemployment_Rate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Calcul des 3 modèles en cours...
                    </>
                  ) : (
                    <>
                      Comparer les modèles
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {comparisonData && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            {/* Summary Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              {latestPredictions.map((pred) => (
                <Card
                  key={pred.model}
                  className={`border-2 transition-all ${
                    pred.model === bestModel?.model ? "border-primary shadow-lg" : "border-border/50"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${pred.color}20`, color: pred.color }}
                        >
                          <pred.icon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base">{pred.model}</CardTitle>
                      </div>
                      {pred.model === bestModel?.model && (
                        <Badge className="bg-primary">
                          <Trophy className="mr-1 h-3 w-3" />
                          Meilleur
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: pred.color }}>
                      {pred.prediction.toFixed(4)}
                    </div>
                    <div className="text-sm text-muted-foreground">TND/EUR (J+1)</div>
                    {pred.confidence && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        IC 95%: [{pred.confidence.lower.toFixed(4)} - {pred.confidence.upper.toFixed(4)}]
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Average and Spread */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Moyenne des prédictions (J+1)</div>
                      <div className="text-3xl font-bold text-foreground">{avgPrediction.toFixed(4)}</div>
                      <div className="text-sm text-muted-foreground">TND/EUR</div>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Écart entre modèles (J+1)</div>
                      <div className="text-3xl font-bold text-foreground">
                        {(Math.max(...latestPredictions.map((p) => p.prediction)) -
                          Math.min(...latestPredictions.map((p) => p.prediction))).toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">TND/EUR</div>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                      <span className="text-2xl">📏</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Historique et prédictions comparées</CardTitle>
                <CardDescription>
                  Visualisez les prédictions des 3 modèles sur le même graphique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => typeof value === 'number' ? value.toFixed(3) : ''}
                        domain={['dataMin', 'dataMax']}
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
                        dataKey="Historique"
                        name="Historique"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="ARIMAX"
                        name="ARIMAX"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="Prophet (intervalle)"
                        name="Prophet Intervalle de Confiance"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.2}
                        strokeOpacity={0.4}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Prophet"
                        name="Prophet"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="LSTM"
                        name="LSTM"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Variables Used/Ignored */}
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <CardTitle>Analyse des variables par modèle</CardTitle>
                <CardDescription>
                  Comprenez quelles variables chaque modèle a utilisées ou ignorées pour ses prédictions.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                {comparisonData && Object.entries(comparisonData).map(([modelName, modelData]) => (
                  <div key={modelName}>
                    <h4 className="mb-2 font-semibold text-foreground">{modelName}</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="mb-2 text-sm font-medium text-muted-foreground">Variables utilisées</h5>
                        <div className="flex flex-wrap gap-2">
                          {modelData.uses.length > 0 ? (
                            modelData.uses.map(variable => (
                              <Badge key={variable} variant="secondary">{variable}</Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Aucune</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-2 text-sm font-medium text-muted-foreground">Variables ignorées</h5>
                        <div className="flex flex-wrap gap-2">
                          {modelData.ignored && modelData.ignored.length > 0 ? (
                            modelData.ignored.map(variable => (
                              <Badge key={variable} variant="outline">{variable}</Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Aucune</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interpretation */}
            <Card className="mt-8 border-border/50">
              <CardHeader>
                <CardTitle>Interprétation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-foreground">Consensus des modèles</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {latestPredictions.length > 0 &&
                      Math.max(...latestPredictions.map((p) => p.prediction)) -
                        Math.min(...latestPredictions.map((p) => p.prediction)) <
                        0.005
                      ? "Les trois modèles convergent vers une prédiction similaire, ce qui renforce la confiance dans le résultat."
                      : "Les modèles présentent des écarts significatifs, suggérant une incertitude plus élevée sur la prédiction."}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-foreground">Recommandation</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    La moyenne des prédictions ({avgPrediction.toFixed(4)} TND/EUR) peut être utilisée comme 
                    estimation centrale. Considérez l'écart entre les modèles pour évaluer le niveau d'incertitude.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </Layout>
  );
}
