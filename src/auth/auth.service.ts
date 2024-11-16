import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) { }

    async signup(dto: AuthDto): Promise<Tokens> {
        try {

            if (this.validateEmailExiste(dto.email)) throw new ConflictException("A user with this email already exists.")

            const saltOrRounds = 10;
            const hash = await bcrypt.hash(dto.password, saltOrRounds);

            const created = await this.prismaService.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hash,
                }
            })

            return  
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new HttpException("An unexpected error occurred. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    async signin() { }
    async logout() { }
    async refreshToken() { }

    private async validateEmailExiste(email: string): Promise<boolean> {
        try {
            const find = await this.prismaService.user.findFirst({
                where: {
                    email
                }
            })
            return !!find;
        } catch (error) {
            throw new HttpException("An unexpected error occurred. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
