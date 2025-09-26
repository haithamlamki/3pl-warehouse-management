"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path_1 = require("path");
const app_module_1 = require("../app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('3PL Warehouse Management API')
        .setDescription('OpenAPI specification for the 3PL WMS')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const outDir = (0, path_1.join)(process.cwd(), 'openapi');
    (0, fs_1.mkdirSync)(outDir, { recursive: true });
    const outFile = (0, path_1.join)(outDir, 'openapi.json');
    (0, fs_1.writeFileSync)(outFile, JSON.stringify(document, null, 2));
    console.log(`OpenAPI spec written to ${outFile}`);
    await app.close();
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=generate-openapi.js.map