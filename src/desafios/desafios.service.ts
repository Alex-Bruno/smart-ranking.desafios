import { Desafio } from './interfaces/desafio.interface';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { DesafioStatus } from './desafio-status.enum';

@Injectable()
export class DesafiosService {

    constructor(
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    ) { };

    private logger = new Logger(DesafiosService.name);

    async criarDesafio(desafio: Desafio): Promise<Desafio> {
        try {
            const desafioCriado = new this.desafioModel(desafio);
            desafioCriado.dataHoraSolicitacao = new Date();
            desafioCriado.status = DesafioStatus.PENDENTE;

            this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);

            return await desafioCriado.save();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarTodosDesafios(): Promise<Desafio[]> {
        try {
            return await this.desafioModel.find().exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarDesafiosDeUmJogador(_id: any): Promise<Desafio[]> {
        try {
            return await this.desafioModel.find()
                .where('jogadores')
                .in(_id)
                .exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async consultarDesafioPeloId(_id: any): Promise<Desafio> {
        try {
            return await this.desafioModel.findOne({ _id })
                .exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async atualizarDesafio(_id: string, desafio: Desafio): Promise<void> {
        try {

            desafio.dataHoraResposta = new Date();

            this.desafioModel.findOneAndUpdate({ _id }, { $set: desafio }).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async atualizarDesafioPartida(idPartida: string, desafio: Desafio): Promise<void> {
        try {
            desafio.status = DesafioStatus.REALIZADO;
            desafio.partida = idPartida;

            await this.desafioModel.findOneAndUpdate({ _id: desafio._id }, { $set: desafio }).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

    async deletarDesafio(desafio: Desafio): Promise<void> {
        try {
            const { _id } = desafio;

            desafio.status = DesafioStatus.CANCELADO;

            this.logger.log(`desafio ${JSON.stringify(desafio)}`);

            await this.desafioModel.findOneAndUpdate({ _id }, { $set: desafio }).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`);
            throw new RpcException(error.message);
        }
    }

}