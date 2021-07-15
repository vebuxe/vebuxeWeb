import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCreatedEvent } from '@vboxdev/common';
import { User } from '../../models/users';
import { queueGroupName } from './queue-group-name';


export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
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
    const user = User.build({
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