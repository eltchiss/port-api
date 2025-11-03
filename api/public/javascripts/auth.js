document.addEventListener('DOMContentLoaded', () => {
    
    // --- Utilitaire pour afficher les messages dans la zone dédiée ---
    const authMessage = document.getElementById('authMessage');
    const displayMessage = (message, isError = true) => {
        if (!authMessage) return;
        authMessage.textContent = message;
        authMessage.className = `text-sm font-medium mb-4 p-2 rounded-md transition-all duration-300 ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`;
    };

    // --- 1. Gestion de la Connexion ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // console.log('Login form found, attaching event listener.'); // Vous pouvez ajouter cette ligne pour confirmer
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // <-- CECI DOIT ÊTRE EXÉCUTÉ !

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            displayMessage('', false); // Masquer les messages précédents

            try {
                // L'URL de l'API corrigée
                const res = await fetch('/api/users/authenticate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                // Tenter de lire le JSON. Si le serveur renvoie du HTML (comme vous l'avez vu), 
                // data.json() va échouer, d'où l'erreur. On le gère avec res.ok.
                
                if (res.ok) {
                    const data = await res.json();
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        displayMessage('Connexion réussie. Redirection...', false);
                        window.location.href = '/dashboard';
                    } else {
                        // Cas rare où res.ok est vrai mais il n'y a pas de token (mauvais format de réponse)
                        displayMessage('Réponse du serveur inattendue.');
                    }
                } else {
                    // Ici, res.ok est faux (statut 401, 404, etc.)
                    const errorData = await res.json().catch(() => ({ message: 'Erreur de connexion' }));
                    const errorMessage = errorData.message || 'Identifiants incorrects ou utilisateur non trouvé.';
                    displayMessage(`Échec : ${errorMessage}`);
                }
            } catch (err) {
                console.error('Erreur réseau ou du serveur:', err);
                displayMessage('Erreur de connexion. Veuillez réessayer (vérifiez la console).');
            }
        });
    }

    // --- 2. Gestion de la Déconnexion ---
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = '/'; 
        });
    }
});