import { LoginDto, RegisterDto } from '@app/common';
import { DatabaseService, users } from '@app/database';
import { KAFKA_TOPICS } from '@app/kafka/index.js';
import { KAFKA_SERVICE } from '@app/kafka/kafka.module.js';
import { ConflictException, Inject, Injectable, InternalServerErrorException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService
  ) { }


  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async register(payload: RegisterDto) {

    const [existingUser] = await this.dbService.db.select().from(users).where(eq(users.email, payload.email));

    console.log("EXISTING USER", existingUser);
    
    if (existingUser) {
      throw new ConflictException("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const [user] = await this.dbService.db.insert(users).values({
      name: payload.name,
      email: payload.email,
      password: hashedPassword
    }).returning();

    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    })

    return { message: 'User registered successfully', user }
  }

  async login(payload: LoginDto) {
    try {
      console.log("PAYLOAD", payload);
      
      const [user] = await this.dbService.db.select().from(users).where(eq(users.email, payload.email)).limit(1);

      console.log("USER", user);
      
      if (!user || !(await bcrypt.compare(payload.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN, {
        userId: user.id,
        timestamp: new Date().toISOString()
      });

      return {
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Optional: Log the actual error to your terminal so you can see runtime bugs like this
      console.error(error);

      throw new InternalServerErrorException('An unexpected error occurred during login');
    }
  }


  async getProfile(id: string) {
    const [user] = await this.dbService.db.select(
      {
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      }
    ).from(users).where(eq(users.id, id));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user
  }

}
