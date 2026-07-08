import * as readline from "readline";

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function cuestionario(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => resolve(respuesta));
  });
}