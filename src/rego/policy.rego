package iadengage.policy

import data.iadengage.claims
import future.keywords.in
import future.keywords.if

default allow := false
allowed_roles := ["GAMER", "ADMINISTRATOR"]

allow {
  is_claims_valid
  is_allowed
}

is_claims_valid {
  data.iadengage.claims.allow.allowed
}

is_allowed if {
    some role in input.subject.roles
    role in allowed_roles
}




