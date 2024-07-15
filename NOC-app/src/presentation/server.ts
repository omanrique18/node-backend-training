import { CronService } from './services/cron.service'
import { CheckService } from '../domain/use-cases/checks/check-service'
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource'
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl'
import { EmailService } from './services/email.service'
import { MongoDatasource } from '../infrastructure/datasources/mongo.datasource'
import { LogSeverityLevel } from '../domain/entities/log.entity'

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource(),
)
const mongoLogRepository = new LogRepositoryImpl(
  new MongoDatasource(),
)

export class Server {
  
  static async start() {

    console.log('server started')

    //* Email service implementation
    // const emailService = new EmailService(fileSystemLogRepository)
    // emailService.sendEmailWithFileSystemLogs('example@example.com')

    CronService.createJob( '*/10 * * * * *', () => {
      const url = 'https://jsonplaceholder.typicode.com/posts'
      new CheckService(
        fileSystemLogRepository,
        () => console.log(`Request to ${ url } succeeded`),
        (error) => console.log(`Request to ${ url } failed with error ${ error }`)
      ).execute( url )
    })
  }
}