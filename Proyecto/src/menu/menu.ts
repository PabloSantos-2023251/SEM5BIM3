import { cuestionario, rl } from '../utils/readline';
import { ProductoService } from '../service/producoService';
import { ClienteService } from '../service/clienteService';

export class MenuPrincipal {
  private productoService = new ProductoService();
  private clienteService = new ClienteService();

  async mostrar() {
    let continuar = true;
    while (continuar) {
      console.log('\n--- SISTEMA DE GESTIÓN ---');
      console.log('1. Registrar Producto');
      console.log('2. Listar Productos');
      console.log('3. Registrar Cliente');
      console.log('4. Listar Clientes');
      console.log('5. Salir');
      
      const opcion = await cuestionario('Seleccione una opción: ');

      switch (opcion) {
        case '1':
          const nombreP = await cuestionario('Nombre del producto: ');
          const precioP = parseFloat(await cuestionario('Precio: '));
          const stockP = parseInt(await cuestionario('Stock: '));
          try {
            await this.productoService.registrar({ id: Date.now(), nombre: nombreP, precio: precioP, stock: stockP });
            console.log('¡Producto guardado exitosamente!');
          } catch (err: any) {
            console.error(err.message);
          }
          break;
        case '2':
          console.log(await this.productoService.obtenerTodos());
          break;
        case '3':
          const nombreC = await cuestionario('Nombre del cliente: ');
          const nitC = await cuestionario('NIT: ');
          try {
            await this.clienteService.registrar({ id: Date.now(), nombre: nombreC, nit: nitC });
            console.log('¡Cliente guardado exitosamente!');
          } catch (err: any) {
            console.error(err.message);
          }
          break;
        case '4':
          console.log(await this.clienteService.obtenerTodos());
          break;
        case '5':
          continuar = false;
          rl.close();
          break;
        default:
          console.log('Opción inválida');
      }
    }
  }
}