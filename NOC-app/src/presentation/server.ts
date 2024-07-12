import { CronService } from './services/cron.service'
import { CheckService } from '../domain/use-cases/checks/check-service'
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource'
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl'
import { EmailService } from './services/email.service'

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource(),
)

export class Server {
  
  static start() {

    console.log('server started')

    const emailService = new EmailService(fileSystemLogRepository)

    emailService.sendEmail({
      to: 'example@example.com',
      subject: 'test',
      htmlBody: 'test',
      attachments: []
    })

    CronService.createJob( '*/5 * * * * *', () => {
      const url = 'https://jsonplaceholder.typicode.com/posts'
      new CheckService(
        fileSystemLogRepository,
        () => console.log(`Request to ${ url } succeeded`),
        (error) => console.log(`Request to ${ url } failed with error ${ error }`)
      ).execute( url )
    })
  }
}