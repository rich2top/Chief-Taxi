import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserRole } from "../../common/enums/domain.enum";
import { UserEntity } from "./user.entity";

type CreateUserInput = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  passwordHash?: string;
  role?: UserRole;
};

type GoogleUserInput = {
  googleId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>
  ) {}

  async create(input: CreateUserInput) {
    const existing = await this.findByPhoneOrEmail(input.phoneNumber, input.email);
    if (existing) {
      throw new ConflictException("A user with this phone number or email already exists.");
    }

    const user = this.users.create({
      ...input,
      role: input.role ?? UserRole.Customer
    });

    return this.users.save(user);
  }

  async findAll() {
    return this.users.find({
      order: { createdAt: "DESC" },
      take: 100
    });
  }

  async findById(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  async findByPhoneOrEmail(phoneNumber?: string, email?: string) {
    const where: FindOptionsWhere<UserEntity>[] = [];

    if (phoneNumber) {
      where.push({ phoneNumber });
    }

    if (email) {
      where.push({ email });
    }

    if (!where.length) {
      return null;
    }

    return this.users.findOne({ where });
  }

  async findByGoogleId(googleId: string) {
    return this.users.findOne({ where: { googleId } });
  }

  async upsertGoogleCustomer(input: GoogleUserInput) {
    const userByGoogleId = await this.findByGoogleId(input.googleId);
    if (userByGoogleId) {
      userByGoogleId.email = userByGoogleId.email ?? input.email;
      userByGoogleId.fullName = userByGoogleId.fullName ?? input.fullName;
      userByGoogleId.avatarUrl = input.avatarUrl ?? userByGoogleId.avatarUrl;
      return this.users.save(userByGoogleId);
    }

    const userByEmail = await this.findByPhoneOrEmail(undefined, input.email);
    if (userByEmail) {
      userByEmail.googleId = input.googleId;
      userByEmail.fullName = userByEmail.fullName ?? input.fullName;
      userByEmail.avatarUrl = input.avatarUrl ?? userByEmail.avatarUrl;
      return this.users.save(userByEmail);
    }

    const user = this.users.create({
      googleId: input.googleId,
      email: input.email,
      fullName: input.fullName,
      avatarUrl: input.avatarUrl,
      role: UserRole.Customer
    });

    return this.users.save(user);
  }

  async findForLogin(identifier: string) {
    return this.users
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.phoneNumber = :identifier OR user.email = :identifier", { identifier })
      .getOne();
  }
}
