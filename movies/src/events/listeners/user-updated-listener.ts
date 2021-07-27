import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  UserUpdatedEvent,
  BadRequestError,
  NotFoundError,
} from '@vboxdev/common';
import { User } from '../../models/users';
import { queueGroupName } from './queue-group-name';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    

    const user = await User.findByEvent(data);

   

    if (!user) {
      throw new BadRequestError('user not found..');
    }
    const {
      id,
      username,
      telephone,
      email,
      userType,
      status,
      verification,
      expiresAt,
    } = data;

    user.set({
      id,
      username,
      telephone,
      email,
      userType,
      status,
      verification,
      expiresAt,
    });
    await user.save();

    msg.ack();
  }
}
