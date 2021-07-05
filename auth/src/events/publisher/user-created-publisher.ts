import {Publisher, UserCreatedEvent, Subjects} from '@vboxdev/common';


export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
