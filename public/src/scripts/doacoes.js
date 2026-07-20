function copyToClipboard() {
    // Seleciona o conteúdo do código PIX
    
    // Cria um campo de texto temporário
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = `00020126360014BR.GOV.BCB.PIX0114032916530001655204000053039865802BR5901N6001C62070503***6304677D`;
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Para dispositivos móveis

    // Copia o conteúdo
    document.execCommand('copy');

    // Remove o campo temporário
    document.body.removeChild(tempInput);
    alert("Código PIX copiado para a área de transferência!");
}