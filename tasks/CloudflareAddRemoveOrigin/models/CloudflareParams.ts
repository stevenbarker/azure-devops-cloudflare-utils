import { OriginStatus } from '../enums/OriginStatus';

export class CloudflareParams {
  constructor(
    public authEmail: string,
    public authKey: string,
    public accountId: string,
    public poolName: string,
    public originName: string,
    public originStatus: OriginStatus) { }
}