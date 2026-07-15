import { Cliente } from "../models/cliente.js";
import { fetchWithRetry } from "../utils/retry.js";
import { APIError } from "../errors/APIError.js";

export class APICliente {
  private urlAPI = "https://jsonplaceholder.typicode.com/users";

  async obtenerClientesExternos(): Promise<Cliente[]> {
    const inicioFetch = performance.now();
    console.log(`[HTTP] Iniciando petición GET a: ${this.urlAPI}`);

    try {
      const respuesta = await fetchWithRetry(this.urlAPI);
      const finFetch = performance.now();
      console.log(`[HTTP] Respuesta de red recibida en: ${(finFetch - inicioFetch).toFixed(2)} ms`);

      if (!respuesta.ok) {
        throw new APIError(`Código de estado HTTP incorrecto: ${respuesta.status}`, respuesta.status);
      }

      const datos = await respuesta.json() as any[];

      return datos.map(item => ({
        id: item.id,
        nombre: item.name,
        usuario: item.username,
        email: item.email,
        ciudad: item.address?.city || "No especificada"
      }));

    } catch (error: any) {
      if (error.name === 'TypeError') {
        console.error('Error de red detectado:', error.message);
      }
      throw error;
    }
  }
}