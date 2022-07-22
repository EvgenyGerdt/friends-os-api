import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument } from '../session.schema';
import { UserSession } from '../../../types/UserSession.type';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session')
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async create(session: UserSession): Promise<void> {
    await this.sessionModel.create(session);
  }

  async delete(sessionId: any): Promise<SessionDocument> {
    return this.sessionModel.findOneAndDelete({ sessionId: sessionId }).exec();
  }
}
