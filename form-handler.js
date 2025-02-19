// Constantes e configurações
const FORM_ID = "legal-form";
const SUBMIT_BTN_SELECTOR = ".submit-btn";
const FORM_CONTENT_SELECTOR = ".form-content";
const GOOGLE_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbw3HMBVAHM57BC9_wRrb8EroXycafmO3SNZGsX-2JLoTGq75PyZ1ARoiEE1d3MS-cU1/exec"; // Substitua pela URL do seu Google Script
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/Jes0lVOC5g8ElQTqUqG1Y6"; // Substitua pelo link real do grupo

// Função principal para manipular envio do formulário
async function handleSubmit(event) {
  event.preventDefault();

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

    // Enviar dados para o Google Sheets
    const response = await fetch(GOOGLE_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
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
