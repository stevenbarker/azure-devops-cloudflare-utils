"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CloudflareBaseUrl = /** @class */ (function () {
    function CloudflareBaseUrl() {
    }
    CloudflareBaseUrl.GetAccountPoolsUrl = 'https://api.cloudflare.com/client/v4/accounts/[[ACCOUNT_ID]]/load_balancers/pools';
    CloudflareBaseUrl.UpdateAccountPoolUrl = 'https://api.cloudflare.com/client/v4/accounts/[[ACCOUNT_ID]]/load_balancers/pools/[[POOL_ID]]';
    return CloudflareBaseUrl;
}());
exports.CloudflareBaseUrl = CloudflareBaseUrl;
