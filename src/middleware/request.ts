/* import { evaluateAccessPolicy } from "./opa";

export async function accessRequest() {
  const resource = 'my-resource';
  const action = 'read';

  try {
    const policyDecision = await evaluateAccessPolicy(resource, action);
    if (policyDecision.allow) {
      console.log(`OK - ${policyDecision.message}`);
    } else {
      console.log(`ACCESS DENIED - ${policyDecision.message}`);
    }
  } catch (error) {
    console.log(error);
  }
} */
