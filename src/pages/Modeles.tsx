import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, BarChart3, Cpu, CheckCircle2, XCircle, Info } from "lucide-react";

const models = [
  {
    id: "arima",
    name: "ARIMA",
    fullName: "AutoRegressive Integrated Moving Average",
    icon: TrendingUp,
    description: "Modèle statistique classique pour l'analyse et la prédiction des séries temporelles.",
    howItWorks: "ARIMA combine trois composantes : l'auto-régression (AR) qui utilise les valeurs passées, l'intégration (I) pour rendre la série stationnaire, et la moyenne mobile (MA) qui modélise les erreurs de prédiction.",
    strengths: [
      "Excellente interprétabilité",
      "Fonctionne bien avec des données stationnaires",
      "Rapide à entraîner",
      "Bon pour les tendances linéaires",
    ],
    weaknesses: [
      "Difficultés avec les non-linéarités",
      "Nécessite des données stationnaires",
      "Moins efficace pour les prédictions long terme",
    ],
    metrics: {
      rmse: 0.0045,
      mae: 0.0032,
      mape: "1.2%",
      r2: 0.89,
    },
    useCases: [
      "Prévisions à court terme",
      "Données avec tendances claires",
      "Analyses économiques traditionnelles",
    ],
  },
  {
    id: "prophet",
    name: "Prophet",
    fullName: "Facebook Prophet",
    icon: BarChart3,
    description: "Modèle développé par Facebook, optimisé pour les séries temporelles avec saisonnalités et effets de jours fériés.",
    howItWorks: "Prophet décompose les séries temporelles en tendance, saisonnalité (journalière, hebdomadaire, annuelle) et effets des événements spéciaux. Il utilise un modèle additif flexible.",
    strengths: [
      "Gère automatiquement les saisonnalités",
      "Robuste aux données manquantes",
      "Permet d'intégrer des événements externes",
      "Interface simple d'utilisation",
    ],
    weaknesses: [
      "Moins précis pour les patterns complexes",
      "Suppositions d'additivité peuvent être limitantes",
      "Optimisé pour les données quotidiennes",
    ],
    metrics: {
      rmse: 0.0048,
      mae: 0.0035,
      mape: "1.4%",
      r2: 0.87,
    },
    useCases: [
      "Données avec saisonnalité forte",
      "Prévisions avec événements calendaires",
      "Analyses business avec effets saisonniers",
    ],
  },
  {
    id: "lstm",
    name: "LSTM",
    fullName: "Long Short-Term Memory",
    icon: Cpu,
    description: "Réseau de neurones récurrent capable de capturer des dépendances à long terme dans les séquences temporelles.",
    howItWorks: "Les cellules LSTM utilisent des portes (entrée, oubli, sortie) pour contrôler le flux d'information, permettant au réseau de 'mémoriser' des patterns sur de longues séquences.",
    strengths: [
      "Capture les relations non-linéaires complexes",
      "Excellent pour les dépendances long terme",
      "S'adapte à des patterns variés",
      "Peut intégrer de multiples features",
    ],
    weaknesses: [
      "Nécessite beaucoup de données",
      "Temps d'entraînement plus long",
      "Moins interprétable (boîte noire)",
      "Risque de surapprentissage",
    ],
    metrics: {
      rmse: 0.0038,
      mae: 0.0028,
      mape: "0.9%",
      r2: 0.93,
    },
    useCases: [
      "Patterns complexes et non-linéaires",
      "Prédictions multi-variables",
      "Données haute fréquence",
    ],
  },
];

export default function Modeles() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Brain className="h-4 w-4" />
              Intelligence Artificielle
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Nos Modèles de <span className="text-gradient-attijari">Prédiction</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez les trois modèles d'intelligence artificielle que nous utilisons 
              pour prédire le taux de change TND/EUR.
            </p>
          </div>
        </div>
      </section>

      {/* Models Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="arima" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              {models.map((model) => (
                <TabsTrigger key={model.id} value={model.id} className="gap-2">
                  <model.icon className="h-4 w-4" />
                  {model.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {models.map((model) => (
              <TabsContent key={model.id} value={model.id} className="space-y-6">
                {/* Header Card */}
                <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <model.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{model.name}</CardTitle>
                            <CardDescription>{model.fullName}</CardDescription>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        Actif
                      </Badge>
                    </div>
                    <p className="mt-4 text-muted-foreground">{model.description}</p>
                  </CardHeader>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* How it works */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Comment ça fonctionne
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{model.howItWorks}</p>
                    </CardContent>
                  </Card>

                  {/* Metrics */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Métriques de performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {model.metrics.rmse}
                          </div>
                          <div className="text-sm text-muted-foreground">RMSE</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {model.metrics.mae}
                          </div>
                          <div className="text-sm text-muted-foreground">MAE</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {model.metrics.mape}
                          </div>
                          <div className="text-sm text-muted-foreground">MAPE</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {model.metrics.r2}
                          </div>
                          <div className="text-sm text-muted-foreground">R²</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Strengths */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Forces
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {model.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            <span className="text-muted-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Weaknesses */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        Limites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {model.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <span className="text-muted-foreground">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Use Cases */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Cas d'utilisation recommandés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {model.useCases.map((useCase, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {useCase}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Comparison Summary */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            Comparaison rapide
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-semibold text-foreground">Modèle</th>
                  <th className="p-4 text-center font-semibold text-foreground">RMSE</th>
                  <th className="p-4 text-center font-semibold text-foreground">MAE</th>
                  <th className="p-4 text-center font-semibold text-foreground">MAPE</th>
                  <th className="p-4 text-center font-semibold text-foreground">R²</th>
                  <th className="p-4 text-center font-semibold text-foreground">Complexité</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className="border-b border-border/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <model.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">{model.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">{model.metrics.rmse}</td>
                    <td className="p-4 text-center text-muted-foreground">{model.metrics.mae}</td>
                    <td className="p-4 text-center text-muted-foreground">{model.metrics.mape}</td>
                    <td className="p-4 text-center text-muted-foreground">{model.metrics.r2}</td>
                    <td className="p-4 text-center">
                      <Badge variant={model.id === "lstm" ? "default" : "secondary"}>
                        {model.id === "arima" ? "Faible" : model.id === "prophet" ? "Moyenne" : "Élevée"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
}
