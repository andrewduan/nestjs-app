import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TodoDocument = Todos & Document;

@Schema()
export class Todos {
    @Prop()
    TodoId: string;

    @Prop()
    TaskName: string;

    @Prop()
    IsCompleted: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todos);