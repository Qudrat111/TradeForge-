import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { IRoleRepository, ROLE_REPOSITORY_TOKEN } from '../../domain/repositories/role.repository.interface';
import { RoleDomainEntity } from '../../domain/entities/role.entity';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';
import { TenantGuard } from '../../infrastructure/guards/tenant.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { JwtPayload } from '../../domain/services/auth.domain-service';
import { UserRole, NotFoundError, ForbiddenError } from '@tradeforge/common';

class RoleResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty({ type: [String] }) permissions!: string[];
}

class UpdateRoleDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional({ type: [String] }) @IsArray() @IsString({ each: true }) @IsOptional() permissions?: string[];
}

class AssignPermissionDto {
  @ApiProperty() @IsString() permission!: string;
}

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('roles')
export class RoleController {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created', type: RoleResponseDto })
  async createRole(
    @Body() dto: CreateRoleDto,
    @CurrentUser() caller: JwtPayload,
  ): Promise<RoleResponseDto> {
    const role = new RoleDomainEntity({
      id: uuidv4(),
      name: dto.name,
      tenantId: caller.tenantId,
      permissions: dto.permissions ?? [],
    });
    const saved = await this.roleRepository.save(role);
    return this.toDto(saved);
  }

  @Get()
  @ApiOperation({ summary: 'List all roles for the tenant' })
  @ApiResponse({ status: 200, description: 'Role list', type: [RoleResponseDto] })
  async listRoles(@CurrentUser() caller: JwtPayload): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findByTenant(caller.tenantId);
    return roles.map((r) => this.toDto(r));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role details', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRole(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: JwtPayload,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (role === null) throw new NotFoundError('Role', id);
    if (role.tenantId !== caller.tenantId) throw new ForbiddenError('Access denied');
    return this.toDto(role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Updated role', type: RoleResponseDto })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() caller: JwtPayload,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (role === null) throw new NotFoundError('Role', id);
    if (role.tenantId !== caller.tenantId) throw new ForbiddenError('Access denied');

    const updateData: Partial<RoleDomainEntity> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.permissions !== undefined) updateData.permissions = dto.permissions;

    const updated = await this.roleRepository.update(id, updateData);
    return this.toDto(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  async deleteRole(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: JwtPayload,
  ): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (role === null) throw new NotFoundError('Role', id);
    if (role.tenantId !== caller.tenantId) throw new ForbiddenError('Access denied');
    await this.roleRepository.delete(id);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Add a permission to a role' })
  @ApiResponse({ status: 200, description: 'Permission added', type: RoleResponseDto })
  async addPermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionDto,
    @CurrentUser() caller: JwtPayload,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (role === null) throw new NotFoundError('Role', id);
    if (role.tenantId !== caller.tenantId) throw new ForbiddenError('Access denied');
    role.addPermission(dto.permission);
    const updated = await this.roleRepository.update(id, { permissions: role.permissions });
    return this.toDto(updated);
  }

  @Delete(':id/permissions/:permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a permission from a role' })
  @ApiResponse({ status: 204, description: 'Permission removed' })
  async removePermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('permission') permission: string,
    @CurrentUser() caller: JwtPayload,
  ): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (role === null) throw new NotFoundError('Role', id);
    if (role.tenantId !== caller.tenantId) throw new ForbiddenError('Access denied');
    role.removePermission(permission);
    await this.roleRepository.update(id, { permissions: role.permissions });
  }

  private toDto(role: RoleDomainEntity): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.id = role.id;
    dto.name = role.name;
    dto.tenantId = role.tenantId;
    dto.permissions = role.permissions;
    return dto;
  }
}
