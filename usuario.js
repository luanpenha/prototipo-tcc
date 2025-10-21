const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (file) {
    const filename = file.name;
    const res = await fetch('http://localhost:3005/usuario', { // Altere para a URL correta da sua API
      method: 'POST',
      
      headers: {
        'x-filename': filename,
      },
      body: file // Envie o próprio objeto File como corpo (body)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    })
    .then(data => {
      console.log('Upload bem-sucedido:', data);
      

    })
    .catch(error => {
      console.error('Erro no upload:', error);
    });
  } else {
    console.error('Nenhum arquivo selecionado.');
  }

});