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
    const existedSession: UserSession = await this.findSessionByUserId(
      session.userId,
    );

    if (existedSession) {
      await this.delete(existedSession.sessionId);
    }

    await this.sessionModel.create(session);
  }

  async delete(sessionId: any): Promise<SessionDocument> {
    return this.sessionModel.findOneAndDelete({ sessionId: sessionId }).exec();
  }

  async findSessionByUserId(
    userId: string[] | string,
  ): Promise<SessionDocument> {
    return await this.sessionModel.findOne({ userId: userId }).exec();
  }
}
