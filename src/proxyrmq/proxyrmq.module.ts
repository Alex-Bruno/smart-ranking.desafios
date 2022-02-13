import { ClientProxyDesafios } from './client-proxy';
import { Module } from '@nestjs/common';

@Module({
    providers: [ClientProxyDesafios],
    exports: [ClientProxyDesafios]
})
export class ProxyrmqModule {}
