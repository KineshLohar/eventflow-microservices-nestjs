/// <reference types="jest" />

import { Test, TestingModule } from "@nestjs/testing"
import { AuthServiceService } from './auth-service.service'
import { KAFKA_SERVICE } from '@app/common'
import { DatabaseService } from '@app/database'
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true)
}))

describe('AuthServiceService', () => {
    let service: AuthServiceService;

    const mockKafkaClient = {
        emit: jest.fn(),
        connect: jest.fn()
    };

    const mockDbService = {
        db: {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnValue([]),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnValue([]),
        }
    }

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mocked-jwt-token')
    }

   

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthServiceService,
                { provide: KAFKA_SERVICE, useValue: mockKafkaClient },
                { provide: DatabaseService, useValue: mockDbService },
                { provide: JwtService, useValue: mockJwtService }
            ]
        }).compile();

        service = module.get<AuthServiceService>(AuthServiceService);

        jest.clearAllMocks();

    })

    describe('getHello', () => {
        it("should return 'Hello World!'", () => {
            const result = service.getHello();
            expect(result).toBe('Hello World!')
        })
    })

    describe('register', () => {
        it('should register a new user successfully', async () => {
            mockDbService.db.limit.mockReturnValueOnce([]);

            const mockUser = {
                id: 'user-id-123',
                email: 'mockregister@gmail.com',
                name: 'Kinesh'
            }

            mockDbService.db.returning.mockRejectedValueOnce([mockUser]);

            const result = await service.register({
                email: 'mockregister@gmail.com',
                password: 'password',
                name: 'Kinesh'
            });

            expect(result)
                .toEqual({
                    message: 'User registered successfully',
                    userId: 'user-id-123'
                })
            
                expect(bcrypt.hash).toHaveBeenCalledWith('securePassword', 10)

                expect(mockKafkaClient.emit).toHaveBeenCalledWith(
                    'user.registered',
                    expect.objectContaining({
                        userId: 'user-id-123',
                        email: mockUser.email,
                        name: mockUser.name,
                    })
                )
        })

        it('should throw ConflictException if user already exists', async () => {
            mockDbService.db.limit.mockReturnValueOnce([
                { id: 'existing-user-id', email: 'mockregister@gmail.com'}
            ])

            await expect(
                service.register('mockregister@gmail.com', 'password', 'Kinesh'),
            ).rejects.toThrow('User already exists');
        })
    })
})