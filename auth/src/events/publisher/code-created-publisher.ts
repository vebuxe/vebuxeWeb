import {Publisher, CodeCreatedEvent, Subjects} from '@vboxdev/common';


export class CodeCreatedPublisher extends Publisher<CodeCreatedEvent> {
  subject: Subjects.CodeCreated = Subjects.CodeCreated;
}
