const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

const MONGODB_URI = 'mongodb+srv://olya_admin:B0DmDhNe8EOcZ4gC@cluster0.m9wuz5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'task66_db';

let db;

MongoClient.connect(MONGODB_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('Успішно підключено до MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Помилка підключення до MongoDB:', err));

app.use(express.json());

// Читання з проєкцією
app.get('/items', async (req, res) => {
  try {
    const items = await db.collection('items')
      .find({})
      .project({ name: 1, status: 1, _id: 0 })
      .toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Створення (insertOne)
app.post('/items/one', async (req, res) => {
  try {
    const result = await db.collection('items').insertOne(req.body);
    res.status(201).json({ message: 'Документ успішно додано', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Створення (insertMany)
app.post('/items/many', async (req, res) => {
  try {
    const result = await db.collection('items').insertMany(req.body);
    res.status(201).json({ message: 'Документи успішно додано', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Оновлення (updateOne)
app.patch('/items/one/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await db.collection('items').updateOne({ _id: id }, { $set: req.body });
    res.json({ message: 'Документ оновлено', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Оновлення (updateMany)
app.patch('/items/many', async (req, res) => {
  try {
    const { filter, update } = req.body;
    const result = await db.collection('items').updateMany(filter, { $set: update });
    res.json({ message: 'Документи оновлено', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Заміна (replaceOne)
app.put('/items/replace/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await db.collection('items').replaceOne({ _id: id }, req.body);
    res.json({ message: 'Документ заміщено', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Видалення (deleteOne)
app.delete('/items/one/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await db.collection('items').deleteOne({ _id: id });
    res.json({ message: 'Документ видалено', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Видалення (deleteMany)
app.delete('/items/many', async (req, res) => {
  try {
    const result = await db.collection('items').deleteMany(req.body);
    res.json({ message: 'Документи видалено', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
