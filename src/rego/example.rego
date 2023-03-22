package mypolicy

default allow = false

allow {
  input.user == "alice"
  input.action == "read"
  not input.resource == "document"
}

main = msg {
    msg := sprintf("hello %v", [input.user])
}
