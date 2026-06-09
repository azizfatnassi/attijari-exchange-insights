import { useMemo, useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Grid3X3, Loader2, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { CorrelationMatrix, getCorrelationMatrix, getIndicatorsHistory, IndicatorsHistory, getIndicatorsStats, IndicatorsStatsResponse, getIndicatorsVolatility, VolatilityResponse } from "@/services/api";
import useSWR from "swr";
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";



const HistoricalDataView = () => {
  const { data: historicalData, isLoading, error } = useSWR<IndicatorsHistory>(
    "indicators-history",
    getIndicatorsHistory
  );

  const indicators = useMemo(
    () => [
      { key: "tmm", name: "TMM (%)", color: "#f97316" },
      { key: "pib", name: "PIB (%)", color: "#dc2626" },
      { key: "inflation", name: "Inflation (%)", color: "#1a1a1a" },
      { key: "balance", name: "Balance (Mds TND)", color: "#fb923c" },
      { key: "chomage", name: "Chômage (%)", color: "#ef4444" },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <Skeleton className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !historicalData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-8 w-8" />
        <p className="mt-2 text-center">
          Une erreur est survenue lors du chargement de l'historique.
        </p>
      </div>
    );
  }

  const chartData = historicalData.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Évolution du taux TND/EUR</CardTitle>
          <CardDescription>
            Historique du taux de change sur les 12 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis
                  domain={["dataMin - 0.005", "dataMax + 0.005"]}
                  className="text-xs"
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
                  dataKey="tndeur"
                  name="TND/EUR"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {indicators.map((indicator) => (
          <Card key={indicator.key} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{indicator.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={indicator.key}
                      name={indicator.name}
                      stroke={indicator.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

const indicatorDetails: { [key: string]: { name: string; description: string } } = {
    TMM: { name: "Taux du Marché Monétaire (TMM)", description: "Le TMM est le taux d'intérêt au jour le jour sur le marché monétaire tunisien." },
    PIB: { name: "Produit Intérieur Brut (PIB)", description: "Le PIB mesure la richesse créée par le pays sur une période donnée." },
    "Inflation Rate": { name: "Taux d'Inflation", description: "L'inflation mesure la hausse générale des prix des biens et services." },
    "Balance Commerciale": { name: "Balance Commerciale", description: "La balance commerciale est la différence entre les exportations et les importations de biens." },
    "Unemployment Rate": { name: "Taux de Chômage", description: "Le taux de chômage mesure la part des actifs sans emploi." },
};

const getCorrelationColor = (value: number) => {
    if (value === 1) return "bg-primary";
    if (value >= 0.6) return "bg-green-500";
    if (value >= 0.3) return "bg-green-300";
    if (value >= -0.3) return "bg-muted";
    if (value >= -0.6) return "bg-red-300";
    return "bg-red-500";
};



type FeatureData = {
  name: string;
  value: number;
};



function CorrelationMatrixView() {
  const { data: matrix, error, isLoading } = useSWR<CorrelationMatrix>('correlation-matrix', getCorrelationMatrix);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !matrix) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-8 w-8" />
        <p className="mt-2 text-center">Une erreur est survenue.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-muted-foreground"></th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground">Price</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground">TMM</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground">PIB</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground">Inflation Rate</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground">Balance Commerciale</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground">Unemployment Rate</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.indicator}>
                <td className="p-2 text-sm font-medium text-foreground">{row.indicator}</td>
                {["Price", "TMM", "PIB", "Inflation Rate", "Balance Commerciale", "Unemployment Rate"].map((col) => (
                  <td key={col} className="p-2">
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold ${getCorrelationColor(row[col as keyof typeof row] as number)} ${Math.abs(row[col as keyof typeof row] as number) > 0.5 ? "text-white" : "text-foreground"}`}
                    >
                      {(row[col as keyof typeof row] as number)?.toFixed(2) ?? "N/A"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CorrelationInterpretation matrix={matrix} />
    </>
  );
}

function VolatilityView() {
  const [window, setWindow] = useState(12);
  const [selectedIndicator, setSelectedIndicator] = useState("Inflation Rate");
  const [metric, setMetric] = useState<"rolling_std" | "rolling_cv">("rolling_std");

  const { data, error, isLoading } = useSWR<VolatilityResponse>(
    `indicators-volatility-${window}`,
    () => getIndicatorsVolatility(window)
  );

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.dates.map((date, i) => ({
      date,
      value: data.volatility[selectedIndicator]?.[metric][i] ?? 0,
    }));
  }, [data, selectedIndicator, metric]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-8 w-8" />
        <p className="mt-2 text-center">Une erreur est survenue lors du chargement de la volatilité.</p>
      </div>
    );
  }

  const indicators = Object.keys(data.volatility);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="indicator-select" className="text-sm font-medium">Indicateur</label>
          <select
            id="indicator-select"
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {indicators.map((indicator) => (
              <option key={indicator} value={indicator}>{indicator}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="window-select" className="text-sm font-medium">Fenêtre</label>
          <select
            id="window-select"
            value={window}
            onChange={(e) => setWindow(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {[8, 12, 26, 52].map((w) => (
              <option key={w} value={w}>{w} semaines</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setMetric("rolling_std")} className={`px-3 py-1 text-sm rounded-md ${metric === 'rolling_std' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Volatilité Absolue (Std)</button>
          <button onClick={() => setMetric("rolling_cv")} className={`px-3 py-1 text-sm rounded-md ${metric === 'rolling_cv' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Volatilité Relative (CV)</button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Higher volatility = higher uncertainty / risk. Rolling window smooths short-term noise.
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
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
              dataKey="value"
              name={metric === 'rolling_std' ? 'Rolling Std' : 'Rolling CV'}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const IndicateursPage = () => {
  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard des Indicateurs Clés
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <TrendingUp className="mr-2 h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="correlation">
              <Grid3X3 className="mr-2 h-4 w-4" />
              Matrice de Corrélation
            </TabsTrigger>
            <TabsTrigger value="volatility">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analyse Vol
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <HistoricalDataView />
          </TabsContent>
          <TabsContent value="correlation">
            <CorrelationMatrixView />
          </TabsContent>
          <TabsContent value="volatility">
            <VolatilityView />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IndicateursPage;


function IndicatorStatsView() {
  const { data, error, isLoading } = useSWR<IndicatorsStatsResponse>('indicators-stats', getIndicatorsStats);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-8 w-8" />
        <p className="mt-2 text-center">Une erreur est survenue lors du chargement des statistiques.</p>
      </div>
    );
  }

  const stats = data.stats;
  const indicators = Object.keys(stats);

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Indicateur</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Moyenne</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Écart-type</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Minimum</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Maximum</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Médiane</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Asymétrie</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Aplatissement</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {indicators.slice(1).map((indicator) => (
            <tr key={indicator}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{indicator}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].mean.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].std.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].min.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].max.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].median.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].skew.toFixed(2)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{stats[indicator].kurtosis.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CorrelationInterpretation({ matrix }: { matrix: CorrelationMatrix }) {
  const tndEurCorrelations = useMemo(() => {
    const tndEurRow = matrix.find(row => row.indicator === "Price");
    if (!tndEurRow) return [];

    return Object.entries(tndEurRow)
      .filter(([key]) => key !== "indicator" && key !== "Price")
      .map(([key, value]) => ({
        indicator: key,
        value: value as number,
        abs: Math.abs(value as number)
      }))
      .sort((a, b) => b.abs - a.abs);
  }, [matrix]);

  const interpretations: { [key: string]: { positive: string; negative: string } } = {
    PIB: {
      positive: "Une croissance économique (hausse du PIB) est généralement corrélée avec une appréciation du dinar.",
      negative: "Une contraction économique (baisse du PIB) tend à affaiblir le dinar."
    },
    TMM: {
      positive: "Une hausse des taux directeurs (TMM) peut attirer des capitaux et renforcer le dinar.",
      negative: "Une baisse des taux directeurs (TMM) est souvent associée à une dépréciation du dinar pour stimuler l'économie."
    },
    "Inflation Rate": {
      positive: "Une inflation modérée peut parfois coïncider avec une croissance économique, soutenant le dinar.",
      negative: "Une forte inflation érode le pouvoir d'achat et exerce une pression à la baisse sur le dinar."
    },
    "Balance Commerciale": {
      positive: "Un excédent de la balance commerciale signifie plus de devises étrangères entrant, ce qui renforce le dinar.",
      negative: "Un déficit de la balance commerciale affaiblit la demande pour le dinar, le dépréciant."
    },
    "Unemployment Rate": {
      positive: "Une corrélation positive est atypique; elle pourrait indiquer des facteurs structurels complexes.",
      negative: "Une baisse du chômage signale une économie saine, ce qui tend à renforcer le dinar."
    }
  };

  return (
    <Card className="border-border/50 mt-6">
      <CardHeader>
        <CardTitle>Interprétation des corrélations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tndEurCorrelations.slice(0, 3).map(({ indicator, value }) => {
          const interpretationText = value >= 0
            ? interpretations[indicator]?.positive
            : interpretations[indicator]?.negative;

          if (!interpretationText) return null;

          const indicatorName = indicatorDetails[indicator]?.name || indicator;

          return (
            <div key={indicator} className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-semibold text-foreground">{indicatorName} vs TND/EUR ({value.toFixed(2)})</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {interpretationText}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}