import { EmailService } from "../../../presentation/services/email.service"
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity"
import { LogRepository } from "../../repository/log.repository"


interface SendLogsEmailUseCase {
  execute( to: string | string[] ): Promise<boolean>
}

const origin = 'send-logs-email.ts'

export class SendLogsEmail implements SendLogsEmailUseCase {

  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute( to: string | string[] ): Promise<boolean> {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs( to )
      if( !sent ) {
        throw new Error( 'Email not sent' )
      }

      const log = new LogEntity({
        level: LogSeverityLevel.low, 
        message: `Logs email sent`,
        origin: origin, 
      })
      this.logRepository.saveLog( log )

      return true

    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high, 
        message: `Logs email not sent with error ${ error }`,
        origin: origin, 
      })
      this.logRepository.saveLog( log )
      return false
    } 
  }

}