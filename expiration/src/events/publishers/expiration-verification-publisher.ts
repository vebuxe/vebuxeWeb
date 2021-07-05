import {Subjects, Publisher, ExirationVerificationEvent} from '@vboxdev/common';

export class ExpirationExpirationPublisher extends Publisher<ExirationVerificationEvent> {
  subject: Subjects.VerificationCOmplete = Subjects.VerificationCOmplete
  
}