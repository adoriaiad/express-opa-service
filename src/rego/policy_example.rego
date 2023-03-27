# policy.rego
#package name as you want
package policy

#rules
#allow può essere anche una stringa non per forza un boolean

#metto un default per avere un valore
default allow := false

allow {
  #qui metto le mie conditions

  #le conditions posso provenire da inout esterni
  # che recupero con input.user.roles[_] ad esempio

  input.user.roles[_] == "admin" #questa è una iteration
}

#################################################################################

# input.json
#possiamo creare un input file json:
# input.json
# che sarà così

{
  "user": {
    "username" : "mario",
    "roles": ["admin", "developer", "ecc" ]
  }
}

####################################################################################
# policy_test.rego
# il file di test potrebbe essere un policy_test.rego

package policy_test

import data.policy.allow #devo importare il file rego che devo testare e lo importo mettendo data. e il nome del package e la decision variable

test_allow_is_false_by_default {
  not allow
}

# comando per eseguire il test: $ opa test .

 test_allow_if_admin {
  allow with input as {
    "user": {
      "roles": ["admin"]
    }
  }
 }

 test_allow_if_not_admin {
  not allow with input as {
    "user": {
      "roles": ["developer"]
    }
  }
 }


