import { RpcException } from '@nestjs/microservices';
import { Desafio } from './../desafios/interfaces/desafio.interface';
import { ClientProxySmartRanking } from './../proxyrmq/client-proxy';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Partida } from './interfaces/partida.interface';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PartidasService {

    constructor(
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
        private readonly clientProxySmartRanking: ClientProxySmartRanking
    ) { }

    private readonly logger = new Logger(PartidasService.name);

    private clientDesafios = this.clientProxySmartRanking.getClientProxyDesafiosInstance();

    private clientRankings = this.clientProxySmartRanking.getClientProxyRankingsInstance();

    async criarPartida(partida: Partida): Promise<Partida> {
        try {
            const partidaCriada = new this.partidaModel(partida);

            this.logger.log(`partidaCriada: ${JSON.stringify(partidaCriada)}`);

            const result = await partidaCriada.save();

            this.logger.log(`result ${JSON.stringify(result)}`);

            const idPartida = result._id;

            const desafio: Desafio = await lastValueFrom(
                this.clientDesafios
                    .send('consultar-desafios', {
                        idJogador: '', _id: partida.desafio
                    })
            );

            await lastValueFrom(
                this.clientDesafios
                    .emit('atualizar-desafio-partida', {
                        id: idPartida, desafio: desafio
                    })
            );
    
            return await lastValueFrom(
                this.clientRankings
                    .emit('processar-partida', {
                        idPartida: idPartida, partida: partida
                    })
            );
        } catch (error) {
            this.logger.error(`errors: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }
}
