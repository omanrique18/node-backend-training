import  'dotenv/config'
import * as env from 'env-var'

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
  PROD: env.get('PROD').default('false').asBool()
}