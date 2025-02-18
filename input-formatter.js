// Formatação do campo de telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', formatPhoneNumber);
    }
});

// Função para formatar número de telefone
function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
        value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    }
    if (value.length > 10) {
        value = value.substring(0, 10) + '-' + value.substring(10);
    }
    
    event.target.value = value;
}

// Função para limitar o campo de idade
document.addEventListener('DOMContentLoaded', function() {
    const idadeInput = document.getElementById('idade');
    if (idadeInput) {
        idadeInput.addEventListener('input', function(e) {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
                e.target.value = '';
            } 
        });
    }
});

// Convertendo nomes para formato adequado (primeira letra maiúscula)
document.addEventListener('DOMContentLoaded', function() {
    const nomeInput = document.getElementById('nome');
    if (nomeInput) {
        nomeInput.addEventListener('blur', function(e) {
            const words = e.target.value.split(' ');
            const capitalizedWords = words.map(word => {
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            });
            e.target.value = capitalizedWords.join(' ');
        });
    }
});

// Convertendo cidade para formato adequado (primeira letra maiúscula)
document.addEventListener('DOMContentLoaded', function() {
    const cidadeInput = document.getElementById('cidade');
    if (cidadeInput) {
        cidadeInput.addEventListener('blur', function(e) {
            const words = e.target.value.split(' ');
            const capitalizedWords = words.map(word => {
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            });
            e.target.value = capitalizedWords.join(' ');
        });
    }
});