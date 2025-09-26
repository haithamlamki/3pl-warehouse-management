import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User, Role, UserRole } from '../database/entities/user.entity';

config();

async function run() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || '3pl_warehouse',
    entities: [User, Role, UserRole],
    synchronize: false,
  });

  await ds.initialize();
  const userRepo = ds.getRepository(User);
  const roleRepo = ds.getRepository(Role);
  const userRoleRepo = ds.getRepository(UserRole);

  // Ensure required roles
  const roleCodes = ['admin', 'ops', 'picker', 'driver', 'accountant', 'client'];
  const roleMap = new Map<string, Role>();
  for (const code of roleCodes) {
    let role = await roleRepo.findOne({ where: { code } });
    if (!role) {
      role = roleRepo.create({ code, name: code.toUpperCase() });
      await roleRepo.save(role);
    }
    roleMap.set(code, role);
  }

  // Create admin user if not exists
  const existing = await userRepo.findOne({ where: { email: 'admin@local' }, relations: ['userRoles'] });
  if (!existing) {
    const admin = userRepo.create({
      email: 'admin@local',
      passwordHash: '$2b$10$H8q8y9n1P9rT1kZb0ZcGZu2d8A3Q8V6J0hQwzYQk7oQw9qZQvE8C2', // 'admin123' example
      fullName: 'Admin',
      tenantId: crypto.randomUUID(),
      isActive: true,
    });
    const saved = await userRepo.save(admin);
    const adminRole = roleMap.get('admin')!;
    await userRoleRepo.save(userRoleRepo.create({ userId: saved.id, roleId: adminRole.id }));
    console.log('Seeded admin user admin@local with role admin');
  } else {
    console.log('Admin user already exists');
  }

  await ds.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


