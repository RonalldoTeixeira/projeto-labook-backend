import {
  GetUsersInputDTO,
  GetUsersOutputDTO,
} from "./../dtos/users/getUsers.dto";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { UserDataBase } from "./../database/UserDataBase";
import { USER_ROLES, User } from "../models/User";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { HashManager } from "../services/HashManager";


export class UserBusiness {
  constructor(
    private userDatabase: UserDataBase,
    private idgenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager,
  ) {}

  n
  
  public getUsers = async (
    input: GetUsersInputDTO
  ): Promise<GetUsersOutputDTO> => {
    const { q, token } = input;
    

    const payload = await this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new NotFoundError("Token INVÁLIDO");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("Acesso negado, somente Admins.");
    }
    const usersDB = await this.userDatabase.findUsers(q);
    
    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

      return user.toBusinessModel();
    });

    const output: GetUsersOutputDTO = users;

    return output;
  };


  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    
    const { name, email, password } = input;

    const id = this.idgenerator.generate();
    const hashPassword = await this.hashManager.hash(password);

    const userDBExists = await this.userDatabase.findUserById(id);
    if (userDBExists) {
      throw new BadRequestError("'id' existente");
    }

    const emailExist = await this.userDatabase.findUserByEmail(email);
    if (emailExist) {
      throw new BadRequestError("'e-mail' existente");
    }
  
    const newUser = new User(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.NORMAL, 
      new Date().toISOString() 
    );
   
    const newUserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);
    const tokenPayload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };
    
    const token = this.tokenManager.createToken(tokenPayload);
    const output: SignupOutputDTO = {
      message: "Cadastro realizado com Sucesso",
      token: token,
    };

    return output;
  };


  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
  
    const { email, password } = input;
    const userDB = await this.userDatabase.findUserByEmail(email);
    if (!userDB) {
      throw new NotFoundError("'email' não encontrado");
    }
   
    const passwordCompare = await this.hashManager.compare(
      password,
      userDB.password
    );

    if (!passwordCompare) {
      throw new BadRequestError("email ou password está incorreto");
    }
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );
 
    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };
    const token = this.tokenManager.createToken(tokenPayload);
    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token: token,
    };
    return output;
  };
}
