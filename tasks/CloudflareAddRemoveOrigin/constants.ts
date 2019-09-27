export class CloudflareBaseUrl {
  public static readonly GetAccountPoolsUrl: string = 'https://api.cloudflare.com/client/v4/accounts/[[ACCOUNT_ID]]/load_balancers/pools';
  public static readonly UpdateAccountPoolUrl: string = 'https://api.cloudflare.com/client/v4/accounts/[[ACCOUNT_ID]]/load_balancers/pools/[[POOL_ID]]';
}