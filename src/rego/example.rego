package mypolicy

default allow = false

allow {
  input.user == "alice"
  input.action == "read"
  input.resource == "document"
   http.send({
    "status" : 401,
    "headers": {"Content-Type": "application/json"},
    "body": {
      "message": "UNAUTHORIZED",
    }
  })
}

main = msg {
    msg := sprintf("hello %v", [input.user])
}
