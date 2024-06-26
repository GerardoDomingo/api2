const express = require('express');
const Producto = require('../models/Productos'); // Importa el modelo Producto si está definido en otro archivo

const router = express.Router();

// Obtener todos los productos
router.get('/producto', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo productos' });
  }
});

// Obtener un producto específico por _id
router.get('/producto/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findById(id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo producto' });
  }
});

// Agregar un nuevo producto
router.post('/producto', async (req, res) => {
    const productoData = req.body;
  
    try {
      // Validación de campos obligatorios
      const requiredFields = ['nombre_producto', 'descripcion', 'color', 'precio_venta', 'costo_produccion', 'stock_disponible', 'imagen'];
      for (const field of requiredFields) {
        if (!productoData.hasOwnProperty(field)) {
          return res.status(400).json({ message: `El campo ${field} es obligatorio.` });
        }
      }
  
      // Validación de tipos de datos
      if (typeof productoData.nombre_producto !== 'string' || 
          typeof productoData.descripcion !== 'string' || 
          typeof productoData.color !== 'string' || 
          typeof productoData.precio_venta !== 'number' || 
          typeof productoData.costo_produccion !== 'number' || 
          typeof productoData.stock_disponible !== 'number' ||
          typeof productoData.imagen !== 'string' ) {
        return res.status(400).json({ message: 'Los tipos de datos de los campos son incorrectos.' });
      }
  
      // Crear un nuevo producto
      const nuevoProducto = new Producto(productoData);
      const savedProducto = await nuevoProducto.save();
      res.status(201).json(savedProducto);
    } catch (error) {
      // Manejo de errores específicos
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: errors });
      }
      res.status(500).json({ message: 'Error creando producto.' });
    }
  });
  

// Actualizar un producto específico por _id
router.put('/producto/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedProducto = await Producto.findByIdAndUpdate(id, newData, { new: true });
    res.json(updatedProducto);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando producto' });
  }
});

// Eliminar un producto específico por _id
router.delete('/producto/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Producto.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

//obtiene los primeros 3 productos agregados
router.get('/productos/primeros', async (req, res) => {
  try {
    const productos = await Producto.find().limit(3);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los primeros productos' });
  }
});

//obtiene los ultimos 3 productos agregados, los más recientes
router.get('/productos/ultimos', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ _id: -1 }).limit(3);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los últimos productos' });
  }
});



module.exports = router;
