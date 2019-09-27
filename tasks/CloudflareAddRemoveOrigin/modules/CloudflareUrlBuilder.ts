export class CloudflareUrlBuilder {
  public static readonly GetAccountPoolsUrl: string = 'https://api.cloudflare.com/client/v4/accounts/[[ACCOUNT_ID]]/load_balancers/pools';
  public static readonly UpdateAccountPoolUrl: string = 'https://api.cloudflare.com/client/v4/accounts/[[ACCOUNT_ID]]/load_balancers/pools/[[POOL_ID]]';

  public static buildGetAccountPoolsUrl(cloudflareAccountId: string): string {
    return this.GetAccountPoolsUrl
      .replace('[[ACCOUNT_ID]]', cloudflareAccountId);
  }

  public static buildUpdateAccountPoolUrl(cloudflareAccountId: string, cloudflarePoolId: string): string {
    return this.UpdateAccountPoolUrl
      .replace('[[ACCOUNT_ID]]', cloudflareAccountId)
      .replace('[[POOL_ID]]', cloudflarePoolId);
  }
}