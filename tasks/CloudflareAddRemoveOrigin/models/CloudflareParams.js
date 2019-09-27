"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CloudflareParams = /** @class */ (function () {
    function CloudflareParams(authEmail, authKey, accountId, poolName, originName, originStatus) {
        this.authEmail = authEmail;
        this.authKey = authKey;
        this.accountId = accountId;
        this.poolName = poolName;
        this.originName = originName;
        this.originStatus = originStatus;
    }
    return CloudflareParams;
}());
exports.CloudflareParams = CloudflareParams;
