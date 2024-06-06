import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

export class LogInterceptor implements NestInterceptor {
    
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const dt = Date.now();

        return next.handle().pipe(tap(() => {

            const handler = context.getHandler().name;  // Captura o nome do método que realiza a chamada
            console.log(`Handler: ${handler}`);

            const request = context.switchToHttp().getRequest(); // Captura URL chamada
            console.log(`URL chamada: ${request.url}`);
            console.log(`Método chamado: ${request.method}`);

            console.log(`Execução levou: ${Date.now() - dt} milisegundos`); // Mostra o tempo gasto para a resposta de uma chamada na API
        }));
    }
}
