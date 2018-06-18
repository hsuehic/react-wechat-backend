db.getCollection('user').update(
    // query 
    {
        "phone" : "18958067917"
    },
    
    // update 
    {
        $set: {
            "region": "+86",
            "email": "hsuehic@163.com"
        }
    },
    
    // options 
    {
        "multi" : false,  // update only one document 
        "upsert" : false  // insert a new document, if no existing document match the query 
    }
);