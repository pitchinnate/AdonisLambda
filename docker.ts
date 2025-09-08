import 'reflect-metadata';
import { Ignitor } from '@adonisjs/core';
import { Context, SQSEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('./', import.meta.url);

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href);
  }
  return import(filePath);
};

export const handler = async (event: SQSEvent, context: Context): Promise<any> => {
  try {
    const ace = new Ignitor(APP_ROOT, { importer: IMPORTER })
      .tap((app) => {
        app.booting(async () => {
          await import('#start/env');
        });
      })
      .ace();
    await ace.handle(event.args);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        event,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
