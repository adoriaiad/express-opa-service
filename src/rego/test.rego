package jwtpolicy

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# assign false to allow variable on default
default allow := false
engageuri := "https://logon.iad-engage.com/auth/realms/iadengage/protocol/openid-connect/certs"

admin_roles := ["ROLE_ADMINISTRATOR", "ROLE_ADMIN"]
user_roles := ["ROLE_USER", "ROLE_GAMER"]

allow if {
	is_post
	is_dogs
	#is_user
	is_admin
}

is_post if input.attributes.request.http.method == "POST"
is_dogs if input.attributes.request.http.path == "/pets/dogs"
#is_user if claims.preferred_username == "adoria"
is_admin if {
    some role in claims.realm_access["roles"]
    role in user_roles
}

claims := payload if {
	jwks := jwks_request(engageuri).raw_body
	io.jwt.verify_rs256(bearer_token, jwks)
	[_, payload, _] := io.jwt.decode(bearer_token)
}

jwks_request(url) := http.send({
	"url": url,
	"method": "GET",
	"force_cache": true,
	"force_cache_duration_seconds": 3600, # Cache response for an hour
})

bearer_token := t if {
	v := input.attributes.request.http.headers.authorization
	startswith(v, "Bearer ")
	t := substring(v, count("Bearer "), -1)
}
