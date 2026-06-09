# Attijari Exchange Insights

Attijari Exchange Insights est une plateforme avancée d'analyse et de prévision des taux de change, spécifiquement axée sur la paire TND/EUR. Cet outil est conçu pour aider les décideurs financiers à naviguer sur les marchés des changes grâce à des analyses basées sur les données et des modèles de prévision sophistiqués.

## 🚀 Fonctionnalités Clés

- **Tableau de Bord des Indicateurs** : Visualisez en temps réel les indicateurs clés du marché monétaire et des changes.
- **Modèles de Prévision Sophistiqués** : Utilisation d'algorithmes de pointe pour prédire les tendances futures :
  - **Prophet** : Modèle de série temporelle puissant pour capturer la saisonnalité et les tendances.
  - **LSTM (Long Short-Term Memory)** : Réseaux de neurones récurrents pour capter les dépendances à long terme.
  - **ARIMAX** : Modèles statistiques robustes intégrant des variables exogènes.
  - **Hybride (GRU + ARIMA)** : Une approche combinée innovante pour une précision de prévision maximale.
- **Simulateurs de Stratégies** : Testez différents scénarios de couverture (hedging) et d'investissement pour minimiser les risques.
- **Comparaison de Modèles** : Analysez et comparez les performances de différents modèles via des métriques comme le RMSE, MAE, etc.
- **Espace Éducation** : Ressources didactiques pour approfondir vos connaissances sur les mécanismes du marché des changes.

## 🛠️ Technologies Utilisées

Ce projet est construit avec une stack technologique moderne et performante :

- **Frontend** : [React 18](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/).
- **UI/UX** : [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/).
- **Gestion d'état & Data Fetching** : [TanStack Query](https://tanstack.com/query/latest) (React Query), [SWR](https://swr.vercel.app/).
- **Visualisation de données** : [Recharts](https://recharts.org/).
- **Icônes** : [Lucide React](https://lucide.dev/).
- **Validation de données** : [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/).

## 📦 Installation et Utilisation

### Prérequis
- Node.js (version 18.x ou supérieure)
- npm ou bun

### Étapes
1. **Cloner le repository** :
   ```sh
   git clone https://github.com/azizfatnassi/attijari-exchange-insights.git
   cd attijari-exchange-insights
   ```
2. **Installer les dépendances** :
   ```sh
   npm install
   # ou
   bun install
   ```
3. **Lancer le serveur de développement** :
   ```sh
   npm run dev
   ```

## 📈 Objectif du Projet
L'objectif de ce projet est de transformer la gestion du risque de change en fournissant un outil analytique qui allie l'expertise financière traditionnelle aux capacités prédictives de l'intelligence artificielle, permettant ainsi une prise de décision plus éclairée et proactive.

---
*Site développé dans le cadre de la gestion des risques de change.*
