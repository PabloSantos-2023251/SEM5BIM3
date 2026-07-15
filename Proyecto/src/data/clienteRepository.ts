import { readFile, writeFile } from "fs/promises";
import { Cliente } from "../models/cliente.js";

const FILE_PATH = "./src/data/clientes.json";

export class ClienteRepository {
  async leer(): Promise<Cliente[]> {
    try {
      const data = await readFile(FILE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') return [];
      throw new Error(`Error al leer archivo de clientes: ${error.message}`);
    }
  }

  async guardar(clientes: Cliente[]): Promise<void> {
    try {
      await writeFile(FILE_PATH, JSON.stringify(clientes, null, 2), "utf-8");
    } catch (error: any) {
      throw new Error(`Error al escribir en archivo de clientes: ${error.message}`);
    }
  }
}