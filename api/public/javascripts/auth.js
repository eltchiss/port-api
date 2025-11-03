// auth.js - Gestion de la connexion et de la déconnexion (Frontend)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Éléments du formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('authMessage'); 

    // 2. Logique de Connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            if (messageContainer) messageContainer.textContent = ''; // Effacer les messages précédents
            
            // Récupère les valeurs des champs (doivent avoir les IDs 'email' et 'password')
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            
            if (!email || !password) {
                if (messageContainer) messageContainer.textContent = 'Veuillez remplir tous les champs.';
                return;
            }

            try {
                // Appel à l'API d'authentification (doit être POST /api/users/authenticate)
                const response = await fetch('/api/users/authenticate', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                
                if (response.ok) {
                    const authHeader = response.headers.get('Authorization');
                    
                    if (authHeader && authHeader.startsWith('Bearer ')) {
                        const token = authHeader.replace('Bearer ', '');
                        
                        // Stockage du Token JWT dans le localStorage
                        localStorage.setItem('jwtToken', token);
                        
                        if (messageContainer) {
                            messageContainer.textContent = 'Connexion réussie. Redirection...';
                            messageContainer.style.color = 'green';
                        }
                        
                        // Redirection vers le tableau de bord
                        window.location.href = '/dashboard';
                    } else {
                        if (messageContainer) {
                             messageContainer.textContent = 'Erreur critique: Token non reçu de l\'API.';
                             messageContainer.style.color = 'red';
                        }
                    }
                } else {
                    // Gestion des erreurs de l'API (403, 404, etc.)
                    const errorResponse = await response.json().catch(() => ({}));
                    let errorMessage = 'Erreur lors de la connexion. Veuillez vérifier l\'email et le mot de passe.';
                    
                    if (errorResponse === 'wrong_credentials') {
                         errorMessage = 'Identifiants incorrects.';
                    } else if (errorResponse === 'user_not_found') {
                         errorMessage = 'Utilisateur non trouvé.';
                    }
                        
                    if (messageContainer) {
                         messageContainer.textContent = errorMessage;
                         messageContainer.style.color = 'red';
                    }
                }

            } catch (error) {
                console.error('Erreur réseau ou application :', error);
                if (messageContainer) {
                    messageContainer.textContent = 'Erreur serveur. Impossible de se connecter.';
                    messageContainer.style.color = 'red';
                }
            }
        });
    }

    // 3. Logique de Déconnexion
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Supprime le token stocké
            localStorage.removeItem('jwtToken');
            // Redirige vers la page d'accueil
            window.location.href = '/'; 
        });
    }
});
