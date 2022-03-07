import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoSchema } from './schemas/todo.schema';
@Module({
  imports: [
    TodosModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { user, password, path } = configService.get('mongodb');
        const configValues = {
          uri: `mongodb+srv://${user}:${password}${path}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
        return configValues;
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
