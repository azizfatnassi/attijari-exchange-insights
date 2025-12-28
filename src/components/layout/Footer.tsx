import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-attijari">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Attijari Bank</span>
                <span className="block text-xs text-muted-foreground">Prédiction TND/EUR</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Plateforme de prédiction du taux de change TND/EUR utilisant des modèles d'intelligence artificielle avancés.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-muted-foreground hover:text-primary transition-colors">
                  Éducation au risque de change
                </Link>
              </li>
              <li>
                <Link to="/indicateurs" className="text-muted-foreground hover:text-primary transition-colors">
                  Indicateurs économiques
                </Link>
              </li>
              <li>
                <Link to="/modeles" className="text-muted-foreground hover:text-primary transition-colors">
                  Nos modèles
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/simulateurs" className="text-muted-foreground hover:text-primary transition-colors">
                  Simulateurs de prédiction
                </Link>
              </li>
              <li>
                <Link to="/comparaison" className="text-muted-foreground hover:text-primary transition-colors">
                  Comparaison des modèles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Tunis, Tunisie
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +216 71 XXX XXX
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                contact@attijaribank.com.tn
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 Attijari Bank. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground">
              Plateforme de prédiction IA pour le taux de change TND/EUR
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
