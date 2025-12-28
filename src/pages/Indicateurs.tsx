import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Grid3X3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Mock historical data
const historicalData = [
  { date: "Jan 2023", tndeur: 0.30, tmm: 8.0, pib: 3.2, inflation: 10.1, balance: -15.2, chomage: 15.2 },
  { date: "Fév 2023", tndeur: 0.29, tmm: 8.0, pib: 3.1, inflation: 10.3, balance: -14.8, chomage: 15.4 },
  { date: "Mar 2023", tndeur: 0.29, tmm: 8.0, pib: 3.0, inflation: 10.2, balance: -15.1, chomage: 15.3 },
  { date: "Avr 2023", tndeur: 0.30, tmm: 8.0, pib: 2.9, inflation: 10.0, balance: -14.5, chomage: 15.5 },
  { date: "Mai 2023", tndeur: 0.30, tmm: 8.0, pib: 2.8, inflation: 9.8, balance: -14.2, chomage: 15.6 },
  { date: "Juin 2023", tndeur: 0.29, tmm: 8.0, pib: 2.9, inflation: 9.5, balance: -13.8, chomage: 15.4 },
  { date: "Juil 2023", tndeur: 0.29, tmm: 8.0, pib: 3.0, inflation: 9.3, balance: -13.5, chomage: 15.2 },
  { date: "Août 2023", tndeur: 0.30, tmm: 8.0, pib: 3.1, inflation: 9.1, balance: -13.2, chomage: 15.0 },
  { date: "Sep 2023", tndeur: 0.30, tmm: 8.0, pib: 3.2, inflation: 9.0, balance: -13.0, chomage: 14.8 },
  { date: "Oct 2023", tndeur: 0.29, tmm: 8.0, pib: 3.3, inflation: 8.8, balance: -12.8, chomage: 14.6 },
  { date: "Nov 2023", tndeur: 0.29, tmm: 8.0, pib: 3.4, inflation: 8.5, balance: -12.5, chomage: 14.5 },
  { date: "Déc 2023", tndeur: 0.30, tmm: 8.0, pib: 3.5, inflation: 8.3, balance: -12.2, chomage: 14.3 },
];

const featureImportance = [
  { name: "TMM", importance: 0.28, color: "hsl(var(--chart-1))" },
  { name: "Inflation", importance: 0.25, color: "hsl(var(--chart-2))" },
  { name: "Balance commerciale", importance: 0.22, color: "hsl(var(--chart-3))" },
  { name: "PIB", importance: 0.15, color: "hsl(var(--chart-4))" },
  { name: "Chômage", importance: 0.10, color: "hsl(var(--chart-5))" },
];

// Correlation matrix data
const correlationMatrix = [
  { indicator: "TND/EUR", tndeur: 1.0, tmm: -0.65, pib: 0.45, inflation: -0.72, balance: 0.58, chomage: -0.38 },
  { indicator: "TMM", tndeur: -0.65, tmm: 1.0, pib: -0.32, inflation: 0.78, balance: -0.45, chomage: 0.28 },
  { indicator: "PIB", tndeur: 0.45, tmm: -0.32, pib: 1.0, inflation: -0.55, balance: 0.68, chomage: -0.72 },
  { indicator: "Inflation", tndeur: -0.72, tmm: 0.78, pib: -0.55, inflation: 1.0, balance: -0.62, chomage: 0.48 },
  { indicator: "Balance", tndeur: 0.58, tmm: -0.45, pib: 0.68, inflation: -0.62, balance: 1.0, chomage: -0.52 },
  { indicator: "Chômage", tndeur: -0.38, tmm: 0.28, pib: -0.72, inflation: 0.48, balance: -0.52, chomage: 1.0 },
];

const getCorrelationColor = (value: number) => {
  if (value === 1) return "bg-primary";
  if (value >= 0.6) return "bg-green-500";
  if (value >= 0.3) return "bg-green-300";
  if (value >= -0.3) return "bg-muted";
  if (value >= -0.6) return "bg-red-300";
  return "bg-red-500";
};

export default function Indicateurs() {
  const indicators = useMemo(() => [
    { key: "tmm", name: "TMM (%)", color: "#f97316" },
    { key: "pib", name: "PIB (%)", color: "#dc2626" },
    { key: "inflation", name: "Inflation (%)", color: "#1a1a1a" },
    { key: "balance", name: "Balance (Mds TND)", color: "#fb923c" },
    { key: "chomage", name: "Chômage (%)", color: "#ef4444" },
  ], []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <BarChart3 className="h-4 w-4" />
              Analyse de données
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Indicateurs <span className="text-gradient-attijari">Économiques</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explorez les relations entre les indicateurs économiques clés et le taux de change TND/EUR 
              à travers des visualisations interactives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="timeseries" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeseries" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Séries temporelles
              </TabsTrigger>
              <TabsTrigger value="correlation" className="gap-2">
                <Grid3X3 className="h-4 w-4" />
                Corrélations
              </TabsTrigger>
              <TabsTrigger value="importance" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Importance
              </TabsTrigger>
            </TabsList>

            {/* Time Series */}
            <TabsContent value="timeseries" className="space-y-6">
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
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis domain={[0.28, 0.32]} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
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
                {indicators.slice(0, 4).map((indicator) => (
                  <Card key={indicator.key} className="border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{indicator.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))", 
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
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
            </TabsContent>

            {/* Correlation Matrix */}
            <TabsContent value="correlation" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Matrice de corrélation</CardTitle>
                  <CardDescription>
                    Relations entre les différents indicateurs économiques et le taux TND/EUR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="p-2 text-left text-sm font-medium text-muted-foreground"></th>
                          <th className="p-2 text-center text-sm font-medium text-muted-foreground">TND/EUR</th>
                          <th className="p-2 text-center text-sm font-medium text-muted-foreground">TMM</th>
                          <th className="p-2 text-center text-sm font-medium text-muted-foreground">PIB</th>
                          <th className="p-2 text-center text-sm font-medium text-muted-foreground">Inflation</th>
                          <th className="p-2 text-center text-sm font-medium text-muted-foreground">Balance</th>
                          <th className="p-2 text-center text-sm font-medium text-muted-foreground">Chômage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {correlationMatrix.map((row) => (
                          <tr key={row.indicator}>
                            <td className="p-2 text-sm font-medium text-foreground">{row.indicator}</td>
                            {["tndeur", "tmm", "pib", "inflation", "balance", "chomage"].map((col) => (
                              <td key={col} className="p-2">
                                <div
                                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold ${getCorrelationColor(row[col as keyof typeof row] as number)} ${Math.abs(row[col as keyof typeof row] as number) > 0.5 ? "text-white" : "text-foreground"}`}
                                >
                                  {(row[col as keyof typeof row] as number).toFixed(2)}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-red-500" />
                      <span className="text-muted-foreground">Corrélation négative forte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-muted" />
                      <span className="text-muted-foreground">Faible corrélation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-green-500" />
                      <span className="text-muted-foreground">Corrélation positive forte</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Interprétation des corrélations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="font-semibold text-foreground">Inflation vs TND/EUR (-0.72)</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Une forte corrélation négative : quand l'inflation augmente, le dinar a tendance à se déprécier face à l'euro.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="font-semibold text-foreground">Balance commerciale vs TND/EUR (0.58)</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Une amélioration de la balance commerciale renforce généralement la valeur du dinar.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="font-semibold text-foreground">TMM vs TND/EUR (-0.65)</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Des taux d'intérêt élevés sont souvent associés à une politique restrictive face à l'inflation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feature Importance */}
            <TabsContent value="importance" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Importance des indicateurs dans les prédictions</CardTitle>
                  <CardDescription>
                    Poids relatif de chaque indicateur dans nos modèles de prédiction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportance} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" domain={[0, 0.35]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip 
                          formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar dataKey="importance" name="Importance" radius={[0, 4, 4, 0]}>
                          {featureImportance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featureImportance.map((feature, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{feature.name}</span>
                        <span 
                          className="text-lg font-bold"
                          style={{ color: feature.color }}
                        >
                          {(feature.importance * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${feature.importance * 100}%`,
                            backgroundColor: feature.color
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
