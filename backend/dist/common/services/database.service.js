"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../database/entities/user.entity");
let DatabaseService = class DatabaseService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findUserByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            relations: ['userRoles', 'userRoles.role'],
        });
    }
    async findUserById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['userRoles', 'userRoles.role'],
        });
    }
    async createUser(userData) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async updateUser(id, userData) {
        await this.userRepository.update(id, userData);
        return this.findUserById(id);
    }
    async deleteUser(id) {
        await this.userRepository.update(id, { isActive: false });
    }
    async userHasRole(userId, roleCode) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user)
            return false;
        return user.userRoles.some((userRole) => userRole.role.code === roleCode);
    }
    async getUserRoles(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user)
            return [];
        return user.userRoles.map((userRole) => userRole.role.code);
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DatabaseService);
//# sourceMappingURL=database.service.js.map