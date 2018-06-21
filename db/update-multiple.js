db.getCollection('user').update(
    // query 
    {
    },
    
    // update 
    {
        $set: {
            "contact": []
        }
    },
    
    // options 
    {
        "multi" : true,  // update only one document 
        "upsert" : false  // insert a new document, if no existing document match the query 
    }
);