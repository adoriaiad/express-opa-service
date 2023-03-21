package claims

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# assign false to allow variable on default
default allow := false

engageuri := "https://logon.iad-engage.com/auth/realms/iadengage/protocol/openid-connect/certs"

admin_roles := ["ROLE_ADMINISTRATOR", "ROLE_ADMIN"]

#http 200 OK
allow := response {
  is_admin
  response :=  http.send({
    "status" : 401,
    "headers": {"Content-Type": "application/json"},
    "body": {
      "message": "OK",
    }
  })
}

#http 401 Unauthorized

#http 401 forbidden: TODO

is_admin if {
    some role in claims.realm_access["roles"]
    role in admin_roles
}

claims := payload if {
	jwks := jwks_request(engageuri).raw_body
	io.jwt.verify_rs256(bearer_token, jwks)
	[_, payload, _] := io.jwt.decode(bearer_token)
}

jwks_request(url) := http.send({
	"url": url,
	"method": "GET"
})

bearer_token := t if {
	v := input.attributes.request.http.headers.authorization
	startswith(v, "Bearer ")
	t := substring(v, count("Bearer "), -1)
}
