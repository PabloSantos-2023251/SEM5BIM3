import { leerClientes, guardarClientes } from '../data/clientes.js';
import { Cliente } from '../models/cliente.js';

export class ClienteService {
  async registrar(cliente: Cliente): Promise<void> {
    if (!cliente.nombre || !cliente.nit) {
      throw new Error('Validación: El cliente requiere nombre y NIT.');
    }
    const lista = await leerClientes();
    lista.push(cliente);
    await guardarClientes(lista);
  }

  async obtenerTodos(): Promise<Cliente[]> {
    return await leerClientes();
  }
}