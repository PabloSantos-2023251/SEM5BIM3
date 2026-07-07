import { leerProductos, guardarProductos } from '../data/productos.js';
import { Producto } from '../models/producto.js';

export class ProductoService {
  async registrar(producto: Producto): Promise<void> {
    if (!producto.nombre || producto.precio <= 0) {
      throw new Error('Validación: Nombre obligatorio y precio mayor a 0.');
    }
    const lista = await leerProductos();
    lista.push(producto);
    await guardarProductos(lista);
  }

  async obtenerTodos(): Promise<Producto[]> {
    return await leerProductos();
  }
}