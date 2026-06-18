import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}
  
  async canActivate(
    context: ExecutionContext,
    ): Promise<boolean>{
      let payload: any = null
      try {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.replace('Bearer ', '') || '';
        payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.PALABRA_SECRETA,
        });

        request['usuario'] = payload;

      } catch {
        throw new ForbiddenException('Token inválido o vencido');
      }
      if(!payload.es_admin){
          throw new ForbiddenException('');
        } 
          return true
    }
}
