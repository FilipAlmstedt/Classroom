export class Post {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public completedPost: boolean,
      public html: string,
      public css: string,
      public owner: string,
      public members: string[],
      public date: Date,
      public pendingCollaborators: string[]
    ) {}
}
  