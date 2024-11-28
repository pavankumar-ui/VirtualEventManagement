

 const DateValidator = (body,res)=>{
    const today = new Date();
          const eventDate = new Date(body.event_date);
        
        if(new Date(eventDate) < today)
            return res.status(400).json({"error": "Event date cannot be in the past date"});
}

module.exports = DateValidator;