  class AppError {
    /**
     * @param {{statusCod: number, message: string, userFriendly: boolean}} options 
     */
    constructor(options) {
      const {
        message = 'An unexpected error has occurred.',
        statusCod = 500,
        userFriendly = false,
      } = options || {};
  
      this.message = message;
      this.statusCod = statusCod;
      this.userFriendly = userFriendly === true;
    }
  }
  
  export default AppError;
  