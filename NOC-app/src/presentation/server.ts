import { CronAdapter } from "../adapters/cron-adapter"
import { CheckService } from "../domain/use-cases/checks/check-service"


export class Server {
  
  static start() {

    console.log('server started')

    CronAdapter.createJob( '*/5 * * * * *', () => {
      new CheckService(
        () => console.log('success'),
        (error) => console.log(error)
      ).execute( 'https://jsonplaceholder.typicode.com/posts' )
    })
  }
}