const AUTH_KEYS = {
    users: "marketplace_users",
    session: "marketplace_session",
    rememberedEmail: "marketplace_remembered_emails"
};

function getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.users));
}

function saveUsers(users) {
    localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
}

function getSession() {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.session));
}

function setSession(user) {
    const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        loggedAt: new Date().toISOString()
    };

    localStorage.setItem(
        AUTH_KEYS.session,
        JSON.stringify(session)
    );
}

function clearSession(){
    localStorage.removeItem(AUTH_KEYS.session);
}

function normalizeEmail(email){
    return email.trim().toLowerCase();
}

function showFormMessage(message, type = "error") {
  const element = document.getElementById("formAviso"); // <- ID formAviso na page de cadastro
  if (!element) return;

  element.textContent = message;
  element.className = `form-aviso ${type}`;
}
 