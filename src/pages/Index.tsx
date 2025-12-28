import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Brain, Calculator, Shield, BarChart3, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

const features = [
  {
    icon: BookOpen,
    title: "Éducation au Change",
    description: "Comprenez les mécanismes du marché des changes et les risques associés aux fluctuations monétaires.",
    href: "/education",
  },
  {
    icon: BarChart3,
    title: "Indicateurs Économiques",
    description: "Analysez l'impact des indicateurs clés sur le taux de change TND/EUR.",
    href: "/indicateurs",
  },
  {
    icon: Brain,
    title: "Modèles IA",
    description: "Découvrez nos modèles de prédiction : ARIMA, Prophet et LSTM.",
    href: "/modeles",
  },
  {
    icon: Calculator,
    title: "Simulateurs",
    description: "Testez vos scénarios économiques et obtenez des prédictions personnalisées.",
    href: "/simulateurs",
  },
];

const stats = [
  { value: "3", label: "Modèles IA" },
  { value: "5+", label: "Indicateurs" },
  { value: "24/7", label: "Disponibilité" },
  { value: "99%", label: "Précision" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f97316%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <TrendingUp className="h-4 w-4" />
              Propulsé par l'Intelligence Artificielle
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Prédiction du Taux de Change{" "}
              <span className="text-gradient-attijari">TND/EUR</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Attijari Bank vous offre une plateforme innovante de prédiction du taux de change 
              Dinar Tunisien / Euro, utilisant des modèles d'intelligence artificielle avancés 
              pour vous aider à anticiper les fluctuations du marché.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/simulateurs">
                  Commencer la simulation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/education">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Une Plateforme Complète
            </h2>
            <p className="text-lg text-muted-foreground">
              Explorez toutes les fonctionnalités de notre plateforme de prédiction du taux de change.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Link
                    to={feature.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Explorer
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-attijari py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Shield className="mx-auto mb-6 h-16 w-16 text-primary-foreground/80" />
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Protégez-vous contre le risque de change
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Utilisez nos outils de prédiction pour anticiper les fluctuations du marché 
              et prendre des décisions éclairées pour votre entreprise.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/simulateurs">
                Accéder aux simulateurs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
