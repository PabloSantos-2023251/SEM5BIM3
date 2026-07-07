import { readFile, writeFile } from 'fs/promises';
import { Cliente } from '../models/cliente.js';

const FILE_PATH = './clientes.json';

export async function leerClientes(): Promise<Cliente[]> {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') return [];
    throw new Error(`Error al leer clientes: ${error.message}`);
  }
}

export async function guardarClientes(clientes: Cliente[]): Promise<void> {
  try {
    await writeFile(FILE_PATH, JSON.stringify(clientes, null, 2));
  } catch (error: any) {
    throw new Error(`Error al escribir clientes: ${error.message}`);
  }
}