db.getCollection('user').update(
    // query 
    {
        "userName" : "hsuehic"
    },
    
    // update 
    {   
        $set: {
            "nick": "少伯"
        }
    },
    
    // options 
    {
        "multi" : false,  // update only one document 
        "upsert" : false  // insert a new document, if no existing document match the query 
    }
);