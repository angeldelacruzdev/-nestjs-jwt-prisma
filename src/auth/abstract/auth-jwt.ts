import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tokens } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { HashingException, UpdateHashException } from '../../exceptions';
import { User } from '@prisma/client';

export abstract class AuthJwt {
  protected constructor(
    protected readonly jwtService: JwtService,
    protected readonly prismaService: PrismaService,
  ) {}

  /**
   * This TypeScript function generates access and refresh tokens for a user based on their user ID and
   * email.
   * @param {number} userId - The `userId` parameter in the `getToken` function represents the unique
   * identifier of a user for whom the tokens are being generated. It is of type `number` and is used
   * to associate the tokens with a specific user in the system.
   * @param {string} email - The `email` parameter in the `getToken` function is a string that
   * represents the email address of a user. It is used as one of the payload properties when
   * generating the access token and refresh token for the user identified by the `userId`.
   * @param role_id
   * @returns The `getToken` function returns a Promise that resolves to an object containing two
   * properties: `access_token` and `refresh_token`. These tokens are generated using the `signAsync`
   * method from the `jwtService` with specific configurations such as `JWT_SECRET` for access token
   * and `RT` for refresh token. The access token expires in 10 minutes, while the refresh token
   * expires in 7
   */
  async getToken(
    userId: number,
    email: string,
    role_id: number,
  ): Promise<Tokens> {
    try {
      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            email,
            role_id,
          },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: 60 * 10,
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            email,
            role_id,
          },
          {
            secret: process.env.RT,
            expiresIn: 60 * 60 * 24 * 7,
          },
        ),
      ]);

      return {
        access_token: at,
        refresh_token: rt,
      };
    } catch (error) {
      throw new ConflictException('Something bad happened to get all token.');
    }
  }

  /**
   * The `updatedRtHash` function updates the refresh token hash for a user in a database using Prisma
   * ORM in TypeScript.
   * @param {number} userId - The `userId` parameter is a number that represents the unique identifier of
   * a user in the system.
   * @param {string} rt - The `rt` parameter in the `updatedRtHash` function is a string representing a
   * refresh token. It is used to generate a hash value that will be stored in the database for the
   * corresponding user identified by the `userId`.
   */

  async updatedRtHash(userId: number, rt: string): Promise<void> {
    try {
      const hash = await this.hash(rt);

      await this.prismaService.user.update({
        where: { id: userId },
        data: {
          refreshTokenHash: hash,
        },
      });
    } catch (error) {
      throw new UpdateHashException(userId, error.message);
    }
  }

  /**
   * The function asynchronously hashes a given string using bcrypt with a specified salt or number of
   * rounds.
   * @param {string} data - The `data` parameter in the `hash` function is a string that represents the
   * data that you want to hash using the bcrypt algorithm. This data will be securely hashed using a
   * salt and the specified number of rounds before being returned as a hashed string.
   * @returns The `hash` function is returning a Promise that resolves to a string, which is the hashed
   * value of the input `data` string after using the bcrypt hashing algorithm with the specified salt
   * or rounds.
   */
  async hash(data: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      return await bcrypt.hash(data, saltOrRounds);
    } catch (error) {
      throw new HashingException(error.message);
    }
  }

  /**
   * The `logout` function updates the `refreshTokenHash` field to null for a user with a specific ID.
   * @param {number} sub - The `sub` parameter in the `logout` function is a number that represents the
   * user's ID or subject identifier. It is used to identify the user whose refresh token hash needs to
   * be updated to `null` during the logout process.
   */
  async logout(sub: number): Promise<boolean> {
    try {
      const result = await this.prismaService.user.update({
        where: { id: sub },
        data: {
          refreshTokenHash: null,
        },
      });

      return !!result;
    } catch (error) {
      throw new UpdateHashException(sub, error.message);
    }
  }

  /**
   * The function `refreshToken` in TypeScript checks and refreshes a user's token based on their ID
   * and refresh token hash stored in the database.
   * @param {number} sub - The `sub` parameter in the `refreshToken` function likely stands for
   * "subject" and is used to identify the user for whom the token is being refreshed. It is typically
   * a unique identifier for the user in the system, such as a user ID.
   * @param {string} token - The `token` parameter in the `refreshToken` function is a string that
   * represents the refresh token provided by the user for refreshing their authentication. This token
   * is used to verify the user's identity and generate new access tokens for continued access to the
   * application.
   * @returns The `refreshToken` function is returning a set of tokens after successfully refreshing
   * the user's refresh token. The tokens are generated using the `getToken` method and then a new
   * refresh token hash is generated and updated for the user. Finally, the function returns the newly
   * generated tokens.
   */
  async refreshToken(sub: number, token: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: sub,
        },
      });

      if (!user || !user.refreshTokenHash) {
        new ForbiddenException(
          'Authentication failed. Please check your credentials.',
        );
      }

      const rtMatches = await bcrypt.compare(token, user.refreshTokenHash);
      if (!rtMatches) {
        new ForbiddenException('Expiration token.');
      }

      const tokens = await this.getToken(user.id, user.email, user.role_id);

      const hashToken = await this.hash(tokens.refresh_token);
      await this.updatedRtHash(user.id, hashToken);

      return tokens;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al procesar el token de actualización.',
      );
    }
  }

  /**
   * This TypeScript function asynchronously finds a user by their email using Prisma.
   * @param {string} email - The `findUserEmail` function is an asynchronous function that takes an
   * email address as a parameter and returns a Promise that resolves to a `User` object. The function
   * uses the `prismaService` to query the database and find the first user with the specified email
   * address.
   * @returns The `findUserEmail` function is returning a Promise that resolves to a `User` object.
   */
  async findUserEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  /**
   * The function `compareUserPassword` asynchronously compares an authentication password with a hashed
   * password using bcrypt and returns a boolean indicating whether they match.
   * @param {string} authPassword - The `authPassword` parameter is the password provided by the user
   * during authentication, typically entered through a login form or API request. This password needs to
   * be compared with the hashed password stored in the database (retrieved as `prismaPassword`) to
   * verify the user's identity. The `compare
   * @param {string} prismaPassword - The `prismaPassword` parameter in the `compareUserPassword`
   * function refers to the hashed password stored in your database, typically hashed using a secure
   * hashing algorithm like bcrypt. When a user tries to authenticate, their input password
   * (`authPassword`) is compared with the hashed password retrieved from the database to
   * @returns A boolean value is being returned. If the authentication password matches the Prisma
   * password, the function returns `true`.
   */
  async compareUserPassword(
    authPassword: string,
    prismaPassword: string,
  ): Promise<boolean> {
    try {
      const rtMatches = await bcrypt.compare(authPassword, prismaPassword);
      if (!rtMatches) {
        new ForbiddenException(
          'Authentication failed. Please check your credentials.',
        );
      }

      return rtMatches;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
