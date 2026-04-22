const express = require('express');
const router = express.Router();

const mockPost = {
  id: 10,
  seller_id: 5,
  category_id: 2,
  related_ticket_id: null,
  title: "Producto de prueba",
  description: "Producto de prueba",
  price: 150,
  status: "available",
  includes_ticket: false,
  images: [
    { id: 1, post_id: 10, url: "imagen_mock.jpg" }
  ]
};

router.get('/', (req, res) => {
  res.json([mockPost]);
});

router.get('/:id', (req, res) => {
  res.json({
    message: "Detalle de producto obtenido correctamente",
    data: mockPost
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    message: "Post creado",
    data: req.body
  });
});

router.put('/:id', (req, res) => {
  res.json({
    message: `Post ${req.params.id} actualizado`
  });
});

router.delete('/:id', (req, res) => {
  res.json({
    message: `Post ${req.params.id} eliminado`
  });
});

module.exports = router;
