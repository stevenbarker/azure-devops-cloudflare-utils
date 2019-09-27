import * as tl from 'azure-pipelines-task-lib/task';
import fetch from 'node-fetch';

import { CloudflareUrlBuilder } from './modules/CloudflareUrlBuilder';
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

  // The pool containing the origin server to update.
  const filteredPool = filteredPools[0];

  // Find the origin server within the pool and update the pool object locally.
  await findAndUpdateOriginStatus(cloudflareParams, filteredPool);

  // Send the updated pool object to the Cloudflare API.
  await updateAccountPool(cloudflareParams, filteredPool);
}

/**
 * Returns an array of all Cloudflare pools within the account.
 * @param cloudflareParams The Cloudflare task params.
 */
async function getAccountPools(cloudflareParams: CloudflareParams): Promise<any[]> {
  const requestUrl = CloudflareUrlBuilder.buildGetAccountPoolsUrl(cloudflareParams.accountId);

  const requestOptions = {
    method: 'GET',
    headers: {
      'X-Auth-Email': cloudflareParams.authEmail,
      'X-Auth-Key': cloudflareParams.authKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  const response = await fetch(requestUrl, requestOptions)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.result;
    });

  return response;
}

/**
 * Finds and updates the origin server status locally within the given pool object.
 * @param cloudclareParams The Cloudflare task params.
 * @param pool The Cloudflare origin pool.
 */
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

  // The origin server object to update the status of.
  const filteredOrigin = filteredOrigins[0];

  // Set the enabled status on the origin object.
  switch (cloudclareParams.originStatus) {
    case OriginStatus.Enable:
      filteredOrigin.enabled = true;
      return;

    case OriginStatus.Disable:
      filteredOrigin.enabled = false;
      return;
  }
}

/**
 * Performs a PUT request to the Cloudfront REST API sending the given 'pool' object in the message body.
 * @param cloudflareParams The Cloudflare task params.
 * @param pool The Cloudflare pool object to send in the message body.
 */
async function updateAccountPool(cloudflareParams: CloudflareParams, pool: any): Promise<any[]> {
  const requestUrl = CloudflareUrlBuilder.buildUpdateAccountPoolUrl(cloudflareParams.accountId, pool.id);

  const requestOptions = {
    method: 'PUT',
    headers: {
      'X-Auth-Email': cloudflareParams.authEmail,
      'X-Auth-Key': cloudflareParams.authKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pool)
  };

  const response = await fetch(requestUrl, requestOptions)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data;
    });

  return response;
}

run();