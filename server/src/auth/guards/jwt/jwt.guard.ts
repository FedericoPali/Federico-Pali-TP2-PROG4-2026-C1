import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      const token = authorization?.replace('Bearer ', '') || '';
      const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.PALABRA_SECRETA 
      });

      request['usuario'] = payload;

    } catch {
      throw new UnauthorizedException('Token inválido o vencido');
    }
      return true; 
  }
}
