"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = __importStar(require("azure-pipelines-task-lib/task"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var constants_1 = require("./constants");
var OriginStatus_1 = require("./enums/OriginStatus");
var CloudflareParams_1 = require("./models/CloudflareParams");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var cloudflareAuthEmail, cloudflareAuthKey, cloudflareAccountId, cloudflarePoolName, cloudflareOriginName, updatedOriginStatus, cloudflareParams, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cloudflareAuthEmail = tl.getInput('cloudflareAuthEmail', true) || '';
                    cloudflareAuthKey = tl.getInput('cloudflareAuthKey', true) || '';
                    cloudflareAccountId = tl.getInput('cloudflareAccountId', true) || '';
                    cloudflarePoolName = tl.getInput('cloudflarePoolName', true) || '';
                    cloudflareOriginName = tl.getInput('cloudflareOriginName', true) || '';
                    updatedOriginStatus = tl.getInput('updatedOriginStatus', true) || '';
                    cloudflareParams = new CloudflareParams_1.CloudflareParams(cloudflareAuthEmail, cloudflareAuthKey, cloudflareAccountId, cloudflarePoolName, cloudflareOriginName, updatedOriginStatus === 'enabled' ? OriginStatus_1.OriginStatus.Enable : OriginStatus_1.OriginStatus.Disable);
                    return [4 /*yield*/, runInternal(cloudflareParams)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function runInternal(cloudflareParams) {
    return __awaiter(this, void 0, void 0, function () {
        var allPools, filteredPools, filteredPool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAccountPools(cloudflareParams)];
                case 1:
                    allPools = _a.sent();
                    filteredPools = allPools.filter(function (x) { return x.name === cloudflareParams.poolName; });
                    // Ensure the pool could be found.
                    if (!filteredPools || filteredPools.length === 0) {
                        throw new Error("Pool with the name '" + cloudflareParams.poolName + "' was not found.");
                    }
                    // Ensure multiple matches were not found.
                    else if (filteredPools.length > 1) {
                        throw new Error("Multiple pools with the name '" + cloudflareParams.poolName + "' were found.");
                    }
                    filteredPool = filteredPools[0];
                    return [4 /*yield*/, findAndUpdateOriginStatus(cloudflareParams, filteredPool)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateAccountPool(cloudflareParams, filteredPool)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getAccountPools(cloudflareParams) {
    return __awaiter(this, void 0, void 0, function () {
        var requestUri, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestUri = constants_1.CloudflareBaseUrl.GetAccountPoolsUrl;
                    requestUri = requestUri.replace('[[ACCOUNT_ID]]', cloudflareParams.accountId);
                    return [4 /*yield*/, node_fetch_1.default(requestUri, {
                            method: 'GET',
                            headers: {
                                'X-Auth-Email': cloudflareParams.authEmail,
                                'X-Auth-Key': cloudflareParams.authKey,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(function (res) {
                            return res.json();
                        })
                            .then(function (data) {
                            return data.result;
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
function findAndUpdateOriginStatus(cloudclareParams, pool) {
    return __awaiter(this, void 0, void 0, function () {
        var poolOrigins, filteredOrigins, filteredOrigin;
        return __generator(this, function (_a) {
            poolOrigins = pool.origins;
            filteredOrigins = poolOrigins.filter(function (x) { return x.name === cloudclareParams.originName; });
            // Ensure the origin could be found.
            if (!filteredOrigins || filteredOrigins.length === 0) {
                throw new Error("Origin with the name '" + cloudclareParams.originName + "' was not found.");
            }
            // Ensure multiple matches were not found.
            else if (filteredOrigins.length > 1) {
                throw new Error("Multiple origins with the name '" + cloudclareParams.originName + "' were found.");
            }
            filteredOrigin = filteredOrigins[0];
            switch (cloudclareParams.originStatus) {
                case OriginStatus_1.OriginStatus.Enable:
                    filteredOrigin.enabled = true;
                    return [2 /*return*/];
                case OriginStatus_1.OriginStatus.Disable:
                    filteredOrigin.enabled = false;
                    return [2 /*return*/];
            }
            return [2 /*return*/];
        });
    });
}
function updateAccountPool(cloudflareParams, pool) {
    return __awaiter(this, void 0, void 0, function () {
        var requestUri, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestUri = constants_1.CloudflareBaseUrl.UpdateAccountPoolUrl;
                    requestUri = requestUri.replace('[[ACCOUNT_ID]]', cloudflareParams.accountId);
                    requestUri = requestUri.replace('[[POOL_ID]]', pool.id);
                    return [4 /*yield*/, node_fetch_1.default(requestUri, {
                            method: 'PUT',
                            headers: {
                                'X-Auth-Email': cloudflareParams.authEmail,
                                'X-Auth-Key': cloudflareParams.authKey,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(pool)
                        })
                            .then(function (res) {
                            return res.json();
                        })
                            .then(function (data) {
                            return data;
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
run();
