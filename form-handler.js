// Constantes e configurações
const FORM_ID = "legal-form";
const SUBMIT_BTN_SELECTOR = ".submit-btn";
const FORM_CONTENT_SELECTOR = ".form-content";
const GOOGLE_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbw3HMBVAHM57BC9_wRrb8EroXycafmO3SNZGsX-2JLoTGq75PyZ1ARoiEE1d3MS-cU1/exec"; // Substitua pela URL do seu Google Script
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/Jes0lVOC5g8ElQTqUqG1Y6"; // Substitua pelo link real do grupo

let googleUser = null;

// Função para inicializar o Google OAuth2
function initializeGoogleSignIn() {
  gapi.load("auth2", function () {
    gapi.auth2.init({
      client_id:
        "7992282028-6gibpp6ds295oboe3r905gllor8v70rs.apps.googleusercontent.com", // Substitua pelo seu Client ID
    });
  });
}

// Função para solicitar o login e redirecionar
async function handleSubmit(event) {
  event.preventDefault();

  // Iniciar o login se não estiver autenticado
  const auth2 = gapi.auth2.getAuthInstance();

  if (!auth2.isSignedIn.get()) {
    try {
      const googleAuthWindow = openGoogleAuthPopup();

      // Espera até que a janela de autenticação seja fechada
      const authResult = await waitForAuthResult(googleAuthWindow);

      if (authResult.error === 'popup_closed_by_user') {
        throw new Error('O login foi cancelado pelo usuário.');
      }

      googleUser = authResult.user;
      console.log("Usuário autenticado:", googleUser);
      submitForm(); // Agora que o usuário está autenticado, podemos enviar o formulário
    } catch (error) {
      console.error("Erro no login:", error);
      showMessage("error", "Ocorreu um erro ao tentar fazer o login. Tente novamente.");
    }
  } else {
    googleUser = auth2.currentUser.get();
    submitForm();
  }
}

// Função para enviar o formulário após autenticação
async function submitForm() {
  const form = document.getElementById(FORM_ID);
  const submitBtn = document.querySelector(SUBMIT_BTN_SELECTOR);
  const formContent = document.querySelector(FORM_CONTENT_SELECTOR);

  // Verificar se o formulário é válido
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Alterar estado para carregando
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;
  form.classList.add("loading");

  try {
    // Preparar dados do formulário
    const formData = new FormData(form);
    const formEntries = Object.fromEntries(formData.entries());

    // Adicionar o token de acesso do Google ao corpo da requisição
    formEntries.googleToken = googleUser.getAuthResponse().id_token;

    // Enviar dados para o Google Sheets
    const response = await fetch(GOOGLE_WEB_APP_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formEntries),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.result === "success") {
      // Mostrar mensagem de sucesso
      showMessage(
        "success",
        "Cadastro enviado com sucesso! Você será redirecionado para nosso grupo no WhatsApp em instantes."
      );

      // Redirecionar após um curto período
      setTimeout(() => {
        window.location.href = WHATSAPP_GROUP_URL;
      }, 3000);
    } else {
      throw new Error("Falha no envio do formulário");
    }
  } catch (error) {
    // Mostrar mensagem de erro
    showMessage(
      "error",
      "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente mais tarde."
    );
    console.error("Erro ao enviar formulário:", error);

    // Restaurar estado do botão
    submitBtn.textContent = "Enviar Cadastro";
    submitBtn.disabled = false;
    form.classList.remove("loading");
  }
}

// Função para mostrar mensagens de sucesso ou erro
function showMessage(type, text) {
  const formContent = document.querySelector(FORM_CONTENT_SELECTOR);
  const messageElement = document.createElement("div");
  messageElement.className =
    type === "success" ? "success-message" : "error-message";
  messageElement.textContent = text;

  // Inserir no topo do formulário
  formContent.insertBefore(messageElement, formContent.firstChild);

  // Remover após um tempo se for mensagem de erro
  if (type === "error") {
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// Função para abrir o pop-up de login do Google
function openGoogleAuthPopup() {
  const width = 600;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  return window.open(
    'https://accounts.google.com/o/oauth2/v2/auth?client_id=7992282028-6gibpp6ds295oboe3r905gllor8v70rs.apps.googleusercontent.com&redirect_uri=https://cb-marketing-sandy.vercel.app/oauth2callback&response_type=token&scope=email&state=state_parameter_passthrough_value',
    'Google Login',
    `width=${width},height=${height},top=${top},left=${left}`
  );
}

// Função para esperar pela resposta do login do Google
function waitForAuthResult(popup) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        reject({ error: 'popup_closed_by_user' });
      }

      try {
        const result = popup.document.getElementById('authResult').innerText;
        if (result) {
          resolve({ user: result });
        }
      } catch (e) {}
    }, 1000);
  });
}

// Inicializa o Google OAuth2 assim que a página for carregada
window.onload = function () {
  initializeGoogleSignIn();
};
