const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'academia_foco_total_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Dados simulados (em um projeto real, isso seria um banco de dados)
let classes = [
  { id: 1, name: 'Musculação', description: 'Treinamento com pesos para fortalecimento muscular', instructor: 'João Silva', schedule: 'Segunda a Sexta - 06:00 às 22:00' },
  { id: 2, name: 'Crossfit', description: 'Treinamento funcional de alta intensidade', instructor: 'Maria Santos', schedule: 'Segunda, Quarta e Sexta - 18:00 às 19:00' },
  { id: 3, name: 'Yoga', description: 'Exercícios de flexibilidade e relaxamento', instructor: 'Ana Costa', schedule: 'Terça e Quinta - 07:00 às 08:00' },
  { id: 4, name: 'Pilates', description: 'Fortalecimento do core e melhora da postura', instructor: 'Carlos Oliveira', schedule: 'Segunda a Sexta - 09:00 às 10:00' }
];

let plans = [
  { id: 1, name: 'Plano Básico', price: 'R$ 89,90/mês', features: ['Acesso à musculação', 'Vestiário', 'Estacionamento'] },
  { id: 2, name: 'Plano Premium', price: 'R$ 149,90/mês', features: ['Acesso a todas as modalidades', 'Vestiário', 'Estacionamento', 'Avaliação física', 'Acompanhamento nutricional'] },
  { id: 3, name: 'Plano VIP', price: 'R$ 249,90/mês', features: ['Acesso a todas as modalidades', 'Vestiário', 'Estacionamento', 'Avaliação física', 'Acompanhamento nutricional', 'Personal trainer', 'Acesso 24h'] }
];

let storeItems = [
  { id: 1, name: 'Whey Protein', price: 'R$ 89,90', description: 'Suplemento proteico para ganho de massa muscular', image: 'whey.jpg' },
  { id: 2, name: 'Creatina', price: 'R$ 45,90', description: 'Suplemento para aumento de força e resistência', image: 'creatina.jpg' },
  { id: 3, name: 'BCAA', price: 'R$ 65,90', description: 'Aminoácidos essenciais para recuperação muscular', image: 'bcaa.jpg' },
  { id: 4, name: 'Camiseta Academia', price: 'R$ 39,90', description: 'Camiseta oficial da Academia Foco Total', image: 'camiseta.jpg' }
];

// Usuário admin simulado
const adminUser = {
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10) // senha: admin123
};

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas públicas
app.get('/api/classes', (req, res) => {
  res.json(classes);
});

app.get('/api/plans', (req, res) => {
  res.json(plans);
});

app.get('/api/store', (req, res) => {
  res.json(storeItems);
});

// Rota de autenticação
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser.username && bcrypt.compareSync(password, adminUser.password)) {
    const token = jwt.sign({ username: adminUser.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login realizado com sucesso' });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Rotas protegidas do admin
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  res.json({
    totalClasses: classes.length,
    totalPlans: plans.length,
    totalStoreItems: storeItems.length,
    recentActivity: [
      'Nova aula de Yoga adicionada',
      'Plano Premium atualizado',
      'Novo produto na loja: Whey Protein'
    ]
  });
});

// CRUD para aulas
app.post('/api/admin/classes', authenticateToken, (req, res) => {
  const newClass = {
    id: classes.length + 1,
    ...req.body
  };
  classes.push(newClass);
  res.status(201).json(newClass);
});

app.put('/api/admin/classes/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const classIndex = classes.findIndex(c => c.id === id);
  
  if (classIndex === -1) {
    return res.status(404).json({ message: 'Aula não encontrada' });
  }
  
  classes[classIndex] = { ...classes[classIndex], ...req.body };
  res.json(classes[classIndex]);
});

app.delete('/api/admin/classes/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const classIndex = classes.findIndex(c => c.id === id);
  
  if (classIndex === -1) {
    return res.status(404).json({ message: 'Aula não encontrada' });
  }
  
  classes.splice(classIndex, 1);
  res.json({ message: 'Aula removida com sucesso' });
});

// CRUD para planos
app.post('/api/admin/plans', authenticateToken, (req, res) => {
  const newPlan = {
    id: plans.length + 1,
    ...req.body
  };
  plans.push(newPlan);
  res.status(201).json(newPlan);
});

app.put('/api/admin/plans/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const planIndex = plans.findIndex(p => p.id === id);
  
  if (planIndex === -1) {
    return res.status(404).json({ message: 'Plano não encontrado' });
  }
  
  plans[planIndex] = { ...plans[planIndex], ...req.body };
  res.json(plans[planIndex]);
});

app.delete('/api/admin/plans/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const planIndex = plans.findIndex(p => p.id === id);
  
  if (planIndex === -1) {
    return res.status(404).json({ message: 'Plano não encontrado' });
  }
  
  plans.splice(planIndex, 1);
  res.json({ message: 'Plano removido com sucesso' });
});

// CRUD para itens da loja
app.post('/api/admin/store', authenticateToken, (req, res) => {
  const newItem = {
    id: storeItems.length + 1,
    ...req.body
  };
  storeItems.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/admin/store/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = storeItems.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item não encontrado' });
  }
  
  storeItems[itemIndex] = { ...storeItems[itemIndex], ...req.body };
  res.json(storeItems[itemIndex]);
});

app.delete('/api/admin/store/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = storeItems.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item não encontrado' });
  }
  
  storeItems.splice(itemIndex, 1);
  res.json({ message: 'Item removido com sucesso' });
});

// Rota para servir o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

