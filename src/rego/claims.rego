package iadengage.claims

import future.keywords.contains
import future.keywords.if
import future.keywords.in
import input.attributes.request.http as http_request

# assign false to allow variable on default
#default allow := false
default allow = {
  "allowed": false,
  "headers": {"x-ext-auth-allow": "no"},
  "body": "{\n    \"string\": \"Unauthorized Request\",\n    \"integer\": 1,\n    \"real number\": 2.5,\n    \"array\":[ \"string 1\", \"string 2\" ],\n    \"object\":{\"key\":\"value\"}\n}\n\n\n\n",
  "http_status": 403
}

engageuri := "https://logon.iad-engage.com/auth/realms/iadengage/protocol/openid-connect/certs"

#admin_roles := ["ROLE_ADMINISTRATOR", "ROLE_ADMIN"]
current_date := time.now_ns() / 1000000000

#allow {
#  is_valid
#  is_notexpired
#}

allow = response {
  http_request.method == "POST"
  is_valid
  is_notexpired
  response := {
      "allowed": true,
      "headers": {"X-Auth-User": claims["payload"].preferred_username}
  }
}

allow = response {
  not is_valid
  response := {
    "allowed": false,
    "headers": {"x-ext-auth-allow": "no"},
    "body": "{\n    \"string\": \"Unauthorized Request\",\n    \"integer\": 1,\n    \"real number\": 2.5,\n    \"array\":[ \"string 1\", \"string 2\" ],\n    \"object\":{\"key\":\"value\"}\n}\n\n\n\n",
    "http_status": 403
  }
}

allow = response {
  not is_notexpired
  response := {
   "allowed": false,
  "headers": {"x-ext-auth-allow": "no"},
  "body": "{\n    \"string\": \"Unauthorized Request\",\n    \"integer\": 1,\n    \"real number\": 2.5,\n    \"array\":[ \"string 1\", \"string 2\" ],\n    \"object\":{\"key\":\"value\"}\n}\n\n\n\n",
  "http_status": 401
  }
}

#is_admin if {
#    some role in claims["payload"].realm_access["roles"]
#    role in admin_roles
#}

is_valid :=  claims["isValid"]
exp := claims["payload"].exp

is_notexpired if {
  exp >= current_date
}

claims := {"payload": payload, "header": header, "isValid": isValid} if {
	jwks := jwks_request(engageuri).raw_body
	isValid := io.jwt.verify_rs256(bearer_token, jwks)
	[header, payload, _] := io.jwt.decode(bearer_token)
}

jwks_request(url) := http.send({
	"url": url,
	"method": "GET"
})

bearer_token := t if {
	v := http_request.headers.authorization
	startswith(v, "Bearer ")
	t := substring(v, count("Bearer "), -1)
}

send_response(status, message) := http.send({
    "status" : status,
    "headers": {"Content-Type": "application/json"},
    "body": {
      "message": message,
    }
})

