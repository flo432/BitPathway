export class User {

  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  isTeacher: boolean = false;
  token: string;
  date_joined: Date = new Date();
  private_projects: Array<object> = [];
  groups: Array<object> = [];
}
