db.getCollection('user').update(
    // query 
    {
        "phone" : "18958067917"
    },
    
    // update 
    {
        $set: {
            "group": "R"
        }
    },
    
    // options 
    {
        "multi" : false,  // update only one document 
        "upsert" : false  // insert a new document, if no existing document match the query 
    }
);