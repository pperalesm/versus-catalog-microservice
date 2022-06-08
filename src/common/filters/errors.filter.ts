import {
  Catch,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";

@Catch()
export class ErrorFilter implements GqlExceptionFilter {
  catch(exception: any) {
    console.error(">>>>>>>>>>>>>>>>>>>");
    console.error(exception);
    console.error("<<<<<<<<<<<<<<<<<<<");

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.BAD_REQUEST) {
      throw new BadRequestException();
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      throw new UnauthorizedException();
    }

    if (status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException();
    }

    if (status === HttpStatus.FORBIDDEN) {
      throw new ForbiddenException();
    }

    if (status === HttpStatus.NOT_ACCEPTABLE) {
      throw new NotAcceptableException();
    }

    if (status === HttpStatus.REQUEST_TIMEOUT) {
      throw new RequestTimeoutException();
    }

    if (status === HttpStatus.CONFLICT) {
      throw new ConflictException();
    }

    if (status === HttpStatus.GONE) {
      throw new GoneException();
    }

    if (status === HttpStatus.HTTP_VERSION_NOT_SUPPORTED) {
      throw new HttpVersionNotSupportedException();
    }

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      throw new PayloadTooLargeException();
    }

    if (status === HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
      throw new UnsupportedMediaTypeException();
    }

    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      throw new UnprocessableEntityException();
    }

    if (status === HttpStatus.NOT_IMPLEMENTED) {
      throw new NotImplementedException();
    }

    if (status === HttpStatus.I_AM_A_TEAPOT) {
      throw new ImATeapotException();
    }

    if (status === HttpStatus.METHOD_NOT_ALLOWED) {
      throw new MethodNotAllowedException();
    }

    if (status === HttpStatus.BAD_GATEWAY) {
      throw new BadGatewayException();
    }

    if (status === HttpStatus.SERVICE_UNAVAILABLE) {
      throw new ServiceUnavailableException();
    }

    if (status === HttpStatus.GATEWAY_TIMEOUT) {
      throw new GatewayTimeoutException();
    }

    if (status === HttpStatus.PRECONDITION_FAILED) {
      throw new PreconditionFailedException();
    }

    throw new InternalServerErrorException();
  }
}
