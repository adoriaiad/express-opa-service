package myroles

import future.keywords.in
import future.keywords.if
import future.keywords.every

allowed_roles := ["GAMER", "ADMINISTRATOR"]

default allow := false

allow {
   is_allowed
}

is_allowed if {
    some role in input.subject.roles
    role in allowed_roles
}
