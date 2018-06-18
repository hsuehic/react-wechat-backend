db.getCollection('user').update(
    // query 
    {
        "userName" : "hsuehic2"
    },
    
    // update 
    {
        "phone": "18958067918"
    },
    
    // options 
    {
        "multi" : false,  // update only one document 
        "upsert" : true  // insert a new document, if no existing document match the query 
    }
);