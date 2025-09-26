"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, originalUrl } = req;
        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        const start = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)(() => {
            if (isMutation) {
                const duration = Date.now() - start;
                console.log(`[AUDIT] ${method} ${originalUrl} by ${req.user?.id || 'anon'} in ${duration}ms`);
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map