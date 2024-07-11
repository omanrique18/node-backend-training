import { LogEntity, LogSeverityLevel } from "../../entities/log.entity"
import { LogRepository } from "../../repository/log.repository"

interface CheckServiceUseCase {
  execute( url: string ): Promise<boolean>
}

type SuccessCallback = () => void
type ErrorCallback = ( error: String ) => void

const origin = 'check-service.ts'

export class CheckService implements CheckServiceUseCase {

  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  async execute( url: string ): Promise<boolean> {
    try {
      const req = await fetch( url )
      if( !req.ok ) {
        throw new Error( `Request to ${ url } failed with status ${ req.status }` )
      }

      const log = new LogEntity({
        level: LogSeverityLevel.low, 
        message: `Request to ${ url } succeeded with status ${ req.status }`,
        origin: origin, 
      })
      this.logRepository.saveLog( log )
      this.successCallback()

      return true
      
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high, 
        message: `Request to ${ url } failed with error ${ error }`,
        origin: origin, 
      })
      this.logRepository.saveLog( log )
      this.errorCallback( `${ error }` )

      return false
    }

  }

}