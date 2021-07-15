import {Publisher, UserUpdatedEvent, Subjects} from '@vboxdev/common';


export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
