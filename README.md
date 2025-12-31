# 🌍 Travel Recommendation Website

Un site de recommandation de voyage (similaire à Booking.com) construit avec **Django** (backend) et **React** (frontend). Recherchez des destinations, trouvez des hôtels, réservez des vols, découvrez des attractions et obtenez un résumé complet du prix de votre voyage.

![Travel Recommendation](https://img.shields.io/badge/Status-Active-success)
![Django](https://img.shields.io/badge/Django-4.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Fonctionnalités

### Fonctions Principales
- 🔍 **Recherche Intelligente** : Saisissez l'origine, la destination, les dates, le nombre de voyageurs et le budget.
- 🏨 **Recommandations d'Hôtels** : Trouvez des hôtels avec tarifs, évaluations, équipements et photos.
- ✈️ **Recherche de Vols** : Visualisez les options de vol (priorisées sur les autres modes de transport).
- 🚗 **Transport Local** : Location de voitures, taxis, pass de métro pour vos déplacements sur place.
- 📸 **Attractions** : Découvrez des choses à faire à votre destination.
- 💰 **Résumé des Prix** : Ventilation du coût total du voyage en temps réel.
- 📱 **Design Responsif** : Travaillez aussi bien sur ordinateur que sur mobile.

### Fonctions Avancées
- 🤖 **Planificateur Intelligent (IA)** : Génération d'itinéraires personnalisés.
- 🎯 **Styles de Voyage Multiples** : Nature, Culture, Gastronomie, Aventure, Relaxation.
- 💵 **Filtre de Budget** : Filtrez les résultats en fonction de votre budget.
- 🔄 **Intégration API Amadeus** : Données réelles pour les vols et les hôtels (optionnel).

## 🛠️ Stack Technique

### Backend
| Technologie | Utilisation |
|------------|---------|
| **Django 4.2** | Framework web Python |
| **Django REST Framework** | Développement de l'API |
| **Amadeus API** | Données réelles vols/hôtels (optionnel) |

### Frontend
| Technologie | Utilisation |
|------------|---------|
| **React 18** | Bibliothèque UI |
| **Vite** | Outil de build |
| **Tailwind CSS** | Stylisation (Styling) |
| **React Router** | Navigation |
| **Axios** | Client HTTP |
| **Lucide React** | Icônes |

## 📁 Structure du Projet

```text
Travel_recomendation/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── travel_api/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── recommendations/
│       ├── models.py          # Modèles de base de données
│       ├── serializers.py     # Sérialiseurs API
│       ├── services.py        # Services de données simulées (Mock)
│       ├── amadeus_service.py # Intégration de l'API Amadeus
│       ├── ai_planner_service.py # Planificateur de voyage intelligent
│       ├── urls.py
│       └── views.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── SearchForm.jsx
│       │   ├── HotelCard.jsx
│       │   ├── TransportCard.jsx
│       │   ├── LocalTransportCard.jsx
│       │   ├── AttractionCard.jsx
│       │   ├── PriceSummary.jsx
│       │   ├── AdvancedSearchModal.jsx
│       │   ├── TravelPlanModal.jsx
│       │   └── LoadingSpinner.jsx
│       └── pages/
│           ├── HomePage.jsx
│           └── SearchResultsPage.jsx
└── README.md

# Les commandes à exécuter :
## avant Backend : ./venv/Scripts/activate
## Backend : cd backend
             python manage.py runserver
## Frontend : cd frontend
              npm run dev
