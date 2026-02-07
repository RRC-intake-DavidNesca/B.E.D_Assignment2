import { Server } from "http";
import app from "./app";

const PORT: string | number = process.env.PORT || 3000;

const server: Server = app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});

export { server };
