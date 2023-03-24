package mypolicy

default allow := false
default response := {
  "message": "Access denied"
}

allow = response {
  input.user == "alice"
  input.action == "read"
  input.resource == "document"
  response := {
    "message": "Access granted"
  }
}

main = {
  "allow": allow,
  "response": response
}
