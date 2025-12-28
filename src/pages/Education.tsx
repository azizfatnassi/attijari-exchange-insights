import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  FileText,
  Building2,
  Percent,
  BarChart3,
  Lightbulb
} from "lucide-react";

const hedgingTechniques = [
  {
    title: "Contrats à terme (Forward)",
    description: "Accord pour acheter ou vendre une devise à un taux fixé aujourd'hui, pour une livraison future.",
    icon: FileText,
    pros: ["Taux garanti", "Planification budgétaire"],
    cons: ["Pas de bénéfice si le taux s'améliore"],
  },
  {
    title: "Options de change",
    description: "Droit (mais pas obligation) d'acheter ou vendre une devise à un taux prédéterminé.",
    icon: Shield,
    pros: ["Flexibilité", "Protection + opportunité"],
    cons: ["Prime à payer"],
  },
  {
    title: "Swaps de devises",
    description: "Échange de flux de trésorerie dans différentes devises entre deux parties.",
    icon: ArrowLeftRight,
    pros: ["Gestion long terme", "Taux avantageux"],
    cons: ["Complexité", "Engagement bilatéral"],
  },
];

const riskFactors = [
  {
    icon: Building2,
    title: "Politique monétaire",
    description: "Les décisions des banques centrales affectent directement la valeur des devises.",
  },
  {
    icon: Percent,
    title: "Taux d'intérêt",
    description: "Les différentiels de taux entre pays influencent les flux de capitaux.",
  },
  {
    icon: BarChart3,
    title: "Balance commerciale",
    description: "Les exportations et importations impactent la demande de devises.",
  },
  {
    icon: TrendingUp,
    title: "Croissance économique",
    description: "La santé économique d'un pays renforce généralement sa monnaie.",
  },
];

export default function Education() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Lightbulb className="h-4 w-4" />
              Guide éducatif
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Comprendre le <span className="text-gradient-attijari">Risque de Change</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez les mécanismes du marché des changes, les facteurs qui influencent 
              les taux et les stratégies pour protéger votre entreprise.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="definition" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="definition">Définitions</TabsTrigger>
              <TabsTrigger value="factors">Facteurs de risque</TabsTrigger>
              <TabsTrigger value="hedging">Couverture</TabsTrigger>
              <TabsTrigger value="ai">Rôle de l'IA</TabsTrigger>
            </TabsList>

            {/* Définitions */}
            <TabsContent value="definition" className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ArrowLeftRight className="h-6 w-6" />
                    </div>
                    <CardTitle>Qu'est-ce que le change ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                      Le <strong className="text-foreground">change</strong> désigne l'opération de conversion 
                      d'une monnaie en une autre. Le <strong className="text-foreground">taux de change</strong> est 
                      le prix d'une devise exprimé dans une autre devise.
                    </p>
                    <p>
                      Par exemple, un taux TND/EUR de 0,30 signifie que 1 Dinar Tunisien vaut 0,30 Euro, 
                      ou qu'il faut environ 3,33 TND pour obtenir 1 EUR.
                    </p>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-foreground">1 EUR</span>
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold text-foreground">≈ 3,33 TND</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <CardTitle>Qu'est-ce que le risque de change ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                      Le <strong className="text-foreground">risque de change</strong> représente la possibilité 
                      de pertes financières dues aux fluctuations des taux de change entre le moment 
                      d'une transaction et son règlement.
                    </p>
                    <p>
                      Ce risque affecte principalement les entreprises qui importent, exportent, 
                      ou ont des actifs libellés en devises étrangères.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-green-500/10 p-3 text-center">
                        <TrendingUp className="mx-auto mb-1 h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Appréciation</span>
                      </div>
                      <div className="rounded-lg bg-red-500/10 p-3 text-center">
                        <TrendingDown className="mx-auto mb-1 h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Dépréciation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Infographic */}
              <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Impact du risque de change</CardTitle>
                  <CardDescription>
                    Comment les fluctuations affectent différents acteurs économiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-2xl">🏭</span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Importateurs</h3>
                      <p className="text-sm text-muted-foreground">
                        Une dépréciation du TND augmente le coût des importations en devises étrangères.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Exportateurs</h3>
                      <p className="text-sm text-muted-foreground">
                        Une dépréciation du TND rend les produits tunisiens plus compétitifs à l'export.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-2xl">💰</span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Investisseurs</h3>
                      <p className="text-sm text-muted-foreground">
                        Les variations de change affectent la valeur des actifs et investissements étrangers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Facteurs de risque */}
            <TabsContent value="factors" className="space-y-8">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  Facteurs influençant le taux de change
                </h2>
                <p className="text-muted-foreground">
                  Plusieurs facteurs économiques et politiques déterminent la valeur d'une devise.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {riskFactors.map((factor, index) => (
                  <Card key={index} className="border-border/50 transition-shadow hover:shadow-md">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <factor.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{factor.title}</CardTitle>
                        <CardDescription className="mt-2">{factor.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Indicators infographic */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Indicateurs économiques clés</CardTitle>
                  <CardDescription>
                    Les indicateurs que nous utilisons pour prédire le taux TND/EUR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                      { name: "TMM", desc: "Taux du Marché Monétaire" },
                      { name: "PIB", desc: "Produit Intérieur Brut" },
                      { name: "Inflation", desc: "Taux d'inflation" },
                      { name: "Balance", desc: "Balance commerciale" },
                      { name: "Chômage", desc: "Taux de chômage" },
                    ].map((indicator, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-muted/30 p-4 text-center transition-colors hover:border-primary/50"
                      >
                        <div className="text-lg font-bold text-primary">{indicator.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{indicator.desc}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Couverture */}
            <TabsContent value="hedging" className="space-y-8">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-2xl font-bold text-foreground">
                  Techniques de couverture du risque de change
                </h2>
                <p className="text-muted-foreground">
                  Différentes stratégies permettent de se protéger contre les fluctuations des devises.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {hedgingTechniques.map((technique, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <technique.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{technique.title}</CardTitle>
                      <CardDescription>{technique.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-green-600">Avantages</h4>
                        <ul className="space-y-1">
                          {technique.pros.map((pro, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-red-600">Inconvénients</h4>
                        <ul className="space-y-1">
                          {technique.cons.map((con, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rôle de l'IA */}
            <TabsContent value="ai" className="space-y-8">
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    Comment l'Intelligence Artificielle aide à prédire les taux de change
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-card p-6 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-3xl">📊</span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Analyse de données</h3>
                      <p className="text-sm text-muted-foreground">
                        L'IA analyse des milliers de points de données historiques et indicateurs économiques.
                      </p>
                    </div>
                    <div className="rounded-xl bg-card p-6 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-3xl">🔮</span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Prédiction</h3>
                      <p className="text-sm text-muted-foreground">
                        Les modèles identifient des patterns et tendances pour prédire les futures valeurs.
                      </p>
                    </div>
                    <div className="rounded-xl bg-card p-6 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-3xl">⚡</span>
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">Réactivité</h3>
                      <p className="text-sm text-muted-foreground">
                        Les modèles s'adaptent rapidement aux nouvelles conditions économiques.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 text-center font-semibold text-foreground">
                      Nos modèles de prédiction
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="font-semibold text-primary">ARIMA</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Modèle statistique classique pour les séries temporelles
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="font-semibold text-primary">Prophet</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Modèle Facebook pour les tendances et saisonnalités
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="font-semibold text-primary">LSTM</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Réseau de neurones profond pour les séquences complexes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
