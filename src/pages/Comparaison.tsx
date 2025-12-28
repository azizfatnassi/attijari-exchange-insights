import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GitCompare, TrendingUp, BarChart3, Cpu, Loader2, ArrowRight, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface FormData {
  tmm: string;
  pib: string;
  inflation: string;
  balance: string;
  chomage: string;
}

interface ModelPrediction {
  model: string;
  prediction: number;
  confidence?: { lower: number; upper: number };
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const defaultValues: FormData = {
  tmm: "8.0",
  pib: "3.0",
  inflation: "9.0",
  balance: "-13.0",
  chomage: "15.0",
};

// Mock historical data
const historicalData = [
  { date: "Juin 2023", actual: 0.295 },
  { date: "Juil 2023", actual: 0.298 },
  { date: "Août 2023", actual: 0.301 },
  { date: "Sep 2023", actual: 0.300 },
  { date: "Oct 2023", actual: 0.298 },
  { date: "Nov 2023", actual: 0.295 },
  { date: "Déc 2023", actual: 0.297 },
  { date: "Jan 2024", actual: 0.299 },
  { date: "Fév 2024", actual: 0.296 },
  { date: "Mar 2024", actual: 0.294 },
];

export default function Comparaison() {
  const [formData, setFormData] = useState<FormData>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<ModelPrediction[]>([]);
  const { toast } = useToast();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock predictions for all models
      const basePrediction = 0.298;
      const tmmEffect = (parseFloat(formData.tmm) - 8) * -0.002;
      const inflationEffect = (parseFloat(formData.inflation) - 9) * -0.003;
      const balanceEffect = (parseFloat(formData.balance) + 13) * 0.001;

      const arimaPred = basePrediction + tmmEffect + inflationEffect + balanceEffect + 0.001;
      const prophetPred = basePrediction + tmmEffect + inflationEffect + balanceEffect - 0.002;
      const lstmPred = basePrediction + tmmEffect + inflationEffect + balanceEffect;

      setPredictions([
        {
          model: "ARIMA",
          prediction: Math.round(arimaPred * 10000) / 10000,
          confidence: { 
            lower: Math.round((arimaPred - 0.008) * 10000) / 10000, 
            upper: Math.round((arimaPred + 0.008) * 10000) / 10000 
          },
          color: "hsl(var(--chart-1))",
          icon: TrendingUp,
        },
        {
          model: "Prophet",
          prediction: Math.round(prophetPred * 10000) / 10000,
          confidence: { 
            lower: Math.round((prophetPred - 0.010) * 10000) / 10000, 
            upper: Math.round((prophetPred + 0.010) * 10000) / 10000 
          },
          color: "hsl(var(--chart-2))",
          icon: BarChart3,
        },
        {
          model: "LSTM",
          prediction: Math.round(lstmPred * 10000) / 10000,
          color: "hsl(var(--chart-3))",
          icon: Cpu,
        },
      ]);

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

  const chartData = predictions.length > 0
    ? [
        ...historicalData,
        {
          date: "Prédiction",
          actual: undefined,
          arima: predictions.find((p) => p.model === "ARIMA")?.prediction,
          prophet: predictions.find((p) => p.model === "Prophet")?.prediction,
          lstm: predictions.find((p) => p.model === "LSTM")?.prediction,
        },
      ]
    : historicalData;

  const bestModel = predictions.length > 0
    ? predictions.reduce((best, current) => 
        current.prediction > best.prediction ? current : best
      )
    : null;

  const avgPrediction = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.prediction, 0) / predictions.length
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
                Entrez les valeurs des indicateurs économiques pour comparer les prédictions des 3 modèles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-2">
                    <Label htmlFor="tmm">TMM (%)</Label>
                    <Input
                      id="tmm"
                      type="number"
                      step="0.1"
                      value={formData.tmm}
                      onChange={(e) => handleChange("tmm", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pib">PIB (%)</Label>
                    <Input
                      id="pib"
                      type="number"
                      step="0.1"
                      value={formData.pib}
                      onChange={(e) => handleChange("pib", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inflation">Inflation (%)</Label>
                    <Input
                      id="inflation"
                      type="number"
                      step="0.1"
                      value={formData.inflation}
                      onChange={(e) => handleChange("inflation", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Balance (Mds)</Label>
                    <Input
                      id="balance"
                      type="number"
                      step="0.1"
                      value={formData.balance}
                      onChange={(e) => handleChange("balance", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chomage">Chômage (%)</Label>
                    <Input
                      id="chomage"
                      type="number"
                      step="0.1"
                      value={formData.chomage}
                      onChange={(e) => handleChange("chomage", e.target.value)}
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
      {predictions.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            {/* Summary Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              {predictions.map((pred) => (
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
                    <div className="text-sm text-muted-foreground">TND/EUR</div>
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
                      <div className="text-sm text-muted-foreground">Moyenne des prédictions</div>
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
                      <div className="text-sm text-muted-foreground">Écart entre modèles</div>
                      <div className="text-3xl font-bold text-foreground">
                        {(Math.max(...predictions.map((p) => p.prediction)) -
                          Math.min(...predictions.map((p) => p.prediction))).toFixed(4)}
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
                      <YAxis domain={[0.28, 0.32]} tick={{ fontSize: 12 }} />
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
                      <Line
                        type="monotone"
                        dataKey="arima"
                        name="ARIMA"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ fill: "hsl(var(--chart-1))", r: 6 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="prophet"
                        name="Prophet"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ fill: "hsl(var(--chart-2))", r: 6 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="lstm"
                        name="LSTM"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ fill: "hsl(var(--chart-3))", r: 6 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
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
                    {predictions.length > 0 &&
                      Math.max(...predictions.map((p) => p.prediction)) -
                        Math.min(...predictions.map((p) => p.prediction)) <
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
