import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/controller/auth.controller';
import { AuthService } from './modules/auth/service/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/User.schema';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot(),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AppModule {}
