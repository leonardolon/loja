const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Criação da aplicação Express
const app = express();

// Usando o body-parser para ler dados de requisições no formato JSON
app.use(bodyParser.json());

// Conectar ao MongoDB (verifique se o MongoDB está rodando ou use um banco remoto como o MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/loja-roupas', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.log('Erro ao conectar no MongoDB', err);
  });

// Criando o modelo de Produto (roupa) para a loja
const Produto = mongoose.model('Produto', new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  categoria: { type: String, required: true },
}));

// Rota para adicionar um novo produto (POST)
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco, categoria } = req.body;
  const produto = new Produto({ nome, descricao, preco, categoria });

  try {
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar o produto', error: err });
  }
});

// Rota para listar todos os produtos (GET)
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar os produtos', error: err });
  }
});

// Rota para atualizar um produto (PUT)
app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria } = req.body;

  try {
    const produto = await Produto.findByIdAndUpdate(id, { nome, descricao, preco, categoria }, { new: true });
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar o produto', error: err });
  }
});

// Rota para deletar um produto (DELETE)
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await Produto.findByIdAndDelete(id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar o produto', error: err });
  }
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
