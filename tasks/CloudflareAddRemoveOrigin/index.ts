import * as tl from 'azure-pipelines-task-lib/task';
import fetch from 'node-fetch';

import { CloudflareBaseUrl } from './constants';
import { OriginStatus } from './enums/OriginStatus';
import { CloudflareParams } from './models/CloudflareParams';

async function run(): Promise<void> {
  try {

    const cloudflareAuthEmail = tl.getInput('cloudflareAuthEmail', true) || '';
    const cloudflareAuthKey = tl.getInput('cloudflareAuthKey', true) || '';
    const cloudflareAccountId = tl.getInput('cloudflareAccountId', true) || '';
    const cloudflarePoolName = tl.getInput('cloudflarePoolName', true) || '';
    const cloudflareOriginName = tl.getInput('cloudflareOriginName', true) || '';
    const updatedOriginStatus = tl.getInput('updatedOriginStatus', true) || '';

    const cloudflareParams = new CloudflareParams(
      cloudflareAuthEmail,
      cloudflareAuthKey,
      cloudflareAccountId,
      cloudflarePoolName,
      cloudflareOriginName,
      updatedOriginStatus === 'enabled' ? OriginStatus.Enable : OriginStatus.Disable);

    await runInternal(cloudflareParams);
  }
  catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

async function runInternal(cloudflareParams: CloudflareParams): Promise<void> {
  // Request a list of all account pools from the Cloudflare API.
  const allPools = await getAccountPools(cloudflareParams);

  // Filter pools with the given parameter name.
  const filteredPools = allPools.filter(x => x.name === cloudflareParams.poolName);

  // Ensure the pool could be found.
  if (!filteredPools || filteredPools.length === 0) {
    throw new Error(`Pool with the name '${cloudflareParams.poolName}' was not found.`);
  }
  // Ensure multiple matches were not found.
  else if (filteredPools.length > 1) {
    throw new Error(`Multiple pools with the name '${cloudflareParams.poolName}' were found.`);
  }

  const filteredPool = filteredPools[0];

  await findAndUpdateOriginStatus(cloudflareParams, filteredPool);
  await updateAccountPool(cloudflareParams, filteredPool);
}

async function getAccountPools(cloudflareParams: CloudflareParams): Promise<any[]> {
  let requestUri = CloudflareBaseUrl.GetAccountPoolsUrl;
  requestUri = requestUri.replace('[[ACCOUNT_ID]]', cloudflareParams.accountId);

  const response = await fetch(requestUri, {
    method: 'GET',
    headers: {
      'X-Auth-Email': cloudflareParams.authEmail,
      'X-Auth-Key': cloudflareParams.authKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.result;
    });

  return response;
}

async function findAndUpdateOriginStatus(cloudclareParams: CloudflareParams, pool: any): Promise<void> {
  const poolOrigins: any[] = pool.origins;
  var filteredOrigins = poolOrigins.filter(x => x.name === cloudclareParams.originName);

  // Ensure the origin could be found.
  if (!filteredOrigins || filteredOrigins.length === 0) {
    throw new Error(`Origin with the name '${cloudclareParams.originName}' was not found.`);
  }
  // Ensure multiple matches were not found.
  else if (filteredOrigins.length > 1) {
    throw new Error(`Multiple origins with the name '${cloudclareParams.originName}' were found.`);
  }

  const filteredOrigin = filteredOrigins[0];

  switch (cloudclareParams.originStatus) {
    case OriginStatus.Enable:
      filteredOrigin.enabled = true;
      return;

    case OriginStatus.Disable:
      filteredOrigin.enabled = false;
      return;
  }
}

async function updateAccountPool(cloudflareParams: CloudflareParams, pool: any): Promise<any[]> {
  let requestUri = CloudflareBaseUrl.UpdateAccountPoolUrl;
  requestUri = requestUri.replace('[[ACCOUNT_ID]]', cloudflareParams.accountId);
  requestUri = requestUri.replace('[[POOL_ID]]', pool.id);

  const response = await fetch(requestUri, {
    method: 'PUT',
    headers: {
      'X-Auth-Email': cloudflareParams.authEmail,
      'X-Auth-Key': cloudflareParams.authKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pool)
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data;
    });

  return response;
}

run();