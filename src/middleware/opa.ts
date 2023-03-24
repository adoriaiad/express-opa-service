import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

interface PolicyResponse {
  result: Record<string, any>;
}

const BASE_URL = 'http://localhost:8181/v1/data';

export async function opaPostRequest(req: Request, res: Response, opaPath: string){
  const request = {
    input: req.body.input
  }
  const opauri = `${BASE_URL}/${opaPath}`;

  try {
    const response: AxiosResponse<PolicyResponse> = await axios.post(
      opauri,
      request
    );

    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send(`Failed to evaluate policy: ${error}`);
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
