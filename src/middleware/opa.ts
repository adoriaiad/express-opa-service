import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

interface PolicyResponse {
  result: Record<string, any>;
}

const BASE_URL = 'http://localhost:8181';

export async function opaClaims(req: Request, res: Response){
  const request = {
    input: req.body.input
  }
  const opauri = `${BASE_URL}/v1/data/claims`;

  try {
    const response: AxiosResponse<PolicyResponse> = await axios.post(
      opauri,
      request
    );

    res.status(200).json(response.data);

  } catch (error) {
    res.status(500).send(`Failed to evaluate policy: ${error}`);
  }
}

export async function opaJwtPolicy(req: Request, res: Response) {
  const policyRequest = {
    input: req.body.input,
  };

  const opaUrl = `${BASE_URL}/v1/data/jwtpolicy`;

  try {
    const response: AxiosResponse<PolicyResponse> = await axios.post(
      opaUrl,
      policyRequest
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Failed to evaluate policy: ${error}`);
    res.status(500).send('Failed to evaluate policy');
  }
}

export async function opaMyPolicy(req: Request, res: Response) {
  const opaUrl = `${BASE_URL}/v1/data/mypolicy`;
  const request = { input: req.body.input };
  try {
    const response: AxiosResponse<PolicyResponse> = await axios.post(
      opaUrl,
      request
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Failed to evaluate policy: ${error}`);
    res.status(500).send('Failed to evaluate policy');
  }
}

export async function opaRoles(req: Request, res: Response) {
  const opaUrl = `${BASE_URL}/v1/data/myroles`;
  const request = { input: req.body.input };

  try {
    const response: AxiosResponse<PolicyResponse> = await axios.post(
      opaUrl,
      JSON.stringify(request)
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Failed to evaluate policy: ${error}`);
    res.status(500).send('Failed to evaluate policy');
  }
}

export async function opaGetPolicies(req: Request, res: Response) {
  const opaUrl = `${BASE_URL}/v1/policies`;
  try {
    const response: AxiosResponse<PolicyResponse> = await axios.get(opaUrl);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`Failed to evaluate policy: ${error}`);
    res.status(500).send('Failed to evaluate policy');
  }
}
