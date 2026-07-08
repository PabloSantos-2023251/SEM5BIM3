import { MenuPrincipal } from './menu/menu';

async function main() {
  const menu = new MenuPrincipal();
  await menu.mostrar();
}

main();