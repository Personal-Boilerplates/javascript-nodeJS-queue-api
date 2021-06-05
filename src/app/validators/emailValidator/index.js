import AppError from '../../../errors/AppError';

function emailValidator(data) {
  const { to, subject } = data || {};

  if (Array.isArray(to) ?
    to.some(e => !(typeof e === 'string' && e.length > 0)) :
    typeof to !== "string"
  ) {
    throw new AppError({
      message: "The email 'to' property must be a string or a array of strings", 
      statusCod: 401
    });
  } else if (typeof subject !== "string") {
    throw new AppError({
      message: "The email 'subject' property is required and must be a string", 
      statusCod: 401
    });;
  }
}

export default emailValidator;
