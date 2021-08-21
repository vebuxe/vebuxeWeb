import {
  Listener,
  Subjects,
  ExirationVerificationEvent,
  VerificationStatus,
} from '@vboxdev/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Code } from '../../models/code';
import { natsWrapper } from '../../nats-wrapper';
import { CodeUpdatedPublisher } from '../publisher/code-updated-publisher';
import { maskPhoneNumber } from 'mask-phone-number';

export class ExpirationVerificationListener extends Listener<ExirationVerificationEvent> {
  subject: Subjects.VerificationCOmplete = Subjects.VerificationCOmplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExirationVerificationEvent['data'], msg: Message) {
    const code = await Code.findOne({ user: data.userId });

    if (code) {
      if (code.verification === VerificationStatus.Unverified) {
        code.set({
          verification: VerificationStatus.Expire,
        });
      }

      await code.save();

      new CodeUpdatedPublisher(natsWrapper.client).publish({
        user: code.id,
        expiresAt: code.expiresAt,
        version: code.version,
        verification: code.verification,
        verification_code: code.verification_code,
        codeType: code.codeType,
        masked_phone: code.masked_phone,
      });
    } else {
      console.log('User Not Founs');
    }

    msg.ack();
  }
}
