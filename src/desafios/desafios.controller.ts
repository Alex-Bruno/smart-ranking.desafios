import { Desafio } from './interfaces/desafio.interface';
import { DesafiosService } from './desafios.service';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

const ackErrors: string[] = [];

@Controller()
export class DesafiosController {

    constructor(
        private readonly desafiosService: DesafiosService
    ) { }

    private readonly logger = new Logger(DesafiosController.name);

    @EventPattern('criar-desafio')
    async criarDesafio(
        @Payload() desafio: Desafio,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            this.logger.log(`desafio ${JSON.stringify(desafio)}`);
            await this.desafiosService.criarDesafio(desafio);
            await channel.ack(originalMsg);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError)
                await channel.ack(originalMsg);
        }
    }

    @MessagePattern('consultar-desafios')
    async consultarDesafios(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<Desafio[] | Desafio> {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const { idJogador, _id } = data;
            this.logger.log(`data ${JSON.stringify(data)}`);

            if (idJogador) {
                return this.desafiosService.consultarDesafiosDeUmJogador(idJogador);
            } else if (_id) {
                return this.desafiosService.consultarDesafioPeloId(_id);
            }
            return await this.desafiosService.consultarTodosDesafios();
        } finally {
            await channel.ack(originalMsg);
        }
    }

    @EventPattern('atualizar-desafio')
    async atualizarDesafio(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            this.logger.log(`data ${JSON.stringify(data)}`);

            const _id: string = data.id;
            const desafio: Desafio = data.desafio;

            await this.desafiosService.atualizarDesafio(_id, desafio);
            await channel.ack(originalMsg);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError)
                await channel.ack(originalMsg);
        }
    }

    @EventPattern('atualizar-desafio-partida')
    async atualizarDesafioPartida(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            this.logger.log(`data ${JSON.stringify(data)}`);

            const idPartida: string = data.id;
            const desafio: Desafio = data.desafio;

            await this.desafiosService.atualizarDesafioPartida(idPartida, desafio);
            await channel.ack(originalMsg);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError)
                await channel.ack(originalMsg);
        }
    }

    @EventPattern('deletar-desafio')
    async deletarDesafio(
        @Payload() desafio: Desafio,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            this.logger.log(`desafio ${JSON.stringify(desafio)}`);

            await this.desafiosService.deletarDesafio(desafio);
            await channel.ack(originalMsg);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError)
                await channel.ack(originalMsg);
        }
    }
}
