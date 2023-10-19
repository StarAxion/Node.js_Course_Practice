const ENV_PORT: number = Number(process.env.PORT);
const PORT_NUM: number = 3000;

export const PORT: number = isNaN(ENV_PORT) ? PORT_NUM : ENV_PORT;

export const SERVER_URL: string = `http://localhost:${PORT}`;
