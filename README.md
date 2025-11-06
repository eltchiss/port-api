**API de Gestion de Port de Plaisance**

**Introduction**

Cette API RESTful est conçue pour la gestion complète et sécurisée des opérations d'un port de plaisance. Elle fournit une interface pour la gestion des entités fondamentales : bateaux, emplacements, clients et réservations. Elle sert de couche logique et de persistance de données pour toute application front-end.

**Fonctionnalités Principales**

L'API offre des points d'accès complets (CRUD - Création, Lecture, Mise à Jour, Suppression) pour les ressources suivantes :

Emplacements (Catways) : Gestion des informations sur les quais et la disponibilité des emplacements.

Bateaux : Enregistrement des détails.

Clients : Gestion de la base de données des propriétaires et des locataires d'emplacements.

Réservations : Création et suivi des réservations d'emplacements avec vérification de la capacité et des dates.

**Sécurité et Authentification**

Toutes les routes critiques de l'API sont protégées. L'authentification repose sur des tokens JWT (JSON Web Tokens).

Pour interagir avec l'API, vous devez d'abord obtenir un token via le point d'accès d'authentification (par exemple, /auth/login). Ce token doit ensuite être inclus dans l'en-tête de chaque requête sécurisée :

Authorization: Bearer <votre_token_jwt>

**Documentation (Swagger)**

La documentation complète de l'API, incluant les schémas de données, les paramètres de requêtes et la possibilité de tester les points de terminaison en direct, est générée et accessible via Swagger.

URL de la Documentation : http://localhost:3003/api-docs

**Démarrage**

Pour lancer le service en local :

Clonage : Clonez le dépôt Git (git clone https://www.linguee.com/french-english/translation/d%C3%A9p%C3%B4t.html) et naviguez vers le répertoire du projet.

Installation : Installez les dépendances nécessaires.

Configuration : Créez et configurez votre fichier d'environnement (.env) avec la chaîne de connexion de votre base de données (DB_URI) et votre clé secrète JWT (JWT_SECRET).

Lancement : Démarrez l'application avec la commande appropriée (par exemple, npm start). L'API sera alors accessible sur http://localhost:3003.
