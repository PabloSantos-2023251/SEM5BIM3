import "./api/server.js";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada no manejada:", promise, "Razón:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Excepción no capturada:", error);
  process.exit(1);
});