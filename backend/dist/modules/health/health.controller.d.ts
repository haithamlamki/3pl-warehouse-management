export declare class HealthController {
    ping(): {
        ok: boolean;
        timestamp: string;
        uptime: number;
        environment: string;
    };
    ready(): {
        ready: boolean;
        checks: {
            database: boolean;
            redis: boolean;
        };
    };
}
