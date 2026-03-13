import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { UserResponseDto, PaginatedUsersResponseDto } from '../../application/dtos/user-response.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { ListUsersQuery } from '../../application/queries/list-users.query';
import { AssignRoleCommand } from '../../application/commands/assign-role.command';
import { GetUserHandler } from '../../application/handlers/get-user.handler';
import { ListUsersHandler } from '../../application/handlers/list-users.handler';
import { AssignRoleHandler } from '../../application/handlers/assign-role.handler';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';
import { TenantGuard } from '../../infrastructure/guards/tenant.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { JwtPayload } from '../../domain/services/auth.domain-service';
import { UserRole, NotFoundError, ForbiddenError } from '@tradeforge/common';
import { PasswordHashingService } from '../../domain/services/password-hashing.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserHandler: GetUserHandler,
    private readonly listUsersHandler: ListUsersHandler,
    private readonly assignRoleHandler: AssignRoleHandler,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'List users for a tenant (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated user list', type: PaginatedUsersResponseDto })
  async listUsers(
    @CurrentUser() caller: JwtPayload,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ): Promise<PaginatedUsersResponseDto> {
    const query = new ListUsersQuery(caller.tenantId, page, Math.min(limit, 100));
    return this.listUsersHandler.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: JwtPayload,
  ): Promise<UserResponseDto> {
    const query = new GetUserQuery(id, caller.tenantId);
    return this.getUserHandler.execute(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, description: 'Updated user', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() caller: JwtPayload,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new NotFoundError('User', id);
    }
    if (user.tenantId.value !== caller.tenantId) {
      throw new ForbiddenError('Access denied to this user');
    }

    const updateData: Parameters<typeof this.userRepository.update>[1] = {};
    if (dto.fullName !== undefined) updateData.fullName = dto.fullName;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.password !== undefined) {
      updateData.passwordHash = await this.passwordHashingService.hashPassword(dto.password);
    }

    const updated = await this.userRepository.update(id, updateData);

    if (dto.role !== undefined && dto.role !== user.role) {
      const assignCmd = new AssignRoleCommand(id, dto.role, caller.tenantId, caller.sub);
      await this.assignRoleHandler.execute(assignCmd);
    }

    const dto2 = new UserResponseDto();
    dto2.id = updated.id;
    dto2.tenantId = updated.tenantId.value;
    dto2.email = updated.email.value;
    dto2.fullName = updated.fullName;
    dto2.role = updated.role;
    dto2.status = updated.status;
    dto2.mfaEnabled = updated.mfaEnabled;
    dto2.lastLoginAt = updated.lastLoginAt;
    dto2.createdAt = updated.createdAt;
    return dto2;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft-delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: JwtPayload,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new NotFoundError('User', id);
    }
    if (user.tenantId.value !== caller.tenantId) {
      throw new ForbiddenError('Access denied to this user');
    }
    await this.userRepository.delete(id);
  }
}
