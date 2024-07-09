interface CheckServiceUseCase {
  execute( url: string ): Promise<boolean>
}

type SuccessCallback = () => void
type ErrorCallback = ( error: String ) => void

export class CheckService implements CheckServiceUseCase {

  constructor(
    private successCallback: SuccessCallback,
    private errorCallback: ErrorCallback
  ) {}

  async execute( url: string ): Promise<boolean> {
    try {
      const req = await fetch( url )
      if( !req.ok ) {
        throw new Error( `Request to ${ url } failed with status ${ req.status }` )
      }
      this.successCallback()
      console.log( `Request to ${ url } succeeded with status ${ req.status }` )

      return true
      
    } catch (error) {
      this.errorCallback( `${ error }` )

      return false
    }

  }

}