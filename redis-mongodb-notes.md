## MONGODB

*   When running a query, mongo creates a query object:
    *   Each query modifier(eg. find, where, limit, sort) returns a new query(somehow?)
    *   The final method called _.exec(callback)_ takes the composition query and executes it
        *   Before _.exec_ is called, check to see if query has been fetched by redis
        *   These 2 snippets are identical

```javascript
query.exec((err, result) => console.log(result))
```

```javascript
query.then(result => console.log(result))
```

# Need access to mongo's _.exec_ function to intercept with Redis!
