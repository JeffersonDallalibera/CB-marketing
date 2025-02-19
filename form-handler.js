// form-handler.js

// Import createClient from Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Constantes e configurações
const FORM_ID = "legal-form";
const SUBMIT_BTN_SELECTOR = ".submit-btn";
const FORM_CONTENT_SELECTOR = ".form-content";
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/Jes0lVOC5g8ElQTqUqG1Y6";

// Configuração do Supabase
const supabaseUrl = "https://avmpljmmgbnsksturibg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bXBsam1tZ2Juc2tzdHVyaWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NjM5ODYsImV4cCI6MjA1NTUzOTk4Nn0.ms-Arwqz688hDXkJtm9XL7GTICF1tJq2BluQdPJvfeY";

let supabase; // Declare supabase here

async function initializeSupabase() {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase initialized:", supabase); // Debugging

    // Check if supabase is initialized correctly
    if (!supabase) {
      throw new Error("Supabase failed to initialize.");
    }

  } catch (error) {
    console.error("Error initializing Supabase:", error);
    alert("Failed to initialize Supabase. Check the console for details."); //Inform user
  }
}

document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is fully loaded
    const form = document.getElementById(FORM_ID);
    form.addEventListener('submit', handleSubmit);
  });

// Function principal para manipular envio do formulário
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

  // Check if Supabase is initialized
    if (!supabase) {
        console.error("Supabase is not initialized.  Cannot submit form.");
        alert("Supabase is not ready. Please try again in a moment.");
        return; // Stop form submission
    }

    // Alterar estado para carregando
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;
    form.classList.add("loading");

    try {
        // Preparar dados do formulário
        const formData = new FormData(form);
        const formEntries = Object.fromEntries(formData.entries());

        // Ajustar os nomes dos campos para corresponder ao banco de dados
        const dadosParaEnviar = {
            nome: formEntries.nome,
            tempo_atuacao: formEntries["tempo-atuacao"],
            area_direito: formEntries["area-direito"],
            telefone: formEntries.telefone,
            email: formEntries.email,
            idade: parseInt(formEntries.idade, 10),
            cidade: formEntries.cidade
        };

        // Enviar dados para o Supabase
        const { data, error } = await supabase
            .from("inscricoes")
            .insert([dadosParaEnviar]);


        if (error) {
            throw new Error(error.message);
        }

        // Mostrar mensagem de sucesso
        showMessage("success", "Cadastro enviado com sucesso! Você será redirecionado para nosso grupo no WhatsApp em instantes.");

        // Redirecionar após um curto período
        setTimeout(() => {
            window.location.href = WHATSAPP_GROUP_URL;
        }, 1500);
    } catch (error) {
        // Mostrar mensagem de erro
        showMessage("error", "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente mais tarde.");
        console.error("Erro ao enviar formulário:", error);
    } finally {
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
    messageElement.className = type === "success" ? "success-message" : "error-message";
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

// Initialize Supabase immediately when the module loads
initializeSupabase();
