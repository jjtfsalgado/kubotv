import {config} from 'dotenv';

//apply environment variables defined on the .env file
config();

export * from "./express"
export * from "./db"

