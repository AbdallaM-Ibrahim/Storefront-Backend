import { User, Store as UserDB } from '../../models/user';
const userDB: UserDB = new UserDB();

describe("user model", () => {
  const user: User = {
    firstname: "John",
    lastname: "Wick",
    password: "some string",
  }

  it("should create new user", async () => {
    const newUser: User = await userDB.create(user);
    expect(newUser.id).toBeTruthy();
  })

  it("should get all users", async () => {
    const users: User[] = await userDB.index();
    expect(users[0].firstname).toEqual(user.firstname);
    expect(users[0].lastname).toEqual(user.lastname);
  })

  it('should get one user', async () => {
    const user_1: User = await userDB.show('1');
    expect(user_1.firstname).toEqual(user.firstname);
    expect(user_1.lastname).toEqual(user.lastname);
  })
  
  it('should remove the user', async () => {
    await userDB.delete("1")
    const users: User[] = await userDB.index();
    expect(users).toEqual([]);
  })
})