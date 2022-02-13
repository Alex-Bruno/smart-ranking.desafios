import { Partida } from './interfaces/partida.interface';
import { PartidasService } from './partidas.service';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

const ackErrors: string[] = [];

@Controller()
export class PartidasController {

    constructor(
        private readonly partidasService: PartidasService
    ) { }

    private readonly logger = new Logger(PartidasController.name);

    @EventPattern('criar-partida')
    async criarPartida(
        @Payload() partida: Partida,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            this.logger.log(`partida ${JSON.stringify(partida)}`);

            await this.partidasService.criarPartida(partida);
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
