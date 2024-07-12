import nodemailer from 'nodemailer'
import { envs } from '../../config/plugins/envs.plugin'
import { LogRepository } from '../../domain/repository/log.repository'
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity'

interface sendEmailProperties{
  to: string | string[],
  subject: string,
  htmlBody: string,
  attachments?: EmailAttachment[]
}

interface EmailAttachment {
  filename: string,
  path: string
}

const origin = 'email.service.ts'

export class EmailService {

  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_PASSWORD,
    }
  })

  constructor(
    private readonly logRepository: LogRepository,
  ) {}

  async sendEmail( properties: sendEmailProperties ): Promise<boolean> {
    const { to, subject, htmlBody, attachments=[] } = properties
    
    try {
      const sentInfo = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments
      })

      const log = new LogEntity({
        level: LogSeverityLevel.low, 
        message: `Email sent to ${ to }`,
        origin: origin, 
      })
      this.logRepository.saveLog( log )
      
      return true
      
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high, 
        message: `Email not sent. Failed with error: ${ error }`,
        origin: origin, 
      })
      this.logRepository.saveLog( log )
      
      return false
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
    const subject = 'Server logs report'
    const htmlBody = `
      <h3>System logs - NOC</h3>
      <p>Lorem ipsum</p>
      <p>See attached logs</p>
      `
    const attachments = [
      {
        filename: 'logs-all.log',
        path: './logs/logs-all.log'
      },
      {
        filename: 'logs-medium.log',
        path: './logs/logs-medium.log'
      },
      {
        filename: 'logs-high.log',
        path: './logs/logs-high.log'
      },
    ]

    return this.sendEmail({ to, subject, htmlBody, attachments })
  }

}