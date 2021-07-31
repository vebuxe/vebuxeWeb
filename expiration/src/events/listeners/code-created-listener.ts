import { Listener, CodeCreatedEvent, Subjects } from '@vboxdev/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-verification-name';
import {UserexpirationQueue} from '../../queues/expiration-verification-queue'


export class CodeCreatedListener extends Listener<CodeCreatedEvent> {
  subject: Subjects.CodeCreated = Subjects.CodeCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: CodeCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('waiting this many miliseconds to process the job:', delay , 'User Id:', data.user);

    await UserexpirationQueue.add(
      {
        userId: data.user,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}