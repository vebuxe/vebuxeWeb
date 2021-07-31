import {Publisher, CodeUpdatedEvent, Subjects} from '@vboxdev/common';


export class CodeUpdatedPublisher extends Publisher<CodeUpdatedEvent> {
  subject: Subjects.CodeUpdated = Subjects.CodeUpdated;
}
