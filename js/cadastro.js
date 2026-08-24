const AUTH_KEYS = {
  users: "bluemarket_users",
  session: "bluemarket_session",
  rememberedEmail: "bluemarket_remembered_email"
};

function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_KEYS.users)) || [];
}

function saveUsers(users) {
  localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(AUTH_KEYS.session));
}

function setSession(user) {
  localStorage.setItem(AUTH_KEYS.session, JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    loggedAt: new Date().toISOString()
  }));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEYS.session);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function showFormMessage(message, type = "error") {
  const element = document.getElementById("formMessage");
  if (!element) return;

  element.textContent = message;
  element.className = `form-message ${type}`;
}

function setFieldError(id, message) {
  const element = document.querySelector(`[data-error-for="${id}"]`);
  if (element) element.textContent = message;
}

function clearFieldErrors() {
  document.querySelectorAll(".field-error").forEach((element) => {
    element.textContent = "";
  });
}

function registerUser(event) {
  event.preventDefault();
  clearFieldErrors();
  showFormMessage("");

  const name = document.getElementById("registerName").value.trim();
  const email = normalizeEmail(document.getElementById("registerEmail").value);
  const password = document.getElementById("registerPassword").value;
  const passwordConfirm = document.getElementById("registerPasswordConfirm").value;
  const terms = document.getElementById("terms").checked;

  let valid = true;

  if (name.length < 3) {
    setFieldError("registerName", "Informe seu nome completo.");
    valid = false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    setFieldError("registerEmail", "Informe um e-mail válido.");
    valid = false;
  }

  if (password.length < 6) {
    setFieldError("registerPassword", "A senha deve ter no mínimo 6 caracteres.");
    valid = false;
  }

  if (password !== passwordConfirm) {
    setFieldError("registerPasswordConfirm", "As senhas não coincidem.");
    valid = false;
  }

  if (!terms) {
    setFieldError("terms", "Aceite os termos para continuar.");
    valid = false;
  }

  if (!valid) return;

  const users = getUsers();

  if (users.some((user) => user.email === email)) {
    showFormMessage("Já existe uma conta com este e-mail.");
    return;
  }

  const newUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  setSession(newUser);

  showFormMessage("Cadastro concluído. Redirecionando...", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 700);
}

function loginUser(event) {
  event.preventDefault();
  showFormMessage("");

  const email = normalizeEmail(document.getElementById("loginEmail").value);
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const users = getUsers();
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    showFormMessage("E-mail ou senha incorretos.");
    return;
  }

  setSession(user);

  if (rememberMe) {
    localStorage.setItem(AUTH_KEYS.rememberedEmail, email);
  } else {
    localStorage.removeItem(AUTH_KEYS.rememberedEmail);
  }

  showFormMessage("Login concluído. Redirecionando...", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
}

function recoverPassword(event) {
  event.preventDefault();
  showFormMessage("");

  const email = normalizeEmail(document.getElementById("recoverEmail").value);
  const password = document.getElementById("recoverPassword").value;
  const passwordConfirm = document.getElementById("recoverPasswordConfirm").value;
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex === -1) {
    showFormMessage("Nenhuma conta foi encontrada com este e-mail.");
    return;
  }

  if (password.length < 6) {
    showFormMessage("A nova senha deve ter no mínimo 6 caracteres.");
    return;
  }

  if (password !== passwordConfirm) {
    showFormMessage("As senhas não coincidem.");
    return;
  }

  users[userIndex].password = password;
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);
  clearSession();

  showFormMessage("Senha alterada. Você já consegue entrar.", "success");
  event.target.reset();
}

function initLoginRememberedEmail() {
  const emailInput = document.getElementById("loginEmail");
  const rememberCheckbox = document.getElementById("rememberMe");
  if (!emailInput || !rememberCheckbox) return;

  const rememberedEmail = localStorage.getItem(AUTH_KEYS.rememberedEmail);
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }
}

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const recoverForm = document.getElementById("recoverForm");

if (registerForm) registerForm.addEventListener("submit", registerUser);
if (loginForm) loginForm.addEventListener("submit", loginUser);
if (recoverForm) recoverForm.addEventListener("submit", recoverPassword);

initLoginRememberedEmail();
