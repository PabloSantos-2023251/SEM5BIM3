import { readFile, writeFile } from 'fs/promises';
import { Producto } from '../models/producto.js';

const FILE_PATH = './src/data/productos.json';

export async function leerProductos(): Promise<Producto[]> {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') return [];
    throw new Error(`Error al leer productos: ${error.message}`);
  }
}

export async function guardarProductos(productos: Producto[]): Promise<void> {
  try {
    await writeFile(FILE_PATH, JSON.stringify(productos, null, 2));
  } catch (error: any) {
    throw new Error(`Error al escribir productos: ${error.message}`);
  }
}