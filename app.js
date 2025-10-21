const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3005;

const TEMP_DIR = path.join(__dirname, "temp");
const MODEL_DIR = path.join(TEMP_DIR, "models");

app.use(cors()); // <-- habilita requisições de outros domínios (ex: vite)
app.use(express.json());
app.use("/temp", express.static("temp"));

app.get("/", (req, res) => {
  res.send("<h1>API de Upload de Arquivos</h1>");
});

// --- listar arquivos ---
app.get("/files", (req, res) => {
  fs.readdir(MODEL_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: "Erro ao listar arquivos" });
    res.json(files);
  });
});

// --- upload (sem multer) ---
app.post("/usuario", (req, res) => {
  const filename = req.headers["x-filename"];
  if (!filename) return res.status(400).json({ error: "Nome do arquivo não informado" });

  const filePath = path.join(MODEL_DIR, filename);
  const writeStream = fs.createWriteStream(filePath);
  req.pipe(writeStream);

  req.on("end", () => res.json({ message: "Upload concluído!", file: filename }));
  req.on("error", (err) => res.status(500).json({ error: "Erro no upload", details: err.message }));
});

app.delete("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(MODEL_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar arquivo" });
    res.json({ message: "Arquivo deletado com sucesso" });
  });
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
