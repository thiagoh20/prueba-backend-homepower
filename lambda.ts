import { Handler, Context, Callback } from 'aws-lambda';
import { createNestServer } from './src/server';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer: Handler;

export const handler = async (event: any, context: Context, callback: Callback) => {
  if (!cachedServer) {
    const app = await createNestServer();
    cachedServer = serverlessExpress({ app });
  }
  return cachedServer(event, context, callback);
};
