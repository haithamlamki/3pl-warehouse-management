"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const common_1 = require("@nestjs/common");
exports.Tenant = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const fromHeader = request.headers['x-tenant-id'];
    const fromUser = request.user?.tenantId;
    return fromHeader || fromUser;
});
//# sourceMappingURL=tenant.decorator.js.map