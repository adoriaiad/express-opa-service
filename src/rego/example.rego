package mypolicy

default allow = false

allow {
  input.user == "alice"
  input.action == "read"
  input.resource == "document"
}

main = msg {
    msg := sprintf("hello %v", [input.user])
}
