export const environment = {
  production: true,
  server: (plataforma: string) => `https://indicadores.uacj.mx/${plataforma}/public`,
  redirectMSAL: 'https://indicadores.uacj.mx/indicapp'
};
