#Installazione OPA su windows

- Download del .exe da https://openpolicyagent.org/downloads/latest/opa_windows_amd64.exe rinomina il file in opa.exe e salvalo in una cartella
- Apri "Advanced System Settings" dal Control Panel di windows
- Apri la scheda Environment Variables e selezionare Path da User variable for User e inserire la variabile di ambiente C:/opabook in cui salverai il file opa.exe
- verificare l'installazione lanciando l'exeguibile
- è comodo crearsi un alias ad esempio:
```sh
alias opa='C:/opabook/opa.exe'
```

lanciare un comando opa per verificare che tutto funzioni:
```sh
opa -h
```

#Installazione tramite Docker

```sh
docker pull openpolicyagent/opa
```

Run OPA as a server:
```sh
 docker run -p 8181:8181 openpolicyagent/opa \
    run --server --log-level debug
```

Test tha OPA is available
```sh
    curl -i localhost:8181/
```

Eseguire le query dal Terminale:

```sh
opa eval --data input.json 'x := data.x; x == "test"'
```

Creare o aggiornare una policy:
```sh
$ curl -X PUT http://localhost:8181/v1/policies/iadengage/claims --data-binary @claims.rego
$ curl -X PUT http://localhost:8181/v1/policies/iadengage/policy --data-binary @policy.rego
```

Avviare il servizio ts-opa-service per testare le chiamate
```sh
npm start
```
