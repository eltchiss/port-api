document.addEventListener('DOMContentLoaded', () => {
  const authMessage = document.getElementById('authMessage');
  const displayMessage = (message, isError = true) => {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.className = `text-sm font-medium mb-4 p-2 rounded-md transition-all duration-300 ${
      isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`;
  };

  // --- Connexion ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      displayMessage('', false);

      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (res.ok) {
          // Le back redirige, donc on redirige aussi
          window.location.href = '/dashboard';
        } else {
          const errorData = await res.json().catch(() => ({ message: 'Erreur de connexion' }));
          const errorMessage = errorData.message || 'Identifiants incorrects ou utilisateur non trouvé.';
          displayMessage(`Échec : ${errorMessage}`);
        }
      } catch (err) {
        console.error('Erreur réseau ou du serveur:', err);
        displayMessage('Erreur de connexion. Veuillez réessayer.');
      }
    });
  }

  // --- Déconnexion ---
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/logout');
      window.location.href = '/';
    });
  }
});
