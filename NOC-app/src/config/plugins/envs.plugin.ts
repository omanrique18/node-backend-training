import  'dotenv/config'
import * as env from 'env-var'

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),
  PROD: env.get('PROD').default('false').asBool(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
  MONGO_URL: env.get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
}