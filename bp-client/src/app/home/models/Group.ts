export class Group {
  _id?: string;
  title: string;
  description: string;
  owner: string;
  owner_name: string;
  owner_email: string;
  date_created: Date = new Date();
  tasks: Array<Task> = [];
  members: Array<Member> = []
}

export class Member {
  _id?: string;
  name: string;
  email: string;
}

export class Task {
  _id: string = uuidgen();
  title: string;
  description: string;
  user_projects: Array<Project> = [];
}

export class Project {
  _id: string = uuidgen();
  title: string;
  description: string;
  date_created: Date = new Date();
  authors: Array<Member> = [];
}

function uuidgen() {
  return 'xxxxxxxxxxxxyxxxyxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
